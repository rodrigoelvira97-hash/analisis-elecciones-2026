window.ELECTION_ANALYSIS = {
  year: 2026,
  themes: [
    { id: "economia-empleo", label: "Economía y empleo", aliases: ["economía", "empleo", "trabajo", "salarios", "industria", "producción", "autónomos", "empresas"], subthemes: [
      { id: "empleo-formacion", label: "Empleo, formación y trabajo", order: 1 },
      { id: "empresa-industria", label: "Empresas, industria e innovación", order: 2 },
      { id: "produccion-rural", label: "Producción, agricultura y mundo rural", order: 3 }
    ] },
    { id: "fiscalidad-finanzas", label: "Fiscalidad y finanzas públicas", aliases: ["fiscalidad", "impuestos", "tributación", "presión fiscal", "gasto público", "presupuestos", "déficit", "deuda", "fraude fiscal"], directTerms: ["fiscalidad", "impuestos", "tributación", "presión fiscal", "gasto público", "presupuestos", "déficit", "deuda", "fraude fiscal"], subthemes: [
      { id: "impuestos-fiscalidad", label: "Impuestos y sistema tributario", order: 1 },
      { id: "finanzas-publicas", label: "Presupuestos, gasto y deuda pública", order: 2 }
    ] },
    { id: "servicios-publicos", label: "Servicios públicos", aliases: ["sanidad", "salud", "educación", "pensiones", "dependencia", "cuidados", "servicios públicos", "servicios sociales", "universidad", "juventud"], subthemes: [
      { id: "sanidad-salud", label: "Sanidad y salud pública", order: 1 },
      { id: "educacion-conocimiento", label: "Educación, FP, universidad y ciencia", order: 2 },
      { id: "pensiones-cuidados", label: "Pensiones, dependencia y cuidados", order: 3 },
      { id: "servicios-sociales", label: "Servicios sociales e inclusión", order: 4 }
    ] },
    { id: "vivienda-coste", label: "Vivienda y coste de vida", aliases: ["vivienda", "alquiler", "hipoteca", "suelo", "rehabilitación", "coste de vida", "hogar"], subthemes: [
      { id: "vivienda-proximidad", label: "Vivienda y acceso residencial", order: 1 },
      { id: "coste-vida", label: "Coste de vida y consumo", order: 2 }
    ] },
    { id: "territorio-cohesion", label: "Organización territorial y cohesión", aliases: ["territorio", "autonomías", "municipalismo", "cogobernanza", "cohesión territorial", "despoblación", "mundo rural"], subthemes: [
      { id: "organizacion-territorial", label: "Organización territorial y competencias", order: 1 },
      { id: "cohesion-territorial", label: "Cohesión territorial y mundo rural", order: 2 },
      { id: "administracion-local", label: "Municipios y administración local", order: 3 }
    ] },
    { id: "movilidad-infraestructuras", label: "Movilidad, transporte e infraestructuras", aliases: ["movilidad", "transporte", "ferrocarril", "carreteras", "infraestructuras", "transporte público", "conectividad"], subthemes: [
      { id: "transporte-infraestructuras", label: "Transporte y movilidad", order: 1 },
      { id: "infraestructuras", label: "Infraestructuras y conectividad", order: 2 }
    ] },
    { id: "medio-energia", label: "Medio ambiente, energía y agua", aliases: ["medio ambiente", "medioambiente", "ecología", "ecológica", "energía", "agua", "renovables", "clima", "biodiversidad"], subthemes: [
      { id: "medio-ambiente", label: "Medio ambiente y clima", order: 1 },
      { id: "energia", label: "Energía y renovables", order: 2 },
      { id: "agua", label: "Agua y recursos hídricos", order: 3 }
    ] },
    { id: "migracion", label: "Migración, fronteras y asilo", aliases: ["inmigración", "inmigración ilegal", "migración", "migraciones", "migrante", "migrantes", "personas migrantes", "asilo", "refugio", "refugiados", "extranjería", "integración", "fronteras", "control fronterizo", "política migratoria"], directTerms: ["inmigración", "inmigración ilegal", "migración", "migraciones", "migrante", "migrantes", "personas migrantes", "asilo", "refugio", "refugiados", "extranjería", "integración", "política migratoria", "control fronterizo"], subthemes: [
      { id: "fronteras-control", label: "Fronteras y control migratorio", order: 1 },
      { id: "migracion-asilo", label: "Migración, extranjería y asilo", order: 2 },
      { id: "integracion-migracion", label: "Integración y convivencia", order: 3 }
    ] },
    { id: "instituciones-democracia", label: "Instituciones, democracia y justicia", aliases: ["instituciones", "democracia", "justicia", "administración", "transparencia", "participación", "gobernanza", "estado de derecho"], subthemes: [
      { id: "instituciones-democracia", label: "Instituciones, democracia y participación", order: 1 },
      { id: "justicia", label: "Justicia e independencia judicial", order: 2 },
      { id: "administracion-digital", label: "Administración pública y servicios digitales", order: 3 }
    ] },
    { id: "seguridad-defensa", label: "Seguridad, defensa y soberanía", aliases: ["seguridad", "defensa", "policía", "guardia civil", "soberanía", "integridad territorial", "protección civil", "libertad de expresión", "ocupación"], directTerms: ["seguridad", "defensa", "policía", "guardia civil", "soberanía", "integridad territorial", "protección civil", "libertad de expresión", "ocupación"], subthemes: [
      { id: "seguridad-interior", label: "Seguridad interior y cuerpos policiales", order: 1 },
      { id: "defensa-soberania", label: "Defensa, soberanía e integridad territorial", order: 2 },
      { id: "proteccion-civil", label: "Protección civil y emergencias", order: 3 }
    ] },
    { id: "derechos-igualdad-cultura", label: "Derechos, igualdad y cultura", aliases: ["bienestar", "familia", "igualdad", "derechos", "protección social", "inclusión", "conciliación", "cultura", "libertad"], subthemes: [
      { id: "derechos-igualdad", label: "Derechos e igualdad", order: 1 },
      { id: "familia-conciliacion", label: "Familia y conciliación", order: 2 },
      { id: "cultura", label: "Cultura y participación cultural", order: 3 }
    ] },
    { id: "exterior-europa", label: "Europa y política exterior", aliases: ["exterior", "internacional", "europa", "unión europea", "cooperación", "iberoamérica"], subthemes: [
      { id: "union-europea", label: "Unión Europea", order: 1 },
      { id: "politica-exterior", label: "Política exterior y cooperación", order: 2 }
    ] }
  ],
  taxonomy: {
    intro: "Clasificación temática común elaborada para este análisis documental. Los temas agrupan ámbitos amplios y los subtemas concretan el contenido de las propuestas.",
    themes: {
      "economia-empleo": "Políticas de crecimiento, empleo, empresas, producción e innovación.",
      "fiscalidad-finanzas": "Impuestos, presupuestos, gasto, deuda y administración de los recursos públicos.",
      "servicios-publicos": "Prestación y organización de servicios públicos sociales y de bienestar.",
      "vivienda-coste": "Acceso a la vivienda y medidas que afectan directamente al coste de vida de los hogares.",
      "territorio-cohesion": "Distribución territorial del poder y medidas para la cohesión entre territorios.",
      "movilidad-infraestructuras": "Transporte, movilidad e infraestructuras físicas o digitales de conexión.",
      "medio-energia": "Protección ambiental, energía, clima y gestión del agua.",
      "migracion": "Migración, extranjería, asilo, integración y control de fronteras cuando se aborda en ese contexto.",
      "instituciones-democracia": "Organización institucional, democracia, participación, justicia y administración pública.",
      "seguridad-defensa": "Seguridad interior, defensa nacional, soberanía, integridad territorial y emergencias.",
      "derechos-igualdad-cultura": "Derechos, igualdad, familia, conciliación y cultura.",
      "exterior-europa": "Unión Europea, relaciones internacionales, cooperación y política exterior."
    },
    subthemes: {
      "empleo-formacion": "Incluye empleo, formación laboral y condiciones de trabajo; excluye impuestos o políticas generales de empresa sin componente laboral.",
      "empresa-industria": "Incluye empresas, industria, innovación y transformación productiva.",
      "produccion-rural": "Incluye agricultura, ganadería, pesca y producción vinculada al mundo rural.",
      "impuestos-fiscalidad": "Incluye impuestos, presión fiscal y cambios del sistema tributario; no incluye gasto público sin componente fiscal expreso.",
      "finanzas-publicas": "Incluye presupuestos, gasto, déficit, financiación pública y deuda.",
      "sanidad-salud": "Incluye sistema sanitario, salud pública, atención sanitaria, salud mental, coordinación e innovación sanitaria.",
      "educacion-conocimiento": "Incluye educación, FP, universidad, ciencia y formación del conocimiento.",
      "pensiones-cuidados": "Incluye pensiones, dependencia, cuidados y autonomía de las personas mayores o dependientes.",
      "servicios-sociales": "Incluye inclusión, rentas mínimas, apoyo social y servicios dirigidos a personas en situación de vulnerabilidad.",
      "vivienda-proximidad": "Incluye acceso a vivienda, alquiler, suelo, rehabilitación y vivienda protegida.",
      "coste-vida": "Incluye medidas sobre precios, consumo y gastos cotidianos de los hogares que no son exclusivamente vivienda.",
      "organizacion-territorial": "Incluye competencias, modelo territorial, autonomías, unidad del Estado y cooperación entre administraciones.",
      "cohesion-territorial": "Incluye despoblación, mundo rural, equilibrio territorial y acceso homogéneo a servicios.",
      "administracion-local": "Incluye municipios, administración local y relaciones específicas con los gobiernos locales.",
      "transporte-infraestructuras": "Incluye transporte público, ferrocarril, carreteras y movilidad de personas o mercancías.",
      "infraestructuras": "Incluye redes, conectividad, equipamientos y obras que permiten conectar territorios o prestar servicios.",
      "medio-ambiente": "Incluye clima, biodiversidad, protección ambiental y patrimonio natural.",
      "energia": "Incluye energía, renovables, eficiencia energética y soberanía o abastecimiento energético.",
      "agua": "Incluye abastecimiento, sequía, desalación, reutilización y gestión de recursos hídricos.",
      "fronteras-control": "Incluye control de fronteras y vigilancia vinculada específicamente a los flujos migratorios.",
      "migracion-asilo": "Incluye inmigración, extranjería, migración y asilo; no incluye seguridad general sin relación migratoria.",
      "integracion-migracion": "Incluye integración, convivencia y políticas dirigidas a personas migrantes.",
      "instituciones-democracia": "Incluye democracia, participación, transparencia, rendición de cuentas y funcionamiento institucional.",
      "justicia": "Incluye organización, acceso e independencia de la justicia y de los órganos judiciales.",
      "administracion-digital": "Incluye administración pública, trámites, interoperabilidad, transparencia administrativa y digitalización de servicios.",
      "seguridad-interior": "Incluye policía, Guardia Civil, seguridad ciudadana y protección frente a delitos.",
      "defensa-soberania": "Incluye Fuerzas Armadas, defensa, soberanía e integridad territorial del Estado.",
      "proteccion-civil": "Incluye emergencias, protección civil, prevención y respuesta ante catástrofes.",
      "derechos-igualdad": "Incluye derechos civiles, igualdad, libertad y garantías de no discriminación.",
      "familia-conciliacion": "Incluye familia, natalidad, infancia y conciliación de la vida laboral y familiar.",
      "cultura": "Incluye cultura, patrimonio, creación y participación cultural.",
      "union-europea": "Incluye instituciones, políticas y posición de España dentro de la Unión Europea.",
      "politica-exterior": "Incluye relaciones internacionales, cooperación, diplomacia y política exterior."
    }
  },
  parties: []
};

const programStructure = window.ELECTION_PROGRAM_STRUCTURE;
window.ELECTION_ANALYSIS.parties = Object.entries(programStructure.parties).map(([name, program]) => ({
  name,
  description: "Programa electoral de 2026. El índice original se conserva separado de la clasificación temática comparativa.",
  sourceFile: program.sourceFile,
  numberLabel: program.numberLabel,
  priorities: program.blocks.map((block) => ({
    title: block.title,
    description: "Apartado del índice original del programa.",
    themeIds: [],
    measures: []
  }))
}));
