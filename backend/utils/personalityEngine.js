// personalityEngine.js
// A simple, transparent psychometric scoring model (RIASEC / work-style
// inspired) that converts quiz answers into trait scores, then maps the
// dominant trait(s) to career-path recommendations and improvement tips.

// A bank of 30 questions. Consumers ask for 6, 15, or 30 of them at a time
// (see getQuizQuestions in aiController.js); each still maps into the same
// 6 trait buckets below so scoring stays consistent regardless of length.
export const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "When starting a new task, you prefer to:",
    options: [
      { text: "Analyze data and plan a logical approach", trait: "Analytical" },
      { text: "Brainstorm creative, out-of-the-box ideas", trait: "Creative" },
      { text: "Discuss it with the team first", trait: "Social" },
      { text: "Take charge and assign responsibilities", trait: "Leadership" },
    ],
  },
  {
    id: "q2",
    question: "Which activity excites you the most?",
    options: [
      { text: "Solving a tricky coding/technical problem", trait: "Technical" },
      { text: "Designing a visual layout or presentation", trait: "Creative" },
      { text: "Helping a friend resolve a conflict", trait: "Social" },
      { text: "Leading a group project to success", trait: "Leadership" },
    ],
  },
  {
    id: "q3",
    question: "In a group project, you naturally become the:",
    options: [
      { text: "Planner who tracks details & deadlines", trait: "Detail-Oriented" },
      { text: "Idea generator", trait: "Creative" },
      { text: "Mediator who keeps everyone aligned", trait: "Social" },
      { text: "Decision-maker", trait: "Leadership" },
    ],
  },
  {
    id: "q4",
    question: "Which of these tasks would you enjoy doing all day?",
    options: [
      { text: "Working with numbers, charts, and data", trait: "Analytical" },
      { text: "Writing code or building software", trait: "Technical" },
      { text: "Meeting new people and networking", trait: "Social" },
      { text: "Checking things carefully for errors", trait: "Detail-Oriented" },
    ],
  },
  {
    id: "q5",
    question: "Your friends would describe you as:",
    options: [
      { text: "Logical and organized", trait: "Analytical" },
      { text: "Imaginative and expressive", trait: "Creative" },
      { text: "Warm and outgoing", trait: "Social" },
      { text: "Decisive and confident", trait: "Leadership" },
    ],
  },
  {
    id: "q6",
    question: "Pick your ideal work environment:",
    options: [
      { text: "Quiet space to focus deeply on precise work", trait: "Detail-Oriented" },
      { text: "Fast-paced space building/fixing technical systems", trait: "Technical" },
      { text: "Collaborative space full of people", trait: "Social" },
      { text: "A space where you manage a team's direction", trait: "Leadership" },
    ],
  },
  {
    id: "q7",
    question: "A new tool launches at work. What's your first move?",
    options: [
      { text: "Read the docs and study how it works internally", trait: "Analytical" },
      { text: "Start tinkering with it immediately, hands-on", trait: "Technical" },
      { text: "Ask a colleague to walk you through it together", trait: "Social" },
      { text: "Sketch out creative ways it could be used", trait: "Creative" },
    ],
  },
  {
    id: "q8",
    question: "What frustrates you most in a project?",
    options: [
      { text: "Sloppy, error-filled work", trait: "Detail-Oriented" },
      { text: "No clear leader or direction", trait: "Leadership" },
      { text: "Decisions made without data", trait: "Analytical" },
      { text: "A dull, uncreative solution", trait: "Creative" },
    ],
  },
  {
    id: "q9",
    question: "Pick a weekend activity:",
    options: [
      { text: "Fixing or building something technical", trait: "Technical" },
      { text: "Organizing your notes, files, or budget", trait: "Detail-Oriented" },
      { text: "Hosting friends or attending a social event", trait: "Social" },
      { text: "Painting, writing, or another creative hobby", trait: "Creative" },
    ],
  },
  {
    id: "q10",
    question: "In a meeting, you're most likely to:",
    options: [
      { text: "Present data to support a point", trait: "Analytical" },
      { text: "Steer the discussion toward a decision", trait: "Leadership" },
      { text: "Make sure everyone's voice is heard", trait: "Social" },
      { text: "Suggest an unconventional idea", trait: "Creative" },
    ],
  },
  {
    id: "q11",
    question: "Which compliment means the most to you?",
    options: [
      { text: "\"You never miss a detail.\"", trait: "Detail-Oriented" },
      { text: "\"You're a natural problem-solver.\"", trait: "Technical" },
      { text: "\"People trust you to lead.\"", trait: "Leadership" },
      { text: "\"You always know how to connect with people.\"", trait: "Social" },
    ],
  },
  {
    id: "q12",
    question: "How do you make big decisions?",
    options: [
      { text: "Weigh the numbers and evidence carefully", trait: "Analytical" },
      { text: "Trust your gut and creative instinct", trait: "Creative" },
      { text: "Talk it through with people you trust", trait: "Social" },
      { text: "Decide quickly and move forward", trait: "Leadership" },
    ],
  },
  {
    id: "q13",
    question: "What's your go-to role in a hackathon?",
    options: [
      { text: "The one writing and debugging the code", trait: "Technical" },
      { text: "The one designing the pitch and visuals", trait: "Creative" },
      { text: "The one keeping the team organized on time", trait: "Detail-Oriented" },
      { text: "The one presenting and rallying the team", trait: "Leadership" },
    ],
  },
  {
    id: "q14",
    question: "Which subject did you enjoy most in school?",
    options: [
      { text: "Math or statistics", trait: "Analytical" },
      { text: "Art, music, or writing", trait: "Creative" },
      { text: "Computer science / shop / engineering", trait: "Technical" },
      { text: "Debate, drama, or student government", trait: "Leadership" },
    ],
  },
  {
    id: "q15",
    question: "A teammate makes a mistake. You:",
    options: [
      { text: "Calmly point out exactly where it went wrong", trait: "Detail-Oriented" },
      { text: "Reassure them and check how they're feeling", trait: "Social" },
      { text: "Dig into the root cause systematically", trait: "Analytical" },
      { text: "Take charge and fix the immediate issue", trait: "Leadership" },
    ],
  },
  {
    id: "q16",
    question: "Pick a book/show genre you gravitate to:",
    options: [
      { text: "Mystery/puzzle-solving", trait: "Analytical" },
      { text: "Sci-fi/fantasy world-building", trait: "Creative" },
      { text: "Biographies of leaders", trait: "Leadership" },
      { text: "Stories about relationships & people", trait: "Social" },
    ],
  },
  {
    id: "q17",
    question: "What kind of feedback do you give best?",
    options: [
      { text: "Precise, line-by-line corrections", trait: "Detail-Oriented" },
      { text: "Big-picture strategic direction", trait: "Leadership" },
      { text: "Encouraging and empathetic feedback", trait: "Social" },
      { text: "Technical, root-cause feedback", trait: "Technical" },
    ],
  },
  {
    id: "q18",
    question: "Your ideal Sunday project is:",
    options: [
      { text: "Building a small app or gadget", trait: "Technical" },
      { text: "Deep-cleaning and organizing a space", trait: "Detail-Oriented" },
      { text: "Volunteering or catching up with people", trait: "Social" },
      { text: "Creating art, music, or a design project", trait: "Creative" },
    ],
  },
  {
    id: "q19",
    question: "When you disagree with a decision, you:",
    options: [
      { text: "Bring data to make your counter-case", trait: "Analytical" },
      { text: "Propose a creative alternative", trait: "Creative" },
      { text: "Voice concerns and propose a plan", trait: "Leadership" },
      { text: "Talk it out privately with those involved", trait: "Social" },
    ],
  },
  {
    id: "q20",
    question: "What energizes you most at work?",
    options: [
      { text: "Cracking a hard technical problem", trait: "Technical" },
      { text: "Getting a messy process perfectly organized", trait: "Detail-Oriented" },
      { text: "Rallying a team around a goal", trait: "Leadership" },
      { text: "Coming up with a bold new idea", trait: "Creative" },
    ],
  },
  {
    id: "q21",
    question: "Pick a task you'd volunteer for first:",
    options: [
      { text: "Building the spreadsheet model", trait: "Analytical" },
      { text: "Designing the slide deck", trait: "Creative" },
      { text: "Coordinating with other departments", trait: "Social" },
      { text: "Owning the project timeline", trait: "Leadership" },
    ],
  },
  {
    id: "q22",
    question: "How do you handle a tight deadline?",
    options: [
      { text: "Make a detailed checklist and execute methodically", trait: "Detail-Oriented" },
      { text: "Dive straight into building/fixing the core problem", trait: "Technical" },
      { text: "Rally the team and delegate tasks", trait: "Leadership" },
      { text: "Find a clever shortcut nobody considered", trait: "Creative" },
    ],
  },
  {
    id: "q23",
    question: "What do people usually come to you for?",
    options: [
      { text: "Advice backed by logic and analysis", trait: "Analytical" },
      { text: "Fresh, creative perspectives", trait: "Creative" },
      { text: "A listening ear and support", trait: "Social" },
      { text: "Clear direction and decisions", trait: "Leadership" },
    ],
  },
  {
    id: "q24",
    question: "Which achievement would make you proudest?",
    options: [
      { text: "Solving a problem no one else could crack", trait: "Technical" },
      { text: "Catching an error that saved the project", trait: "Detail-Oriented" },
      { text: "Mentoring someone to succeed", trait: "Social" },
      { text: "Leading a team through a tough launch", trait: "Leadership" },
    ],
  },
  {
    id: "q25",
    question: "In your ideal job, most of your day involves:",
    options: [
      { text: "Interpreting data/reports", trait: "Analytical" },
      { text: "Designing or creating things", trait: "Creative" },
      { text: "Talking with clients or teammates", trait: "Social" },
      { text: "Writing or maintaining code/systems", trait: "Technical" },
    ],
  },
  {
    id: "q26",
    question: "How do you react to ambiguity?",
    options: [
      { text: "Break it down logically until it's clear", trait: "Analytical" },
      { text: "Get curious and experiment with solutions", trait: "Creative" },
      { text: "Take the lead and set a direction", trait: "Leadership" },
      { text: "Slow down and double-check every assumption", trait: "Detail-Oriented" },
    ],
  },
  {
    id: "q27",
    question: "Your desk/workspace is usually:",
    options: [
      { text: "Perfectly organized with everything labeled", trait: "Detail-Oriented" },
      { text: "Full of gadgets, cables, or tools", trait: "Technical" },
      { text: "Decorated with art or personal creative touches", trait: "Creative" },
      { text: "A hub where people stop by to chat", trait: "Social" },
    ],
  },
  {
    id: "q28",
    question: "You just got promoted. What excites you most?",
    options: [
      { text: "Making higher-level strategic decisions", trait: "Leadership" },
      { text: "Access to better data for decision-making", trait: "Analytical" },
      { text: "Mentoring and growing a team", trait: "Social" },
      { text: "More room to innovate", trait: "Creative" },
    ],
  },
  {
    id: "q29",
    question: "Pick the compliment you'd rather receive from a manager:",
    options: [
      { text: "\"Your work is always accurate and thorough.\"", trait: "Detail-Oriented" },
      { text: "\"You have real technical depth.\"", trait: "Technical" },
      { text: "\"Your team would follow you anywhere.\"", trait: "Leadership" },
      { text: "\"You bring such original ideas to the table.\"", trait: "Creative" },
    ],
  },
  {
    id: "q30",
    question: "Which describes your ideal team role best?",
    options: [
      { text: "The analyst who backs every decision with evidence", trait: "Analytical" },
      { text: "The connector who keeps relationships strong", trait: "Social" },
      { text: "The builder who ships the technical work", trait: "Technical" },
      { text: "The captain who sets the direction", trait: "Leadership" },
    ],
  },
];

