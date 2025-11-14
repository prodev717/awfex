import { useState } from "react";

export default function Toolbar({
  functions = [],
  selectedFunc,
  setSelectedFunc,
  onAddFunc,
  onAddInput,
  onSaveWorkflow,
}) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [queryParams, setQueryParams] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!workflowName.trim()) {
      alert("Please enter a workflow name");
      return;
    }

    setIsSaving(true);
    try {
      await onSaveWorkflow(workflowName, queryParams);
      setShowSaveModal(false);
      setWorkflowName("");
      setQueryParams("");
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1.5px solid #e2e8f0",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Function Selector */}
        <select
          value={selectedFunc}
          onChange={(e) => setSelectedFunc(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1.5px solid #e2e8f0",
            background: "#fafbfc",
            fontSize: "13px",
            fontWeight: "600",
            color: "#1e293b",
            cursor: "pointer",
            outline: "none",
            transition: "all 200ms ease",
            minWidth: "160px",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3b82f6";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.background = "#fafbfc";
          }}
        >
          <option value="">Select function</option>
          {functions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Add Function Button */}
        <button
          onClick={onAddFunc}
          disabled={!selectedFunc}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1.5px solid #c7d2fe",
            background: selectedFunc ? "#6366f1" : "#e2e8f0",
            color: selectedFunc ? "#ffffff" : "#94a3b8",
            fontSize: "13px",
            fontWeight: "600",
            cursor: selectedFunc ? "pointer" : "not-allowed",
            transition: "all 200ms ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            if (selectedFunc) {
              e.currentTarget.style.background = "#4f46e5";
              e.currentTarget.style.borderColor = "#a5b4fc";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedFunc) {
              e.currentTarget.style.background = "#6366f1";
              e.currentTarget.style.borderColor = "#c7d2fe";
            }
          }}
        >
          <span>➕</span>
          Add Function
        </button>

        {/* Add Input Button */}
        <button
          onClick={onAddInput}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1.5px solid #bfdbfe",
            background: "#3b82f6",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 200ms ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.borderColor = "#93c5fd";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.borderColor = "#bfdbfe";
          }}
        >
          <span>🔢</span>
          Add Input
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Save Workflow Button */}
        <button
          onClick={() => setShowSaveModal(true)}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1.5px solid #d1fae5",
            background: "#10b981",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 200ms ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#059669";
            e.currentTarget.style.borderColor = "#a7f3d0";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#10b981";
            e.currentTarget.style.borderColor = "#d1fae5";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>💾</span>
          Save Workflow
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowSaveModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              width: "440px",
              maxWidth: "90vw",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "1.5px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
                Save Workflow
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "0",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                ×
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="e.g., mathFlow"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1.5px solid #e2e8f0",
                    background: "#fafbfc",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1e293b",
                    outline: "none",
                    transition: "all 200ms ease",
                    boxSizing: "border-box",
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
                  autoFocus
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Query Parameters <span style={{ color: "#94a3b8", fontWeight: "500" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={queryParams}
                  onChange={(e) => setQueryParams(e.target.value)}
                  placeholder="e.g., x=10&y=20"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1.5px solid #e2e8f0",
                    background: "#fafbfc",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1e293b",
                    outline: "none",
                    transition: "all 200ms ease",
                    boxSizing: "border-box",
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
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", gap: "8px", marginTop: "24px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowSaveModal(false)}
                disabled={isSaving}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "1.5px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  transition: "all 200ms ease",
                  opacity: isSaving ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !workflowName.trim()}
                style={{
                  padding: "10px 24px",
                  borderRadius: "6px",
                  border: "1.5px solid #10b981",
                  background: isSaving || !workflowName.trim() ? "#d1d5db" : "#10b981",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: isSaving || !workflowName.trim() ? "not-allowed" : "pointer",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSaving && workflowName.trim()) {
                    e.currentTarget.style.background = "#059669";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving && workflowName.trim()) {
                    e.currentTarget.style.background = "#10b981";
                  }
                }}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}