import dagre from 'dagre';

const nodeWidth = 200;
const nodeHeight = 80;

/**
 * Applies hierarchical layout to nodes using Dagre
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {string} direction - Layout direction: 'TB' (top-bottom) or 'LR' (left-right)
 * @returns {Array} - Nodes with updated positions
 */
export const getLayoutedNodes = (nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Configure the graph layout
    dagreGraph.setGraph({
        rankdir: direction,
        nodesep: 100,  // Horizontal spacing between nodes
        ranksep: 150,  // Vertical spacing between ranks/layers
        edgesep: 50,   // Spacing between edges
        marginx: 50,
        marginy: 50,
    });

    // Add nodes to the graph
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    // Add edges to the graph
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate the layout
    dagre.layout(dagreGraph);

    // Apply the calculated positions to nodes
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return layoutedNodes;
};
