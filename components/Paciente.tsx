/* Antes vs después desde el punto de vista del paciente, en primera persona. */

type St = "bad" | "good" | "part" | "same";
type Moment = { k: string; cells: [string, St][] };

const MOMENTS: Moment[] = [
  {
    k: "Pido atención",
    cells: [
      ["Llamo y espero de 7 a 10 minutos. A veces cuelgo antes.", "bad"],
      ["Escribo por WhatsApp y elijo mi trámite sin esperar. Si llamo, me atienden como hoy.", "part"],
      ["Escribo o llamo y me contestan al instante.", "good"],
    ],
  },
  {
    k: "Doy mis datos",
    cells: [
      ["Los dicto a la operadora, y en consulta los vuelvo a dar.", "bad"],
      ["Mando una foto de mi credencial o los digo una sola vez.", "good"],
      ["Igual que en la ruta 1.", "good"],
    ],
  },
  {
    k: "Cuento qué me pasa",
    cells: [
      ["Enfermería me pregunta por teléfono y espero a que me digan a dónde ir.", "bad"],
      ["Igual que hoy, pero ya saben por qué busco atención.", "same"],
      ["Me mandan directo a donde toca: médico, telemedicina o sin sala de espera.", "good"],
    ],
  },
  {
    k: "En la consulta",
    cells: [
      ["El médico me vuelve a preguntar todo.", "bad"],
      ["El médico ya tiene mis datos.", "good"],
      ["Si es algo simple, lo resuelvo sin sala de espera.", "good"],
    ],
  },
  {
    k: "Con mi seguro",
    cells: [
      ["Me regresan el trámite por un error en mis datos.", "bad"],
      ["Mis datos llegan validados y el trámite no se regresa por errores de captura.", "good"],
      ["Igual que en la ruta 1.", "good"],
    ],
  },
];

const COLS = ["Hoy", "Ruta 1 · POC", "Ruta 2"];

export default function Paciente() {
  return (
    <div className="pv" role="table" aria-label="Lo que vive el paciente hoy y con cada ruta">
      <div className="pv-h" role="columnheader">Momento</div>
      {COLS.map((c) => (
        <div key={c} className="pv-h" role="columnheader">{c}</div>
      ))}
      {MOMENTS.map((m, i) => (
        <div key={m.k} className="pv-row" role="row">
          <div className="pv-k" role="rowheader">
            <span>{i + 1}</span>
            {m.k}
          </div>
          {m.cells.map(([t, st], j) => (
            <div key={j} className={`pv-c st-${st}`} role="cell">
              <span className="pv-ck">{COLS[j]}</span>
              <p>“{t}”</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
