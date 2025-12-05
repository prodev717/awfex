import Navbar from "../components/Navbar";

export default function Examples() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <h1 className="text-4xl font-bold">Examples</h1>
            </div>
        </div>
    );
}
