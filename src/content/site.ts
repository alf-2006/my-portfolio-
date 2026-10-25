// Single source of truth for all on-page copy (EN + AR).
// Facts mirror the unified CV (Oct 2026). Edit text here, not in components.

export type Locale = "en" | "ar";

export const LINKS = {
  email: "ahmedeid7lf@gmail.com",
  linkedin: "https://www.linkedin.com/in/ahmed-eid-440a8a307",
  github: "https://github.com/alf-2006",
  youtube: "https://www.youtube.com/@wasla_tech_official",
  whatsapp: "https://wa.me/201202843931",
  telegram: "https://t.me/Zarzor2006",
  facebook: "https://www.facebook.com/Zarzor7H",
  cv: "/cv/Ahmed_Eid_CV.pdf",
  site: "https://7lf.vercel.app",
  repos: {
    rafiq: "https://github.com/alf-2006/rafiq-system",
    batu: "https://github.com/alf-2006/batu-connect",
    elahmed: "https://github.com/alf-2006/elahmed-retail-suite-main",
  },
  live: {
    kataby: "https://kataby.vercel.app",
    elahmed: "https://elahmed.vercel.app",
  },
} as const;

export type ProjectLink = { label: string; href: string; kind: "live" | "code" };

export type Project = {
  id: string;
  index: string;
  name: string;
  alias?: string;
  tagline: string;
  summary: string;
  role: string;
  points: string[];
  stack: string[];
  links: ProjectLink[];
  image?: { src: string; alt: string; width: number; height: number };
  visual: "rafiq" | "batu" | "kataby" | "elahmed";
};

export type Step = {
  index: string;
  term: string;
  meaning: string;
  evidence?: string;
  link?: { label: string; href: string };
};

export type TimelineItem = { when: string; title: string; org: string; note: string; current?: boolean };

export type StackGroup = { title: string; items: string[] };

export type Stat = { value: number; suffix?: string; label: string };

export type Service = { icon: "agent" | "rag" | "web" | "desktop" | "shield" | "iot"; title: string; text: string; tags: string[] };

export type Dictionary = {
  locale: Locale;
  dir: "ltr" | "rtl";
  meta: { title: string; description: string; ogAlt: string };
  skip: string;
  nav: { href: string; label: string }[];
  langSwitch: { label: string; href: string; hrefLang: Locale; aria: string };
  talk: string;
  hero: {
    eyebrow: string;
    pill: string;
    titleA: string;
    titleB: string;
    titleKey: string;
    titleC: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    facts: string[];
    scroll: string;
  };
  manifesto: { label: string; text: string };
  process: { label: string; title: string; intro: string; steps: Step[]; loop: string };
  work: { label: string; title: string; intro: string; projects: Project[]; moreTitle: string; more: { name: string; note: string }[]; roleLabel: string; stackLabel: string };
  rafiq: {
    label: string;
    title: string;
    sub: string;
    role: string;
    facts: { k: string; v: string }[];
    rule: string;
    never: string;
    layers: { title: string; items: string[] }[];
    side: { title: string; items: string[] }[];
    pipelineLabel: string;
    pipeline: string[];
    verify: string;
    cta: string;
  };
  wasla: { label: string; title: string; role: string; text: string; points: string[]; cta: string; marquee: string[] };
  journey: { label: string; title: string; items: TimelineItem[]; nowLabel: string };
  stack: { label: string; title: string; groups: StackGroup[]; certsTitle: string; certs: string[]; marqueeLabel: string };
  about: { label: string; title: string; role: string; paragraphs: string[]; location: string; photoAlt: string; stats: Stat[]; linksLabel: string };
  services: { label: string; title: string; intro: string; items: Service[]; prev: string; next: string; goTo: string };
  videos: { title: string; sub: string; views: string; all: string };
  form: {
    title: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    namePh: string;
    emailPh: string;
    subjectPh: string;
    messagePh: string;
    viaEmail: string;
    viaWhatsapp: string;
    note: string;
    required: string;
    greeting: string;
  };
  theme: { dark: string; light: string };
  intro: { skip: string; label: string };
  contact: {
    label: string;
    titleA: string;
    titleKey: string;
    titleB: string;
    sub: string;
    emailLabel: string;
    whatsapp: string;
    cv: string;
    socials: string;
    copy: string;
    copied: string;
  };
  footer: { line: string; built: string; top: string };
  a11y: { opensNew: string; menu: string; close: string };
};

const stackCommon = {
  rafiq: ["Python", "FastAPI", "Ollama", "Whisper", "TTS", "ChromaDB", "Fastify", "SQLite", "SSE", "MQTT", "Electron", "React", "Supabase"],
  batu: ["React 19", "Vite", "Tailwind", "Express", "Socket.IO", "Prisma", "Baileys", "AES-256-GCM", "Jest"],
  kataby: ["React 19", "Vite", "TypeScript", "Supabase", "Tailwind", "TanStack"],
  elahmed: ["React", "Vite", "Electron", "SQLite", "Express", "Prisma", "Playwright", "Vitest", "GitHub Actions"],
};

