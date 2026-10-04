/**
 * Mil_3100 - Core Game Logic & Narrative Handler for Phase 1
 * Narrative Engine & Player Controller Structure
 */

class MilPlayerController {
    constructor() {
        this.playerName = "Milad";
        this.currentPhase = 1;
        this.currentLevel = 1;
        
        // Limp Mechanic Attributes
        this.movementSpeed = 1.0; // Normal baseline
        this.limpSeverity = 0.45; // 45% handicap on left leg
        this.aimStability = 0.60;  // Sway factor due to physical strain
        this.stamina = 100;
        this.isBraced = false;     // True when leaning or crouching
    }

    /**
     * Calculates aiming precision based on movement state and brace positioning.
     */
    calculateAimPrecision() {
        if (this.isBraced) {
            return 0.95; // High accuracy when stabilized
        }
        return this.aimStability * (this.stamina / 100);
    }

    /**
     * Simulates movement noise impact for stealth encounters.
     */
    getStepNoiseLevel() {
        // Asymmetric step sound profile due to the mechanical brace/limp
        return {
            rightStepNoise: 15, // Normal step (decibels)
            leftStepNoise: 42   // Limping step with mechanical support
        };
    }
}

class Phase1QuestManager {
    constructor() {
        this.phaseTitle = "Ashes of Vrin & The Shadows of Paris";
        this.totalLevels = 100;
        this.completedLevels = [];
    }

    /**
     * Initializes mission objective based on current level sequence.
     */
    getMissionDetails(levelNumber) {
        if (levelNumber < 1 || levelNumber > 100) {
            throw new Error("Invalid Level for Phase 1");
        }

        if (levelNumber <= 10) {
            return { section: "Childhood Trauma in Vrin", type: "Survival & Escape" };
        } else if (levelNumber <= 40) {
            return { section: "Military Service in France", type: "Tactical & Engineering" };
        } else if (levelNumber <= 70) {
            return { section: "Journey for Truth", type: "Investigation & Infiltration" };
        } else if (levelNumber <= 90) {
            return { section: "The Underground Empire", type: "Crafting & Network Building" };
        } else {
            return { section: "The Grand Betrayal", type: "Stealth & Evasion" };
        }
    }
}

// Module Exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MilPlayerController, Phase1QuestManager };
}

