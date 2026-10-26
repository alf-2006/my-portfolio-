import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Download,
  Mail,
  RotateCcw,
} from "lucide-react";
import { LINKS, type Dictionary } from "@/content/site";
import type { GitHubRepository } from "@/content/github";
import ContactForm from "./ContactForm";
import CopyEmail from "./CopyEmail";
import Header from "./Header";
import Motion from "./Motion";
import PortraitFX from "./PortraitFX";
import RibbonStage from "./RibbonStage";
import Services from "./Services";
import Projects from "./Projects";
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

export default function Portfolio({ d, repositories }: { d: Dictionary; repositories: GitHubRepository[] }) {
  const nt = d.a11y.opensNew;
  const words = d.manifesto.text.split(" ");
  const repositoryLanguages = new Set(repositories.map((repository) => repository.language).filter((language): language is string => Boolean(language))).size;

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
                {d.about.stats.map((st) => {
                  const value =
                    st.source === "github-repositories"
                      ? repositories.length
                      : st.source === "github-languages"
                        ? repositoryLanguages
                        : st.value;
                  return (
                    <li key={st.label}>
                      <b data-suffix={st.suffix ?? ""}>
                        <span data-count={value}>{value}</span>
                      </b>
                      <span>{st.label}</span>
                    </li>
                  );
                })}
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
                    <span className="step__num" aria-hidden="true">{s.index}</span>
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
              <div className="work__identity">
                <Image className="work__logo" src="/brand/alf-logo-800.webp" alt="" width={800} height={449} />
                <div>
                  <span className="label">{d.work.label}</span>
                  <h2 id="work-title" className="h2" data-reveal>
                    {d.work.title}
                  </h2>
                </div>
              </div>
              <div className="work__intro">
                <p className="lead" data-reveal>{d.work.intro}</p>
                <p className="repo-count" aria-live="polite">
                  {d.work.repositoryCount.replace("{count}", String(repositories.length))}
                </p>
              </div>
            </div>
            {repositories.length === 0 ? (
              <p className="repo-empty" role="status">{d.work.unavailable}</p>
            ) : (
              <Projects repositories={repositories} locale={d.locale} labels={d.work} opensNew={nt} />
            )}
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
