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

  const isEmpty = data.value === "" || data.value === null || data.value === undefined;

  return (
    <div
      role="group"
      aria-label={`input-node-${id}`}
      style={{
        position: "relative",
        width: "260px",
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "8px",
        padding: "12px 14px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.04)",
        transition: "border-color 200ms ease, box-shadow 200ms ease",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.08), 0 16px 32px rgba(59, 130, 246, 0.06)";
        e.currentTarget.style.borderColor = "#bfdbfe";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.04)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Accent bar at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)",
          borderRadius: "8px 8px 0 0",
        }}
      />

      <button
        onClick={handleDelete}
        title="Delete node"
        aria-label={`delete-${id}`}
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          background: "#ef4444",
          color: "white",
          border: "none",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "700",
          transition: "opacity 200ms ease",
          zIndex: 20,
          opacity: 0.95,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.95";
        }}
      >
        ×
      </button>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#3b82f6",
          border: "3px solid white",
          width: "10px",
          height: "10px",
          boxShadow: "0 2px 6px rgba(59, 130, 246, 0.3)",
        }}
      />

      {/* Header Section */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>
          Input
        </div>
        
        <div
          style={{
            fontSize: "10px",
            fontWeight: "700",
            color: isEmpty ? "#94a3b8" : "#3b82f6",
            background: isEmpty ? "#f8fafc" : "#eff6ff",
            padding: "3px 8px",
            borderRadius: "4px",
            border: `1px solid ${isEmpty ? "#e2e8f0" : "#dbeafe"}`,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {isEmpty ? "Empty" : "Set"}
        </div>
      </div>

      {/* Value preview if exists */}
      {!isEmpty && (
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#1e293b",
            background: "#f8fafc",
            padding: "6px 8px",
            borderRadius: "4px",
            marginBottom: "8px",
            border: "1px solid #e2e8f0",
            fontFamily: "monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {String(data.value)}
        </div>
      )}

      {/* Input Section */}
      <div style={{ display: "flex", gap: "6px", alignItems: "stretch" }}>
        <input
          aria-label={`input-value-${id}`}
          type="text"
          value={data.value ?? ""}
          onChange={handleChange}
          placeholder="Type here..."
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "6px",
            border: "1.5px solid #e2e8f0",
            outline: "none",
            fontSize: "13px",
            fontWeight: "500",
            boxSizing: "border-box",
            background: "#fafbfc",
            transition: "border-color 200ms ease, background 200ms ease, box-shadow 200ms ease",
            color: "#1e293b",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3b82f6";
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.08)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.background = "#fafbfc";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        <button
          onClick={handleClear}
          title="Clear value"
          aria-label={`clear-${id}`}
          style={{
            border: "1.5px solid #e2e8f0",
            background: "#fafbfc",
            cursor: "pointer",
            fontSize: "16px",
            width: "36px",
            height: "36px",
            borderRadius: "6px",
            display: "grid",
            placeItems: "center",
            color: "#64748b",
            transition: "background 200ms ease, color 200ms ease, border-color 200ms ease",
            fontWeight: "700",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.borderColor = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fafbfc";
            e.currentTarget.style.color = "#64748b";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          ↻
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#10b981",
          border: "3px solid white",
          width: "10px",
          height: "10px",
          boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)",
        }}
      />
    </div>
  );
}