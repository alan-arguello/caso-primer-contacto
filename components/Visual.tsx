"use client";

import { Fragment, type CSSProperties, type KeyboardEvent } from "react";

/* Antes vs después como un blueprint de servicio: columnas = las tres entradas (en persona,
   llamada, WhatsApp), filas = etapas. Entrada y captura van por canal; desde el registro el flujo
   es uno solo. A la derecha, el resultado de cada etapa con los problemas numerados del 1 al 5. */

type St = "bad" | "good" | "part" | "same";
type Kind = "regla" | "voz" | "eco" | "pot" | "persona" | "sistema";
type Mini = { k: Kind; t: string };
type Piece = { label: string; title: string; mini?: Mini[]; dest?: string[]; tone: "new" | "prev" | "sys" };
type Cell = { lanes: number[]; text?: string; bad?: boolean; pieces?: Piece[]; empty?: string };
type Row = { label: string; wide?: boolean; cells: Cell[]; status?: { n: number; st: St; t: string } };
type Channel = { name: string; sub: string; tag?: string; off?: boolean };
type Step = { tab: string; tabSub: string; poc?: boolean; head: string; sub: string; channels: Channel[]; rows: Row[]; score: string };

const KIND: Record<Kind, string> = {
  regla: "Regla",
  voz: "Modelo de voz",
  eco: "LLM económico",
  pot: "LLM potente",
  persona: "Persona",
  sistema: "Sistema",
};
const ST: Record<St, string> = { bad: "Problema", good: "Lo ataca", part: "En parte", same: "Sigue igual" };
const LANES = ["En persona", "Llamada", "WhatsApp"];

const PIEZA_1: Piece = {
  label: "Pieza 1",
  title: "WhatsApp con menú",
  tone: "new",
  mini: [
    { k: "regla", t: "Menú con los motivos más frecuentes" },
    { k: "regla", t: "Valida los datos que deja el paciente" },
    { k: "persona", t: "Si no está en el menú, pasa a una operadora" },
  ],
};
const PIEZA_2: Piece = {
  label: "Pieza 2",
  title: "Tomador de notas",
  tone: "new",
  mini: [
    { k: "voz", t: "Transcribe la conversación" },
    { k: "eco", t: "Extrae los campos del registro" },
    { k: "regla", t: "Valida formato, póliza y paciente" },
    { k: "pot", t: "Corrige solo lo que no pasa" },
    { k: "persona", t: "La operadora confirma" },
  ],
};
const HCE: Piece = { label: "Salida", title: "Registro único en la HCE", tone: "sys", mini: [{ k: "sistema", t: "Un solo esquema para los tres canales" }] };
const RPA: Piece = { label: "Salida", title: "Robot de autorizaciones", tone: "sys", mini: [{ k: "sistema", t: "Recibe el registro ya validado" }] };
const prev = (p: Piece): Piece => ({ ...p, label: "De la ruta 1", tone: "prev" });

