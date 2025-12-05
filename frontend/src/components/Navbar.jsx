import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white tracking-tight">AWFEX</span>
                    </Link>
                    <div className="flex gap-6">
                        <Link
                            to="/"
                            className="text-sm font-medium hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/designer"
                            className="text-sm font-medium hover:text-white transition-colors"
                        >
                            Designer
                        </Link>
                        <Link
                            to="/examples"
                            className="text-sm font-medium hover:text-white transition-colors"
                        >
                            Examples
                        </Link>
                        <Link
                            to="/docs"
                            className="text-sm font-medium hover:text-white transition-colors"
                        >
                            Documentation
                        </Link>
                        <Link
                            to="/setup"
                            className="text-sm font-medium hover:text-white transition-colors"
                        >
                            Setup
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
