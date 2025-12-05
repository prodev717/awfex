import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export default function Docs() {
    const [jsonInput, setJsonInput] = useState(`{
  "print": [
    {
      "sub": [
        {
          "add": ["$query:x", 3]
        },
        4
      ]
    }
  ]
}`);
    const [queryInput, setQueryInput] = useState("x=10");
    const [output, setOutput] = useState("Ready...");
    const [isRunning, setIsRunning] = useState(false);
    const [isError, setIsError] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        setBaseUrl(getCookie("apiUrl") || "http://localhost:5000");
    }, []);

    const runWorkflow = async () => {
        const url = queryInput.trim() ? `/run?${queryInput.trim()}` : `/run`;
        const apiKey = getCookie("apiKey") || "";
        const currentBaseUrl = getCookie("apiUrl") || "http://localhost:5000";

        setOutput("Running...");
        setIsError(false);
        setIsRunning(true);

        try {
            const res = await fetch(`${currentBaseUrl}${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: jsonInput
            });

            const data = await res.json();
            setOutput(JSON.stringify(data, null, 2));

            if (!data.success && data.error) {
                setIsError(true);
            }
        } catch (err) {
            setOutput("Error: " + err.message);
            setIsError(true);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-screen bg-slate-950 text-slate-300 overflow-auto">
            <Navbar />

            {/* Main Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid lg:grid-cols-2 gap-12">

                {/* Left Section: Workflow Tester */}
                <section className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Workflow Tester</h2>
                        <p className="text-slate-400">Test your JSON workflows directly against the engine.</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col h-[650px]">

                        {/* Editor Header */}
                        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs font-mono text-slate-400">workflow.json</span>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="flex-1 relative group">
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                className="w-full h-full bg-slate-900 p-4 font-mono text-sm text-blue-100 focus:outline-none resize-none selection:bg-blue-500/30"
                                spellCheck="false"
                            />
                        </div>

                        {/* Controls */}
                        <div className="bg-slate-950 border-t border-slate-800 p-4 flex flex-col gap-4">

                            {/* Query Params */}
                            <div className="flex items-center gap-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Query Params</label>
                                <input
                                    value={queryInput}
                                    onChange={(e) => setQueryInput(e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    placeholder="key=value&foo=bar"
                                />
                            </div>

                            <button
                                onClick={runWorkflow}
                                disabled={isRunning}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Run Workflow
                            </button>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Output</span>
                            <button
                                onClick={() => { setOutput("Ready..."); setIsError(false); }}
                                className="text-xs text-slate-500 hover:text-slate-300"
                            >
                                Clear
                            </button>
                        </div>
                        <pre className={`p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap ${isError ? 'text-red-400' : 'text-green-400'}`}>
                            {output}
                        </pre>
                    </div>
                </section>

                {/* Right Section: API Docs */}
                <section className="flex flex-col gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">API Documentation</h2>
                        <p className="text-slate-400">Complete reference for the AWFEX API endpoints.</p>
                    </div>

                    {/* Auth + Rate Limits */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-2">Authentication & Rate Limits</h3>

                        <p className="text-sm text-slate-400 mb-3">
                            AWFEX uses API Key authentication. Include it in:
                        </p>

                        <pre className="text-xs font-mono bg-slate-950 p-3 rounded border border-slate-800 text-blue-400">
                            x-api-key: YOUR_API_KEY
                        </pre>

                        <p className="text-sm text-slate-400 mt-3">Rate Limits:</p>
                        <ul className="text-sm text-slate-400 list-disc ml-5 mt-1">
                            <li>100 requests per 15 minutes per IP</li>
                            <li>Exceeded limit returns <code className="text-red-400">429 Too Many Requests</code></li>
                        </ul>

                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <p className="text-sm text-slate-400 mb-2">Current Base URL:</p>
                            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                <code className="text-sm font-mono text-blue-400">{baseUrl || "http://localhost:5000"}</code>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Configure this in Settings</p>
                        </div>
                    </div>

                    {/* GET /workflow */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">GET</span>
                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">AUTH REQUIRED</span>
                            <code className="text-sm font-mono text-slate-200">/workflow</code>
                        </div>
                        <p className="text-sm text-slate-400">Returns a list of all saved workflow names.</p>
                    </div>

                    {/* POST /workflow */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">POST</span>
                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">AUTH REQUIRED</span>
                            <code className="text-sm font-mono text-slate-200">/workflow</code>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">Save or update a workflow.</p>
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 overflow-x-auto">
                            <pre className="text-xs font-mono text-slate-300">{`{
  "name": "mathFlow",
  "workflow": { "mul": [{ "add": [2, 3] }, 4] }
}`}</pre>
                        </div>
                    </div>

                    {/* GET /workflow/:name */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">GET</span>
                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">AUTH REQUIRED</span>
                            <code className="text-sm font-mono text-slate-200">/workflow/:name</code>
                        </div>
                        <p className="text-sm text-slate-400">Retrieve a workflow.</p>
                    </div>

                    {/* DELETE /workflow/:name */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">DELETE</span>
                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">AUTH REQUIRED</span>
                            <code className="text-sm font-mono text-slate-200">/workflow/:name</code>
                        </div>
                        <p className="text-sm text-slate-400">Delete a workflow.</p>
                    </div>

                    {/* GET /run/:name */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">GET</span>
                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">AUTH REQUIRED</span>
                            <code className="text-sm font-mono text-slate-200">/run/:name</code>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">Run a workflow by name.</p>
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 overflow-x-auto">
                            <pre className="text-xs font-mono text-slate-300">{`GET /run/mathFlow?x=10
Headers:
  x-api-key: YOUR_API_KEY`}</pre>
                        </div>
                    </div>

                    {/* POST /run */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">POST</span>
                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">AUTH REQUIRED</span>
                            <code className="text-sm font-mono text-slate-200">/run</code>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">Execute an inline workflow with optional query params.</p>
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 overflow-x-auto">
                            <pre className="text-xs font-mono text-slate-300">{`POST /run?x=5
Headers:
  x-api-key: YOUR_API_KEY

{
  "add": ["$query:x", 3]
}`}</pre>
                        </div>
                    </div>

                    {/* GET /functions */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">GET</span>
                            <code className="text-sm font-mono text-slate-200">/functions</code>
                        </div>
                        <p className="text-sm text-slate-400">List available functions.</p>
                    </div>

                    {/* GET /descriptions */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">GET</span>
                            <code className="text-sm font-mono text-slate-200">/descriptions</code>
                        </div>
                        <p className="text-sm text-slate-400">Function descriptions and tooltips.</p>
                    </div>

                    <div className="h-px bg-slate-800 my-4"></div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Special Values</h3>

                        <div className="grid gap-4">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                                <code className="text-sm font-bold text-yellow-400">$query:key</code>
                                <p className="text-sm text-slate-400 mt-1">Injects URL query parameters.</p>
                            </div>

                            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                                <code className="text-sm font-bold text-pink-400">$env:KEY</code>
                                <p className="text-sm text-slate-400 mt-1">Injects server-side environment variables.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
