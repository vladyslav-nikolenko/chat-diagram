const express = require('express');
const cors = require('cors');
//const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000; // Your backend runs on port 3000

// --- Middleware ---
app.use(cors()); // Allows your React app (on port 5173) to call this server
app.use(express.json()); // Allows the server to read JSON from the request body
function getLargeMockArchitecture(provider) {
  return {
    // --- 1. GROUPS ---
    // (Translated from your 'type: "group"' nodes)
    groups: [
      { id: "group-web-console", label: "Web Console" },
      { id: "group-rest-api", label: "REST API" },
      { id: "group-image-pipeline", label: "Image Pipeline" },
      { id: "group-load-testing", label: "Load Testing Engine" }
    ],

    // --- 2. SERVICES ---
    // (Translated from your 'type: "custom"' nodes, with 'groupId' added)
    services: [
      // Web Console Services
      {
        id: "cloudfront",
        label: "Amazon CloudFront",
        description: "CDN",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/CloudFront.svg",
        type: "custom",
        groupId: "group-web-console"
      },
      {
        id: "s3-web",
        label: "Amazon S3",
        description: "Static Assets",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
        type: "custom",
        groupId: "group-web-console"
      },
      // REST API Services
      {
        id: "api-gateway",
        label: "Amazon API Gateway",
        description: "REST API",
        iconUrl: "https://icon.icepanel.io/AWS/svg/App-Integration/API-Gateway.svg",
        type: "custom",
        groupId: "group-rest-api"
      },
      {
        id: "lambda",
        label: "AWS Lambda",
        description: "Functions",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg",
        type: "custom",
        groupId: "group-rest-api"
      },
      {
        id: "cognito",
        label: "Amazon Cognito",
        description: "Auth",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Cognito.svg",
        type: "custom",
        groupId: "group-rest-api"
      },
      {
        id: "iam",
        label: "AWS IAM",
        description: "Permissions",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Identity-and-Access-Management.svg",
        type: "custom",
        groupId: "group-rest-api"
      },
      // Image Pipeline Services
      {
        id: "docker-image",
        label: "Taurus Docker Image",
        description: "Container",
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        type: "custom",
        groupId: "group-image-pipeline"
      },
      {
        id: "s3-artifacts",
        label: "Amazon S3",
        description: "Artifacts",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
        type: "custom",
        groupId: "group-image-pipeline"
      },
      {
        id: "code-build",
        label: "AWS CodeBuild",
        description: "Build",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Developer-Tools/CodeBuild.svg",
        type: "custom",
        groupId: "group-image-pipeline"
      },
      // Load Testing Engine Services
      {
        id: "s3-test-data",
        label: "Amazon S3",
        description: "Test Data",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
        type: "custom",
        groupId: "group-load-testing"
      },
      {
        id: "lambda-orchestration",
        label: "AWS Lambda",
        description: "Orchestration",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg",
        type: "custom",
        groupId: "group-load-testing"
      },
      {
        id: "dynamodb",
        label: "Amazon DynamoDB",
        description: "NoSQL DB",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg",
        type: "custom",
        groupId: "group-load-testing"
      },
      {
        id: "sqs",
        label: "Amazon SQS",
        description: "Queue",
        iconUrl: "https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Queue-Service.svg",
        type: "custom",
        groupId: "group-load-testing"
      },
      {
        id: "fargate",
        label: "AWS Fargate",
        description: "Container",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Containers/Fargate.svg",
        type: "custom",
        groupId: "group-load-testing"
      },
      {
        id: "ecr",
        label: "Amazon ECR",
        description: "Registry",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Containers/Elastic-Container-Registry.svg",
        type: "custom",
        groupId: "group-load-testing"
      },
      {
        id: "cloudwatch",
        label: "Amazon CloudWatch",
        description: "Monitoring",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Management-Governance/CloudWatch.svg",
        type: "custom",
        groupId: "group-load-testing"
      }
    ],

    // --- 3. CONNECTIONS ---
    // (Translated from your original 'initialEdges')
    connections: [
      { id: "web-1", sourceId: "cloudfront", targetId: "s3-web" },
      { id: "web-to-api", sourceId: "cloudfront", targetId: "api-gateway" },
      { id: "api-1", sourceId: "api-gateway", targetId: "lambda" },
      { id: "api-2", sourceId: "api-gateway", targetId: "cognito" },
      { id: "api-3", sourceId: "cognito", targetId: "iam" },
      { id: "img-1", sourceId: "docker-image", targetId: "s3-artifacts" },
      { id: "img-2", sourceId: "s3-artifacts", targetId: "code-build" },
      { id: "img-4", sourceId: "code-build", targetId: "ecr" },
      { id: "load-1", sourceId: "lambda-orchestration", targetId: "s3-test-data" },
      { id: "load-2", sourceId: "lambda-orchestration", targetId: "dynamodb" },
      { id: "load-3", sourceId: "dynamodb", targetId: "lambda-orchestration" }, // Bidirectional
      { id: "load-4", sourceId: "sqs", targetId: "lambda-orchestration" },
      { id: "load-5", sourceId: "lambda-orchestration", targetId: "fargate" },
      { id: "load-6", sourceId: "fargate", targetId: "ecr" },
      { id: "load-7", sourceId: "ecr", targetId: "fargate" }, // Bidirectional
      { id: "load-8", sourceId: "fargate", targetId: "cloudwatch" },
      { id: "api-to-load-1", sourceId: "lambda", targetId: "lambda-orchestration" },
      { id: "api-to-load-2", sourceId: "api-gateway", targetId: "sqs" }
    ],

    // --- 4. PRICING ---
    // (New mock pricing based on this larger architecture)
    pricing: [
      { service: "AWS Fargate", description: "Container (t3.medium)", cost: "$80.50" },
      { service: "AWS Lambda", description: "Orchestration & Functions", cost: "$15.00" },
      { service: "DynamoDB", description: "On-Demand Capacity", cost: "$45.00" },
      { service: "CloudFront / S3", description: "CDN & Storage", cost: "$30.00" },
      { service: "API Gateway", description: "REST API Requests", cost: "$5.00" },
      { service: "Cognito & IAM", description: "Auth & Permissions", cost: "$0.00" },
      { service: "Developer Tools", description: "CodeBuild, ECR", cost: "$5.50" },
      { service: "Monitoring", description: "CloudWatch, SQS", cost: "$12.00" }
    ],
    totalCost: "$193.00 / mo"
  };
}

