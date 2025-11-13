export default function Toolbar({
  functions = [],
  selectedFunc,
  setSelectedFunc,
  onAddFunc,
  onAddInput,
}) {
  return (
    <div
      style={{
        padding: 10,
        borderBottom: "1px solid #eee",
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <select value={selectedFunc} onChange={(e) => setSelectedFunc(e.target.value)}>
        <option value="">Select function</option>
        {functions.map((f) => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <button onClick={onAddFunc}>➕ Add Function</button>
      <button onClick={onAddInput}>🔢 Add Input</button>
    </div>
  );
}