const CAREER_MAP = {
  Analytical: {
    roles: ["Data Analyst", "Business Analyst", "Data Scientist", "Financial Analyst"],
    tip: "Sharpen your skills in Excel/SQL/Python and practice structured problem-solving to lean into analytical roles.",
  },
  Creative: {
    roles: ["UI/UX Designer", "Content Creator", "Marketing Specialist", "Product Designer"],
    tip: "Build a portfolio showcasing your creative work — visual design, writing, or campaigns you've led.",
  },
  Social: {
    roles: ["HR Executive", "Customer Success Manager", "Sales Executive", "Recruiter"],
    tip: "Highlight communication and relationship-building achievements; consider roles with high people-interaction.",
  },
  Leadership: {
    roles: ["Project Manager", "Product Manager", "Team Lead", "Scrum Master"],
    tip: "Look for opportunities to lead small initiatives or mentor others — it builds evidence of leadership for your resume.",
  },
  Technical: {
    roles: ["Software Developer", "DevOps Engineer", "QA Engineer", "Systems Engineer"],
    tip: "Keep building hands-on projects and contribute to open source to strengthen your technical portfolio.",
  },
  "Detail-Oriented": {
    roles: ["QA/Test Engineer", "Compliance Analyst", "Operations Analyst", "Accountant"],
    tip: "Emphasize accuracy and process-improvement examples; certifications in auditing/testing can help.",
  },
};

export const ALLOWED_QUIZ_LENGTHS = [6, 15, 30];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns `count` randomly selected questions from the bank (no repeats).
 * count must be one of ALLOWED_QUIZ_LENGTHS.
 */
export function pickQuizQuestions(count) {
  const size = ALLOWED_QUIZ_LENGTHS.includes(count) ? count : 6;
  return shuffle(QUIZ_QUESTIONS).slice(0, size);
}

/**
 * answers: array of trait strings, one per question, e.g. ["Analytical","Technical",...]
 */
export function scorePersonality(answers = []) {
  const scores = {
    Analytical: 0,
    Creative: 0,
    Social: 0,
    Leadership: 0,
    Technical: 0,
    "Detail-Oriented": 0,
  };

  answers.forEach((trait) => {
    if (scores[trait] !== undefined) scores[trait] += 1;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const dominantTraits = sorted.filter(([, val]) => val === topScore && val > 0).map(([t]) => t);

  const recommendations = dominantTraits.map((trait) => ({
    trait,
    suggestedRoles: CAREER_MAP[trait].roles,
    improvementTip: CAREER_MAP[trait].tip,
  }));

  return {
    scores,
    dominantTraits,
    recommendations,
  };
}
