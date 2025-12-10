import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroFlow from "../components/HeroFlow";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 overflow-hidden relative selection:bg-indigo-500/30">
            <Navbar />

            {/* Unified Fixed Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid"></div>
                {/* Deeper, more unified glows */}
                <div className="absolute -top-[20%] right-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[40%] -left-[20%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            {/* Hero Section */}
            <header className="relative z-10 pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-20 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-16">
                        <div className="flex-1 text-center lg:text-left z-20 flex flex-col justify-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 animate-[fadeIn_0.8s_ease-out] leading-tight">
                                <span className="block">Automate Anything.</span>
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block">
                                    Visually & Hackably.
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-[fadeIn_0.9s_ease-out] max-w-2xl mx-auto lg:mx-0">
                                AWFEX is the open-source, function-first workflow engine.
                                Design complex logic pipelines visually, trigger them via HTTP,
                                and extend effortlessly with standard JavaScript.
                            </p>

                            {/* Mobile Notice - Designer requires large screen */}
                            <div className="md:hidden mb-8 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg backdrop-blur-sm animate-[fadeIn_1s_ease-out]">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-amber-200 text-sm font-semibold mb-1">Designer Requires Large Screen</p>
                                        <p className="text-amber-300/80 text-xs leading-relaxed">
                                            The visual workflow designer is optimized for PC and large screens. Please use a desktop or laptop to access the designer feature.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-[fadeIn_1s_ease-out]">
                                <Link
                                    to="/designer"
                                    className="hidden md:inline-flex group relative px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 rounded-lg text-white font-bold text-base sm:text-lg hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2 justify-center">
                                        Start Designing
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </Link>
                                <Link
                                    to="/docs"
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 font-bold text-base sm:text-lg hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all transform hover:-translate-y-1 backdrop-blur-sm"
                                >
                                    Read Documentation
                                </Link>
                            </div>
                        </div>

                        {/* Right Content - Demo Canvas - Hidden on mobile */}
                        <div className="hidden lg:flex flex-1 relative w-full rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-md shadow-2xl overflow-hidden animate-[fadeIn_1.2s_ease-out]">

                            {/* Header */}
                            <div className="absolute top-0 left-0 right-0 h-10 bg-slate-800/80 border-b border-slate-700/50 flex items-center px-3 gap-2 z-20">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                <div className="text-[10px] ml-2 text-indigo-300 font-mono font-bold tracking-wide">
                                    data_analysis_agent.json
                                </div>
                            </div>

                            {/* React Flow Diagram */}
                            <div className="absolute inset-0 top-10 bg-slate-950/50">
                                <HeroFlow />
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <Separator />

            <section className="py-16 sm:py-20 lg:py-24 relative z-10 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why AWFEX?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                            Modern automation tools are powerful but often heavy or locked down.
                            AWFEX takes a different approach.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            }
                            title="Function First"
                            description="Don't wait for integrations. If you can write a JavaScript function for it, you can automate it immediately."
                        />
                        <FeatureCard
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                            }
                            title="Visual Builder"
                            description="Powered by React Flow. Drag, drop, and connect nodes to create logic pipelines without writing boilerplate."
                        />
                        <FeatureCard
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            }
                            title="Open Source"
                            description="No vendor lock-in. Inspect the code, fork it, or self-host it on your own infrastructure."
                        />
                        <FeatureCard
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            }
                            title="Serverless Ready"
                            description="Lightweight HTTP-based architecture makes it perfect for deployment on serverless platforms."
                        />
                        <FeatureCard
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                            }
                            title="Instant Triggers"
                            description="Every workflow gets an endpoint. Trigger your automations via standard HTTP requests from anywhere."
                        />
                        <FeatureCard
                            icon={
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            }
                            title="Backend as a Service"
                            description="Use AWFEX as a low-code backend. Define logic visually and consume it from your frontend."
                        />
                    </div>
                </div>
            </section>

            <Separator />

            {/* How It Works */}
            <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden z-10 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-slate-400 text-sm sm:text-base">From idea to execution in three steps.</p>
                    </div>

                    {/* Mobile: Vertical Timeline */}
                    <div className="lg:hidden max-w-4xl mx-auto relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[40px] sm:left-[48px] top-[60px] bottom-[60px] w-[2px] bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-pink-500/50 border-l-2 border-dashed border-indigo-500/30"></div>

                        {/* Steps */}
                        <div className="space-y-8">
                            {/* Step 1 */}
                            <div className="flex items-start gap-6 group">
                                <div className="relative flex-shrink-0">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/80 backdrop-blur-sm border-2 border-indigo-500/50 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-indigo-400 group-hover:shadow-indigo-500/30 transition-all duration-500 relative overflow-hidden z-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900 shadow-lg">1</div>
                                    </div>
                                </div>
                                <div className="flex-1 pl-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Design</h3>
                                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                                        Drag functions onto the canvas and connect them to define the flow of data.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-6 group">
                                <div className="relative flex-shrink-0">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/80 backdrop-blur-sm border-2 border-purple-500/50 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-purple-400 group-hover:shadow-purple-500/30 transition-all duration-500 relative overflow-hidden z-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900 shadow-lg">2</div>
                                    </div>
                                </div>
                                <div className="flex-1 pl-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">Save</h3>
                                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                                        Your logic is verified and saved as a lightweight JSON structure.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-6 group">
                                <div className="relative flex-shrink-0">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/80 backdrop-blur-sm border-2 border-pink-500/50 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-pink-400 group-hover:shadow-pink-500/30 transition-all duration-500 relative overflow-hidden z-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900 shadow-lg">3</div>
                                    </div>
                                </div>
                                <div className="flex-1 pl-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">Execute</h3>
                                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                                        Trigger your workflow via API or run it directly from the dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop: Horizontal Centered Layout */}
                    <div className="hidden lg:grid grid-cols-3 gap-12 text-center relative">
                        <Step
                            number="1"
                            title="Design"
                            text="Drag functions onto the canvas and connect them to define the flow of data."
                            icon={
                                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            }
                        />

                        {/* Connection Line */}
                        <div className="absolute top-[40px] left-[calc(16.66%+40px)] w-[calc(33.33%-80px)] h-[2px] bg-gradient-to-r from-indigo-500/50 to-indigo-500/50 border-t-2 border-dashed border-indigo-500/30"></div>

                        <Step
                            number="2"
                            title="Save"
                            text="Your logic is verified and saved as a lightweight JSON structure."
                            icon={
                                <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                            }
                        />

                        {/* Connection Line */}
                        <div className="absolute top-[40px] right-[calc(16.66%+40px)] w-[calc(33.33%-80px)] h-[2px] bg-gradient-to-r from-purple-500/50 to-purple-500/50 border-t-2 border-dashed border-purple-500/30"></div>

                        <Step
                            number="3"
                            title="Execute"
                            text="Trigger your workflow via API or run it directly from the dashboard."
                            icon={
                                <svg className="w-10 h-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </section>

            <Separator />

            {/* CTA Section - Hidden on small screens */}
            <section className="hidden md:block py-16 sm:py-20 lg:py-24 relative overflow-hidden z-10 bg-transparent">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to Automate?</h2>
                    <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                        Join the experiment. Build your first workflow in seconds.
                        No sign-up required, just local power.
                    </p>
                    <Link
                        to="/designer"
                        className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-white text-slate-950 font-bold text-base sm:text-lg rounded-lg hover:bg-slate-200 transition-all transform hover:-translate-y-1 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
                    >
                        <span>Launch Designer</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl text-center text-slate-500 text-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-300">AWFEX</span>
                            <span className="text-slate-600">|</span>
                            <span>MIT License</span>
                        </div>
                        <div className="flex gap-8">
                            <a href="https://github.com/prodev717/awfex" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2 group">
                                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                GitHub
                            </a>
                            <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
                            <Link to="/setup" className="hover:text-white transition-colors">Setup</Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-900 text-xs text-slate-600">
                        &copy; {new Date().getFullYear()} AWFEX. Built for builders.
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Separator() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-8 bg-slate-950/20 backdrop-blur-md border border-slate-800/50 rounded-xl hover:bg-slate-900/40 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-6 p-4 bg-slate-900/80 rounded-2xl w-fit text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-900/30 transition-colors border border-slate-800 group-hover:border-indigo-500/20">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-100 transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">{description}</p>
        </div>
    );
}

function Step({ number, title, text, icon }) {
    return (
        <div className="flex flex-col items-center relative z-10 group">
            <div className="w-20 h-20 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                    {number}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 max-w-xs text-sm leading-relaxed">{text}</p>
        </div>
    );
}
