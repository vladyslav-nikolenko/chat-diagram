// Prompts and curated AWS service catalog used by the backend to request the AI to generate architecture and pricing.
// Keep prompts as template strings so we can append user-specific details at runtime.

// Curated list of commonly used AWS services with available 64px SVG icons in public/icons.
// This set aims to cover most simple-to-moderate architectures: web/mobile backends, APIs, serverless stacks,
// containerized services, basic data stores, messaging, identity, and edge/CDN.
// To extend, add more entries with their icon path under /public/icons.
const AWS_SERVICES = [
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    category: 'Networking & CDN',
    iconPath: '/icons/Arch_Networking-Content-Delivery/64/Arch_Amazon-CloudFront_64.svg',
    aliases: ['CloudFront', 'CDN']
  },
  {
    id: 'route-53',
    name: 'Amazon Route 53',
    category: 'Networking & CDN',
    iconPath: '/icons/Arch_Networking-Content-Delivery/64/Arch_Amazon-Route-53_64.svg',
    aliases: ['Route 53', 'Route53', 'DNS']
  },
  {
    id: 'elastic-load-balancing',
    name: 'Elastic Load Balancing',
    category: 'Networking & CDN',
    iconPath: '/icons/Arch_Networking-Content-Delivery/64/Arch_Elastic-Load-Balancing_64.svg',
    aliases: ['ELB', 'ALB', 'NLB', 'Load Balancer', 'Application Load Balancer']
  },
  {
    id: 'api-gateway',
    name: 'Amazon API Gateway',
    category: 'Networking & CDN',
    iconPath: '/icons/Arch_Networking-Content-Delivery/64/Arch_Amazon-API-Gateway_64.svg',
    aliases: ['API Gateway', 'APIGW']
  },
  {
    id: 'vpc',
    name: 'Amazon Virtual Private Cloud (VPC)',
    category: 'Networking & CDN',
    iconPath: '/icons/Arch_Networking-Content-Delivery/64/Arch_Amazon-Virtual-Private-Cloud_64.svg',
    aliases: ['VPC']
  },
  {
    id: 's3',
    name: 'Amazon S3',
    category: 'Storage',
    iconPath: '/icons/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.svg',
    aliases: ['S3', 'Simple Storage Service', 'Object Storage']
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    category: 'Compute',
    iconPath: '/icons/Arch_Compute/64/Arch_AWS-Lambda_64.svg',
    aliases: ['Lambda', 'Serverless Function', 'Function']
  },
  {
    id: 'ec2',
    name: 'Amazon EC2',
    category: 'Compute',
    iconPath: '/icons/Arch_Compute/64/Arch_Amazon-EC2_64.svg',
    aliases: ['EC2', 'VM', 'Instance']
  },
  {
    id: 'ecs',
    name: 'Amazon ECS',
    category: 'Containers',
    iconPath: '/icons/Arch_Containers/64/Arch_Amazon-Elastic-Container-Service_64.svg',
    aliases: ['ECS', 'Container Service']
  },
  {
    id: 'eks',
    name: 'Amazon EKS',
    category: 'Containers',
    iconPath: '/icons/Arch_Containers/64/Arch_Amazon-Elastic-Kubernetes-Service_64.svg',
    aliases: ['EKS', 'Kubernetes']
  },
  {
    id: 'rds',
    name: 'Amazon RDS',
    category: 'Database',
    iconPath: '/icons/Arch_Database/64/Arch_Amazon-RDS_64.svg',
    aliases: ['RDS', 'Relational Database']
  },
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB',
    category: 'Database',
    iconPath: '/icons/Arch_Database/64/Arch_Amazon-DynamoDB_64.svg',
    aliases: ['DynamoDB', 'NoSQL']
  },
  {
    id: 'elasticache',
    name: 'Amazon ElastiCache',
    category: 'Database',
    iconPath: '/icons/Arch_Database/64/Arch_Amazon-ElastiCache_64.svg',
    aliases: ['ElastiCache', 'Redis', 'Memcached', 'Cache']
  },
  {
    id: 'sqs',
    name: 'Amazon SQS',
    category: 'Application Integration',
    iconPath: '/icons/Arch_App-Integration/64/Arch_Amazon-Simple-Queue-Service_64.svg',
    aliases: ['SQS', 'Queue']
  },
  {
    id: 'sns',
    name: 'Amazon SNS',
    category: 'Application Integration',
    iconPath: '/icons/Arch_App-Integration/64/Arch_Amazon-Simple-Notification-Service_64.svg',
    aliases: ['SNS', 'Pub/Sub', 'Notification']
  },
  {
    id: 'eventbridge',
    name: 'Amazon EventBridge',
    category: 'Application Integration',
    iconPath: '/icons/Arch_App-Integration/64/Arch_Amazon-EventBridge_64.svg',
    aliases: ['EventBridge', 'Event Bus']
  },
  {
    id: 'cognito',
    name: 'Amazon Cognito',
    category: 'Security, Identity & Compliance',
    iconPath: '/icons/Arch_Security-Identity-Compliance/64/Arch_Amazon-Cognito_64.svg',
    aliases: ['Cognito', 'Auth', 'Authentication']
  },
  {
    id: 'iam',
    name: 'AWS Identity and Access Management (IAM)',
    category: 'Security, Identity & Compliance',
    iconPath: '/icons/Arch_Security-Identity-Compliance/64/Arch_AWS-Identity-and-Access-Management_64.svg',
    aliases: ['IAM']
  },
  {
    id: 'waf',
    name: 'AWS WAF',
    category: 'Security, Identity & Compliance',
    iconPath: '/icons/Arch_Security-Identity-Compliance/64/Arch_AWS-WAF_64.svg',
    aliases: ['WAF', 'Web Application Firewall']
  }
];

