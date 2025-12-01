import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ResultModal({ isOpen, onClose, result, error }) {
    const [viewMode, setViewMode] = useState("raw"); // "markdown" or "raw"
    const [copyFeedback, setCopyFeedback] = useState(false);

    if (!isOpen) return null;

    const contentText = error
        ? error
        : (typeof result === 'string' ? result : JSON.stringify(result, null, 2));

    const handleCopy = () => {
        navigator.clipboard.writeText(contentText);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === "markdown" ? "raw" : "markdown");
    };

    return (
        <div
            className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 text-slate-200 rounded-lg p-6 w-[90%] max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-700/50 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-700/50">
                    <h2 className={`m-0 text-xl font-semibold ${error ? 'text-red-400 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent' : 'text-emerald-400 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent'}`}>
                        {error ? "⚠️ Execution Failed" : "✓ Execution Successful"}
                    </h2>
                    <div className="flex gap-2 items-center">
                        {!error && (
                            <button
                                onClick={toggleViewMode}
                                className="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-md cursor-pointer text-sm transition-all duration-200 hover:bg-slate-700 hover:border-slate-600 hover:shadow-md active:scale-95"
                            >
                                {viewMode === "markdown" ? "📝 Raw" : "📄 Markdown"}
                            </button>
                        )}
                        <button
                            onClick={handleCopy}
                            className={`px-3 py-1.5 border rounded-md cursor-pointer text-sm transition-all duration-200 active:scale-95 ${copyFeedback
                                    ? 'bg-emerald-500 text-slate-900 border-emerald-500 font-semibold shadow-lg shadow-emerald-500/30'
                                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:border-slate-600 hover:shadow-md'
                                }`}
                        >
                            {copyFeedback ? "✓ Copied!" : "📋 Copy"}
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-transparent border-none text-slate-500 cursor-pointer text-2xl px-2 transition-all duration-200 hover:text-slate-300 hover:rotate-90 active:scale-90"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto mb-4 scrollable">
                    {error ? (
                        <div className="text-red-400 p-4 bg-red-950/30 border border-red-900/50 rounded-md backdrop-blur-sm">
                            <strong className="font-semibold">Error:</strong> {error}
                        </div>
                    ) : viewMode === "markdown" ? (
                        <div className="bg-slate-950 p-4 rounded-md overflow-x-auto text-sm text-slate-200 border border-slate-800">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-emerald-400 font-bold text-2xl my-2" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-emerald-400 font-semibold text-xl my-2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-emerald-400 font-semibold text-lg my-2" {...props} />,
                                    code: ({ node, inline, ...props }) =>
                                        inline ? (
                                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-sm" {...props} />
                                        ) : (
                                            <code className="block bg-slate-900 p-3 rounded overflow-x-auto text-blue-300 font-mono text-sm border border-slate-800" {...props} />
                                        ),
                                    pre: ({ node, ...props }) => <pre className="bg-slate-900 p-3 rounded overflow-x-auto border border-slate-800 my-2" {...props} />,
                                    a: ({ node, ...props }) => <a className="text-blue-400 underline hover:text-blue-300 transition-colors" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="ml-6 list-disc" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="ml-6 list-decimal" {...props} />,
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                    p: ({ node, ...props }) => <p className="my-2" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="text-yellow-300 font-semibold" {...props} />,
                                    em: ({ node, ...props }) => <em className="text-blue-300 italic" {...props} />,
                                }}
                            >
                                {contentText}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <pre className="bg-slate-950 p-4 rounded-md overflow-x-auto font-mono text-sm m-0 text-blue-300 whitespace-pre-wrap break-words border border-slate-800">
                            {contentText}
                        </pre>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-md cursor-pointer transition-all duration-200 hover:bg-slate-700 hover:border-slate-600 hover:shadow-lg active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
