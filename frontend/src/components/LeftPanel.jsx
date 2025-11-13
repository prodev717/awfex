export default function LeftPanel({ prettyJSON, onCopy, onRun }) {
  return (
    <div
      style={{
        width: 360,
        minWidth: 260,
        padding: 12,
        background: "#0f172a",
        color: "#e6eef8",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>Generated JSON</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCopy}>Copy</button>
          <button onClick={onRun}>Run</button>
        </div>
      </div>

      <pre
        style={{
          flex: 1,
          overflow: "auto",
          background: "#071026",
          borderRadius: 6,
          padding: 10,
          fontFamily: "monospace",
          fontSize: 12,
          color: "#dbeafe",
        }}
      >
        {prettyJSON}
      </pre>

      <div style={{ fontSize: 12, opacity: 0.85 }}>
        Tip: Create an <strong>Input</strong> node and type numbers or text.
      </div>
    </div>
  );
}