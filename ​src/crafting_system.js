/**
 * Mil_3100 - Precision Engineering & Crafting Framework (Phase 1)
 * Simulates mechanical tolerances, spring dynamics, pneumatic pressure, and ambient thermal effects.
 */

class PrecisionCraftingSystem {
    constructor() {
        this.inventory = {
            brassGears: 12,
            temperedSprings: 8,
            pneumaticValves: 5,
            highTensileWire: 15,
            industrialLubricant: 3
        };

        this.blueprints = {
            customBraceStabilizer: {
                title: "Custom Dual-Spring Ankle Stabilizer",
                components: { brassGears: 4, temperedSprings: 4, industrialLubricant: 1 },
                specs: { tensionForceKg: 45.0, noiseReductionFactor: 0.35, durabilityCostPerStep: 0.05 }
            },
            pneumaticTripTrap: {
                title: "High-Pressure Pneumatic Tripwire Trap",
                components: { pneumaticValves: 2, highTensileWire: 3, brassGears: 2 },
                specs: { triggerTensionKg: 12.0, mechanicalDelayMs: 150, stunDurationSec: 5.0 }
            }
        };
    }

    /**
     * Calculates pneumatic trap responsiveness based on ambient environmental temperature.
     */
    calculateTrapPerformance(blueprintKey, ambientTempCelsius = 15) {
        const blueprint = this.blueprints[blueprintKey];
        if (!blueprint) return null;

        // Viscosity impact on pneumatic fluid under cold temperatures (e.g. Vrin snow levels)
        let delayMultiplier = 1.0;
        if (ambientTempCelsius < 0) {
            delayMultiplier = 1.0 + (Math.abs(ambientTempCelsius) * 0.04); // Pressure drop / oil thickening
        }

        const effectiveDelay = blueprint.specs.mechanicalDelayMs * delayMultiplier;
        return {
            blueprintName: blueprint.title,
            effectiveResponseDelayMs: Math.round(effectiveDelay),
            operationalStatus: ambientTempCelsius < -15 ? "CRITICAL_PRESSURE_DROP" : "OPTIMAL"
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PrecisionCraftingSystem };
}
