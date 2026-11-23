"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Simulación de las dos piezas del POC con datos de ejemplo. Las dos llenan el mismo registro:
   la llamada se reproduce sola (Pieza 2) y el WhatsApp se recorre con clics (Pieza 1). */

type FieldKey = "paciente" | "nacimiento" | "poliza" | "motivo";
type FSt = "empty" | "extracted" | "error" | "fixed" | "valid";
type By = "Modelo de voz" | "LLM económico" | "LLM potente" | "Regla";
type Field = { v?: string; st: FSt; by?: By; note?: string };
type Fields = Record<FieldKey, Field>;
type Done = null | "saved" | "handoff";
type Ch = "llamada" | "whatsapp";

const FIELDS: { k: FieldKey; label: string }[] = [
  { k: "paciente", label: "Paciente" },
  { k: "nacimiento", label: "Fecha de nacimiento" },
  { k: "poliza", label: "Aseguradora y póliza" },
  { k: "motivo", label: "Motivo" },
];
const EMPTY = (): Fields => ({ paciente: { st: "empty" }, nacimiento: { st: "empty" }, poliza: { st: "empty" }, motivo: { st: "empty" } });
const ICON: Record<FSt, string> = { empty: "", extracted: "IA", error: "!", fixed: "↺", valid: "✓" };
const ST_LABEL: Record<FSt, string> = { empty: "Pendiente", extracted: "Extraído", error: "No pasa la regla", fixed: "Corregido", valid: "Validado" };

/* Pieza 2: llamada */
const STEPS = [
  { k: "voz", t: "Transcribe", by: "Modelo de voz" },
  { k: "eco", t: "Extrae", by: "LLM económico" },
  { k: "regla", t: "Valida", by: "Regla" },
  { k: "pot", t: "Corrige", by: "LLM potente" },
  { k: "persona", t: "Confirma", by: "Persona" },
];
type Line = { who: "op" | "pac"; text: string };
type Beat = { step: number; line?: Line; set?: Partial<Fields>; wait?: number };
const POL = "Aseguradora del Valle · AV-4471-2093";
const CALL: Beat[] = [
  { step: 0, line: { who: "op", text: "Clínica, buenos días. ¿Con quién tengo el gusto?" } },
  { step: 0, line: { who: "pac", text: "Soy Mariana López. Quiero agendar una consulta de nutrición." } },
  {
    step: 1,
    set: {
      paciente: { v: "Mariana López", st: "extracted", by: "LLM económico" },
      motivo: { v: "Agendar · Nutrición", st: "extracted", by: "LLM económico" },
    },
  },
  { step: 0, line: { who: "op", text: "Con gusto. ¿Me da su fecha de nacimiento y su aseguradora?" } },
  { step: 0, line: { who: "pac", text: "Doce de marzo del ochenta y nueve. Aseguradora del Valle, póliza cuatro cuatro siete uno, dos cero nueve tres." } },
  {
    step: 1,
    set: {
      nacimiento: { v: "12/03/1989", st: "extracted", by: "LLM económico" },
      poliza: { v: "Aseguradora del Valle · 4471-2093", st: "extracted", by: "LLM económico" },
    },
  },
  {
    step: 2,
    wait: 1700,
    set: {
      paciente: { v: "Mariana López", st: "valid", by: "Regla", note: "Ya existe en la HCE" },
      nacimiento: { v: "12/03/1989", st: "valid", by: "Regla", note: "Coincide con el expediente" },
      motivo: { v: "Agendar · Nutrición", st: "valid", by: "Regla", note: "Motivo del catálogo" },
      poliza: { v: "Aseguradora del Valle · 4471-2093", st: "error", by: "Regla", note: "Falta el prefijo AV-" },
    },
  },
  { step: 3, wait: 1500, set: { poliza: { v: POL, st: "fixed", by: "LLM potente", note: "Releyó la llamada con el catálogo" } } },
  { step: 2, set: { poliza: { v: POL, st: "valid", by: "Regla", note: "Válida tras la corrección" } } },
  { step: 4 },
];