export const en: Dictionary = {
  locale: "en",
  dir: "ltr",
  meta: {
    title: "Ahmed Eid (ALF) — AI-focused engineer & IT student",
    description:
      "Ahmed Eid (ALF) builds AI products — local LLMs, RAG and voice AI — and engineers what AI writes: architecture, review, security and real tests. Team Leader at Wasla Tech, Alexandria, Egypt.",
    ogAlt: "Ahmed Eid (ALF) — I build fast with AI, and engineer what it builds.",
  },
  skip: "Skip to content",
  nav: [
    { href: "#about", label: "About" },
    { href: "#work", label: "Work" },
    { href: "#process", label: "Process" },
    { href: "#wasla", label: "Wasla Tech" },
    { href: "#journey", label: "Journey" },
    { href: "#contact", label: "Contact" },
  ],
  langSwitch: { label: "العربية", href: "/ar", hrefLang: "ar", aria: "اقرأ الموقع بالعربية" },
  talk: "Let’s talk",
  hero: {
    eyebrow: "Ahmed Eid — ALF",
    pill: "Open to internships & freelance",
    titleA: "I build fast with AI\u00a0—",
    titleB: "and ",
    titleKey: "engineer",
    titleC: " what it builds.",
    sub: "AI-focused IT student in Alexandria, Egypt. I design the architecture, direct the AI tools, then review, harden and test what they produce.",
    ctaPrimary: "View projects",
    ctaSecondary: "Contact me",
    facts: ["IT student · BATU, 2nd year", "Team Leader · Wasla Tech", "Local LLMs · RAG · Voice AI"],
    scroll: "Scroll",
  },
  manifesto: {
    label: "Approach",
    text: "AI writes code in seconds. Trust takes engineering. I decide the architecture, direct the tools, read what they write, secure what ships — and prove it with real tests.",
  },
  process: {
    label: "Process",
    title: "How I build",
    intro: "Five steps on every build — with the repositories to prove it.",
    steps: [
      {
        index: "01",
        term: "DESIGN",
        meaning: "Architecture first",
        evidence: "RAFIQ: the interface never talks to the AI directly — every request goes through the backend.",
        link: { label: "rafiq-system", href: LINKS.repos.rafiq },
      },
      {
        index: "02",
        term: "DIRECT",
        meaning: "I direct the AI tools",
        evidence: "Claude Code · Cursor · GitHub Copilot · Lovable · Manus",
      },
      {
        index: "03",
        term: "REVIEW",
        meaning: "I read and correct the output",
        evidence: "Nothing AI-generated ships unread: I trace the logic, fix what’s wrong and keep only what I can explain.",
      },
      {
        index: "04",
        term: "HARDEN",
        meaning: "Security by design",
        evidence: "BATU Connect: lecturers’ phone numbers are encrypted with AES-256-GCM and never shown to students.",
        link: { label: "batu-connect", href: LINKS.repos.batu },
      },
      {
        index: "05",
        term: "VERIFY",
        meaning: "Real tests, not vibes",
        evidence: "Playwright E2E, Vitest and CI in Elahmed Retail Suite · Jest in BATU Connect · RAG, caching and VAD benchmarks in RAFIQ.",
        link: { label: "elahmed-retail-suite", href: LINKS.repos.elahmed },
      },
    ],
    loop: "What VERIFY finds goes back into DESIGN.",
  },
  work: {
    label: "Selected work",
    title: "Featured projects",
    intro: "Four builds I can walk you through line by line.",
    roleLabel: "Role",
    stackLabel: "Stack",
    projects: [
      {
        id: "rafiq",
        index: "01",
        name: "RAFIQ",
        tagline: "Bilingual AI assistant for home patients & elderly care",
        summary: "An offline-first Arabic/English voice assistant: speech-to-text, a local LLM with cloud fallback, RAG memory and text-to-speech.",
        role: "Team project · Former Co-founder & AI Team Leader (Mar–Jun 2026)",
        points: [
          "Three layers — AI service → backend → desktop GUI",
          "Local SQLite with async Supabase sync",
          "Benchmarked RAG, caching and voice-activity detection",
        ],
        stack: stackCommon.rafiq,
        links: [{ label: "GitHub", href: LINKS.repos.rafiq, kind: "code" }],
        visual: "rafiq",
      },
      {
        id: "batu",
        index: "02",
        name: "BATU Connect",
        tagline: "Students reach faculty — phone numbers stay private",
        summary: "Students message lecturers through a WhatsApp bridge without ever seeing their phone numbers. Replies arrive live over WebSockets.",
        role: "Solo project",
        points: ["AES-256-GCM encryption for lecturer numbers", "Live replies over Socket.IO", "Unit and integration tests with Jest"],
        stack: stackCommon.batu,
        links: [{ label: "GitHub", href: LINKS.repos.batu, kind: "code" }],
        visual: "batu",
      },
      {
        id: "kataby",
        index: "03",
        name: "Royal Letters",
        alias: "Kataby",
        tagline: "Private letters, shared through a unique link",
        summary: "Write a private letter and share it through a one-of-a-kind link, with server-side encryption and an audit log.",
        role: "Solo project",
        points: ["Server-side encryption", "Audit log of letter activity", "Unique share link per letter"],
        stack: stackCommon.kataby,
        links: [{ label: "Live site", href: LINKS.live.kataby, kind: "live" }],
        visual: "kataby",
      },
      {
        id: "elahmed",
        index: "04",
        name: "Elahmed Retail Suite",
        tagline: "Retail management for small shops — desktop & web",
        summary: "A desktop and web system for small shops covering inventory, maintenance and delivery, shipped with end-to-end tests and a CI/CD pipeline.",
        role: "Solo project",
        points: ["Electron desktop app + web version", "Playwright end-to-end tests", "CI/CD with GitHub Actions"],
        stack: stackCommon.elahmed,
        links: [
          { label: "Live site", href: LINKS.live.elahmed, kind: "live" },
          { label: "GitHub", href: LINKS.repos.elahmed, kind: "code" },
        ],
        visual: "elahmed",
      },
    ],
    moreTitle: "More builds",
    more: [
      { name: "Pulse of Egypt", note: "Blood-donation system linking donors with hospitals · team lead" },
      { name: "FlutterFlow apps", note: "Mobile apps built with FlutterFlow & Cursor AI" },
      { name: "IT Sum", note: "Peer-sharing platform for IT students" },
      { name: "QR Studio", note: "Dynamic QR code designer" },
    ],
  },
  rafiq: {
    label: "Case study",
    title: "RAFIQ keeps caring when the internet doesn’t.",
    sub: "A bilingual assistant for home patients and elderly care, built offline-first.",
    role: "Former Co-founder & AI Team Leader · BATU team project · Mar–Jun 2026",
    facts: [
      { k: "Languages", v: "Arabic + English" },
      { k: "Brain", v: "Local LLM via Ollama, cloud fallback" },
      { k: "Memory", v: "RAG over ChromaDB" },
      { k: "Data", v: "SQLite → async Supabase sync" },
    ],
    rule: "Design rule",
    never: "The GUI never talks to the AI directly.",
    layers: [
      { title: "Desktop GUI", items: ["Electron", "React"] },
      { title: "Backend", items: ["Fastify", "SSE", "SQLite"] },
      { title: "AI service", items: ["FastAPI", "Ollama", "ChromaDB"] },
    ],
    side: [
      { title: "Devices", items: ["MQTT"] },
      { title: "Cloud sync", items: ["Supabase"] },
    ],
    pipelineLabel: "Voice pipeline",
    pipeline: ["Speech in", "Whisper STT", "Local LLM + RAG", "Text-to-speech", "Voice out"],
    verify: "Benchmarked: RAG retrieval, response caching and voice-activity detection.",
    cta: "Read the code on GitHub",
  },
  wasla: {
    label: "Leadership",
    title: "Wasla Tech",
    role: "Team Leader · since Aug 2026",
    text: "I lead the Wasla team and co-created Wasla Tech, an Arabic YouTube channel about AI and technology.",
    points: ["Lead the team and its delivery", "Co-created the YouTube channel", "Built the team’s internal operations dashboard"],
    cta: "Watch on YouTube",
    marquee: ["AI", "Technology", "Arabic content", "Team of builders", "Wasla Tech"],
  },
  journey: {
    label: "Journey",
    title: "Experience & education",
    nowLabel: "Now",
    items: [
      { when: "First semester 2026/27", title: "IT Engineering Trainee", org: "Alex Dream Language School", note: "School-wide IT support during a full-term practical training.", current: true },
      { when: "Aug 2026 — Present", title: "Team Leader", org: "Wasla Tech", note: "Leading the team; co-created an Arabic AI & tech YouTube channel.", current: true },
      { when: "Mar — Jun 2026", title: "Co-founder & AI Team Leader (former)", org: "RAFIQ · BATU team project", note: "Led the AI track: voice pipeline, local LLM, RAG and benchmarks." },
      { when: "Completed · 3 months", title: "Arduino & IoT Kits Trainee", org: "Borg El Arab Technological University", note: "Organized and assembled Arduino and IoT educational kits." },
      { when: "2025 — Present", title: "Information Technology (IT), 2nd year", org: "Borg El Arab Technological University (BATU)", note: "First-year grade: Excellent." },
      { when: "Graduated 2025", title: "Industrial Secondary Education — Computer Dept.", org: "Alexandria Advanced Industrial Technical School (Military Foundation)", note: "Technical industrial education, computer specialization." },
    ],
  },
  stack: {
    label: "Stack",
    title: "Tools I ship with",
    groups: [
      { title: "AI", items: ["Ollama · local LLMs", "RAG · ChromaDB", "Whisper STT", "Text-to-speech", "Python", "FastAPI"] },
      { title: "Builds with", items: ["Claude Code", "Cursor", "GitHub Copilot", "Lovable", "Manus"] },
      { title: "Web & backend", items: ["React", "Next.js", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Express", "Fastify", "WebSockets", "Electron"] },
      { title: "Data", items: ["Supabase", "SQLite", "SQL Server", "Prisma"] },
      { title: "IoT & networks", items: ["ESP32", "Arduino", "MQTT", "KNX", "Cisco networking", "AES-256-GCM"] },
      { title: "Testing & delivery", items: ["Playwright", "Vitest", "Jest", "GitHub Actions", "Docker", "Vercel"] },
    ],
    certsTitle: "Certifications",
    certs: [
      "Google — AI Fundamentals (Coursera, 2026)",
      "Cisco — Introduction to Cybersecurity",
      "Cisco — Cybersecurity Essentials",
      "Cisco — IoT",
      "Cisco — JavaScript Basics",
      "KNX Automation Certification",
      "Satr Academy — Dart Programming",
      "FlutterFlow Development",
    ],
    marqueeLabel: "Daily stack",
  },
  about: {
    label: "About",
    title: "Hey, I’m Ahmed.",
    role: "AI-focused IT student · Team Leader at Wasla Tech",
    paragraphs: [
      "I’m a second-year IT student at Borg El Arab Technological University in Alexandria. My main focus is AI — local LLMs, retrieval (RAG) and voice — and the full-stack engineering that turns them into products people can use.",
      "I build fast with AI tools, but I don’t ship what I can’t explain. I design the architecture first, review every line the tools write and back the result with real tests. I lead the Wasla Tech team, and I co-founded RAFIQ as its AI Team Leader.",
    ],
    location: "Alexandria, Egypt",
    photoAlt: "Ahmed Eid in a black suit",
    stats: [
      { value: 25, suffix: "+", label: "public GitHub repositories" },
      { value: 8, label: "certifications" },
      { value: 3, label: "teams led" },
      { value: 4, label: "featured builds" },
    ],
    linksLabel: "Find me on",
  },
  services: {
    label: "Services",
    title: "What I can build for you",
    intro: "Freelance projects, internships or a seat on your team — this is where I add the most.",
    prev: "Previous",
    next: "Next",
    goTo: "Go to card",
    items: [
      { icon: "agent", title: "AI assistants & voice", text: "Chat and voice assistants on local LLMs with a cloud fallback — in Arabic and English.", tags: ["Ollama", "Whisper", "TTS"] },
      { icon: "rag", title: "RAG over your documents", text: "Answers grounded in your own files, with retrieval quality you can measure.", tags: ["ChromaDB", "FastAPI", "Python"] },
      { icon: "web", title: "Full-stack web apps", text: "React and Next.js front-ends on Node backends, with auth, realtime and a real database.", tags: ["Next.js", "Node.js", "Supabase"] },
      { icon: "desktop", title: "Offline-first desktop apps", text: "Electron apps on local SQLite that keep working without internet and sync later.", tags: ["Electron", "SQLite", "Prisma"] },
      { icon: "shield", title: "Security & testing", text: "Encryption by design, then end-to-end tests and CI so it keeps working.", tags: ["AES-256-GCM", "Playwright", "GitHub Actions"] },
      { icon: "iot", title: "IoT & automation", text: "ESP32 and Arduino devices on MQTT, connected to apps and dashboards.", tags: ["ESP32", "MQTT", "Arduino"] },
    ],
  },
  videos: { title: "Latest on Wasla Tech", sub: "New lessons from the channel, pulled in automatically.", views: "views", all: "All videos" },
  form: {
    title: "Send a message",
    name: "Name",
    email: "Your email",
    subject: "Subject",
    message: "Message",
    namePh: "Your name",
    emailPh: "you@example.com",
    subjectPh: "Internship, freelance project…",
    messagePh: "Tell me about the idea, the timeline and the budget.",
    viaEmail: "Send by email",
    viaWhatsapp: "Send on WhatsApp",
    note: "Opens your email app or WhatsApp with the message ready. Nothing is stored on this site.",
    required: "Please add your name and a message.",
    greeting: "Hi Ahmed,",
  },
  theme: { dark: "Switch to dark mode", light: "Switch to light mode" },
  intro: { skip: "Skip intro", label: "Ahmed Eid — ALF" },
  contact: {
    label: "Contact",
    titleA: "Have an idea that needs AI and ",
    titleKey: "engineering",
    titleB: "?",
    sub: "Internships, freelance work or a team that ships — email is the fastest way to reach me.",
    emailLabel: "Email me",
    whatsapp: "WhatsApp",
    cv: "Download CV",
    socials: "Elsewhere",
    copy: "Copy email",
    copied: "Copied",
  },
  footer: { line: "Ahmed Eid (ALF) · Alexandria, Egypt", built: "Designed & built with Next.js, three.js and GSAP", top: "Back to top" },
  a11y: { opensNew: "(opens in a new tab)", menu: "Open menu", close: "Close menu" },
};

export const ar: Dictionary = {
  locale: "ar",
  dir: "rtl",
  meta: {
    title: "أحمد عيد (ALF) — مهندس متخصص في الذكاء الاصطناعي وطالب IT",
    description:
      "أحمد عيد (ALF) يبني منتجات ذكاء اصطناعي — Local LLMs وRAG والصوت — ويهندس ما يكتبه الـAI: معمارية، مراجعة، أمان واختبارات حقيقية. Team Leader في Wasla Tech، الإسكندرية.",
    ogAlt: "أحمد عيد (ALF) — أبني بسرعة بالذكاء الاصطناعي، وأهندس ما يبنيه.",
  },
  skip: "تخطَّ إلى المحتوى",
  nav: [
    { href: "#about", label: "نبذة" },
    { href: "#work", label: "المشاريع" },
    { href: "#process", label: "طريقتي" },
    { href: "#wasla", label: "Wasla Tech" },
    { href: "#journey", label: "المسيرة" },
    { href: "#contact", label: "تواصل" },
  ],
  langSwitch: { label: "English", href: "/", hrefLang: "en", aria: "Read this site in English" },
  talk: "لنتحدث",
  hero: {
    eyebrow: "أحمد عيد — ALF",
    pill: "متاح للتدريب والعمل الحر",
    titleA: "أبني بسرعة بالذكاء الاصطناعي\u00a0—",
    titleB: "و",
    titleKey: "أهندس",
    titleC: " كل ما يبنيه.",
    sub: "طالب IT في الإسكندرية، تخصصي الأساسي الذكاء الاصطناعي. أصمم الـArchitecture، أوجّه أدوات الـAI، ثم أراجع وأؤمّن وأختبر كل ما تنتجه.",
    ctaPrimary: "استعرض المشاريع",
    ctaSecondary: "تواصل معي",
    facts: ["طالب IT · جامعة BATU، سنة ثانية", "Team Leader · Wasla Tech", "Local LLMs · RAG · Voice AI"],
    scroll: "مرّر",
  },
  manifesto: {
    label: "المبدأ",
    text: "الذكاء الاصطناعي يكتب الكود في ثوانٍ، لكن الثقة تحتاج هندسة. أنا أحدد المعمارية، أوجّه الأدوات، أقرأ كل ما تكتبه، أؤمّن ما يُنشر — وأثبت ذلك باختبارات حقيقية.",
  },
  process: {
    label: "طريقتي",
    title: "كيف أبني",
    intro: "خمس خطوات في كل مشروع — ومعها المستودعات التي تثبتها.",
    steps: [
      {
        index: "01",
        term: "DESIGN",
        meaning: "المعمارية أولًا",
        evidence: "RAFIQ: الواجهة لا تكلّم الـAI مباشرة أبدًا — كل طلب يمر عبر الـBackend.",
        link: { label: "rafiq-system", href: LINKS.repos.rafiq },
      },
      {
        index: "02",
        term: "DIRECT",
        meaning: "أوجّه أدوات الـAI",
        evidence: "Claude Code · Cursor · GitHub Copilot · Lovable · Manus",
      },
      {
        index: "03",
        term: "REVIEW",
        meaning: "أقرأ الناتج وأصحّحه",
        evidence: "لا شيء يولّده الـAI يُنشر دون قراءة: أتتبّع المنطق، أصحّح الخطأ، وأحتفظ فقط بما أستطيع شرحه.",
      },
      {
        index: "04",
        term: "HARDEN",
        meaning: "الأمان من التصميم",
        evidence: "BATU Connect: أرقام هواتف المحاضرين مشفّرة بـAES-256-GCM ولا تظهر للطلاب أبدًا.",
        link: { label: "batu-connect", href: LINKS.repos.batu },
      },
      {
        index: "05",
        term: "VERIFY",
        meaning: "اختبارات حقيقية",
        evidence: "Playwright E2E وVitest وCI في Elahmed Retail Suite · Jest في BATU Connect · قياسات RAG والـCaching والـVAD في RAFIQ.",
        link: { label: "elahmed-retail-suite", href: LINKS.repos.elahmed },
      },
    ],
    loop: "ما تكشفه مرحلة VERIFY يعود إلى مرحلة DESIGN.",
  },
  work: {
    label: "أعمال مختارة",
    title: "أبرز المشاريع",
    intro: "أربعة مشاريع أستطيع أن أشرح لك كل سطر فيها.",
    roleLabel: "الدور",
    stackLabel: "التقنيات",
    projects: [
      {
        id: "rafiq",
        index: "01",
        name: "RAFIQ",
        tagline: "مساعد ذكي ثنائي اللغة لمرضى المنازل ورعاية كبار السن",
        summary: "مساعد صوتي عربي/إنجليزي يعمل Offline-first: تحويل الكلام لنص، Local LLM مع بديل سحابي، ذاكرة RAG، وتحويل النص لكلام.",
        role: "مشروع فريق · شريك مؤسس وقائد فريق الـAI سابقًا (مارس–يونيو 2026)",
        points: ["ثلاث طبقات — AI service ← Backend ← واجهة Desktop", "تخزين محلي SQLite مع مزامنة Supabase غير متزامنة", "قياس أداء RAG والـCaching واكتشاف الصوت (VAD)"],
        stack: stackCommon.rafiq,
        links: [{ label: "GitHub", href: LINKS.repos.rafiq, kind: "code" }],
        visual: "rafiq",
      },
      {
        id: "batu",
        index: "02",
        name: "BATU Connect",
        tagline: "الطالب يصل إلى المحاضر — ورقمه يبقى سرّيًا",
        summary: "الطلاب يراسلون المحاضرين عبر جسر WhatsApp دون أن يروا أرقامهم أبدًا، وتصل الردود لحظيًا عبر WebSockets.",
        role: "مشروع فردي",
        points: ["تشفير أرقام المحاضرين بـAES-256-GCM", "ردود لحظية عبر Socket.IO", "اختبارات Unit وIntegration بـJest"],
        stack: stackCommon.batu,
        links: [{ label: "GitHub", href: LINKS.repos.batu, kind: "code" }],
        visual: "batu",
      },
      {
        id: "kataby",
        index: "03",
        name: "Royal Letters",
        alias: "كاتبي",
        tagline: "رسائل خاصة تتشارك عبر رابط فريد",
        summary: "اكتب رسالة خاصة وشاركها عبر رابط فريد، مع تشفير على الخادم وسجل تدقيق (Audit log).",
        role: "مشروع فردي",
        points: ["تشفير على الخادم (Server-side)", "سجل تدقيق لنشاط الرسائل", "رابط مشاركة فريد لكل رسالة"],
        stack: stackCommon.kataby,
        links: [{ label: "الموقع", href: LINKS.live.kataby, kind: "live" }],
        visual: "kataby",
      },
      {
        id: "elahmed",
        index: "04",
        name: "Elahmed Retail Suite",
        tagline: "نظام إدارة للمحلات الصغيرة — Desktop وويب",
        summary: "نظام Desktop وويب للمحلات الصغيرة يغطي المخزون والصيانة والتوصيل، ومعه اختبارات End-to-end وCI/CD.",
        role: "مشروع فردي",
        points: ["تطبيق Desktop بـElectron + نسخة ويب", "اختبارات End-to-end بـPlaywright", "CI/CD عبر GitHub Actions"],
        stack: stackCommon.elahmed,
        links: [
          { label: "الموقع", href: LINKS.live.elahmed, kind: "live" },
          { label: "GitHub", href: LINKS.repos.elahmed, kind: "code" },
        ],
        visual: "elahmed",
      },
    ],
    moreTitle: "أعمال أخرى",
    more: [
      { name: "Pulse of Egypt", note: "نظام يربط المتبرعين بالدم بالمستشفيات · قائد الفريق" },
      { name: "FlutterFlow apps", note: "تطبيقات موبايل بـFlutterFlow وCursor AI" },
      { name: "IT Sum", note: "منصة مشاركة بين طلاب الـIT" },
      { name: "QR Studio", note: "مصمم أكواد QR ديناميكية" },
    ],
  },
  rafiq: {
    label: "دراسة حالة",
    title: "RAFIQ يواصل الرعاية حتى عندما ينقطع الإنترنت.",
    sub: "مساعد ثنائي اللغة لمرضى المنازل ورعاية كبار السن، مبني Offline-first.",
    role: "شريك مؤسس وقائد فريق الـAI سابقًا · مشروع فريق في BATU · مارس–يونيو 2026",
    facts: [
      { k: "اللغات", v: "عربي + إنجليزي" },
      { k: "العقل", v: "Local LLM عبر Ollama مع بديل سحابي" },
      { k: "الذاكرة", v: "RAG فوق ChromaDB" },
      { k: "البيانات", v: "SQLite ← مزامنة Supabase" },
    ],
    rule: "قاعدة التصميم",
    never: "الواجهة لا تكلّم الـAI مباشرة أبدًا.",
    layers: [
      { title: "واجهة Desktop", items: ["Electron", "React"] },
      { title: "Backend", items: ["Fastify", "SSE", "SQLite"] },
      { title: "AI service", items: ["FastAPI", "Ollama", "ChromaDB"] },
    ],
    side: [
      { title: "الأجهزة", items: ["MQTT"] },
      { title: "مزامنة سحابية", items: ["Supabase"] },
    ],
    pipelineLabel: "مسار الصوت",
    pipeline: ["كلام داخل", "Whisper STT", "Local LLM + RAG", "Text-to-speech", "صوت خارج"],
    verify: "تم قياس: استرجاع RAG، والـCaching للردود، واكتشاف النشاط الصوتي (VAD).",
    cta: "اقرأ الكود على GitHub",
  },
  wasla: {
    label: "القيادة",
    title: "Wasla Tech",
    role: "Team Leader · منذ أغسطس 2026",
    text: "أقود فريق Wasla، وشاركت في تأسيس Wasla Tech — قناة يوتيوب عربية عن الذكاء الاصطناعي والتكنولوجيا.",
    points: ["قيادة الفريق وتسليم العمل", "المشاركة في تأسيس قناة YouTube", "بناء لوحة التشغيل الداخلية للفريق"],
    cta: "شاهد على YouTube",
    marquee: ["الذكاء الاصطناعي", "التكنولوجيا", "محتوى عربي", "فريق يبني", "Wasla Tech"],
  },
  journey: {
    label: "المسيرة",
    title: "الخبرة والتعليم",
    nowLabel: "حاليًا",
    items: [
      { when: "الترم الأول 2026/27", title: "متدرب مهندس IT", org: "Alex Dream Language School", note: "دعم IT للمدرسة كلها خلال تدريب عملي على مدار الترم.", current: true },
      { when: "أغسطس 2026 — الآن", title: "Team Leader", org: "Wasla Tech", note: "قيادة الفريق والمشاركة في تأسيس قناة YouTube عربية عن الـAI والتكنولوجيا.", current: true },
      { when: "مارس — يونيو 2026", title: "شريك مؤسس وقائد فريق الـAI (سابقًا)", org: "RAFIQ · مشروع فريق في BATU", note: "قيادة مسار الـAI: الصوت، الـLocal LLM، الـRAG والقياسات." },
      { when: "مكتمل · 3 شهور", title: "متدرب Arduino وIoT Kits", org: "جامعة برج العرب التكنولوجية", note: "تنظيم وتجميع حقائب Arduino وIoT التعليمية." },
      { when: "2025 — الآن", title: "تكنولوجيا المعلومات (IT)، سنة ثانية", org: "جامعة برج العرب التكنولوجية (BATU)", note: "تقدير السنة الأولى: امتياز." },
      { when: "تخرّج 2025", title: "تعليم صناعي — قسم الحاسبات", org: "مدرسة الإسكندرية الفنية المتقدمة العسكرية", note: "تعليم فني صناعي، تخصص الحاسبات." },
    ],
  },
  stack: {
    label: "التقنيات",
    title: "الأدوات التي أعمل بها",
    groups: [
      { title: "AI", items: ["Ollama · Local LLMs", "RAG · ChromaDB", "Whisper STT", "Text-to-speech", "Python", "FastAPI"] },
      { title: "أبني باستخدام", items: ["Claude Code", "Cursor", "GitHub Copilot", "Lovable", "Manus"] },
      { title: "Web & Backend", items: ["React", "Next.js", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Express", "Fastify", "WebSockets", "Electron"] },
      { title: "البيانات", items: ["Supabase", "SQLite", "SQL Server", "Prisma"] },
      { title: "IoT والشبكات", items: ["ESP32", "Arduino", "MQTT", "KNX", "Cisco networking", "AES-256-GCM"] },
      { title: "الاختبار والنشر", items: ["Playwright", "Vitest", "Jest", "GitHub Actions", "Docker", "Vercel"] },
    ],
    certsTitle: "الشهادات",
    certs: [
      "Google — AI Fundamentals (Coursera, 2026)",
      "Cisco — Introduction to Cybersecurity",
      "Cisco — Cybersecurity Essentials",
      "Cisco — IoT",
      "Cisco — JavaScript Basics",
      "KNX Automation Certification",
      "Satr Academy — Dart Programming",
      "FlutterFlow Development",
    ],
    marqueeLabel: "أدواتي اليومية",
  },
  about: {
    label: "نبذة",
    title: "أهلًا، أنا أحمد.",
    role: "طالب IT متخصص في الذكاء الاصطناعي · Team Leader في Wasla Tech",
    paragraphs: [
      "طالب في السنة الثانية بقسم تكنولوجيا المعلومات في جامعة برج العرب التكنولوجية بالإسكندرية. تركيزي الأساسي هو الذكاء الاصطناعي — Local LLMs والـRAG والصوت — والهندسة الكاملة (Full-stack) التي تحوّلها إلى منتجات يستخدمها الناس.",
      "أبني بسرعة بأدوات الـAI، لكنني لا أنشر ما لا أستطيع شرحه. أصمم المعمارية أولًا، وأراجع كل سطر تكتبه الأدوات، وأدعم النتيجة باختبارات حقيقية. أقود فريق Wasla Tech، وشاركت في تأسيس RAFIQ كقائد لفريق الـAI.",
    ],
    location: "الإسكندرية، مصر",
    photoAlt: "أحمد عيد ببدلة سوداء",
    stats: [
      { value: 25, suffix: "+", label: "مستودع عام على GitHub" },
      { value: 8, label: "شهادات" },
      { value: 3, label: "فرق قُدتها" },
      { value: 4, label: "مشاريع مميزة" },
    ],
    linksLabel: "تجدني على",
  },
  services: {
    label: "الخدمات",
    title: "ما الذي أستطيع بناءه لك",
    intro: "مشاريع عمل حر، أو تدريب، أو مكان في فريقك — هنا أضيف أكبر قيمة.",
    prev: "السابق",
    next: "التالي",
    goTo: "انتقل إلى البطاقة",
    items: [
      { icon: "agent", title: "مساعدات ذكية وصوتية", text: "مساعدات محادثة وصوت تعمل على Local LLMs مع بديل سحابي — بالعربية والإنجليزية.", tags: ["Ollama", "Whisper", "TTS"] },
      { icon: "rag", title: "RAG على مستنداتك", text: "إجابات مبنية على ملفاتك أنت، مع جودة استرجاع يمكن قياسها.", tags: ["ChromaDB", "FastAPI", "Python"] },
      { icon: "web", title: "تطبيقات ويب Full-stack", text: "واجهات React وNext.js فوق Backend بـNode، مع تسجيل دخول وتحديث لحظي وقاعدة بيانات حقيقية.", tags: ["Next.js", "Node.js", "Supabase"] },
      { icon: "desktop", title: "تطبيقات Desktop تعمل Offline", text: "تطبيقات Electron على SQLite محلية تعمل بدون إنترنت وتزامن لاحقًا.", tags: ["Electron", "SQLite", "Prisma"] },
      { icon: "shield", title: "الأمان والاختبارات", text: "تشفير من التصميم، ثم اختبارات End-to-end وCI ليبقى كل شيء يعمل.", tags: ["AES-256-GCM", "Playwright", "GitHub Actions"] },
      { icon: "iot", title: "IoT والأتمتة", text: "أجهزة ESP32 وArduino عبر MQTT، متصلة بالتطبيقات ولوحات التحكم.", tags: ["ESP32", "MQTT", "Arduino"] },
    ],
  },
  videos: { title: "أحدث فيديوهات Wasla Tech", sub: "دروس جديدة من القناة، تظهر هنا تلقائيًا.", views: "مشاهدة", all: "كل الفيديوهات" },
  form: {
    title: "أرسل رسالة",
    name: "الاسم",
    email: "بريدك الإلكتروني",
    subject: "الموضوع",
    message: "الرسالة",
    namePh: "اسمك",
    emailPh: "you@example.com",
    subjectPh: "تدريب، مشروع عمل حر…",
    messagePh: "احكِ لي عن الفكرة والموعد والميزانية.",
    viaEmail: "أرسل بالبريد",
    viaWhatsapp: "أرسل على واتساب",
    note: "يفتح تطبيق البريد أو واتساب والرسالة جاهزة. لا يُخزَّن أي شيء على هذا الموقع.",
    required: "من فضلك اكتب اسمك ورسالتك.",
    greeting: "مرحبًا أحمد،",
  },
  theme: { dark: "التبديل إلى الوضع الليلي", light: "التبديل إلى الوضع النهاري" },
  intro: { skip: "تخطَّ المقدمة", label: "أحمد عيد — ALF" },
  contact: {
    label: "تواصل",
    titleA: "لديك فكرة تحتاج إلى ذكاء اصطناعي و",
    titleKey: "هندسة",
    titleB: "؟",
    sub: "تدريب، أو عمل حر، أو فريق يسلّم عملًا حقيقيًا — البريد الإلكتروني أسرع طريقة للتواصل معي.",
    emailLabel: "راسلني بالبريد",
    whatsapp: "واتساب",
    cv: "تحميل الـCV",
    socials: "تجدني أيضًا على",
    copy: "انسخ البريد",
    copied: "تم النسخ",
  },
  footer: { line: "أحمد عيد (ALF) · الإسكندرية، مصر", built: "تصميم وتنفيذ بـNext.js وthree.js وGSAP", top: "للأعلى" },
  a11y: { opensNew: "(يفتح في تبويب جديد)", menu: "افتح القائمة", close: "أغلق القائمة" },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ar };
