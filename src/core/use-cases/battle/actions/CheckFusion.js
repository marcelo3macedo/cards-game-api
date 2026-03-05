const BattleStorage = require("#infrastructure/cache/BattleStorage");
const CardModel = require("#infrastructure/db/models/Card");
const { resolveRecipe } = require("../FusionRecipes");

class CheckFusion {
  /**
   * Checks if the selected hand cards can be fused.
   * @param {string|number} userId
   * @param {number[]} handIndices - Indices of cards in player's hand
   * @returns {{ fusionCard: object|null }}
   */
  async execute(userId, handIndices) {
    const state = BattleStorage.get(userId);
    if (!state) throw new Error("No active battle found for this user.");

    const hand = state.player.hand;

    const selectedCards = handIndices.map((i) => {
      const card = hand[i];
      if (!card) throw new Error(`No card at hand index ${i}.`);
      return card;
    });

    const cardIds = selectedCards.map((c) => c.id);
    const match = resolveRecipe(cardIds);

    if (!match) {
      return { fusionCard: null };
    }

    const fusionCard = await CardModel.findByPk(match.resultId, { raw: true });

    if (!fusionCard) {
      return { fusionCard: null };
    }

    return { fusionCard };
  }
}

module.exports = CheckFusion;
