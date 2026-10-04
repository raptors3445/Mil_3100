/**
 * Mil_3100 - Advanced Player Physics & Biomechanical Limp Controller (Phase 1)
 * Highly detailed simulation of Protagonist "Mil" (Permanent Limp & Mechanical Brace Dynamics)
 */

class MilPlayerController {
    constructor() {
        this.playerName = "Mil";
        this.currentPhase = 1;
        this.currentLevel = 1;

        // Biomechanical Base Attributes
        this.baseMovementSpeed = 1.0; // Normal walking speed modifier
        this.limpSeverity = 0.45;     // Asymmetry factor (0.0 = normal, 1.0 = severe limp)
        this.aimStability = 0.60;     // Stability factor affecting weapon/tool steadying (0.0 to 1.0)
        
        // Dynamic Physical States
        this.stamina = 100.0;         // Max stamina pool
        this.painLevel = 0.0;          // Accumulated pain from running/strenuous exertion (0 to 100)
        this.braceDurability = 100.0;   // Mechanical leg brace condition percentage
        this.braceLubeLevel = 100.0;   // Lube level; if low, increases metal friction noise
        this.isBraced = false;         // Low profile / crouching posture
        this.isPostureSupported = false; // Leaning against cover/wall to reduce leg weight stress

        // Gait & Asymmetric Footstep Tracker
        this.stepCycle = 0; // 0 = Healthy Leg (Right), 1 = Injured Leg (Left)
    }

    /**
     * Calculates the exact biomechanical state per footstep based on surface and exertion.
     */
    processFootstep(surfaceType = "stone", isSprinting = false) {
        // Friction and surface noise table (1880s Environments)
        const surfaceNoiseMap = {
            stone: 1.0,
            woodFloor: 1.6,
            snow: 0.6,
            metalGrate: 2.2,
            mud: 0.8
        };

        const surfaceModifier = surfaceNoiseMap[surfaceType] || 1.0;
        const speedModifier = isSprinting ? 2.2 : (this.isBraced ? 0.5 : 1.0);
        
        // Toggle leg cycle
        this.stepCycle = (this.stepCycle + 1) % 2;

        let stepNoise = 0;
        let stepWeightImpact = 0;

        if (this.stepCycle === 0) {
            // Right Leg: Healthy step, balanced & predictable
            stepNoise = 8.0 * surfaceModifier * speedModifier;
            stepWeightImpact = 1.0;
        } else {
            // Left Leg: Injured step, heavier impact, potential brace creak
            const braceCreakNoise = (100.0 - this.braceLubeLevel) * 0.15;
            const limpAsymmetryNoise = (1.0 + this.limpSeverity * 1.8);

            stepNoise = (14.0 * surfaceModifier * speedModifier * limpAsymmetryNoise) + braceCreakNoise;
            stepWeightImpact = 1.8 + (this.painLevel * 0.02);

            // Sprinting or heavy movement wears out brace and increases pain
            if (isSprinting) {
                this.painLevel = Math.min(100.0, this.painLevel + 2.5);
                this.braceDurability = Math.max(0.0, this.braceDurability - 0.2);
                this.braceLubeLevel = Math.max(0.0, this.braceLubeLevel - 0.3);
            }
        }

        return {
            legUsed: this.stepCycle === 0 ? "RIGHT_HEALTHY" : "LEFT_INJURED",
            generatedDecibels: Math.round(stepNoise * 10) / 10,
            groundForceImpact: Math.round(stepWeightImpact * 10) / 10,
            currentPain: Math.round(this.painLevel)
        };
    }

    /**
     * Recalculates physical fatigue, aim wobble, and recovery rates during game tick.
     */
    updatePhysics(deltaTime, isMoving = false, isSprinting = false, restingAtCover = false) {
        // Pain decay when resting or supported
        if (restingAtCover) {
            this.isPostureSupported = true;
            this.painLevel = Math.max(0.0, this.painLevel - (5.0 * deltaTime));
            this.stamina = Math.min(100.0, this.stamina + (12.0 * deltaTime));
        } else {
            this.isPostureSupported = false;
        }

        // Stamina consumption under limp stress
        if (isMoving) {
            const staminaDrainBase = isSprinting ? 18.0 : 3.0;
            const limpStressMultiplier = 1.0 + (this.limpSeverity * 0.8) + (this.painLevel * 0.01);
            this.stamina = Math.max(0.0, this.stamina - (staminaDrainBase * limpStressMultiplier * deltaTime));
        } else if (!restingAtCover) {
            this.stamina = Math.min(100.0, this.stamina + (8.0 * deltaTime));
        }

        // Calculate Aim Stability (Tremor in hands from physical pain and exhaustion)
        const staminaFactor = this.stamina / 100.0;
        const painFactor = 1.0 - (this.painLevel / 150.0);
        const supportFactor = this.isPostureSupported ? 1.3 : 1.0;

        this.aimStability = Math.min(1.0, Math.max(0.1, (0.7 * staminaFactor * painFactor * supportFactor)));

        return {
            currentStamina: Math.round(this.stamina * 10) / 10,
            painLevel: Math.round(this.painLevel * 10) / 10,
            aimStabilityIndex: Math.round(this.aimStability * 100) / 100,
            braceCondition: Math.round(this.braceDurability * 10) / 10
        };
    }

    /**
     * Maintenance method to lubricate and adjust the mechanical brace.
     */
    maintainLegBrace(lubeAmount = 50.0) {
        this.braceLubeLevel = Math.min(100.0, this.braceLubeLevel + lubeAmount);
        return { success: true, newLubeLevel: this.braceLubeLevel };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MilPlayerController };
}