const STEPS: Step[] = [
  {
    tab: "Así pasa hoy",
    tabSub: "Dos entradas, una sola fila manual",
    head: "Todo paciente entra por la misma fila manual.",
    sub: "Llegue en persona o llame, lo atiende una de las mismas 3 operadoras y su dato termina en una hoja de cálculo.",
    channels: [
      { name: "En persona", sub: "Recepción física" },
      { name: "Llamada", sub: "Call-center" },
      { name: "WhatsApp", sub: "Hoy no existe", off: true },
    ],
    rows: [
      {
        label: "Entrada",
        cells: [
          { lanes: [0], text: "Hace fila en recepción" },
          { lanes: [1], text: "Espera en línea a que una operadora quede libre" },
        ],
        status: { n: 1, st: "bad", t: "7–10 min de espera · 22% abandona" },
      },
      {
        label: "Captura",
        cells: [{ lanes: [0, 1], text: "Una de las 3 operadoras escribe los datos en una hoja de cálculo" }],
        status: { n: 2, st: "bad", t: "Errores de transcripción" },
      },
      { label: "Registro", wide: true, cells: [{ lanes: [0, 1, 2], text: "Hoja de cálculo, fuera de la HCE", bad: true }] },
      {
        label: "Triage",
        wide: true,
        cells: [{ lanes: [0, 1, 2], text: "Enfermería pregunta los síntomas por teléfono, caso por caso" }],
        status: { n: 3, st: "bad", t: "Consultas menores llegan al médico" },
      },
      {
        label: "Consulta",
        wide: true,
        cells: [{ lanes: [0, 1, 2], text: "El médico de guardia vuelve a capturar todo en la HCE" }],
        status: { n: 4, st: "bad", t: "Doble captura en el 65% de los casos" },
      },
      {
        label: "Aseguradora",
        wide: true,
        cells: [{ lanes: [0, 1, 2], text: "Recibe el trámite con los errores de la captura" }],
        status: { n: 5, st: "bad", t: "Devoluciones y reclamos" },
      },
    ],
    score: "5 problemas en el primer contacto",
  },
  {
    tab: "Ruta 1 · Low-hanging fruit",
    tabSub: "Dos piezas, es el POC",
    poc: true,
    head: "Dos piezas que capturan el dato una sola vez, llegue por donde llegue.",
    sub: "La Pieza 2 trabaja en persona y en llamada; la Pieza 1 abre WhatsApp. No cambia el proceso ni las personas.",
    channels: [
      { name: "En persona", sub: "Recepción física" },
      { name: "Llamada", sub: "Call-center" },
      { name: "WhatsApp", sub: "Canal nuevo", tag: "Nuevo" },
    ],
    rows: [
      {
        label: "Entrada",
        cells: [
          { lanes: [0], text: "Lo atiende una operadora, como hoy" },
          { lanes: [1], text: "Lo atiende una operadora, como hoy" },
          { lanes: [2], text: "Elige su trámite sin esperar a nadie" },
        ],
        status: { n: 1, st: "part", t: "Los trámites simples salen de la fila" },
      },
      {
        label: "Captura",
        cells: [
          { lanes: [0, 1], pieces: [PIEZA_2] },
          { lanes: [2], pieces: [PIEZA_1] },
        ],
        status: { n: 2, st: "good", t: "Las reglas validan y una persona confirma" },
      },
      { label: "Registro", wide: true, cells: [{ lanes: [0, 1, 2], pieces: [HCE] }] },
      {
        label: "Triage",
        wide: true,
        cells: [{ lanes: [0, 1, 2], text: "Enfermería, con el motivo ya capturado", empty: "Sin cambios en la ruta 1" }],
        status: { n: 3, st: "same", t: "Consultas menores llegan al médico" },
      },
      {
        label: "Consulta",
        wide: true,
        cells: [{ lanes: [0, 1, 2], text: "El médico abre la consulta con los datos listos" }],
        status: { n: 4, st: "good", t: "Sin recaptura" },
      },
      {
        label: "Aseguradora",
        wide: true,
        cells: [{ lanes: [0, 1, 2], text: "Recibe los datos ya validados", pieces: [RPA] }],
        status: { n: 5, st: "good", t: "Menos devoluciones" },
      },
    ],
    score: "Ataca 3 de 5 · 1 en parte · 1 sigue igual",
  },
  {
    tab: "Ruta 2 · Solución completa",
    tabSub: "Se construye sobre la ruta 1",
    head: "Un agente atiende llamada y WhatsApp, y apoya el triage.",
    sub: "En persona se queda con la Pieza 2. Sale gradual, del 20% al 100% del tráfico.",
    channels: [
      { name: "En persona", sub: "Recepción física" },
      { name: "Llamada", sub: "Call-center" },
      { name: "WhatsApp", sub: "Canal digital" },
    ],
    rows: [
      {
        label: "Entrada",
        cells: [
          { lanes: [0], text: "Lo atiende una operadora, como hoy" },
          { lanes: [1], text: "Contesta un agente de voz, sin fila" },
          { lanes: [2], text: "Contesta un agente de texto, sin fila" },
        ],
        status: { n: 1, st: "good", t: "Llamada y WhatsApp sin fila" },
      },
      {
        label: "Captura",
        cells: [
          { lanes: [0], pieces: [prev(PIEZA_2)] },
          {
            lanes: [1, 2],
            pieces: [
              {
                label: "Nuevo",
                title: "Agente en texto y voz",
                tone: "new",
                mini: [
                  { k: "pot", t: "Conversa y entiende qué necesita" },
                  { k: "eco", t: "Extrae los campos del registro" },
                  { k: "regla", t: "Valida y agenda en tiempo real" },
                  { k: "persona", t: "Escala a una persona si hace falta" },
                ],
              },
            ],
          },
        ],
        status: { n: 2, st: "good", t: "Una sola captura" },
      },
      {
        label: "Registro",
        wide: true,
        cells: [
          {
            lanes: [0, 1, 2],
            pieces: [prev(HCE), { label: "Nuevo", title: "Guardado directo", tone: "new", mini: [{ k: "regla", t: "Lo que ya nadie corrige se guarda solo" }] }],
          },
        ],
      },
      {
        label: "Triage",
        wide: true,
        cells: [
          {
            lanes: [0, 1, 2],
            text: "Enfermería confirma el nivel",
            pieces: [
              {
                label: "Nuevo",
                title: "Triage asistido",
                tone: "new",
                mini: [
                  { k: "pot", t: "Sugiere el nivel con el protocolo del comité" },
                  { k: "persona", t: "Enfermería confirma" },
                ],
              },
            ],
          },
        ],
        status: { n: 3, st: "good", t: "Cada caso al canal correcto" },
      },
      {
        label: "Consulta",
        wide: true,
        cells: [
          {
            lanes: [0, 1, 2],
            text: "El médico solo ve lo complejo",
            pieces: [{ label: "Nuevo", title: "Canal correcto", tone: "new", dest: ["Médico de cabecera < 90 min", "Telemedicina", "Sin sala de espera"] }],
          },
        ],
        status: { n: 4, st: "good", t: "Médico solo para lo complejo" },
      },
      {
        label: "Aseguradora",
        wide: true,
        cells: [{ lanes: [0, 1, 2], text: "Recibe los datos ya validados", pieces: [prev(RPA)] }],
        status: { n: 5, st: "good", t: "Menos devoluciones" },
      },
    ],
    score: "Ataca los 5",
  },
];

