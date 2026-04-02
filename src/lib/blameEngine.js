// src/lib/blameEngine.js
import { thresholds } from '../data/thresholds';

export function evaluateReading(reading, cropType = 'tomato') {
    const limits = thresholds[cropType] || thresholds['tomato'];
    let isBreach = false;
    let breachReason = [];

    if (reading.temperature > limits.maxTemp) {
        isBreach = true;
        breachReason.push(`High Temp: ${reading.temperature}°C`);
    } else if (reading.temperature < limits.minTemp) {
        isBreach = true;
        breachReason.push(`Low Temp: ${reading.temperature}°C`);
    }

    if (reading.humidity > limits.maxHum) {
        isBreach = true;
        breachReason.push(`High Humidity: ${reading.humidity}%`);
    } else if (reading.humidity < limits.minHum) {
        isBreach = true;
        breachReason.push(`Low Humidity: ${reading.humidity}%`);
    }

    return {
        isBreach,
        breachReason: breachReason.join(', ')
    };
}
