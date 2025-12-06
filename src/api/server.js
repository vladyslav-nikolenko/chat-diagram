const express = require('express');
const cors = require('cors');
const { DiagramPrompt, PricingPrompt, AWS_SERVICES } = require('./constant');

const app = express();
const PORT = 3000; // Your backend runs on port 3000

// --- Middleware ---
app.use(cors()); // Allows your React app (on port 5173) to call this server
app.use(express.json()); // Allows the server to read JSON from the request body

// --- Helpers ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function ensureEnv() {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment');
  }
}

function extractJsonFromText(text) {
  if (!text || typeof text !== 'string') return null;
  // Try plain JSON first
  try {
    return JSON.parse(text);
  } catch (_) {}
  // Try to extract JSON between code fences or first/last braces
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenceMatch ? fenceMatch[1] : (() => {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      return text.slice(first, last + 1);
    }
    return null;
  })();
  if (!candidate) return null;
  try {
    return JSON.parse(candidate);
  } catch (e) {
    return null;
  }
}

async function callOpenAI(messages) {
  ensureEnv();
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.2,
    }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`OpenAI API error ${resp.status}: ${t}`);
  }
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || '';
  return content;
}

function normalizePricing(pricingJson) {
  const pricing = Array.isArray(pricingJson?.pricing) ? pricingJson.pricing : [];
  const totalEstimatedCost = pricingJson?.totalEstimatedCost || pricingJson?.total || pricingJson?.totalCost;
  let totalCost = typeof totalEstimatedCost === 'string' ? totalEstimatedCost : '';
  if (totalCost && !/\/\s*mo/i.test(totalCost)) {
    totalCost = `${totalCost} / mo`;
  }
  return { pricing, totalCost: totalCost || '' };
}

// --- Main API Endpoint ---
app.post('/api/generate-architecture', async (req, res) => {
  try {
    console.log('Received request at /api/generate-architecture');
    const { prompt, provider, config } = req.body || {};

    const userContext = {
      provider: provider || 'aws',
      requirements: prompt || '',
      config: config || {},
      now: new Date().toISOString(),
    };

    // 1) Ask for architecture JSON
    const diagramMessages = [
      { role: 'system', content: DiagramPrompt },
      { role: 'user', content: `User requirements and context (JSON):\n${JSON.stringify(userContext, null, 2)}\n\nReturn only valid JSON.` },
    ];

    const archContent = await callOpenAI(diagramMessages);
    const architecture = extractJsonFromText(archContent);
    if (!architecture || !Array.isArray(architecture.groups) || !Array.isArray(architecture.services) || !Array.isArray(architecture.connections)) {
      throw new Error('Failed to parse architecture JSON from AI response');
    }

    // Post-process: attach icons and normalize types based on curated AWS services
    try {
      const idToService = new Map();
      const nameToService = new Map();
      const aliasToService = new Map();
      for (const svc of AWS_SERVICES) {
        if (svc.id) idToService.set(String(svc.id).toLowerCase(), svc);
        nameToService.set(svc.name.toLowerCase(), svc);
        if (Array.isArray(svc.aliases)) {
          for (const a of svc.aliases) aliasToService.set(String(a).toLowerCase(), svc);
        }
      }
      const resolveByLabelOrAlias = (label) => {
        if (!label) return null;
        const key = String(label).toLowerCase().trim();
        return (nameToService.get(key) || aliasToService.get(key)) || null;
      };
      const needsIcon = (iconUrl) => {
        if (!iconUrl) return true;
        const s = String(iconUrl);
        return !(s.startsWith('/icons/') || s.startsWith('http://') || s.startsWith('https://'));
      };

      architecture.services = (architecture.services || []).map((srv) => {
        let match = null;
        if (srv.serviceId) {
          const idKey = String(srv.serviceId).toLowerCase().trim();
          match = idToService.get(idKey) || null;
        }
        if (!match) {
          match = resolveByLabelOrAlias(srv.label) || resolveByLabelOrAlias(srv?.name) || null;
        }
        if (match && needsIcon(srv.iconUrl)) {
          srv.iconUrl = match.iconPath;
        }
        if (!srv.type) srv.type = 'custom';
        return srv;
      });
    } catch (e) {
      console.warn('Post-processing services failed:', e);
    }

    // 2) Ask for pricing JSON within the same context (include previous assistant message)
    const pricingMessages = [
      { role: 'system', content: DiagramPrompt },
      { role: 'user', content: `User requirements and context (JSON):\n${JSON.stringify(userContext, null, 2)}` },
      { role: 'assistant', content: JSON.stringify(architecture) },
      { role: 'system', content: PricingPrompt },
      { role: 'user', content: 'Provide monthly pricing JSON for the above architecture. Return only valid JSON.' },
    ];

    const pricingContent = await callOpenAI(pricingMessages);
    const pricingJson = extractJsonFromText(pricingContent);
    if (!pricingJson || !Array.isArray(pricingJson.pricing)) {
      throw new Error('Failed to parse pricing JSON from AI response');
    }

    const { pricing, totalCost } = normalizePricing(pricingJson);

    const response = {
      groups: architecture.groups || [],
      services: architecture.services || [],
      connections: architecture.connections || [],
      pricing,
      totalCost: totalCost || '',
    };

    res.json(response);
  } catch (err) {
    console.error('Error in /api/generate-architecture:', err);
    res.status(502).json({ error: 'Failed to generate architecture/pricing', details: String(err?.message || err) });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server successfully started at http://localhost:${PORT}`);
  console.log('Waiting for requests at /api/generate-architecture ...');
});