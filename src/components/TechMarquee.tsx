import {
  siArduino,
  siClaude,
  siCisco,
  siCursor,
  siDart,
  siDocker,
  siElectron,
  siEspressif,
  siExpress,
  siFastapi,
  siFastify,
  siGit,
  siGithubactions,
  siGithubcopilot,
  siJavascript,
  siJest,
  siMqtt,
  siNextdotjs,
  siNodedotjs,
  siOllama,
  siPrisma,
  siPython,
  siReact,
  siSocketdotio,
  siSqlite,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
} from "simple-icons";

type Icon = { title: string; path: string; hex: string };

const ROW_A: Icon[] = [siPython, siFastapi, siOllama, siClaude, siCursor, siGithubcopilot, siReact, siNextdotjs, siTypescript, siJavascript, siTailwindcss, siVite, siNodedotjs, siExpress, siFastify];
const ROW_B: Icon[] = [siSocketdotio, siElectron, siSupabase, siSqlite, siPrisma, siDocker, siGit, siGithubactions, siVitest, siJest, siVercel, siArduino, siEspressif, siMqtt, siCisco, siDart];

function Row({ icons, reverse }: { icons: Icon[]; reverse?: boolean }) {
  const item = (ic: Icon, k: string, hidden?: boolean) => (
    <li key={k} className="tech__item" style={{ ["--brand" as string]: `#${ic.hex}` }} aria-hidden={hidden || undefined}>
      <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" focusable="false">
        <path d={ic.path} fill="currentColor" />
      </svg>
      <span>{ic.title}</span>
    </li>
  );
  return (
    <div className="tech__row" data-reverse={reverse || undefined}>
      <ul className="tech__lane">
        {icons.map((ic) => item(ic, ic.title))}
        {icons.map((ic) => item(ic, ic.title + "-dup", true))}
      </ul>
    </div>
  );
}

export default function TechMarquee({ label }: { label: string }) {
  return (
    <div className="tech" role="group" aria-label={label} dir="ltr">
      <Row icons={ROW_A} />
      <Row icons={ROW_B} reverse />
    </div>
  );
}
