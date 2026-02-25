const fs = require('fs');
const path = require('path');

class EffectRegistry {
    constructor() {
        this.effects = new Map();
        this.loadPlugins();
    }

    loadPlugins() {
        const folders = ['magic', 'trap', 'equip', 'field'];
        folders.forEach(folder => {
            const dir = path.join(__dirname, '../../plugins', folder);
            if (!fs.existsSync(dir)) return;

            fs.readdirSync(dir).forEach(file => {
                const effect = require(path.join(dir, file));
                this.effects.set(effect.id, effect);
            });
        });
    }

    getEffect(cardId) {
        return this.effects.get(cardId);
    }
}

module.exports = new EffectRegistry();
