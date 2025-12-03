import { useMemo, useEffect } from "react";
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
import ELK from "elkjs/lib/elk.bundled.js";
import "reactflow/dist/style.css";
import { ArchitectureData } from "./types";

// --- 1. Interfaces (Matches your JSON Structure) ---

export interface ServiceNode {
  id: string;
  label: string;
  type: string; // e.g. "custom"
  iconUrl?: string;
  description?: string;
  groupId?: string; // Links to a group
}

export interface ServiceGroup {
  id: string;
  label: string;
}

export interface ServiceConnection {
  id: string;
  sourceId: string;
  targetId: string;
}

interface DiagramVisualizationProps {
  architectureData: ArchitectureData;
}

// --- 2. Custom Component Types ---

interface CustomNodeData {
  label: string;
  iconUrl?: string;
  description?: string;
  usedHandles?: UsedHandles;
  _groupId?: string; // Internal helper
}

type UsedHandles = {
  sourceTop?: boolean;
  sourceRight?: boolean;
  sourceBottom?: boolean;
  sourceLeft?: boolean;
  targetTop?: boolean;
  targetRight?: boolean;
  targetBottom?: boolean;
  targetLeft?: boolean;
};

// Node Component: Renders the Cloud Service Card
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
  width?: number;
  height?: number;
}

