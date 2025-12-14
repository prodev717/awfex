import { Handle, Position } from "reactflow";
import { MdDelete } from "react-icons/md";

export default function FunctionNode({ id, data }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete(id);
  };

  return (
    <div className="relative group">
      <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-3 bg-slate-900/95 backdrop-blur-sm text-slate-100 px-4 py-3 rounded-lg text-xs font-medium whitespace-pre-wrap pointer-events-none opacity-0 transition-all duration-300 z-50 leading-relaxed w-max max-w-[320px] shadow-2xl border border-blue-500/30 group-hover:opacity-100 group-hover:translate-y-2">
        <div className="text-blue-400 font-semibold mb-1 text-[10px] uppercase tracking-wide">Description</div>
        <div className="text-slate-200">{data.tooltip ?? "No Description Available"}</div>
      </div>

      <div
        role="group"
        aria-label={`function-node-${id}`}
        className="relative bg-slate-800 border-2 border-blue-500/60 rounded-lg p-4 w-[220px] min-h-[60px] flex flex-col items-center justify-center gap-1.5 shadow-lg transition-all duration-200 select-none cursor-grab hover:shadow-2xl hover:shadow-blue-500/40 hover:border-blue-400/80"
      >
        <button
          onClick={handleDelete}
          title="Delete node"
          aria-label={`delete-function-${id}`}
          className="absolute -top-2.5 -right-2.5 border-none bg-red-500 text-white rounded-full w-7 h-7 cursor-pointer text-base font-bold grid place-items-center shadow-md shadow-red-500/30 transition-opacity duration-200 z-20 opacity-0 group-hover:opacity-100 hover:bg-red-600"
        >
          <MdDelete size={16} />
        </button>

        <Handle
          type="target"
          position={Position.Top}
          className="!bg-indigo-500 !border-[3px] !border-slate-800 !w-2.5 !h-2.5 !shadow-lg !shadow-indigo-500/50"
        />

        <div className="font-bold text-[15px] text-slate-100 text-center tracking-tight leading-snug capitalize break-words w-full px-1">
          {data.label}
        </div>

        {data.description && (
          <div className="text-[11px] font-medium text-slate-400 text-center leading-snug break-words w-full px-1">
            {data.description}
          </div>
        )}

        {data.type && (
          <div className="mt-1 text-[9px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">
            {data.type}
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-emerald-500 !border-[3px] !border-slate-800 !w-2.5 !h-2.5 !shadow-lg !shadow-emerald-500/50"
        />
      </div>
    </div>
  );
}
