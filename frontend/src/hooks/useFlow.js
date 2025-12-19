import { useState, useCallback, useEffect } from "react";
import { applyEdgeChanges, applyNodeChanges, addEdge } from "reactflow";
import { rebuildFromWorkflow } from "../utils/workflowUtils";
import { getLayoutedNodes } from "../utils/layoutUtils";

export function useFlow(functionMetadata = {}) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [openModalNodeId, setOpenModalNodeId] = useState(null);

    // Callback definitions (need to be defined before use)
    const deleteNode = useCallback((id) => {
        setNodes((nodes) => nodes.filter((n) => n.id !== id));
        setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
    }, []);

    const handleArgsChange = useCallback((id, newArgs) => {
        setNodes((nodes) =>
            nodes.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, manualArgs: newArgs } } : n
            )
        );
    }, []);

    const handleInputValueChange = useCallback((id, newValue) => {
        setNodes((nodes) =>
            nodes.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, value: newValue } } : n
            )
        );
    }, []);

    const handleNodeNameChange = useCallback((id, newName) => {
        setNodes((nodes) =>
            nodes.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, name: newName } } : n
            )
        );
    }, []);

    const handleOpenModal = useCallback((nodeId) => {
        setOpenModalNodeId(nodeId);
    }, []);

    const handleCloseModal = useCallback(() => {
        setOpenModalNodeId(null);
    }, []);

    // Re-attach callbacks to loaded nodes
    useEffect(() => {
        const saved = localStorage.getItem('workflow-nodes');
        if (saved) {
            const loadedNodes = JSON.parse(saved);
            const nodesWithCallbacks = loadedNodes.map(node => ({
                ...node,
                data: {
                    ...node.data,
                    onDelete: deleteNode,
                    onArgsChange: handleArgsChange,
                    onInputValueChange: handleInputValueChange,
                    onNameChange: handleNodeNameChange,
                    onOpenModal: handleOpenModal,
                    onCloseModal: handleCloseModal,
                }
            }));
            setNodes(nodesWithCallbacks);
        }

        const savedEdges = localStorage.getItem('workflow-edges');
        if (savedEdges) {
            setEdges(JSON.parse(savedEdges));
        }
    }, [deleteNode, handleArgsChange, handleInputValueChange, handleNodeNameChange, handleOpenModal, handleCloseModal]);

    // Save to localStorage whenever nodes or edges change
    useEffect(() => {
        localStorage.setItem('workflow-nodes', JSON.stringify(nodes));
    }, [nodes]);

    useEffect(() => {
        localStorage.setItem('workflow-edges', JSON.stringify(edges));
    }, [edges]);

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



    const addFunctionNode = (funcName) => {
        if (!funcName) return;
        const nodeCount = nodes.filter(n => n.data?.label === funcName).length + 1;
        const id = `${funcName}-${Date.now()}`;
        setNodes((nodes) => [
            ...nodes,
            {
                id,
                type: "custom",
                position: { x: Math.random() * 600, y: Math.random() * 400 },
                data: {
                    label: funcName,
                    name: `${funcName} ${nodeCount}`,
                    onDelete: deleteNode,
                    onArgsChange: handleArgsChange,
                    onNameChange: handleNodeNameChange,
                    onOpenModal: handleOpenModal,
                    onCloseModal: handleCloseModal,
                    tooltip: functionMetadata[funcName]?.description || "",
                    metadata: functionMetadata[funcName] || {},
                    parameterMappings: [], // n8n-style parameter mappings
                },
            },
        ]);
    };

    const addInputNode = () => {
        const nodeCount = nodes.filter(n => n.type === 'inputNode').length + 1;
        const id = `input-${Date.now()}`;
        setNodes((nodes) => [
            ...nodes,
            {
                id,
                type: "inputNode",
                position: { x: Math.random() * 600, y: Math.random() * 400 },
                data: {
                    name: `Input ${nodeCount}`,
                    value: "",
                    onDelete: deleteNode,
                    onValueChange: handleInputValueChange,
                    onNameChange: handleNodeNameChange,
                    onOpenModal: handleOpenModal,
                    onCloseModal: handleCloseModal,
                },
            },
        ]);
    };

    const loadWorkflow = (workflowData) => {
        const { newNodes, newEdges } = rebuildFromWorkflow(
            workflowData,
            deleteNode,
            handleInputValueChange,
            handleArgsChange,
            functionMetadata
        );

        const layoutedNodes = getLayoutedNodes(newNodes, newEdges, 'TB');

        setNodes(layoutedNodes);
        setEdges(newEdges);
    };

    const applyAutoLayout = (direction = 'TB') => {
        const layoutedNodes = getLayoutedNodes(nodes, edges, direction);
        setNodes(layoutedNodes);
    };

    const clearWorkflow = useCallback(() => {
        setNodes([]);
        setEdges([]);
        localStorage.removeItem('workflow-nodes');
        localStorage.removeItem('workflow-edges');
    }, []);

    return {
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
        deleteNode,
        handleInputValueChange,
        handleArgsChange,
        handleNodeNameChange,
        openModalNodeId,
        handleOpenModal,
        handleCloseModal,
    };
}
