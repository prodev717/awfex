import { useState } from "react";

export default function LeftPanel({ prettyJSON, onCopy, onRun, workflows, onSelectWorkflow, onDeleteWorkflow, query, setQuery }) {
  const [activeTab, setActiveTab] = useState("workflows");

  return (
    <div className="w-80 min-w-[260px] bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden text-slate-200">
      <div className="flex border-b border-slate-800 bg-slate-900/50">
        <button
          onClick={() => setActiveTab("workflows")}
          className={`flex-1 py-3.5 px-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === "workflows"
            ? "bg-slate-900 text-indigo-400 border-indigo-500"
            : "bg-transparent text-slate-400 border-transparent hover:text-slate-300"
            }`}
        >
          Workflows
        </button>
        <button
          onClick={() => setActiveTab("json")}
          className={`flex-1 py-3.5 px-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === "json"
            ? "bg-slate-900 text-indigo-400 border-indigo-500"
            : "bg-transparent text-slate-400 border-transparent hover:text-slate-300"
            }`}
        >
          JSON
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-3.5 px-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === "settings"
            ? "bg-slate-900 text-indigo-400 border-indigo-500"
            : "bg-transparent text-slate-400 border-transparent hover:text-slate-300"
            }`}
        >
          Settings
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "workflows" ? (
          <WorkflowsTab
            query={query}
            setQuery={setQuery}
            workflows={workflows}
            onSelectWorkflow={onSelectWorkflow}
            onDeleteWorkflow={onDeleteWorkflow}
            onRun={onRun}
          />
        ) : activeTab === "json" ? (
          <JSONTab prettyJSON={prettyJSON} onCopy={onCopy} />
        ) : (
          <SettingsTab />
        )}
      </div>
    </div>
  );
}

function QueryBuilder({ query, setQuery }) {
  const parseQuery = () => {
    if (!query) return [];
    try {
      const params = new URLSearchParams(
        query.startsWith("?") ? query : "?" + query
      );
      return Array.from(params.entries()).map(([key, value]) => ({
        key,
        value,
      }));
    } catch {
      return [];
    }
  };

  const [params, setParams] = useState(parseQuery());

  const updateQuery = (list) => {
    const qs = new URLSearchParams();
    list.forEach((p) => {
      if (p.key.trim() !== "") qs.set(p.key.trim(), p.value);
    });
    setQuery("?" + qs.toString());
  };

  const handleChange = (index, field, value) => {
    const updated = [...params];
    updated[index][field] = value;
    setParams(updated);
    updateQuery(updated);
  };

  const addParam = () => {
    const updated = [...params, { key: "", value: "" }];
    setParams(updated);
  };

  const removeParam = (i) => {
    const updated = params.filter((_, idx) => idx !== i);
    setParams(updated);
    updateQuery(updated);
  };

  return (
    <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800 flex flex-col gap-3">
      <div className="text-sm font-bold text-slate-300 mb-1">
        Query Parameters
      </div>

      {params.map((p, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 bg-slate-800 p-3 rounded-md border border-slate-700"
        >
          <div className="flex gap-2 items-center">
            <input
              placeholder="Key"
              value={p.key}
              onChange={(e) => handleChange(i, "key", e.target.value)}
              className="flex-1 py-2.5 px-3 bg-slate-900 text-slate-200 border border-slate-800 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={() => removeParam(i)}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-transparent hover:border-red-600 w-9 h-9 rounded-md flex items-center justify-center transition-all font-bold text-lg flex-shrink-0"
            >
              ×
            </button>
          </div>
          <input
            placeholder="Value"
            value={p.value}
            onChange={(e) => handleChange(i, "value", e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-900 text-slate-200 border border-slate-800 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      ))}

      <button
        onClick={addParam}
        className="py-2.5 px-3 bg-indigo-900/30 text-indigo-300 border border-indigo-900/50 rounded-md text-xs font-bold hover:bg-indigo-900/50 hover:border-indigo-700 hover:text-indigo-200 transition-all text-center"
      >
        + Add Parameter
      </button>
    </div>
  );
}

function WorkflowsTab({ workflows, onSelectWorkflow, onDeleteWorkflow, onRun, query, setQuery }) {
  return (
    <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto scrollable">
      <div className="flex justify-between items-center mb-2">
        <h3 className="m-0 text-sm font-bold text-slate-200">
          Saved Workflows
        </h3>
        <div className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-1 rounded">
          {workflows.length} total
        </div>
      </div>

      <button
        onClick={onRun}
        className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 hover:border-indigo-400 rounded-md text-white text-sm font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
      >
        Run Current Workflow
      </button>

      <QueryBuilder query={query} setQuery={setQuery} />

      {workflows.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500 py-10">
          <div className="text-4xl opacity-50">📋</div>
          <div className="text-xs text-center leading-relaxed">
            No workflows saved yet.
            <br />
            Create nodes and save your workflow.
            <br />
            Save your API key in settings to fetch or run workflows.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-slate-800 border border-slate-700 rounded-md p-2.5 cursor-pointer transition-all hover:bg-slate-700 hover:border-slate-600 group"
              onClick={() => onSelectWorkflow(workflow.id)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-200 mb-1 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-white">
                    {workflow.name}
                  </div>
                  <div className="text-[11px] text-slate-400 flex gap-2">
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
                  className="bg-transparent border-none text-red-500/70 hover:text-red-400 hover:bg-red-500/10 cursor-pointer text-base p-0.5 px-1.5 rounded transition-all"
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
    <div className="flex-1 flex flex-col p-3 gap-2">
      <div className="flex justify-between items-center">
        <h3 className="m-0 text-sm font-bold text-slate-200">
          Generated JSON
        </h3>
        <button
          onClick={onCopy}
          className="py-1.5 px-3 bg-slate-800 border border-slate-700 rounded-md text-indigo-400 text-xs font-semibold cursor-pointer transition-all hover:bg-slate-700 hover:text-indigo-300 hover:border-slate-600"
        >
          Copy
        </button>
      </div>

      <pre className="flex-1 overflow-auto bg-slate-950 rounded-md p-3 font-mono text-xs text-indigo-100 border border-slate-800 m-0 scrollable">
        {prettyJSON}
      </pre>

      <div className="text-[11px] text-slate-400 bg-slate-800 p-2.5 rounded-md border border-slate-700">
        💡 <strong>Tip:</strong> Connect nodes to generate executable JSON
      </div>
    </div>
  );
}

function SettingsTab() {
  const [apiKey, setApiKey] = useState(() => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; apiKey=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return "";
  });

  const handleSave = (val) => {
    setApiKey(val);
    document.cookie = `apiKey=${val}; path=/; max-age=31536000`; // 1 year
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-200 m-0">Settings</h3>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400 font-semibold">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => handleSave(e.target.value)}
          placeholder="Enter API Key"
          className="w-full py-2.5 px-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors"
        />
        <p className="text-[10px] text-slate-500">
          Key is stored locally in your browser cookies.
        </p>
      </div>
    </div>
  );
}