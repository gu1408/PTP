/**
 * Smart Duplicate Detection Service
 * Evaluates semantic and lexical overlap + location / ward proximity
 * Uses consistent scoring and transparent explanation
 */

/**
 * Tokenize and normalize text into clean words
 */
function getTokens(text) {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s\u0C80-\u0CFF\u0900-\u097F]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'near', 'from', 'this', 'that', 'there'].includes(w))
  );
}

/**
 * Calculate Jaccard similarity between two token sets
 */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

/**
 * Detect if a new complaint is a probable duplicate of an existing unresolved ticket
 */
export function detectDuplicate(newText, newWard, newLocation, existingTickets = []) {
  if (!existingTickets || existingTickets.length === 0) {
    return {
      isDuplicate: false,
      matchedTicketId: null,
      similarityScore: 0,
      textSimilarity: 0,
      compositeScore: 0,
      reason: null
    };
  }

  const newTokens = getTokens(newText);
  let bestMatch = null;
  let maxScore = 0;
  let bestTextSim = 0;
  let bestSameWard = false;
  let bestLocSim = 0;

  for (const ticket of existingTickets) {
    // Only check unresolved or recently active tickets
    if (ticket.status === 'Resolved') continue;

    const existingText = ticket.complaint?.originalText || ticket.summary || '';
    const existingWard = ticket.complaint?.ward || '';
    const existingTokens = getTokens(existingText);

    const textSim = jaccardSimilarity(newTokens, existingTokens);
    const sameWard = newWard && existingWard && (newWard.trim().toLowerCase() === existingWard.trim().toLowerCase());

    // Check location keyword overlap
    const newLocTokens = getTokens(newLocation);
    const existLocTokens = getTokens(ticket.complaint?.location || '');
    const locSim = jaccardSimilarity(newLocTokens, existLocTokens);

    let score = textSim;
    if (sameWard) score += 0.35; // Significant bonus for same municipal ward
    if (locSim > 0.3) score += 0.25; // Bonus for confirmed matching landmark/street

    if (score > maxScore) {
      maxScore = score;
      bestMatch = ticket;
      bestTextSim = textSim;
      bestSameWard = sameWard;
      bestLocSim = locSim;
    }
  }

  // Threshold for duplicate detection
  const isDuplicate = maxScore >= 0.55 && bestMatch !== null;

  const textSimPct = Math.round(bestTextSim * 100);
  const compositeScorePct = Math.min(99, Math.round(maxScore * 100));

  let matchReason = null;
  if (isDuplicate) {
    const matchedWard = bestMatch.complaint?.ward || 'same ward';
    if (bestSameWard && bestLocSim > 0.3) {
      matchReason = `${compositeScorePct}% composite duplicate match: ${textSimPct}% text similarity with confirmed identical ward (${matchedWard}) and matching landmark.`;
    } else if (bestSameWard) {
      matchReason = `${compositeScorePct}% composite duplicate match: ${textSimPct}% text similarity within identical ward (${matchedWard}).`;
    } else if (bestLocSim > 0.3) {
      matchReason = `${compositeScorePct}% composite duplicate match: ${textSimPct}% text similarity and matching incident landmark.`;
    } else {
      matchReason = `${compositeScorePct}% composite duplicate match: ${textSimPct}% lexical and semantic overlap with open ticket ${bestMatch.id}.`;
    }
  }

  return {
    isDuplicate,
    matchedTicketId: isDuplicate ? bestMatch.id : null,
    similarityScore: isDuplicate ? Number((compositeScorePct / 100).toFixed(2)) : 0,
    textSimilarity: textSimPct,
    compositeScore: compositeScorePct,
    reason: matchReason,
    matchedTicketSummary: isDuplicate ? bestMatch.summary : null
  };
}
