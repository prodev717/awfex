import { Handle, Position } from "reactflow";

export default function InputNode({ id, data }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete?.(id);
  };

  const handleChange = (e) => {
    e.stopPropagation();
    data.onValueChange?.(id, e.target.value);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    data.onValueChange?.(id, "");
  };

  const isEmpty =
    data.value === "" || data.value === null || data.value === undefined;

  return (
    <div className="relative group">
      {/* Tooltip */}
      <div className="absolute -top-[38px] left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2.5 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap pointer-events-none opacity-0 transition-opacity duration-200 z-50 shadow-xl border border-slate-700 group-hover:opacity-100">
        This node is used to give inputs to the other function nodes. It always outputs a string.
      </div>

      <div
        role="group"
        aria-label={`input-node-${id}`}
        className="relative w-[260px] bg-slate-800 border border-slate-700 rounded-xl p-3.5 shadow-lg transition-all duration-200 select-none hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/50"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-xl" />

        {/* Delete button */}
        <button
          onClick={handleDelete}
          title="Delete node"
          aria-label={`delete-${id}`}
          className="absolute -top-2.5 -right-2.5 bg-red-500 text-white border-none w-7 h-7 rounded-full shadow-md shadow-red-500/30 grid place-items-center cursor-pointer text-base font-bold transition-opacity duration-200 z-20 opacity-0 group-hover:opacity-100 hover:bg-red-600"
        >
          ×
        </button>

        {/* Input handle (top) */}
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-blue-500 !border-[3px] !border-slate-800 !w-2.5 !h-2.5 !shadow-lg !shadow-blue-500/50"
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="font-bold text-[13px] text-slate-100">
            Input
          </div>

          <div
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${isEmpty
              ? "text-slate-400 bg-slate-700/50 border-slate-600"
              : "text-blue-300 bg-blue-500/10 border-blue-500/20"
              }`}
          >
            {isEmpty ? "Empty" : "Set"}
          </div>
        </div>

        {/* Preview value */}
        {!isEmpty && (
          <div className="text-xs font-semibold text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-700 mb-2 font-mono whitespace-pre-wrap max-h-[120px] overflow-y-auto scrollable">
            {String(data.value)}
          </div>
        )}

        {/* Textarea field */}
        <div className="flex gap-1.5 items-stretch">
          <textarea
            aria-label={`input-value-${id}`}
            value={data.value ?? ""}
            onChange={handleChange}
            placeholder="Type here..."
            className="flex-1 min-h-[80px] p-2.5 rounded-md border border-slate-700 outline-none text-[13px] font-medium bg-slate-900 text-slate-200 resize-both overflow-auto whitespace-pre-wrap font-mono transition-all focus:border-blue-500 focus:bg-slate-950 focus:ring-1 focus:ring-blue-500/50"
          />

          <button
            onClick={handleClear}
            title="Clear value"
            aria-label={`clear-${id}`}
            className="border border-slate-700 bg-slate-900 cursor-pointer text-base w-9 h-9 rounded-md grid place-items-center text-slate-400 transition-all font-bold self-start hover:bg-blue-600 hover:text-white hover:border-blue-500"
          >
            ↻
          </button>
        </div>

        {/* Output handle (bottom) */}
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-emerald-500 !border-[3px] !border-slate-800 !w-2.5 !h-2.5 !shadow-lg !shadow-emerald-500/50"
        />
      </div>
    </div>
  );
}
