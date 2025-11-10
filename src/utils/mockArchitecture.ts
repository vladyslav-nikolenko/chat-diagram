import { ArchitectureData } from "../components/CloudArchitecturePlanner";

export function generateMockArchitecture(
  provider: string,
  expectedLoad: string,
  avgUsers: string,
  storageNeeds: string
): ArchitectureData {
  // Parse user requirements to determine architecture complexity
  const needsHighScalability = expectedLoad.toLowerCase().includes("high") || 
                               parseInt(avgUsers) > 10000;
  const needsDatabase = true; // Most apps need a database
  const needsStorage = storageNeeds.toLowerCase().includes("gb") || 
                       storageNeeds.toLowerCase().includes("storage");

  if (provider === "aws") {
    return generateAWSArchitecture(needsHighScalability, needsDatabase, needsStorage);
  } else if (provider === "azure") {
    return generateAzureArchitecture(needsHighScalability, needsDatabase, needsStorage);
  } else {
    return generateGCPArchitecture(needsHighScalability, needsDatabase, needsStorage);
  }
}

function generateAWSArchitecture(
  needsHighScalability: boolean,
  needsDatabase: boolean,
  needsStorage: boolean
): ArchitectureData {
  // Complex architecture based on the example image with better spacing
  const nodes = [
    // Top row - CDN and Storage
    {
      id: "1",
      type: "service",
      position: { x: 120, y: 90 },
      data: { 
        label: "CloudFront", 
        icon: "🌐", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/CloudFront.svg",
        description: "CDN" 
      },
    },
    {
      id: "2",
      type: "service",
      position: { x: 280, y: 90 },
      data: { 
        label: "Amazon S3", 
        icon: "🪣", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
        description: "Static Assets" 
      },
    },
    {
      id: "7",
      type: "service",
      position: { x: 440, y: 90 },
      data: { 
        label: "Docker Image", 
        icon: "🐳", 
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        description: "Taurus" 
      },
    },
    {
      id: "12",
      type: "service",
      position: { x: 600, y: 90 },
      data: { 
        label: "Amazon S3", 
        icon: "🪣", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
        description: "Artifacts" 
      },
    },
    
    // Second row
    {
      id: "3",
      type: "service",
      position: { x: 120, y: 220 },
      data: { 
        label: "Lambda", 
        icon: "⚡", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg",
        description: "Functions" 
      },
    },
    {
      id: "8",
      type: "service",
      position: { x: 440, y: 220 },
      data: { 
        label: "Amazon S3", 
        icon: "🪣", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
        description: "Test Data" 
      },
    },
    {
      id: "11",
      type: "service",
      position: { x: 600, y: 220 },
      data: { 
        label: "Lambda", 
        icon: "⚡", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg",
        description: "Orchestration" 
      },
    },
    
    // Third row
    {
      id: "4",
      type: "service",
      position: { x: 120, y: 350 },
      data: { 
        label: "API Gateway", 
        icon: "🚪", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/App-Integration/API-Gateway.svg",
        description: "REST API" 
      },
    },
    {
      id: "9",
      type: "service",
      position: { x: 440, y: 350 },
      data: { 
        label: "DynamoDB", 
        icon: "💾", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg",
        description: "NoSQL DB" 
      },
    },
    {
      id: "14",
      type: "service",
      position: { x: 760, y: 350 },
      data: { 
        label: "Fargate", 
        icon: "🚢", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Containers/Fargate.svg",
        description: "Container" 
      },
    },
    
    // Fourth row
    {
      id: "5",
      type: "service",
      position: { x: 120, y: 480 },
      data: { 
        label: "Cognito", 
        icon: "👤", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Cognito.svg",
        description: "Auth" 
      },
    },
    {
      id: "6",
      type: "service",
      position: { x: 280, y: 480 },
      data: { 
        label: "IAM", 
        icon: "🔐", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Identity-and-Access-Management.svg",
        description: "Permissions" 
      },
    },
    {
      id: "10",
      type: "service",
      position: { x: 440, y: 480 },
      data: { 
        label: "SQS", 
        icon: "📬", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Queue-Service.svg",
        description: "Queue" 
      },
    },
    
    // Right side services
    {
      id: "13",
      type: "service",
      position: { x: 760, y: 90 },
      data: { 
        label: "CodeBuild", 
        icon: "🔨", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Developer-Tools/CodeBuild.svg",
        description: "CI/CD" 
      },
    },
    {
      id: "15",
      type: "service",
      position: { x: 920, y: 220 },
      data: { 
        label: "ECR", 
        icon: "📦", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Containers/Elastic-Container-Registry.svg",
        description: "Registry" 
      },
    },
    {
      id: "16",
      type: "service",
      position: { x: 920, y: 480 },
      data: { 
        label: "CloudWatch", 
        icon: "📊", 
        iconUrl: "https://icon.icepanel.io/AWS/svg/Management-Governance/CloudWatch.svg",
        description: "Monitoring" 
      },
    },
  ];

  const edges = [
    // Web Console
    { id: "e1-2", source: "1", target: "2" },
    { id: "e1-4", source: "1", target: "4" },
    
    // REST API connections
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" },
    { id: "e5-6", source: "5", target: "6" },
    
    // Image Pipeline
    { id: "e7-12", source: "7", target: "12" },
    { id: "e12-13", source: "12", target: "13" },
    
    // Load Testing connections
    { id: "e3-11", source: "3", target: "11" },
    { id: "e8-11", source: "8", target: "11" },
    { id: "e9-11", source: "9", target: "11" },
    { id: "e11-10", source: "11", target: "10" },
    { id: "e10-14", source: "10", target: "14" },
    { id: "e11-14", source: "11", target: "14" },
    { id: "e13-14", source: "13", target: "14" },
    { id: "e14-15", source: "14", target: "15" },
    { id: "e14-16", source: "14", target: "16" },
  ];

  const pricing = [
    { service: "CloudFront", description: "CDN & data transfer", cost: "$25/mo" },
    { service: "S3", description: "Object storage (3 buckets)", cost: "$18/mo" },
    { service: "API Gateway", description: "1M API calls", cost: "$3.50/mo" },
    { service: "Lambda", description: "2M invocations", cost: "$16/mo" },
    { service: "Cognito", description: "User pool", cost: "$0/mo" },
    { service: "IAM", description: "Identity management", cost: "$0/mo" },
    { service: "CodeBuild", description: "100 build minutes", cost: "$1/mo" },
    { service: "DynamoDB", description: "On-demand", cost: "$25/mo" },
    { service: "SQS", description: "1M requests", cost: "$0.40/mo" },
    { service: "Fargate", description: "0.25 vCPU, 0.5GB", cost: "$12/mo" },
    { service: "ECR", description: "Container registry", cost: "$1/mo" },
    { service: "CloudWatch", description: "Logs & metrics", cost: "$10/mo" },
  ];

  const totalCost = pricing.reduce((sum, item) => {
    return sum + parseFloat(item.cost.replace(/[^0-9.]/g, ""));
  }, 0);

  return {
    nodes,
    edges,
    pricing,
    totalCost: `$${totalCost.toFixed(2)}/mo`,
  };
}

