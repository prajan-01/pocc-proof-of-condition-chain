import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TimelineChain({ logs, currentCustodianId }) {
    if (!logs || logs.length === 0) {
        return <div className="text-gray-500 text-sm italic">No custody transfers yet.</div>;
    }

    return (
        <div className="space-y-4">
            {logs.map((log, index) => {
                const isCurrent = log.to_user === currentCustodianId && index === logs.length - 1;

                return (
                    <div key={log.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className={cn("p-1 rounded-full", isCurrent ? "bg-primary/20 text-primary" : "bg-emerald-500/20 text-emerald-500")}>
                                {isCurrent ? <Circle className="w-5 h-5 fill-current animate-pulse" /> : <CheckCircle2 className="w-5 h-5" />}
                            </div>
                            {index < logs.length - 1 && <div className="w-px h-full bg-white/10 my-1" />}
                        </div>

                        <div className="pb-4">
                            <p className="font-semibold text-sm capitalize">{log.stage} Stage</p>
                            <div className="text-xs text-gray-400 mt-1">
                                Transferred to: <span className="font-mono text-gray-300">{log.to_user.slice(0, 8)}...</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(log.transferred_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
