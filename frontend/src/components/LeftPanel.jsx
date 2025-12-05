import { useState } from "react";

export default function LeftPanel({ isCollapsed, toggleSidebar, prettyJSON, onCopy, workflows, onSelectWorkflow, onDeleteWorkflow, query, setQuery }) {
  const [activeTab, setActiveTab] = useState("workflows");

  return (
    <div
      className={`relative flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out text-slate-200 ${isCollapsed ? "w-0 min-w-0 border-none" : "w-80 min-w-[260px]"
        }`}
    >
      {/* Content */}
      <div className={`flex flex-col h-full overflow-hidden w-80 ${isCollapsed ? "hidden" : "flex"}`}>
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={toggleSidebar}
            className="w-10 flex items-center justify-center text-slate-400 hover:text-white border-r border-slate-800 hover:bg-slate-800 transition-colors"
            title="Close Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
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
            />
          ) : activeTab === "json" ? (
            <JSONTab prettyJSON={prettyJSON} onCopy={onCopy} />
          ) : (
            <SettingsTab />
          )}
        </div>
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
              className="flex-1 min-w-0 py-2.5 px-3 bg-slate-900 text-slate-200 border border-slate-800 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors"
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

function WorkflowsTab({ workflows, onSelectWorkflow, onDeleteWorkflow, query, setQuery }) {
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

      <QueryBuilder query={query} setQuery={setQuery} />
      <div className="flex flex-col flex-1">
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
        <div className="text-[11px] text-slate-400 bg-slate-800 p-2.5 rounded-md border border-slate-700 mt-auto">
          <strong>Tip:</strong> Give inputs to the functions in the mentioned parameters order.
        </div>
      </div>
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
        <strong>Tip:</strong> Connect nodes to generate executable JSON
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

  const [apiUrl, setApiUrl] = useState(() => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; apiUrl=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return "http://localhost:5000";
  });

  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveApiKey = (val) => {
    setApiKey(val);
    document.cookie = `apiKey=${val}; path=/; max-age=31536000`; // 1 year
  };

  const handleSaveApiUrl = (val) => {
    setApiUrl(val);
    document.cookie = `apiUrl=${val}; path=/; max-age=31536000`; // 1 year
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-200 m-0">Settings</h3>

      {/* API Key Field */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400 font-semibold">API Key</label>
        <div className="relative">
          <input
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => handleSaveApiKey(e.target.value)}
            placeholder="Enter API Key"
            className="w-full py-2.5 px-3 pr-10 bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
            title={showApiKey ? "Hide API Key" : "Show API Key"}
          >
            {showApiKey ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-500">
          Key is stored locally in your browser cookies.
        </p>
      </div>

      {/* API URL Field */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400 font-semibold">API URL</label>
        <input
          type="text"
          value={apiUrl}
          onChange={(e) => handleSaveApiUrl(e.target.value)}
          placeholder="http://localhost:5000"
          className="w-full py-2.5 px-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors"
        />
        <p className="text-[10px] text-slate-500">
          Backend API URL (default: http://localhost:5000)
        </p>
      </div>
    </div>
  );
}
