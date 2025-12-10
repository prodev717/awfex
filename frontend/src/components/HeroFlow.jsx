import React from 'react';
import ReactFlow, {
    Background,
    Handle,
    Position,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node Component
const CustomNode = ({ data, isConnectable }) => {
    return (
        <div className={`relative min-w-[150px] bg-slate-900/90 backdrop-blur-xl border-2 rounded-xl p-4 shadow-2xl transition-all hover:scale-105 hover:shadow-indigo-500/20 ${data.borderColor}`}>
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="!bg-slate-500 !w-3 !h-3" />

            <div className="flex justify-between items-center mb-2">
                <div className={`text-[10px] uppercase font-bold tracking-wider ${data.titleColor}`}>
                    {data.title}
                </div>
                {data.showStatus && (
                    <div className={`w-2 h-2 rounded-full animate-pulse ${data.statusColor}`}></div>
                )}
            </div>

            <div className="text-sm font-bold text-slate-100 font-mono mb-1">
                {data.label}
            </div>

            <div className="text-[10px] text-slate-400 font-mono bg-slate-950/50 p-1.5 rounded border border-white/5 truncate max-w-[180px]">
                {data.subtext}
            </div>

            <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="!bg-indigo-500 !w-3 !h-3" />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

const initialNodes = [
    {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
            title: 'Database',
            label: 'SQLite',
            subtext: 'SELECT * FROM users',
            borderColor: 'border-orange-500/50 hover:border-orange-400',
            titleColor: 'text-orange-400',
            showStatus: true,
            statusColor: 'bg-orange-500'
        },
    },
    {
        id: '2',
        type: 'custom',
        position: { x: 250, y: 100 },
        data: {
            title: 'Transform',
            label: 'JSON.stringify',
            subtext: 'Format Output',
            borderColor: 'border-cyan-500/50 hover:border-cyan-400',
            titleColor: 'text-cyan-400',
            showStatus: false
        },
    },
    {
        id: '3',
        type: 'custom',
        position: { x: 500, y: 200 },
        data: {
            title: 'Prompt Eng',
            label: 'Merge / Add',
            subtext: '"Analyze provided data..."',
            borderColor: 'border-pink-500/50 hover:border-pink-400',
            titleColor: 'text-pink-400',
            showStatus: false,
        },
    },
    {
        id: '4',
        type: 'custom',
        position: { x: 750, y: 300 },
        data: {
            title: 'AI Model',
            label: 'Gemini 2.5',
            subtext: 'model: "flash"',
            borderColor: 'border-indigo-500/50 hover:border-indigo-400',
            titleColor: 'text-indigo-400',
            showStatus: true,
            statusColor: 'bg-indigo-500'
        },
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#94a3b8' } },
    { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#6366f1' } },
];

export default function HeroFlow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const defaultEdgeOptions = {
        animated: true,
        style: { strokeWidth: 3 },
    };

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                attributionPosition="bottom-right"
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnScroll={false}
                preventScrolling={true}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#6366f1" gap={20} size={1} variant="dots" className="opacity-20" />
            </ReactFlow>
        </div>
    );
}
