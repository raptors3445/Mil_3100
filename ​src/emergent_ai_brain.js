/**
 * Mil_3100 - AAA Emergent AI Personality & Biological Needs Engine
 * Simulates guard routines, stress levels, fatigue, weather reactions, and ambient dialogue state.
 */

class EmergentGuardBrain {
    constructor(guardName, personalityProfile = "CAUTIOUS") {
        this.guardName = guardName;
        this.personalityProfile = personalityProfile; // BOLD, CAUTIOUS, LAZY, PARANOID

        // Internal Needs & States
        this.stamina = 100.0;
        this.fatigueLevel = 0.0;     // 0.0 to 100.0
        this.morale = 80.0;           // High morale = aggressive, Low morale = retreats/calls backup
        this.currentActivity = "PATROLLING"; // PATROLLING, WARMING_HANDS, SMOKING, CHECKING_NOISE
        
        // Emotional State
        this.fearIndex = 0.0;
        this.timeSinceLastCoffee = 120; // Minutes
    }

    /**
     * Processes AI internal decision tree every tick based on environment.
     */
    evaluateBehaviorState(weather, timeOfDay, sensoryAlertLevel) {
        // Cold or Rain reduces morale and makes LAZY guards seek cover
        if (weather.isRaining || weather.temperatureCelsius < 0) {
            this.morale -= 0.05;
            this.fatigueLevel += 0.08;

            if (this.personalityProfile === "LAZY" && sensoryAlertLevel < 20) {
                this.currentActivity = "WARMING_HANDS";
                return { action: "SEEK_SHELTER_OR_FIRE", movementSpeedModifier: 0.5 };
            }
        }

        // Reactions to high fear / stealth encounters
        if (sensoryAlertLevel > 70.0) {
            this.fearIndex += 15.0;
            
            if (this.fearIndex > 60.0 && this.morale < 40.0) {
                this.currentActivity = "RETREAT_FOR_BACKUP";
                return { action: "CALL_REINFORCEMENTS", movementSpeedModifier: 1.3 };
            } else {
                this.currentActivity = "DRAW_WEAPON_AND_SEARCH";
                return { action: "INVESTIGATE_THREAT", movementSpeedModifier: 0.8 };
            }
        }

        return { action: "CONTINUE_ROUTINE", movementSpeedModifier: 1.0 };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmergentGuardBrain };
}
