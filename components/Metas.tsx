/* Sus seis metas (de su estrategia) y qué tanto las mueve cada ruta. Versión compacta para el resumen. */

type St = "good" | "part" | "same";
type Meta = { fig: string; label: string; r1: St; r2: St };

const ST: Record<St, string> = { good: "Lo ataca", part: "En parte", same: "Sin cambio" };

const METAS: Meta[] = [
  { fig: "70%", label: "de la demanda por canales digitales", r1: "part", r2: "good" },
  { fig: "80%", label: "de los motivos sin sala de espera", r1: "part", r2: "good" },
  { fig: "< 90 min", label: "para casos complejos con médico de cabecera", r1: "same", r2: "good" },
  { fig: "≥ 75", label: "de NPS", r1: "part", r2: "good" },
  { fig: "≤ p25", label: "de costo por episodio en la industria", r1: "good", r2: "good" },
  { fig: "60%", label: "del mix con aseguradoras top-10", r1: "good", r2: "good" },
];

export default function Metas() {
  return (
    <div className="goals">
      <ul className="goals-grid">
        {METAS.map((m) => (
          <li key={m.fig} className="gt">
            <span className="gt-fig">{m.fig}</span>
            <span className="gt-label">{m.label}</span>
            <span className="gt-routes">
              <span className={`gt-r st-${m.r1}`}>
                Ruta 1 <b>{ST[m.r1]}</b>
              </span>
              <span className={`gt-r st-${m.r2}`}>
                Ruta 2 <b>{ST[m.r2]}</b>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
