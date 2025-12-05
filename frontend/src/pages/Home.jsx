import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        AWFEX
                    </h1>
                    <p className="text-xl text-slate-400 mb-8">
                        Automation Workflow Engine Experiment
                    </p>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        A lightweight, open-source automation workflow engine designed as an alternative to tools like n8n.
                        Build workflows visually using a drag-and-drop interface.
                    </p>
                </div>
            </div>
        </div>
    );
}
