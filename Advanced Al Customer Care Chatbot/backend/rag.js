const crypto = require("crypto");
const logger = require("./logger");

// Simple in-memory document database
let documents = [];
let chunks = [];

// Stop words to filter out to improve search relevancy
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", 
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", 
  "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", 
  "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", 
  "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", 
  "if", "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", 
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", 
  "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", 
  "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", 
  "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", 
  "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", 
  "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", 
  "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"
]);

// Helper to tokenize and stem text (lowercase + clean + filter stop words)
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

// Compute Term Frequency (TF) for a set of tokens
function getTermFrequency(tokens) {
  const tf = {};
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });
  // Normalize TF
  const length = tokens.length;
  for (const token in tf) {
    tf[token] = tf[token] / length;
  }
  return tf;
}

// Add a document to the RAG database, splice it into chunks, and compute vector profiles
function addDocument(filename, content) {
  const docId = crypto.randomUUID();
  
  // Split content into clean chunks by double newlines or sentences (approx 200-400 chars)
  const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const docChunks = [];

  paragraphs.forEach((para, idx) => {
    // If paragraph is too long, we could split further, but paragraphs are usually good context boundaries
    const chunkTokens = tokenize(para);
    if (chunkTokens.length === 0) return;

    const chunkId = `${docId}-ch-${idx}`;
    const chunk = {
      id: chunkId,
      docId,
      filename,
      content: para,
      tokens: chunkTokens,
      tf: getTermFrequency(chunkTokens)
    };
    
    docChunks.push(chunk);
    chunks.push(chunk);
  });

  const doc = {
    id: docId,
    filename,
    content,
    chunksCount: docChunks.length,
    addedAt: new Date().toISOString()
  };
  
  documents.push(doc);
  
  logger.log(`[RAG Indexer] Processed "${filename}" into ${docChunks.length} search chunks.`, "info");
  return doc;
}

// Compute Inverse Document Frequency (IDF) for all tokens across all chunks
function getIDF() {
  const idf = {};
  const N = chunks.length;
  if (N === 0) return idf;

  chunks.forEach(chunk => {
    const uniqueTokens = new Set(chunk.tokens);
    uniqueTokens.forEach(token => {
      idf[token] = (idf[token] || 0) + 1;
    });
  });

  for (const token in idf) {
    // Log IDF formula: log(Total Chunks / Chunks containing term) + 1
    idf[token] = Math.log(N / idf[token]) + 1;
  }
  
  return idf;
}

// Delete a document and its chunks
function deleteDocument(docId) {
  documents = documents.filter(d => d.id !== docId);
  chunks = chunks.filter(c => c.docId !== docId);
  logger.log(`[RAG Indexer] Deleted document ID: ${docId}`, "info");
  return true;
}

// Search for the top K matching chunks based on Cosine Similarity
function search(queryText, topK = 3) {
  logger.log(`[RAG Search] Initiating similarity search for query: "${queryText}"`, "info");
  
  const queryTokens = tokenize(queryText);
  if (queryTokens.length === 0 || chunks.length === 0) {
    logger.log(`[RAG Search] Query tokenized to empty vector or index is empty. Returning 0 matches.`, "warn");
    return [];
  }

  // Get current global IDF weights
  const idf = getIDF();
  
  // Compute query vector using TF-IDF
  const queryTf = getTermFrequency(queryTokens);
  const queryVector = {};
  let queryLength = 0;
  
  queryTokens.forEach(token => {
    const tokenIdf = idf[token] || 0;
    queryVector[token] = queryTf[token] * tokenIdf;
    queryLength += queryVector[token] * queryVector[token];
  });
  queryLength = Math.sqrt(queryLength);

  if (queryLength === 0) {
    logger.log(`[RAG Search] Query length is zero (unknown vocabulary). Returning 0 matches.`, "warn");
    return [];
  }

  // Compute similarity score for each chunk
  const results = chunks.map(chunk => {
    let dotProduct = 0;
    let chunkLength = 0;

    // Calculate TF-IDF vector for the chunk
    const chunkVector = {};
    for (const token in chunk.tf) {
      const tokenIdf = idf[token] || 0;
      chunkVector[token] = chunk.tf[token] * tokenIdf;
      chunkLength += chunkVector[token] * chunkVector[token];
      
      // Calculate dot product on the fly if token exists in query
      if (queryVector[token]) {
        dotProduct += queryVector[token] * chunkVector[token];
      }
    }
    chunkLength = Math.sqrt(chunkLength);

    // Cosine Similarity = Dot Product / (||V1|| * ||V2||)
    const score = chunkLength === 0 || queryLength === 0 ? 0 : dotProduct / (queryLength * chunkLength);

    return {
      chunkId: chunk.id,
      docId: chunk.docId,
      filename: chunk.filename,
      content: chunk.content,
      score: Math.round(score * 1000) / 1000 // Round to 3 decimal places
    };
  });

  // Sort by score descending and filter out zeros
  const sorted = results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  logger.log(`[RAG Search] Found ${sorted.length} relevant chunks inside index.`, "info");
  sorted.forEach((match, idx) => {
    logger.log(`  - Match #${idx + 1}: score=${match.score} | doc="${match.filename}" | preview="${match.content.substring(0, 60)}..."`, "info");
  });

  return sorted;
}

// Seed initial system knowledge base for testing
function seedDefaultDocs() {
  if (documents.length > 0) return;

  const defaultDocs = [
    {
      filename: "shubdeep_labs_faq.txt",
      content: `Shubdeep Labs is an academic project development and tutoring platform designed specifically for Diploma, BCA, MCA, B.E., and B.Tech engineering students.
Our office provides customized, high-quality coding solutions rather than static templates. Every code draft is commented and reviewed from scratch.
Contact information: Students can call the registry office coordinator directly at +91 90288 33275 or send inquiries via email at shubdeeplabs@gmail.com.
Office hours: The lab desk is open Monday to Saturday from 9:30 AM to 7:00 PM.`
    },
    {
      filename: "pricing_and_deliverables.txt",
      content: `We offer three pricing tiers based on technical complexity:
- Easy Project Plan (₹1999): Simple utility tools, clean interface, draft PPT slides, complete source code.
- Medium Project Plan (₹3499): Relational database models, multi-feature UI, PPT, comprehensive thesis report draft, and 2 code logic revisions.
- Hard Project Plan (₹4599): Advanced algorithms (AI/ML/Deep Learning/Custom APIs), secure authentication dashboards, complete thesis reports, 3 code revisions, remote installation assistance over Zoom/AnyDesk, and a 1-on-1 code walkthrough explanation.`
    },
    {
      filename: "refund_and_revisions_policy.txt",
      content: `Revision policy: For Medium projects, you get up to 2 free logic revisions. For Hard projects, you get up to 3 revisions. Revisions must align with the initially approved project scope.
Refund policy: If a project cannot be compiled or delivered by our team due to unexpected technical constraints, we guarantee a 100% full refund. No refunds are granted after final code deliverables are successfully compiled and handed over.`
    }
  ];

  defaultDocs.forEach(d => {
    addDocument(d.filename, d.content);
  });
  
  logger.log(`[RAG Indexer] Seeded ${documents.length} default FAQ guidelines documents.`, "info");
}

module.exports = {
  addDocument,
  deleteDocument,
  search,
  seedDefaultDocs,
  getDocuments: () => documents,
  getChunks: () => chunks
};
