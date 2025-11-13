import { Handle, Position } from "reactflow";

/**
 * InputNode
 * - prettier input with clear button, inline label and value preview
 * - subtle focus ring and compact layout
 */
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

  return (
    <div
      role="group"
      aria-label={`input-node-${id}`}
      style={{
        width: 220,
        borderRadius: 12,
        padding: 10,
        background: "linear-gradient(180deg,#f8fdff,#ffffff)",
        border: "1px solid rgba(6,95,70,0.04)",
        boxShadow: "0 8px 20px rgba(2,6,23,0.05)",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        userSelect: "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
      <button
        onClick={handleDelete}
        title="Delete"
        aria-label={`delete-${id}`}
        style={{
          position: "absolute",
          top: -8,
          right: -8,
          background: "#ef4444",
          color: "white",
          border: "none",
          width: 26,
          height: 26,
          borderRadius: 999,
          boxShadow: "0 4px 10px rgba(239,68,68,0.18)",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          fontSize: 13,
        }}>
        ×
      </button>

      <Handle type="target" position={Position.Top} style={{ background: "#2563eb", width: 10, height: 10 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: "#064e3b" }}>Input</div>
        <div
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "#0f172a",
            background: "#ecfeff",
            borderRadius: 999,
            padding: "4px 8px",
            border: "1px solid rgba(2,6,23,0.03)",
          }}>
          {data.value === "" ? "empty" : String(data.value)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          aria-label={`input-value-${id}`}
          type="text"
          value={data.value ?? ""}
          onChange={handleChange}
          placeholder='e.g. 42 or "hello"'
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(6,95,70,0.08)",
            outline: "none",
            fontSize: 13,
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 6px 16px rgba(6,95,70,0.06)")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />

        <button
          onClick={handleClear}
          title="Clear value"
          aria-label={`clear-${id}`}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 16,
            width: 36,
            height: 36,
            display: "grid",
            placeItems: "center",
            color: "#065f46",
          }}>
          ⟲
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: "#10b981", width: 10, height: 10 }} />
    </div>
  );
}