// Summer 2027 program data. Everything on /summer-2027 comes from this file:
// change dates, tracks, sizes or the FAQ here and the page follows.

export type Day = { title: string; detail: string };
export type Track = {
  id: string;
  title: string;
  tagline: string;
  icon: "web" | "app" | "ai" | "cyber" | "data" | "pm";
  grades: [number, number];
  level: "Beginner" | "Some experience" | "Intermediate";
  interests: string[];
  sessions: number[];
  overview: string;
  forWho: string;
  prereq: string;
  outcomes: string[];
  project: { name: string; detail: string };
  tools: string[];
  days: Day[];
};

export const PROGRAM = {
  name: "CyruTech Summer Tech Academy 2027",
  starts: "2027-06-21T09:00:00-07:00",
  grades: "Grades 6 to 12",
  classSize: { onsite: 20, online: 16 },
  ratio: "1 lead instructor and 1 assistant per class",
  registrationOpens: "February 1, 2027",
  earlyDeadline: "April 15, 2027",
  contactEmail: "team@cyrutech.com",
  contactPhone: "+1 (858) 247-1788",
  formKey: "318db7ff-a710-47ee-9852-d56ada295461", // Web3Forms public access key, same as the site's other forms
};

export const SESSIONS = [
  { n: 1, name: "Session 1", start: "2027-06-21", end: "2027-07-02", label: "Jun 21 – Jul 2", days: 10, note: "" },
  { n: 2, name: "Session 2", start: "2027-07-06", end: "2027-07-16", label: "Jul 6 – Jul 16", days: 9, note: "Starts Tuesday (July 5 is the Independence Day holiday). Days 9 and 10 run together as one longer showcase day." },
  { n: 3, name: "Session 3", start: "2027-07-19", end: "2027-07-30", label: "Jul 19 – Jul 30", days: 10, note: "" },
  { n: 4, name: "Session 4", start: "2027-08-02", end: "2027-08-13", label: "Aug 2 – Aug 13", days: 10, note: "" },
];

export const INTERESTS = ["Building websites", "Apps & games", "Artificial intelligence", "Security & hacking", "Data & numbers", "Leading teams", "Design"];

