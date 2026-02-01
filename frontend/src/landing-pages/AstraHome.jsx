
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Nightmare Elements ---
import FaultyTerminal from '../landing-components/react-bits/Backgrounds/FaultyTerminal/FaultyTerminal';
import GlitchText from '../landing-components/react-bits/TextAnimations/GlitchText/GlitchText';
import Noise from '../landing-components/react-bits/Animations/Noise/Noise';
import TargetCursor from '../landing-components/react-bits/Animations/TargetCursor/TargetCursor';

// --- Retained Components ---
import SpotlightCard from '../landing-components/react-bits/Components/SpotlightCard/SpotlightCard';
import TrueFocus from '../landing-components/react-bits/TextAnimations/TrueFocus/TrueFocus';
import SplitText from '../landing-components/react-bits/TextAnimations/SplitText/SplitText';
import DecryptedText from '../landing-components/react-bits/TextAnimations/DecryptedText/DecryptedText';
import ShinyText from '../landing-components/react-bits/TextAnimations/ShinyText/ShinyText';

// Icons
import { Activity, AlertTriangle, Terminal, Search, GitPullRequest, ShieldCheck, ArrowRight, Zap, Database, Lock } from 'lucide-react';

const AstraHome = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#030303] text-stone-300 font-sans min-h-screen relative overflow-x-hidden selection:bg-red-500/20 selection:text-red-200 cursor-none">

            {/* 0. Custom Cursor */}
            <TargetCursor
                borderWidth={2}
                circleColor="#ff0000"
                dotColor="#ff0000"
            />

            {/* HEADER */}
            <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 md:p-8 pointer-events-none">
                {/* Top Left: ASTRA Title */}
                <div className="pointer-events-auto cursor-target">
                    <DecryptedText
                        text="ASTRA"
                        speed={100}
                        maxIterations={20}
                        characters="ABCD1234!?"
                        className="text-2xl md:text-3xl font-display font-bold text-white tracking-widest"
                        parentClassName="inline-block"
                        encryptedClassName="text-red-500"
                        animateOn="view"
                    />
                </div>

                {/* Top Right: Get Started Button */}
                <div className="pointer-events-auto cursor-target">
                    <button
                        onClick={() => navigate('/login')}
                        className="group relative px-6 py-3 bg-stone-900/50 backdrop-blur-md border border-stone-800 rounded-full hover:border-white/50 transition-colors overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <ShinyText
                            text="Get Started"
                            disabled={false}
                            speed={3}
                            className="font-mono text-xs md:text-sm uppercase tracking-widest font-bold"
                        />
                    </button>
                </div>
            </div>

            {/* 1. Background Layer - Adjusted for better readability */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
                <FaultyTerminal
                    text={`> INITIALIZING ASTRA_CORE...\n> CONNECTING TO INFRASTRUCTURE...\n> OBSERVING LOG STREAMS...\n> ANOMALY: CHECKOUT_API_LATENCY > 500ms\n> ROOT CAUSE: MIGRATION_DB_LOCK\n> ACTION: REROUTE_TRAFFIC\n> STATUS: HEALING...`}
                    fadeSpeed={0.02}
                    glitchChance={0.01}
                    maskColor="#030303"
                    fontFamily="JetBrains Mono, monospace"
                />
            </div>

            {/* 2. Noise Overlay - Optimized */}
            <div className="fixed inset-0 z-10 pointer-events-none opacity-[0.06] mix-blend-overlay">
                <Noise patternSize={300} patternAlpha={10} patternRefreshInterval={30} />
            </div>

            {/* 3. Main Content */}
            <div className="relative z-20 flex flex-col items-center min-h-screen px-6 py-24 md:py-32">

                {/* HERO SECTION */}
                <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 mb-32">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-4 py-1.5 rounded-full font-mono text-red-400 text-xs tracking-widest uppercase">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span>Autonomous Infrastructure Protection</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-display font-medium tracking-tighter text-white leading-[0.9]">
                            Self-Healing <br />
                            <span className="text-stone-500">Migration</span>
                        </h1>

                        <p className="text-xl text-stone-400 max-w-xl leading-relaxed font-light border-l border-stone-800 pl-6">
                            Stop fighting fires. Astra is the <span className="text-white font-medium">sentient layer</span> that observes, reasons, and heals your headless architecture in real-time.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <button className="cursor-target px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
                                Deploy Agent
                            </button>
                            <button className="cursor-target px-8 py-4 bg-transparent border border-stone-700 text-white font-bold uppercase tracking-widest hover:border-white transition-colors">
                                Read Documentation
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-lg">
                        <div className="cursor-target relative bg-stone-900/40 backdrop-blur-md border border-stone-800/50 p-6 rounded-lg font-mono text-xs md:text-sm text-stone-400 shadow-2xl">
                            <div className="absolute top-0 right-0 p-2 opacity-50"><Terminal size={16} /></div>
                            <div className="space-y-2">
                                <p className="text-green-500 pb-2">User: Naitik (Support Lead)</p>
                                <p>{'>'} System status check</p>
                                <p className="text-yellow-500">! WARNING: Ticket surge detected (Checkout 500)</p>
                                <p>{'>'} Astra analysis running...</p>
                                <p className="text-white">{'>'} Root Cause Identified: Legacy Webhook Failure</p>
                                <p>{'>'} Action: Auto-retry with backoff + Alert Eng Team</p>
                                <p className="text-green-500">{'>'} <span className="animate-pulse">Resolved.</span> Ticket volume normalizing.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROBLEM / SOLUTION GRID */}
                <div className="w-full max-w-7xl mb-40">
                    <div className="flex items-end justify-between mb-12 border-b border-stone-800 pb-4">
                        <h2 className="text-2xl text-white font-display">The Agentic Loop</h2>
                        <span className="font-mono text-stone-500 text-xs uppercase tracking-widest">Architecture v1.0</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Cards */}
                        <div className="cursor-target h-full">
                            <SpotlightCard className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 p-8 h-full min-h-[300px] flex flex-col justify-between group hover:bg-emerald-900/50 hover:border-emerald-500/50 transition-all duration-500" spotlightColor="rgba(16, 185, 129, 0.2)">
                                <Search className="text-stone-600 group-hover:text-emerald-400 transition-colors mb-4" size={32} />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-100">01. Observe</h3>
                                    <p className="text-sm text-stone-500 leading-relaxed group-hover:text-stone-300">
                                        Ingests millions of signals: tickets, logs, webhooks. It sees what you miss in the noise.
                                    </p>
                                </div>
                            </SpotlightCard>
                        </div>

                        <div className="cursor-target h-full">
                            <SpotlightCard className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 p-8 h-full min-h-[300px] flex flex-col justify-between group hover:bg-blue-900/50 hover:border-blue-500/50 transition-all duration-500" spotlightColor="rgba(59, 130, 246, 0.2)">
                                <Database className="text-stone-600 group-hover:text-blue-400 transition-colors mb-4" size={32} />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-100">02. Reason</h3>
                                    <p className="text-sm text-stone-500 leading-relaxed group-hover:text-stone-300">
                                        Builds a dependency graph of your migration. Knows if it's a bug, a config error, or a user mistake.
                                    </p>
                                </div>
                            </SpotlightCard>
                        </div>

                        <div className="cursor-target h-full">
                            <SpotlightCard className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 p-8 h-full min-h-[300px] flex flex-col justify-between group hover:bg-red-900/50 hover:border-red-500/50 transition-all duration-500" spotlightColor="rgba(239, 68, 68, 0.2)">
                                <Zap className="text-stone-600 group-hover:text-red-400 transition-colors mb-4" size={32} />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-100">03. Decide</h3>
                                    <p className="text-sm text-stone-500 leading-relaxed group-hover:text-stone-300">
                                        Selects the optimal path: Page an engineer? Update documentation? Or auto-fix the config?
                                    </p>
                                </div>
                            </SpotlightCard>
                        </div>

                        <div className="cursor-target h-full">
                            <SpotlightCard className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 p-8 h-full min-h-[300px] flex flex-col justify-between group hover:bg-purple-900/50 hover:border-purple-500/50 transition-all duration-500" spotlightColor="rgba(168, 85, 247, 0.2)">
                                <Lock className="text-stone-600 group-hover:text-purple-400 transition-colors mb-4" size={32} />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-100">04. Act</h3>
                                    <p className="text-sm text-stone-500 leading-relaxed group-hover:text-stone-300">
                                        Executes securely. Requires human approval for high-risk actions. Zero hallucinations.
                                    </p>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>

                {/* MODULES NAVIGATION */}
                <div className="w-full max-w-7xl">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 text-center mb-12">
                        System Modules
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <SpotlightCard className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 p-12 cursor-pointer hover:bg-emerald-900/50 hover:border-emerald-500/50 transition-all duration-500 group" spotlightColor="rgba(16, 185, 129, 0.2)">
                            <span className="text-xs font-mono text-emerald-500 mb-2 block opacity-0 group-hover:opacity-100 transition-opacity">LIVE DASHBOARD</span>
                            <h3 className="text-3xl font-display font-bold text-white group-hover:text-emerald-100 transition-colors">Console</h3>
                            <p className="text-stone-500 mt-4 text-sm group-hover:text-emerald-200/70 transition-colors">Real-time monitoring of agent activities and ticket resolution.</p>
                        </SpotlightCard>

                        <SpotlightCard className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 p-12 cursor-pointer hover:bg-red-900/50 hover:border-red-500/50 transition-all duration-500 group" spotlightColor="rgba(239, 68, 68, 0.2)">
                            <span className="text-xs font-mono text-red-500 mb-2 block opacity-0 group-hover:opacity-100 transition-opacity">METRICS</span>
                            <h3 className="text-3xl font-display font-bold text-white group-hover:text-red-100 transition-colors">Impact</h3>
                            <p className="text-stone-500 mt-4 text-sm group-hover:text-red-200/70 transition-colors">Quantify ROI, time saved, and autonomous resolution rates.</p>
                        </SpotlightCard>

                        <SpotlightCard className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 p-12 cursor-pointer hover:bg-blue-900/50 hover:border-blue-500/50 transition-all duration-500 group" spotlightColor="rgba(59, 130, 246, 0.2)">
                            <span className="text-xs font-mono text-blue-500 mb-2 block opacity-0 group-hover:opacity-100 transition-opacity">LOGS</span>
                            <h3 className="text-3xl font-display font-bold text-white group-hover:text-blue-100 transition-colors">Audit</h3>
                            <p className="text-stone-500 mt-4 text-sm group-hover:text-blue-200/70 transition-colors">Full traceability of every decision and action taken by Astra.</p>
                        </SpotlightCard>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="w-full max-w-7xl mt-40 border-t border-stone-900 pt-12 flex justify-between items-end">
                    <div>
                        <h4 className="text-white font-bold leading-none mb-1">ASTRA AI</h4>
                        <p className="text-stone-600 text-xs">Sentience Layer v2.4.0</p>
                    </div>
                    <TrueFocus
                        sentence="The machine is awake."
                        manualMode={false}
                        blurAmount={3}
                        borderColor="#333"
                        glowColor="rgba(255, 255, 255, 0.1)"
                        animationDuration={1}
                        pauseBetweenAnimations={4}
                    />
                </div>

            </div>
        </div>
    );
};

export default AstraHome;
