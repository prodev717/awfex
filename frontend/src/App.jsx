import { useCallback, useEffect, useState } from "react";
import FlowCanvas from "./components/FlowCanvas";
import LeftPanel from "./components/LeftPanel";
import Toolbar from "./components/Toolbar";
import FunctionNode from "./nodes/FunctionNode";
import InputNode from "./nodes/InputNode";
import { applyEdgeChanges, applyNodeChanges, addEdge } from "reactflow";

const nodeTypes = {
  custom: FunctionNode,
  inputNode: InputNode,
};

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [selectedFunc, setSelectedFunc] = useState("");
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/functions")
      .then((r) => r.json())
      .then(setFunctions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch("http://localhost:5000/workflow");
      if (!response.ok) throw new Error("Failed to fetch workflows");
      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.workflows)) {
        setWorkflows([]);
        return;
      }
      
      const workflowPromises = data.workflows.map(async (name) => {
        try {
          const workflowResponse = await fetch(`http://localhost:5000/workflow/${name}`);
          if (!workflowResponse.ok) throw new Error(`Failed to fetch ${name}`);
          const workflowData = await workflowResponse.json();
          
          return {
            id: name,
            name: name,
            nodeCount: countNodes(workflowData.workflow),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            workflow: workflowData.workflow,
          };
        } catch (error) {
          console.error(`Error fetching workflow ${name}:`, error);
          return null;
        }
      });
      
      const workflowResults = await Promise.all(workflowPromises);
      const validWorkflows = workflowResults.filter(w => w !== null);
      
      setWorkflows(validWorkflows);
    } catch (error) {
      console.error("Failed to fetch workflows:", error);
      setWorkflows([]);
    }
  };

  const countNodes = (workflow) => {
    if (!workflow) return 0;
    if (typeof workflow !== 'object') return 1;
    if (Array.isArray(workflow)) {
      return workflow.reduce((acc, item) => acc + countNodes(item), 0);
    }
    return Object.values(workflow).reduce((acc, val) => acc + countNodes(val), 1);
  };

  const deleteNode = useCallback((id) => {
    setNodes((nodes) => nodes.filter((n) => n.id !== id));
    setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const handleInputValueChange = useCallback((id, value) => {
    setNodes((nodes) =>
      nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, value } } : n))
    );
  }, []);

  const onNodesChange = useCallback(
    (c) => setNodes((nodes) => applyNodeChanges(c, nodes)),
    []
  );

  const onEdgesChange = useCallback(
    (c) => setEdges((edges) => applyEdgeChanges(c, edges)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((edges) => addEdge(params, edges)),
    []
  );

  const addFunctionNode = () => {
    if (!selectedFunc) return;
    const id = `${selectedFunc}-${nodes.length + 1}`;
    setNodes((nodes) => [
      ...nodes,
      {
        id,
        type: "custom",
        position: { x: Math.random() * 600, y: Math.random() * 400 },
        data: { label: selectedFunc, onDelete: deleteNode },
      },
    ]);
  };

  const addInputNode = () => {
    const id = `input-${nodes.length + 1}`;
    setNodes((nodes) => [
      ...nodes,
      {
        id,
        type: "inputNode",
        position: { x: Math.random() * 600, y: Math.random() * 400 },
        data: {
          value: "",
          onDelete: deleteNode,
          onValueChange: handleInputValueChange,
        },
      },
    ]);
  };

  const buildWorkflowJSON = useCallback(() => {
    const findSources = (target) =>
      edges.filter((e) => e.target === target).map((e) => e.source);

    const resolveNode = (id, visited = new Set()) => {
      if (visited.has(id)) throw new Error("Cycle detected");
      visited.add(id);

      const node = nodes.find((n) => n.id === id);
      if (!node) return null;

      if (node.type === "inputNode") {
        const raw = node.data?.value ?? "";
        if (raw === "") return "";
        const n = Number(raw);
        return !Number.isNaN(n) && String(n) === raw.trim() ? n : raw;
      }

      const args = findSources(id).map((s) => resolveNode(s, new Set(visited)));
      return { [node.data?.label ?? "fn"]: args };
    };

    const finals = nodes.filter((n) => !edges.some((e) => e.source === n.id));
    if (finals.length === 0) return null;
    if (finals.length === 1) return resolveNode(finals[0].id);

    return finals.map((n) => resolveNode(n.id));
  }, [nodes, edges]);

  const workflowJSON = buildWorkflowJSON();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(workflowJSON, null, 2));
    alert("Copied to clipboard!");
  };

  const runWorkflow = () => {
    if (!workflowJSON) {
      alert("No workflow to run. Please create nodes and connect them.");
      return;
    }

    fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workflowJSON),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          alert(`Result:\n${JSON.stringify(data.result, null, 2)}`);
        } else {
          throw new Error(data.error || "Run failed");
        }
      })
      .catch((err) => alert(`Error: ${err.message}`));
  };

  const handleSaveWorkflow = async (name, queryParams) => {
    if (!workflowJSON) {
      alert("No workflow to save. Please create nodes and connect them.");
      throw new Error("No workflow to save");
    }

    if (!name || name.trim() === "") {
      alert("Please enter a workflow name");
      throw new Error("Workflow name is required");
    }

    try {
      const response = await fetch(`http://localhost:5000/workflow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          workflow: workflowJSON
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save workflow");
      }

      const data = await response.json();
      
      if (data.success) {
        alert(`Workflow "${name}" saved successfully!`);
        await fetchWorkflows();
      } else {
        throw new Error(data.error || "Save failed");
      }
    } catch (error) {
      alert(`Error saving workflow: ${error.message}`);
      throw error;
    }
  };

  const handleSelectWorkflow = async (workflowId) => {
    try {
      const workflow = workflows.find((w) => w.id === workflowId);
      if (!workflow) {
        console.error("Workflow not found:", workflowId);
        return;
      }

      const response = await fetch(`http://localhost:5000/workflow/${workflow.name}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load workflow");
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log("Loading workflow:", data.workflow);
        alert(`Loading workflow: ${data.name}\n(Node reconstruction not yet implemented)`);
      } else {
        throw new Error(data.error || "Load failed");
      }
      
    } catch (error) {
      console.error("Failed to load workflow:", error);
      alert(`Error loading workflow: ${error.message}`);
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (!workflow) return;

    if (!confirm(`Delete workflow "${workflow.name}"?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/workflow/${workflow.name}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete workflow");
      }

      const data = await response.json();
      
      if (data.success) {
        alert(`Workflow "${workflow.name}" deleted successfully`);
        await fetchWorkflows();
      } else {
        throw new Error(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Failed to delete workflow:", error);
      alert(`Error deleting workflow: ${error.message}`);
    }
  };

  const prettyJSON = workflowJSON
    ? JSON.stringify(workflowJSON, null, 2)
    : "// Connect nodes to generate JSON";

  return (
    <div 
      style={{ 
        width: "100vw", 
        height: "100vh", 
        display: "flex",
        margin: 0,
        padding: 0,
        overflow: "hidden"
      }}
    >
      <LeftPanel
        prettyJSON={prettyJSON}
        onCopy={copyToClipboard}
        onRun={runWorkflow}
        workflows={workflows}
        onSelectWorkflow={handleSelectWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Toolbar
          functions={functions}
          selectedFunc={selectedFunc}
          setSelectedFunc={setSelectedFunc}
          onAddFunc={addFunctionNode}
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
    </div>
  );
}