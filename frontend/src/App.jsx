import { useCallback, useEffect, useMemo, useState } from "react";
import FlowCanvas from "./components/FlowCanvas";
import LeftPanel from "./components/LeftPanel";
import Toolbar from "./components/Toolbar";
import FunctionNode from "./nodes/FunctionNode";
import InputNode from "./nodes/InputNode";
import { applyEdgeChanges, applyNodeChanges, addEdge } from "reactflow";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [selectedFunc, setSelectedFunc] = useState("");

  const nodeTypes = useMemo(
    () => ({
      custom: FunctionNode,
      inputNode: InputNode,
    }),
    []
  );

  useEffect(() => {
    fetch("http://localhost:5000/functions")
      .then((r) => r.json())
      .then(setFunctions)
      .catch(console.error);
  }, []);

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

  const workflowJSON = useMemo(() => buildWorkflowJSON(), [buildWorkflowJSON]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(workflowJSON, null, 2));
    alert("Copied!");
  };

  const runWorkflow = () => {
    fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workflowJSON),
    })
      .then((res) => res.json())
      .then((data) => alert(JSON.stringify(data, null, 2)))
      .catch((err) => alert(err.message));
  };

  const prettyJSON = workflowJSON
    ? JSON.stringify(workflowJSON, null, 2)
    : "// Connect nodes to generate JSON";

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <LeftPanel prettyJSON={prettyJSON} onCopy={copyToClipboard} onRun={runWorkflow} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Toolbar
          functions={functions}
          selectedFunc={selectedFunc}
          setSelectedFunc={setSelectedFunc}
          onAddFunc={addFunctionNode}
          onAddInput={addInputNode}
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
