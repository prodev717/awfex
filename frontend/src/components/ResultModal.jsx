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
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                backdropFilter: "blur(2px)",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "#1e1e1e",
                    color: "#e0e0e0",
                    borderRadius: "8px",
                    padding: "20px",
                    width: "80%",
                    maxWidth: "600px",
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                    border: "1px solid #333",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                        borderBottom: "1px solid #333",
                        paddingBottom: "10px",
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: "1.2rem", color: error ? "#ff6b6b" : "#69db7c" }}>
                        {error ? "Execution Failed" : "Execution Successful"}
                    </h2>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        {!error && (
                            <button
                                onClick={toggleViewMode}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#2d2d2d",
                                    color: "#e0e0e0",
                                    border: "1px solid #444",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.85rem",
                                    transition: "all 0.2s",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#3d3d3d";
                                    e.target.style.borderColor = "#555";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = "#2d2d2d";
                                    e.target.style.borderColor = "#444";
                                }}
                            >
                                {viewMode === "markdown" ? "📝 Raw" : "📄 Markdown"}
                            </button>
                        )}
                        <button
                            onClick={handleCopy}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: copyFeedback ? "#69db7c" : "#2d2d2d",
                                color: copyFeedback ? "#1e1e1e" : "#e0e0e0",
                                border: `1px solid ${copyFeedback ? "#69db7c" : "#444"}`,
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                transition: "all 0.2s",
                                fontWeight: copyFeedback ? "600" : "normal",
                            }}
                            onMouseOver={(e) => {
                                if (!copyFeedback) {
                                    e.target.style.backgroundColor = "#3d3d3d";
                                    e.target.style.borderColor = "#555";
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!copyFeedback) {
                                    e.target.style.backgroundColor = "#2d2d2d";
                                    e.target.style.borderColor = "#444";
                                }
                            }}
                        >
                            {copyFeedback ? "✓ Copied!" : "📋 Copy"}
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#888",
                                cursor: "pointer",
                                fontSize: "1.5rem",
                                padding: "0 5px",
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", marginBottom: "15px" }}>
                    {error ? (
                        <div style={{ color: "#ff6b6b", padding: "10px", backgroundColor: "rgba(255, 107, 107, 0.1)", borderRadius: "4px" }}>
                            <strong>Error:</strong> {error}
                        </div>
                    ) : viewMode === "markdown" ? (
                        <div
                            style={{
                                backgroundColor: "#111",
                                padding: "15px",
                                borderRadius: "4px",
                                overflowX: "auto",
                                fontSize: "0.9rem",
                                color: "#e0e0e0",
                            }}
                            className="markdown-content"
                        >
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 style={{ color: "#69db7c", marginTop: "0.5em", marginBottom: "0.5em" }} {...props} />,
                                    h2: ({ node, ...props }) => <h2 style={{ color: "#69db7c", marginTop: "0.5em", marginBottom: "0.5em" }} {...props} />,
                                    h3: ({ node, ...props }) => <h3 style={{ color: "#69db7c", marginTop: "0.5em", marginBottom: "0.5em" }} {...props} />,
                                    code: ({ node, inline, ...props }) =>
                                        inline ? (
                                            <code style={{ backgroundColor: "#2d2d2d", padding: "2px 6px", borderRadius: "3px", color: "#a5d8ff" }} {...props} />
                                        ) : (
                                            <code style={{ display: "block", backgroundColor: "#0d0d0d", padding: "10px", borderRadius: "4px", overflowX: "auto", color: "#a5d8ff" }} {...props} />
                                        ),
                                    pre: ({ node, ...props }) => <pre style={{ backgroundColor: "#0d0d0d", padding: "10px", borderRadius: "4px", overflowX: "auto" }} {...props} />,
                                    a: ({ node, ...props }) => <a style={{ color: "#4dabf7", textDecoration: "underline" }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ marginLeft: "1.5em" }} {...props} />,
                                    ol: ({ node, ...props }) => <ol style={{ marginLeft: "1.5em" }} {...props} />,
                                    li: ({ node, ...props }) => <li style={{ marginBottom: "0.3em" }} {...props} />,
                                    p: ({ node, ...props }) => <p style={{ marginTop: "0.5em", marginBottom: "0.5em" }} {...props} />,
                                    strong: ({ node, ...props }) => <strong style={{ color: "#ffd43b" }} {...props} />,
                                    em: ({ node, ...props }) => <em style={{ color: "#a5d8ff" }} {...props} />,
                                }}
                            >
                                {contentText}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <pre
                            style={{
                                backgroundColor: "#111",
                                padding: "15px",
                                borderRadius: "4px",
                                overflowX: "auto",
                                fontFamily: "monospace",
                                fontSize: "0.9rem",
                                margin: 0,
                                color: "#a5d8ff",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        >
                            {contentText}
                        </pre>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#333",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "background 0.2s",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#444")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