function PieceBox({ p, horizontal, delay }: { p: Piece; horizontal: boolean; delay: number }) {
  return (
    <div className={`piece t-${p.tone}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      <span className="piece-label">{p.label}</span>
      <strong className="piece-title">{p.title}</strong>
      {p.mini && (
        <ol className={`mini${horizontal ? " h" : ""}`}>
          {p.mini.map((m) => (
            <li key={m.t} className={`m k-${m.k}`}>
              <em>{KIND[m.k]}</em>
              {m.t}
            </li>
          ))}
        </ol>
      )}
      {p.dest && (
        <ul className="dest">
          {p.dest.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Visual({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const s = STEPS[step];
  const last = s.rows.length - 1;

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") setStep(Math.min(STEPS.length - 1, step + 1));
    if (e.key === "ArrowLeft") setStep(Math.max(0, step - 1));
  };

  return (
    <div className="flow-wrap">
      <div className="tabs" role="tablist" aria-label="Antes y después" onKeyDown={onTabKey}>
        {STEPS.map((t, i) => (
          <button
            key={t.tab}
            role="tab"
            id={`tab-${i}`}
            aria-selected={i === step}
            aria-controls="flow-panel"
            tabIndex={i === step ? 0 : -1}
            className="tab"
            onClick={() => setStep(i)}
          >
            <span className="tab-n">{i + 1}</span>
            <span className="tab-t">
              <strong>{t.tab}</strong>
              <span>{t.tabSub}</span>
            </span>
            {t.poc && <span className="pill">POC</span>}
          </button>
        ))}
      </div>

      <div className="flow" role="tabpanel" id="flow-panel" aria-labelledby={`tab-${step}`} data-step={step}>
        <header className="flow-head" key={`h${step}`}>
          <h3>{s.head}</h3>
          <p>{s.sub}</p>
        </header>

        <div className="bp">
          <div className="bp-h bp-corner" style={{ gridColumn: 1, gridRow: 1 }} />
          {s.channels.map((c, i) => (
            <div key={c.name} className={`bp-h bp-ch${c.off ? " off" : ""}`} style={{ gridColumn: i + 2, gridRow: 1 }}>
              <strong>
                {c.name}
                {c.tag && <b className="new">{c.tag}</b>}
              </strong>
              <span>{c.sub}</span>
            </div>
          ))}
          <div className="bp-h bp-res" style={{ gridColumn: 5, gridRow: 1 }}>Resultado</div>

          {s.rows.map((r, ri) => (
            <Fragment key={r.label}>
              <p className="bp-label" style={{ gridColumn: 1, gridRow: ri + 2 }}>{r.label}</p>
              {r.cells.map((c, ci) => {
                const wide = r.wide || c.lanes.length > 1;
                return (
                  <div
                    key={`${step}-${ri}-${ci}`}
                    className={`bp-cell${r.wide ? " wide" : ""}${r.wide && !c.text ? " solo" : ""}${c.bad ? " bad" : ""}${ri < last ? " down" : ""}${ri === 1 ? " drop" : ""}`}
                    style={{ gridColumn: `${c.lanes[0] + 2} / span ${c.lanes.length}`, gridRow: ri + 2, "--d": `${ri * 60 + ci * 40}ms` } as CSSProperties}
                  >
                    {!r.wide && <span className="lane-tag">{c.lanes.map((l) => LANES[l]).join(" y ")}</span>}
                    {ri === 1 && ri < last && <i className="bp-drop" aria-hidden="true" />}
                    {c.text && <div className={`node${c.bad ? " bad" : ""}`}>{c.text}</div>}
                    {(c.pieces || c.empty) && (
                      <div className="cell-pieces">
                        {c.pieces?.map((p, pi) => (
                          <PieceBox key={p.title} p={p} horizontal={wide} delay={ri * 60 + pi * 80 + 60} />
                        ))}
                        {c.empty && <div className="piece-empty">{c.empty}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
              {r.status ? (
                <div className={`status st-${r.status.st}`} style={{ gridColumn: 5, gridRow: ri + 2, "--d": `${ri * 60 + 160}ms` } as CSSProperties} key={`st${step}-${ri}`}>
                  <span className="status-top">
                    <span className="status-n">{r.status.n}</span>
                    {ST[r.status.st]}
                  </span>
                  <span className="status-t">{r.status.t}</span>
                </div>
              ) : (
                <div className="bp-none" style={{ gridColumn: 5, gridRow: ri + 2 }} />
              )}
            </Fragment>
          ))}
        </div>

        <footer className="flow-foot">
          <div className="score">
            <span className="score-dots" aria-hidden="true">
              {s.rows
                .filter((r) => r.status)
                .map((r) => (
                  <i key={r.status!.n} className={`st-${r.status!.st}`}>{r.status!.n}</i>
                ))}
            </span>
            <span className="score-t">{s.score}</span>
          </div>
          {step > 0 && (
            <ul className="legend" aria-label="Tipos de paso">
              {(["regla", "voz", "eco", "pot", "persona", "sistema"] as Kind[]).map((k) => (
                <li key={k}>
                  <i className={`sw k-${k}`} />
                  {KIND[k]}
                  {k === "regla" ? " · determinista" : k === "voz" || k === "eco" || k === "pot" ? " · probabilístico" : ""}
                </li>
              ))}
            </ul>
          )}
        </footer>
      </div>

      <div className="flow-nav">
        {step > 0 ? (
          <button className="btn ghost" onClick={() => setStep(step - 1)}>
            <span aria-hidden="true">←</span> {STEPS[step - 1].tab}
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 && (
          <button className="btn" onClick={() => setStep(step + 1)}>
            {STEPS[step + 1].tab} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
