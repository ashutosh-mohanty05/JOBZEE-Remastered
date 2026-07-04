// resumeAnalyzer.js
// Rule-based NLP engine that scans raw resume text and produces:
//  - an overall ATS-friendliness score (0-100)
//  - matched in-demand skills found in the resume
//  - concrete improvement suggestions
// No external API required — works fully offline.

const SKILLS_DB = [
  "javascript","typescript","react","node.js","node","express","mongodb",
  "sql","mysql","postgresql","python","java","c++","c#","html","css",
  "git","github","docker","kubernetes","aws","azure","gcp","rest api",
  "graphql","redux","next.js","tailwind","bootstrap","django","flask",
  "machine learning","deep learning","data analysis","data science",
  "tensorflow","pytorch","pandas","numpy","power bi","tableau","excel",
  "agile","scrum","leadership","communication","teamwork","problem solving",
  "project management","testing","selenium","ci/cd","linux","php","laravel",
];

const ACTION_VERBS = [
  "managed","led","developed","designed","implemented","improved",
  "increased","decreased","built","created","launched","optimized",
  "automated","achieved","coordinated","analyzed","delivered","reduced",
  "streamlined","spearheaded","collaborated","mentored",
];

const SECTION_PATTERNS = {
  contact: /[\w.+-]+@[\w-]+\.[\w.-]+/, // email regex as proxy for contact info
  phone: /(\+?\d{1,3}[-.\s]?)?\d{10}\b/,
  skills: /\bskills?\b/i,
  experience: /\b(experience|work history|employment)\b/i,
  education: /\b(education|degree|university|college|b\.?tech|m\.?tech|bca|mca)\b/i,
  projects: /\b(projects?|certification)\b/i,
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(text, list) {
  const lower = text.toLowerCase();
  return list.filter((term) => {
    const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(term)}($|[^a-z0-9])`, "i");
    return pattern.test(` ${lower} `);
  });
}

export function analyzeResume(resumeText = "") {
  const text = resumeText.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const matchedSkills = countMatches(text, SKILLS_DB);
  const matchedVerbs = countMatches(text, ACTION_VERBS);
  const hasQuantifiedAchievement = /\d+(\.\d+)?\s?%|\$\d+|\b\d{2,}\+?\b/.test(text);

  const hasContact = SECTION_PATTERNS.contact.test(text) || SECTION_PATTERNS.phone.test(text);
  const hasSkillsSection = SECTION_PATTERNS.skills.test(text);
  const hasExperienceSection = SECTION_PATTERNS.experience.test(text);
  const hasEducationSection = SECTION_PATTERNS.education.test(text);
  const hasProjectsSection = SECTION_PATTERNS.projects.test(text);

  // ---- Scoring (out of 100) ----
  let score = 0;
  const suggestions = [];

  if (hasContact) score += 10;
  else suggestions.push("Add clear contact details (email/phone) so recruiters can reach you.");

  if (hasSkillsSection) score += 10;
  else suggestions.push('Add a dedicated "Skills" section listing your key technical skills.');

  if (hasExperienceSection) score += 15;
  else suggestions.push('Add a "Work Experience" section, even for internships or projects.');

  if (hasEducationSection) score += 10;
  else suggestions.push('Add an "Education" section with your degree and institution.');

  if (hasProjectsSection) score += 5;
  else suggestions.push("Mention relevant projects or certifications to stand out.");

  const skillScore = Math.min(20, matchedSkills.length * 2);
  score += skillScore;
  if (matchedSkills.length < 5) {
    suggestions.push(
      "List more relevant technical skills — aim for at least 5-8 specific tools/technologies."
    );
  }

  const verbScore = Math.min(15, matchedVerbs.length * 3);
  score += verbScore;
  if (matchedVerbs.length < 3) {
    suggestions.push(
      'Use strong action verbs (e.g. "developed", "led", "improved") to describe your work.'
    );
  }

  if (hasQuantifiedAchievement) {
    score += 15;
  } else {
    suggestions.push(
      "Quantify your achievements with numbers (e.g. \"improved performance by 30%\")."
    );
  }

  if (wordCount >= 150 && wordCount <= 700) {
    score += 10;
  } else if (wordCount < 150) {
    suggestions.push("Your resume looks too short — add more detail about your experience and skills.");
  } else {
    suggestions.push("Your resume looks too long — try to keep it concise (ideally under 1-2 pages).");
  }

  score = Math.min(100, Math.round(score));

  let verdict = "Needs Improvement";
  if (score >= 80) verdict = "Excellent";
  else if (score >= 60) verdict = "Good";
  else if (score >= 40) verdict = "Fair";

  return {
    score,
    verdict,
    wordCount,
    matchedSkills,
    matchedActionVerbs: matchedVerbs,
    hasQuantifiedAchievement,
    sectionsFound: {
      contact: hasContact,
      skills: hasSkillsSection,
      experience: hasExperienceSection,
      education: hasEducationSection,
      projects: hasProjectsSection,
    },
    suggestions,
  };
}
