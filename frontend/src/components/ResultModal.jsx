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
                                    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-slate-100 mt-6 mb-4 border-b border-slate-800 pb-2" {...props} />,
                                    h2: ({ ...props }) => <h2 className="text-xl font-bold text-slate-200 mt-5 mb-3" {...props} />,
                                    h3: ({ ...props }) => <h3 className="text-lg font-semibold text-emerald-400 mt-4 mb-2" {...props} />,
                                    h4: ({ ...props }) => <h4 className="text-base font-semibold text-slate-300 mt-3 mb-2" {...props} />,
                                    h5: ({ ...props }) => <h5 className="text-sm font-semibold text-slate-400 mt-2 mb-1" {...props} />,
                                    h6: ({ ...props }) => <h6 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 mb-1" {...props} />,
                                    p: ({ ...props }) => <p className="text-slate-300 leading-relaxed mb-4 text-sm" {...props} />,
                                    ul: ({ ...props }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-slate-300 text-sm" {...props} />,
                                    ol: ({ ...props }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-slate-300 text-sm" {...props} />,
                                    li: ({ ...props }) => <li className="pl-1" {...props} />,
                                    a: ({ ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-slate-700 pl-4 py-1 my-4 bg-slate-900/50 italic text-slate-400 rounded-r text-sm" {...props} />,
                                    code: ({ inline, ...props }) =>
                                        inline ? (
                                            <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-700/50" {...props} />
                                        ) : (
                                            <code className="block w-full font-mono text-xs text-blue-300 bg-transparent p-0" {...props} />
                                        ),
                                    pre: ({ ...props }) => (
                                        <div className="relative my-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                                            <div className="absolute top-2 right-2 flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                                            </div>
                                            <pre className="p-4 pt-8 overflow-x-auto" {...props} />
                                        </div>
                                    ),
                                    table: ({ ...props }) => <div className="overflow-x-auto my-6 rounded-lg border border-slate-800"><table className="w-full text-left text-sm text-slate-300" {...props} /></div>,
                                    thead: ({ ...props }) => <thead className="bg-slate-900 text-slate-200 uppercase text-xs font-semibold" {...props} />,
                                    tbody: ({ ...props }) => <tbody className="divide-y divide-slate-800" {...props} />,
                                    tr: ({ ...props }) => <tr className="hover:bg-slate-800/50 transition-colors" {...props} />,
                                    th: ({ ...props }) => <th className="px-4 py-3 whitespace-nowrap" {...props} />,
                                    td: ({ ...props }) => <td className="px-4 py-3 whitespace-nowrap" {...props} />,
                                    hr: ({ ...props }) => <hr className="my-8 border-slate-800" {...props} />,
                                    img: ({ ...props }) => <img className="rounded-lg border border-slate-800 my-4 max-w-full h-auto" {...props} />,
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
