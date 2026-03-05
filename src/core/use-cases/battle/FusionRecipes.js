/**
 * Fusion recipe table.
 * Key: sorted material card IDs joined by "-"
 * Value: result card ID
 *
 * Example: cards 1 + 2 → card 3
 * Add entries here as new fusion combos are designed.
 */
const RECIPES = {
  // "1-2": 3,
};

/**
 * Returns the result card ID for a given pair of card IDs, or null if no recipe exists.
 * @param {number|string} id1
 * @param {number|string} id2
 * @returns {number|null}
 */
function getFusionResultId(id1, id2) {
  const key = [Number(id1), Number(id2)].sort((a, b) => a - b).join("-");
  return RECIPES[key] ?? null;
}

/**
 * Returns the result card ID for any number of card IDs (all pairs checked).
 * For multi-card fusion, tries each combination until one matches.
 * @param {Array<number|string>} ids
 * @returns {{ resultId: number, usedIndices: number[] } | null}
 */
function resolveRecipe(ids) {
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const resultId = getFusionResultId(ids[i], ids[j]);
      if (resultId) {
        return { resultId, usedIndices: [i, j] };
      }
    }
  }
  return null;
}

module.exports = { getFusionResultId, resolveRecipe, RECIPES };
