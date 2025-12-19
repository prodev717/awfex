import { Handle, Position, useReactFlow } from "reactflow";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import FunctionInputPanel from "../components/FunctionInputPanel";
import {
  MdAdd,
  MdRemove,
  MdClose,
  MdCode,
  MdDataObject,
  MdFilterAlt,
  MdHttp,
  MdStorage,
  MdTimer,
  MdPrint,
  MdAutoAwesome,
  MdCalculate
} from "react-icons/md";
import { TbMathFunction } from "react-icons/tb";

export default function FunctionNode({ id, data }) {
  const { getEdges, getNode } = useReactFlow();
  const [showPanel, setShowPanel] = useState(false);

  // Icon mapping for different function types
  const getIcon = (label) => {
    const iconMap = {
      add: MdAdd,
      sub: MdRemove,
      mul: MdClose,
      div: MdCalculate,
      print: MdPrint,
      code: MdCode,
      jsonParse: MdDataObject,
      jsonStringify: MdDataObject,
      jsonExpression: MdDataObject,
      jsonFilter: MdFilterAlt,
      httpRequest: MdHttp,
      postgres: MdStorage,
      redis: MdStorage,
      wait: MdTimer,
      gemini: MdAutoAwesome,
      array: MdDataObject,
      regex: MdCode,
    };
    const IconComponent = iconMap[label] || TbMathFunction;
    return <IconComponent size={16} />;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete(id);
  };

  const handleOpenPanel = (e) => {
    e.stopPropagation();
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
  };

  const handleSaveArgs = (parameterMappings, nodeName) => {
    data.onArgsChange?.(id, parameterMappings);
    if (nodeName && data.onNameChange) {
      data.onNameChange(id, nodeName);
    }
    setShowPanel(false);
  };

  const getArguments = () => {
    const edges = getEdges();
    const incomingEdges = edges.filter(edge => edge.target === id);

    return incomingEdges.map(edge => {
      const sourceNode = getNode(edge.source);
      if (!sourceNode) return '';

      if (sourceNode.type === 'inputNode' && sourceNode.data?.value !== undefined) {
        const value = String(sourceNode.data.value);
        return value.length > 20 ? `${value.substring(0, 20)}...` : value;
      }

      return sourceNode.data?.label || '';
    }).filter(arg => arg);
  };

  // Get available input nodes for n8n-style selection
  const getAvailableInputs = () => {
    const edges = getEdges();
    const incomingEdges = edges.filter(edge => edge.target === id);

    return incomingEdges.map(edge => {
      const sourceNode = getNode(edge.source);
      if (!sourceNode) return null;

      return {
        id: sourceNode.id,
        name: sourceNode.data?.name || sourceNode.data?.label || `Node ${sourceNode.id}`,
        type: sourceNode.type,
      };
    }).filter(input => input !== null);
  };

  const args = getArguments();
  const availableInputs = getAvailableInputs();

  return (
    <>
      <div className="relative group">
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 translate-y-3 bg-slate-900/95 backdrop-blur-sm text-slate-100 px-4 py-3 rounded text-xs font-medium whitespace-pre-wrap pointer-events-auto opacity-0 transition-all duration-300 z-50 leading-relaxed w-max max-w-[250px] max-h-[150px] overflow-y-auto shadow-2xl border border-blue-500/30 group-hover:opacity-100 group-hover:translate-y-2 hover:opacity-100 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-500/80 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-indigo-400"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="text-blue-400 font-semibold mb-1 text-[10px] uppercase tracking-wide">Description</div>
          <div className="text-slate-200">{data.tooltip ?? "No Description Available"}</div>
        </div>

        <div
          role="group"
          aria-label={`function-node-${id}`}
          onDoubleClick={handleOpenPanel}
          className="relative bg-slate-800 border-2 border-indigo-500/60 rounded p-3 w-[200px] min-h-[60px] flex flex-col items-start justify-center gap-1.5 shadow-lg transition-all duration-200 select-none cursor-grab hover:shadow-2xl hover:shadow-indigo-500/40 hover:border-indigo-400/80"
        >
          <div className="absolute -top-3 -right-3 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleDelete}
              title="Delete node"
              aria-label={`delete-function-${id}`}
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

          <div className="flex items-center gap-1.5 w-full">
            <div className="text-indigo-400">
              {getIcon(data.label)}
            </div>
            <span className="text-sm font-bold text-slate-100 capitalize truncate">
              {data.label}
            </span>
          </div>
          <hr className="w-full border-slate-700 my-1" />

          {args.length > 0 && (
            <div className="w-full">
              {args.map((arg, index) => (
                <div key={index} className="text-[11px] font-medium text-slate-300 text-left leading-snug w-full overflow-hidden text-ellipsis whitespace-nowrap" title={`${String.fromCharCode(97 + index)}: ${arg}`}>
                  <span className="text-slate-400">{String.fromCharCode(97 + index)}:</span> {arg}
                </div>
              ))}
            </div>
          )}

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
            style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }}
            className="!bg-indigo-500 !border-[3px] !border-slate-800 !w-4 !h-4 !shadow-lg !shadow-indigo-500/50"
          />
        </div>
      </div>

      {showPanel && (
        <FunctionInputPanel
          isOpen={showPanel}
          onClose={handleClosePanel}
          onSave={handleSaveArgs}
          functionName={data.label}
          nodeName={data.name}
          functionMetadata={data.metadata || {}}
          availableInputs={availableInputs}
          currentMappings={data.parameterMappings || []}
        />
      )}
    </>
  );
}
