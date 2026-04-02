// src/lib/sensorSimulator.js
export class SensorSimulator {
    constructor(batchId, onReading) {
        this.batchId = batchId;
        this.onReading = onReading;
        this.intervalId = null;
        this.mode = 'normal';
    }

    setMode(mode) {
        this.mode = mode;
    }

    start() {
        if (this.intervalId) return;
        this.intervalId = setInterval(() => {
            let temp, hum;
            if (this.mode === 'normal') {
                temp = 18 + Math.random() * 10; // 18 to 28
                hum = 65 + Math.random() * 20; // 65 to 85
            } else {
                temp = 35 + Math.random() * 10; // 35 to 45 (Spoilage)
                hum = 50 + Math.random() * 45; // 50 to 95
            }

            this.onReading(this.batchId, {
                batch_id: this.batchId,
                temperature: parseFloat(temp.toFixed(2)),
                humidity: parseFloat(hum.toFixed(2)),
                timestamp: new Date().toISOString()
            });
        }, 5000);
    }

    stop() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = null;
    }
}