// Machine-usable IDs and prompt list (IDs only)
const AWS_SERVICE_IDS = AWS_SERVICES.map(s => s.id);
const AWS_SERVICE_IDS_LIST = AWS_SERVICE_IDS.map(id => `- ${id}`).join('\n');

const DiagramPrompt = `
You are an expert AWS Solutions Architect and System Designer. Your task is to analyze the provided user requirements (which may include business logic, technical constraints, or general needs) and generate a JSON representation of the optimal AWS architecture.

Design Principles:
1. Simplicity: Adhere to the KISS (Keep It Simple, Stupid) principle. Do not over-engineer. Use the minimum number of services required to solve the problem effectively.
2. Optimization: Select services that offer the best balance of cost, performance, and maintainability for the specific task.
3. Best Practices: Use standard AWS design patterns (e.g., Serverless, Event-Driven, Multi-AZ where necessary).
4. Security: Ensure the architecture follows the Shared Responsibility Model. Assume least privilege, encryption at rest/transit, and proper network isolation (VPC/Subnets) where applicable.
5. Grouping: group services by logical similarity, network isolation, dmz zones or regions

Available AWS services (IDs) — choose only from this list and prefer the smallest set that satisfies the needs. For every service object, set the serviceId to one of these IDs:
${AWS_SERVICE_IDS_LIST}

Output Format:
Return ONLY a valid JSON object. Do not include markdown formatting or explanatory text outside the JSON. The JSON must adhere strictly to this schema:
{
  "groups": [
    { "id": "string (unique)", "label": "string (e.g., Public Subnet, Backend, VPC)" }
  ],
  "services": [
    {
      "id": "string (unique)",
      "serviceId": "string (one of allowed AWS service IDs)",
      "label": "string (Service Name)",
      "description": "string (Short role description)",
      "type": "custom",
      "groupId": "string (must match a group id)"
    }
  ],
  "connections": [
    { "id": "string (unique)", "sourceId": "string (service id)", "targetId": "string (service id)" }
  ]
}`

const PricingPrompt = `
You are an AWS Pricing Estimator. Based on the architecture diagram provided previously (or the services listed below), generate a monthly cost estimate.

Configuration Rules:
1. Region: Assume us-east-1 (N. Virginia).
2. Usage: Assume a "Moderate/Startup" workload (e.g., ~100k requests/month, 50GB storage, standard uptime) unless otherwise specified.
3. Instance Sizing: Select the most cost-efficient instance types/tiers for the described task (e.g., t3.micro/medium for EC2, Free Tier where applicable).
4. Format: Output the result as a strict JSON object.

Output Schema:
{
  "pricing": [
    {
      "service": "string (Service Name)",
      "description": "string (Configuration details, e.g. 't3.medium, 2 instances' or 'Standard Tier, 10GB')",
      "cost": "string (Estimated monthly cost, e.g. '$45.00')"
    }
  ],
  "totalEstimatedCost": "string (Sum of all costs)"
}`

module.exports = { DiagramPrompt, PricingPrompt, AWS_SERVICES, AWS_SERVICE_IDS };
