import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

export default function FlowCanvas({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isRunning = false,
}) {
  const animatedEdges = edges.map((edge) => ({
    ...edge,
    animated: isRunning,
  }));

  return (
    <div style={{ flex: 1 }}>
      <ReactFlow
        nodes={nodes}
        edges={animatedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={{
          style: { strokeWidth: 3 },
        }}
        connectionLineStyle={{ strokeWidth: 3 }}
        fitView
      >
        <Background />
        <Controls
          style={{
            backgroundColor: '#020617',
            border: '1px solid #1e293b'
          }}
        />
        <MiniMap
          style={{
            backgroundColor: '#020617',
            border: '1px solid #1e293b'
          }}
          nodeColor="#334155"
          maskColor="rgba(2, 6, 23, 0.6)"
        />
      </ReactFlow>
    </div>
  );
}