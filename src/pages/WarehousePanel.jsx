import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import BatchCard from '../components/BatchCard';
import { Home } from 'lucide-react';

export default function WarehousePanel() {
    const { profile } = useAuth();
    const { batches } = useApp();

    const myBatches = batches.filter(b => b.current_custodian_id === profile?.id);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center space-x-4 mb-8 border-b border-white/10 pb-4">
                <Home className="w-10 h-10 text-secondary" />
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Warehouse Panel</h1>
                    <p className="text-gray-400">Inventory currently stored in your facility</p>
                </div>
            </div>

            {myBatches.length === 0 ? (
                <div className="glass-panel p-12 text-center text-gray-500 rounded-xl">
                    No inventory currently in warehouse.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myBatches.map(batch => (
                        <BatchCard key={batch.id} batch={batch} />
                    ))}
                </div>
            )}
        </div>
    );
}
