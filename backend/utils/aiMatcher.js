// aiMatcher.js
// A lightweight NLP-based AI engine that scores how well a candidate's
// skills match a job description using TF-IDF vectorization + Cosine Similarity.
// This is a classic Information Retrieval / Vector Space Model technique
// used in real-world recommendation and search-ranking systems.

const STOPWORDS = new Set([
  "a","an","the","and","or","but","is","are","was","were","be","been",
  "to","of","in","on","at","for","with","as","by","this","that","it",
  "from","will","we","you","your","i","he","she","they","them","their",
  "have","has","had","do","does","did","not","no","yes","if","then",
  "so","such","can","could","should","would","may","might","must",
  "about","into","than","too","very","just","also","our","us","job",
]);

// Split text into clean, lowercase word tokens.
function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, " ") // keep letters/numbers/+/#/. (for skills like "c++", "node.js")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word));
}

// Term Frequency for a single document (array of tokens)
function computeTF(tokens) {
  const tf = {};
  tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
  const total = tokens.length || 1;
  Object.keys(tf).forEach((t) => (tf[t] = tf[t] / total));
  return tf;
}

// Inverse Document Frequency across the whole corpus (array of token arrays)
function computeIDF(corpusTokens) {
  const idf = {};
  const N = corpusTokens.length;
  const vocab = new Set(corpusTokens.flat());
  vocab.forEach((term) => {
    const docsWithTerm = corpusTokens.filter((doc) => doc.includes(term)).length;
    idf[term] = Math.log((N + 1) / (docsWithTerm + 1)) + 1; // smoothed IDF
  });
  return idf;
}

function computeTFIDFVector(tf, idf) {
  const vec = {};
  Object.keys(tf).forEach((term) => {
    vec[term] = tf[term] * (idf[term] || 0);
  });
  return vec;
}

function cosineSimilarity(vecA, vecB) {
  const terms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0,
    magA = 0,
    magB = 0;
  terms.forEach((term) => {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  });
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Ranks a list of jobs against a candidate's skills/resume text using
 * TF-IDF + Cosine Similarity, and returns each job with an added
 * `matchScore` (0-100) field, sorted from best to worst match.
 */
export function rankJobsForCandidate(candidateSkillsText, jobs) {
  const candidateTokens = tokenize(candidateSkillsText);

  const jobTexts = jobs.map(
    (job) => `${job.title} ${job.category} ${job.description}`
  );
  const jobTokens = jobTexts.map(tokenize);

  // Build corpus: candidate profile + every job description
  const corpus = [candidateTokens, ...jobTokens];
  const idf = computeIDF(corpus);

  const candidateVector = computeTFIDFVector(computeTF(candidateTokens), idf);

  const scored = jobs.map((job, i) => {
    const jobVector = computeTFIDFVector(computeTF(jobTokens[i]), idf);
    const similarity = cosineSimilarity(candidateVector, jobVector);
    return {
      ...(job.toObject ? job.toObject() : job),
      matchScore: Math.round(similarity * 100),
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
