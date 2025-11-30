const BASE_URL = "http://localhost:5000";

export const api = {
    fetchFunctions: async () => {
        const res = await fetch(`${BASE_URL}/functions`);
        return res.json();
    },

    fetchDescriptions: async () => {
        const res = await fetch(`${BASE_URL}/descriptions`);
        return res.json();
    },

    fetchWorkflows: async () => {
        const res = await fetch(`${BASE_URL}/workflow`);
        if (!res.ok) throw new Error("Failed to fetch workflows");
        return res.json();
    },

    fetchWorkflowDetails: async (name) => {
        const res = await fetch(`${BASE_URL}/workflow/${name}`);
        if (!res.ok) throw new Error(`Failed to fetch ${name}`);
        return res.json();
    },

    saveWorkflow: async (name, workflow) => {
        const res = await fetch(`${BASE_URL}/workflow`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, workflow }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to save workflow");
        }
        return res.json();
    },

    deleteWorkflow: async (name) => {
        const res = await fetch(`${BASE_URL}/workflow/${name}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to delete workflow");
        }
        return res.json();
    },

    runWorkflow: async (workflow, query = "") => {
        const res = await fetch(`${BASE_URL}/run${query}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workflow),
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    },
};
