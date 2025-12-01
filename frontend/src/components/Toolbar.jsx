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
      <div className="px-5 py-3 border-b border-slate-800 flex gap-3 items-center bg-slate-900 shadow-sm">
        {/* Function Selector */}
        <select
          value={selectedFunc}
          onChange={(e) => setSelectedFunc(e.target.value)}
          className="py-2 px-3 rounded-lg border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-200 cursor-pointer outline-none transition-all min-w-[160px] focus:border-indigo-500 focus:bg-slate-900"
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
          className={`py-2 px-3.5 rounded-lg border text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${selectedFunc
              ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 hover:border-indigo-400 shadow-lg shadow-indigo-500/20"
              : "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
            }`}
        >
          <span>➕</span>
          Add Function
        </button>

        {/* Add Input Button */}
        <button
          onClick={onAddInput}
          className="py-2 px-3.5 rounded-lg border border-blue-500/50 bg-blue-600 text-white text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 hover:bg-blue-500 hover:border-blue-400 shadow-lg shadow-blue-500/20"
        >
          <span>🔢</span>
          Add Input
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Save Workflow Button */}
        <button
          onClick={() => setShowSaveModal(true)}
          className="py-2 px-4 rounded-lg border border-emerald-500/50 bg-emerald-600 text-white text-sm font-bold cursor-pointer transition-all flex items-center gap-1.5 hover:bg-emerald-500 hover:border-emerald-400 shadow-lg shadow-emerald-500/20"
        >
          <span>💾</span>
          Save Workflow
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[1000]"
          onClick={() => setShowSaveModal(false)}
        >
          <div
            className="bg-slate-900 rounded-xl p-6 w-[440px] max-w-[90vw] shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="m-0 text-lg font-bold text-slate-100">
                Save Workflow
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="bg-transparent border-none text-2xl text-slate-500 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all hover:bg-slate-800 hover:text-slate-300"
              >
                ×
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1.5">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="e.g., mathFlow"
                  className="w-full py-2.5 px-3 rounded-lg border border-slate-700 bg-slate-950 text-sm font-medium text-slate-200 outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1.5">
                  Query Parameters <span className="text-slate-600 font-medium">(optional)</span>
                </label>
                <input
                  type="text"
                  value={queryParams}
                  onChange={(e) => setQueryParams(e.target.value)}
                  placeholder="e.g., x=10&y=20"
                  className="w-full py-2.5 px-3 rounded-lg border border-slate-700 bg-slate-950 text-sm font-medium text-slate-200 outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 mt-6 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                disabled={isSaving}
                className={`py-2.5 px-5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 text-sm font-semibold cursor-pointer transition-all hover:bg-slate-700 hover:text-slate-200 ${isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !workflowName.trim()}
                className={`py-2.5 px-6 rounded-lg border border-emerald-500 bg-emerald-600 text-white text-sm font-bold cursor-pointer transition-all hover:bg-emerald-500 hover:border-emerald-400 ${isSaving || !workflowName.trim() ? "opacity-50 cursor-not-allowed bg-slate-700 border-slate-600 text-slate-400" : ""
                  }`}
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