function generateAzureArchitecture(
  needsHighScalability: boolean,
  needsDatabase: boolean,
  needsStorage: boolean
): ArchitectureData {
  const nodes = [
    {
      id: "1",
      type: "service",
      position: { x: 150, y: 100 },
      data: { 
        label: "Front Door", 
        icon: "🚪", 
        iconUrl: "https://symbols.getvecta.com/stencil_85/50_front-door.44be229c3f.svg",
        description: "CDN" 
      },
    },
    {
      id: "2",
      type: "service",
      position: { x: 150, y: 260 },
      data: { 
        label: "DNS Zone", 
        icon: "🔀", 
        iconUrl: "https://symbols.getvecta.com/stencil_85/31_dns-zones.e8bb940148.svg",
        description: "DNS" 
      },
    },
    {
      id: "3",
      type: "service",
      position: { x: 380, y: 180 },
      data: { 
        label: "App Gateway", 
        icon: "⚖️", 
        iconUrl: "https://symbols.getvecta.com/stencil_85/16_application-gateway.c3cb0e0dd7.svg",
        description: "Load Balancer" 
      },
    },
    {
      id: "4",
      type: "service",
      position: { x: 600, y: 100 },
      data: { 
        label: "VM Scale Set", 
        icon: "📈", 
        iconUrl: "https://symbols.getvecta.com/stencil_85/152_virtual-machine-scale-sets.74bbba934f.svg",
        description: "Compute" 
      },
    },
    {
      id: "5",
      type: "service",
      position: { x: 600, y: 260 },
      data: { 
        label: "Functions", 
        icon: "⚡", 
        iconUrl: "https://symbols.getvecta.com/stencil_85/51_function-app.f8f0a0d370.svg",
        description: "Serverless" 
      },
    },
  ];

  const edges = [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e3-5", source: "3", target: "5" },
  ];

  const pricing = [
    { service: "Front Door", description: "Data transfer", cost: "$28/mo" },
    { service: "DNS Zone", description: "Hosted zone", cost: "$5/mo" },
    { service: "App Gateway", description: "Load balancer", cost: "$25/mo" },
    { service: "VM Scale Set", description: "Standard_B2s x2", cost: "$55/mo" },
    { service: "Functions", description: "1M executions", cost: "$7/mo" },
  ];

  if (needsDatabase) {
    nodes.push({
      id: "6",
      type: "service",
      position: { x: 820, y: 100 },
      data: { 
        label: "SQL Database", 
        icon: "💾", 
        iconUrl: "https://symbols.getvecta.com/stencil_85/130_sql-database.3e0573a043.svg",
        description: "Azure SQL" 
      },
    });
    edges.push({ id: "e4-6", source: "4", target: "6" });
    edges.push({ id: "e5-6", source: "5", target: "6" });
    pricing.push({ service: "SQL Database", description: "Basic tier", cost: "$62/mo" });
  }

  if (needsStorage) {
    nodes.push({
      id: "7",
      type: "service",
      position: { x: 820, y: 260 },
      data: { 
        label: "Blob Storage", 
        icon: "🪣", 
        iconUrl: "https://symbols.getvecta.com/stencil_85/127_storage-accounts.f43855fb57.svg",
        description: "Hot tier" 
      },
    });
    edges.push({ id: "e5-7", source: "5", target: "7" });
    pricing.push({ service: "Blob Storage", description: "500GB hot", cost: "$10/mo" });
  }

  if (needsHighScalability) {
    nodes.push({
      id: "8",
      type: "service",
      position: { x: 600, y: 420 },
      data: { 
        label: "Redis Cache", 
        icon: "⚡", 
        iconUrl: "https://symbols.getvecta.com/stencil_85/18_azure-cache-redis.5e92f9f5fa.svg",
        description: "Cache" 
      },
    });
    edges.push({ id: "e4-8", source: "4", target: "8" });
    pricing.push({ service: "Redis Cache", description: "Basic C0", cost: "$17/mo" });
  }

  const totalCost = pricing.reduce((sum, item) => {
    return sum + parseFloat(item.cost.replace(/[^0-9.]/g, ""));
  }, 0);

  return {
    nodes,
    edges,
    pricing,
    totalCost: `$${totalCost.toFixed(0)}/mo`,
  };
}

