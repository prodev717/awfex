import { Handle, Position } from "reactflow";

export default function FunctionNode({ id, data }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete(id);
  };

  return (
    <div className="relative group">
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2 bg-slate-800 text-white px-3 py-2.5 rounded-md text-[11px] font-medium whitespace-pre-wrap pointer-events-none opacity-0 transition-opacity duration-200 z-50 leading-relaxed w-max max-w-[300px] shadow-xl border border-slate-700 group-hover:opacity-100">
        {data.tooltip ?? "No Description Avaliable"}
      </div>

      <div
        role="group"
        aria-label={`function-node-${id}`}
        className="relative bg-slate-800 border border-slate-700 rounded-xl p-4 w-[180px] min-h-[60px] flex flex-col items-center justify-center gap-1.5 shadow-lg transition-all duration-200 select-none cursor-grab hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-400/50"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-400 to-purple-500 rounded-t-xl" />

        {/* Delete button */}
        <button
          onClick={handleDelete}
          title="Delete node"
          aria-label={`delete-function-${id}`}
          className="absolute -top-2.5 -right-2.5 border-none bg-red-500 text-white rounded-full w-7 h-7 cursor-pointer text-base font-bold grid place-items-center shadow-md shadow-red-500/30 transition-opacity duration-200 z-20 opacity-0 group-hover:opacity-100 hover:bg-red-600"
        >
          ×
        </button>

        {/* Input handle */}
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-indigo-500 !border-[3px] !border-slate-800 !w-2.5 !h-2.5 !shadow-lg !shadow-indigo-500/50"
        />

        {/* Label */}
        <div className="font-bold text-[15px] text-slate-100 text-center tracking-tight leading-snug">
          {data.label}
        </div>

        {/* Description */}
        {data.description && (
          <div className="text-[11px] font-medium text-slate-400 text-center leading-snug">
            {data.description}
          </div>
        )}

        {/* Type badge */}
        {data.type && (
          <div className="mt-1 text-[9px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">
            {data.type}
          </div>
        )}

        {/* Output handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-emerald-500 !border-[3px] !border-slate-800 !w-2.5 !h-2.5 !shadow-lg !shadow-emerald-500/50"
        />
      </div>
    </div>
  );
}
