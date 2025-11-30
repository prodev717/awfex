import { useState, useCallback } from "react";
import { applyEdgeChanges, applyNodeChanges, addEdge } from "reactflow";
import { rebuildFromWorkflow } from "../utils/workflowUtils";

export function useFlow(descriptions = {}) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

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

    const deleteNode = useCallback((id) => {
        setNodes((nodes) => nodes.filter((n) => n.id !== id));
        setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
    }, []);

    const handleInputValueChange = useCallback((id, value) => {
        setNodes((nodes) =>
            nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, value } } : n))
        );
    }, []);

    const addFunctionNode = (funcName) => {
        if (!funcName) return;
        const id = `${funcName}-${nodes.length + 1}`;
        setNodes((nodes) => [
            ...nodes,
            {
                id,
                type: "custom",
                position: { x: Math.random() * 600, y: Math.random() * 400 },
                data: {
                    label: funcName,
                    onDelete: deleteNode,
                    tooltip: descriptions[funcName]
                },
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

    const loadWorkflow = (workflowData) => {
        const { newNodes, newEdges } = rebuildFromWorkflow(
            workflowData,
            deleteNode,
            handleInputValueChange
        );

        // Inject tooltips into rebuilt nodes
        const nodesWithTooltips = newNodes.map(node => {
            if (node.type === 'custom') {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        tooltip: descriptions[node.data.label]
                    }
                };
            }
            return node;
        });

        setNodes(nodesWithTooltips);
        setEdges(newEdges);
    };

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addFunctionNode,
        addInputNode,
        loadWorkflow,
        deleteNode, // Exporting if needed elsewhere
        handleInputValueChange // Exporting if needed elsewhere
    };
}
