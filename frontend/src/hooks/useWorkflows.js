import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { countNodes } from "../utils/workflowUtils";

export function useWorkflows() {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWorkflows = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.fetchWorkflows();

            if (!data.success || !Array.isArray(data.workflows)) {
                setWorkflows([]);
                return;
            }

            const workflowPromises = data.workflows.map(async (name) => {
                try {
                    const workflowData = await api.fetchWorkflowDetails(name);
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
        } catch (err) {
            console.error("Failed to fetch workflows:", err);
            setError(err.message);
            setWorkflows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    const saveWorkflow = async (name, workflowJSON) => {
        if (!workflowJSON) throw new Error("No workflow to save");
        if (!name || !name.trim()) throw new Error("Workflow name is required");

        await api.saveWorkflow(name.trim(), workflowJSON);
        await fetchWorkflows();
    };

    const deleteWorkflow = async (workflowId) => {
        const workflow = workflows.find((w) => w.id === workflowId);
        if (!workflow) return;

        if (!confirm(`Delete workflow "${workflow.name}"?`)) return;

        await api.deleteWorkflow(workflow.name);
        await fetchWorkflows();
    };

    return {
        workflows,
        loading,
        error,
        fetchWorkflows,
        saveWorkflow,
        deleteWorkflow,
    };
}
