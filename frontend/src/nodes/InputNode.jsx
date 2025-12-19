import { Handle, Position } from "reactflow";
import { MdDelete, MdEdit, MdInput } from "react-icons/md";
import { useState } from "react";
import FunctionInputPanel from "../components/FunctionInputPanel";

export default function InputNode({ id, data }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete?.(id);
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const isEmpty =
    data.value === "" || data.value === null || data.value === undefined;

  return (
    <>
      <div className="relative group">
        <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-3 bg-slate-900/95 backdrop-blur-sm text-slate-100 px-4 py-3 rounded-lg text-xs font-medium whitespace-pre-wrap pointer-events-none opacity-0 transition-all duration-300 z-50 leading-relaxed w-max max-w-[300px] shadow-2xl border border-blue-500/30 group-hover:opacity-100 group-hover:translate-y-2">
          <div className="text-blue-400 font-semibold mb-1 text-[10px] uppercase tracking-wide">Description</div>
          <div className="text-slate-200">This node is used to give inputs to the other function nodes. It always outputs a string. Note: If only numbers are entered, they will be treated as numbers.</div>
        </div>

        <div
          role="group"
          aria-label={`input-node-${id}`}
          onDoubleClick={handleOpenModal}
          className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500/60 rounded p-3 w-[200px] min-h-[60px] flex flex-col items-start justify-center gap-1.5 shadow-lg transition-all duration-200 select-none cursor-grab hover:shadow-2xl hover:shadow-indigo-500/40 hover:border-indigo-400/80"
        >
          <div className="absolute -top-3 -right-3 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleDelete}
              title="Delete node"
              aria-label={`delete-${id}`}
              className="border-none bg-red-500 text-white rounded-md w-7 h-7 cursor-pointer text-base font-bold grid place-items-center shadow-md shadow-red-500/30 transition-all hover:bg-red-600"
            >
              <MdDelete size={14} />
            </button>
          </div>

          <Handle
            type="target"
            position={Position.Top}
            style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }}
            className="!bg-indigo-500 !border-[3px] !border-slate-800 !w-4 !h-4 !shadow-lg !shadow-indigo-500/50"
          />

          <div className="font-bold text-[15px] text-slate-100 text-left tracking-tight leading-snug capitalize">
            Input
          </div>

          <hr className="w-full border-slate-700 my-1" />

          {isEmpty ? (
            <div className="flex items-center gap-1.5 w-full">
              <div className="text-indigo-400">
                <MdInput size={16} />
              </div>
              <span className="text-sm font-bold text-slate-100">Input</span>
            </div>
          ) : (
            <div className="text-[11px] font-medium text-slate-300 text-left leading-snug w-full overflow-hidden text-ellipsis whitespace-nowrap" title={data.value}>
              {data.value.length > 25 ? `${data.value.substring(0, 25)}...` : data.value}
            </div>
          )}


          <Handle
            type="source"
            position={Position.Bottom}
            style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }}
            className="!bg-indigo-500 !border-[3px] !border-slate-800 !w-4 !h-4 !shadow-lg !shadow-indigo-500/50"
          />
        </div>
      </div>

      {showModal && (
        <FunctionInputPanel
          isOpen={showModal}
          onClose={handleCancel}
          onSave={(values, nodeName) => {
            // For input node, we only use the first value
            data.onValueChange?.(id, values[0] || "");
            if (nodeName && data.onNameChange) {
              data.onNameChange(id, nodeName);
            }
            setShowModal(false);
          }}
          functionName="Input"
          nodeName={data.name}
          connectedArgs={[]}
          manualArgs={[data.value ?? ""]}
        />
      )}
    </>
  );
}
