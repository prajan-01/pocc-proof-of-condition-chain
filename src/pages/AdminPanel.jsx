import React from 'react';
import { useApp } from '../context/AppContext';
import BatchCard from '../components/BatchCard';
import { ShieldAlert } from 'lucide-react';

export default function AdminPanel() {
    const { batches, alerts } = useApp();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center space-x-4 mb-8 border-b border-white/10 pb-4">
                <ShieldAlert className="w-10 h-10 text-danger" />
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Admin Panel (System Overseer)</h1>
                    <p className="text-gray-400">Complete view of all batches and active spoilage alerts.</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-danger">Active Breaches / Alerts</h2>
                {alerts.length === 0 ? (
                    <div className="glass-panel p-6 text-center text-gray-500 rounded-xl">No active alerts.</div>
                ) : (
                    <div className="space-y-4">
                        {alerts.map(a => (
                            <div key={a.id} className="p-4 bg-danger/20 border border-danger/30 rounded-lg flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-danger">Batch {a.batch_id}</span>
                                    <p className="text-sm text-gray-300">{a.message}</p>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">All Global Batches</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map(batch => (
                        <BatchCard key={batch.id} batch={batch} />
                    ))}
                </div>
            </div>
        </div>
    );
}
