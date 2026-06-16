class AdventureGame {
    constructor() {
        this.health = 100;
        this.maxHealth = 100;
        this.inventory = [];
        this.currentScene = 'start';
        this.gameState = {};
        this.init();
    }

    init() {
        this.showScene(this.currentScene);
    }

    updateUI() {
        // Update health bar
        const healthPercent = (this.health / this.maxHealth) * 100;
        document.getElementById('healthBar').style.width = healthPercent + '%';
        document.getElementById('healthText').textContent = `${this.health}/${this.maxHealth}`;

        // Update inventory
        const inventoryText = this.inventory.length > 0 
            ? this.inventory.join(', ')
            : 'Empty';
        document.getElementById('inventory').textContent = inventoryText;
    }

    showScene(sceneName) {
        const scene = this.scenes[sceneName];
        if (!scene) return;

        this.currentScene = sceneName;
        const storyElement = document.getElementById('story');
        const choicesElement = document.getElementById('choices');

        storyElement.textContent = scene.text;
        choicesElement.innerHTML = '';

        scene.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.onclick = () => this.makeChoice(choice);
            choicesElement.appendChild(button);
        });

        this.updateUI();
    }

    makeChoice(choice) {
        // Apply effects
        if (choice.health) {
            this.health = Math.max(0, Math.min(this.maxHealth, this.health + choice.health));
        }

        if (choice.item) {
            this.inventory.push(choice.item);
        }

        if (choice.removeItem) {
            const index = this.inventory.indexOf(choice.removeItem);
            if (index > -1) {
                this.inventory.splice(index, 1);
            }
        }

        // Check for game over conditions
        if (this.health <= 0) {
            this.showScene('gameover');
            return;
        }

        if (choice.condition) {
            if (!choice.condition(this)) {
                this.showScene(choice.failScene);
                return;
            }
        }

        this.showScene(choice.nextScene);
    }

    scenes = {
        start: {
            text: `🌅 You wake up in front of an ancient, crumbling temple. Vines cover the stone walls, and the entrance glows with an eerie purple light. Legend says the Temple of Eternal Wisdom holds a treasure beyond imagination. Your adventure begins now...

What do you do?`,
            choices: [
                {
                    text: '🚪 Walk straight through the main entrance',
                    nextScene: 'mainEntrance'
                },
                {
                    text: '🕵️ Search the area for a hidden entrance',
                    nextScene: 'hiddenPath',
                    item: 'Rusty Key'
                },
                {
                    text: '📚 Read the ancient inscriptions',
                    nextScene: 'inscriptions'
                }
            ]
        },

        mainEntrance: {
            text: `You push through the heavy stone doors. Inside, a dark corridor stretches before you. Your eyes slowly adjust to the dim light. Suddenly, you hear a low growl from the shadows...

A massive stone guardian emerges! Its eyes glow red with ancient magic.`,
            choices: [
                {
                    text: '⚔️ Fight the guardian',
                    nextScene: 'guardianBattle',
                    health: -30
                },
                {
                    text: '🏃 Run back and find another way',
                    nextScene: 'start'
                },
                {
                    text: '🧠 Try to communicate peacefully',
                    nextScene: 'guardianTalk'
                }
            ]
        },

        guardianBattle: {
            text: `💥 CLASH! Your attack echoes through the temple! The guardian staggers back, but it's still coming toward you! You're wounded but alive.

After an intense battle, you manage to land a critical hit and the guardian crumbles to dust. Beyond it lies an ornate door with three symbols...`,
            choices: [
                {
                    text: '🔴 Choose the red symbol (Fire)',
                    nextScene: 'fireRiddleRoom',
                    health: -10
                },
                {
                    text: '🔵 Choose the blue symbol (Water)',
                    nextScene: 'waterRiddleRoom',
                    health: -10
                },
                {
                    text: '💀 Choose the black symbol (Death)',
                    nextScene: 'deathRoom',
                    health: -10
                }
            ]
        },

        guardianTalk: {
            text: `You hold up your hands peacefully and speak to the guardian. Surprisingly, it pauses. You hear a voice in your mind—the spirit of the temple's ancient keeper.

"Few show wisdom," the voice says. "You may pass, but beware the trials ahead. Take this gift."

The guardian steps aside, and you find a glowing amulet.`,
            choices: [
                {
                    text: '🎁 Take the amulet and continue',
                    nextScene: 'treasureVault',
                    item: 'Ancient Amulet',
                    health: 20
                }
            ]
        },

        hiddenPath: {
            text: `You carefully explore the overgrown garden surrounding the temple. Behind a waterfall of vines, you discover a small tunnel entrance. It's tight, but passable.

You crawl through and emerge in a underground chamber filled with bioluminescent mushrooms. The air smells fresh and alive. A path splits in two directions...`,
            choices: [
                {
                    text: '👈 Go left (mysterious humming sound)',
                    nextScene: 'crystalCavern'
                },
                {
                    text: '👉 Go right (sound of water)',
                    nextScene: 'undergroundLake'
                },
                {
                    text: '🔓 Use the rusty key on a locked door',
                    nextScene: 'secretTreasure',
                    condition: (game) => game.inventory.includes('Rusty Key'),
                    removeItem: 'Rusty Key',
                    item: 'Golden Crown'
                }
            ]
        },

        inscriptions: {
            text: `You study the ancient carvings. They tell a story of a great civilization that sealed away something powerful in the depths of the temple. 

You decipher a warning: "Three trials test the worthy. Fire, Water, and Mind. Only those who prove their worth shall claim the treasure."

You also notice an inscription pointing to a path behind some loose stones.`,
            choices: [
                {
                    text: '🪨 Move the stones and explore',
                    nextScene: 'hiddenPath',
                    item: 'Torch'
                },
                {
                    text: '🚪 Enter through the main door, prepared',
                    nextScene: 'mainEntrance'
                }
            ]
        },

        fireRiddleRoom: {
            text: `🔥 You enter a chamber with walls of glowing magma. In the center floats a suspended bridge of flame.

A voice booms: "Answer my riddle to cross safely!"

"I am not alive, but I grow. I don't have lungs, but I need air. What am I?"`,
            choices: [
                {
                    text: '🔥 Fire',
                    nextScene: 'treasureVault',
                    health: 0
                },
                {
                    text: '💧 Water',
                    nextScene: 'treasureVault',
                    health: -20
                },
                {
                    text: '🪨 Stone',
                    nextScene: 'treasureVault'
                }
            ]
        },

        waterRiddleRoom: {
            text: `💧 You enter a chamber where water flows from the ceiling to the floor endlessly. A large stone door sits at the far end.

An ethereal voice speaks: "To proceed, answer: I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?"`,
            choices: [
                {
                    text: '🗺️ A map',
                    nextScene: 'treasureVault'
                },
                {
                    text: '🌍 The Earth',
                    nextScene: 'treasureVault',
                    health: -20
                },
                {
                    text: '🎮 A video game',
                    nextScene: 'treasureVault',
                    health: -30
                }
            ]
        },

        deathRoom: {
            text: `💀 You push open the black door and enter a dark chamber. Skeletons line the walls, and the air feels heavy with despair.

Suddenly, shadow creatures emerge from the darkness!`,
            choices: [
                {
                    text: '⚔️ Fight them',
                    nextScene: 'gameover',
                    health: -40
                },
                {
                    text: '🏃 Run away',
                    nextScene: 'mainEntrance',
                    health: -20
                },
                {
                    text: '✨ Use a special ability',
                    nextScene: 'gameover',
                    health: -50
                }
            ]
        },

        crystalCavern: {
            text: `✨ The humming grows louder as you walk toward it. You enter a cavern filled with massive crystals that glow with inner light. They hum with ancient power.

You feel the energy wash over you, and miraculously, your wounds begin to heal!`,
            choices: [
                {
                    text: '💎 Take a crystal as a trophy',
                    nextScene: 'treasureVault',
                    item: 'Crystal of Healing',
                    health: 50
                }
            ]
        },

        undergroundLake: {
            text: `🌊 You discover an underground lake with water so clear you can see to the bottom. In the center of the lake floats a shimmering island.

You spot a boat nearby! You row out to the island and find an ancient chest...`,
            choices: [
                {
                    text: '📦 Open the chest',
                    nextScene: 'treasureVault',
                    item: 'Jeweled Scepter'
                }
            ]
        },

        secretTreasure: {
            text: `🔓 The rusty key turns smoothly in the lock—it was made for this door! It opens to reveal a secret chamber filled with riches beyond imagination.

But wait... you hear the temple beginning to shake. The walls crack, and dust falls from the ceiling. You need to escape FAST!`,
            choices: [
                {
                    text: '🏃 Run for the exit with the treasure',
                    nextScene: 'escape'
                }
            ]
        },

        treasureVault: {
            text: `🏆 You've made it! Before you stands the legendary Treasure Vault!

Golden statues, piles of gems, and artifacts from ancient civilizations surround you. In the center sits the Crown Jewel of the Temple—a magnificent artifact that pulses with divine light.

This is it... the treasure of the Lost Temple!`,
            choices: [
                {
                    text: '👑 Take the Crown Jewel',
                    nextScene: 'victory'
                },
                {
                    text: '🚪 Leave and explore more',
                    nextScene: 'treasureVault'
                }
            ]
        },

        escape: {
            text: `💨 You sprint through the collapsing corridors as the temple crumbles around you! Rocks fall from above, but you dodge them with incredible agility.

Just as the main entrance collapses, you leap through the opening and tumble outside. Behind you, the Lost Temple vanishes into rubble.

But you made it... and you have the treasure!`,
            choices: [
                {
                    text: '🎉 Continue to victory',
                    nextScene: 'victory'
                }
            ]
        },

        victory: {
            text: `🏆✨ YOU WIN! ✨🏆

You've successfully completed your adventure through the Lost Temple! Your courage, wisdom, and quick thinking have made you a legend.

The treasure you've collected will make you wealthy beyond your wildest dreams. Tales of your quest will be told for generations to come.

Congratulations, brave adventurer!`,
            choices: [
                {
                    text: '🔄 Play Again',
                    nextScene: 'start'
                }
            ]
        },

        gameover: {
            text: `💀 GAME OVER 💀

You have fallen in the depths of the Lost Temple. Your adventure has come to an end...

But every hero gets a second chance! Would you like to try again?`,
            choices: [
                {
                    text: '🔄 Restart Adventure',
                    nextScene: 'start'
                }
            ]
        }
    };
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new AdventureGame();
});