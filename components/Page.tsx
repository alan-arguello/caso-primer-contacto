"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ALINEACION, DIAGNOSTICO, HIPOTESIS, MENSAJE, SUMMARY, type QA } from "./content";
import Visual from "./Visual";
import PnL from "./PnL";
import Metas from "./Metas";
import Demo from "./Demo";

const SECTIONS = [
  { id: "s01", num: "01", label: "Executive Summary" },
  { id: "s02", num: "02", label: "Diagnóstico" },
  { id: "s03", num: "03", label: "Hipótesis y POC" },
  { id: "s04", num: "04", label: "Traspaso" },
  { id: "s05", num: "05", label: "Comunicación" },
  { id: "s06", num: "06", label: "Propuesta visual" },
  { id: "kpi", num: "", label: "KPI" },
  { id: "demo", num: "", label: "Demo" },
];

function Head({ num, title }: { num: string; title: string }) {
  return (
    <header className="sh">
      <span className="sh-num" aria-hidden="true">{num}</span>
      <h2>{title}</h2>
    </header>
  );
}

function Prompt({ children }: { children: ReactNode }) {
  return (
    <div className="prompt">
      <span className="prompt-k">Lo que pide el caso</span>
      <div className="prompt-v">{children}</div>
    </div>
  );
}

function Item({ qa, open, toggle }: { qa: QA; open: boolean; toggle: () => void }) {
  return (
    <li className="qa" data-open={open}>
      <button className="qa-head" aria-expanded={open} aria-controls={`b-${qa.id}`} id={`h-${qa.id}`} onClick={toggle}>
        <span className="qa-num">{qa.num}</span>
        <span className="qa-q">{qa.q}</span>
        <span className="qa-icon" aria-hidden="true" />
      </button>
      <div className="qa-body" id={`b-${qa.id}`} role="region" aria-labelledby={`h-${qa.id}`}>
        <div className="qa-inner">
          <div className="qa-pad">
            <p className="qa-lead">{qa.short}</p>
            {qa.body()}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Page() {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [step, setStep] = useState(0);
  const [active, setActive] = useState("");

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let cur = "";
        SECTIONS.forEach((s) => {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= 160) cur = s.id;
        });
        setActive(cur);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const list = (items: QA[]) => (
    <ul className="qa-list">
      {items.map((qa) => (
        <Item key={qa.id} qa={qa} open={open.has(qa.id)} toggle={() => toggle(qa.id)} />
      ))}
    </ul>
  );

  return (
    <>
      <nav className="topnav" aria-label="Secciones">
        <a className="tn-brand" href="#top">Business case</a>
        <div className="tn-links">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
              {s.num && <span className="tn-num">{s.num}</span>}
              <span className="tn-label">{s.label}</span>
            </a>
          ))}
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap">
          <h1>Business case</h1>
        </div>
      </header>

      <main className="wrap">
        <section className="sec" id="s01">
          <Head num="01" title="Executive Summary" />
          <Prompt>
            <p>Resume el problema detectado, cómo lo interpretas a partir del material recibido y cuál es tu enfoque general para identificar una solución viable desde la etapa de preventa.</p>
          </Prompt>
          <dl className="summary">
            {SUMMARY.map((s) => (
              <div key={s.k}>
                <dt>{s.k}</dt>
                <dd>
                  {s.lead && <p className="sum-lead">{s.lead}</p>}
                  <ul className="sum-list">
                    {s.list.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="sec" id="s02">
          <Head num="02" title="Diagnóstico estructurado" />
          {list(DIAGNOSTICO)}
        </section>

        <section className="sec" id="s03">
          <Head num="03" title="Hipótesis y solución orientada a POC" />
          {list(HIPOTESIS)}
        </section>

        <section className="sec" id="s04">
          <Head num="04" title="Alineación con stakeholders y traspaso a Producto" />
          {list(ALINEACION)}
        </section>

        <section className="sec" id="s05">
          <Head num="05" title="Comunicación consultiva" />
          {list([MENSAJE])}
        </section>

        <section className="sec" id="s06">
          <Head num="06" title="Propuesta visual (opcional)" />
          <Prompt>
            <p>Entrega un artefacto que podrías usar en la etapa de venta o validación, como:</p>
            <ul>
              <li>Un flujo conversacional con intenciones clasificadas.</li>
              <li>Un diagrama de componentes funcionales.</li>
              <li>Una tabla de impacto vs esfuerzo.</li>
              <li>Un resumen visual del “antes vs después” desde el punto de vista del usuario.</li>
            </ul>
          </Prompt>
          <div className="sub">
            <div className="sub-head">
              <h3>Antes y después</h3>
              <p>El mismo flujo en tres pasos: así pasa hoy, la ruta 1 y la ruta 2.</p>
            </div>
            <Visual step={step} setStep={setStep} />
          </div>
        </section>

        <section className="sec" id="kpi">
          <header className="sh">
            <span className="sh-tag">Extra</span>
            <h2>Impacto en los KPI</h2>
          </header>
          <div className="sub">
            <div className="sub-head">
              <h3>Sus metas</h3>
              <p>Las seis que su estrategia ya define. Hoy, el primer contacto las aleja a todas.</p>
            </div>
            <Metas />
          </div>
          <div className="sub">
            <div className="sub-head">
              <h3>Impacto en el P&amp;L</h3>
              <p>Cada problema que se ataca mueve una línea del estado de resultados.</p>
            </div>
            <PnL />
          </div>
        </section>

        <section className="sec" id="demo">
          <header className="sh">
            <span className="sh-tag">Extra</span>
            <h2>Demo del POC</h2>
          </header>
          <p className="demo-intro">Simulación con datos de ejemplo de las dos piezas del POC.</p>
          <Demo />
        </section>
      </main>

      <footer className="wrap foot">
        <span>Alan Arguello · Solutions Consultant</span>
      </footer>
    </>
  );
}
