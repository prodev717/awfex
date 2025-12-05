import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

export default function FlowCanvas({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) {
  return (
    <div style={{ flex: 1 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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