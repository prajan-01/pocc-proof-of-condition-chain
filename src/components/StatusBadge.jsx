import React from 'react';
import { cn } from '../lib/utils';

export default function StatusBadge({ status, className }) {
    const statusStyles = {
        pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        monitoring: 'bg-primary/20 text-primary border-primary/30',
        breach_detected: 'bg-danger/20 text-danger border-danger/30',
        settled_safe: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        settled_liability: 'bg-accent/20 text-accent border-accent/30',
        settled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    const formattedStatus = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <span className={cn('px-2 py-1 text-xs font-semibold rounded-full border', statusStyles[status] || statusStyles.pending, className)}>
            {formattedStatus}
        </span>
    );
}