/* Pieza 1: WhatsApp */
type Opt = { label: string; next: string; now?: Partial<Fields>; later?: Partial<Fields>; photo?: boolean };
type WNode = { bot: string; opts?: Opt[]; end?: Done };
const MENU = (v: string): Partial<Fields> => ({ motivo: { v, st: "valid", by: "Regla", note: "Opción del menú, sin modelo" } });
const W: Record<string, WNode> = {
  start: {
    bot: "Hola, soy el asistente de la clínica. ¿Qué necesitas hoy?",
    opts: [
      { label: "Agendar una cita", next: "esp" },
      { label: "Actualizar mi seguro", next: "datos", now: MENU("Actualizar seguro") },
      { label: "Hablar con una persona", next: "humano" },
    ],
  },
  esp: {
    bot: "¿Para qué especialidad?",
    opts: ["Medicina general", "Nutrición", "Dermatología"].map((e) => ({ label: e, next: "datos", now: MENU(`Agendar · ${e}`) })),
  },
  datos: {
    bot: "¿Ya eres paciente? Escribe tu nombre y fecha de nacimiento.",
    opts: [
      {
        label: "Mariana López, 12/03/1989",
        next: "foto",
        now: {
          paciente: { v: "Mariana López", st: "extracted", by: "LLM económico" },
          nacimiento: { v: "12/03/1989", st: "extracted", by: "LLM económico" },
        },
        later: {
          paciente: { v: "Mariana López", st: "valid", by: "Regla", note: "Ya existe en la HCE" },
          nacimiento: { v: "12/03/1989", st: "valid", by: "Regla", note: "Coincide con el expediente" },
        },
      },
    ],
  },
  foto: {
    bot: "Gracias. Manda una foto de tu credencial del seguro.",
    opts: [
      {
        label: "Enviar foto de la credencial",
        next: "fin",
        photo: true,
        now: { poliza: { v: POL, st: "extracted", by: "LLM económico" } },
        later: { poliza: { v: POL, st: "valid", by: "Regla", note: "Válida en el catálogo" } },
      },
    ],
  },
  fin: { bot: "", end: "saved" },
  humano: { bot: "Te paso con una operadora. Verá todo lo que ya escribiste.", end: "handoff" },
};

type Msg = { who: "bot" | "user"; text: string; photo?: boolean; time: string };

const MOVES: Record<Ch, { n: number; t: string }[]> = {
  llamada: [
    { n: 2, t: "1 error atrapado antes de guardar" },
    { n: 4, t: "1 sola captura (hoy: 2)" },
  ],
  whatsapp: [
    { n: 1, t: "Sin esperar a una operadora" },
    { n: 4, t: "1 sola captura" },
  ],
};

const STATUS: Record<string, string> = {
  draft: "Borrador",
  capturing: "Capturando",
  validating: "Validando",
  ready: "Listo para confirmar",
  saved: "Guardado en la HCE",
  handoff: "Con una operadora",
};

const clock = (i: number) => `9:${String(41 + i).padStart(2, "0")}`;

