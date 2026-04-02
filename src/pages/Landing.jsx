import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Leaf } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[128px]"></div>

            <div className="z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-8">
                    <ShieldCheck className="w-16 h-16 text-primary" />
                    <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-accent">
                        PoCC
                    </h1>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white pb-2">
                    Proof-of-Condition Chain
                </h2>

                <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                    The ultimate agri-supply-chain accountability platform. Preventing farmers from being unfairly blamed when produce spoils, using blockchain-backed IoT sensor tracking.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/login" className="btn-primary text-lg px-8 py-4">
                        Enter App
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
                    <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center">
                        <Leaf className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Farmer Protection</h3>
                        <p className="text-gray-400 text-sm">Escrow-backed guaranteed payments if produce leaves the farm in good condition.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center">
                        <Cpu className="w-10 h-10 text-secondary mb-4" />
                        <h3 className="text-xl font-bold mb-2">IoT Simulation</h3>
                        <p className="text-gray-400 text-sm">Live temperature and humidity tracking to pinpoint exactly when spoilage occurs.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center">
                        <ShieldCheck className="w-10 h-10 text-accent mb-4" />
                        <h3 className="text-xl font-bold mb-2">Automated Liability</h3>
                        <p className="text-gray-400 text-sm">Smart contracts instantly reassign blame based on immutable sensor data.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