function generateGCPArchitecture(
  needsHighScalability: boolean,
  needsDatabase: boolean,
  needsStorage: boolean
): ArchitectureData {
  const nodes = [
    {
      id: "1",
      type: "service",
      position: { x: 150, y: 100 },
      data: { 
        label: "Cloud CDN", 
        icon: "🌐", 
        iconUrl: "https://symbols.getvecta.com/stencil_28/19_cloud-cdn.3a0e63a025.svg",
        description: "CDN" 
      },
    },
    {
      id: "2",
      type: "service",
      position: { x: 150, y: 260 },
      data: { 
        label: "Cloud DNS", 
        icon: "🔀", 
        iconUrl: "https://symbols.getvecta.com/stencil_28/20_cloud-dns.2795565734.svg",
        description: "DNS" 
      },
    },
    {
      id: "3",
      type: "service",
      position: { x: 380, y: 180 },
      data: { 
        label: "Load Balancer", 
        icon: "⚖️", 
        iconUrl: "https://symbols.getvecta.com/stencil_28/24_cloud-load-balancing.c78db70f42.svg",
        description: "HTTPS LB" 
      },
    },
    {
      id: "4",
      type: "service",
      position: { x: 600, y: 100 },
      data: { 
        label: "Compute Engine", 
        icon: "📈", 
        iconUrl: "https://symbols.getvecta.com/stencil_28/41_compute-engine.8b47b27f71.svg",
        description: "MIG" 
      },
    },
    {
      id: "5",
      type: "service",
      position: { x: 600, y: 260 },
      data: { 
        label: "Cloud Functions", 
        icon: "⚡", 
        iconUrl: "https://symbols.getvecta.com/stencil_28/22_cloud-functions.d2a9e0d0ff.svg",
        description: "Serverless" 
      },
    },
  ];

  const edges = [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e3-5", source: "3", target: "5" },
  ];

  const pricing = [
    { service: "Cloud CDN", description: "Data transfer", cost: "$22/mo" },
    { service: "Cloud DNS", description: "Managed zone", cost: "$2/mo" },
    { service: "Load Balancer", description: "Forwarding rules", cost: "$20/mo" },
    { service: "Compute Engine", description: "n1-standard-2 x2", cost: "$52/mo" },
    { service: "Cloud Functions", description: "1M invocations", cost: "$5/mo" },
  ];

  if (needsDatabase) {
    nodes.push({
      id: "6",
      type: "service",
      position: { x: 820, y: 100 },
      data: { 
        label: "Cloud SQL", 
        icon: "💾", 
        iconUrl: "https://symbols.getvecta.com/stencil_28/27_cloud-sql.fc209714e0.svg",
        description: "PostgreSQL" 
      },
    });
    edges.push({ id: "e4-6", source: "4", target: "6" });
    edges.push({ id: "e5-6", source: "5", target: "6" });
    pricing.push({ service: "Cloud SQL", description: "db-n1-standard-1", cost: "$58/mo" });
  }

  if (needsStorage) {
    nodes.push({
      id: "7",
      type: "service",
      position: { x: 820, y: 260 },
      data: { 
        label: "Cloud Storage", 
        icon: "🪣", 
        iconUrl: "https://symbols.getvecta.com/stencil_28/28_cloud-storage.8e4f7b87c5.svg",
        description: "Standard" 
      },
    });
    edges.push({ id: "e5-7", source: "5", target: "7" });
    pricing.push({ service: "Cloud Storage", description: "500GB standard", cost: "$10/mo" });
  }

  if (needsHighScalability) {
    nodes.push({
      id: "8",
      type: "service",
      position: { x: 600, y: 420 },
      data: { 
        label: "Memorystore", 
        icon: "⚡", 
        iconUrl: "https://symbols.getvecta.com/stencil_28/91_memorystore.35eeb35be3.svg",
        description: "Redis" 
      },
    });
    edges.push({ id: "e4-8", source: "4", target: "8" });
    pricing.push({ service: "Memorystore", description: "Basic 1GB", cost: "$13/mo" });
  }

  const totalCost = pricing.reduce((sum, item) => {
    return sum + parseFloat(item.cost.replace(/[^0-9.]/g, ""));
  }, 0);

  return {
    nodes,
    edges,
    pricing,
    totalCost: `$${totalCost.toFixed(0)}/mo`,
  };
}