export default function Demo() {
  const [ch, setCh] = useState<Ch>("llamada");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [lines, setLines] = useState<Line[]>([]);
  const [step, setStep] = useState(-1);
  const [awaiting, setAwaiting] = useState(false);
  const [done, setDone] = useState<Done>(null);
  const [chat, setChat] = useState<Msg[]>([]);
  const [node, setNode] = useState("start");
  const [typing, setTyping] = useState(false);
  const [secs, setSecs] = useState(0);
  const [live, setLive] = useState(false);
  const timers = useRef<number[]>([]);
  const box = useRef<HTMLDivElement | null>(null);
  const feed = useRef<HTMLDivElement | null>(null);
  const seen = useRef(false);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const reset = useCallback(() => {
    clear();
    setFields(EMPTY());
    setLines([]);
    setStep(-1);
    setAwaiting(false);
    setDone(null);
    setChat([]);
    setNode("start");
    setTyping(false);
    setSecs(0);
    setLive(false);
  }, []);

  const playCall = useCallback(() => {
    reset();
    setLive(true);
    let t = 500;
    CALL.forEach((b, i) => {
      later(() => {
        if (b.line) setLines((l) => [...l, b.line!]);
        if (b.set) setFields((f) => ({ ...f, ...b.set }));
        setStep(b.step);
        if (i === CALL.length - 1) {
          setAwaiting(true);
          setLive(false);
        }
      }, t);
      t += b.wait ?? (b.line ? 1600 : 1000);
    });
  }, [reset]);

  const botSays = (text: string, then?: () => void, delay = 900) => {
    setTyping(true);
    later(() => {
      setTyping(false);
      setChat((c) => [...c, { who: "bot", text, time: clock(c.length) }]);
      then?.();
    }, delay);
  };

  const startChat = useCallback(() => {
    reset();
    later(() => botSays(W.start.bot), 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [live]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen.current) {
          seen.current = true;
          playCall();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [playCall]);

  useEffect(() => {
    const f = feed.current;
    if (f) f.scrollTo({ top: f.scrollHeight, behavior: "smooth" });
  }, [lines, chat, typing]);

  const switchTo = (c: Ch) => {
    if (c === ch) return;
    setCh(c);
    if (c === "llamada") playCall();
    else startChat();
  };

  const confirm = () => {
    setAwaiting(false);
    setStep(5);
    setDone("saved");
  };

  const choose = (o: Opt) => {
    if (typing) return;
    setChat((c) => [...c, { who: "user", text: o.label, photo: o.photo, time: clock(c.length) }]);
    if (o.now) setFields((f) => ({ ...f, ...o.now }));
    if (o.later) later(() => setFields((f) => ({ ...f, ...o.later })), 900);
    const nx = W[o.next];
    const motivo = o.now?.motivo?.v ?? fields.motivo.v ?? "";
    const text =
      o.next === "fin"
        ? motivo.startsWith("Actualizar")
          ? "Listo, tu seguro quedó actualizado en tu expediente."
          : "Listo, tu solicitud quedó registrada. Una operadora te confirma el horario por aquí."
        : nx.bot;
    later(
      () =>
        botSays(text, () => {
          setNode(o.next);
          if (nx.end) setDone(nx.end);
        }),
      o.later ? 700 : 300,
    );
  };

  const vals = Object.values(fields);
  const status = done
    ? done
    : awaiting
      ? "ready"
      : step === 2 || step === 3 || vals.some((v) => v.st === "error" || v.st === "fixed")
        ? "validating"
        : vals.some((v) => v.st !== "empty")
          ? "capturing"
          : "draft";
  const opts = !done && !typing && chat.length > 0 && chat[chat.length - 1].who === "bot" ? W[node]?.opts : undefined;
  const moves = done === "handoff" ? [{ n: 1, t: "Pasa a una persona con contexto" }] : done ? MOVES[ch] : [];
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div className="demo" ref={box}>
      <div className="demo-top">
        <div className="seg" role="tablist" aria-label="Canal de la demo">
          <button role="tab" aria-selected={ch === "llamada"} onClick={() => switchTo("llamada")}>
            Llamada <span>Pieza 2</span>
          </button>
          <button role="tab" aria-selected={ch === "whatsapp"} onClick={() => switchTo("whatsapp")}>
            WhatsApp <span>Pieza 1</span>
          </button>
        </div>
        <button className="icon-btn" onClick={() => (ch === "llamada" ? playCall() : startChat())} aria-label="Reiniciar la demo" title="Reiniciar">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path d="M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3.5h-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="demo-body">
        {ch === "llamada" ? (
          <div className="win">
            <div className="win-head">
              <i className={`live${live ? "" : " off"}`} aria-hidden="true" />
              <strong>{live ? "Llamada en curso" : "Llamada terminada"}</strong>
              <span className="timer">{mm}:{ss}</span>
              <span className="tag">Tomador de notas</span>
            </div>
            <ol className="stepper" aria-label="Pasos del tomador de notas">
              {STEPS.map((p, i) => (
                <li key={p.k} className={`k-${p.k}${step === i ? " on" : ""}${step > i ? " past" : ""}`}>
                  <i aria-hidden="true" />
                  <span>{p.t}</span>
                  <em>{p.by}</em>
                </li>
              ))}
            </ol>
            <div className="tx" ref={feed} aria-live="polite">
              {lines.map((l, i) => (
                <div key={i} className="tx-row">
                  <span className={`av ${l.who}`} aria-hidden="true">{l.who === "op" ? "OP" : "ML"}</span>
                  <p className="tx-b">
                    <span>{l.who === "op" ? "Operadora" : "Paciente"}</span>
                    {l.text}
                  </p>
                </div>
              ))}
            </div>
            <div className={`wave${live ? "" : " off"}`} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <span>{live ? "Escuchando y transcribiendo" : "Transcripción completa"}</span>
            </div>
          </div>
        ) : (
          <div className="win phone">
            <div className="win-head">
              <span className="ph-av" aria-hidden="true">C</span>
              <span className="ph-id">
                <strong>Clínica</strong>
                <span>{typing ? "escribiendo…" : "en línea"}</span>
              </span>
              <span className="tag">WhatsApp con menú</span>
            </div>
            <div className="chat" ref={feed} aria-live="polite">
              {chat.map((m, i) => (
                <p key={i} className={`bub ${m.who}`}>
                  {m.photo && <span className="ph-img" aria-hidden="true" />}
                  {m.text}
                  <time>{m.time}</time>
                </p>
              ))}
              {typing && (
                <span className="typing" aria-label="Escribiendo">
                  <i />
                  <i />
                  <i />
                </span>
              )}
              {opts && (
                <div className="qr">
                  {opts.map((o) => (
                    <button key={o.label} onClick={() => choose(o)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="win rec">
          <div className="win-head">
            <strong>Registro del paciente</strong>
            <span className={`pill-st st-${status}`}>{STATUS[status]}</span>
          </div>
          <div className="rec-rows">
            {FIELDS.map((f) => {
              const v = fields[f.k];
              return (
                <div key={f.k} className={`rr s-${v.st}`}>
                  <span className="rr-k">{f.label}</span>
                  <span className="rr-v" key={`${v.v}-${v.st}`}>{v.v ?? "—"}</span>
                  <span className="rr-by">
                    {v.by ? `${v.by}${v.note ? ` · ${v.note}` : ""}` : ST_LABEL[v.st]}
                  </span>
                  <span className="rr-ic" aria-label={ST_LABEL[v.st]}>{ICON[v.st]}</span>
                </div>
              );
            })}
          </div>
          <div className="rec-foot">
            {awaiting && (
              <button className="btn block confirm" onClick={confirm}>
                Confirmar registro
              </button>
            )}
            {done === "saved" && <p className="saved">Guardado una sola vez en la HCE. El médico lo verá listo.</p>}
            {done === "handoff" && <p className="saved">La operadora recibe lo que el paciente ya escribió.</p>}
            {!awaiting && !done && <p className="hint">{ch === "llamada" ? "La operadora solo confirma al final." : "Elige una opción en el chat."}</p>}
            {moves.length > 0 && (
              <ul className="moves" aria-label="Qué problema ataca">
                {moves.map((m) => (
                  <li key={m.t}>
                    <i>{m.n}</i>
                    {m.t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
