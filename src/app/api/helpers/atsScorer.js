// app/api/helpers/atsScorer.js
import { WordTokenizer, TfIdf } from "natural";
import nlp from "compromise";
import _ from "lodash";
import { removeStopwords } from "stopword";

// Initialize NLP tools
const tokenizer = new WordTokenizer();

export function calculateAtsAnalysis(resumeText, jobDescription) {
  try {
    // 1. Preprocess and tokenize text
    const resumeTokens = cleanAndTokenize(resumeText);
    const jdTokens = cleanAndTokenize(jobDescription);

    // 2. Extract important keywords using TF-IDF
    const { resumeKeywords, jdKeywords } = extractImportantKeywords(
      resumeTokens,
      jdTokens
    );

    // 3. Calculate matches
    const presentKeywords = _.intersection(resumeKeywords, jdKeywords);
    const missingKeywords = _.difference(jdKeywords, resumeKeywords);

    // 4. Calculate score (weighted)
    const atsScore = calculateMatchScore(
      resumeKeywords,
      jdKeywords,
      presentKeywords
    );

    // 5. Generate smart suggestions
    const suggestions = generateSmartSuggestions(
      resumeText,
      presentKeywords,
      missingKeywords,
      atsScore
    );

    return {
      atsScore,
      presentKeywords: presentKeywords.slice(0, 15), // Limit to top 15
      missingKeywords: missingKeywords.slice(0, 15),
      suggestions,
    };
  } catch (error) {
    console.error("Analysis error:", error);
    throw new Error("Failed to analyze resume");
  }
}

// Helper functions
function cleanAndTokenize(text) {
  // Basic cleaning
  let cleaned = text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ");

  // Extract nouns and verbs using compromise
  const doc = nlp(cleaned);
  const importantTerms = [
    ...doc.nouns().out("array"),
    ...doc.verbs().out("array"),
  ].join(" ");

  // Tokenize and remove stopwords
  let tokens = tokenizer.tokenize(importantTerms) || [];
  tokens = removeStopwords(tokens);

  // Remove single characters and numbers
  return tokens.filter((token) => token.length > 2 && !/\d/.test(token));
}

function extractImportantKeywords(resumeTokens, jdTokens) {
  const tfidf = new TfIdf();

  // Add documents
  tfidf.addDocument(resumeTokens.join(" "));
  tfidf.addDocument(jdTokens.join(" "));

  // Get top keywords for each
  const resumeKeywords = getTopTerms(tfidf, 0, 20);
  const jdKeywords = getTopTerms(tfidf, 1, 20);

  return { resumeKeywords, jdKeywords };
}

function getTopTerms(tfidf, docIndex, count) {
  const terms = [];
  tfidf
    .listTerms(docIndex)
    .slice(0, count)
    .forEach((item) => {
      terms.push(item.term);
    });
  return terms;
}

function calculateMatchScore(resumeKeys, jdKeys, matches) {
  if (jdKeys.length === 0) return 0;

  // Weighted score (more weight to JD keywords)
  const baseScore = (matches.length / jdKeys.length) * 100;

  // Bonus for resume length (but not too long)
  const lengthFactor = Math.min(1, resumeKeys.length / 50);

  return Math.min(100, Math.round(baseScore * 0.8 + lengthFactor * 20));
}

function generateSmartSuggestions(resumeText, present, missing, score) {
  const suggestions = [];
  const doc = nlp(resumeText);

  // Score-based suggestions
  if (score < 50) {
    suggestions.push(
      "Your resume needs significant improvements for this role"
    );
  } else if (score < 70) {
    suggestions.push("Good potential but could be stronger for this position");
  }

  // Keyword suggestions
  if (missing.length > 0) {
    suggestions.push(
      `Add these important keywords: ${_.sampleSize(missing, 3).join(", ")}`
    );
  }

  // Action verb analysis
  const verbs = doc.verbs().out("array");
  const weakVerbs = ["did", "made", "worked"];
  if (verbs.some((v) => weakVerbs.includes(v))) {
    suggestions.push(
      "Replace weak verbs like 'did' with stronger action verbs"
    );
  }

  // Length suggestion
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 200) {
    suggestions.push("Consider adding more details to your work experience");
  } else if (wordCount > 600) {
    suggestions.push("Your resume might be too long - try to keep it concise");
  }

  return suggestions.length > 0 ? suggestions : ["Your resume looks strong!"];
}
