/**
 * Mil_3100 - Material Dynamics & Surface Acoustic Interaction Matrix
 * Simulates friction, noise resonance, and limp stance stability across granular terrain.
 */

const SURFACE_TYPES = {
    DRY_WOODEN_PLANK: { acousticResonance: 1.8, frictionCoeff: 0.75, limpSlipRisk: 0.05 },
    MUDDY_GRAVEL:     { acousticResonance: 0.6, frictionCoeff: 0.40, limpSlipRisk: 0.45 },
    CRUNCHY_SNOW:     { acousticResonance: 2.2, frictionCoeff: 0.55, limpSlipRisk: 0.30 },
    WET_COBBLESTONE:  { acousticResonance: 1.2, frictionCoeff: 0.35, limpSlipRisk: 0.60 },
    FINE_CARPET:      { acousticResonance: 0.1, frictionCoeff: 0.90, limpSlipRisk: 0.00 }
};

class TerrainInteractionEngine {
    static calculateFootstepImpact(surfaceKey, braceWeightKg, movementSpeed) {
        const surface = SURFACE_TYPES[surfaceKey] || SURFACE_TYPES.DRY_WOODEN_PLANK;

        // Kinetic Energy Impact calculation: E = 0.5 * m * v^2
        const impactEnergy = 0.5 * braceWeightKg * Math.pow(movementSpeed, 2);
        const generatedDecibels = impactEnergy * surface.acousticResonance * 10;
        
        // Slippage risk increases if player sprints on wet/muddy surfaces with an orthopedic brace
        const actualSlipChance = surface.limpSlipRisk * (movementSpeed > 2.0 ? 2.5 : 1.0);

        return {
            decibelOutput: Math.round(generatedDecibels * 10) / 10,
            frictionRating: surface.frictionCoeff,
            hazardSlipTriggered: Math.random() < actualSlipChance,
            surfaceType: surfaceKey
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TerrainInteractionEngine, SURFACE_TYPES };
}