function GroupNode({
  data,
  style,
}: {
  data: GroupNodeData;
  style?: React.CSSProperties;
}) {
  // Use style prop if available (from dynamic calculation), otherwise use data.width/height (from original)
  const width = style?.width || data.width;
  const height = style?.height || data.height;

  return (
    <div
      className='react-flow__node-default'
      style={{
        width: width,
        height: height,
        border: "2px dashed #94a3b8",
        borderRadius: "8px",
        backgroundColor: "rgba(241, 245, 249, 0.4)",
        position: "relative",
        pointerEvents: "none",
        boxShadow: "none",
        padding: 0,
        margin: 0,
        ...style, // Override with style prop if provided (for position)
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

// --- 3. Layout Logic Helper Functions ---

const NODE_WIDTH = 200; // Approximate width of card
const NODE_HEIGHT = 150; // Approximate height of card

// Initialize ELK instance
const elk = new ELK();

// ELK layout options - configured for horizontal flow
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.spacing.nodeNode": "50",
  "elk.spacing.edgeEdge": "25",
  "elk.layered.spacing.nodeNodeBetweenLayers": "60",
  "elk.edgeRouting": "ORTHOGONAL",
};

// Uses ELK.js to calculate X/Y coordinates for services with hierarchical grouping
// Following the React Flow example pattern: https://reactflow.dev/examples/layout/elkjs
// Groups are treated as parent nodes, services as children within their groups
const getLayoutedElements = async (
  serviceNodes: Node[],
  edges: Edge[],
  groups?: ServiceGroup[]
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  // Convert React Flow edges to ELK format (sources/targets arrays)
  const elkEdges = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  // If no groups, layout services flat (original behavior)
  if (!groups || groups.length === 0) {
    const graph = {
      id: "root",
      layoutOptions: elkOptions,
      children: serviceNodes.map((node) => ({
        id: node.id,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      })),
      edges: elkEdges,
    };

    const layoutedGraph = await elk.layout(graph);

    return {
      nodes: (layoutedGraph.children || []).map((elkNode) => {
        const originalNode =
          serviceNodes.find((n) => n.id === elkNode.id) || serviceNodes[0];
        return {
          ...originalNode,
          position: { x: elkNode.x || 0, y: elkNode.y || 0 },
        };
      }),
      edges: edges, // Return original React Flow edges
    };
  }

  // Build hierarchical structure: groups as parents, services as children
  const groupMap = new Map<string, ServiceGroup>();
  groups.forEach((group) => groupMap.set(group.id, group));

  // Group services by their groupId
  const servicesByGroup = new Map<string, Node[]>();
  const ungroupedServices: Node[] = [];

  serviceNodes.forEach((node) => {
    const groupId = (node.data as any)?._groupId;
    if (groupId && groupMap.has(groupId)) {
      if (!servicesByGroup.has(groupId)) {
        servicesByGroup.set(groupId, []);
      }
      servicesByGroup.get(groupId)!.push(node);
    } else {
      ungroupedServices.push(node);
    }
  });

  // Build ELK graph with hierarchical structure
  const groupChildren = Array.from(servicesByGroup.entries()).map(
    ([groupId, services]) => ({
      id: groupId,
      // Group nodes don't need explicit width/height - ELK will calculate from children
      // But we can set minimum dimensions
      layoutOptions: {
        "elk.padding": "[top=40,left=40,bottom=40,right=40]",
      },
      children: services.map((node) => ({
        id: node.id,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      })),
    })
  );

  // Add ungrouped services as direct children of root
  const rootChildren = [
    ...groupChildren,
    ...ungroupedServices.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
  ];

  const graph = {
    id: "root",
    layoutOptions: elkOptions,
    children: rootChildren,
    edges: elkEdges,
  };

  const layoutedGraph = await elk.layout(graph);

  // Extract all nodes (both groups and services) from the layouted graph
  const resultNodes: Node[] = [];

  // Process groups and their children
  (layoutedGraph.children || []).forEach((elkGroup) => {
    const group = groupMap.get(elkGroup.id);
    if (group) {
      // This is a group node - create React Flow group node
      resultNodes.push({
        id: group.id,
        type: "group",
        position: { x: elkGroup.x || 0, y: elkGroup.y || 0 },
        style: {
          width: elkGroup.width || 200,
          height: elkGroup.height || 150,
        },
        data: {
          label: group.label,
          width: elkGroup.width || 200,
          height: elkGroup.height || 150,
        },
        selectable: false,
        draggable: false,
        deletable: false,
        zIndex: -1, // Groups sit behind services
      });

      // Process children (services) within this group
      elkGroup.children?.forEach((elkChild) => {
        const originalNode = serviceNodes.find((n) => n.id === elkChild.id);
        if (originalNode) {
          resultNodes.push({
            ...originalNode,
            position: {
              // Position relative to group + group position = absolute position
              x: (elkGroup.x || 0) + (elkChild.x || 0),
              y: (elkGroup.y || 0) + (elkChild.y || 0),
            },
            zIndex: 10, // Services sit above groups
          });
        }
      });
    } else {
      // This is an ungrouped service
      const originalNode = serviceNodes.find((n) => n.id === elkGroup.id);
      if (originalNode) {
        resultNodes.push({
          ...originalNode,
          position: { x: elkGroup.x || 0, y: elkGroup.y || 0 },
          zIndex: 10,
        });
      }
    }
  });

  return {
    nodes: resultNodes,
    edges: edges, // Return original React Flow edges
  };
};

// Calculates which handles to show based on the direction of the connection
const calculateUsedHandles = (edges: Edge[], layoutedNodes: Node[]) => {
  const handleMap: Record<string, UsedHandles> = {};
  const nodePosMap = new Map(layoutedNodes.map((n) => [n.id, n.position]));

  const ensureMap = (id: string) => {
    if (!handleMap[id]) handleMap[id] = {};
  };

  edges.forEach((edge) => {
    const srcPos = nodePosMap.get(edge.source);
    const tgtPos = nodePosMap.get(edge.target);

    if (!srcPos || !tgtPos) return;

    ensureMap(edge.source);
    ensureMap(edge.target);

    const dx = tgtPos.x - srcPos.x;
    const dy = tgtPos.y - srcPos.y;

    // Heuristic: Is the connection mostly Horizontal or Vertical?
    let sourceHandle = "sourceRight";
    let targetHandle = "targetLeft";

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal flow
      if (dx > 0) {
        sourceHandle = "sourceRight";
        targetHandle = "targetLeft";
      } else {
        sourceHandle = "sourceLeft";
        targetHandle = "targetRight";
      }
    } else {
      // Vertical flow
      if (dy > 0) {
        sourceHandle = "sourceBottom";
        targetHandle = "targetTop";
      } else {
        sourceHandle = "sourceTop";
        targetHandle = "targetBottom";
      }
    }

    // @ts-ignore - Dynamic access safely handled by ensuringMap
    handleMap[edge.source][sourceHandle] = true;
    // @ts-ignore
    handleMap[edge.target][targetHandle] = true;

    // Apply specific handle IDs to the edge so the line connects to the right spot
    edge.sourceHandle = sourceHandle.replace("source", "source-").toLowerCase();
    edge.targetHandle = targetHandle.replace("target", "target-").toLowerCase();
  });

  return { handleMap, edges };
};

// --- 4. Main Component ---

export function DiagramVisualization({
  architectureData,
}: DiagramVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!architectureData || !architectureData.services) return;

    // --- Step A: Prepare raw edges ---
    const rawEdges: Edge[] = architectureData.connections.map((conn) => ({
      id: conn.id,
      source: conn.sourceId,
      target: conn.targetId,
      type: "step",
      animated: true,
      style: { stroke: "#ff9a6e", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ff9a6e" },
    }));

    // --- Step B: Prepare raw service nodes (position 0,0) ---
    const serviceNodes: Node[] = architectureData.services.map((svc) => ({
      id: svc.id,
      type: "custom",
      data: {
        label: svc.label,
        description: svc.description,
        iconUrl: svc.iconUrl,
        usedHandles: {},
        _groupId: svc.groupId, // Temporary store for group calc
      },
      position: { x: 0, y: 0 },
      zIndex: 10, // Services sit above groups
    }));

    // --- Step C: Run Auto Layout (ELK.js) with hierarchical grouping ---
    getLayoutedElements(serviceNodes, rawEdges, architectureData.groups).then(
      (layoutResult) => {
        // --- Step D: Calculate Used Handles ---
        // Filter out group nodes for handle calculation (only calculate for service nodes)
        const serviceNodesOnly = layoutResult.nodes.filter(
          (n) => n.type === "custom"
        );
        const { handleMap, edges: finalEdges } = calculateUsedHandles(
          layoutResult.edges,
          serviceNodesOnly
        );

        // Apply calculated handles to service nodes only
        const nodesWithHandles = layoutResult.nodes.map((node) => {
          if (node.type === "group") {
            // Group nodes don't need handles
            return node;
          }
          return {
            ...node,
            data: {
              ...node.data,
              usedHandles: handleMap[node.id] || {},
            },
          };
        });

        // ELK.js has already calculated group positions and sizes, so we can use them directly
        setNodes(nodesWithHandles);
        setEdges(finalEdges);
      }
    );
  }, [architectureData, setNodes, setEdges]);

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
          minZoom={0.1}
          maxZoom={2}
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
