import { useState, useEffect } from "react";
import { MdDelete, MdChevronLeft, MdChevronRight, MdSettings, MdContentPaste, MdInfo, MdHome } from "react-icons/md";
import { LuWorkflow } from "react-icons/lu";
import { RiFunctionAddLine } from "react-icons/ri";

export default function LeftPanel({
  isCollapsed,
  toggleSidebar,
  prettyJSON,
  onCopy,
  onJsonUpdate,
  onJsonValidityChange,
  workflows,
  onSelectWorkflow,
  onDeleteWorkflow,
  query,
  setQuery,
  loading,
  functions = [],
  selectedFunc,
  setSelectedFunc,
  onAddFunc,
  onAddInput,
  hasNodes = false
}) {
  const [activeTab, setActiveTab] = useState("workflows");
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isCollapsed) {
      toggleSidebar();
    }
  };

  return (
    <div className="relative flex h-full">
      {isCollapsed && (
        <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-2">
          <a
            href="/"
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all mb-4"
            title="Go to Home"
          >
            <MdHome size={24} />
          </a>

          <button
            onClick={() => handleTabClick("workflows")}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
            title="Workflows"
          >
            <LuWorkflow size={24} />
          </button>
          <button
            onClick={() => handleTabClick("functions")}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
            title="Functions"
          >
            <RiFunctionAddLine size={24} />
          </button>
          <button
            onClick={() => handleTabClick("settings")}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
            title="Settings"
          >
            <MdSettings size={24} />
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setShowInfoModal(!showInfoModal)}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all relative"
            title="Tips"
          >
            <MdInfo size={24} />
          </button>

          {showInfoModal && (
            <div className="absolute left-16 bottom-4 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl z-50 w-64 ml-2">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xs font-bold text-slate-200">Tip</h4>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="text-slate-400 hover:text-slate-200 text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="text-[11px] text-slate-300">
                Give inputs to the functions in the mentioned parameters order.
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={`flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out text-slate-200 ${isCollapsed ? "w-0 min-w-0 opacity-0 overflow-hidden" : "w-80 min-w-[260px] opacity-100"
          }`}
      >
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
            onClick={() => setActiveTab("functions")}
            className={`flex-1 py-3.5 px-4 text-sm font-bold tracking-wide transition-all border-b-2 ${activeTab === "functions"
              ? "bg-slate-900 text-indigo-400 border-indigo-500"
              : "bg-transparent text-slate-400 border-transparent hover:text-slate-300"
              }`}
          >
            Functions
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
              loading={loading}
              onOpenJsonModal={() => setShowJsonModal(true)}
              hasNodes={hasNodes}
            />
          ) : activeTab === "functions" ? (
            <FunctionsTab
              functions={functions}
              selectedFunc={selectedFunc}
              setSelectedFunc={setSelectedFunc}
              onAddFunc={onAddFunc}
              onAddInput={onAddInput}
            />
          ) : (
            <SettingsTab />
          )}
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className={`absolute top-1/2 -translate-y-1/2 w-6 h-16 bg-slate-900 border-y border-r border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300 shadow-lg z-50 ${isCollapsed ? "left-16 rounded-r-lg" : "left-80 rounded-r-lg"
          }`}
        title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
      >
        {isCollapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
      </button>

      {showJsonModal && (
        <JSONModal
          prettyJSON={prettyJSON}
          onCopy={onCopy}
          onJsonUpdate={onJsonUpdate}
          onJsonValidityChange={onJsonValidityChange}
          onClose={() => setShowJsonModal(false)}
        />
      )}
    </div>
  );
}

function FunctionsTab({ functions, onAddFunc, onAddInput }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFunctions = functions.filter((func) =>
    func.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto scrollable">
      <div className="flex justify-between items-center">
        <h3 className="m-0 text-sm font-bold text-slate-200">Add Nodes</h3>
        <div className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-1 rounded">
          {functions.length} functions
        </div>
      </div>

      <button
        onClick={onAddInput}
        className="w-full py-2.5 px-4 rounded-lg border border-blue-500/50 bg-blue-600 text-white text-sm font-semibold cursor-pointer transition-all hover:bg-blue-500 hover:border-blue-400 shadow-lg shadow-blue-500/20"
      >
        Add Input Node
      </button>

      <div className="border-t border-slate-800 pt-3">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-semibold text-slate-400">Functions</h4>
          {searchQuery && (
            <span className="text-[10px] text-slate-500">
              {filteredFunctions.length} of {functions.length}
            </span>
          )}
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search functions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-3 pl-9 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs outline-none focus:border-indigo-500 focus:bg-slate-900 transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {filteredFunctions.length > 0 ? (
            filteredFunctions.map((func) => (
              <button
                key={func}
                onClick={() => onAddFunc(func)}
                className="group relative py-3 px-3 rounded-lg border-2 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 text-xs font-semibold cursor-pointer transition-all hover:border-indigo-500 hover:from-indigo-600 hover:to-indigo-700 hover:text-white hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 text-left capitalize active:scale-95"
                title={`Add ${func} node`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-700 group-hover:bg-indigo-500 flex items-center justify-center transition-colors">
                    <RiFunctionAddLine size={14} />
                  </div>
                  <span className="flex-1 truncate">{func}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-2 text-center py-6 text-slate-500 text-xs">
              No functions found
            </div>
          )}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 bg-slate-800 p-2.5 rounded-md border border-slate-700 mt-auto">
        <strong>Tip:</strong> Click on any function to add it to the canvas.
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
              <MdDelete size={16} />
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

function WorkflowsTab({ workflows, onSelectWorkflow, onDeleteWorkflow, query, setQuery, loading, onOpenJsonModal, hasNodes }) {
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
        onClick={onOpenJsonModal}
        className="py-2.5 px-4 rounded-lg border border-purple-500/50 bg-purple-600 text-white text-sm font-semibold cursor-pointer transition-all hover:bg-purple-500 hover:border-purple-400 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
      >
        <MdContentPaste size={18} />
        {hasNodes ? "View JSON" : "Paste JSON"}
      </button>

      <QueryBuilder query={query} setQuery={setQuery} />
      <div className="flex flex-col flex-1">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500 py-10">
            <svg className="w-8 h-8 animate-spin text-indigo-500/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="text-xs">Loading workflows...</div>
          </div>
        ) : workflows.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500 py-10">
            <div className="text-4xl opacity-50">📋</div>
            <div className="text-xs text-center leading-relaxed">
              No workflows saved yet.
              <br />
              Create nodes and save your workflow.
              <br />
              Save your API key and API URL in settings to fetch or run workflows.
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
                    className="bg-transparent border-none text-red-500/70 hover:text-red-400 hover:bg-red-500/10 cursor-pointer text-base p-1.5 rounded transition-all flex items-center justify-center"
                    title="Delete workflow"
                  >
                    <MdDelete size={18} />
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

function JSONModal({ prettyJSON, onCopy, onJsonUpdate, onJsonValidityChange, onClose }) {
  const [value, setValue] = useState(prettyJSON);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused && !error) {
      setValue(prettyJSON);
      if (onJsonValidityChange) onJsonValidityChange(true);
    }
  }, [prettyJSON, isFocused, error, onJsonValidityChange]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);
    try {
      const parsed = JSON.parse(newVal);
      setError(null);
      if (onJsonUpdate) onJsonUpdate(parsed);
      if (onJsonValidityChange) onJsonValidityChange(true);
    } catch (err) {
      setError(err.message);
      if (onJsonValidityChange) onJsonValidityChange(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-xl p-6 w-[600px] max-w-[90vw] h-[600px] max-h-[90vh] shadow-2xl border border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="m-0 text-lg font-bold text-slate-100">Paste Workflow JSON</h3>
          <div className="flex gap-2 items-center">
            {error && <span className="text-[10px] text-red-400 font-mono">Invalid JSON</span>}
            <button
              onClick={onCopy}
              className="py-1.5 px-3 bg-slate-800 border border-slate-700 rounded-md text-indigo-400 text-xs font-semibold cursor-pointer transition-all hover:bg-slate-700 hover:text-indigo-300 hover:border-slate-600"
            >
              Copy
            </button>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-2xl text-slate-500 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all hover:bg-slate-800 hover:text-slate-300"
            >
              ×
            </button>
          </div>
        </div>

        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 overflow-auto bg-slate-950 rounded-md p-3 font-mono text-xs text-indigo-100 border ${error ? "border-red-500/50" : "border-slate-800"
            } m-0 scrollable resize-none outline-none focus:border-indigo-500 transition-colors`}
          spellCheck={false}
          placeholder="Paste your workflow JSON here..."
        />

        <div className="text-[11px] text-slate-400 bg-slate-800 p-2.5 rounded-md border border-slate-700 mt-3">
          <strong>Tip:</strong> Paste valid workflow JSON to instantly load it on the canvas.
        </div>
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
    document.cookie = `apiKey=${val}; path=/; max-age=31536000`;
  };

  const handleSaveApiUrl = (val) => {
    setApiUrl(val);
    document.cookie = `apiUrl=${val}; path=/; max-age=31536000`;
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-200 m-0">Settings</h3>

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

      <div className="flex-col gap-2">
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
