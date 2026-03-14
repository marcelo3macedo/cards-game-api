const BattleStorage = require("#infrastructure/cache/BattleStorage");
const CardModel = require("#infrastructure/db/models/Card");
const SummonRules = require("#core/services/rules/SummonRules");
const { prepareCombatant } = require("#utils/battleUtils");
const { resolveRecipe } = require("../FusionRecipes");

class SummonFusion {
  /**
   * Fuses hand cards and places the result (or fallback) on the field.
   * @param {string|number} userId
   * @param {number[]} handIndices
   * @param {string} position - "attack" | "defense" | "face-down-attack" | "face-down-defense"
   * @param {number} selectedFieldIndex
   */
  async execute(userId, handIndices, position, selectedFieldIndex) {
    const state = BattleStorage.get(userId);
    if (!state) throw new Error("No active battle found for this user.");

    const { allowed, state: newState, logs, actions } = SummonRules.applySummonModifiers(state, "player");

    if (!allowed) {
      BattleStorage.save(userId, newState);
      return { success: true, state: newState, logs, actions, wasSuccess: false, resultCard: null };
    }

    const hand = newState.player.hand;
    const selectedCards = handIndices.map((i) => {
      const card = hand[i];
      if (!card) throw new Error(`No card at hand index ${i}.`);
      return card;
    });

    const cardIds = selectedCards.map((c) => c.id);
    const match = resolveRecipe(cardIds);

    let cardToSummon;

    if (match) {
      const fusionCard = await CardModel.findByPk(match.resultId, { raw: true });
      if (!fusionCard) throw new Error("Fusion result card not found in database.");

      cardToSummon = fusionCard;
    } else {
      // No fusion: summon the last card from the selection as fallback
      cardToSummon = hand[handIndices[handIndices.length - 1]];
    }

    // Remove all selected cards from hand (descending order to avoid index shifts)
    [...handIndices].sort((a, b) => b - a).forEach((i) => {
      hand.splice(i, 1);
    });

    const canAttack = newState.turn > 1;
    const fieldSlot = {
      card: cardToSummon,
      position,
      canAttack,
      isNew: true,
    };

    const preparedSlot = prepareCombatant(fieldSlot, newState.environment);
    newState.player.field[selectedFieldIndex ?? 0] = preparedSlot;
    newState.player.canSummon = false;

    BattleStorage.save(userId, newState);
    return {
      success: true,
      state: newState,
      logs: logs ?? [],
      actions: actions ?? [],
      wasSuccess: !!match,
      resultCard: cardToSummon,
    };
  }
}

module.exports = SummonFusion;
