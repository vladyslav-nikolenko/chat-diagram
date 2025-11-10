import { useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { ArchitectureData } from "./CloudArchitecturePlanner";

interface DiagramVisualizationProps {
  architectureData: ArchitectureData;
  selectedProvider: string;
}

interface CustomNodeData {
  label: string;
  iconUrl?: string;
  description?: string;
  position?: Position;
  usedHandles?: {
    sourceTop?: boolean;
    sourceRight?: boolean;
    sourceBottom?: boolean;
    sourceLeft?: boolean;
    targetTop?: boolean;
    targetRight?: boolean;
    targetBottom?: boolean;
    targetLeft?: boolean;
  };
}

// Custom node component that only shows handles that are actually used
function CustomNode({ data }: { data: CustomNodeData }) {
  const { usedHandles } = data;

  return (
    <div
      className='px-4 py-3 bg-white border-2 border-slate-200 rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-[140px]'
      style={{
        border: "2px solid rgb(226, 232, 240)", // Explicit border color to override React Flow defaults
        outline: "none", // Remove any outline
      }}
    >
      {/* Target handles - only show if used */}
      {usedHandles?.targetTop && (
        <Handle
          id='target-top'
          type='target'
          position={Position.Top}
          className='!bg-[#ff9a6e]'
        />
      )}
      {usedHandles?.targetRight && (
        <Handle
          id='target-right'
          type='target'
          position={Position.Right}
          className='!bg-[#ff9a6e]'
        />
      )}
      {usedHandles?.targetBottom && (
        <Handle
          id='target-bottom'
          type='target'
          position={Position.Bottom}
          className='!bg-[#ff9a6e]'
        />
      )}
      {usedHandles?.targetLeft && (
        <Handle
          id='target-left'
          type='target'
          position={Position.Left}
          className='!bg-[#ff9a6e]'
        />
      )}

      <div className='flex flex-col items-center gap-2'>
        {data.iconUrl && (
          <div className='w-12 h-12 flex items-center justify-center'>
            <img
              src={data.iconUrl}
              alt={data.label}
              className='w-full h-full object-contain'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}
        <div className='text-center'>
          <p className='text-sm font-semibold text-slate-900'>{data.label}</p>
          {data.description && (
            <p className='text-xs text-slate-500 mt-0.5'>{data.description}</p>
          )}
        </div>
      </div>

      {/* Source handles - only show if used */}
      {usedHandles?.sourceTop && (
        <Handle
          id='source-top'
          type='source'
          position={Position.Top}
          className='!bg-[#ff9a6e]'
        />
      )}
      {usedHandles?.sourceRight && (
        <Handle
          id='source-right'
          type='source'
          position={Position.Right}
          className='!bg-[#ff9a6e]'
        />
      )}
      {usedHandles?.sourceBottom && (
        <Handle
          id='source-bottom'
          type='source'
          position={Position.Bottom}
          className='!bg-[#ff9a6e]'
        />
      )}
      {usedHandles?.sourceLeft && (
        <Handle
          id='source-left'
          type='source'
          position={Position.Left}
          className='!bg-[#ff9a6e]'
        />
      )}
    </div>
  );
}

// Group node component for subflow groupings with dashed borders
interface GroupNodeData {
  label: string;
  width: number;
  height: number;
}

function GroupNode({ data }: { data: GroupNodeData }) {
  return (
    <div
      className='react-flow__node-default'
      style={{
        width: data.width,
        height: data.height,
        border: "2px dashed #94a3b8",
        borderRadius: "8px",
        backgroundColor: "rgba(241, 245, 249, 0.4)",
        position: "relative",
        pointerEvents: "none",
        boxShadow: "none",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Label at top-left */}
      <div
        style={{
          position: "absolute",
          top: "-16px",
          left: "12px",
          backgroundColor: "#f1f5f9",
          padding: "4px 10px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#475569",
          whiteSpace: "nowrap",
          borderRadius: "4px",
          border: "1px solid #cbd5e1",
          zIndex: 10,
        }}
      >
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
  group: GroupNode,
};

export function DiagramVisualization({
  architectureData,
}: DiagramVisualizationProps) {
  // Define edges first
  const initialEdges: Edge[] = useMemo(
    () => [
      // Web Console section connections
      // CloudFront → S3: RIGHT → LEFT (S3 is to the right of CloudFront)
      {
        id: "web-1",
        source: "cloudfront",
        sourceHandle: "source-right",
        target: "s3-web",
        targetHandle: "target-left",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Connection from Web Console to REST API
      // CloudFront → API Gateway: BOTTOM → TOP (API Gateway is below CloudFront)
      {
        id: "web-to-api",
        source: "cloudfront",
        sourceHandle: "source-bottom",
        target: "api-gateway",
        targetHandle: "target-top",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // REST API section connections
      // API Gateway → Lambda: RIGHT → LEFT (Lambda is to the right of API Gateway)
      {
        id: "api-1",
        source: "api-gateway",
        sourceHandle: "source-right",
        target: "lambda",
        targetHandle: "target-left",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // API Gateway → Cognito: BOTTOM → TOP (Cognito is below API Gateway)
      {
        id: "api-2",
        source: "api-gateway",
        sourceHandle: "source-bottom",
        target: "cognito",
        targetHandle: "target-top",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Cognito → IAM: RIGHT → LEFT (IAM is to the right of Cognito)
      {
        id: "api-3",
        source: "cognito",
        sourceHandle: "source-right",
        target: "iam",
        targetHandle: "target-left",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Image Pipeline section connections
      // Docker Image → S3 (artifacts): RIGHT → LEFT
      {
        id: "img-1",
        source: "docker-image",
        sourceHandle: "source-right",
        target: "s3-artifacts",
        targetHandle: "target-left",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // S3 (artifacts) → CodeBuild: RIGHT → LEFT (horizontal connection, same level)
      {
        id: "img-2",
        source: "s3-artifacts",
        sourceHandle: "source-right",
        target: "code-build",
        targetHandle: "target-left",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // CodeBuild → ECR: BOTTOM → TOP (ECR is directly below CodeBuild)
      {
        id: "img-4",
        source: "code-build",
        sourceHandle: "source-bottom",
        target: "ecr",
        targetHandle: "target-top",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Load Testing Engine section connections
      // Lambda → S3 (test data): LEFT → RIGHT (Lambda writes to S3, S3 is to the left)
      {
        id: "load-1",
        source: "lambda-orchestration",
        sourceHandle: "source-left",
        target: "s3-test-data",
        targetHandle: "target-right",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Lambda ↔ DynamoDB: bidirectional
      // Lambda → DynamoDB: RIGHT → LEFT
      {
        id: "load-2",
        source: "lambda-orchestration",
        sourceHandle: "source-right",
        target: "dynamodb",
        targetHandle: "target-left",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // DynamoDB → Lambda: LEFT → RIGHT
      {
        id: "load-3",
        source: "dynamodb",
        sourceHandle: "source-left",
        target: "lambda-orchestration",
        targetHandle: "target-right",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // SQS → Lambda: TOP → BOTTOM (Lambda is above SQS, closer vertically)
      {
        id: "load-4",
        source: "sqs",
        sourceHandle: "source-top",
        target: "lambda-orchestration",
        targetHandle: "target-bottom",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Lambda → Fargate: BOTTOM → TOP
      {
        id: "load-5",
        source: "lambda-orchestration",
        sourceHandle: "source-bottom",
        target: "fargate",
        targetHandle: "target-top",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Fargate ↔ ECR: bidirectional
      // Fargate → ECR: RIGHT → LEFT
      {
        id: "load-6",
        source: "fargate",
        sourceHandle: "source-right",
        target: "ecr",
        targetHandle: "target-left",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // ECR → Fargate: LEFT → RIGHT
      {
        id: "load-7",
        source: "ecr",
        sourceHandle: "source-left",
        target: "fargate",
        targetHandle: "target-right",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Fargate → CloudWatch: BOTTOM → TOP
      {
        id: "load-8",
        source: "fargate",
        sourceHandle: "source-bottom",
        target: "cloudwatch",
        targetHandle: "target-top",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // Connections from REST API to Load Testing Engine
      // Lambda (REST API) → Lambda (orchestration): RIGHT → LEFT (mostly horizontal)
      {
        id: "api-to-load-1",
        source: "lambda",
        sourceHandle: "source-right",
        target: "lambda-orchestration",
        targetHandle: "target-left",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
      // API Gateway → SQS: BOTTOM → TOP (SQS is below API Gateway, closer vertically)
      {
        id: "api-to-load-2",
        source: "api-gateway",
        sourceHandle: "source-bottom",
        target: "sqs",
        targetHandle: "target-top",
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9a6e",
        },
        style: { stroke: "#ff9a6e", strokeWidth: 2 },
        animated: true,
      },
    ],
    []
  );

  // Calculate which handles are used for each node
  const usedHandlesMap = useMemo(() => {
    const handleMap: Record<
      string,
      {
        sourceTop?: boolean;
        sourceRight?: boolean;
        sourceBottom?: boolean;
        sourceLeft?: boolean;
        targetTop?: boolean;
        targetRight?: boolean;
        targetBottom?: boolean;
        targetLeft?: boolean;
      }
    > = {};

    initialEdges.forEach((edge) => {
      // Mark source handles
      if (edge.sourceHandle) {
        if (!handleMap[edge.source]) {
          handleMap[edge.source] = {};
        }
        if (edge.sourceHandle === "source-top")
          handleMap[edge.source].sourceTop = true;
        if (edge.sourceHandle === "source-right")
          handleMap[edge.source].sourceRight = true;
        if (edge.sourceHandle === "source-bottom")
          handleMap[edge.source].sourceBottom = true;
        if (edge.sourceHandle === "source-left")
          handleMap[edge.source].sourceLeft = true;
      }

      // Mark target handles
      if (edge.targetHandle) {
        if (!handleMap[edge.target]) {
          handleMap[edge.target] = {};
        }
        if (edge.targetHandle === "target-top")
          handleMap[edge.target].targetTop = true;
        if (edge.targetHandle === "target-right")
          handleMap[edge.target].targetRight = true;
        if (edge.targetHandle === "target-bottom")
          handleMap[edge.target].targetBottom = true;
        if (edge.targetHandle === "target-left")
          handleMap[edge.target].targetLeft = true;
      }
    });

    return handleMap;
  }, [initialEdges]);

  // Web Console section (top) + REST API section (bottom)
  const initialNodes: Node[] = useMemo(
    () => [
      // Web Console group - wraps CloudFront and S3 (Static Assets)
      {
        id: "group-web-console",
        type: "group",
        position: { x: 130, y: 60 },
        data: {
          label: "Web Console",
          width: 410,
          height: 140,
        },
        selectable: false,
        draggable: false,
        deletable: false,
        zIndex: -1,
      },
      // Web Console section - Top
      {
        id: "cloudfront",
        type: "custom",
        position: { x: 150, y: 80 },
        data: {
          label: "Amazon CloudFront",
          description: "CDN",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/CloudFront.svg",
          usedHandles: usedHandlesMap["cloudfront"],
        },
      },
      {
        id: "s3-web",
        type: "custom",
        position: { x: 380, y: 80 },
        data: {
          label: "Amazon S3",
          description: "Static Assets",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
          usedHandles: usedHandlesMap["s3-web"],
        },
      },
      // REST API group - wraps API Gateway, Lambda, Cognito, and IAM
      {
        id: "group-rest-api",
        type: "group",
        position: { x: 130, y: 300 },
        data: {
          label: "REST API",
          width: 410,
          height: 380,
        },
        selectable: false,
        draggable: false,
        deletable: false,
        zIndex: -1,
      },
      // REST API section - Bottom (moved down)
      {
        id: "api-gateway",
        type: "custom",
        position: { x: 150, y: 320 },
        data: {
          label: "Amazon API Gateway",
          description: "REST API",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/App-Integration/API-Gateway.svg",
          usedHandles: usedHandlesMap["api-gateway"],
        },
      },
      {
        id: "lambda",
        type: "custom",
        position: { x: 380, y: 320 },
        data: {
          label: "AWS Lambda",
          description: "Functions",
          iconUrl: "https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg",
          usedHandles: usedHandlesMap["lambda"],
        },
      },
      {
        id: "cognito",
        type: "custom",
        position: { x: 150, y: 560 },
        data: {
          label: "Amazon Cognito",
          description: "Auth",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Cognito.svg",
          usedHandles: usedHandlesMap["cognito"],
        },
      },
      {
        id: "iam",
        type: "custom",
        position: { x: 380, y: 560 },
        data: {
          label: "AWS IAM",
          description: "Permissions",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/Identity-and-Access-Management.svg",
          usedHandles: usedHandlesMap["iam"],
        },
      },
      // Image Pipeline group - wraps Docker Image, S3 (Artifacts), and CodeBuild
      {
        id: "group-image-pipeline",
        type: "group",
        position: { x: 730, y: 60 },
        data: {
          label: "Image Pipeline",
          width: 640,
          height: 140,
        },
        selectable: false,
        draggable: false,
        deletable: false,
        zIndex: -1,
      },
      // Image Pipeline section - Top Right
      {
        id: "docker-image",
        type: "custom",
        position: { x: 750, y: 80 },
        data: {
          label: "Taurus Docker Image",
          description: "Container",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
          usedHandles: usedHandlesMap["docker-image"],
        },
      },
      {
        id: "s3-artifacts",
        type: "custom",
        position: { x: 980, y: 80 },
        data: {
          label: "Amazon S3",
          description: "Artifacts",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
          usedHandles: usedHandlesMap["s3-artifacts"],
        },
      },
      {
        id: "code-build",
        type: "custom",
        position: { x: 1210, y: 80 },
        data: {
          label: "AWS CodeBuild",
          description: "Build",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Developer-Tools/CodeBuild.svg",
          usedHandles: usedHandlesMap["code-build"],
        },
      },
      // Load Testing Engine group - wraps S3 (Test Data), Lambda (Orchestration), DynamoDB, SQS, Fargate, ECR, and CloudWatch
      {
        id: "group-load-testing",
        type: "group",
        position: { x: 730, y: 380 },
        data: {
          label: "Load Testing Engine",
          width: 640,
          height: 480,
        },
        selectable: false,
        draggable: false,
        deletable: false,
        zIndex: -1,
      },
      // Load Testing Engine section - Bottom Right
      {
        id: "s3-test-data",
        type: "custom",
        position: { x: 750, y: 400 },
        data: {
          label: "Amazon S3",
          description: "Test Data",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg",
          usedHandles: usedHandlesMap["s3-test-data"],
        },
      },
      {
        id: "lambda-orchestration",
        type: "custom",
        position: { x: 980, y: 400 },
        data: {
          label: "AWS Lambda",
          description: "Orchestration",
          iconUrl: "https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg",
          usedHandles: usedHandlesMap["lambda-orchestration"],
        },
      },
      {
        id: "dynamodb",
        type: "custom",
        position: { x: 1210, y: 400 },
        data: {
          label: "Amazon DynamoDB",
          description: "NoSQL DB",
          iconUrl: "https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg",
          usedHandles: usedHandlesMap["dynamodb"],
        },
      },
      {
        id: "sqs",
        type: "custom",
        position: { x: 750, y: 580 },
        data: {
          label: "Amazon SQS",
          description: "Queue",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/App-Integration/Simple-Queue-Service.svg",
          usedHandles: usedHandlesMap["sqs"],
        },
      },
      {
        id: "fargate",
        type: "custom",
        position: { x: 980, y: 580 },
        data: {
          label: "AWS Fargate",
          description: "Container",
          iconUrl: "https://icon.icepanel.io/AWS/svg/Containers/Fargate.svg",
          usedHandles: usedHandlesMap["fargate"],
        },
      },
      {
        id: "ecr",
        type: "custom",
        position: { x: 1210, y: 580 },
        data: {
          label: "Amazon ECR",
          description: "Registry",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Containers/Elastic-Container-Registry.svg",
          usedHandles: usedHandlesMap["ecr"],
        },
      },
      {
        id: "cloudwatch",
        type: "custom",
        position: { x: 980, y: 740 },
        data: {
          label: "Amazon CloudWatch",
          description: "Monitoring",
          iconUrl:
            "https://icon.icepanel.io/AWS/svg/Management-Governance/CloudWatch.svg",
          usedHandles: usedHandlesMap["cloudwatch"],
        },
      },
    ],
    [usedHandlesMap]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <>
      <style>{`
        .react-flow__node {
          border: none !important;
          outline: none !important;
          background: transparent !important;
        }
        .react-flow__node:focus {
          outline: none !important;
        }
        .react-flow__node:focus-visible {
          outline: none !important;
        }
        .react-flow__node-custom {
          border: none !important;
          outline: none !important;
          background: transparent !important;
        }
        .react-flow__node-custom:focus {
          outline: none !important;
        }
        .react-flow__node-custom:focus-visible {
          outline: none !important;
        }
      `}</style>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#f1f5f9",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.1, // Very minimal padding to zoom in significantly (default is 0.2)
          }}
          style={{ width: "100%", height: "100%" }}
          defaultEdgeOptions={{
            type: "step",
            animated: true,
            style: { stroke: "#ff9a6e", strokeWidth: 2 },
          }}
          connectionLineStyle={{ stroke: "#ff9a6e", strokeWidth: 2 }}
        >
          <Background color='#e2e8f0' gap={20} />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}
