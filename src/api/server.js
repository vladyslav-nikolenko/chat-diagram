const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000; // Your backend runs on port 3000

// --- Middleware ---
app.use(cors()); // Allows your React app (on port 5173) to call this server
app.use(express.json()); // Allows the server to read JSON from the request body

/**
 * Generates the large, specific mock architecture.
 * We've translated your 'initialNodes' and 'initialEdges' into this structure.
 */
function getLargeMockArchitecture(provider) {
  // We ignore the provider for now, but this is where you could add logic
  
  return {
    // --- 1. GROUPS ---
    // Logical separation of your Hybrid Architecture
    groups: [
      { id: "group-public", label: "Public Layer (VPC)" },
      { id: "group-core", label: "Core Application (Monolith)" },
      { id: "group-sim-engine", label: "Simulation Engine (Serverless)" },
      { id: "group-data", label: "Data & Storage Persistence" }
    ],

    // --- 2. SERVICES ---
    services: [
      // -- Group: Public Layer --
      {
        id: "alb",
        label: "Application Load Balancer",
        description: "Traffic Entry",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Elastic-Load-Balancing.svg",
        type: "custom",
        groupId: "group-public"
      },
      {
        id: "cognito",
        label: "Amazon Cognito",
        description: "User Auth",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Cognito.svg",
        type: "custom",
        groupId: "group-public"
      },

      // -- Group: Core Application (EC2 Monolith) --
      {
        id: "ec2-app",
        label: "Amazon EC2",
        description: "Core Business Logic",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Compute/EC2.svg",
        type: "custom",
        groupId: "group-core"
      },
      {
        id: "secrets-manager",
        label: "AWS Secrets Manager",
        description: "DB Credentials",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Secrets-Manager.svg",
        type: "custom",
        groupId: "group-core"
      },

      // -- Group: Simulation Engine (The Async Workers) --
      {
        id: "sqs",
        label: "Amazon SQS",
        description: "Job Queue",
        iconUrl: "https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Queue-Service.svg",
        type: "custom",
        groupId: "group-sim-engine"
      },
      {
        id: "lambda-worker",
        label: "AWS Lambda",
        description: "Math/Sim Worker",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg",
        type: "custom",
        groupId: "group-sim-engine"
      },
      {
        id: "sns",
        label: "Amazon SNS",
        description: "Notifications",
        iconUrl: "https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Notification-Service.svg",
        type: "custom",
        groupId: "group-sim-engine"
      },

      // -- Group: Data Layer --
      {
        id: "rds-mysql",
        label: "Amazon RDS",
        description: "MySQL Primary DB",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Database/RDS.svg",
        type: "custom",
        groupId: "group-data"
      },
      {
        id: "redis",
        label: "Amazon ElastiCache",
        description: "Redis Session/Cache",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Database/ElastiCache.svg",
        type: "custom",
        groupId: "group-data"
      },
      {
        id: "s3-storage",
        label: "Amazon S3",
        description: "Assets & Reports",
        iconUrl: "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
        type: "custom",
        groupId: "group-data"
      }
    ],

    // --- 3. CONNECTIONS ---
    // Mapping the data flow described in the design
    connections: [
      // Ingress
      { id: "conn-1", sourceId: "alb", targetId: "ec2-app", label: "HTTP Traffic" },
      { id: "conn-2", sourceId: "ec2-app", targetId: "cognito", label: "Verify Token" },

      // Core Monolith Dependencies
      { id: "conn-3", sourceId: "ec2-app", targetId: "rds-mysql", label: "CRUD User Data" },
      { id: "conn-4", sourceId: "ec2-app", targetId: "redis", label: "Session State" },
      { id: "conn-5", sourceId: "ec2-app", targetId: "secrets-manager", label: "Fetch Creds" },
      { id: "conn-6", sourceId: "ec2-app", targetId: "s3-storage", label: "Upload/Read Assets" },

      // The Simulation Offload (The "Decoupled" Magic)
      { id: "conn-7", sourceId: "ec2-app", targetId: "sqs", label: "Enqueue Sim Job" },
      { id: "conn-8", sourceId: "sqs", targetId: "lambda-worker", label: "Trigger Processing" },
      
      // Worker Logic
      { id: "conn-9", sourceId: "lambda-worker", targetId: "rds-mysql", label: "Write Financials" },
      { id: "conn-10", sourceId: "lambda-worker", targetId: "sns", label: "Job Complete" },
      { id: "conn-11", sourceId: "sns", targetId: "s3-storage", label: "Save PDF Report" }
    ],

    // --- 4. PRICING ---
    // Estimated costs for a startup-sized workload
    pricing: [
      { service: "Amazon RDS (MySQL)", description: "db.t3.medium (Multi-AZ)", cost: "$136.00" },
      { service: "Amazon EC2 + ALB", description: "2x t3.small + Load Balancer", cost: "$60.00" },
      { service: "Amazon ElastiCache", description: "cache.t3.micro (Redis)", cost: "$17.00" },
      { service: "AWS Lambda & SQS", description: "Simulation Compute (On-demand)", cost: "$12.50" },
      { service: "Amazon S3", description: "Storage & Requests", cost: "$5.00" },
      { service: "Amazon Cognito", description: "MAU < 50,000 (Free Tier)", cost: "$0.00" },
      { service: "Secrets & CloudWatch", description: "Management Tools", cost: "$8.00" }
    ],
    totalCost: "$238.50 / mo"
};
}

// --- Main API Endpoint ---
app.post('/api/generate-architecture', (req, res) => {
  // Log what we received from the frontend
  console.log('Received request at /api/generate-architecture');
  console.log('Request body:', req.body);

  const { provider } = req.body;

  // Get our new, large mock data
  const mockData = getLargeMockArchitecture(provider);

  // Simulate network delay (as if AI is thinking)
  setTimeout(() => {
    // Return mock data as JSON
    res.json(mockData);
  }, 1000); // 1 second
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server successfully started at http://localhost:${PORT}`);
  console.log('Waiting for requests at /api/generate-architecture ...');
});