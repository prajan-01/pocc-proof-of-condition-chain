import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';

export default function EscrowPanel({ batch }) {
    if (!batch) return null;

    const getStatusDisplay = () => {
        switch (batch.escrow_status) {
            case 'monitoring':
                return { icon: <ShieldCheck className="w-8 h-8 text-primary" />, title: 'Funds Secured & Monitoring', desc: 'Escrow is holding funds. Awaiting final delivery.' };
            case 'breach_detected':
                return { icon: <AlertTriangle className="w-8 h-8 text-danger" />, title: 'Breach Detected', desc: 'Liability assigned. Escrow frozen until settlement.' };
            case 'settled_safe':
                return { icon: <CheckCircle className="w-8 h-8 text-emerald-400" />, title: 'Settled Safe', desc: 'Delivery successful. Farmer received full payment.' };
            case 'settled_liability':
                return { icon: <CheckCircle className="w-8 h-8 text-accent" />, title: 'Settled (Liability)', desc: 'Farmer protected. Liable party penalized.' };
            default:
                return { icon: <ShieldCheck className="w-8 h-8 text-gray-400" />, title: 'Pending', desc: 'Waiting for escrow creation.' };
        }
    };

    const display = getStatusDisplay();

    return (
        <div className="glass-panel p-6 rounded-xl flex items-center space-x-6">
            <div className="p-4 bg-surface rounded-full shadow-lg border border-white/5">
                {display.icon}
            </div>
            <div>
                <h4 className="text-xl font-bold mb-1">{display.title}</h4>
                <p className="text-gray-400 text-sm">{display.desc}</p>
                <div className="mt-2 text-sm">
                    <span className="text-gray-500">Amount Protected: </span>
                    <span className="font-mono font-bold text-lg">{batch.escrow_amount || '0'} POL</span>
                </div>
            </div>
        </div>
    );
}
