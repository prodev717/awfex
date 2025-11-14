import { Handle, Position } from "reactflow";

export default function FunctionNode({ id, data }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete(id);
  };

  return (
    <div
      role="group"
      aria-label={`function-node-${id}`}
      style={{
        position: "relative",
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "8px",
        padding: "12px 16px",
        width: "180px",
        minHeight: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.04)",
        transition: "border-color 200ms ease, box-shadow 200ms ease",
        userSelect: "none",
        cursor: "grab",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.08), 0 16px 32px rgba(99, 102, 241, 0.06)";
        e.currentTarget.style.borderColor = "#c7d2fe";
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
          background: "linear-gradient(90deg, #818cf8 0%, #6366f1 100%)",
          borderRadius: "8px 8px 0 0",
        }}
      />

      <button
        onClick={handleDelete}
        title="Delete node"
        aria-label={`delete-function-${id}`}
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          border: "none",
          background: "#ef4444",
          color: "white",
          borderRadius: "50%",
          width: "28px",
          height: "28px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "700",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
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
          background: "#6366f1",
          border: "3px solid white",
          width: "10px",
          height: "10px",
          boxShadow: "0 2px 6px rgba(99, 102, 241, 0.3)",
        }}
      />

      {/* Main label */}
      <div
        style={{
          fontWeight: "700",
          fontSize: "15px",
          color: "#0f172a",
          textAlign: "center",
          letterSpacing: "-0.01em",
          lineHeight: "1.3",
        }}
      >
        {data.label}
      </div>

      {/* Subtle description */}
      {data.description && (
        <div
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "#64748b",
            textAlign: "center",
            lineHeight: "1.4",
          }}
        >
          {data.description}
        </div>
      )}

      {/* Type badge */}
      {data.type && (
        <div
          style={{
            marginTop: "2px",
            fontSize: "9px",
            fontWeight: "700",
            color: "#6366f1",
            background: "#f5f7ff",
            padding: "3px 8px",
            borderRadius: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            border: "1px solid #e0e7ff",
          }}
        >
          {data.type}
        </div>
      )}

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