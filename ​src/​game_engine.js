/**
 * Mil_3100 - Main Game Engine Integration (Phase 1)
 * Bridges core player mechanics, crafting, 100-level database, and enemy AI.
 */

const { MilPlayerController } = require('./phase1_core');
const { CraftingSystem } = require('./crafting_system');
const { Phase1LevelDatabase } = require('./phase1_levels');
const { EnemyGuardAI } = require('./stealth_ai');

class MilGameEngine {
    constructor() {
        this.player = new MilPlayerController();
        this.crafting = new CraftingSystem();
        this.levelDatabase = new Phase1LevelDatabase();
        this.currentLevelIndex = 1;
        this.activeGuards = [];
        this.isGameRunning = false;
    }

    /**
     * Initializes a specific level and spawns appropriate enemy AI units.
     */
    loadLevel(levelNumber) {
        const levelData = this.levelDatabase.getLevel(levelNumber);
        if (!levelData) {
            console.error(`Level ${levelNumber} does not exist in Phase 1 database.`);
            return false;
        }

        this.currentLevelIndex = levelNumber;
        this.player.currentLevel = levelNumber;
        
        // Spawn guards based on level difficulty
        this.activeGuards = [];
        const guardCount = Math.min(12, levelData.difficultyRating * 2);
        for (let i = 1; i <= guardCount; i++) {
            this.activeGuards.push(new EnemyGuardAI(i, 100));
        }

        console.log(`[Engine] Loaded ${levelData.title} in ${levelData.location}`);
        return levelData;
    }

    /**
     * Executes a single tick/frame update of the game loop.
     */
    updateTick(deltaTime, moveIntensity = 1.0) {
        if (!this.isGameRunning) return;

        // Update player status & calculate movement noise from limp
        const movementData = this.player.updateLimpPhysics(deltaTime, moveIntensity);

        // Update AI state against player noise
        this.activeGuards.forEach(guard => {
            const simulatedDistance = 10.0; // Distance simulation in meters
            guard.listenForNoise(movementData.stepNoise, simulatedDistance);
            guard.checkLineOfSight(simulatedDistance, this.player.isBraced, true);
        });

        return {
            playerStamina: this.player.stamina,
            playerLimpSeverity: this.player.limpSeverity,
            activeGuardAlerts: this.activeGuards.map(g => ({ id: g.guardId, state: g.state, alert: g.alertLevel }))
        };
    }

    startGame() {
        this.isGameRunning = true;
        this.loadLevel(this.currentLevelIndex);
        console.log("[Engine] Mil_3100 Engine Started.");
    }
}

// Auto-run verification snippet if executed directly via Node.js
if (require.main === module) {
    const engine = new MilGameEngine();
    engine.startGame();
    const frameState = engine.updateTick(0.1, 1.2);
    console.log("[Engine Verification Output]:", JSON.stringify(frameState, null, 2));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MilGameEngine };
}
