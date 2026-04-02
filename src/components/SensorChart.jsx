import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { thresholds } from '../data/thresholds';

export default function SensorChart({ data, cropType = 'tomato', isBreached = false }) {
    const limits = thresholds[cropType] || thresholds['tomato'];

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-gray-500">
                Waiting for sensor data...
            </div>
        );
    }

    return (
        <div className={`h-72 w-full mt-4 p-2 rounded-xl transition-colors duration-500 ${isBreached ? 'bg-danger/10 shadow-[inset_0px_0px_20px_rgba(239,68,68,0.2)] border border-danger/30' : 'bg-surface/30'}`}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        stroke="#9ca3af"
                        fontSize={12}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1A233A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                    />
                    <Legend />

                    <ReferenceLine y={limits.maxTemp} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Max Temp', fill: '#EF4444', fontSize: 10 }} />
                    <ReferenceLine y={limits.minTemp} stroke="#3B82F6" strokeDasharray="3 3" label={{ position: 'bottom', value: 'Min Temp', fill: '#3B82F6', fontSize: 10 }} />

                    <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#F59E0B" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
