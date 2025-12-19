import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MdAdd, MdDelete, MdClose, MdLink, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export default function FunctionInputPanel({
    isOpen,
    onClose,
    onSave,
    functionName = "Function",
    nodeName = "",
    functionMetadata = {},
    availableInputs = [], // Array of {id, name, type} for connected nodes
    currentMappings = [], // Current parameter mappings
    description = ""
}) {
    const [currentNodeName, setCurrentNodeName] = useState(nodeName);
    const [parameterMappings, setParameterMappings] = useState([]);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

    // Initialize parameter mappings
    useEffect(() => {
        if (isOpen) {
            setCurrentNodeName(nodeName || functionName);

            const paramNames = functionMetadata.parameters || [];
            const hasVariableParams = functionMetadata.hasVariableParams;
            const variableParamName = functionMetadata.variableParamName || "Argument";

            // Start with a copy of current mappings
            let newMappings = [];

            // If we have existing mappings, try to use them
            if (currentMappings && currentMappings.length > 0) {
                // If variable params, trust the existing length
                // If fixed params, ensure we cover at least the required ones
                const count = hasVariableParams ? Math.max(currentMappings.length, paramNames.length) : paramNames.length;

                for (let i = 0; i < count; i++) {
                    const existing = currentMappings[i];
                    let defaultName = paramNames[i];

                    if (!defaultName) {
                        // Generate name for variable arguments
                        // If we have fixed params, continue the index, otherwise use regular indexing
                        defaultName = `${variableParamName} ${i + 1}`;
                    }

                    if (existing) {
                        newMappings.push({ ...existing, paramName: existing.paramName || defaultName });
                    } else {
                        // Filling a gap
                        newMappings.push({
                            paramName: defaultName,
                            sourceType: 'manual',
                            sourceNodeId: null,
                            manualValue: '',
                        });
                    }
                }
            } else {
                // No existing mappings, initialize from defaults
                // If paramNames is empty but hasVariableParams is true, maybe start with 2?
                // The original code assumed paramNames had something. 
                // If paramNames is empty, we should probably add at least 2 for variable params functions usually (like add)
                // But let's respect paramNames length if > 0. 

                let initialCount = paramNames.length;
                if (initialCount === 0 && hasVariableParams) {
                    initialCount = 2; // Default to 2 inputs for vararg functions with no explicit params
                }

                for (let i = 0; i < initialCount; i++) {
                    let paramName = paramNames[i];
                    if (!paramName) {
                        paramName = `${variableParamName} ${i + 1}`;
                    }

                    // Auto-map first available input to first parameter
                    if (i === 0 && availableInputs.length > 0) {
                        newMappings.push({
                            paramName,
                            sourceType: 'node',
                            sourceNodeId: availableInputs[0].id,
                            manualValue: '',
                        });
                    } else {
                        // Default to manual input
                        newMappings.push({
                            paramName,
                            sourceType: 'manual',
                            sourceNodeId: null,
                            manualValue: '',
                        });
                    }
                }
            }

            setParameterMappings(newMappings);
        }
    }, [isOpen, functionMetadata, nodeName, functionName, availableInputs, currentMappings]);

    const handleSourceTypeChange = (index, newSourceType, nodeId = null) => {
        setParameterMappings(prev => prev.map((mapping, i) =>
            i === index ? {
                ...mapping,
                sourceType: newSourceType,
                sourceNodeId: newSourceType === 'node' ? nodeId : null,
                manualValue: newSourceType === 'manual' ? mapping.manualValue : '',
            } : mapping
        ));
    };

    const handleManualValueChange = (index, value) => {
        setParameterMappings(prev => prev.map((mapping, i) =>
            i === index ? { ...mapping, manualValue: value } : mapping
        ));
    };

    const handleAddArgument = () => {
        const newIndex = parameterMappings.length;
        const i = newIndex;
        const paramNames = functionMetadata.parameters || [];
        const variableParamName = functionMetadata.variableParamName || "Argument";

        let paramName = paramNames[i];
        if (!paramName) {
            paramName = `${variableParamName} ${i + 1}`;
        }

        setParameterMappings([...parameterMappings, {
            paramName: paramName,
            sourceType: 'manual',
            sourceNodeId: null,
            manualValue: '',
        }]);
    };

    const handleRemoveArgument = (index) => {
        setParameterMappings(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        onSave(parameterMappings, currentNodeName);
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className={`fixed top-12 right-0 h-[calc(100%-3rem)] w-full max-w-[400px] bg-slate-900 shadow-2xl border-l border-slate-700 flex flex-col transition-transform duration-300 ease-out transform z-[999] ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            {/* Header */}
            <div className="flex flex-col p-4 border-b border-slate-700 bg-slate-800 gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={currentNodeName}
                            onChange={(e) => setCurrentNodeName(e.target.value)}
                            className="w-full bg-transparent text-lg font-bold text-slate-100 outline-none border-none"
                            placeholder="Node name"
                        />
                        <div className="text-xs text-slate-400 mt-0.5">{functionName}</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                    >
                        <MdClose size={24} />
                    </button>
                </div>
                {description && (
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors self-start"
                        >
                            <span>Description</span>
                            {isDescriptionOpen ? <MdKeyboardArrowUp size={14} /> : <MdKeyboardArrowDown size={14} />}
                        </button>
                        {isDescriptionOpen && (
                            <div className="whitespace-pre-line text-xs text-slate-300 bg-slate-700/50 p-2 rounded border border-slate-600/50 leading-relaxed transition-all">
                                {description}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-500/80 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-indigo-400">
                <div className="space-y-6">
                    {parameterMappings.map((mapping, index) => {
                        // Check if this param is required/fixed (from metadata)
                        const requiredParamsCount = (functionMetadata.parameters || []).length;
                        // Always allow deleting if variable params and index >= required
                        const canDelete = functionMetadata.hasVariableParams && index >= requiredParamsCount;

                        return (
                            <div key={index} className="space-y-2 pb-2 border-b border-slate-800/50 last:border-0">
                                {/* Parameter Label & Controls */}
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-300 block">
                                        {mapping.paramName}
                                    </label>
                                    {canDelete && (
                                        <button
                                            onClick={() => handleRemoveArgument(index)}
                                            className="text-slate-500 hover:text-red-400 transition-colors"
                                            title="Remove Argument"
                                        >
                                            <MdDelete size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Source Type Selector */}
                                <div className="relative">
                                    <select
                                        value={mapping.sourceType === 'node' ? mapping.sourceNodeId || 'manual' : mapping.sourceType}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === 'manual') {
                                                handleSourceTypeChange(index, 'manual');
                                            } else if (value === 'null') {
                                                handleSourceTypeChange(index, 'null');
                                            } else {
                                                handleSourceTypeChange(index, 'node', value);
                                            }
                                        }}
                                        className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-md p-2 pr-8 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="manual">Manual Input</option>
                                        <option value="null">Null</option>
                                        {availableInputs.map(input => (
                                            <option key={input.id} value={input.id}>
                                                ← {input.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        ▼
                                    </div>
                                </div>

                                {/* Value Input */}
                                {mapping.sourceType === 'manual' ? (
                                    <textarea
                                        value={mapping.manualValue}
                                        onChange={(e) => handleManualValueChange(index, e.target.value)}
                                        placeholder={`Value for ${mapping.paramName}`}
                                        className="w-full bg-slate-950 rounded-md p-2 text-slate-100 border border-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm min-h-[80px] resize-y"
                                    />
                                ) : mapping.sourceType === 'null' ? (
                                    <div className="flex items-center justify-center p-2 bg-slate-900/50 border border-slate-700/50 rounded-md text-slate-500 italic text-sm h-[80px]">
                                        value is null
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-md">
                                        <MdLink className="text-indigo-400" size={16} />
                                        <span className="text-sm text-indigo-300 truncate">
                                            {availableInputs.find(i => i.id === mapping.sourceNodeId)?.name || 'Unknown Node'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {functionMetadata.hasVariableParams && (
                        <button
                            onClick={handleAddArgument}
                            className="w-full py-2 px-4 rounded-md border border-dashed border-slate-600 bg-slate-800/50 text-slate-300 text-sm font-semibold cursor-pointer transition-all hover:bg-slate-800 hover:border-slate-500 flex items-center justify-center gap-2"
                        >
                            <MdAdd size={18} />
                            Add Argument
                        </button>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-slate-700 bg-slate-800">
                <button
                    onClick={onClose}
                    className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors font-medium"
                >
                    Save
                </button>
            </div>
        </div>,
        document.body
    );
}
