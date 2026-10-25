import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Download,
  Link2,
  Lock,
  Mail,
  Mic,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { LINKS, type Dictionary, type Project } from "@/content/site";
import ContactForm from "./ContactForm";
import CopyEmail from "./CopyEmail";
import Header from "./Header";
import Motion from "./Motion";
import PortraitFX from "./PortraitFX";
import RibbonStage from "./RibbonStage";
import Services from "./Services";
import TechMarquee from "./TechMarquee";
import { FacebookIcon, GithubIcon, LinkedinIcon, TelegramIcon, WhatsappIcon, YoutubeIcon } from "./Icons";

function Ext({ href, children, className, newTab }: { href: string; children: React.ReactNode; className?: string; newTab: string }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> {newTab}</span>
    </a>
  );
}

function Wave() {
  const bars = [28, 52, 80, 46, 92, 64, 36, 72, 100, 58, 30, 66, 88, 42, 24];
  return (
    <div className="wave" aria-hidden="true">
      {bars.map((h, i) => (
        <i key={i} style={{ ["--h" as string]: h, ["--d" as string]: i }} />
      ))}
    </div>
  );
}

function ProjectVisual({ p, ar }: { p: Project; ar: boolean }) {
  if (p.visual === "rafiq") {
    return (
      <div className="diagram" aria-hidden="true">
        <Wave />
        <div className="flowchips">
          <span className="chip">
            <Mic size={14} style={{ marginInlineEnd: 6 }} />
            Whisper STT
          </span>
          <ArrowRight size={16} />
          <span className="chip">Local LLM + RAG</span>
          <ArrowRight size={16} />
          <span className="chip">TTS</span>
        </div>
        <div className="diagram__row">
          <div className="node">
            <b>Desktop GUI</b>
            <small>Electron · React</small>
          </div>
          <div className="wire" />
          <div className="node node--accent">
            <b>Backend</b>
            <small>Fastify · SSE · SQLite</small>
          </div>
          <div className="wire" />
          <div className="node">
            <b>AI service</b>
            <small>FastAPI · Ollama</small>
          </div>
        </div>
        <p className="diagram__note">offline-first · cloud fallback · async Supabase sync</p>
      </div>
    );
  }
  if (p.visual === "batu") {
    return (
      <div className="diagram" aria-hidden="true">
        <div className="diagram__row">
          <div className="node">
            <b>{ar ? "طالب" : "Student"}</b>
            <small>web app</small>
          </div>
          <div className="wire" />
          <div className="node node--accent">
            <span className="lock">
              <Lock size={15} />
            </span>
            <b>BATU Connect</b>
            <small>AES-256-GCM</small>
          </div>
          <div className="wire" />
          <div className="node">
            <b>{ar ? "محاضر" : "Lecturer"}</b>
            <small>WhatsApp</small>
          </div>
        </div>
        <div className="diagram__hidden">
          <ShieldCheck size={16} color="#2952cc" />
          <span>{ar ? "رقم المحاضر:" : "Lecturer’s number:"}</span>
          <s>+20 ••• ••• ••••</s>
        </div>
        <p className="diagram__note">Socket.IO · live replies · Jest</p>
      </div>
    );
  }
  if (p.visual === "kataby") {
    return (
      <div className="letter" aria-hidden="true">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="letter__seal">
            <Lock size={22} />
          </span>
          <span className="chip">server-side encrypted</span>
        </div>
        <div className="letter__lines">
          <i style={{ width: "92%" }} />
          <i style={{ width: "78%" }} />
          <i style={{ width: "86%" }} />
          <i style={{ width: "54%" }} />
        </div>
        <div className="letter__link">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Link2 size={15} /> unique share link
          </span>
          <span>audit log ✓</span>
        </div>
      </div>
    );
  }
  return (
    <div className="visual-stack">
      <div className="frame">
        <div className="frame__bar">
          <i />
          <i />
          <i />
          <span className="frame__url">elahmed.vercel.app</span>
        </div>
        <Image
          src="/projects/elahmed-desktop.webp"
          alt={ar ? "شاشة تسجيل الدخول في Elahmed Retail Suite" : "Elahmed Retail Suite sign-in screen (Arabic interface)"}
          width={1440}
          height={900}
          sizes="(min-width: 960px) 46vw, 92vw"
        />
      </div>
      <div className="phone">
        <Image src="/projects/elahmed-mobile.webp" alt="" width={780} height={1688} sizes="(min-width: 960px) 11vw, 22vw" />
      </div>
    </div>
  );
}

