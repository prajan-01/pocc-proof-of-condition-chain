import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import BatchCard from '../components/BatchCard';
import { PlusCircle, Package } from 'lucide-react';

export default function Dashboard() {
    const { profile } = useAuth();
    const { batches, alerts } = useApp();

    const myBatches = batches.filter(b => b.farmer_id === profile?.id || b.current_custodian_id === profile?.id);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Farmer Dashboard</h1>
                    <p className="text-gray-400 mt-2">Manage your crop batches and monitor transit conditions.</p>
                </div>
                <Link to="/create-batch" className="btn-primary flex items-center space-x-2">
                    <PlusCircle className="w-5 h-5" />
                    <span>New Batch</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-gray-400 font-medium mb-1">Total Batches</h3>
                    <p className="text-3xl font-bold">{myBatches.length}</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border-t border-primary">
                    <h3 className="text-gray-400 font-medium mb-1">In Transit</h3>
                    <p className="text-3xl font-bold">{myBatches.filter(b => b.status !== 'settled').length}</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border-t border-danger">
                    <h3 className="text-gray-400 font-medium mb-1">Active Alerts</h3>
                    <p className="text-3xl font-bold text-danger">{alerts.filter(a => !a.resolved).length}</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    Recent Batches
                </h2>
                {myBatches.length === 0 ? (
                    <div className="glass-panel p-12 text-center text-gray-500 rounded-xl">
                        No batches created yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myBatches.map(batch => (
                            <BatchCard key={batch.id} batch={batch} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
