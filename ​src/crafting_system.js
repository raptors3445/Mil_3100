/**
 * Mil_3100 - Crafting & Mechanical Trap System (Phase 1)
 * Handles mechanical components, brace upgrades, and tactical traps.
 */

class CraftingSystem {
    constructor() {
        // Inventory of mechanical parts collected in 19th century settings
        this.resources = {
            scrapMetal: 0,
            gearsAndSprings: 0,
            pneumaticValves: 0,
            gunpowder: 0,
            leatherStraps: 0
        };

        // Available Blueprints
        this.recipes = {
            legBraceUpgrade: {
                name: "Reinforced Mechanical Leg Support",
                cost: { scrapMetal: 15, gearsAndSprings: 10, leatherStraps: 5 },
                effect: { limpSeverityReduction: 0.15, staminaCostMultiplier: 0.8 }
            },
            pneumaticTripwire: {
                name: "Pneumatic Knockdown Trap",
                cost: { scrapMetal: 8, pneumaticValves: 2, gearsAndSprings: 4 },
                effect: { stunsEnemyDuration: 4.5, noiseGenerated: 12 }
            },
            silentLockpick: {
                name: "Precision Mechanical Lockpick",
                cost: { scrapMetal: 5, gearsAndSprings: 3 },
                effect: { bypassLevel: 2, durability: 3 }
            },
            smokeCanister: {
                name: "Black Powder Smoke Screen",
                cost: { gunpowder: 10, scrapMetal: 4 },
                effect: { visionBlockRadius: 6.0, duration: 8.0 }
            }
        };
    }

    addResource(type, amount) {
        if (this.resources.hasOwnProperty(type)) {
            this.resources[type] += amount;
            return true;
        }
        return false;
    }

    canCraft(recipeKey) {
        const recipe = this.recipes[recipeKey];
        if (!recipe) return false;

        for (const [res, count] of Object.entries(recipe.cost)) {
            if ((this.resources[res] || 0) < count) {
                return false;
            }
        }
        return true;
    }

    craftItem(recipeKey, playerInstance) {
        if (!this.canCraft(recipeKey)) {
            return { success: false, message: "Insufficient mechanical parts" };
        }

        const recipe = this.recipes[recipeKey];
        for (const [res, count] of Object.entries(recipe.cost)) {
            this.resources[res] -= count;
        }

        // Apply direct upgrades if crafting leg support
        if (recipeKey === 'legBraceUpgrade' && playerInstance) {
            playerInstance.limpSeverity = Math.max(0.10, playerInstance.limpSeverity - recipe.effect.limpSeverityReduction);
        }

        return {
            success: true,
            item: recipe.name,
            effects: recipe.effect
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CraftingSystem };
}
