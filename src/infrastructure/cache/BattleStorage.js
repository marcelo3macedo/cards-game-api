// Singleton para manter as batalhas ativas na memória do Node
const activeBattles = new Map();

module.exports = {
	save: (userId, state) => activeBattles.set(userId.toString(), state),
	get: (userId) => activeBattles.get(userId.toString()),
	delete: (userId) => activeBattles.delete(userId.toString()),
};
