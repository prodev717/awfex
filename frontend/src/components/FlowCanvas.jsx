import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";

export default function FlowCanvas({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isRunning = false,
  onAutoLayout,
  onClearWorkflow,
}) {
  const animatedEdges = edges.map((edge) => ({
    ...edge,
    animated: isRunning,
  }));

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={animatedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={{
          style: { strokeWidth: 3, stroke: '#6366f1' },
        }}
        connectionLineStyle={{ strokeWidth: 3, stroke: '#6366f1' }}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 0.8,
        }}
      >
        <Background />
      </ReactFlow>

      <div className="absolute bottom-3 right-3 flex gap-2 z-10">
        <button
          onClick={() => onAutoLayout('TB')}
          className="w-10 h-10 flex items-center justify-center rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 hover:text-white transition-all shadow-lg"
          title="Auto Layout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
          </svg>
        </button>
        <button
          onClick={onClearWorkflow}
          className="w-10 h-10 flex items-center justify-center rounded-md bg-slate-800 border border-red-600/50 text-red-400 hover:bg-red-600 hover:border-red-500 hover:text-white transition-all shadow-lg"
          title="Clear Workflow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}