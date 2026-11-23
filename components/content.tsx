import type { ReactNode } from "react";

/* Respuestas del caso. Las preguntas van tal cual las escribe Creai en el PDF. */

function DemoLink({ ch }: { ch: "llamada" | "whatsapp" }) {
  return (
    <button
      className="demo-link"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("demo:open", { detail: ch }));
        document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      <span className="demo-link-play" aria-hidden="true" />
      Ver el demo de esta pieza
    </button>
  );
}

export type QA = { id: string; num: string; q: ReactNode; short: string; body: () => ReactNode };

export const SUMMARY: { k: string; lead?: string; list: string[] }[] = [
  {
    k: "Problema detectado",
    lead: "Operadora, enfermería y médico trabajan el mismo caso, uno tras otro y a mano. De ahí salen:",
    list: ["7 a 10 minutos de respuesta", "22% de abandono", "65% de doble captura", "Devoluciones de aseguradoras"],
  },
  {
    k: "Cómo lo interpreto",
    list: [
      "Los errores administrativos son el síntoma, no la causa.",
      "La causa: toda la demanda entra por una sola fila manual.",
      "Su ventanilla única digital todavía no existe, y ninguna de sus 4 iniciativas atiende el primer contacto.",
    ],
  },
  {
    k: "Mi enfoque desde preventa",
    list: [
      "Entender el problema, qué necesita ver cada stakeholder para sentir que esto tiene sentido y con qué KPI se mide el éxito.",
      "Mapear el proceso y ubicar dónde viven los datos.",
      "Proponer lo más pequeño que pruebe la hipótesis, con el menor time to value: un primer win pronto.",
    ],
  },
  {
    k: "Propuesta",
    list: [
      "Ruta 1, el POC: dos piezas que capturan el dato una sola vez, un WhatsApp con menú y un tomador de notas en llamada y recepción.",
      "Ruta 2: sobre esa base, un agente que atiende, agenda y apoya el triage.",
    ],
  },
];

