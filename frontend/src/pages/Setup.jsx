import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function Setup() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">

                {/* Header Section */}
                <div className="text-center mb-12 md:mb-20 animate-[fadeIn_0.5s_ease-out]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Quick Start Guide
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Deploy & Configure <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AWFEX</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Get your own instance of the automation engine running in minutes.
                        Follow these steps to deploy, configure, and start building.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid gap-8 md:gap-12 relative">

                    {/* Connecting Line (Desktop & Mobile) */}
                    <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent z-0"></div>

                    {/* Step 1: Fork */}
                    <StepCard
                        number="1"
                        title="Fork the Repository"
                        description="Start by forking the AWFEX repository to your own GitHub account. This gives you full control over your codebase."
                    >
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://github.com/prodev717/awfex"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-medium transition-all group w-full sm:w-fit"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                <span>Go to Repository</span>
                                <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                            <p className="text-xs text-slate-500 max-w-sm">
                                <span className="text-indigo-400 font-bold">Note:</span> The <code>frontend</code> folder is optional. If you just want the backend engine API, you can delete the frontend directory.
                            </p>
                        </div>
                    </StepCard>

                    {/* Step 2: Deploy */}
                    <StepCard
                        number="2"
                        title="Deploy to Vercel"
                        description="Import your forked repository into Vercel and start the deployment process. AWFEX is optimized for serverless environments."
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-black border border-slate-800 text-slate-300 text-sm font-mono">
                            <span className="w-3 h-3 rounded-full bg-white"></span>
                            Deploying...
                        </div>
                    </StepCard>

                    {/* Step 3: Env Vars */}
                    <StepCard
                        number="3"
                        title="Configure Environment Variables"
                        description="During deployment (or in settings), add the following environment variables. Set your own secure API Key."
                    >
                        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 font-mono text-xs md:text-sm overflow-x-auto shadow-inner">
                            <div className="flex flex-col sm:flex-row sm:gap-4 mb-2 border-b border-slate-800 pb-2">
                                <span className="text-purple-400 font-bold min-w-[140px]">GEMINI_API_KEY</span>
                                <span className="hidden sm:inline text-slate-400">=</span>
                                <span className="text-slate-500 break-all">AIzaSy... (Your Google Gemini Key)</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:gap-4 mb-2 border-b border-slate-800 pb-2">
                                <span className="text-purple-400 font-bold min-w-[140px]">REDIS_URL</span>
                                <span className="hidden sm:inline text-slate-400">=</span>
                                <span className="text-slate-500 break-all">redis://default:password@host:port (Your Redis connection URL)</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:gap-4 mb-2 border-b border-slate-800 pb-2">
                                <span className="text-purple-400 font-bold min-w-[140px]">DATABASE_URL</span>
                                <span className="hidden sm:inline text-slate-400">=</span>
                                <span className="text-slate-500 break-all">
                                    postgresql://user:password@host:port/dbname?sslmode=require (Your NeonDB PostgreSQL connection URL)
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-4">
                                <span className="text-purple-400 font-bold min-w-[140px]">API_KEY</span>
                                <span className="hidden sm:inline text-slate-400">=</span>
                                <span className="text-slate-500 break-all">your-secret-key-123</span>
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-slate-500 italic">
                            * The API_KEY you set here will be required to secure your workflow endpoints.
                        </p>
                    </StepCard>

                    {/* Step 4: Settings */}
                    <StepCard
                        number="4"
                        title="Connect Designer"
                        description="One deployed, open awfex site. Go to the Designer page, click the Settings tab, and connect your frontend to your backend."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                            <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                <div className="text-[10px] uppercase text-slate-500 mb-1 font-bold">API URL</div>
                                <div className="text-indigo-300 font-mono text-sm">https://your-project.vercel.app</div>
                            </div>
                            <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                <div className="text-[10px] uppercase text-slate-500 mb-1 font-bold">API KEY</div>
                                <div className="text-indigo-300 font-mono text-sm">your-secret-key-123</div>
                            </div>
                        </div>
                    </StepCard>

                    {/* Step 5: Design */}
                    <StepCard
                        number="5"
                        title="Design & Save"
                        description="Use the drag-and-drop canvas to build your logic. Hover over any node to see a detailed tooltip description of what it does."
                    >
                    </StepCard>

                    {/* Step 6: Trigger */}
                    <StepCard
                        number="6"
                        title="Trigger Workflows"
                        description="Once saved, your workflow is live. Trigger it via HTTP POST requests using the endpoint provided in the save confirmation."
                        isLast={true}
                    >
                        <div className="mt-4">
                            <Link to="/docs" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                <span>View API Documentation</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </StepCard>
                </div>
            </div>
        </div>
    );
}

function StepCard({ number, title, description, children, isLast }) {
    return (
        <div className="relative flex gap-6 md:gap-10">
            {/* Number Bubble */}
            <div className="flex-shrink-0 z-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 text-xl font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    {number}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8 md:pb-12">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6">{description}</p>
                {children && (
                    <div className="mt-4 animate-[fadeIn_0.5s_ease-out]">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}

