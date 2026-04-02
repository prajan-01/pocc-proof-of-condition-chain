import React from 'react';
import { analyzeFairPay } from '../lib/fairPayEngine';
import { ShieldCheck, AlertTriangle, UserCheck, DollarSign, Clock, Truck, ShieldAlert } from 'lucide-react';

export default function FairPayPanel({ batch, logs = [], readings = [] }) {
    if (!batch) return null;

    const fp = analyzeFairPay(batch, readings, logs);
    if (!fp) return null;

    const isBreach = fp.hasBreach;

    return (
        <div className="glass-panel p-6 rounded-xl border border-white/10 mt-8 relative overflow-hidden">
            {/* Background Glows based on status */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none ${isBreach ? 'bg-danger' : 'bg-primary'}`}></div>

            <div className="flex items-center space-x-3 mb-6 relative">
                <div className={`p-2 rounded-lg ${isBreach ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
                    <DollarSign className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">💰 Fair Pay Assessment</h2>
            </div>
            
            {/* Main Verdict Card */}
            <div className={`p-5 rounded-lg mb-6 border ${isBreach ? 'bg-danger/10 border-danger/30 text-danger-100' : 'bg-primary/10 border-primary/30 text-primary-100'}`}>
                <div className="flex items-start space-x-4">
                    {isBreach ? <AlertTriangle className="w-8 h-8 text-danger flex-shrink-0 mt-1" /> : <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0 mt-1" />}
                    <div>
                        <h3 className={`text-xl font-bold mb-1 ${isBreach ? 'text-danger' : 'text-primary'}`}>
                            {fp.status}
                        </h3>
                        <p className="text-sm opacity-90 leading-relaxed font-medium">
                            {fp.verdict}
                        </p>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Farmer Protection Card */}
                <div className="bg-surface/50 border border-white/5 p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1 flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> Protected Party</div>
                    <div className="font-semibold text-primary">{fp.protectedParty}</div>
                    <div className="text-xs text-primary/70 mt-1">Receives full payment</div>
                </div>

                {/* Fair Pay Amount */}
                <div className="bg-surface/50 border border-white/5 p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1 flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Compensation Amount</div>
                    <div className="font-bold text-xl">₹{fp.amount}</div>
                    <div className="text-[10px] text-gray-500 mt-1 leading-tight">
                        {isBreach 
                            ? "To be paid by liable custodian instead of deducting from farmer." 
                            : "Standard payout without deductions."}
                    </div>
                </div>

                {isBreach && (
                    <>
                        {/* Liable Party */}
                        <div className="bg-surface/50 border border-white/5 p-4 rounded-lg">
                            <div className="text-xs text-gray-400 mb-1 flex items-center"><UserCheck className="w-3 h-3 mr-1" /> Liable Party</div>
                            <div className="font-semibold text-danger">{fp.liableParty}</div>
                            <div className="text-xs text-gray-500 mt-1 truncate">Role: {fp.liableRole}</div>
                        </div>

                        {/* Stage & Timestamp */}
                        <div className="bg-surface/50 border border-white/5 p-4 rounded-lg">
                            <div className="text-xs text-gray-400 mb-1 flex items-center"><Truck className="w-3 h-3 mr-1" /> Breach Stage</div>
                            <div className="font-medium text-sm truncate" title={fp.stage}>{fp.stage}</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center truncate" title={fp.timestamp}>
                                <Clock className="w-3 h-3 mr-1" /> {fp.timestamp}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* If breach happened, show the exact reason clearly */}
            {isBreach && fp.reason && (
                <div className="mt-4 p-3 bg-surface/30 border border-white/5 rounded-lg flex items-center space-x-3">
                    <ShieldAlert className="w-5 h-5 text-warning flex-shrink-0" />
                    <div>
                        <div className="text-xs text-gray-400">Triggering Event Evidence</div>
                        <div className="text-sm font-medium">{fp.reason}</div>
                        {fp.timestamp && <div className="text-xs text-gray-500 mt-0.5">Detected at {fp.timestamp}</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
