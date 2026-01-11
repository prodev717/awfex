export const countNodes = (workflow) => {
    if (!workflow) return 0;

    // Primitives at the top level (orphans) count as 1
    if (typeof workflow !== 'object') return 1;

    if (Array.isArray(workflow)) {
        return workflow.reduce((acc, item) => acc + countNodes(item), 0);
    }

    // For objects (Function Nodes):
    // Count 1 for the node itself.
    // Plus count nodes in its arguments.
    // Primitives in arguments are NOT counted (they are manual params).
    return 1 + Object.values(workflow).reduce((acc, args) => {
        if (Array.isArray(args)) {
            return acc + args.reduce((sum, arg) => {
                // Only count child args if they are objects (sub-nodes)
                if (typeof arg === 'object' && arg !== null) {
                    return sum + countNodes(arg);
                }
                return sum;
            }, 0);
        }
        return acc;
    }, 0);
};

export const buildWorkflowJSON = (nodes, edges) => {
    const resolveNode = (id, visited = new Set()) => {
        if (visited.has(id)) throw new Error("Cycle detected");
        visited.add(id);

        const node = nodes.find((n) => n.id === id);
        if (!node) return null;

        if (node.type === "inputNode") {
            const raw = node.data?.value ?? "";
            if (raw === "") return "";
            const rawStr = String(raw).trim();
            const num = Number(rawStr);
            return !Number.isNaN(num) && String(num) === rawStr ? num : raw;
        }

        // Use n8n-style parameter mappings if available
        if (node.data?.parameterMappings && node.data.parameterMappings.length > 0) {
            const args = node.data.parameterMappings.map(mapping => {
                if (mapping.sourceType === 'node' && mapping.sourceNodeId) {
                    return resolveNode(mapping.sourceNodeId, new Set(visited));
                } else if (mapping.sourceType === 'null') {
                    return undefined;
                } else {
                    // Manual value
                    const raw = mapping.manualValue;
                    if (raw === "") return "";
                    const rawStr = String(raw).trim();
                    const num = Number(rawStr);
                    return !Number.isNaN(num) && String(num) === rawStr ? num : raw;
                }
            });

            // Remove trailing undefined values (equivalent to not passing the argument)
            while (args.length > 0 && args[args.length - 1] === undefined) {
                args.pop();
            }

            return { [node.data?.label ?? "fn"]: args };
        }

        // Fallback for nodes without mappings (shouldn't happen with new UI)
        return { [node.data?.label ?? "fn"]: [] };
    };

    const finals = nodes.filter((n) => !edges.some((e) => e.source === n.id));
    if (finals.length === 0) return null;
    if (finals.length === 1) return resolveNode(finals[0].id);

    return finals.map((n) => resolveNode(n.id));
};

export const rebuildFromWorkflow = (workflow, deleteNode, handleInputValueChange, handleArgsChange, functionMetadata = {}) => {
    let newNodes = [];
    let newEdges = [];
    let idCounter = 1;
    let edgeCounter = 1;

    const genNodeId = (prefix) => `${prefix}-${idCounter++}`;
    const genEdgeId = (source, target) => `e-${source}-${target}-${edgeCounter++}`;

    const computeWidth = (data) => {
        if (typeof data !== "object" || (data === null) || Array.isArray(data)) {
            return 1; // leaf (input node)
        }

        const fnName = Object.keys(data)[0];
        const args = data[fnName];
        return args.reduce((sum, arg) => sum + computeWidth(arg), 0);
    };

    const build = (data, depth = 0, xOffset = 0) => {
        let nodeId;

        if (typeof data !== "object" || (data === null) || Array.isArray(data)) {
            nodeId = genNodeId("input");

            newNodes.push({
                id: nodeId,
                type: "inputNode",
                position: { x: depth * 220, y: xOffset * 120 },
                data: {
                    value: data,
                    onDelete: deleteNode,
                    onValueChange: handleInputValueChange,
                },
            });

            return { nodeId, width: 1 };
        }

        const fnName = Object.keys(data)[0];
        const args = data[fnName];

        const totalWidth = args.reduce((sum, arg) => sum + computeWidth(arg), 0);

        nodeId = genNodeId(fnName);

        // Calculate mappings and build children
        const mappings = [];
        let childYOffset = xOffset - totalWidth / 2;

        // Get parameter names from metadata
        const paramNames = functionMetadata[fnName]?.parameters || [];

        args.forEach((arg, index) => {
            const paramName = paramNames[index] || `Argument ${index + 1}`;

            if (arg === null) {
                // Explicit null
                mappings.push({
                    paramName,
                    sourceType: 'null',
                    sourceNodeId: null,
                    manualValue: ''
                });
            } else if (typeof arg === "object" && !Array.isArray(arg)) {
                // It's a node connection
                const w = computeWidth(arg);
                const childCenter = childYOffset + w / 2;
                const child = build(arg, depth + 1, childCenter);

                newEdges.push({
                    id: genEdgeId(child.nodeId, nodeId),
                    source: child.nodeId,
                    target: nodeId,
                });

                mappings.push({
                    paramName,
                    sourceType: 'node',
                    sourceNodeId: child.nodeId,
                    manualValue: ''
                });

                childYOffset += w;
            } else {
                // It's a manual value (primitive)
                mappings.push({
                    paramName,
                    sourceType: 'manual',
                    sourceNodeId: null,
                    manualValue: arg
                });
            }
        });

        newNodes.push({
            id: nodeId,
            type: "custom",
            position: { x: depth * 220, y: xOffset * 120 },
            data: {
                label: fnName,
                tooltip: functionMetadata[fnName]?.description || "",
                metadata: functionMetadata[fnName] || {},
                onDelete: deleteNode,
                onArgsChange: handleArgsChange,
                parameterMappings: mappings, // Populated mappings
            },
        });

        return { nodeId, width: totalWidth };
    };

    if (Array.isArray(workflow)) {
        let yBase = 0;
        workflow.forEach((wf) => {
            const w = computeWidth(wf);
            build(wf, 0, yBase + w / 2);
            yBase += w + 1;
        });
    } else {
        const w = computeWidth(workflow);
        build(workflow, 0, w / 2);
    }

    return { newNodes, newEdges };
};
