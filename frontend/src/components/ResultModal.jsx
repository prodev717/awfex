import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ResultModal({ isOpen, onClose, result, error }) {
  const [viewMode, setViewMode] = useState("raw"); // "markdown" | "raw"
  const [copyFeedback, setCopyFeedback] = useState(false);

  if (!isOpen) return null;

  const contentText =
    error != null
      ? String(error)
      : typeof result === "string"
      ? result
      : JSON.stringify(result, null, 2);

  const handleCopy = () => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(contentText);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "markdown" ? "raw" : "markdown"));
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-900 text-slate-200 rounded-xl p-8 w-[90%] max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-700/50 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800 flex-shrink-0">
          <h2
            className={`m-0 text-2xl font-bold ${
              error
                ? "text-red-400 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                : "text-indigo-400 bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 bg-clip-text text-transparent"
            }`}
          >
            {error ? "⚠️ Execution Failed" : "✓ Execution Successful"}
          </h2>
          <div className="flex gap-3 items-center">
            {!error && (
              <button
                onClick={toggleViewMode}
                className="px-4 py-2 bg-slate-800/50 text-slate-300 border border-slate-700/50 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:bg-slate-700/70 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/50 active:scale-95 backdrop-blur-sm"
                title="Toggle Markdown/Raw view"
              >
                {viewMode === "markdown" ? "📝 Raw View" : "📄 Markdown"}
              </button>
            )}
            <button
              onClick={handleCopy}
              className={`px-4 py-2 border-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 active:scale-95 backdrop-blur-sm ${
                copyFeedback
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/40 font-bold"
                  : "bg-slate-800/50 text-slate-200 border-slate-700/50 hover:bg-slate-700/70 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/50"
              }`}
              title="Copy to clipboard"
            >
              {copyFeedback ? "✓ Copied!" : "📋 Copy Result"}
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800/50 hover:bg-slate-700/70 p-2 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer text-xl transition-all duration-200 hover:rotate-90 active:scale-90 hover:shadow-md border border-slate-700/50 backdrop-blur-sm"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 scroll-smooth pr-3 scrollbar-thin scrollbar-thumb-indigo-600/80 scrollbar-thumb-rounded scrollbar-track-slate-900/50 scrollbar-track-rounded scrollbar-hover:indigo-600/90 hover:scrollbar-thumb-indigo-600/90">
          {error ? (
            <div className="text-red-300 p-6 bg-gradient-to-br from-red-900/20 to-red-950/30 border border-red-900/40 rounded-xl backdrop-blur-md text-sm leading-relaxed shadow-lg shadow-red-950/50 max-w-none">
              <div className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="text-2xl">⚠️</span> Error Details
              </div>
              <pre className="mt-3 font-mono text-red-200 bg-red-950/20 p-3 rounded-lg border border-red-900/30 whitespace-pre-wrap break-words text-xs overflow-x-auto">
                {error}
              </pre>
            </div>
          ) : viewMode === "markdown" ? (
            <div className="prose prose-slate max-w-none prose-headings:!font-bold prose-headings:!scroll-mt-20 prose-a:!no-underline prose-pre:!bg-slate-900/90 prose-pre:!backdrop-blur-sm prose-code:!bg-slate-900/80 prose-code:!backdrop-blur prose-code:!px-1.5 prose-code:!py-0.5 prose-code:!text-xs prose-hr:!border-slate-700 prose-table:!border-slate-800 prose-th:!bg-slate-900/50">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  [
                    rehypeSanitize,
                    {
                      clobberNobr: true,
                      allowElements: [
                        "a",
                        "p",
                        "br",
                        "span",
                        "em",
                        "strong",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "h6",
                        "ul",
                        "ol",
                        "li",
                        "code",
                        "pre",
                        "blockquote",
                        "hr",
                        "table",
                        "thead",
                        "tbody",
                        "tr",
                        "th",
                        "td",
                        "img",
                      ],
                    },
                  ],
                ]}
                remarkRehypeOptions={{
                  passThrough: [
                    "element",
                    "table",
                    "thead",
                    "tbody",
                    "tr",
                    "th",
                    "td",
                    "caption",
                  ],
                }}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-bold text-slate-100 mt-8 mb-4 border-b border-slate-800/50 pb-4 bg-gradient-to-r from-slate-100/10 to-transparent rounded-t-xl -mx-4 px-6 pt-6 backdrop-blur-sm scroll-mt-24"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-bold text-slate-100 mt-8 mb-4 pt-1 border-l-4 border-indigo-500/50 pl-4 bg-slate-900/50 rounded-r-lg backdrop-blur-sm scroll-mt-24"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-bold text-indigo-300 mt-6 mb-3 pl-3 border-l-3 border-indigo-500/60 bg-indigo-500/5 rounded-r-md py-1.5 backdrop-blur-sm scroll-mt-20"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-lg font-semibold text-slate-200 mt-5 mb-2 pl-2 border-l-2 border-slate-400/50 scroll-mt-16" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-slate-300 leading-7 mb-4 text-base max-w-3xl"
                      style={{ whiteSpace: "normal", lineHeight: "1.75" }}
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-8 mb-4 space-y-2 text-slate-300 text-base marker:text-indigo-400 marker:font-bold" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-8 mb-4 space-y-2 text-slate-300 text-base marker:text-indigo-400 marker:font-bold" {...props} />
                  ),
                  li: ({ node, ...props }) => <li className="pl-2 py-1 leading-relaxed" {...props} />,
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-slate-100" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-slate-200" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 decoration-2 decoration-indigo-400/50 hover:decoration-indigo-300/70 transition-all duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-indigo-500/40 bg-gradient-to-r from-indigo-500/5 to-slate-900/50 pl-6 py-4 my-6 italic text-slate-200 rounded-r-xl backdrop-blur-md shadow-sm shadow-indigo-500/10 font-medium" {...props} />
                  ),
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const text = String(children).trim();

                    // Auto-format ISO timestamps
                    if (!inline && text.match(/^\d{4}-\d{2}-\d{2}T/)) {
                      const date = new Date(text);
                      const formatted = date.toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                        timeZoneName: "short",
                      });
                      return (
                        <div className="my-4 p-4 bg-gradient-to-r from-indigo-900/30 to-slate-900/50 rounded-xl border border-indigo-800/50">
                          <div className="text-indigo-300 font-mono text-sm mb-1">{text}</div>
                          <div className="text-slate-400 text-xs font-medium">{formatted}</div>
                        </div>
                      );
                    }

                    if (!inline && match) {
                      return (
                        <div className="my-6 rounded-xl overflow-hidden border border-slate-800/50 shadow-xl shadow-slate-900/20 backdrop-blur-md max-w-none">
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: "inherit",
                              background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
                              fontSize: "0.8125rem",
                              lineHeight: "1.65",
                              border: "1px solid #334155",
                              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                            }}
                            wrapLongLines
                            showLineNumbers={false}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }

                    return (
                      <code
                        className={className}
                        style={{
                          display: "inline",
                          backgroundColor: "rgba(15, 23, 42, 0.85)",
                          color: "#4f46e5",
                          padding: "0.125em 0.375em",
                          margin: "0 0.125em",
                          borderRadius: "0.375rem",
                          fontSize: "0.85em",
                          fontWeight: "500",
                          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                          border: "1px solid rgba(79, 70, 229, 0.2)",
                          backdropFilter: "blur(10px)",
                          boxShadow: "0 0 0 1px rgba(79, 70, 229, 0.1)",
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-8 rounded-xl border border-slate-800/50 shadow-xl shadow-slate-900/20 backdrop-blur-md w-full">
                      <table className="w-full text-sm min-w-full table-auto border-collapse border-spacing-0" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-gradient-to-r from-slate-900/80 to-slate-800/50 backdrop-blur-md text-slate-100 uppercase text-xs font-bold tracking-wider" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody className="divide-y divide-slate-800/50 text-slate-300" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="hover:bg-slate-800/30 transition-all duration-150 border-b border-slate-800/30 last:border-b-0" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="px-6 py-4 text-left font-bold whitespace-nowrap backdrop-blur-sm bg-slate-900/50 border border-slate-800/50" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-6 py-4 align-top border border-slate-800/30" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <div className="my-8 flex justify-center">
                      <img
                        className="rounded-2xl border-2 border-slate-800/50 shadow-2xl shadow-slate-900/30 max-w-full h-auto backdrop-blur-md hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 mx-auto"
                        {...props}
                      />
                    </div>
                  ),
                  hr: () => (
                    <hr className="my-12 border-slate-800/50 border-t-2 bg-gradient-to-r from-slate-800/30 via-indigo-500/20 to-slate-800/30 rounded-full h-px shadow-inner" />
                  ),
                }}
              >
                {contentText}
              </ReactMarkdown>
            </div>
          ) : (
            <pre className="bg-gradient-to-br from-slate-950/90 to-slate-900/90 p-6 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed border border-slate-800/50 shadow-2xl shadow-slate-900/30 backdrop-blur-xl whitespace-pre-wrap break-words m-0 text-indigo-300 font-medium text-base max-h-full custom-scrollbar">
              {contentText}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 pb-2 border-t border-slate-800/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 border border-slate-700/50 rounded-xl cursor-pointer font-semibold text-sm uppercase tracking-wide transition-all duration-200 hover:from-slate-700 hover:to-slate-600 hover:shadow-xl hover:shadow-slate-900/50 hover:border-slate-600 active:scale-95 backdrop-blur-sm"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
}
