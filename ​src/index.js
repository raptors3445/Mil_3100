/**
 * Mil_3100 - Core Game Engine Assembly (AAA Mechanics Prototype)
 * Integrates Biomechanics, Emergent AI, Acoustic Terrain Physics, and Crafting Systems.
 */

const { AdvancedGuardAI } = require('./stealth_ai');
const { PrecisionCraftingSystem } = require('./crafting_system');
const { BiomechanicalStatus } = require('./neuro_biomechanics');
const { EmergentGuardBrain } = require('./emergent_ai_brain');
const { TerrainInteractionEngine } = require('./material_surface_physics');

class Mil3100Engine {
    constructor() {
        console.log("====================================================");
        console.log("   INITIALIZING MIL_3100 ULTRA-DETAILED AAA ENGINE  ");
        console.log("====================================================");

        this.playerPlayerBiomechanics = new BiomechanicalStatus();
        this.craftingSystem = new PrecisionCraftingSystem();
        
        // Spawn Emergent Guard Entity
        this.guardPerception = new AdvancedGuardAI("GUARD_01", "VETERAN_OFFICER");
        this.guardBrain = new EmergentGuardBrain("Hans", "CAUTIOUS");

        // Environment State
        this.environment = {
            temperatureCelsius: -2.0, // Cold Alpine Night
            isRaining: true,
            currentSurface: "WET_COBBLESTONE"
        };
    }

    /**
     * Main Simulation Loop Frame Tick
     */
    simulateStepFrame(deltaTime, playerAction) {
        console.log(`\n--- FRAME TICK [Action: ${playerAction}] ---`);

        // 1. Update Player Biomechanics & Body State
        const bioState = this.playerPlayerBiomechanics.updateBiomechanics(
            deltaTime, 
            playerAction, 
            this.environment.temperatureCelsius, 
            this.environment.isRaining
        );
        console.log(`[Mil Biomechanics]: Heart Rate: ${bioState.heartRate} BPM | Pain Index: ${bioState.painSeverityIndex}/100 | Brace Stiffness: ${bioState.jointStiffnessPercent}%`);

        // 2. Terrain Physics Impact Calculation
        const stepPhysics = TerrainInteractionEngine.calculateFootstepImpact(
            this.environment.currentSurface,
            14.5, // Brace + Gear weight (kg)
            playerAction === "LIMPAGE_SPRINT" ? 3.5 : 1.1
        );
        console.log(`[Terrain Surface]: ${stepPhysics.surfaceType} | Sound Output: ${stepPhysics.decibelOutput} dB | Slip Hazard Warning: ${stepPhysics.hazardSlipTriggered}`);

        // 3. Process Sound Propagation to Guard Perception
        this.guardPerception.processAcousticInput(
            { generatedDecibels: stepPhysics.decibelOutput, legUsed: "LEFT_INJURED" },
            8.5, // Distance to guard in meters
            1.1  // Acoustic echoing factor
        );

        // 4. Guard Brain Cognitive Reaction
        const aiDecision = this.guardBrain.evaluateBehaviorState(
            this.environment,
            "NIGHT",
            this.guardPerception.suspicionIndex
        );

        console.log(`[Guard State - ${this.guardBrain.guardName}]: Alert: ${this.guardPerception.alertState} (${Math.round(this.guardPerception.suspicionIndex)}%) | Action: ${aiDecision.action}`);
    }
}

// Execute Simulation Prototype Run
const gameEngine = new Mil3100Engine();
gameEngine.simulateStepFrame(0.5, "STEALTH_CROUCH");
gameEngine.simulateStepFrame(0.5, "LIMPAGE_SPRINT");
