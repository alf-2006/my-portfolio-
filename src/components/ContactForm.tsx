"use client";

import { Mail, Send } from "lucide-react";
import { useId, useState } from "react";
import type { Dictionary } from "@/content/site";
import { WhatsappIcon } from "./Icons";

type Props = { f: Dictionary["form"]; email: string; whatsapp: string };

/** No backend: the form composes the message and hands it to the visitor's email app or WhatsApp. */
export default function ContactForm({ f, email, whatsapp }: Props) {
  const id = useId();
  const [error, setError] = useState("");

  const compose = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const from = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !message) {
      setError(f.required);
      (form.elements.namedItem(!name ? "name" : "message") as HTMLElement | null)?.focus();
      return null;
    }
    setError("");
    const body = [f.greeting, "", message, "", `— ${name}${from ? ` · ${from}` : ""}`].join("\n");
    return { subject: subject || `${f.title} — ${name}`, body };
  };

  const send = (form: HTMLFormElement, via: "email" | "whatsapp") => {
    const m = compose(form);
    if (!m) return;
    if (via === "email") {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
    } else {
      const text = `*${m.subject}*\n\n${m.body}`;
      window.open(`${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <form
      className="cform"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        send(e.currentTarget, "email");
      }}
      aria-describedby={`${id}-note`}
    >
      <h3 className="cform__title">{f.title}</h3>
      <div className="cform__row">
        <label className="field">
          <span>{f.name}</span>
          <input name="name" autoComplete="name" placeholder={f.namePh} required />
        </label>
        <label className="field">
          <span>{f.email}</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" placeholder={f.emailPh} dir="ltr" />
        </label>
      </div>
      <label className="field">
        <span>{f.subject}</span>
        <input name="subject" placeholder={f.subjectPh} />
      </label>
      <label className="field">
        <span>{f.message}</span>
        <textarea name="message" rows={5} placeholder={f.messagePh} required />
      </label>
      <p className="cform__error" role="alert" aria-live="polite">
        {error}
      </p>
      <div className="cform__actions">
        <button className="btn" type="submit">
          <Mail aria-hidden="true" />
          {f.viaEmail}
        </button>
        <button className="btn btn-wa" type="button" onClick={(e) => send(e.currentTarget.form!, "whatsapp")}>
          <WhatsappIcon size={18} />
          {f.viaWhatsapp}
          <Send aria-hidden="true" className="flip-rtl" />
        </button>
      </div>
      <p id={`${id}-note`} className="cform__note">
        {f.note}
      </p>
    </form>
  );
}
