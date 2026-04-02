import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { createBatchOnChain } from '../lib/blockchain';

export default function CreateBatch() {
    const { profile } = useAuth();
    const { createBatch } = useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        batch_name: '',
        crop_type: 'tomato',
        weight_kg: '',
        grade: 'A',
        source_location: '',
        escrow_amount: '10'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const batch = await createBatch(formData, profile.id);
            await createBatchOnChain(batch.id, formData.escrow_amount);
            navigate(`/batch/${batch.id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Crop Batch</h1>

            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Batch Name</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary transition-colors"
                        placeholder="e.g. Summer Tomatoes 2024"
                        value={formData.batch_name}
                        onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Crop Type</label>
                        <select
                            className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary"
                            value={formData.crop_type}
                            onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                        >
                            <option value="tomato">Tomato</option>
                            <option value="lettuce">Lettuce</option>
                            <option value="berry">Berry</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                        <input
                            required
                            type="number"
                            className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary"
                            placeholder="e.g. 500"
                            value={formData.weight_kg}
                            onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Source Location</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary"
                        placeholder="e.g. Greenfield Farms, CA"
                        value={formData.source_location}
                        onChange={(e) => setFormData({ ...formData, source_location: e.target.value })}
                    />
                </div>

                <div className="pt-4 border-t border-white/10">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Escrow Amount (POL)</label>
                    <div className="flex items-center space-x-4">
                        <input
                            required
                            type="number"
                            className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary text-xl font-mono"
                            value={formData.escrow_amount}
                            onChange={(e) => setFormData({ ...formData, escrow_amount: e.target.value })}
                        />
                        <span className="text-xl font-bold text-gray-500">POL</span>
                    </div>
                    <p className="text-xs text-primary mt-2">Funds will be locked in smart contract.</p>
                </div>

                <button disabled={loading} type="submit" className="w-full btn-primary py-4 text-lg mt-4">
                    {loading ? 'Processing...' : 'Secure & Submit Batch'}
                </button>
            </form>
        </div>
    );
}