// --- Main API Endpoint ---
app.post('/api/generate-architecture', async (req, res) => {
  // Log what we received from the frontend
  console.log('Received request at /api/generate-architecture');
  console.log('Request body:', req.body);

  const { provider, prompt } = req.body;

try {
    //const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const promptRun = `
      Act as a Cloud Architect.
      Generate a AWS Cloud architecture diagram for the following use case: 
      ${prompt}

      You must return ONLY a JSON object.
      The JSON structure must be:
      {
        "groups": [
          { "id": "group-public", "label": "Name of Group"},
        ],
        "services": [
            {
            id: "alb",
            label: "Application Load Balancer",
            description: "Traffic Entry",
            iconUrl: "https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Elastic-Load-Balancing.svg",
            type: "custom",
            groupId: "group-public"
          },
        ],
        "connections": [
          { id: "conn-1", sourceId: "alb", targetId: "ec2-app", label: "HTTP Traffic" },
        ],
        "pricing": [
           { service: "Amazon RDS (MySQL)", description: "db.t3.medium (Multi-AZ)", cost: "$136.00" },
        ],
        totalCost: "$238.50 / mo"
      }
    `;
    const ai = new GoogleGenAI({
      apiKey: ""
    });
     const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: promptRun,
      config: {
        responseMimeType: "application/json"
      }
    });
    debugger;
  console.log(response);
    // const result = await model.generateContent(prompt);
    // const response = await result.response;
    // let text = response.text();
    let jsonString = response.text || response.candidates[0].content.parts[0].text;
    const architectureData = JSON.parse(jsonString);
    res.json(architectureData);
    
    // const mockData = getLargeMockArchitecture(response);
    // res.json(mockData);
  } catch (error) {
    console.error("Error generating architecture:", error);
    res.status(500).json({ 
      error: "Failed to generate architecture", 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server successfully started at http://localhost:${PORT}`);
  console.log('Waiting for requests at /api/generate-architecture ...');
});