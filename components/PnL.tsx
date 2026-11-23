/* Cómo cada problema que se ataca llega a una línea del estado de resultados. */

type Row = { title: string; how: string; feeds: number[]; ruta: string };
type Group = { line: string; dir: "↑" | "↓"; goal: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    line: "Ingresos",
    dir: "↑",
    goal: "suben",
    rows: [
      { title: "Más pacientes atendidos", how: "Las llamadas que hoy se abandonan se vuelven consultas.", feeds: [1], ruta: "Ruta 1 en parte · ruta 2" },
      { title: "Más recompra", how: "Sin espera ni preguntas repetidas sube el NPS: el paciente vuelve y recomienda.", feeds: [1, 4], ruta: "Ruta 1 y 2" },
      { title: "Convenios con aseguradoras", how: "Son el 60% de los pacientes y exigen métricas de eficiencia.", feeds: [5], ruta: "Ruta 1 y 2" },
    ],
  },
  {
    line: "Costos",
    dir: "↓",
    goal: "bajan",
    rows: [
      { title: "Menos sobre-staffing", how: "Sin recaptura ni transcripción, el mismo equipo atiende más pacientes sin contratar.", feeds: [2, 4], ruta: "Ruta 1" },
      { title: "Menor costo por episodio", how: "Las consultas menores van a otro canal y el médico se usa en lo complejo.", feeds: [3], ruta: "Ruta 2" },
    ],
  },
  {
    line: "Flujo de caja",
    dir: "↑",
    goal: "mejora",
    rows: [{ title: "Menos devoluciones", how: "El trámite sale bien a la primera y se cobra antes.", feeds: [5], ruta: "Ruta 1" }],
  },
];

export default function PnL() {
  return (
    <div className="pnl">
      <p className="pnl-eq" aria-label="Ingresos suben menos costos que bajan da un margen que sube">
        <span>Ingresos <b>↑</b></span>
        <span className="op">−</span>
        <span>Costos <b>↓</b></span>
        <span className="op">=</span>
        <span className="margin">Margen <b>↑</b></span>
      </p>
      <div className="pnl-cols">
        {GROUPS.map((g) => (
          <section key={g.line} className="pnl-col">
            <header>
              <h4>{g.line}</h4>
              <span className="pnl-goal">
                {g.goal} {g.dir}
              </span>
            </header>
            <ul role="list">
              {g.rows.map((r) => (
                <li key={r.title}>
                  <strong>{r.title}</strong>
                  <p>{r.how}</p>
                  <span className="pnl-meta">
                    <span className="pnl-feeds" aria-label={`Problemas ${r.feeds.join(" y ")}`}>
                      {r.feeds.map((f) => (
                        <i key={f}>{f}</i>
                      ))}
                    </span>
                    {r.ruta}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="pnl-foot">Los números en círculo son los cinco problemas del diagrama de antes y después.</p>
    </div>
  );
}
