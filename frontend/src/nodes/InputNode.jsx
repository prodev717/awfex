import { Handle, Position } from "reactflow";
import { MdDelete, MdEdit } from "react-icons/md";
import { useState } from "react";

export default function InputNode({ id, data }) {
  const [showModal, setShowModal] = useState(false);
  const [tempValue, setTempValue] = useState(data.value ?? "");

  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete?.(id);
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setTempValue(data.value ?? "");
    setShowModal(true);
  };

  const handleSave = () => {
    data.onValueChange?.(id, tempValue);
    setShowModal(false);
  };

  const handleCancel = () => {
    setTempValue(data.value ?? "");
    setShowModal(false);
  };

  const isEmpty =
    data.value === "" || data.value === null || data.value === undefined;

  return (
    <>
      <div className="relative group">
        <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-3 bg-slate-900/95 backdrop-blur-sm text-slate-100 px-4 py-3 rounded-lg text-xs font-medium whitespace-pre-wrap pointer-events-none opacity-0 transition-all duration-300 z-50 leading-relaxed w-max max-w-[320px] shadow-2xl border border-blue-500/30 group-hover:opacity-100 group-hover:translate-y-2">
          <div className="text-blue-400 font-semibold mb-1 text-[10px] uppercase tracking-wide">Description</div>
          <div className="text-slate-200">This node is used to give inputs to the other function nodes. It always outputs a string.</div>
        </div>

        <div
          role="group"
          aria-label={`input-node-${id}`}
          onClick={handleOpenModal}
          className="relative bg-slate-800 border-2 border-blue-500/60 rounded-lg p-4 w-[180px] min-h-[60px] flex flex-col items-center justify-center gap-1.5 shadow-lg transition-all duration-200 select-none cursor-pointer hover:shadow-2xl hover:shadow-blue-500/40 hover:border-blue-400/80"
        >
          <button
            onClick={handleDelete}
            title="Delete node"
            aria-label={`delete-${id}`}
            className="absolute -top-2.5 -right-2.5 border-none bg-red-500 text-white rounded-full w-7 h-7 cursor-pointer text-base font-bold grid place-items-center shadow-md shadow-red-500/30 transition-opacity duration-200 z-20 opacity-0 group-hover:opacity-100 hover:bg-red-600"
          >
            <MdDelete size={16} />
          </button>

          <Handle
            type="target"
            position={Position.Top}
            className="!bg-indigo-500 !border-[3px] !border-slate-800 !w-2.5 !h-2.5 !shadow-lg !shadow-indigo-500/50"
          />

          <div className="font-bold text-[15px] text-slate-100 text-center tracking-tight leading-snug capitalize">
            Input
          </div>

          <div className="text-[11px] font-medium text-slate-400 text-center leading-snug flex items-center gap-1">
            <MdEdit size={14} />
            Click to edit
          </div>

          <div className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${isEmpty
            ? "text-slate-400 bg-slate-700/50 border-slate-600"
            : "text-blue-300 bg-blue-500/10 border-blue-500/20"
            }`}>
            {isEmpty ? "Empty" : "Set"}
          </div>

          <Handle
            type="source"
            position={Position.Bottom}
            className="!bg-emerald-500 !border-[3px] !border-slate-800 !w-2.5 !h-2.5 !shadow-lg !shadow-emerald-500/50"
          />
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[1000]"
          onClick={handleCancel}
        >
          <div
            className="bg-slate-900 rounded-xl p-6 w-[700px] max-w-[90vw] h-[400px] max-h-[90vh] shadow-2xl border border-slate-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-lg font-bold text-slate-100">Edit Input Value</h3>
              <button
                onClick={handleCancel}
                className="bg-transparent border-none text-2xl text-slate-500 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all hover:bg-slate-800 hover:text-slate-300"
              >
                ×
              </button>
            </div>

            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="Type your input here..."
              className="flex-1 overflow-auto bg-slate-950 rounded-md p-3 font-mono text-sm text-slate-100 border border-slate-800 m-0 scrollable resize-none outline-none focus:border-indigo-500 transition-colors"
              spellCheck={false}
              autoFocus
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 px-4 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-sm font-semibold cursor-pointer transition-all hover:bg-slate-700 hover:border-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 rounded-lg border border-indigo-500 bg-indigo-600 text-white text-sm font-semibold cursor-pointer transition-all hover:bg-indigo-500 hover:border-indigo-400 shadow-lg shadow-indigo-500/20"
              >
                Save
              </button>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-800 p-2.5 rounded-md border border-slate-700 mt-3">
              <strong>Tip:</strong> This input will be passed as a string to connected function nodes.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
