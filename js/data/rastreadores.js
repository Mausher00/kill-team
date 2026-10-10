// ============================================================
//  data/rastreadores.js — Rastreadores
//  Generado desde el PDF oficial: Pathfinders
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['rastreadores'] = {
  id: "rastreadores",
  name: "Rastreadores",
  subfaction: "Imperio T'au",
  icon: "🎯",
  img: "imagenes/rastreadores.png",
  desc: "Exploradores t'au que marcan blancos con telémetros y coordinan un enjambre de drones de apoyo.",
  tags: ["T'au", "Infiltración", "Reconocimiento"],
  version: "Agosto 2026",
  source: "Pathfinders",
  ops: [
    {
      id: "shasui",
      name: "Rastreador Shas’ui",
      type: "SHAS’UI",
      img: "imagenes/rastreadores-img/rastreador-shasui.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 8 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "LÍDER", "SHAS’UI"],
      w: [{ n: "Carabina de inducción", a: 4, i: "3+", d: "4/5", r: [] }, { n: "Culata", a: 3, i: "4+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Arte de la guerra",
          t: "GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación. Elige una de las siguientes opciones y aplica sus reglas hasta el final del punto de inflexión. No puedes elegir cada opción más de una vez por batalla:\n• Mont’ka: Suma 1\" al atributo Movimiento de los agentes RASTREADOR amigos.\n• Kauyon: Los agentes RASTREADOR amigos pueden realizar una acción libre de Marcador telemétrico durante su activación si tienen una orden de ocultarse.",
        },
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
      ],
    },
    {
      id: "granadero-de-asalto",
      name: "Rastreador Granadero de Asalto",
      type: "GRANADERO DE ASALTO",
      img: "imagenes/rastreadores-img/rastreador-granadero-de-asalto.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "GRANADERO DE ASALTO"],
      w: [
        { n: "Granada fundidora", a: 4, i: "3+", d: "4/3", r: ["Alcance 6\"", "Devastadora 2", "Limitada 1", "Penetración 2", "Saturación"] },
        { n: "Carabina de inducción", a: 4, i: "4+", d: "4/5", r: [] },
        { n: "Culata", a: 3, i: "5+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Especialista granadero",
          t: "Este agente puede usar granadas frag y perforantes (ver equipo universal). Eso no cuenta para su límite de usos (p. ej. si también has seleccionado esas granadas como equipo para otros agentes). Cuando haga tal cosa, mejora en 1 el atributo Impactar de esa arma.",
        },
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
      ],
    },
    {
      id: "aguerrido",
      name: "Rastreador Aguerrido",
      type: "AGUERRIDO",
      img: "imagenes/rastreadores-img/rastreador-aguerrido.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 8 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "AGUERRIDO"],
      w: [
        { n: "Carabina de inducción silenciada", a: 4, i: "3+", d: "4/5", r: ["Silenciosa"] },
        { n: "Brazo biónico", a: 3, i: "4+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Veterano",
          t: "Durante un punto de inflexión en el que has usado el GAMBITO ESTRATÉGICO Arte de la guerra de un agente SHAS’UI amigo y hayas elegido Mont’ka, en lugar de eso este agente puede usar Kauyon durante su activación (y viceversa).",
        },
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
      ],
    },
    {
      id: "tecnico-de-comunicaciones",
      name: "Rastreador Técnico de Comunicaciones",
      type: "TÉCNICO DE COMUNICACIONES",
      img: "imagenes/rastreadores-img/rastreador-tecnico-de-comunicaciones.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "TÉCNICO DE COMUNICACIONES"],
      w: [{ n: "Carabina de inducción", a: 4, i: "4+", d: "4/5", r: [] }, { n: "Puños", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
        {
          n: "Señal (1PA)",
          t: "APOYO. Elige un agente RASTREADOR amigo distinto a 6\" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "controlador-de-drones",
      name: "Rastreador Controlador de Drones",
      type: "CONTROLADOR DE DRONES",
      img: "imagenes/rastreadores-img/rastreador-controlador-de-drones.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "CONTROLADOR DE DRONES"],
      w: [{ n: "Carabina de inducción", a: 4, i: "4+", d: "4/5", r: [] }, { n: "Culata", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Controlador de drones",
          t: "Mientras este agente esté en la zona de aniquilación:\n• Suma 2\" al atributo Movimiento de los agentes DRON RASTREADOR amigos.\n• El ardid de tiroteo Protocolos de salvamento te cuesta 0PM.",
        },
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
        {
          n: "Pilotaje Remoto (1PA)",
          t: "Un agente DRON RASTREADOR amigo puede realizar de inmediato una acción libre, pero no puede mover más de 2\" durante esa acción. Esa acción puede ser una que normalmente esté restringida por su regla de dron (esto tiene preferencia sobre dicha regla). Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo. Este agente puede realizar esta acción más de una vez durante su activación pero, si lo hace, el mismo agente DRON no podrá realizar la misma acción libre más de una vez por activación.",
          isAct: true,
        },
      ],
    },
    {
      id: "ojo-preciso",
      name: "Rastreador Ojo Preciso",
      type: "OJO PRECISO",
      img: "imagenes/rastreadores-img/rastreador-ojo-preciso.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "OJO PRECISO"],
      w: [
        { n: "Rifle acelerador de precisión (normal)", a: 4, i: "3+", d: "4/4", r: ["Devastadora 2", "Letal 5+", "Penetración 1"] },
        { n: "Rifle acelerador de precisión (dardos)", a: 4, i: "3+", d: "3/4", r: ["Penetración 1", "Silenciosa"] },
        { n: "Culata", a: 3, i: "5+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Amortiguador de inercia",
          t: "Puedes ignorar algunos o todos los cambios al atributo Impactar del rifle acelerador de precisión de este agente.",
        },
      ],
    },
    {
      id: "tecnico-sanitario",
      name: "Rastreador Técnico Sanitario",
      type: "TÉCNICO SANITARIO",
      img: "imagenes/rastreadores-img/rastreador-tecnico-sanitario.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T’AU", "MÉDICO", "TÉCNICO SANITARIO"],
      w: [{ n: "Carabina de inducción", a: 4, i: "4+", d: "4/5", r: [] }, { n: "Culata", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        {
          n: "¡Sanitario!",
          t: "La primera vez durante cada punto de inflexión que otro agente RASTREADOR amigo (salvo DRON) vaya a resultar incapacitado mientras era visible para este agente y estaba a 3” o menos de él, puedes usar esta regla siempre que ni este ni ese agente estén en la zona de control de algún agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le queda 1 herida y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede entonces realizar inmediatamente una acción libre de CORRER, pero debe terminar ese movimiento en la zona de control de este agente. Resta 1 a los atributos LPA de este y de ese agente hasta el final de sus próximas activaciones respectivamente, y si esta regla fue usada durante la activación de ese agente amigo, esa activación termina. No puedes usar esta regla si este agente está incapacitado, o si es una acción de DISPARAR y este agente iba a ser el blanco primario o secundario.",
        },
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
        {
          n: "Botiquín (1PA)",
          t: "Elige un agente RASTREADOR amigo (salvo DRON) en la zona de control de este agente para que recupere hasta 2D3 heridas perdidas. No puede ser un agente con el que se haya usado la regla ¡Sanitario! durante este punto de inflexión. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "shasla",
      name: "Rastreador Shas’la",
      type: "SHAS’LA",
      img: "imagenes/rastreadores-img/rastreador-shasla.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "SHAS’LA"],
      w: [{ n: "Carabina de inducción", a: 4, i: "4+", d: "4/5", r: [] }, { n: "Culata", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Activación en grupo",
          t: "Cuando este agente quede usado, debes activar a continuación otro agente SHAS’LA RASTREADOR amigo apostado (si es posible) antes de que active tu oponente. En cuanto ese otro agente quede usado, tu oponente activa de manera normal (es decir, no puedes activar más de dos agentes sucesivos mediante esta regla).",
        },
        {
          n: "Valor en primera línea",
          t: "Este agente puede realizar la acción de Marcador telemétrico aún estando en la zona de control de un agente enemigo (lo cuál tiene preferencia sobre las condiciones normales de la acción Marcador telemétrico ). Además, este agente puede realizar la acción de Retroceder por 1PA menos.",
        },
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
      ],
    },
    {
      id: "interferidor-transpectral",
      name: "Rastreador Interferidor Transpectral",
      type: "INTERFERIDOR TRANSPECTRAL",
      img: "imagenes/rastreadores-img/rastreador-interferidor-transpectral.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "INTERFERIDOR TRANSPECTRAL"],
      w: [{ n: "Carabina de inducción", a: 4, i: "4+", d: "4/5", r: [] }, { n: "Culata", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
        {
          n: "Interferir Sistemas (1PA)",
          t: "Elige un agente enemigo visible para este agente. Hasta el final de la siguiente activación de ese agente, resta 1 a su atributo LPA. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo, o si tiene una orden de ocultarse.",
          isAct: true,
        },
        { n: "Visión multidimensional", t: "Siempre que este agente dispara, los agentes enemigos no pueden estar ofuscados." },
      ],
    },
    {
      id: "experto-en-armas",
      name: "Rastreador Experto en Armas",
      type: "EXPERTO EN ARMAS",
      img: "imagenes/rastreadores-img/rastreador-experto-en-armas.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "EXPERTO EN ARMAS"],
      w: [
        { n: "Rifle acelerador", a: 4, i: "4+", d: "4/4", r: ["Devastadora 2", "Letal 5+", "Penetración 1"] },
        { n: "Rifle iónico (normal)", a: 5, i: "4+", d: "4/5", r: ["Críticos de penetración 1"] },
        { n: "Rifle iónico (sobrecarga)", a: 5, i: "4+", d: "4/5", r: ["Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Culata", a: 3, i: "5+", d: "2/3", r: [] },
      ],
      ru: [],
    },
    {
      id: "dron-de-reconocimiento-mb3",
      name: "Dron de Reconocimiento MB3",
      type: "DRON DE RECONOCIMIENTO MB3",
      img: "imagenes/rastreadores-img/dron-de-reconocimiento-mb3.jpg",
      s: { lpa: 3, mov: "6\"", salv: "4+", h: 12 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "DRON DE RECONOCIMIENTO MB3", "DRON"],
      w: [
        { n: "Cañón rotativo (concentrado)", a: 5, i: "4+", d: "3/4", r: ["Castigadora", "Incesante", "Pesada (solo Reposicionarse)"] },
        { n: "Cañón rotativo (barrido)", a: 4, i: "4+", d: "3/4", r: ["Castigadora", "Incesante", "Pesada (solo Reposicionarse)", "Ráfaga 1\""] },
        { n: "Topetazo", a: 3, i: "5+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Analizar",
          t: "Siempre que este agente realice la acción de Marcador telemétrico, cada otro agente enemigo visible para este agente y que esté a 3\" o menos del agente enemigo que hayas elegido para esa acción gana también una de tus fichas de Marcador telemétrico.",
        },
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
        {
          n: "Dron",
          t: "• Este agente no puede realizar acciones que no sean Cargar, Combatir, Correr, Disparar, Marcador telemétrico, Reposicionarse o Retroceder, ni puede usar armas que no figuren en su tarjeta de datos.\n• Al determinar el control de un marcador de objetivo, trata el atributo LPA de este agente como si fuera 1 menos. Esto no es un cambio al atributo LPA, así que es acumulativo a otros cambios.\n• Al determinar qué es visible para este agente, el disco redondo en la parte superior de la miniatura es su cabeza.",
        },
      ],
    },
    {
      id: "dron-de-combate-mv1",
      name: "Dron de Combate MV1",
      type: "DRON DE COMBATE MV1",
      img: "imagenes/rastreadores-img/dron-de-combate-mv1.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "DRON DE COMBATE MV1", "DRON"],
      w: [{ n: "Carabina de inducción doble", a: 4, i: "4+", d: "4/5", r: ["Incesante"] }, { n: "Topetazo", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Dron",
          t: "• Este agente no puede realizar acciones que no sean Cargar, Combatir, Correr, Disparar, Marcador telemétrico, Reposicionarse o Retroceder, ni puede usar armas que no figuren en su tarjeta de datos.\n• Al determinar el control de un marcador de objetivo, trata el atributo LPA de este agente como si fuera 1 menos. Esto no es un cambio al atributo LPA, así que es acumulativo a otros cambios.\n• Al determinar qué es visible para este agente, el disco redondo en la parte superior de la miniatura es su cabeza.",
        },
      ],
    },
    {
      id: "dron-de-defensa-mv4",
      name: "Dron de Defensa MV4",
      type: "DRON DE DEFENSA MV4",
      img: "imagenes/rastreadores-img/dron-de-defensa-mv4.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "DRON DE DEFENSA MV4", "DRON"],
      w: [{ n: "Topetazo", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Dron",
          t: "• Este agente no puede realizar acciones que no sean Cargar, Combatir, Correr, Disparar, Marcador telemétrico, Reposicionarse o Retroceder, ni puede usar armas que no figuren en su tarjeta de datos.\n• Al determinar el control de un marcador de objetivo, trata el atributo LPA de este agente como si fuera 1 menos. Esto no es un cambio al atributo LPA, así que es acumulativo a otros cambios.\n• Al determinar qué es visible para este agente, el disco redondo en la parte superior de la miniatura es su cabeza.",
        },
        {
          n: "Generador de escudos",
          t: "• Este agente ignora la regla de arma Penetración.\n• Una vez por punto de inflexión, cuando un dado de ataque inflija daño normal a este agente, puedes ignorar ese daño infligido.\n• Puedes usar el ardid de tiroteo Protocolos de salvamento por 0PM si este agente es el agente DRON especificado.",
        },
      ],
    },
    {
      id: "dron-telemetrico-mv7",
      name: "Dron Telemétrico MV7",
      type: "DRON TELEMÉTRICO MV7",
      img: "imagenes/rastreadores-img/dron-telemetrico-mv7.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "DRON TELEMÉTRICO MV7", "DRON"],
      w: [{ n: "Topetazo", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Marcador telemétrico de alta intensidad",
          t: "Siempre que este agente realice la acción de Marcador telemétrico, el agente enemigo elegido ganará dos de tus fichas de Marcador telemétrico (en lugar de uno).",
        },
        { n: "Marcador Telemétrico (1PA)", t: "Ver la regla de facción Marcadores telemétricos.", isAct: true },
        {
          n: "Dron",
          t: "• Este agente no puede realizar acciones que no sean Cargar, Combatir, Correr, Disparar, Marcador telemétrico, Reposicionarse o Retroceder, ni puede usar armas que no figuren en su tarjeta de datos.\n• Al determinar el control de un marcador de objetivo, trata el atributo LPA de este agente como si fuera 1 menos. Esto no es un cambio al atributo LPA, así que es acumulativo a otros cambios.\n• Al determinar qué es visible para este agente, el disco redondo en la parte superior de la miniatura es su cabeza.",
        },
      ],
    },
    {
      id: "dron-acelerador-de-induccion-mv31",
      name: "Dron Acelerador de Inducción MV31",
      type: "DRON ACELERADOR DE INDUCCIÓN MV31",
      img: "imagenes/rastreadores-img/dron-acelerador-de-induccion-mv31.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "DRON ACELERADOR DE INDUCCIÓN MV31", "DRON"],
      w: [{ n: "Topetazo", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Dron",
          t: "• Este agente no puede realizar acciones que no sean Cargar, Combatir, Correr, Disparar, Marcador telemétrico, Reposicionarse o Retroceder, ni puede usar armas que no figuren en su tarjeta de datos.\n• Al determinar el control de un marcador de objetivo, trata el atributo LPA de este agente como si fuera 1 menos. Esto no es un cambio al atributo LPA, así que es acumulativo a otros cambios.\n• Al determinar qué es visible para este agente, el disco redondo en la parte superior de la miniatura es su cabeza.",
        },
        {
          n: "Acelerador de Inducción (1PA)",
          t: "Hasta el inicio de la siguiente activación de este agente, o hasta que quede incapacitado (lo que ocurra antes), cuando otro agente RASTREADOR amigo dispare con un arma de inducción a 3\" o menos de este agente, dicha arma tiene las reglas de arma Letal 5+ y Severa.",
          isAct: true,
        },
      ],
    },
    {
      id: "dron-antigravedad-mv33",
      name: "Dron Antigravedad MV33",
      type: "DRON ANTIGRAVEDAD MV33",
      img: "imagenes/rastreadores-img/dron-antigravedad-mv33.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["RASTREADOR", "IMPERIO T'AU", "DRON ANTIGRAVEDAD MV33", "DRON"],
      w: [{ n: "Topetazo", a: 3, i: "5+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Dron",
          t: "• Este agente no puede realizar acciones que no sean Cargar, Combatir, Correr, Disparar, Marcador telemétrico, Reposicionarse o Retroceder, ni puede usar armas que no figuren en su tarjeta de datos.\n• Al determinar el control de un marcador de objetivo, trata el atributo LPA de este agente como si fuera 1 menos. Esto no es un cambio al atributo LPA, así que es acumulativo a otros cambios.\n• Al determinar qué es visible para este agente, el disco redondo en la parte superior de la miniatura es su cabeza.",
        },
        {
          n: "Inhibidor de gravedad",
          t: "• Siempre que un agente enemigo realice una acción en la que se mueva (salvo Correr), si fuera a moverse a un punto a 6\" o menos de este agente y visible para él, trata la distancia como 2\" adicionales e ignora las distancias adicionales de las reglas de terreno Obstructor y Accesible.\n• Siempre que un agente enemigo combate o contraataca estando a 6\" o menos de este agente y visible para él, empeora en 1 el atributo Impactar de las armas de combate de ese agente enemigo. Esto se acumula con estar lesionado.",
        },
      ],
    },
  ],
  fr: {
    name: "Marcadores telemétricos",
    type: "REGLA DE FACCIÓN",
    text: "Algunos agentes RASTREADOR pueden realizar la acción única de Marcador telemétrico (esto se indica en su tarjeta de datos):",
    orders: [
      {
        n: "Marcador telemétrico (1PA)",
        t: "Elige un agente enemigo visible para este agente. Dicho agente enemigo gana una de tus fichas de Marcador telemétrico (hasta un máximo de cuatro). Un agente no puede realizar esta acción si está en la zona de control de agentes enemigos. Si un agente (salvo DRON DE RECONOCIMIENTO MB3) realiza una acción de Disparar (salvo Ponerse en guardia) y esta acción durante la misma activación, solo puede tomar como blanco de esta acción al blanco de la acción de Disparar (y viceversa).",
      },
    ],
  },
  frs: [
    {
      name: "Marcadores telemétricos",
      text: "Algunos agentes RASTREADOR pueden realizar la acción única de Marcador telemétrico (esto se indica en su tarjeta de datos):",
      subs: [
        {
          n: "Marcador telemétrico (1PA)",
          t: "Elige un agente enemigo visible para este agente. Dicho agente enemigo gana una de tus fichas de Marcador telemétrico (hasta un máximo de cuatro). Un agente no puede realizar esta acción si está en la zona de control de agentes enemigos. Si un agente (salvo DRON DE RECONOCIMIENTO MB3) realiza una acción de Disparar (salvo Ponerse en guardia) y esta acción durante la misma activación, solo puede tomar como blanco de esta acción al blanco de la acción de Disparar (y viceversa).",
        },
      ],
    },
  ],
  pl: {
    s: [
      {
        n: "Barrido de reconocimiento",
        t: "Elige un borde de la zona de aniquilación (salvo el tuyo propio). Cada agente RASTREADOR amigo que se encuentre a 6\" o menos de ese borde puede realizar de inmediato una acción libre de Correr, pero debe terminar dicho movimiento completamente a 6\" o menos de un borde de la zona de aniquilación (salvo el tuyo propio). No puedes usar este ardid durante el primer punto de inflexión.",
      },
      {
        n: "Fuego de supresión",
        t: "Cuando un agente enemigo realice una acción de Disparar, si el blanco (el blanco principal si el arma tiene las reglas de arma Área o Ráfaga) no es el blanco válido más cercano, tu oponente no puede repetir sus dados de ataque. Al determinar esto, ignora a los agentes RASTREADOR amigos que tengan una orden de ocultarse o estén ofuscados.",
      },
      {
        n: "Vínculo",
        t: "Cuando un agente RASTREADOR amigo (salvo DRON) dispare o contraataque con un arma a distancia (ver el ardid de tiroteo Descarga a bocajarro), si está a 3\" o menos de otro agente RASTREADOR amigo (salvo DRON), las armas a distancia de ese primer agente amigo tienen la regla de arma Certera 1.",
      },
      {
        n: "¡A cubierto!",
        t: "Cuando un agente dispare contra un agente RASTREADOR amigo, si puedes guardar alguna salvación por cobertura, mejora en 1 el atributo Salvación de ese agente amigo.",
      },
    ],
    f: [
      {
        n: "Una causa valiosa",
        t: "Usa este ardid de tiroteo al inicio de la fase de tiroteo. Un agente RASTREADOR amigo (salvo DRON) puede realizar de inmediato una acción libre de misión.",
      },
      {
        n: "Fuego de apoyo",
        t: "Usa este ardid de tiroteo cuando un agente RASTREADOR amigo realice una acción de Disparar y elijas un blanco válido a 6\" o menos del mismo. Tener a otros agentes RASTREADOR amigos en la zona de control de un agente enemigo no impide elegir a ese agente enemigo.",
      },
      {
        n: "Protocolos de salvamento",
        t: "Usa este ardid de tiroteo cuando un agente RASTREADOR amigo (salvo DRON) sea elegido como blanco válido de una acción de Disparar. Elige un agente DRON RASTREADOR amigo a 3\" o menos de ese primer agente amigo y visible para él, para que se convierta en el blanco válido en su lugar del otro (aunque normalmente no fuera válido para ello). Ese agente DRON amigo solo está en cobertura u ofuscado si el blanco original lo está. Este ardid no tiene efecto si el arma a distancia tiene las reglas de arma Área o Ráfaga.",
      },
      {
        n: "Descarga a bocajarro",
        t: "Usa este ardid de tiroteo cuando un agente RASTREADOR amigo (salvo DRON) contraataque, si al inicio de esa activación o reacción no estaba en la zona de control de agentes enemigos. Puedes usar una de sus armas a distancia como arma de combate (salvo un arma que incluya la palabra “granada” en su nombre) durante esa secuencia. Si lo haces, no puedes bloquear durante esa secuencia, y las siguientes reglas de arma no tienen efecto en sus armas hasta el final de esa secuencia: Devastadora, Penetración, Ráfaga. Si ese agente amigo está apostado, tiene una orden de trabarse y está contraatacando con un arma de inducción, resuelves tú el primer dado de ataque (es decir, el defensor antes que el atacante).",
      },
    ],
  },
  eq: [
    {
      n: "Visor de análisis de tiro",
      t: "Una vez por punto de inflexión, cuando un agente RASTREADOR amigo (salvo DRON) esté realizando una acción de Disparar y estés eligiendo un blanco válido, puedes usar esta regla. Si lo haces, hasta el final de esa acción, si el blanco tiene al menos una de tus fichas de Marcador telemétrico, se le trata como si tuviera una más. Si el arma a distancia tiene la regla de arma Área o Ráfaga, solo se ve afectado el blanco principal.",
    },
    {
      n: "Marcador telemétrico de alta intensidad",
      t: "Hasta dos veces por punto de inflexión, cuando un agente RASTREADOR amigo (salvo DRON TELEMÉTRICO MV7) realice una acción de Marcador telemétrico, puedes usar esta regla. Si lo haces, el agente enemigo que has elegido gana dos de tus fichas de Marcador telemétrico (en lugar de una).",
    },
    {
      n: "Granada fotónica",
      t: "Una vez por punto de inflexión, un agente RASTREADOR amigo que tenga la acción de Marcador telemétrico en su tarjeta de datos (salvo DRON) puede realizar la siguiente acción única:\n▸ 1PA: Elige un agente enemigo visible para este agente y tira 1D6: con 3+, hasta el final de la siguiente activación de ese agente, resta 2\" a su atributo Movimiento. Un agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
    },
    {
      n: "Enlace de rastreo orbital",
      t: "Una vez por punto de inflexión, cuando un agente RASTREADOR amigo realice la acción de Marcador telemétrico, puedes usar esta regla. Si lo haces, en su lugar puedes elegir un agente enemigo en la zona de aniquilación para que gane una de tus fichas de Marcador telemétrico (no necesita ser visible). Esto no es acumulativo con las reglas Marcador telemétrico de alta intensidad o Analizar.",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Agosto 2026",
      ee: [
        {
          s: "Reglas de facción, marcadores telemétricos",
          t: "Se añade esta línea al final de la tabla: Fichas de Marcador telemétrico - Reglas adicionales Regla de arma Buscadora",
        },
        {
          s: "Ardid de tiroteo, protocolos de salvamento",
          t: "Añade este texto entre la segunda y la tercera frase: “Ese agente DRON amigo solo está en cobertura u ofuscado si el blanco original lo está\".",
        },
        {
          s: "Ardides de tiroteo, descarga a bocajarro",
          t: "Añade este texto al final del párrafo: “Si ese agente amigo está apostado, tiene una orden de trabarse y está contraatacando con un arma de inducción, resuelves tú el primer dado de ataque (es decir, el defensor antes que el atacante)\".",
        },
        {
          s: "Ardides de estrategia, barrido de reconocimiento",
          t: "Añade este texto al final del párrafo: “No puedes usar este ardid durante el primer punto de inflexión.”",
        },
        {
          s: "Reglas de facción, marcadores telemétricos",
          t: "Cambia la regla adicional del 1 de la tabla de Fichas de marcador telemétrico a: \"Reglas de arma Saturación y Equilibrada\". Cambia la regla adicional del 2 de la tabla de Fichas de marcador telemétrico a: “Mejora en 1 el atributo Imp de las armas a distancia de ese agente amigo (hasta un máximo de 3+)\".",
        },
        {
          s: "Equipo de facción, granada fotónica",
          t: "Cambia el efecto de la acción a: \"Elige 1 agente enemigo visible para este agente y tira 1D6. Con 3+, hasta el final de la siguiente activación de ese agente, resta 2\" a su atributo Movimiento y no puede realizar la acción de Correr\".",
        },
        {
          s: "Equipo de facción, marcador telemétrico de alta intensidad",
          t: "Cambia la parte relevante de la primera frase por: “Hasta dos veces por punto de inflexión, cuando [...]”",
        },
        {
          s: "Agente shas’ui, regla arte de la guerra",
          t: "Cambia la primera frase a: “GAMBITO ESTRATÉGICO una vez por batalla si este agente está en la zona de aniquilación. Elige 1 de las siguientes opciones y aplica sus reglas hasta el final del punto de inflexión. No puedes elegir cada opción más de una vez por batalla:”",
        },
        {
          s: "Agente interferidor transpectral",
          t: "Elimina la acción \"Visión multidimensional\" y añade la regla adicional \"Visión multidimensional\".",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Agente rastreador técnico sanitario; regla ¡sanitario!",
          t: "Cambia a: “La primera vez durante cada punto de inflexión que otro agente RASTREADOR amigo (salvo DRON vaya a resultar incapacitado mientras es visible para este agente y está a 3\" o menos de él, puedes usar esta regla siempre que ni este ni ese agente estén en la zona de control de algún agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le queda 1 herida y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede entonces realizar inmediatamente una acción libre de Correr, pero debe terminar ese movimiento en la zona de control de este agente. Resta 1 a los atributos LPA de este y de ese agente hasta el final de sus próximas activaciones respectivamente, y si esta regla fue usada durante la activación de ese agente amigo, esa activación termina. No puedes usar esta regla si este agente está incapacitado, o si es una acción de Disparar y este agente iba a ser el blanco primario o secundario”.",
        },
        {
          s: "Agente dron antigravedad mv33, regla inhibidor de gravedad",
          t: "Cambia el primer punto a: “Siempre que un agente enemigo realice una acción en la que se mueva (salvo Correr), si fuera a moverse a un punto a 6\" o menos de este agente y visible para él, trata la distancia como 2\" adicionales e ignora las distancias adicionales de las reglas de terreno Obstructor y Accesible\".",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Infiltración", "Reconocimiento"],
    required: [{ type: "SHAS’UI", count: 1 }],
    pool: {
      slots: 11,
      note: "Salvo Shas’la y Expertos en armas, cada agente solo una vez. Hasta dos Expertos en armas. El Dron de reconocimiento MB3 cuenta como dos selecciones.",
      entries: [
        { type: "GRANADERO DE ASALTO", max: 1 },
        { type: "AGUERRIDO", max: 1 },
        { type: "TÉCNICO DE COMUNICACIONES", max: 1 },
        { type: "CONTROLADOR DE DRONES", max: 1 },
        { type: "OJO PRECISO", max: 1 },
        { type: "TÉCNICO SANITARIO", max: 1 },
        { type: "SHAS’LA", max: null },
        { type: "INTERFERIDOR TRANSPECTRAL", max: 1 },
        { type: "EXPERTO EN ARMAS", max: null, key: "experto-ionico", label: "Experto en armas · rifle iónico" },
        { type: "EXPERTO EN ARMAS", max: null, key: "experto-acelerador", label: "Experto en armas · rifle acelerador" },
        { type: "DRON DE RECONOCIMIENTO MB3", max: 1, cost: 2, section: "Drones" },
        { type: "DRON ACELERADOR DE INDUCCIÓN MV31", max: 1, section: "Drones" },
        { type: "DRON ANTIGRAVEDAD MV33", max: 1, section: "Drones" },
        { type: "DRON DE COMBATE MV1", max: 1, section: "Drones" },
        { type: "DRON DE DEFENSA MV4", max: 1, section: "Drones" },
        { type: "DRON TELEMÉTRICO MV7", max: 1, section: "Drones" },
      ],
    },
    constraints: [{ types: ["EXPERTO EN ARMAS"], max: 2, label: "Máx. 2 Expertos", msg: "Solo puedes incluir hasta dos Expertos en armas." }],
    equipment: {
      slots: 4,
      universal: [
        "deposito-municion",
        "alambre-puas",
        "aparato-comunicaciones",
        "minas",
        "barricadas-ligeras",
        "barricada-pesada",
        "escaleras",
        "granadas-especiales",
        "granadas-explosivas",
        "carga-demolicion",
        "barricada-portatil",
      ],
    },
  },
};
