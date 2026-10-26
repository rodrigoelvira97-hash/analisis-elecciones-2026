window.ELECTION_ANALYSIS = {
  year: 2023,
  themes: [
    {
      id: "economia-empleo",
      label: "Economía y empleo",
      aliases: ["economía", "empleo", "trabajo", "salarios", "industria", "producción", "autónomos", "empresas"],
      subthemes: [
        { id: "empleo-formacion", label: "Empleo, formación y trabajo", order: 1 },
        { id: "empresa-industria", label: "Empresas, industria e innovación", order: 2 },
        { id: "produccion-rural", label: "Producción, agricultura y mundo rural", order: 3 }
      ]
    },
    {
      id: "fiscalidad-finanzas",
      label: "Fiscalidad y finanzas públicas",
      aliases: ["fiscalidad", "impuestos", "tributación", "presión fiscal", "gasto público", "presupuestos", "déficit", "deuda", "fraude fiscal"],
      directTerms: ["fiscalidad", "impuestos", "tributación", "presión fiscal", "gasto público", "presupuestos", "déficit", "deuda", "fraude fiscal"],
      subthemes: [
        { id: "impuestos-fiscalidad", label: "Impuestos y sistema tributario", order: 1 },
        { id: "finanzas-publicas", label: "Presupuestos, gasto y deuda pública", order: 2 }
      ]
    },
    {
      id: "servicios-publicos",
      label: "Servicios públicos",
      aliases: ["sanidad", "salud", "educación", "pensiones", "dependencia", "cuidados", "servicios públicos", "servicios sociales", "universidad", "juventud"],
      subthemes: [
        { id: "sanidad-salud", label: "Sanidad y salud pública", order: 1 },
        { id: "educacion-conocimiento", label: "Educación, FP, universidad y ciencia", order: 2 },
        { id: "pensiones-cuidados", label: "Pensiones, dependencia y cuidados", order: 3 },
        { id: "servicios-sociales", label: "Servicios sociales e inclusión", order: 4 }
      ]
    },
    {
      id: "vivienda-coste",
      label: "Vivienda y coste de vida",
      aliases: ["vivienda", "alquiler", "hipoteca", "suelo", "rehabilitación", "coste de vida", "hogar"],
      subthemes: [
        { id: "vivienda-proximidad", label: "Vivienda y acceso residencial", order: 1 },
        { id: "coste-vida", label: "Coste de vida y consumo", order: 2 }
      ]
    },
    {
      id: "territorio-cohesion",
      label: "Organización territorial y cohesión",
      aliases: ["territorio", "autonomías", "municipalismo", "cogobernanza", "cohesión territorial", "despoblación", "mundo rural"],
      subthemes: [
        { id: "organizacion-territorial", label: "Organización territorial y competencias", order: 1 },
        { id: "cohesion-territorial", label: "Cohesión territorial y mundo rural", order: 2 },
        { id: "administracion-local", label: "Municipios y administración local", order: 3 }
      ]
    },
    {
      id: "movilidad-infraestructuras",
      label: "Movilidad, transporte e infraestructuras",
      aliases: ["movilidad", "transporte", "ferrocarril", "carreteras", "infraestructuras", "transporte público", "conectividad"],
      subthemes: [
        { id: "transporte-infraestructuras", label: "Transporte y movilidad", order: 1 },
        { id: "infraestructuras", label: "Infraestructuras y conectividad", order: 2 }
      ]
    },
    {
      id: "medio-energia",
      label: "Medio ambiente, energía y agua",
      aliases: ["medio ambiente", "medioambiente", "ecología", "ecológica", "energía", "agua", "renovables", "clima", "biodiversidad"],
      subthemes: [
        { id: "medio-ambiente", label: "Medio ambiente y clima", order: 1 },
        { id: "energia", label: "Energía y renovables", order: 2 },
        { id: "agua", label: "Agua y recursos hídricos", order: 3 }
      ]
    },
    {
      id: "migracion",
      label: "Migración, fronteras y asilo",
      aliases: ["inmigración", "inmigración ilegal", "migración", "migraciones", "migrante", "migrantes", "personas migrantes", "asilo", "refugio", "refugiados", "extranjería", "integración", "fronteras", "control fronterizo", "política migratoria"],
      directTerms: ["inmigración", "inmigración ilegal", "migración", "migraciones", "migrante", "migrantes", "personas migrantes", "asilo", "refugio", "refugiados", "extranjería", "integración", "política migratoria", "control fronterizo"],
      subthemes: [
        { id: "fronteras-control", label: "Fronteras y control migratorio", order: 1 },
        { id: "migracion-asilo", label: "Migración, extranjería y asilo", order: 2 },
        { id: "integracion-migracion", label: "Integración y convivencia", order: 3 }
      ]
    },
    {
      id: "instituciones-democracia",
      label: "Instituciones, democracia y justicia",
      aliases: ["instituciones", "democracia", "justicia", "administración", "transparencia", "participación", "gobernanza", "estado de derecho"],
      subthemes: [
        { id: "instituciones-democracia", label: "Instituciones, democracia y participación", order: 1 },
        { id: "justicia", label: "Justicia e independencia judicial", order: 2 },
        { id: "administracion-digital", label: "Administración pública y servicios digitales", order: 3 }
      ]
    },
    {
      id: "seguridad-defensa",
      label: "Seguridad, defensa y soberanía",
      aliases: ["seguridad", "defensa", "policía", "guardia civil", "soberanía", "integridad territorial", "protección civil", "libertad de expresión", "ocupación"],
      directTerms: ["seguridad", "defensa", "policía", "guardia civil", "soberanía", "integridad territorial", "protección civil", "libertad de expresión", "ocupación"],
      subthemes: [
        { id: "seguridad-interior", label: "Seguridad interior y cuerpos policiales", order: 1 },
        { id: "defensa-soberania", label: "Defensa, soberanía e integridad territorial", order: 2 },
        { id: "proteccion-civil", label: "Protección civil y emergencias", order: 3 }
      ]
    },
    {
      id: "derechos-igualdad-cultura",
      label: "Derechos, igualdad y cultura",
      aliases: ["bienestar", "familia", "igualdad", "derechos", "protección social", "inclusión", "conciliación", "cultura", "libertad"],
      subthemes: [
        { id: "derechos-igualdad", label: "Derechos e igualdad", order: 1 },
        { id: "familia-conciliacion", label: "Familia y conciliación", order: 2 },
        { id: "cultura", label: "Cultura y participación cultural", order: 3 }
      ]
    },
    {
      id: "exterior-europa",
      label: "Europa y política exterior",
      aliases: ["exterior", "internacional", "europa", "unión europea", "cooperación", "iberoamérica"],
      subthemes: [
        { id: "union-europea", label: "Unión Europea", order: 1 },
        { id: "politica-exterior", label: "Política exterior y cooperación", order: 2 }
      ]
    }
  ],
  taxonomy: {
    intro: "Clasificación temática propia del análisis documental. El tema madre agrupa ámbitos amplios y el subtema concreta el contenido de las medidas identificadas.",
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
      "empleo-formacion": "Incluye empleo, formación laboral y condiciones de trabajo; no incluye impuestos ni políticas generales de empresa.",
      "empresa-industria": "Incluye empresas, industria, innovación y transformación productiva; no incluye medidas laborales generales.",
      "produccion-rural": "Incluye agricultura, ganadería, pesca y producción vinculada al mundo rural.",
      "impuestos-fiscalidad": "Incluye impuestos, presión fiscal y cambios del sistema tributario; no incluye gasto público sin componente fiscal expreso.",
      "finanzas-publicas": "Incluye presupuestos, gasto, déficit y deuda pública. En 2023 no hay medidas identificadas con esta etiqueta en la base web.",
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
  parties: [
    {
      name: "PP",
      description: "Programa estructurado en crecer, cuidar, regenerar, servir y liderar.",
      sourceFile: "../PP-GENERALES-2023.pdf",
      priorities: [
        {
          theme: "Economía",
          themeIds: ["economia-empleo"],
          title: "Crecimiento económico, empleo, innovación y reindustrialización",
          description: "Talento, innovación, empleo de calidad, fiscalidad, fondos europeos, inteligencia artificial, turismo, agricultura, agua y energía.",
          measures: [
            ["Entorno jurídico previsible y estable", "Crear un marco regulatorio que facilite la inversión, la actividad empresarial y la creación de empleo.", 17, [], ["empresa-industria"]],
            ["Alivio fiscal para familias, autónomos y empresas", "Reducir la presión fiscal y revisar el sistema tributario para favorecer ahorro, inversión y empleo.", 21, [], ["impuestos-fiscalidad"]],
            ["Reindustrialización con fondos europeos", "Utilizar mejor los fondos europeos para fortalecer la industria y la economía real.", 23, [], ["empresa-industria"]],
            ["Pacto nacional del agua y energía", "Impulsar agua suficiente y energía limpia y asequible para hogares y empresas.", 35, [], ["agua", "energia"]]
          ]
        },
        {
          theme: "Bienestar",
          themeIds: ["servicios-publicos", "derechos-igualdad-cultura"],
          title: "Servicios públicos, salud, educación, familias y cuidados",
          description: "Fortalecimiento del Sistema Nacional de Salud, educación, conciliación, infancia, mayores, discapacidad e igualdad.",
          measures: [
            ["Agencia Española de Innovación y Calidad Sanitaria", "Crear una agencia y un sistema común para evaluar innovación y tecnologías sanitarias.", 48, [], ["sanidad-salud"]],
            ["Historia clínica digital interoperable", "Acelerar la digitalización sanitaria para coordinar la asistencia y mejorar el acceso a los recursos.", 48, [], ["sanidad-salud", "administracion-digital"]],
            ["Nueva estrategia de salud mental", "Impulsar un enfoque coordinado para la atención temprana y la salud mental.", 49, [], ["sanidad-salud"]],
            ["Recursos residenciales y adaptación de viviendas", "Apoyar viviendas compartidas, viviendas con servicios y adaptación de hogares para mayores.", 58, [], ["pensiones-cuidados", "vivienda-proximidad"]]
          ]
        },
        {
          theme: "Vivienda",
          themeIds: ["vivienda-coste"],
          title: "Vivienda, infraestructuras y cohesión territorial",
          description: "Más oferta de vivienda, suelo, alquiler, rehabilitación e infraestructuras conectadas, sostenibles y seguras.",
          measures: [
            ["Construcción y movilización de vivienda asequible", "Facilitar suelo, construir viviendas a precios asequibles y movilizar viviendas en alquiler.", 34, [], ["vivienda-proximidad"]],
            ["Avales hipotecarios para jóvenes", "Crear un programa de avales destinado a jóvenes de hasta 35 años.", 34, [], ["vivienda-proximidad"]],
            ["Rehabilitación del parque existente", "Profundizar en la rehabilitación de viviendas y mejorar su eficiencia y habitabilidad.", 34, [], ["vivienda-proximidad"]],
            ["Infraestructuras conectadas y sostenibles", "Impulsar infraestructuras con conectividad 5G y puntos de recarga para descarbonizar el transporte.", 33, [], ["infraestructuras", "transporte-infraestructuras"]]
          ]
        },
        {
          theme: "Instituciones",
          themeIds: ["instituciones-democracia", "seguridad-defensa"],
          title: "Regeneración institucional, justicia, seguridad y propiedad",
          description: "Independencia institucional, Parlamento, justicia, cooperación administrativa, seguridad y propiedad privada.",
          measures: [
            ["Limitar el uso del real decreto ley", "Reforzar la tramitación legislativa ordinaria y justificar el uso de normas de urgencia.", 73, [], ["instituciones-democracia"]],
            ["Cooperación entre administraciones", "Precisar los principios de lealtad institucional, cooperación y colaboración entre administraciones.", 78, [], ["organizacion-territorial"]],
            ["Equiparación salarial de Policía y Guardia Civil", "Culminar el acuerdo de equiparación y considerar determinadas funciones como profesión de riesgo.", 80, [], ["seguridad-interior"]],
            ["Medidas frente a la ocupación ilegal", "Agilizar los desalojos y establecer medidas fiscales y administrativas sobre viviendas ocupadas ilegalmente.", 82, [], ["seguridad-interior"]]
          ]
        },
        {
          theme: "Administración y exterior",
          themeIds: ["instituciones-democracia", "exterior-europa", "seguridad-defensa"],
          title: "Modernización de la Administración y posición internacional de España",
          description: "Administración transparente, participativa, flexible e inteligente, junto con una mayor presencia exterior.",
          measures: [
            ["Mediadores para trámites administrativos", "Permitir que profesionales y trabajadores sociales ayuden a personas vulnerables a realizar trámites.", 88, [], ["administracion-digital"]],
            ["Mejora de la transparencia", "Reforzar el acceso a la información pública y la capacidad de respuesta del Consejo de Transparencia.", 88, [], ["administracion-digital"]],
            ["España en la Unión Europea", "Reforzar el papel de España en la construcción europea y en sus prioridades estratégicas.", 97, [], ["union-europea"]],
            ["Inversión en seguridad y defensa", "Desarrollar una estrategia nacional de seguridad y defensa y reforzar la cooperación internacional.", 101, [], ["defensa-soberania"]]
          ]
        }
      ]
    },
    {
      name: "PSOE",
      description: "Programa organizado en economía, agenda verde, bienestar, derechos, cohesión territorial y política exterior.",
      sourceFile: "../PSOE-GENERALES-2023.pdf",
      priorities: [
        {
          theme: "Economía",
          themeIds: ["economia-empleo"],
          title: "Política económica, empleo, digitalización y transformación productiva",
          description: "Crecimiento justo y sostenible, pleno empleo, innovación, apoyo a empresas y autónomos, fiscalidad y economía social.",
          measures: [
            ["Sistema integrado de vacantes y perfiles", "Integrar información de vacantes, personas desempleadas y perfiles formativos.", 26, [], ["empleo-formacion"]],
            ["Inteligencia artificial para el empleo", "Utilizar herramientas de IA para alinear ofertas de empleo y perfiles de personas desempleadas.", 26, [], ["empleo-formacion"]],
            ["Microacreditaciones para la economía verde y digital", "Impulsar formación corta y recualificación para las nuevas necesidades productivas.", 26, [], ["empleo-formacion"]],
            ["Política industrial para un modelo en transformación", "Apoyar la modernización del tejido productivo y sectores estratégicos.", 45, [], ["empresa-industria"]]
          ]
        },
        {
          theme: "Transición ecológica",
          themeIds: ["medio-energia"],
          title: "Agenda verde, energía, movilidad, agua y mundo rural",
          description: "Renovables, reindustrialización verde, transporte, movilidad sostenible, agua, biodiversidad y servicios rurales.",
          measures: [
            ["Reindustrialización basada en renovables", "Desarrollar la cadena de valor de las energías renovables y nuevas oportunidades de empleo.", 72, [], ["energia", "empresa-industria"]],
            ["Impulso del ferrocarril", "Apostar por cercanías, Rodalies, alta velocidad, mercancías y corredores transeuropeos.", 76, [], ["transporte-infraestructuras"]],
            ["Derecho a un medio ambiente saludable", "Reconocer el derecho al medio ambiente y a la seguridad climática.", 87, [], ["medio-ambiente"]],
            ["Gestión eficiente del agua", "Mejorar desalación, reutilización y digitalización del ciclo del agua, preservando ecosistemas.", 73, [], ["agua"]]
          ]
        },
        {
          theme: "Educación y juventud",
          themeIds: ["servicios-publicos", "derechos-igualdad-cultura"],
          title: "Educación, formación, juventud, ciencia, universidad y cultura",
          description: "Educación a lo largo de la vida, FP, universidad, ciencia, innovación, cultura y oportunidades para jóvenes.",
          measures: [
            ["Bienestar emocional en los centros educativos", "Crear herramientas y coordinación para prevenir problemas de bienestar emocional del alumnado.", 99, [], ["educacion-conocimiento"]],
            ["Formación Profesional adaptada", "Ajustar la oferta formativa a las necesidades del mercado laboral, las personas y las empresas.", 108, [], ["educacion-conocimiento"]],
            ["Universidad pública y ciencia", "Reforzar la universidad pública y la ciencia como instrumentos de transformación y progreso.", 111, [], ["educacion-conocimiento"]],
            ["Políticas integrales para la juventud", "Combinar becas, vivienda, transporte, salud mental y empleo para mejorar oportunidades juveniles.", 128, [], ["educacion-conocimiento"]]
          ]
        },
        {
          theme: "Bienestar",
          themeIds: ["servicios-publicos", "vivienda-coste", "derechos-igualdad-cultura"],
          title: "Igualdad, bienestar, pensiones, salud y vivienda",
          description: "Igualdad, cuidados, pensiones, familias, inclusión, dependencia, sanidad pública, salud mental y vivienda.",
          measures: [
            ["Mejora del Ingreso Mínimo Vital", "Facilitar el acceso y reforzar las políticas de inclusión social vinculadas al IMV.", 190, [], ["servicios-sociales"]],
            ["Refuerzo del Sistema Nacional de Salud", "Garantizar una sanidad pública universal y de calidad en todo el territorio.", 196, [], ["sanidad-salud"]],
            ["Pacto por la salud mental", "Impulsar una estrategia pública de salud mental con especial atención a jóvenes y prevención.", 197, [], ["sanidad-salud"]],
            ["Parque público de alquiler social", "Incrementar el parque público de alquiler social con un objetivo del 20% en los próximos años.", 216, [], ["vivienda-proximidad"]]
          ]
        },
        {
          theme: "Instituciones",
          themeIds: ["instituciones-democracia", "territorio-cohesion", "migracion", "exterior-europa"],
          title: "Cohesión territorial, derechos, democracia, justicia y España europea",
          description: "España plural, cogobernanza, municipalismo, transparencia, participación, justicia, migración, cooperación y defensa.",
          searchTerms: ["inmigración", "migración", "asilo", "personas migrantes"],
          measures: [
            ["Marco renovado de cogobernanza", "Reforzar la cooperación y coordinación entre administraciones y el impulso del municipalismo.", 222, [], ["organizacion-territorial", "administracion-local"]],
            ["Rendición de cuentas y participación", "Institucionalizar la evaluación de compromisos y la participación ciudadana en la acción de gobierno.", 247, [], ["instituciones-democracia"]],
            ["Justicia centrada en las personas", "Modernizar la justicia como servicio público eficiente, sostenible y accesible.", 240, [], ["justicia"]],
            ["Políticas de migración y asilo", "Abordar la migración y el asilo dentro de las políticas de derechos, cooperación y cohesión.", 248, ["migracion"], ["migracion-asilo"]],
            ["España, motor de Europa", "Fortalecer el papel europeo, la cooperación internacional y las relaciones estratégicas.", 251, [], ["union-europea", "politica-exterior"]]
          ]
        }
      ]
    },
    {
      name: "SUMAR",
      description: "Programa centrado en democracia económica y ecosocial, trabajo, bienestar, vivienda, democracia y conocimiento.",
      sourceFile: "../SUMAR-GENERALES-2023.pdf",
      priorities: [
        {
          theme: "Economía y trabajo",
          themeIds: ["economia-empleo"],
          title: "Economía para la vida, empleo con derechos y protección laboral",
          description: "Empleo estable, poder adquisitivo, derechos laborales, protección social, economía social y dignificación del empleo público.",
          measures: [
            ["Jornada máxima de 37,5 horas", "Establecer una jornada máxima de 37,5 horas y abrir el diálogo para avanzar hacia 32 horas.", 7, [], ["empleo-formacion"]],
            ["Salario mínimo por encima del IPC", "Subir el SMI por encima del IPC para mantener el poder adquisitivo.", 7, [], ["empleo-formacion"]],
            ["Contrato indefinido como forma normal de empleo", "Hacer del contrato indefinido a tiempo completo la base de un modelo laboral estable.", 23, [], ["empleo-formacion"]],
            ["Políticas activas de empleo personalizadas", "Mejorar la formación y el acompañamiento de las personas con más dificultades de acceso al empleo.", 23, [], ["empleo-formacion"]]
          ]
        },
        {
          theme: "Transición ecológica",
          themeIds: ["medio-energia"],
          title: "Transición ecológica justa, energía, rural y alimentación",
          description: "Energía renovable, biodiversidad, economía circular, agroecología, pesca sostenible, alimentación y servicios rurales.",
          measures: [
            ["Sistema energético 100% renovable", "Avanzar hacia un sistema renovable, eficiente y democrático.", 37, [], ["energia"]],
            ["Rehabilitación energética de viviendas", "Rehabilitar 500.000 viviendas al año para reducir demanda energética y costes.", 40, [], ["vivienda-proximidad", "energia"]],
            ["Autoconsumo y comunidades energéticas", "Facilitar el autoconsumo y las comunidades energéticas locales.", 40, [], ["energia"]],
            ["Servicios de cuidados en el mundo rural", "Impulsar cuidados, centros de día, residencias y recursos de conciliación en el lugar de arraigo.", 57, [], ["pensiones-cuidados", "cohesion-territorial"]]
          ]
        },
        {
          theme: "Vivienda y movilidad",
          themeIds: ["vivienda-coste", "movilidad-infraestructuras"],
          title: "Vivienda, ciudades habitables y movilidad sostenible",
          description: "Vivienda como derecho, alquiler social, rehabilitación, regulación de alquileres y transporte público accesible.",
          measures: [
            ["Inversión sostenida del 1% del PIB en vivienda", "Invertir durante diez años en construcción, compra, movilización y rehabilitación de vivienda protegida.", 76, [], ["vivienda-proximidad"]],
            ["Regulación de alquileres en zonas tensionadas", "Aplicar regulación de alquileres y medidas de inspección y protección de arrendatarios.", 77, [], ["vivienda-proximidad"]],
            ["Bono hipotecario y portabilidad", "Crear un bono de emergencia y permitir cambiar de hipoteca variable a fija mediante portabilidad.", 78, [], ["vivienda-proximidad"]],
            ["Movilidad sostenible como derecho", "Garantizar transporte público asequible, accesible y territorialmente equitativo.", 80, [], ["transporte-infraestructuras"]]
          ]
        },
        {
          theme: "Bienestar y cuidados",
          themeIds: ["servicios-publicos", "derechos-igualdad-cultura", "migracion"],
          title: "Bienestar, cuidados, salud y derechos sociales",
          description: "Cuidados, sanidad pública, infancia, dependencia, discapacidad, juventud y migraciones.",
          searchTerms: ["inmigración", "migración", "personas migrantes", "integración"],
          measures: [
            ["Sistema público de cuidados", "Convertir los cuidados en una política pública universal y en un pilar del bienestar.", 86, [], ["pensiones-cuidados"]],
            ["Pacto por la salud", "Actualizar el Sistema Nacional de Salud, blindar su universalidad y mejorar su coordinación.", 89, [], ["sanidad-salud"]],
            ["Protección de infancia y familias", "Ampliar la protección de niños, niñas y familias dentro de una red de bienestar universal.", 93, [], ["pensiones-cuidados"]],
            ["Políticas de migración e integración", "Desarrollar políticas de migración e integración dentro de un sistema de derechos y bienestar.", 106, ["migracion"], ["migracion-asilo", "integracion-migracion"]],
            ["Envejecer con autonomía", "Reforzar apoyos para la autonomía, la dependencia y el envejecimiento seguro.", 97, [], ["pensiones-cuidados"]]
          ]
        },
        {
          theme: "Democracia y derechos",
          themeIds: ["derechos-igualdad-cultura", "instituciones-democracia", "servicios-publicos"],
          title: "Igualdad, democracia y ampliación de derechos y capacidades públicas",
          description: "Igualdad, participación, justicia, educación pública, universidad, ciencia, cultura, innovación y digitalización.",
          measures: [
            ["Ley de participación ciudadana", "Valorar e impulsar instrumentos de participación y democratización institucional.", 117, [], ["instituciones-democracia"]],
            ["Gobernanza multinivel y diálogo", "Reforzar el diálogo entre instituciones, sociedad civil y administraciones.", 117, [], ["instituciones-democracia", "organizacion-territorial"]],
            ["Educación pública de 0 a 3 años", "Universalizar la cobertura pública y gratuita de la primera etapa educativa.", 154, [], ["educacion-conocimiento"]],
            ["Financiación estructural de ciencia y universidad", "Aumentar la financiación y mejorar la gobernanza de universidad, ciencia e innovación.", 159, [], ["educacion-conocimiento"]]
          ]
        }
      ]
    },
    {
      name: "VOX",
      description: "Programa organizado en igualdad entre españoles, unidad nacional, empleo, servicios, seguridad, producción y familia.",
      sourceFile: "../VOX-GENERALES-2023.pdf",
      priorities: [
        {
          theme: "Estado y territorio",
          themeIds: ["territorio-cohesion"],
          title: "Igualdad entre españoles, unidad de España y organización territorial",
          description: "Estado unitario administrativamente descentralizado, igualdad territorial y devolución de competencias al Estado.",
          measures: [
            ["Devolución de competencias al Estado", "Devolver al Estado Educación, Sanidad, Seguridad y Justicia.", 8, [], ["organizacion-territorial"]],
            ["Unificación de procedimientos", "Unificar procesos e impulsar la interoperabilidad entre administraciones.", 8, [], ["administracion-digital"]],
            ["Limitación de la capacidad legislativa autonómica", "Reducir diferencias normativas y garantizar igualdad de derechos entre territorios.", 8, [], ["organizacion-territorial"]],
            ["Unidad de España", "Situar la unidad nacional como garantía de derechos e igualdad territorial.", 15, [], ["organizacion-territorial"]]
          ]
        },
        {
          theme: "Economía y producción",
          themeIds: ["economia-empleo"],
          title: "Empleo, salarios, fiscalidad, producción nacional y soberanía energética",
          description: "Empleo estable, reducción de impuestos y burocracia, producción nacional, reindustrialización y energía soberana.",
          measures: [
            ["Bonificación del empleo estable", "Promover el empleo estable y duradero mediante incentivos a la contratación indefinida.", 21, [], ["empleo-formacion"]],
            ["Reducción de impuestos y burocracia", "Bajar la presión fiscal y recortar gasto político considerado innecesario.", 73, [], ["impuestos-fiscalidad"]],
            ["Protección de la producción nacional", "Apoyar agricultores, ganaderos, pescadores e industrias nacionales.", 47, [], ["produccion-rural", "empresa-industria"]],
            ["Reindustrialización y soberanía energética", "Proteger empresas nacionales y fomentar energía asequible, eficiente y limpia.", 115, [], ["energia", "empresa-industria"]]
          ]
        },
        {
          theme: "Servicios y familia",
          themeIds: ["servicios-publicos", "vivienda-coste", "derechos-igualdad-cultura"],
          title: "Educación, vivienda, salud y protección social",
          description: "Educación nacional, libertad de elección familiar, acceso a vivienda, salud, dependencia, pensiones y protección social.",
          measures: [
            ["Ley Nacional de Educación", "Aprobar un marco nacional orientado a educación gratuita, exigente y de calidad.", 31, [], ["educacion-conocimiento"]],
            ["Libertad de elección educativa", "Garantizar a las familias capacidad de elección del modelo educativo.", 31, [], ["educacion-conocimiento"]],
            ["Acceso asequible a la vivienda", "Aumentar la oferta, facilitar suelo y mejorar el acceso a vivienda habitual.", 39, [], ["vivienda-proximidad"]],
            ["Sistema Nacional de Salud único", "Recuperar competencias sanitarias transferidas para establecer un sistema único, igual y de calidad en toda España.", 56, [], ["sanidad-salud"], 101],
            ["Plan Nacional de Sanidad y tarjeta sanitaria única", "Elaborar un plan nacional con tarjeta sanitaria única, historia clínica y farmacéutica digital y una cartera común de servicios.", 56, [], ["sanidad-salud", "administracion-digital"], 102],
            ["Más inversión y compras sanitarias centralizadas", "Aumentar la inversión sanitaria, mejorar la gestión y crear un sistema de compras centralizado y transparente.", 56, [], ["sanidad-salud", "finanzas-publicas"], 103],
            ["Libertad de elección de médico y centro", "Establecer mecanismos de evaluación nacional para facilitar la elección informada de médico y centro.", 56, [], ["sanidad-salud"], 104],
            ["Sistema nacional de Formación Sanitaria Especializada", "Mantener y potenciar un sistema nacional de formación especializada para las profesiones sanitarias.", 56, [], ["sanidad-salud", "educacion-conocimiento"], 105],
            ["Requisito lingüístico común para plazas sanitarias", "Defender un requisito lingüístico común para el acceso por oposición a plazas de personal sanitario.", 57, [], ["sanidad-salud"], 106],
            ["Refuerzo de la Atención Primaria y rural", "Incrementar la inversión en Atención Primaria, con atención presencial y domiciliaria y especial atención a las zonas rurales.", 57, [], ["sanidad-salud", "cohesion-territorial"], 107],
            ["Medios para centros de Atención Primaria", "Dotar de medios humanos y materiales a los centros de Atención Primaria, incluidos los ámbitos rurales y barrios saturados.", 57, [], ["sanidad-salud", "cohesion-territorial"], 108],
            ["Reducción de listas de espera", "Reducir el volumen y el tiempo de las listas de espera mediante medidas de gestión y colaboración sanitaria.", 57, [], ["sanidad-salud"], 109],
            ["Refuerzo de la Estrategia Nacional del Cáncer", "Reforzar la investigación, el diagnóstico precoz y el acceso a tratamientos innovadores mediante una red nacional de oncología.", 57, [], ["sanidad-salud"], 110],
            ["Investigación en enfermedades raras y crónicas", "Promover la investigación médica sobre enfermedades raras, crónicas y neurodegenerativas.", 58, [], ["sanidad-salud"], 111],
            ["Refuerzo de la Estrategia Nacional de Salud Mental", "Reforzar la prevención y priorizar la salud mental, la prevención del suicidio, los trastornos alimentarios, el autismo y las adicciones.", 58, [], ["sanidad-salud"], 112],
            ["Legislación sanitaria y cuidados paliativos", "Aprobar legislación sanitaria y una ley de cuidados paliativos, junto con las medidas sobre vida, natalidad y familia recogidas en el programa.", 58, [], ["sanidad-salud", "familia-conciliacion"], 113],
            ["Salud bucodental y oftalmológica", "Incluir prestaciones bucodentales y oftalmológicas en la cartera de servicios y definir las intervenciones sanitarias que el programa considera propias de la salud.", 58, [], ["sanidad-salud"], 114],
            ["Igualdad, mérito y capacidad del personal sanitario", "Aplicar estos principios en la selección, el acceso y la promoción del personal sanitario.", 58, [], ["sanidad-salud"], 115],
            ["Condiciones laborales y conciliación sanitaria", "Mejorar las condiciones laborales, reducir la precariedad y facilitar la retención de talento y la conciliación del personal sanitario.", 58, [], ["sanidad-salud", "empleo-formacion"], 116],
            ["Libertad de conciencia del personal sanitario", "Garantizar la libertad de conciencia del personal sanitario en las actuaciones que el programa identifica.", 59, [], ["sanidad-salud", "derechos-igualdad"], 117],
            ["Soberanía sanitaria e industria nacional", "Fortalecer la industria nacional de tecnología sanitaria y medicamentos y reforzar la AEMPS.", 59, [], ["sanidad-salud", "empresa-industria"], 118],
            ["Reforma de la Organización Mundial de la Salud", "Impulsar una reforma de la OMS para reforzar su función de coordinación y apoyo científico a los Estados.", 59, [], ["sanidad-salud", "politica-exterior"], 119],
            ["Oposición al pasaporte verde y al tratado de pandemias", "Oponerse a medidas y acuerdos internacionales que, según el programa, puedan transferir decisiones sanitarias críticas a organizaciones supranacionales.", 59, [], ["sanidad-salud", "politica-exterior"], 120],
            ["Preferencia sanitaria para españoles y residentes legales", "Establecer los criterios de acceso sanitario que el programa propone para españoles, residentes legales y personas en situación irregular.", 59, [], ["sanidad-salud", "migracion-asilo"], 121]
          ]
        },
        {
          theme: "Seguridad y justicia",
          themeIds: ["seguridad-defensa", "migracion"],
          title: "Seguridad, inmigración, identidad nacional y justicia",
          description: "Seguridad y defensa, inmigración legal y ordenada, libertad de expresión y justicia independiente.",
          measures: [
            ["Más medios para seguridad y defensa", "Dotar a Fuerzas Armadas y cuerpos de seguridad de medios humanos, materiales y legales.", 89, [], ["defensa-soberania", "seguridad-interior"]],
            ["Inmigración legal y ordenada", "Establecer una política de inmigración orientada a la legalidad, el orden y la integración.", 99, ["migracion"], ["migracion-asilo", "integracion-migracion"]],
            ["Jueces eligen a los jueces", "Reforzar la independencia judicial frente a la presión partidista.", 125, [], ["justicia"]],
            ["Defensa de la libertad de expresión", "Proteger la libertad de expresión y limitar medidas que el documento considera restricciones ideológicas.", 155, [], ["derechos-igualdad"]]
          ]
        },
        {
          theme: "Medio ambiente y familia",
          themeIds: ["medio-energia", "derechos-igualdad-cultura"],
          title: "Medio ambiente, mundo rural y familia",
          description: "Protección ambiental compatible con desarrollo económico, campo, soberanía alimentaria, energía y apoyo a familias.",
          measures: [
            ["Protección ambiental compatible con desarrollo", "Compatibilizar cuidado del patrimonio natural y desarrollo económico.", 107, [], ["medio-ambiente"]],
            ["Recursos naturales y energía nacional", "Promover el uso de recursos propios y una energía considerada asequible y soberana.", 115, [], ["energia"]],
            ["Defensa del mundo rural", "Proteger el campo, su actividad económica, sus tradiciones y sus servicios.", 147, [], ["cohesion-territorial", "produccion-rural"]],
            ["Apoyo transversal a la familia", "Situar la familia como prioridad en las políticas económicas y sociales.", 161, [], ["familia-conciliacion"]]
          ]
        }
      ]
    }
  ]
};
