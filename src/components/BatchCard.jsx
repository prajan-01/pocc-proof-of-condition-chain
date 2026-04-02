import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Package, MapPin, Scale, ThermometerSun } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BatchCard({ batch }) {
    return (
        <div className="glass-panel p-4 rounded-xl hover:border-primary/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg">{batch.batch_name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{batch.crop_type}</p>
                </div>
                <StatusBadge status={batch.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-gray-500" />
                    <span>{batch.weight_kg} kg</span>
                </div>
                <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{batch.source_location}</span>
                </div>
            </div>

            {batch.breach_detected && (
                <div className="mb-4 text-xs p-2 rounded bg-danger/20 text-danger border border-danger/30 flex items-center space-x-2">
                    <ThermometerSun className="w-4 h-4" />
                    <span>Breach Detected!</span>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <Link to={`/batch/${batch.id}`} className={cn("text-primary hover:text-emerald-400 text-sm font-medium", batch.breach_detected && "text-danger hover:text-red-400")}>
                    View Details &rarr;
                </Link>
            </div>
        </div>
    );
}