export default function Portfolio({ d }: { d: Dictionary }) {
  const ar = d.locale === "ar";
  const nt = d.a11y.opensNew;
  const words = d.manifesto.text.split(" ");

  return (
    <>
      <a className="skip-link" href="#main">
        {d.skip}
      </a>
      <div className="intro" aria-hidden="true">
        <div className="container-x intro__bar">
          <span className="intro__label">{d.intro.label}</span>
          <span className="intro__pct">
            <span data-intro-pct>00</span>%
          </span>
        </div>
      </div>
      <button type="button" className="intro__skip" data-intro-skip>
        {d.intro.skip}
      </button>
      <Header nav={d.nav} langSwitch={d.langSwitch} talk={d.talk} a11y={d.a11y} locale={d.locale} theme={d.theme} />
      <RibbonStage dir={d.dir} />
      <Motion />

      <main id="main">
        {/* ── Hero ── */}
        <section id="hero" className="hero" aria-labelledby="hero-title">
          <div className="hero__glow" />
          <div className="hero__dots" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ribbon-fallback" src="/brand/alf-logo-800.webp" alt="" width={800} height={449} />
          <div className="container-x hero__inner">
            <div className="hero__content">
              <div className="hero__top" data-hero="top">
                <span className="hero__eyebrow">{d.hero.eyebrow}</span>
                <span className="pill">
                  <span className="dot" aria-hidden="true" />
                  {d.hero.pill}
                </span>
              </div>
              <h1 id="hero-title" className="hero__title">
                <span className="line-mask">
                  <span>{d.hero.titleA}</span>
                </span>
                <span className="line-mask">
                  <span>
                    {d.hero.titleB}
                    <span className="key">{d.hero.titleKey}</span>
                    {d.hero.titleC}
                  </span>
                </span>
              </h1>
              <p className="hero__sub" data-hero="rest">
                {d.hero.sub}
              </p>
              <div className="hero__ctas" data-hero="rest">
                <a className="btn" href="#work">
                  {d.hero.ctaPrimary}
                  <ArrowDown aria-hidden="true" />
                </a>
                <a className="btn btn-ghost" href="#contact">
                  {d.hero.ctaSecondary}
                </a>
              </div>
              <ul className="hero__facts" data-hero="rest">
                {d.hero.facts.map((f, i) => (
                  <li key={f}>
                    <span className="n">0{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hero__scroll" aria-hidden="true" data-hero="rest">
            {d.hero.scroll}
            <i />
          </div>
        </section>

        {/* ── Manifesto ── */}
        <section id="manifesto" className="manifesto" aria-labelledby="manifesto-label">
          <div className="container-x">
            <span id="manifesto-label" className="label">
              {d.manifesto.label}
            </span>
            <p className="manifesto__text">
              {words.map((w, i) => (
                <span key={i} className="mw">
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="about" aria-labelledby="about-title">
          <div className="container-x about__grid">
            <div className="about__photo">
              <PortraitFX src="/about/ahmed.webp" alt={d.about.photoAlt} width={573} height={716} />
            </div>
            <div className="about__body">
              <span className="label">{d.about.label}</span>
              <h2 id="about-title" className="h2" data-reveal>
                {d.about.title}
              </h2>
              <p className="about__role" data-reveal>
                {d.about.role}
              </p>
              {d.about.paragraphs.map((t) => (
                <p key={t.slice(0, 24)} className="about__text" data-reveal>
                  {t}
                </p>
              ))}
              <ul className="stats" data-reveal>
                {d.about.stats.map((st) => (
                  <li key={st.label}>
                    <b data-suffix={st.suffix ?? ""}>
                      <span data-count={st.value}>{st.value}</span>
                    </b>
                    <span>{st.label}</span>
                  </li>
                ))}
              </ul>
              <div className="about__links" data-reveal>
                <p>{d.about.linksLabel}</p>
                <ul>
                  <li>
                    <a className="lbtn lbtn--cv" href={LINKS.cv} download>
                      <Download size={16} aria-hidden="true" />
                      CV
                    </a>
                  </li>
                  {[
                    { href: LINKS.github, label: "GitHub", Icon: GithubIcon },
                    { href: LINKS.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                    { href: LINKS.youtube, label: "YouTube", Icon: YoutubeIcon },
                    { href: LINKS.whatsapp, label: "WhatsApp", Icon: WhatsappIcon },
                    { href: LINKS.telegram, label: "Telegram", Icon: TelegramIcon },
                    { href: LINKS.facebook, label: "Facebook", Icon: FacebookIcon },
                  ].map(({ href, label, Icon }) => (
                    <li key={label}>
                      <Ext href={href} className="lbtn" newTab={nt}>
                        <Icon size={16} />
                        {label}
                      </Ext>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section id="services" className="services" aria-labelledby="services-title">
          <div className="container-x">
            <div className="services__head">
              <div>
                <span className="label">{d.services.label}</span>
                <h2 id="services-title" className="h2" data-reveal>
                  {d.services.title}
                </h2>
              </div>
              <p className="lead services__intro" data-reveal>
                {d.services.intro}
              </p>
            </div>
            <Services s={d.services} dir={d.dir} />
          </div>
        </section>

        {/* ── Process ── */}
        <section id="process" className="process" aria-labelledby="process-title">
          <div className="process__pin">
            <div className="container-x">
              <div className="process__head">
                <div>
                  <span className="label">{d.process.label}</span>
                  <h2 id="process-title" className="h2">
                    {d.process.title}
                  </h2>
                </div>
                <p className="lead">{d.process.intro}</p>
              </div>
              <ol className="steps">
                <li className="steps__line" aria-hidden="true">
                  <i />
                </li>
                {d.process.steps.map((s) => (
                  <li key={s.term} className="step">
                    <span className="step__num">{s.index}</span>
                    <span className="step__term">{s.term}</span>
                    <span className="step__meaning">{s.meaning}</span>
                    {s.evidence && <p className="step__evidence">{s.evidence}</p>}
                    {s.link && (
                      <Ext href={s.link.href} className="step__link" newTab={nt}>
                        <GithubIcon size={14} />
                        {s.link.label}
                      </Ext>
                    )}
                  </li>
                ))}
              </ol>
              <p className="loop">
                <RotateCcw size={18} aria-hidden="true" />
                {d.process.loop}
              </p>
            </div>
          </div>
        </section>

        {/* ── Work ── */}
        <section id="work" className="work" aria-labelledby="work-title">
          <div className="container-x">
            <div className="work__head">
              <div>
                <span className="label">{d.work.label}</span>
                <h2 id="work-title" className="h2" data-reveal>
                  {d.work.title}
                </h2>
              </div>
              <p className="lead" data-reveal>
                {d.work.intro}
              </p>
            </div>
            <div className="projects" data-stack="true">
              {d.work.projects.map((p, i) => (
                <article key={p.id} id={`project-${p.id}`} className="project" style={{ ["--i" as string]: i }} aria-labelledby={`p-${p.id}`}>
                  <div className="project__info">
                    <div className="project__meta">
                      <span className="project__index">{p.index} / 04</span>
                      <span>{p.role.split("·")[0].trim()}</span>
                    </div>
                    <h3 id={`p-${p.id}`} className="project__name">
                      <span className="en">{p.name}</span>
                      {p.alias && <span className="project__alias">{p.alias}</span>}
                    </h3>
                    <p className="project__tagline">{p.tagline}</p>
                    <p className="project__summary">{p.summary}</p>
                    <ul className="project__points">
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    <p className="project__role">
                      <b>{d.work.roleLabel}</b>
                      {p.role}
                    </p>
                    <ul className="project__stack" aria-label={d.work.stackLabel}>
                      {p.stack.map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="project__links">
                      {p.links.map((l) => (
                        <Ext key={l.href} href={l.href} className={l.kind === "live" ? "btn btn-sm" : "btn btn-sm btn-ghost"} newTab={nt}>
                          {l.kind === "code" ? <GithubIcon size={16} /> : null}
                          {l.label}
                          <ArrowUpRight className="arrow" aria-hidden="true" />
                        </Ext>
                      ))}
                    </div>
                  </div>
                  <div className="project__visual">
                    <ProjectVisual p={p} ar={ar} />
                  </div>
                </article>
              ))}
            </div>

            <div className="more">
              <h3 className="more__title" data-reveal>
                {d.work.moreTitle}
              </h3>
              <ul className="more__grid">
                {d.work.more.map((m) => (
                  <li key={m.name} className="more__item" data-reveal>
                    <b>{m.name}</b>
                    <span>{m.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── RAFIQ case study ── */}
        <section id="rafiq" className="rafiq on-dark" aria-labelledby="rafiq-title">
          <div className="rafiq__glow" />
          <div className="rafiq__grid-bg" />
          <div className="container-x">
            <span className="label">{d.rafiq.label}</span>
            <h2 id="rafiq-title" className="h2" data-reveal>
              {d.rafiq.title}
            </h2>
            <p className="lead" style={{ marginTop: 18 }} data-reveal>
              {d.rafiq.sub}
            </p>
            <p className="rafiq__role" data-reveal>
              <i aria-hidden="true" />
              {d.rafiq.role}
            </p>

            <dl className="rafiq__facts" data-reveal>
              {d.rafiq.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="arch">
              <div className="arch__rule" data-reveal>
                <span>{d.rafiq.rule}</span>
                <strong>{d.rafiq.never}</strong>
              </div>
              <div className="arch__layers">
                <div className="arch__never" aria-hidden="true">
                  <b>✕</b>
                </div>
                {d.rafiq.layers.map((l, i) => (
                  <div key={l.title} className={`arch__layer${i === 1 ? " arch__layer--core" : ""}`} data-reveal>
                    <h3>{l.title}</h3>
                    <div className="chips">
                      {l.items.map((it) => (
                        <span key={it} className="chip">
                          {it}
                        </span>
                      ))}
                    </div>
                    {i < 2 && <span className="arch__link" aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <div className="arch__side">
                {d.rafiq.side.map((l) => (
                  <div key={l.title} className="arch__layer" data-reveal>
                    <h3>{l.title}</h3>
                    <div className="chips">
                      {l.items.map((it) => (
                        <span key={it} className="chip">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pipeline">
              <p className="pipeline__label">{d.rafiq.pipelineLabel}</p>
              <ol className="pipeline__track">
                {d.rafiq.pipeline.map((s, i) => (
                  <li key={s} style={{ display: "contents" }}>
                    <span className="pipeline__step" data-reveal>
                      <em>0{i + 1}</em>
                      {s}
                    </span>
                    {i < d.rafiq.pipeline.length - 1 && <ArrowRight className="pipeline__arrow" size={18} aria-hidden="true" />}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rafiq__verify">
              <p>
                <i aria-hidden="true">
                  <BadgeCheck size={14} />
                </i>
                {d.rafiq.verify}
              </p>
              <Ext href={LINKS.repos.rafiq} className="btn btn-outline-light" newTab={nt}>
                <GithubIcon size={18} />
                {d.rafiq.cta}
                <ArrowUpRight className="arrow" aria-hidden="true" />
              </Ext>
            </div>
          </div>
        </section>

        {/* ── Wasla ── */}
        <section id="wasla" className="wasla on-blue" aria-labelledby="wasla-title">
          <div className="wasla__sun" aria-hidden="true" />
          <div className="wasla__ring" aria-hidden="true" />
          <div className="container-x">
            <span className="label">{d.wasla.label}</span>
            <h2 id="wasla-title" className="wasla__title">
              <span>{d.wasla.title}</span>
            </h2>
            <div className="wasla__grid">
              <div data-reveal>
                <span className="wasla__role">{d.wasla.role}</span>
                <p className="wasla__text">{d.wasla.text}</p>
                <Ext href={LINKS.youtube} className="btn btn-white wasla__cta" newTab={nt}>
                  <YoutubeIcon size={18} />
                  {d.wasla.cta}
                  <ArrowUpRight className="arrow" aria-hidden="true" />
                </Ext>
              </div>
              <ul className="wasla__points" data-reveal>
                {d.wasla.points.map((pt, i) => (
                  <li key={pt}>
                    <span>0{i + 1}</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              {[0, 1].map((k) => (
                <div key={k} className="marquee__group">
                  {[...d.wasla.marquee, ...d.wasla.marquee].map((m, i) => (
                    <span key={`${k}-${i}`}>{m}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Journey ── */}
        <section id="journey" className="journey" aria-labelledby="journey-title">
          <div className="container-x journey__grid">
            <div className="journey__head">
              <span className="label">{d.journey.label}</span>
              <h2 id="journey-title" className="h2" data-reveal>
                {d.journey.title}
              </h2>
            </div>
            <ol className="timeline">
              {d.journey.items.map((it) => (
                <li key={it.title + it.when} className="tl" data-reveal>
                  <div className="tl__when">
                    <span>{it.when}</span>
                    {it.current && <span className="tl__now">{d.journey.nowLabel}</span>}
                  </div>
                  <div className="tl__body">
                    <h3 className="tl__title">{it.title}</h3>
                    <p className="tl__org">{it.org}</p>
                    <p className="tl__note">{it.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Stack ── */}
        <section id="stack" className="stack" aria-labelledby="stack-title">
          <div className="container-x">
            <span className="label">{d.stack.label}</span>
            <h2 id="stack-title" className="h2" data-reveal>
              {d.stack.title}
            </h2>
          </div>
          <TechMarquee label={d.stack.marqueeLabel} />
          <div className="container-x">
            <div className="stack__groups">
              {d.stack.groups.map((g, i) => (
                <div key={g.title} className={`sg${i === 0 ? " sg--ai" : ""}`} data-reveal>
                  <h3>
                    <i aria-hidden="true" />
                    {g.title}
                  </h3>
                  <ul className="chips">
                    {g.items.map((it) => (
                      <li key={it} className="chip">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="certs">
              <h3 data-reveal>{d.stack.certsTitle}</h3>
              <ul>
                {d.stack.certs.map((c) => (
                  <li key={c} data-reveal>
                    <BadgeCheck size={18} aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="contact" aria-labelledby="contact-title">
          <div className="container-x contact__grid">
            <div className="contact__content">
              <span className="label">{d.contact.label}</span>
              <h2 id="contact-title" className="contact__title">
                {d.contact.titleA}
                <span className="key">{d.contact.titleKey}</span>
                {d.contact.titleB}
              </h2>
              <p className="lead contact__sub">{d.contact.sub}</p>
              <div className="contact__email">
                <a className="email-big" href={`mailto:${LINKS.email}`} aria-label={`${d.contact.emailLabel}: ${LINKS.email}`}>
                  {LINKS.email}
                </a>
                <CopyEmail email={LINKS.email} copy={d.contact.copy} copied={d.contact.copied} />
              </div>
              <div className="contact__ctas">
                <a className="btn" href={`mailto:${LINKS.email}`}>
                  <Mail aria-hidden="true" />
                  {d.contact.emailLabel}
                </a>
                <Ext href={LINKS.whatsapp} className="btn btn-wa" newTab={nt}>
                  <WhatsappIcon size={18} />
                  {d.contact.whatsapp}
                </Ext>
                <a className="btn btn-ghost" href={LINKS.cv} download>
                  <Download aria-hidden="true" />
                  {d.contact.cv}
                </a>
              </div>
              <div className="socials">
                <p>{d.contact.socials}</p>
                <ul>
                  {[
                    { href: LINKS.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                    { href: LINKS.github, label: "GitHub", Icon: GithubIcon },
                    { href: LINKS.youtube, label: "YouTube — Wasla Tech", Icon: YoutubeIcon },
                    { href: LINKS.telegram, label: "Telegram", Icon: TelegramIcon },
                    { href: LINKS.facebook, label: "Facebook", Icon: FacebookIcon },
                  ].map(({ href, label, Icon }) => (
                    <li key={href}>
                      <a className="social" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${nt}`}>
                        <Icon />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ContactForm f={d.form} email={LINKS.email} whatsapp={LINKS.whatsapp} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container-x site-footer__inner">
          <span>
            © 2026 {d.footer.line}
          </span>
          <span>{d.footer.built}</span>
          <a href="#main">{d.footer.top} ↑</a>
        </div>
      </footer>
    </>
  );
}
