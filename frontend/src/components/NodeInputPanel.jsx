import { useState, useEffect } from "react";

export default function NodeInputPanel({
    isOpen,
    onClose,
    onSave,
    title = "Edit Input",
    value = "",
    placeholder = "Type your input here..."
}) {
    const [tempValue, setTempValue] = useState(value);

    // Update tempValue when value prop changes
    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleSave = () => {
        onSave(tempValue);
    };

    const handleCancel = () => {
        setTempValue(value);
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleBackdropClick}
        >
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[500px] bg-slate-900 shadow-2xl border-l border-slate-700 flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h3 className="m-0 text-xl font-bold text-slate-100">{title}</h3>
                    <button
                        onClick={handleCancel}
                        className="bg-transparent border-none text-3xl text-slate-500 cursor-pointer p-0 w-10 h-10 flex items-center justify-center rounded-md transition-all hover:bg-slate-800 hover:text-slate-300"
                        aria-label="Close panel"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                    <textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-full min-h-[400px] overflow-auto bg-slate-950 rounded-md p-4 font-mono text-base text-slate-100 border border-slate-700 m-0 scrollable resize-none outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        spellCheck={false}
                        autoFocus
                    />
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-700">
                    <button
                        onClick={handleCancel}
                        className="flex-1 py-3 px-4 rounded-md border border-slate-600 bg-slate-800 text-slate-200 text-sm font-semibold cursor-pointer transition-all hover:bg-slate-700 hover:border-slate-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 px-4 rounded-md border border-indigo-500 bg-indigo-600 text-white text-sm font-semibold cursor-pointer transition-all hover:bg-indigo-500 hover:border-indigo-400 shadow-lg shadow-indigo-500/20"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
