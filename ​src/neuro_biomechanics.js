/**
 * Mil_3100 - Advanced Biomechanical & Trauma Simulation Subsystem
 * Inspired by AAA-grade emergent survival mechanics (RDR2 style depth).
 * Simulates muscle fatigue, joint friction, pain response, and environmental exposure.
 */

class BiomechanicalStatus {
    constructor() {
        // Physical Anatomy & Prosthetic Tracking
        this.jointFrictionCoefficient = 0.12; // Metal brace friction
        this.kneeJointTemperature = 36.6;     // Celsius
        this.muscleFatigueLeftLeg = 0.0;      // 0.0 to 100.0
        this.heartRateBpm = 72;               // Dynamic heart rate based on stress/pain
        this.bloodAdrenalineLevel = 0.05;     // 0.0 to 1.0

        // Clothing & Moisture Accumulation
        this.fabricMoistureRetained = 0.0;    // Percentage of water absorbed by attire
        this.bodyCoreTemperature = 37.0;      // Core temp affecting stamina recovery
    }

    /**
     * Ticks every game-frame to update physical state based on world parameters.
     */
    updateBiomechanics(deltaTime, movementState, ambientTemp, isRaining) {
        // 1. Water Absorption & Weight Penalty
        if (isRaining && this.fabricMoistureRetained < 100.0) {
            this.fabricMoistureRetained += deltaTime * 1.5;
        } else if (!isRaining && this.fabricMoistureRetained > 0.0) {
            this.fabricMoistureRetained = Math.max(0, this.fabricMoistureRetained - (deltaTime * 0.5));
        }

        // 2. Cold Temperature & Metal Joint Stiffening
        if (ambientTemp < 5.0) {
            // Cold contracts metal and stiffens mechanical braces
            this.jointFrictionCoefficient = Math.min(0.85, this.jointFrictionCoefficient + (deltaTime * 0.01));
            this.kneeJointTemperature = Math.max(ambientTemp, this.kneeJointTemperature - (deltaTime * 0.2));
        } else {
            // Movement warms up the joint grease
            if (movementState !== "IDLE") {
                this.jointFrictionCoefficient = Math.max(0.12, this.jointFrictionCoefficient - (deltaTime * 0.05));
                this.kneeJointTemperature = Math.min(39.0, this.kneeJointTemperature + (deltaTime * 0.1));
            }
        }

        // 3. Heart Rate Dynamics (Stress, Sprinting, Pain)
        let targetHeartRate = 70;
        if (movementState === "LIMPAGE_SPRINT") targetHeartRate = 155;
        if (movementState === "STEALTH_CROUCH") targetHeartRate = 95;

        // Heart rate smoothly interpolates towards target
        this.heartRateBpm += (targetHeartRate - this.heartRateBpm) * deltaTime * 0.8;

        // 4. Calculate Limp Strain & Pain Index
        const painIndex = (this.jointFrictionCoefficient * 40.0) + (this.muscleFatigueLeftLeg * 0.6);
        return {
            heartRate: Math.round(this.heartRateBpm),
            jointStiffnessPercent: Math.round(this.jointFrictionCoefficient * 100),
            painSeverityIndex: Math.min(100, Math.round(painIndex)),
            wetnessPenaltyMultiplier: 1.0 + (this.fabricMoistureRetained * 0.003)
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BiomechanicalStatus };
}
