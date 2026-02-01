
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../landing-components/react-bits/Backgrounds/Particles/Particles';
import FaultyTerminal from '../landing-components/react-bits/Backgrounds/FaultyTerminal/FaultyTerminal';
import Noise from '../landing-components/react-bits/Animations/Noise/Noise';
import SpotlightCard from '../landing-components/react-bits/Components/SpotlightCard/SpotlightCard';
import DecryptedText from '../landing-components/react-bits/TextAnimations/DecryptedText/DecryptedText';
import ShinyText from '../landing-components/react-bits/TextAnimations/ShinyText/ShinyText';
import TargetCursor from '../landing-components/react-bits/Animations/TargetCursor/TargetCursor';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-stone-300 selection:bg-red-500/20 selection:text-red-200 cursor-none">

            {/* Custom Cursor */}
            <TargetCursor
                borderWidth={2}
                circleColor="#ff0000"
                dotColor="#ff0000"
            />

            {/* Layer 0: Faulty Terminal Background (Faint) */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <FaultyTerminal text="SENTIENCE_LAYER_ACCESS... AUTH_REQUIRED..." />
            </div>

            {/* Layer 1: Particles */}
            <div className="absolute inset-0 z-0 opacity-60">
                <Particles
                    particleCount={60}
                    particleSpread={10}
                    speed={0.1}
                    particleColors={['#ffffff', '#ff0000', '#333333']}
                    moveParticlesOnHover={true}
                    particleHoverFactor={1}
                    alphaParticles={true}
                    particleBaseSize={100}
                    sizeRandomness={1}
                    cameraDistance={20}
                    disableRotation={false}
                />
            </div>

            {/* Layer 2: Noise Overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay">
                <Noise patternSize={250} patternScaleX={1} patternScaleY={1} patternRefreshInterval={15} patternAlpha={15} />
            </div>

            {/* Corner Decorations */}
            <div className="fixed bottom-8 left-8 z-40 hidden md:flex items-center gap-2 text-[10px] font-mono text-stone-600 tracking-widest pointer-events-none">
                <ShieldCheck size={14} className="text-stone-700" />
                <DecryptedText text="SYSTEM SECURE" speed={100} animateOn="view" />
            </div>

            <div className="fixed bottom-8 right-8 z-40 hidden md:flex items-center gap-2 text-[10px] font-mono text-stone-600 tracking-widest pointer-events-none">
                <Lock size={14} className="text-stone-700" />
                <DecryptedText text="ENCRYPTION: AES-256" speed={100} animateOn="view" />
            </div>


            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 z-50 p-2 text-stone-500 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer pointer-events-auto"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm tracking-widest uppercase font-mono">Back</span>
            </button>

            {/* Login Container */}
            <div className="relative z-10 flex items-center justify-center h-full px-4">
                <div className="w-full max-w-sm pointer-events-auto">
                    <SpotlightCard
                        className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative"
                        spotlightColor="rgba(255, 255, 255, 0.05)"
                    >
                        {/* Card Top Decoration */}
                        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="flex flex-col space-y-6">

                            {/* Google Option */}
                            <button className="w-full relative px-6 py-4 bg-[#1a1a1a] hover:bg-[#252525] border border-white/5 rounded-xl transition-all flex items-center justify-center gap-3 group cursor-pointer active:scale-95 duration-200">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <div className="font-medium text-white text-sm tracking-wide">
                                    <ShinyText text="Continue with Google" disabled={false} speed={3} className="" />
                                </div>
                            </button>

                            {/* OR Divider */}
                            <div className="flex items-center gap-3">
                                <div className="h-px bg-white/10 flex-1" />
                                <span className="text-[10px] text-stone-500 font-medium uppercase tracking-widest">
                                    <DecryptedText text="OR" speed={150} animateOn="view" />
                                </span>
                                <div className="h-px bg-white/10 flex-1" />
                            </div>

                            {/* Email Form */}
                            <div className="space-y-4">
                                <div className="group relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full bg-[#1a1a1a] border border-white/5 focus:border-white/20 rounded-xl px-4 py-4 text-sm text-white placeholder-stone-600 outline-none transition-all"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                                </div>

                                {/* Email Button */}
                                <button className="w-full bg-white hover:bg-neutral-200 text-black font-bold text-sm rounded-xl px-4 py-4 transition-all cursor-pointer active:scale-95 duration-200 flex justify-center">
                                    <span className="tracking-wide">Continue with email</span>
                                </button>
                            </div>

                        </div>
                    </SpotlightCard>
                </div>
            </div>
        </div>
    );
};

export default Login;
