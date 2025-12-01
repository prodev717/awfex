import { useEffect, useState } from "react";
import FlowCanvas from "./components/FlowCanvas";
import LeftPanel from "./components/LeftPanel";
import Toolbar from "./components/Toolbar";
import FunctionNode from "./nodes/FunctionNode";
import InputNode from "./nodes/InputNode";
import ResultModal from "./components/ResultModal";
import { useWorkflows } from "./hooks/useWorkflows";
import { useFlow } from "./hooks/useFlow";
import { api } from "./services/api";
import { buildWorkflowJSON } from "./utils/workflowUtils";

const nodeTypes = {
  custom: FunctionNode,
  inputNode: InputNode,
};

export default function App() {
  const [functions, setFunctions] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [selectedFunc, setSelectedFunc] = useState("");
  const [query, setQuery] = useState("");

  // Result Modal State
  const [showResultModal, setShowResultModal] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState(null);

  const {
    workflows,
    fetchWorkflows,
    saveWorkflow: saveWorkflowApi,
    deleteWorkflow: deleteWorkflowApi
  } = useWorkflows();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addFunctionNode,
    addInputNode,
    loadWorkflow,
  } = useFlow(descriptions);

  useEffect(() => {
    api.fetchFunctions().then(setFunctions).catch(console.error);
    api.fetchDescriptions().then(setDescriptions).catch(console.error);
  }, []);

  const workflowJSON = buildWorkflowJSON(nodes, edges);

  const prettyJSON = workflowJSON
    ? JSON.stringify(workflowJSON, null, 2)
    : "// Connect nodes to generate JSON";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prettyJSON);
    alert("Copied to clipboard!");
  };

  const handleRunWorkflow = async () => {
    if (!workflowJSON) {
      alert("No workflow to run. Please create nodes and connect them.");
      return;
    }

    setRunError(null);
    setRunResult(null);

    try {
      const data = await api.runWorkflow(workflowJSON, query);
      if (data.success) {
        setRunResult(data.result);
        setShowResultModal(true);
      } else {
        throw new Error(data.error || "Run failed");
      }
    } catch (err) {
      setRunError(err.message);
      setShowResultModal(true);
    }
  };

  const handleSaveWorkflow = async (name) => {
    try {
      await saveWorkflowApi(name, workflowJSON);
      alert(`Workflow "${name}" saved successfully!`);
    } catch (error) {
      alert(`Error saving workflow: ${error.message}`);
    }
  };

  const handleSelectWorkflow = async (workflowId) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (!workflow) return;

    try {
      const data = await api.fetchWorkflowDetails(workflow.name);
      if (!data.success) throw new Error(data.error || "Failed to load workflow");
      loadWorkflow(data.workflow);
      alert(`Workflow "${workflow.name}" loaded successfully!`);
    } catch (error) {
      alert(`Error loading workflow: ${error.message}`);
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    try {
      await deleteWorkflowApi(workflowId);
      alert("Workflow deleted successfully");
    } catch (error) {
      alert(`Error deleting workflow: ${error.message}`);
    }
  };

  return (
    <div className="w-screen h-screen flex m-0 p-0 overflow-hidden bg-slate-950 text-slate-200">
      <LeftPanel
        prettyJSON={prettyJSON}
        onCopy={copyToClipboard}
        onRun={handleRunWorkflow}
        workflows={workflows}
        query={query}
        setQuery={setQuery}
        onSelectWorkflow={handleSelectWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Toolbar
          functions={functions}
          selectedFunc={selectedFunc}
          setSelectedFunc={setSelectedFunc}
          onAddFunc={() => addFunctionNode(selectedFunc)}
          onAddInput={addInputNode}
          onSaveWorkflow={handleSaveWorkflow}
        />

        <FlowCanvas
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </div>

      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={runResult}
        error={runError}
      />
    </div>
  );
}