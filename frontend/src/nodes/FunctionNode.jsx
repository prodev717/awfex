import { Handle, Position } from "reactflow";

export default function FunctionNode({ id, data }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete(id);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        width: "140px",
        textAlign: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <button
        onClick={handleDelete}
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          border: "none",
          background: "#ff4d4d",
          color: "white",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        ×
      </button>

      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 600 }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}