export const DIAGNOSTICO: QA[] = [
  {
    id: "d1",
    num: "02.1",
    q: "¿Cuál es el problema real que enfrenta el cliente? ¿Cómo lo contrastas con lo que verbalizan?",
    short: "Piden mejorar un eslabón, la captura de datos. El problema es la cadena completa: toda la demanda entra por una sola fila manual.",
    body: () => (
      <>
        <ul className="pts">
          <li><b>Lo que dicen:</b> quieren capturar y validar mejor los datos, porque se desperdician recursos en tareas repetitivas y errores administrativos.</li>
          <li><b>Lo que muestra el caso:</b> quiera una cita o tenga un síntoma, el paciente recorre la misma cadena de operadora, enfermería y médico. De ahí salen la espera, el abandono, la doble captura, los errores y los médicos saturados con consultas menores.</li>
          <li><b>Por qué importa la diferencia:</b> capturar mejor reduce errores, pero la entrada sigue dependiendo de 3 operadoras. Su estrategia necesita una ventanilla única digital que resuelva el 80% de los motivos de consulta, y hoy no existe.</li>
        </ul>
      </>
    ),
  },
  {
    id: "d2",
    num: "02.2",
    q: "¿Qué datos, señales o indicadores te ayudarían a validar si el reto está correctamente planteado?",
    short: "Cinco indicadores, uno por cada problema. Cada uno tiene un resultado que confirma que el reto es la fila única, y otro que lo descarta.",
    body: () => (
      <table className="tbl tbl-3">
        <thead>
          <tr><th>Indicador</th><th>Lo confirma si…</th><th>Lo descarta si…</th></tr>
        </thead>
        <tbody>
          <tr><td>Abandono por hora contra operadoras en turno</td><td>El abandono sube cuando las llamadas superan la capacidad.</td><td>Es parejo todo el día, sin importar el volumen.</td></tr>
          <tr><td>Motivos de contacto en una muestra de llamadas y registros</td><td>La mayoría son trámites: agendar, datos o seguro.</td><td>La mayoría requiere criterio clínico.</td></tr>
          <tr><td>Doble captura en las 2 sedes que ya usan la HCE unificada</td><td>Ahí también se recaptura: el problema es cómo se captura.</td><td>Ahí ya no pasa: la migración lo resuelve y el foco es solo la entrada.</td></tr>
          <tr><td>Causa de las devoluciones de aseguradoras</td><td>La mayoría nace en errores de captura del primer contacto.</td><td>Nace en codificación o reglas de autorización: ahí la palanca es el robot RPA.</td></tr>
          <tr><td>Consultas de médico de baja complejidad</td><td>Una parte relevante pudo resolverse sin médico.</td><td>Casi todas requerían al médico.</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: "d3",
    num: "02.3",
    q: "¿Qué metodologías o dinámicas usarías frente al cliente para alinear el entendimiento, los objetivos y las dependencias del proyecto?",
    short: "Una dinámica para cada cosa: mapa del recorrido para el entendimiento, ICE sobre el P&L para los objetivos y un mapa de dependencias con el comité.",
    body: () => (
      <ul className="pts">
        <li><b>Entendimiento:</b> mapeo el recorrido del paciente en una sesión con quienes lo operan y aplico los “5 porqués” a cada síntoma. También pregunto qué han intentado antes y por qué no funcionó.</li>
        <li><b>Objetivos:</b> ordeno con dirección los dolores por su impacto en el P&amp;L (pacientes que abandonan, médicos saturados, devoluciones, pacientes que no regresan), priorizo con ICE y acordamos con qué KPI se mide el éxito.</li>
        <li><b>Dependencias:</b> armo un mapa de dependencias con las 4 iniciativas en curso y lo valido con el comité médico-tecnológico, que es quien prioriza el backlog.</li>
      </ul>
    ),
  },
];

const ICE = [
  { name: "Pieza 2 · Tomador de notas", poc: true, i: 5, c: 4, e: 3, why: "Ataca 3 de los 5 problemas con tecnología probada. Pide integrarse a la HCE." },
  { name: "Pieza 1 · WhatsApp con menú", poc: true, i: 3, c: 3, e: 5, why: "Menú determinista, sin riesgo clínico. Solo saca de la fila los trámites simples." },
  { name: "Agente en texto y voz", poc: false, i: 5, c: 2, e: 2, why: "Quita la espera, pero depende de los datos de la ruta 1 y de la agenda integrada." },
  { name: "Triage asistido", poc: false, i: 5, c: 2, e: 1, why: "Libera a los médicos, pero necesita el aval clínico del comité." },
];

export const HIPOTESIS: QA[] = [
  {
    id: "h1",
    num: "03.1",
    q: "Formula al menos dos rutas posibles de solución. Pueden ser complementarias o mutuamente excluyentes.",
    short: "Dos rutas complementarias. Ruta 1, low-hanging fruit: dos piezas que capturan el dato una sola vez. Ruta 2, solución completa: un agente que atiende, agenda y apoya el triage.",
    body: () => (
      <>
      <p className="lede-sm">
        <b>Hipótesis:</b> si el dato se captura una sola vez, sin importar por dónde llegue el paciente, y los trámites
        comunes se resuelven sin operadora, bajan la doble captura, los errores, la espera y el abandono.
      </p>
      <div className="routes">
        <article className="route r1">
          <header>
            <h4>Ruta 1 · Low-hanging fruit</h4>
            <span className="pill">POC</span>
          </header>
          <div className="route-piece">
            <span className="route-k">Pieza 1</span>
            <strong>WhatsApp con menú</strong>
            <p>El paciente elige su trámite de un menú con los motivos más frecuentes, los pocos que concentran la mayoría de los contactos, y deja sus datos sin esperar a una operadora. Lo que no está en el menú pasa a una persona.</p>
            <DemoLink ch="whatsapp" />
          </div>
          <div className="route-piece">
            <span className="route-k">Pieza 2</span>
            <strong>Tomador de notas en llamada y recepción</strong>
            <p>Mientras la operadora atiende, el sistema transcribe y llena el registro. Las reglas validan y ella solo confirma. El registro va directo a la HCE.</p>
            <DemoLink ch="llamada" />
          </div>
          <dl>
            <div><dt>Ataca</dt><dd>Errores de transcripción y doble captura. El menú saca de la fila los trámites simples.</dd></div>
            <div><dt>No cambia</dt><dd>El triage sigue en manos de enfermería, como hoy.</dd></div>
          </dl>
        </article>
        <article className="route r2">
          <header>
            <h4>Ruta 2 · Solución completa</h4>
          </header>
          <div className="route-piece">
            <span className="route-k">Agente</span>
            <strong>Agente en texto y voz</strong>
            <p>Conversa con el paciente, resuelve trámites y agenda en tiempo real. Escala a una persona cuando hace falta.</p>
          </div>
          <div className="route-piece">
            <span className="route-k">Triage</span>
            <strong>Triage asistido</strong>
            <p>Sugiere el nivel con el protocolo del comité, enfermería confirma y el paciente llega al canal correcto: médico en menos de 90 minutos, telemedicina o atención sin sala de espera.</p>
          </div>
          <dl>
            <div><dt>Ataca</dt><dd>Espera, abandono y médicos saturados con consultas menores.</dd></div>
            <div><dt>Exige</dt><dd>El proceso mapeado de punta a punta, los datos estandarizados que deja la ruta 1 y el aval clínico del comité. Sale gradual, del 20% al 100% del tráfico.</dd></div>
          </dl>
        </article>
      </div>
      </>
    ),
  },
  {
    id: "h2",
    num: "03.2",
    q: "Justifica cuál priorizarías en una primera fase de POC y por qué.",
    short: "La ruta 1. Sus dos piezas tienen el mejor ICE y dan el primer win más rápido: más impacto, con más certeza y menos esfuerzo. Además, son la base de la ruta 2.",
    body: () => (
      <>
        <table className="ice">
          <thead>
            <tr>
              <th>Pieza</th>
              <th>Impacto</th>
              <th>Confianza</th>
              <th>Facilidad</th>
              <th>ICE</th>
            </tr>
          </thead>
          <tbody>
            {ICE.map((r) => (
              <tr key={r.name} className={r.poc ? "is-poc" : undefined}>
                <td>
                  <span className="ice-name">
                    {r.name}
                    {r.poc && <span className="pill">POC</span>}
                  </span>
                  <span className="ice-why">{r.why}</span>
                </td>
                {[r.i, r.c, r.e].map((v, k) => (
                  <td key={k} className="ice-score" data-label={["Impacto", "Confianza", "Facilidad"][k]}>
                    <span className="dots" aria-label={`${v} de 5`}>
                      {[1, 2, 3, 4, 5].map((d) => (
                        <i key={d} className={d <= v ? "on" : undefined} />
                      ))}
                    </span>
                  </td>
                ))}
                <td className="ice-total" data-label="ICE">{r.i + r.c + r.e}<span>/15</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note-sm">
          Impacto, confianza y facilidad, de 1 a 5. Es una lectura preliminar que se recalibra con los datos del levantamiento.
        </p>
        <p className="lede-sm">
          <b>Además, la ruta 1 es la base de la ruta 2:</b> deja los datos estandarizados y las conversaciones reales con
          las que se diseña el agente. Sin eso, el agente se construye a ciegas.
        </p>
        <p className="poc">
          <b>El POC:</b> las dos piezas de la ruta 1 en una sede con HCE unificada. Se mide contra la operación de hoy
          en doble captura, errores de captura, tiempo de respuesta y abandono.
        </p>
      </>
    ),
  },
  {
    id: "h3",
    num: "03.3",
    q: "Explica cómo se alinean (o entran en tensión) con las iniciativas actuales de la clínica.",
    short: "Se apoyan en las cuatro. La tensión principal es que la HCE unificada va al 40%.",
    body: () => (
      <table className="tbl">
        <thead>
          <tr><th>Iniciativa</th><th>Se alinea</th><th>Tensión</th></tr>
        </thead>
        <tbody>
          <tr><td><b>HCE unificada</b><span className="sub">40% migrado, 2 sedes</span></td><td>El registro confirmado se guarda ahí.</td><td>En las sedes sin migrar se guarda en la hoja actual, y el médico sigue recapturando hasta que llegue la migración.</td></tr>
          <tr><td><b>Autorizaciones RPA + OCR</b><span className="sub">go-live en 3 semanas</span></td><td>El robot recibe los datos del seguro ya validados.</td><td>Sale a producción en 3 semanas, todavía con los errores de captura actuales.</td></tr>
          <tr><td><b>Telemedicina</b><span className="sub">beta</span></td><td>Es un destino para el triage de la ruta 2.</td><td>Hoy solo cubre dermatología y nutrición, 150 pacientes al mes.</td></tr>
          <tr><td><b>Tableros Power BI</b><span className="sub">MVP activo</span></td><td>Ahí se mide el POC.</td><td>Hay que sumar las métricas nuevas a los tableros.</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: "h4",
    num: "03.4",
    q: "¿Cuáles son las problemáticas principales del negocio (educated y argumented guess) y como se traducen en KPIs de interés a modificar?",
    short: "Cuatro problemas de negocio. Cada uno se mide con un KPI que ya está en su estrategia.",
    body: () => (
      <table className="tbl tbl-kpi">
        <thead>
          <tr><th>Problemática</th><th>KPI a modificar</th><th>Su meta</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Demanda que no entra</b><span className="sub">El 22% abandona antes de ser atendido.</span></td><td>Tasa de abandono, tiempo de respuesta, % de demanda por canales digitales</td><td><span className="goal">70%</span>de la demanda espontánea por canales digitales</td></tr>
          <tr><td><b>Retrabajo que encarece cada episodio</b><span className="sub">Tres roles trabajan el mismo dato y los médicos atienden consultas menores.</span></td><td>Costo por episodio, % de doble captura, % resuelto sin sala de espera</td><td><span className="goal">≤ p25</span>costo por episodio, y 80% de los motivos sin sala de espera</td></tr>
          <tr><td><b>Riesgo con aseguradoras</b><span className="sub">Son el 60% del mix y exigen métricas de eficiencia. Los errores generan devoluciones.</span></td><td>% de devoluciones y reclamos, tiempo de autorización</td><td><span className="goal">60%</span>del mix con aseguradoras top-10, y autorización en menos de 6 h</td></tr>
          <tr><td><b>Experiencia que resta NPS</b><span className="sub">La espera y la atención fragmentada, según el propio caso.</span></td><td>NPS del primer contacto</td><td><span className="goal">≥ 75</span>de NPS</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: "h5",
    num: "03.5",
    q: "Identifica posibles traumas y riesgos para la implementación de soluciones.",
    short: "Dos traumas que ya trae la organización y cuatro riesgos de la solución. La ruta 1 los acota: no cambia el proceso y una persona confirma antes de guardar.",
    body: () => (
      <div className="risks">
        {RIESGOS.map(([type, title, why, how]) => (
          <article key={title} className={`risk ${type === "Trauma" ? "t" : "r"}`}>
            <span className="risk-type">{type}</span>
            <h4>{title}</h4>
            <p>{why}</p>
            <p className="how">{how}</p>
          </article>
        ))}
      </div>
    ),
  },
];

const RIESGOS = [
  ["Trauma", "Miedo a ser reemplazadas o vigiladas", "El tomador de notas escucha a operadoras y enfermeras.", "Se les involucra en el diseño y se deja claro que captura los datos del paciente, no evalúa a la persona."],
  ["Trauma", "Fatiga de cambio", "Ya conviven con 4 iniciativas y una migración a medias.", "La ruta 1 no les cambia el proceso."],
  ["Riesgo", "Errores del modelo", "No sirve cambiar errores humanos de transcripción por errores de un modelo.", "Las reglas validan y una persona confirma antes de guardar."],
  ["Riesgo", "Datos sensibles", "Son datos de salud y conversaciones transcritas.", "Se avisa, se pide consentimiento y se guarda solo lo necesario."],
  ["Riesgo", "Seguridad clínica", "Un triage equivocado tiene consecuencias.", "El triage sigue en manos de enfermería. La sugerencia automática es de la ruta 2 y pasa por el comité."],
  ["Riesgo", "Interés de dirección", "Sin un resultado pronto, el proyecto pierde prioridad.", "POC corto, medido con métricas que ya conocen."],
];

export const ALINEACION: QA[] = [
  {
    id: "a1",
    num: "04.1",
    q: "¿Cómo asegurarías que cliente, Solutions, Producto y Tecnología compartan una misma visión?",
    short: "Con un primer win acordado por las cuatro partes, y con time to value como KPI interno: que ese primer win llegue lo antes posible.",
    body: () => (
      <ul className="pts">
        <li><b>Qué necesita ver cada parte:</b> antes de proponer, le pregunto a dirección, al comité, a operación, a TI y a Producto y Tecnología qué tendría que pasar para que esto les haga sentido. Lo dejo por escrito.</li>
        <li><b>Un primer win acordado:</b> de esas respuestas sale un solo primer win que todos reconozcan. Por ejemplo, que dirección vea en sus tableros de Power BI la doble captura bajar en la sede piloto.</li>
        <li><b>Time to value como KPI interno:</b> los días desde el arranque hasta ese primer win. El POC se diseña para que sean los menos posibles: una sede y dos piezas que no cambian el proceso.</li>
        <li><b>Una sola página:</b> problema, hipótesis, alcance, KPI, lo que queda fuera y el diagrama. Se revisa con el cliente en cada avance; si algo cambia, cambia ahí.</li>
        <li><b>Sin traspasos en frío:</b> Producto y Tecnología entran desde el levantamiento, porque en cada traspaso se pierde contexto.</li>
      </ul>
    ),
  },
  {
    id: "a2",
    num: "04.2",
    q: "¿Cuál sería el proceso que utilizarías para hacer el levantamiento que corrobore tus assumptions y guesses?",
    short: "Primero escribo los supuestos. Después observo, ubico los datos y pruebo con llamadas reales antes de prometer nada.",
    body: () => (
      <ol className="num">
        <li><b>Escribo los supuestos.</b> Los principales: la mayoría de los contactos son trámites comunes, la transcripción funciona con el audio real de llamadas y mostrador, el LLM extrae los campos con la precisión suficiente y la HCE unificada recibe registros de otro sistema.</li>
        <li><b>Observo y entrevisto.</b> Escucho llamadas, acompaño un turno a operadoras y enfermería, y hablo con dirección, comité y TI.</li>
        <li><b>Ubico los datos.</b> Dónde viven, si ya están estructurados y qué hay que estandarizar.</li>
        <li><b>Pruebo con una muestra real.</b> Corro la transcripción y la extracción sobre llamadas reales antes de prometer nada.</li>
        <li><b>Devuelvo los hallazgos</b> con cada supuesto marcado como confirmado o descartado, y ajusto la propuesta.</li>
      </ol>
    ),
  },
  {
    id: "a3",
    num: "04.3",
    q: "¿Qué entregables (ej. arquitectura, criterios de éxito, user stories) dejarías definidos para facilitar el traspaso?",
    short: "Seis entregables que juntos forman el PRD.",
    body: () => (
      <ol className="num">
        <li>Objetivo, expectativas de cada parte, KPIs, criterios de éxito y fechas.</li>
        <li>Flujo de punta a punta: motivos de contacto, reglas, excepciones y cuándo se escala a una persona.</li>
        <li>Arquitectura: qué es regla, qué es modelo y qué modelo usa cada paso.</li>
        <li>Contrato de datos: qué entra y qué sale en cada paso, de dónde viene y en qué formato.</li>
        <li>User stories con criterios de aceptación que se puedan verificar.</li>
        <li>Riesgos, supuestos abiertos y dependencias.</li>
      </ol>
    ),
  },
  {
    id: "a4",
    num: "04.4",
    q: "¿Cómo presentarías los límites del POC sin generar falsas expectativas?",
    short: "Por escrito desde la primera reunión, y repetido en cada revisión: qué hace, qué no hace, qué prueba y qué sigue.",
    body: () => (
      <dl className="limits">
        <div><dt>Qué hace</dt><dd>Las dos piezas de la ruta 1 en una sede: WhatsApp con menú y tomador de notas. Una persona confirma antes de guardar.</dd></div>
        <div><dt>Qué no hace</dt><dd>No conversa libremente con el paciente, no hace triage y no guarda nada sin confirmación. Eso es la ruta 2.</dd></div>
        <div><dt>Qué prueba</dt><dd>Que el registro sale completo y correcto sin recaptura, y qué parte de los contactos resuelve el menú. El efecto en NPS y costo por episodio de toda la red se mide al escalar.</dd></div>
        <div><dt>Qué sigue</dt><dd>Con esos resultados se decide si se construye la ruta 2. No prometo cifras antes de medir.</dd></div>
      </dl>
    ),
  },
];

export const MENSAJE: QA = {
  id: "m1",
  num: "05.1",
  q: (
    <>
      Redacta un mensaje de seguimiento que enviarías después de la primera reunión con el cliente. El mensaje debe:
      confirmar tu comprensión del reto, enunciar los objetivos principales y proponer próximos pasos.
    </>
  ),
  short: "Un correo corto que confirma el reto, enuncia tres objetivos y propone tres pasos con fecha.",
  body: () => (
    <div className="mail">
      <div className="mail-head">
        <span className="mail-k">Asunto</span>
        <span>Resumen y próximos pasos · primer contacto de pacientes</span>
      </div>
      <div className="mail-body">
        <div className="mail-row">
          <div>
            <p>Hola [Nombre]:</p>
            <p>Gracias por la reunión de hoy. Te comparto lo que entendimos para confirmar que estamos alineados.</p>
          </div>
        </div>
        <div className="mail-row">
          <div>
            <p className="mail-h">El reto</p>
            <p>
              Hoy el primer contacto depende del call-center y la recepción. El proceso es manual y genera esperas de 7 a 10
              minutos, 22% de abandono, doble captura en el 65% de los casos y errores que terminan en devoluciones de
              aseguradoras. Más allá de la carga administrativa, creemos que el reto de fondo es que todos los pacientes
              entran por la misma fila, sin importar lo que necesiten.
            </p>
          </div>
          <span className="mark">Confirma la comprensión del reto</span>
        </div>
        <div className="mail-row">
          <div>
            <p className="mail-h">Objetivos</p>
            <ol>
              <li>Capturar los datos del paciente una sola vez, por cualquier canal.</li>
              <li>Que los trámites más comunes se resuelvan sin esperar a una operadora.</li>
              <li>Liberar a operadoras, enfermería y médicos para los casos que requieren su criterio.</li>
            </ol>
          </div>
          <span className="mark">Enuncia los objetivos</span>
        </div>
        <div className="mail-row">
          <div>
            <p className="mail-h">Próximos pasos</p>
            <ol>
              <li>Acompañar un turno de call-center y recepción en una sede. [fecha]</li>
              <li>Recibir de su equipo una muestra de registros y llamadas para ver los motivos de contacto más comunes. [fecha]</li>
              <li>Presentarles el alcance de un POC y el KPI con el que mediríamos el éxito. [fecha]</li>
            </ol>
          </div>
          <span className="mark">Propone próximos pasos</span>
        </div>
        <div className="mail-row">
          <div>
            <p>¿Refleja lo que platicamos? Si algo no cuadra, lo ajustamos.</p>
            <p>Saludos,<br />Alan</p>
          </div>
        </div>
      </div>
    </div>
  ),
};
