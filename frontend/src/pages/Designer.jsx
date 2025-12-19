import { useEffect, useState } from "react";
import FlowCanvas from "../components/FlowCanvas";
import LeftPanel from "../components/LeftPanel";
import Toolbar from "../components/Toolbar";
import FunctionNode from "../nodes/FunctionNode";
import InputNode from "../nodes/InputNode";
import ResultModal from "../components/ResultModal";
import Toast from "../components/Toast";
import { useWorkflows } from "../hooks/useWorkflows";
import { useFlow } from "../hooks/useFlow";
import { api } from "../services/api";
import { buildWorkflowJSON } from "../utils/workflowUtils";

const nodeTypes = {
    custom: FunctionNode,
    inputNode: InputNode,
};

export default function Designer() {
    const [functionMetadata, setFunctionMetadata] = useState({});
    const [selectedFunc, setSelectedFunc] = useState("");
    const [query, setQuery] = useState("");

    const [showResultModal, setShowResultModal] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [runError, setRunError] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const [toast, setToast] = useState(null);

    const {
        workflows,
        fetchWorkflows,
        saveWorkflow: saveWorkflowApi,
        deleteWorkflow: deleteWorkflowApi,
        loading: workflowsLoading,
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
        applyAutoLayout,
        clearWorkflow,
        openModalNodeId,
        handleOpenModal,
        handleCloseModal,
    } = useFlow(functionMetadata);



    useEffect(() => {
        // Fetch function metadata from backend
        api.fetchFunctions().then(metadata => {
            setFunctionMetadata(metadata);
        }).catch(console.error);
    }, []);

    const workflowJSON = buildWorkflowJSON(nodes, edges);

    const prettyJSON = workflowJSON
        ? JSON.stringify(workflowJSON, null, 2)
        : "// Connect nodes to generate JSON";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(prettyJSON);
        setToast({ message: "Copied to clipboard!", type: "success" });
    };

    const [isJsonValid, setIsJsonValid] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleRunWorkflow = async () => {
        if (!isJsonValid) {
            setToast({ message: "Cannot run workflow: Invalid JSON in the editor.", type: "error" });
            return;
        }
        if (!workflowJSON) {
            setToast({ message: "No workflow to run. Please create nodes and connect them.", type: "error" });
            return;
        }

        setRunError(null);
        setRunResult(null);
        setIsRunning(true);

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
        } finally {
            setIsRunning(false);
        }
    };

    const handleSaveWorkflow = async (name) => {
        try {
            await saveWorkflowApi(name, workflowJSON);
            setToast({ message: `Workflow "${name}" saved successfully!`, type: "success" });
        } catch (error) {
            setToast({ message: `Error saving workflow: ${error.message}`, type: "error" });
        }
    };

    const handleSelectWorkflow = async (workflowId) => {
        const workflow = workflows.find((w) => w.id === workflowId);
        if (!workflow) return;

        try {
            const data = await api.fetchWorkflowDetails(workflow.name);
            if (!data.success) throw new Error(data.error || "Failed to load workflow");
            loadWorkflow(data.workflow);
        } catch (error) {
            setToast({ message: `Error loading workflow: ${error.message}`, type: "error" });
        }
    };

    const handleDeleteWorkflow = async (workflowId) => {
        try {
            await deleteWorkflowApi(workflowId);
            setToast({ message: "Workflow deleted successfully", type: "success" });
        } catch (error) {
            setToast({ message: `Error deleting workflow: ${error.message}`, type: "error" });
        }
    };

    const handleJsonUpdate = (newJson) => {
        const parsed = typeof newJson === "string" ? JSON.parse(newJson) : newJson;
        loadWorkflow(parsed);
    };

    return (
        <div className="w-screen h-screen flex m-0 p-0 overflow-hidden bg-slate-950 text-slate-200">
            <LeftPanel
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                prettyJSON={prettyJSON}
                onCopy={copyToClipboard}
                onJsonUpdate={handleJsonUpdate}
                onJsonValidityChange={setIsJsonValid}
                workflows={workflows}
                query={query}
                setQuery={setQuery}
                onSelectWorkflow={handleSelectWorkflow}
                onDeleteWorkflow={handleDeleteWorkflow}
                loading={workflowsLoading}
                functionMetadata={functionMetadata}
                onAddFunc={(funcName) => addFunctionNode(funcName)}
                onAddInput={addInputNode}
                hasNodes={nodes.length > 0}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Toolbar
                    isSidebarCollapsed={isSidebarCollapsed}
                    onSaveWorkflow={handleSaveWorkflow}
                    onRunWorkflow={handleRunWorkflow}
                    onAutoLayout={applyAutoLayout}
                    onClearWorkflow={clearWorkflow}
                    isRunning={isRunning}
                    isRunDisabled={!isJsonValid}
                />

                <FlowCanvas
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    isRunning={isRunning}
                    onAutoLayout={applyAutoLayout}
                    onClearWorkflow={clearWorkflow}
                />
            </div>

            <ResultModal
                isOpen={showResultModal}
                onClose={() => setShowResultModal(false)}
                result={runResult}
                error={runError}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
