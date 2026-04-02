// src/lib/fairPayEngine.js

export function analyzeFairPay(batch, readings = [], custodyLogs = []) {
    if (!batch) return null;

    // sort readings by timestamp
    const sortedReadings = [...readings].sort((a, b) => {
        const timeA = new Date(a.timestamp || a.created_at || a.recorded_at || 0).getTime();
        const timeB = new Date(b.timestamp || b.created_at || b.recorded_at || 0).getTime();
        return timeA - timeB;
    });

    // find first breach
    const breachReading = sortedReadings.find(r => r.is_breach || (r.breach_reason && r.breach_reason.length > 0));

    // parse numeric amounts safely
    const rawAmount = batch.escrow_amount || batch.escrowAmount || batch.compensation_amount || batch.fairPayAmount || 5000;
    const amount = Number(rawAmount).toLocaleString('en-IN');
    
    const farmerName = batch.farmer_name || batch.farmerId || batch.farmer_id || 'Farmer';

    if (!breachReading) {
        return {
            status: "No Spoilage Detected",
            hasBreach: false,
            protectedParty: farmerName,
            amount,
            verdict: "No breach detected. Farmer receives full payment and no liability is assigned.",
            liableParty: null,
            reason: null,
            timestamp: null,
            stage: null
        };
    }

    const breachTime = new Date(breachReading.timestamp || breachReading.created_at || breachReading.recorded_at).getTime();

    // sort logs by transferred_at
    const sortedLogs = [...custodyLogs].sort((a, b) => {
        const timeA = new Date(a.transferred_at || a.timestamp || a.created_at || 0).getTime();
        const timeB = new Date(b.transferred_at || b.timestamp || b.created_at || 0).getTime();
        return timeA - timeB;
    });

    // Determine initial custodian (farmer)
    let custodianName = farmerName;
    let custodianRole = 'Farmer';
    let stageStr = 'Pre-transit / With Farmer';
    let validLogsCount = 0;

    // Track state through logs
    for (const log of sortedLogs) {
        const transferTime = new Date(log.transferred_at || log.timestamp || log.created_at).getTime();
        if (transferTime <= breachTime) {
            // Updated custodian at the time of breach
            custodianName = log.to_name || log.to_user || log.toUser || 'Unknown Custodian';
            custodianRole = log.to_role || log.toRole || 'Custodian';
            const fromName = log.from_name || log.from_user || log.fromUser || 'Previous';
            stageStr = log.stage || `${fromName} → ${custodianName}`;
            validLogsCount++;
        } else {
            break;
        }
    }

    const isFarmerLiable = validLogsCount === 0;

    // Fallbacks
    if (sortedLogs.length === 0 && batch.liable_party && batch.liable_party !== farmerName) {
         custodianName = batch.liable_party;
         stageStr = "Unknown (Missing logs)";
    }
    
    // Formatting the stage if it's Transit
    if (stageStr.toLowerCase().includes('transit')) {
        stageStr = `${stageStr} / In Transit`;
    }

    let verdict = "";
    if (validLogsCount === 0) {
        custodianRole = 'Farmer';
        verdict = "Fair pay has to be paid by Farmer because spoilage occurred before transfer to Transporter.";
    } else if (validLogsCount === 1) {
        custodianRole = 'Transporter';
        verdict = "Fair pay has to be paid by Transporter because spoilage occurred during transport before delivery to Warehouse.";
    } else {
        custodianRole = 'Warehouse';
        verdict = "Fair pay has to be paid by Warehouse because spoilage occurred before transfer to Retailer.";
    }

    // Default formatting for timestamp
    const timestampStr = new Date(breachTime).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    return {
        status: "Breach Detected",
        hasBreach: true,
        reason: breachReading.breach_reason,
        timestamp: timestampStr,
        liableParty: custodianName,
        liableRole: custodianRole,
        stage: stageStr,
        protectedParty: isFarmerLiable ? 'None' : farmerName,
        amount,
        verdict
    };
}