export const TRACKS: Track[] = [
  {
    id: "web-development",
    title: "Web Development",
    tagline: "Design, code and publish a real website in two weeks.",
    icon: "web",
    grades: [6, 12],
    level: "Beginner",
    interests: ["Building websites", "Design"],
    sessions: [1, 2, 3, 4],
    overview: "Students learn how the web works and build a complete, responsive website from a blank file: HTML for structure, CSS for layout and style, and JavaScript for interactivity. By the second week they add a contact form, an image gallery and animations, then publish the site to a live address they can share with family and future schools.",
    forWho: "First-time coders and students who want something they can show people at the end. Younger students build a personal or club site; older students can build a site for a real local business or cause.",
    prereq: "None. Students need to be comfortable typing and using a browser.",
    outcomes: ["Write clean HTML and CSS by hand", "Build layouts that work on phones and laptops", "Add interactivity with JavaScript", "Use Git and GitHub to save and publish work", "Explain how a page travels from a server to a browser"],
    project: { name: "A published portfolio or cause website", detail: "A three-page site with a home page, a gallery and a working contact form, live on its own web address by Day 10." },
    tools: ["VS Code", "HTML & CSS", "JavaScript", "Git & GitHub", "GitHub Pages", "Figma (sketching)"],
    days: [
      { title: "How the web works", detail: "Browsers, servers and addresses. Each student sketches the site they want to build." },
      { title: "HTML structure", detail: "Headings, text, links, images and lists. First page goes up on screen." },
      { title: "CSS styling", detail: "Colors, fonts, spacing and the box model. Students give their page a look." },
      { title: "Layout with Flexbox and Grid", detail: "Multi-column layouts, navigation bars and cards." },
      { title: "Responsive design", detail: "Making the same page work on a phone, a tablet and a laptop." },
      { title: "JavaScript basics", detail: "Variables, events and changing the page when someone clicks." },
      { title: "Interactive features", detail: "An image gallery, a dark-mode switch and simple animations." },
      { title: "Forms and accessibility", detail: "A working contact form, alt text and keyboard-friendly pages." },
      { title: "Publish with Git and GitHub", detail: "Version control, then putting the site live on its own address." },
      { title: "Showcase day", detail: "Students present their live sites to classmates and families." },
    ],
  },
  {
    id: "app-development",
    title: "App Development",
    tagline: "Take an app idea from sketch to a working phone app.",
    icon: "app",
    grades: [8, 12],
    level: "Some experience",
    interests: ["Apps & games", "Design"],
    sessions: [1, 3],
    overview: "Students design and build a working mobile app. They start with a problem worth solving, sketch screens and test them on paper with classmates, then code the app, connect it to live data from an API and run it on their own phone. The track covers the full cycle real app teams follow: design, build, test and prepare for launch.",
    forWho: "Students who already enjoy coding a little (Scratch, Python or a web class counts) and want to build something that runs on a phone.",
    prereq: "Some programming experience helps. Students who have never coded should start with Web Development.",
    outcomes: ["Plan an app around a real user problem", "Design screens and test them with users", "Build an app with React Native and Expo", "Fetch and display live data from an API", "Find and fix bugs with a debugger"],
    project: { name: "A working phone app", detail: "An app with at least three screens and live data (weather, sports scores, a study timer or the student's own idea), running on their phone through Expo." },
    tools: ["Figma", "JavaScript", "React Native", "Expo", "Public APIs", "Git & GitHub"],
    days: [
      { title: "Finding a problem worth solving", detail: "Interviewing classmates and choosing an app idea." },
      { title: "Designing screens", detail: "Wireframes in Figma and a paper-prototype test." },
      { title: "JavaScript refresher", detail: "Functions, arrays and objects, the parts apps use most." },
      { title: "First app on your phone", detail: "Setting up Expo and running a first screen on a real device." },
      { title: "Components and navigation", detail: "Buttons, lists and moving between screens." },
      { title: "Working with APIs", detail: "Pulling live data from the internet into the app." },
      { title: "Saving data", detail: "Remembering settings and favorites on the device." },
      { title: "Testing and debugging", detail: "User testing with another team and fixing what breaks." },
      { title: "Polish and launch prep", detail: "Icons, splash screens and what app store submission involves." },
      { title: "Demo day", detail: "Live demos on phones, with feedback from instructors and guests." },
    ],
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning Essentials",
    tagline: "Understand how AI works by training models yourself.",
    icon: "ai",
    grades: [9, 12],
    level: "Intermediate",
    interests: ["Artificial intelligence", "Data & numbers"],
    sessions: [2, 4],
    overview: "Students go past using AI tools to understanding how they work. They train their own image classifier, build a neural network in Python, learn how chatbots and large language models produce text, and discuss where AI goes wrong: bias, made-up answers and privacy. Each student finishes with a working model and a short write-up of what it can and cannot do.",
    forWho: "High school students who are curious about AI and comfortable with algebra. Students heading toward computer science, engineering or research get a head start.",
    prereq: "Basic Python (variables, loops, functions) and Algebra 1. A free Python warm-up course is sent after registration for students who need it.",
    outcomes: ["Explain supervised and unsupervised learning", "Prepare and clean a dataset", "Train and evaluate a model in Python", "Describe how neural networks and language models work", "Spot bias and limits in an AI system"],
    project: { name: "A trained AI model with a report card", detail: "Each student trains a model on a dataset they choose (plant diseases, music genres, handwriting) and presents its accuracy, mistakes and an honest list of limits." },
    tools: ["Python", "Jupyter / Google Colab", "pandas", "scikit-learn", "TensorFlow / Keras", "Teachable Machine"],
    days: [
      { title: "What AI is and isn't", detail: "History, everyday examples and a no-code image classifier in Teachable Machine." },
      { title: "Python for data", detail: "Notebooks, pandas and loading a real dataset." },
      { title: "Cleaning and exploring data", detail: "Missing values, charts and finding patterns." },
      { title: "Your first models", detail: "Linear regression and decision trees with scikit-learn." },
      { title: "Measuring a model", detail: "Training and test sets, accuracy and overfitting." },
      { title: "Neural networks", detail: "Neurons, layers and training a network with Keras." },
      { title: "Images and computer vision", detail: "Convolutional networks and training an image classifier." },
      { title: "Language models and chatbots", detail: "How text generation works, prompts and where models make things up." },
      { title: "AI ethics", detail: "Bias, privacy and fairness, with a debate on a real case." },
      { title: "Model showcase", detail: "Students present their models, results and limits." },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Basics",
    tagline: "Learn how attacks work so you can stop them.",
    icon: "cyber",
    grades: [7, 12],
    level: "Beginner",
    interests: ["Security & hacking", "Building websites"],
    sessions: [1, 3],
    overview: "Students learn how attackers think and how defenders stop them, always in a safe practice lab and never on real systems. They crack weak passwords, encrypt and decrypt messages, read network traffic, find and fix bugs in a practice website, and spot phishing emails. The track ends with a team Capture the Flag competition.",
    forWho: "Puzzle solvers and curious students. No coding background needed; students who already code can take on harder challenges.",
    prereq: "None. Every student signs our ethical hacking pledge on Day 1.",
    outcomes: ["Explain common threats such as phishing, malware and weak passwords", "Use encryption and understand how HTTPS keeps data private", "Read basic network traffic", "Find and fix common website vulnerabilities", "Build a personal security checklist for their family"],
    project: { name: "Capture the Flag and a family security plan", detail: "Teams compete in a CyruTech Capture the Flag on the last day, and each student writes a security checklist for their own household." },
    tools: ["Linux command line", "Wireshark", "CyberChef", "Practice labs", "Password managers", "Python (optional)"],
    days: [
      { title: "The threat landscape", detail: "Real breaches, how they happened and the ethical hacking pledge." },
      { title: "Passwords and authentication", detail: "How passwords are cracked, password managers and two-factor sign-in." },
      { title: "Cryptography", detail: "From Caesar ciphers to modern encryption, hands-on." },
      { title: "The command line", detail: "Linux basics every security professional uses." },
      { title: "Networks", detail: "How data moves, ports and reading traffic with Wireshark." },
      { title: "Web vulnerabilities", detail: "Finding and fixing bugs in a practice website." },
      { title: "Social engineering", detail: "Phishing, scams and how to spot them." },
      { title: "Incident response", detail: "What to do when something goes wrong, run as a tabletop exercise." },
      { title: "Capture the Flag practice", detail: "Team challenges across every topic so far." },
      { title: "Capture the Flag finals", detail: "The final competition, awards and family security plans." },
    ],
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    tagline: "Turn messy data into answers people can act on.",
    icon: "data",
    grades: [9, 12],
    level: "Some experience",
    interests: ["Data & numbers", "Artificial intelligence"],
    sessions: [2, 4],
    overview: "Students learn the full data workflow: asking a good question, collecting and cleaning data, analyzing it, and telling the story with clear charts. They start in spreadsheets, move to Python, and finish by answering a question about their own school, town or favorite sport with real public data.",
    forWho: "Students who like math, sports stats, science fairs or understanding why things happen. A strong fit for future business, science, economics and health students.",
    prereq: "Comfort with spreadsheets and Algebra 1. No Python needed; it is taught from the start.",
    outcomes: ["Ask questions data can answer", "Clean and combine datasets", "Use statistics to test an idea", "Build clear charts and a dashboard", "Present findings to a non-technical audience"],
    project: { name: "A data story", detail: "A dashboard and five-minute presentation answering a question with public data, such as which neighborhoods have the most heat days or what wins basketball games." },
    tools: ["Google Sheets", "Python", "pandas", "Matplotlib & Plotly", "Google Colab", "Looker Studio"],
    days: [
      { title: "Thinking with data", detail: "Good questions, bad charts and choosing a project topic." },
      { title: "Spreadsheets that do work", detail: "Formulas, pivot tables and a first chart." },
      { title: "Python and pandas", detail: "Loading, sorting and filtering data in code." },
      { title: "Cleaning data", detail: "Fixing the messy, missing and mislabeled data every real dataset has." },
      { title: "Statistics you will use", detail: "Averages, spread, correlation and why correlation is not cause." },
      { title: "Visualization", detail: "Choosing the right chart and making it readable." },
      { title: "Working with real public data", detail: "City, census and sports data sources." },
      { title: "Dashboards", detail: "Building an interactive dashboard in Looker Studio." },
      { title: "Storytelling with data", detail: "Turning analysis into a clear, honest presentation." },
      { title: "Data story showcase", detail: "Presentations to classmates, families and guest reviewers." },
    ],
  },
  {
    id: "software-project-management",
    title: "Software Project Management",
    tagline: "Lead a team that ships a real product.",
    icon: "pm",
    grades: [10, 12],
    level: "Beginner",
    interests: ["Leading teams", "Design"],
    sessions: [3],
    overview: "Students learn how real software teams plan, organize and deliver projects using Agile and Scrum. They take turns as product owner, Scrum master and developer, run two short sprints, and lead a team through building a small product for a real client brief. It builds the leadership and communication skills colleges and employers ask about.",
    forWho: "Students who like organizing people, student government, clubs or business. Coding is optional; leadership is the focus.",
    prereq: "None. A basic understanding of how software is made helps but is not required.",
    outcomes: ["Run Agile and Scrum ceremonies", "Plan and estimate work", "Manage risks and changing requirements", "Lead and communicate with a team", "Present a product to a client"],
    project: { name: "A team product launch", detail: "Teams deliver a working prototype for a client brief from a local nonprofit or business, with a project plan, sprint reports and a client pitch." },
    tools: ["Jira or Trello", "Figma", "Google Workspace", "Slack", "Miro"],
    days: [
      { title: "How software gets made", detail: "Roles on a software team and choosing the client brief." },
      { title: "Agile and Scrum", detail: "Sprints, stand-ups and the product backlog." },
      { title: "Planning and estimation", detail: "User stories, story points and a first sprint plan." },
      { title: "Sprint 1 begins", detail: "Daily stand-ups and tracking work on a board." },
      { title: "Risk and change", detail: "Handling a surprise change request from the client." },
      { title: "Sprint 1 review and retro", detail: "Demoing progress and improving how the team works." },
      { title: "Sprint 2", detail: "Shorter, faster and with rotated roles." },
      { title: "Quality and testing", detail: "How teams make sure what they ship works." },
      { title: "Pitch preparation", detail: "Turning the project into a clear client pitch." },
      { title: "Client launch day", detail: "Teams present their product and plan to the client." },
    ],
  },
];

export const SCHEDULES = {
  onsite: {
    label: "On campus",
    hours: "9:00 am – 3:00 pm",
    blocks: [
      { time: "9:00", title: "Check-in and warm-up", detail: "A short puzzle or coding challenge while everyone arrives." },
      { time: "9:20", title: "Lesson of the day", detail: "One new concept, taught with live examples." },
      { title: "Guided build lab", time: "10:15", detail: "Students apply it step by step with the instructor." },
      { time: "11:30", title: "Lunch and outdoor break", detail: "Screens off. Students bring lunch or use the school's program." },
      { time: "12:15", title: "Independent build lab", detail: "Project time while instructors move table to table." },
      { time: "1:45", title: "Team stand-up and code review", detail: "Small groups show progress and help each other." },
      { time: "2:30", title: "Demo and reflection", detail: "Two or three students demo, then everyone logs what they learned." },
      { time: "3:00", title: "Dismissal", detail: "Optional supervised lab until 3:30 for students who want more time." },
    ],
  },
  online: {
    label: "Live online",
    hours: "10:00 am – 1:00 pm Pacific",
    blocks: [
      { time: "10:00", title: "Live kickoff", detail: "Cameras on, a warm-up and the plan for the day." },
      { time: "10:15", title: "Lesson of the day", detail: "Live teaching with screen sharing and questions." },
      { time: "11:00", title: "Breakout build labs", detail: "Groups of five with an instructor or assistant." },
      { time: "12:15", title: "Show and tell", detail: "Students share their screen and demo progress." },
      { time: "12:45", title: "Wrap-up", detail: "Recap and an optional challenge for the evening." },
      { time: "1:00", title: "Office hours (optional)", detail: "Thirty minutes of one-on-one help." },
    ],
  },
};

export const SCHOOL_MODELS = [
  { title: "We run it on your campus", detail: "Our instructors teach the full program at your school, in your rooms, on your calendar. You provide space and Wi-Fi; we bring curriculum, instructors, project materials and loaner laptops if needed.", best: "Schools without a summer tech program" },
  { title: "Co-teach with your teachers", detail: "Your teachers lead with our curriculum, a two-day training before summer and a CyruTech instructor alongside them for the first week. Your staff keep the program after we leave.", best: "Schools building their own CS program" },
  { title: "Online cohort for your students", detail: "A private live-online class for your students only, at a time that fits your summer schedule. Works across several campuses or a whole district.", best: "Districts and schools with students spread out" },
];

export const INCLUDED = [
  "Full curriculum, slides and project guides",
  "Daily progress notes for families, weekly reports for schools",
  "A final showcase day families can attend",
  "Certificate of completion for every student",
  "A project students keep in their portfolio",
  "Background-checked instructors trained to work with students",
];

export const FAQ = [
  { q: "Who are the programs for?", a: "Students entering grades 6 to 12 in fall 2027. Each track lists its grade range; we place students by grade and experience on the first morning." },
  { q: "Does my child need a laptop?", a: "On campus, schools provide computers or we bring loaner laptops. Online students need a laptop or desktop (Windows, Mac or Chromebook) with a webcam. Tablets and phones are not enough." },
  { q: "Can a student take more than one track?", a: "Yes. Tracks run in different sessions, so a student can take Web Development in Session 1 and App Development in Session 3, for example. The plan builder below warns you if two picks fall in the same session." },
  { q: "How much does it cost?", a: "Pricing depends on the format, the number of students and whether a school is hosting. Add tracks to your plan and send it; we reply with a quote within two business days. Early registration before April 15, 2027 gets priority placement." },
  { q: "Can our school host a program?", a: "Yes, that is what the school options are for. We can run the program for you, co-teach with your teachers, or teach a private online cohort. Send a plan with your expected number of students." },
  { q: "What happens on the last day?", a: "Every track ends with a showcase. Students present their projects, families are invited (on campus or by video link), and every student receives a certificate." },
  { q: "What if a student misses a day?", a: "Online sessions are recorded for enrolled students, and instructors send the day's guide so they can catch up. On campus, the optional afternoon lab is a good time to catch up." },
  { q: "Is there homework?", a: "No required homework. Online students get an optional evening challenge for those who want more." },
];
