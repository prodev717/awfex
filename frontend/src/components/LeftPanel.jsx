import { useState } from "react";

export default function LeftPanel({ prettyJSON, onCopy, onRun, workflows, onSelectWorkflow, onDeleteWorkflow }) {
  const [activeTab, setActiveTab] = useState("workflows");

  return (
    <div
      style={{
        width: 360,
        minWidth: 260,
        background: "#0f172a",
        color: "#e6eef8",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          borderBottom: "1.5px solid #1e293b",
          background: "#0a0f1e",
        }}
      >
        <button
          onClick={() => setActiveTab("workflows")}
          style={{
            flex: 1,
            padding: "14px 16px",
            border: "none",
            background: activeTab === "workflows" ? "#0f172a" : "transparent",
            color: activeTab === "workflows" ? "#60a5fa" : "#94a3b8",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.3px",
            transition: "all 200ms ease",
            borderBottom: activeTab === "workflows" ? "2px solid #60a5fa" : "2px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "workflows") {
              e.currentTarget.style.color = "#cbd5e1";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "workflows") {
              e.currentTarget.style.color = "#94a3b8";
            }
          }}
        >
          Workflows
        </button>
        <button
          onClick={() => setActiveTab("json")}
          style={{
            flex: 1,
            padding: "14px 16px",
            border: "none",
            background: activeTab === "json" ? "#0f172a" : "transparent",
            color: activeTab === "json" ? "#60a5fa" : "#94a3b8",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.3px",
            transition: "all 200ms ease",
            borderBottom: activeTab === "json" ? "2px solid #60a5fa" : "2px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "json") {
              e.currentTarget.style.color = "#cbd5e1";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "json") {
              e.currentTarget.style.color = "#94a3b8";
            }
          }}
        >
          JSON
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeTab === "workflows" ? (
          <WorkflowsTab
            workflows={workflows}
            onSelectWorkflow={onSelectWorkflow}
            onDeleteWorkflow={onDeleteWorkflow}
            onRun={onRun}
          />
        ) : (
          <JSONTab prettyJSON={prettyJSON} onCopy={onCopy} />
        )}
      </div>
    </div>
  );
}

function WorkflowsTab({ workflows, onSelectWorkflow, onDeleteWorkflow, onRun }) {
  return (
    <div
      className="scrollable"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        gap: "8px",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#e2e8f0" }}>
          Saved Workflows
        </h3>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "#64748b",
            background: "#1e293b",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {workflows.length} total
        </div>
      </div>

      <button
        onClick={onRun}
        style={{
          padding: "10px 16px",
          background: "#3b82f6",
          border: "1px solid #2563eb",
          borderRadius: "6px",
          color: "white",
          fontSize: "13px",
          fontWeight: "700",
          cursor: "pointer",
          transition: "all 200ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#2563eb";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#3b82f6";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span>▶️</span>
        Run Current Workflow
      </button>

      {workflows.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
            color: "#64748b",
            padding: "40px 20px",
          }}
        >
          <div style={{ fontSize: "32px", opacity: 0.5 }}>📋</div>
          <div style={{ fontSize: "13px", textAlign: "center", lineHeight: "1.5" }}>
            No workflows saved yet.
            <br />
            Create nodes and save your workflow.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "6px",
                padding: "10px 12px",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#475569";
                e.currentTarget.style.background = "#334155";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#334155";
                e.currentTarget.style.background = "#1e293b";
              }}
              onClick={() => onSelectWorkflow(workflow.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "8px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#e2e8f0",
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {workflow.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", gap: "8px" }}>
                    <span>{workflow.nodeCount} nodes</span>
                    <span>•</span>
                    <span>{workflow.date}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteWorkflow(workflow.id);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    transition: "background 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#991b1b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                  title="Delete workflow"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function JSONTab({ prettyJSON, onCopy }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#e2e8f0" }}>
          Generated JSON
        </h3>
        <button
          onClick={onCopy}
          style={{
            padding: "6px 12px",
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "6px",
            color: "#60a5fa",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#334155";
            e.currentTarget.style.borderColor = "#475569";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1e293b";
            e.currentTarget.style.borderColor = "#334155";
          }}
        >
          Copy
        </button>
      </div>

      <pre
        className="scrollable"
        style={{
          flex: 1,
          overflow: "auto",
          background: "#071026",
          borderRadius: "6px",
          padding: "12px",
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#dbeafe",
          border: "1px solid #1e293b",
          margin: 0,
        }}
      >
        {prettyJSON}
      </pre>

      <div
        style={{
          fontSize: "11px",
          color: "#94a3b8",
          background: "#1e293b",
          padding: "8px 10px",
          borderRadius: "6px",
          border: "1px solid #334155",
        }}
      >
        💡 <strong>Tip:</strong> Connect nodes to generate executable JSON
      </div>
    </div>
  );
}