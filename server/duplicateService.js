/**
 * Smart Duplicate Detection Service
 * Evaluates semantic and lexical overlap + location / ward proximity
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
    return { isDuplicate: false, matchedTicketId: null, similarityScore: 0, reason: null };
  }

  const newTokens = getTokens(newText);
  let bestMatch = null;
  let maxScore = 0;
  let matchReason = '';

  for (const ticket of existingTickets) {
    // Only check unresolved or recently active tickets
    if (ticket.status === 'Resolved') continue;

    const existingText = ticket.complaint?.originalText || ticket.summary || '';
    const existingWard = ticket.complaint?.ward || '';
    const existingTokens = getTokens(existingText);

    const textSim = jaccardSimilarity(newTokens, existingTokens);
    const sameWard = newWard && existingWard && (newWard.trim().toLowerCase() === existingWard.trim().toLowerCase());
    
    // Check category match
    const sameCategory = ticket.category;

    let score = textSim;
    if (sameWard) score += 0.35; // Significant bonus for same municipal ward

    // Check location keyword overlap
    const newLocTokens = getTokens(newLocation);
    const existLocTokens = getTokens(ticket.complaint?.location || '');
    const locSim = jaccardSimilarity(newLocTokens, existLocTokens);
    if (locSim > 0.3) score += 0.25;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = ticket;
      if (sameWard && textSim > 0.3) {
        matchReason = `High text similarity (${Math.round(textSim * 100)}%) and identical ward (${existingWard})`;
      } else if (locSim > 0.4) {
        matchReason = `Matching incident location and similar incident description`;
      } else {
        matchReason = `Strong linguistic similarity with existing open ticket ${ticket.id}`;
      }
    }
  }

  // Threshold for duplicate detection
  const isDuplicate = maxScore >= 0.55 && bestMatch !== null;

  return {
    isDuplicate,
    matchedTicketId: isDuplicate ? bestMatch.id : null,
    similarityScore: Number(Math.min(0.99, maxScore).toFixed(2)),
    reason: isDuplicate ? matchReason : null,
    matchedTicketSummary: isDuplicate ? bestMatch.summary : null
  };
}
