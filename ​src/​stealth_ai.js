/**
 * Mil_3100 - Advanced Cognitive Enemy AI & Acoustic Perception System
 * Simulates guard sensory optics, spatial sound decay, and limp-rhythm pattern detection.
 */

class AdvancedGuardAI {
    constructor(guardId, rank = "PATROL_GUARD") {
        this.guardId = guardId;
        this.rank = rank; // PATROL_GUARD, VETERAN_OFFICER, ELITE_WATCHMAN
        
        // Sensory Baseline Attributes
        this.fieldOfViewAngle = rank === "ELITE_WATCHMAN" ? 75 : 60;
        this.maxVisionRange = 18.0; // meters
        this.hearingThreshold = rank === "VETERAN_OFFICER" ? 0.7 : 1.0; // lower is more sensitive
        
        // Psychological & Alert State Tracker
        this.suspicionIndex = 0.0;    // 0.0 to 100.0
        this.alertState = "UNAWARE";  // UNAWARE, INVESTIGATING, HUNTING, ALARMED
        this.lastKnownSoundLocation = null;
        this.limpPatternRecognitionCounter = 0; // Tracks unique asymmetric footstep rhythm
    }

    /**
     * Evaluates acoustic input with spatial attenuation and limp rhythm recognition.
     */
    processAcousticInput(footstepData, distanceToSource, environmentAcoustics = 1.0) {
        if (distanceToSource <= 0) return;

        // Inverse-square law attenuation for sound decibels
        const attenuatedDecibels = (footstepData.generatedDecibels * environmentAcoustics) / Math.pow(distanceToSource / 3.0, 1.5);

        if (attenuatedDecibels > (12.0 * this.hearingThreshold)) {
            // Guard registers sound; analyze step asymmetry
            if (footstepData.legUsed === "LEFT_INJURED") {
                this.limpPatternRecognitionCounter += 1;
            }

            // Asymmetric rhythm pattern detected (Limp Signature)
            const isLimpPatternIdentified = this.limpPatternRecognitionCounter >= 3;
            const suspicionGain = isLimpPatternIdentified ? attenuatedDecibels * 1.8 : attenuatedDecibels * 1.0;

            this.suspicionIndex = Math.min(100.0, this.suspicionIndex + suspicionGain);
            this.updateGuardState(isLimpPatternIdentified);
        }
    }

    /**
     * Calculates optical visibility based on metal brace reflections and shadow coverage.
     */
    evaluateVisualDetection(distance, isCrouched, isMetalBraceExposed, ambientLightLevel) {
        if (distance > this.maxVisionRange) return false;

        let postureFactor = isCrouched ? 0.45 : 1.0;
        let metallicGlintFactor = isMetalBraceExposed ? 1.4 : 1.0;
        
        const visibilityScore = (this.maxVisionRange - distance) * ambientLightLevel * postureFactor * metallicGlintFactor;

        if (visibilityScore > 5.0) {
            this.suspicionIndex = Math.min(100.0, this.suspicionIndex + (visibilityScore * 2.5));
            this.updateGuardState();
            return true;
        }
        return false;
    }

    /**
     * State machine updating behavioral routines based on aggregate suspicion.
     */
    updateGuardState(limpIdentified = false) {
        if (this.suspicionIndex >= 85.0) {
            this.alertState = "ALARMED";
        } else if (this.suspicionIndex >= 50.0 || limpIdentified) {
            this.alertState = "HUNTING";
        } else if (this.suspicionIndex >= 20.0) {
            this.alertState = "INVESTIGATING";
        } else {
            this.alertState = "UNAWARE";
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedGuardAI };
}
