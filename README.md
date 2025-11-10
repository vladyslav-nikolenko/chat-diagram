# Cloud Architecture Diagram Generator

An interactive cloud architecture diagram generator that helps visualize and design cloud infrastructures for different cloud providers (AWS, Azure, GCP).

## Features

- **Interactive Diagrams**: Built with React Flow and Dagre for automatic layout and positioning
- **AWS Service Icons**: Real AWS service icons loaded from the web
- **Multi-Cloud Support**: AWS, Azure, and Google Cloud Platform architectures
- **Real-time Pricing**: Estimated monthly costs for all services
- **AI Chat Interface**: Natural language interface for describing architectural requirements
- **Drag & Drop**: Interactive node manipulation and visualization

## Technology Stack

- **React 18**: Modern React with TypeScript
- **React Flow**: Interactive node-based diagrams
- **Dagre**: Automatic graph layout algorithm
- **Tailwind CSS**: Utility-first CSS styling
- **Radix UI**: Accessible component primitives
- **Vite**: Fast build tool and dev server

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Architecture Diagram Features

The diagram visualization includes:

1. **Custom Nodes**: AWS service nodes with real icons, labels, and descriptions
2. **Automatic Layout**: Dagre-based left-to-right (LR) layout for optimal visualization
3. **Animated Edges**: Connections between services with animated flow
4. **Interactive Controls**: Zoom, pan, and fit-to-view controls
5. **Cloud Provider Icons**: Real AWS service icons from Icepanel and other sources

## Example Architecture

The application currently displays a load testing engine architecture with:
- CloudFront CDN and S3 for web content delivery
- API Gateway, Lambda, and Cognito for authentication and API management
- DynamoDB for NoSQL data storage
- Fargate containers for load testing execution
- CodeBuild and ECR for CI/CD pipeline
- CloudWatch for monitoring and logging

## Future Enhancements

- LLM-powered architecture generation based on user requirements
- Export to various formats (PNG, SVG, JSON)
- More cloud providers and services
- Custom node templates and styling options
