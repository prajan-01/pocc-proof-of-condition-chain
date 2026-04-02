import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // need to npm install uuid or use fallback
import { generateConditionHash } from '../lib/utils';
import { evaluateReading } from '../lib/blameEngine';

const AppContext = createContext({});

export function AppProvider({ children }) {
    // In-memory store for the hackathon demo if DB fails/is mocked
    const [batches, setBatches] = useState([]);
    const [custodyLogs, setCustodyLogs] = useState([]);
    const [readings, setReadings] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Actions
    const createBatch = async (batchData, farmerId) => {
        const id = Date.now().toString(); // uuid fallback
        const newBatch = {
            id,
            farmer_id: farmerId,
            ...batchData,
            status: 'pending',
            current_custodian_id: farmerId,
            condition_nft_hash: generateConditionHash(id, JSON.stringify(batchData)),
            created_at: new Date().toISOString(),
            escrow_status: 'monitoring'
        };
        setBatches(prev => [...prev, newBatch]);
        return newBatch;
    };

    const transferCustody = (batchId, fromUserId, toUserId, stage) => {
        const log = {
            id: Date.now().toString(),
            batch_id: batchId,
            from_user: fromUserId,
            to_user: toUserId,
            stage,
            transferred_at: new Date().toISOString()
        };
        setCustodyLogs(prev => [...prev, log]);

        setBatches(prev => prev.map(b => b.id === batchId ? { ...b, current_custodian_id: toUserId } : b));
    };

    const addReading = (batchId, reading) => {
        const batch = batches.find(b => b.id === batchId);
        const evalResult = evaluateReading(reading, batch?.crop_type);

        const newReading = {
            id: Date.now().toString(),
            ...reading,
            is_breach: evalResult.isBreach,
            breach_reason: evalResult.breachReason
        };

        setReadings(prev => [...prev, newReading]);

        if (evalResult.isBreach) {
            setBatches(prev => prev.map(b => {
                if (b.id === batchId && !b.breach_detected) {
                    return {
                        ...b,
                        breach_detected: true,
                        liable_party: b.current_custodian_id,
                        escrow_status: 'breach_detected'
                    };
                }
                return b;
            }));

            setAlerts(prev => [...prev, {
                id: Date.now().toString(),
                batch_id: batchId,
                message: `Condition breach: ${evalResult.breachReason}`,
                severity: 'high',
                created_at: new Date().toISOString(),
                resolved: false
            }]);
        }
    };

    const settleEscrow = (batchId) => {
        setBatches(prev => prev.map(b => {
            if (b.id === batchId) {
                return {
                    ...b,
                    status: 'settled',
                    escrow_status: b.breach_detected ? 'settled_liability' : 'settled_safe'
                };
            }
            return b;
        }));
    };

    return (
        <AppContext.Provider value={{ batches, custodyLogs, readings, alerts, createBatch, transferCustody, addReading, settleEscrow }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
