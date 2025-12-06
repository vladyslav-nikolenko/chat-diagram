/**
 * Maps service labels to local icon file paths
 * This allows the frontend to automatically select the correct icon
 * based on the service label without needing icon URLs from the backend
 */

// Map service labels to local icon paths
const labelToIconMap: Record<string, string> = {
  // AWS Services - match by label
  "Amazon CloudFront": "/icons/CloudFront.svg",
  CloudFront: "/icons/CloudFront.svg",

  "Amazon S3": "/icons/Simple-Storage-Service.svg",
  S3: "/icons/Simple-Storage-Service.svg",
  "Simple Storage Service": "/icons/Simple-Storage-Service.svg",

  "Amazon API Gateway": "/icons/API-Gateway.svg",
  "API Gateway": "/icons/API-Gateway.svg",

  "AWS Lambda": "/icons/Lambda.svg",
  Lambda: "/icons/Lambda.svg",

  "Amazon Cognito": "/icons/Cognito.svg",
  Cognito: "/icons/Cognito.svg",

  "AWS IAM": "/icons/Identity-and-Access-Management.svg",
  IAM: "/icons/Identity-and-Access-Management.svg",
  "Identity and Access Management": "/icons/Identity-and-Access-Management.svg",

  "AWS CodeBuild": "/icons/CodeBuild.svg",
  CodeBuild: "/icons/CodeBuild.svg",

  "Amazon DynamoDB": "/icons/DynamoDB.svg",
  DynamoDB: "/icons/DynamoDB.svg",

  "Amazon SQS": "/icons/Simple-Queue-Service.svg",
  SQS: "/icons/Simple-Queue-Service.svg",
  "Simple Queue Service": "/icons/Simple-Queue-Service.svg",

  "AWS Fargate": "/icons/Fargate.svg",
  Fargate: "/icons/Fargate.svg",

  "Amazon ECR": "/icons/Elastic-Container-Registry.svg",
  ECR: "/icons/Elastic-Container-Registry.svg",
  "Elastic Container Registry": "/icons/Elastic-Container-Registry.svg",

  "Amazon CloudWatch": "/icons/CloudWatch.svg",
  CloudWatch: "/icons/CloudWatch.svg",

  // Docker
  Docker: "/icons/docker-original.svg",
  "Docker Image": "/icons/docker-original.svg",
  "Taurus Docker Image": "/icons/docker-original.svg",

  // Additional services that might be in the architecture
  "Application Load Balancer": "/icons/CloudFront.svg", // Fallback - you may want to add ALB icon
  "Amazon EC2": "/icons/Lambda.svg", // Fallback - you may want to add EC2 icon
  "AWS Secrets Manager": "/icons/Cognito.svg", // Fallback - you may want to add Secrets Manager icon
  "Amazon SNS": "/icons/Simple-Queue-Service.svg", // Fallback - you may want to add SNS icon
  "Amazon RDS": "/icons/DynamoDB.svg", // Fallback - you may want to add RDS icon
  "Amazon ElastiCache": "/icons/DynamoDB.svg", // Fallback - you may want to add ElastiCache icon
};

/**
 * Gets the local icon path based on service label
 * @param label - The service label (e.g., "Amazon CloudFront", "AWS Lambda")
 * @returns Local icon path or undefined if no match found
 */
export function getIconPathByLabel(label?: string): string | undefined {
  if (!label) return undefined;

  // Try exact match first
  if (labelToIconMap[label]) {
    return labelToIconMap[label];
  }

  // Try case-insensitive match
  const lowerLabel = label.toLowerCase();
  for (const [key, path] of Object.entries(labelToIconMap)) {
    if (key.toLowerCase() === lowerLabel) {
      return path;
    }
  }

  // Try partial match (e.g., "CloudFront" in "Amazon CloudFront")
  for (const [key, path] of Object.entries(labelToIconMap)) {
    if (
      lowerLabel.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowerLabel)
    ) {
      return path;
    }
  }

  return undefined;
}

/**
 * Legacy function for backward compatibility
 * Converts a remote icon URL to a local path (if URL is provided)
 * Otherwise, tries to get icon by label
 */
export function getLocalIconPath(
  remoteUrl?: string,
  label?: string
): string | undefined {
  // If label is provided, use label-based mapping
  if (label) {
    return getIconPathByLabel(label);
  }

  // Fallback to URL-based mapping for backward compatibility
  if (remoteUrl) {
    // You can keep the old URL mapping here if needed
    return undefined; // No longer mapping URLs
  }

  return undefined;
}
