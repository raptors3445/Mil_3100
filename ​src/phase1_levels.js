/**
 * Mil_3100 - Phase 1 Complete 100-Level Database
 * Narrative & Level Design Architecture for Protagonist "Mil"
 */

class Phase1LevelDatabase {
    constructor() {
        this.protagonist = "Mil";
        this.levels = this.generate100Levels();
    }

    generate100Levels() {
        const levelList = [];

        for (let i = 1; i <= 100; i++) {
            let section = "";
            let location = "";
            let type = "";
            let description = "";

            if (i <= 10) {
                section = "Section 1: Childhood Trauma in Vrin (1880s)";
                location = "Vrin, Switzerland";
                type = "Survival & Stealth";
                description = `Mil copes with the traumatic origin event in Vrin and adapts to physical impairment (Level ${i}).`;
            } else if (i <= 40) {
                section = "Section 2: Awakening & Military Service";
                location = "French Border & Fortress Outposts";
                type = "Tactical Engineering & Defense";
                description = `Mil utilizes mechanical traps and custom stabilization gear during military service (Level ${i}).`;
            } else if (i <= 70) {
                section = "Section 3: The Journey for Truth";
                location = "Alpine Passes & Investigation Hubs";
                type = "Investigation & Infiltration";
                description = `Mil uncovers intercepted intelligence regarding the origin fire in Vrin (Level ${i}).`;
            } else if (i <= 90) {
                section = "Section 4: The Underground Empire & Clara";
                location = "Parisian Catacombs & Underground Workshops";
                type = "Crafting & Syndicate Operations";
                description = `Mil partners with Clara to construct covert networks beneath Paris (Level ${i}).`;
            } else {
                section = "Section 5: The Grand Betrayal & Falling";
                location = "Docks of Marseille & Escape Routes";
                type = "High-Stakes Evasion & Escape";
                description = `Following Clara's betrayal, Mil fights through injuries to escape to North Africa (Level ${i}).`;
            }

            levelList.push({
                levelNumber: i,
                section: section,
                title: `Level ${i}: ${this.getCustomLevelTitle(i)}`,
                location: location,
                missionType: type,
                description: description,
                difficultyRating: Math.min(10, Math.ceil(i / 10))
            });
        }
        return levelList;
    }

    getCustomLevelTitle(levelNumber) {
        const keyTitles = {
            1: "The Flame in Vrin",
            10: "Escaping the Ashes",
            11: "The Conscription Mandate",
            40: "The Trench Mechanism",
            41: "Intercepted Dispatch",
            70: "Confronting the Past",
            71: "Shadows Beneath Montmartre",
            90: "The Clockwork Syndicate",
            91: "Clara's Gambit",
            100: "Exile Across the Mediterranean"
        };
        return keyTitles[levelNumber] || `Operation Sequence #${levelNumber}`;
    }

    getLevel(levelNumber) {
        return this.levels.find(l => l.levelNumber === levelNumber);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Phase1LevelDatabase };
}
