import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import EscrowPanel from '../components/EscrowPanel';
import SensorChart from '../components/SensorChart';
import TimelineChain from '../components/TimelineChain';
import { transferCustodyOnChain, releaseToFarmerOnChain } from '../lib/blockchain';
import { SensorSimulator } from '../lib/sensorSimulator';
import FairPayPanel from '../components/FairPayPanel';

export default function BatchDetails() {
    const { id } = useParams();
    const { batches, custodyLogs, readings, transferCustody, addReading, settleEscrow } = useApp();
    const { profile } = useAuth();

    const batch = batches.find(b => b.id === id);
    const logs = custodyLogs.filter(l => l.batch_id === id);
    const batchReadings = readings.filter(r => r.batch_id === id);

    const [simRunning, setSimRunning] = useState(false);
    const [simMode, setSimMode] = useState('normal');
    const simRef = useRef(null);

    useEffect(() => {
        return () => {
            if (simRef.current) simRef.current.stop();
        };
    }, []);

    if (!batch) return <div className="p-8 text-center">Batch not found</div>;

    const handleTransfer = async () => {
        const toId = prompt("Enter ID of new custodian (mock):", "user-id-1234");
        if (!toId) return;
        const stage = prompt("Enter stage (e.g. Transit, Warehouse, Retail):", "Transit");

        transferCustody(id, profile.id, toId, stage);
        await transferCustodyOnChain(id, toId, stage);
    };

    const toggleSimulation = () => {
        if (simRunning) {
            simRef.current.stop();
            setSimRunning(false);
        } else {
            if (!simRef.current) {
                simRef.current = new SensorSimulator(id, addReading);
            }
            simRef.current.setMode(simMode);
            simRef.current.start();
            setSimRunning(true);
        }
    };

    const changeSimMode = (mode) => {
        setSimMode(mode);
        if (simRef.current) simRef.current.setMode(mode);
    };

    const handleSettle = async () => {
        settleEscrow(id);
        await releaseToFarmerOnChain(id);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{batch.batch_name}</h1>
                    <div className="flex space-x-3 items-center text-sm text-gray-400">
                        <span className="bg-white/5 rounded px-2 py-1 font-mono">ID: {batch.id}</span>
                        <span>•</span>
                        <span className="capitalize">{batch.crop_type}</span>
                        <span>•</span>
                        <span>{batch.weight_kg} kg</span>
                    </div>
                </div>
                <StatusBadge status={batch.status} className="text-lg px-4 py-2" />
            </div>

            <EscrowPanel batch={batch} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center space-x-3">
                                <span>Live Sensor Telemetry</span>
                                {simRunning && (
                                    <span className="flex h-3 w-3 relative" title="Receiving live feed">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                )}
                            </h2>
                            <div className="flex space-x-2">
                                <>
                                    <button
                                        onClick={() => changeSimMode('normal')}
                                        className={`px-3 py-1 text-xs rounded-full ${simMode === 'normal' ? 'bg-primary text-white' : 'bg-surface border border-white/10 text-gray-400'}`}
                                    >
                                        Normal
                                    </button>
                                    <button
                                        onClick={() => changeSimMode('spoilage')}
                                        className={`px-3 py-1 text-xs rounded-full ${simMode === 'spoilage' ? 'bg-danger text-white' : 'bg-surface border border-white/10 text-gray-400'}`}
                                    >
                                        Spoilage
                                    </button>
                                    <button onClick={toggleSimulation} className="btn-secondary text-xs px-3 py-1">
                                        {simRunning ? 'Stop Sim' : 'Start Sim'}
                                    </button>
                                </>
                            </div>
                        </div>
                        {batch.breach_detected && (
                            <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
                                <strong>Damage occurred during transport.</strong> Responsible party has been automatically identified and liability assigned via smart contract.
                            </div>
                        )}
                        <SensorChart data={batchReadings} cropType={batch.crop_type} isBreached={batch.breach_detected} />
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Batch Condition Hash</h2>
                        <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-gray-300 break-all select-all">
                            {batch.condition_nft_hash}
                        </div>
                        <p className="text-gray-500 text-xs mt-2 italic">Anchored to Polygon Amoy testnet.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-panel p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Actions</h2>
                        <div className="space-y-3">
                            {batch.status !== 'settled' && (
                                <button onClick={handleTransfer} className="w-full btn-secondary text-sm">
                                    Transfer Custody
                                </button>
                            )}
                            {batch.status !== 'settled' && profile?.role === 'Admin' && (
                                <button onClick={handleSettle} className="w-full btn-primary text-sm flex justify-center items-center">
                                    Settle Escrow
                                </button>
                            )}
                            {batch.status === 'settled' && (
                                <div className="text-center text-gray-500">Batch workflow completed.</div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-6">Chain of Custody</h2>
                        <TimelineChain logs={logs} currentCustodianId={batch.current_custodian_id} />
                    </div>
                </div>
            </div>

            <FairPayPanel batch={batch} logs={logs} readings={batchReadings} />
        </div>
    );
}
