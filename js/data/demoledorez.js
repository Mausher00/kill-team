// ============================================================
//  data/demoledorez.js — Demoledorez
//  Generado desde el PDF oficial: Wrecka Krew (jun. 2026)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['demoledorez'] = {
  id: "demoledorez",
  name: "Demoledorez",
  subfaction: "Orkos",
  icon: "💥",
  img: "imagenes/demoledorez.png",
  desc: "Orkos obsesionados con la destrucción. Cuanto más atacan, más puntos de Demolizión generan y más letales se vuelven.",
  tags: ["Orkos", "Seguridad", "Buscar y destruir"],
  version: "Junio 2026",
  source: "Wrecka Krew (jun. 2026)",
  ops: [
    {
      id: "noble-jefazo",
      name: "Noble Jefazo Demoledorez",
      type: "NOBLE JEFAZO",
      img: "imagenes/demoledorez-img/noble-jefazo.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 14 },
      kw: ["DEMOLEDOREZ", "ORKO", "LÍDER", "NOBLE JEFAZO"],
      w: [
        { n: "Piztola lanzakobetez", a: 6, i: "5+", d: "4/5", r: ["Alcance 8\"", "Área 1\""] },
        { n: "Dos pistolaz lanzakobetez (concentrado)", a: 6, i: "4+", d: "4/5", r: ["Alcance 8\"", "Área 1\"", "Incesante"] },
        { n: "Dos pistolaz lanzakobetez (salva)", a: 6, i: "5+", d: "4/5", r: ["Alcance 8\"", "Área 1\"", "Salva*"] },
        { n: "Rebanadora", a: 4, i: "3+", d: "4/5", r: [] },
        { n: "Martillo brutal", a: 4, i: "3+", d: "5/6", r: ["Brutal"] },
      ],
      ru: [
        {
          n: "Jefe Demoledorez",
          t: "Cuando este agente realice una acción de Combatir o Disparar (salvo Ponerse en guardia), ganas 1 punto de Demolizión.",
        },
        {
          n: "Salva",
          t: "Selecciona hasta dos blancos válidos diferentes que no estén en la zona de control de agentes amigos. Dispara con esta arma a ambos blancos principales en el orden que elijas, y luego a todos los blancos secundarios restantes del mismo modo (tira cada secuencia por separado). No puedes disparar a cada blanco (principal y secundario) más de una vez durante la acción.",
        },
      ],
    },
    {
      id: "garrapato-bomba",
      name: "Garrapato Bomba Demoledorez",
      type: "GARRAPATO BOMBA",
      img: "imagenes/demoledorez-img/garrapato-bomba.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 5 },
      kw: ["DEMOLEDOREZ", "ORKO", "GARRAPATO BOMBA"],
      w: [
        { n: "Explozivoz", a: 6, i: "4+", d: "4/5", r: ["Área 1\"", "Limitada 1", "Explosiva*"] },
        { n: "Mordizquitoz", a: 3, i: "4+", d: "4/5", r: [] },
      ],
      ru: [
        {
          n: "Explosiva",
          t: "Este agente puede realizar la acción Disparar con esta arma mientras esté en la zona de control de un agente enemigo. No selecciones un blanco válido. En su lugar, este agente siempre es el blanco principal y no puede estar tras cobertura u ofuscado.",
        },
        {
          n: "Eztúpido",
          t: "Durante la fase de tiroteo, al determinar la orden de este agente, no puedes elegir ocultarse. Este agente no puede realizar otras acciones que no sean Cargar, Combatir, Correr, Disparar o Reposicionarse, ni usar armas que no figuren en su tarjeta de datos.",
        },
        {
          n: "¡Bum!",
          t: "Si este agente quede incapacitado durante la batalla sin haber usado sus explozivoz, tira un D6, o dos D6 si quieres. Si algún dado saca 4+, este agente realiza una acción libre de Disparar con sus explozivoz antes de ser retirado de la zona de aniquilación.",
        },
        {
          n: "Prescindible",
          t: "Este agente se ignora en las operaciones de asesinato/ eliminación del oponente (cuando esté incapacitado y a la hora de determinar el número inicial de agentes). También se ignora para condiciones de victoria y puntuar PV si esto requiere que agentes “escapen”, “sobrevivan” o queden incapacitados por agentes enemigos (si huye/sobrevive/queda incapacitado, al determinar cuántos agentes deben huir/sobrevivir/quedar incapacitados, etc.).",
        },
      ],
    },
    {
      id: "tronchademoledor",
      name: "Tronchademoledor",
      type: "TRONCHADEMOLEDOR",
      img: "imagenes/demoledorez-img/tronchademoledor.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 12 },
      kw: ["DEMOLEDOREZ", "ORKO", "TRONCHADOR", "DEMOLEDOR"],
      w: [
        { n: "Palokabum (golpetazo)", a: 4, i: "3+", d: "4/5", r: [] },
        { n: "Palokabum (detonar)", a: 4, i: "3+", d: "*", r: ["Letal 5+", "Limitada 1", "Detonar*"] },
      ],
      ru: [
        {
          n: "Temperamento temerario",
          t: "El daño normal de 4 o más inflige 1 daño menos a este agente; si este agente tiene una orden de Trabarse, el daño crítico de 4 o más también inflige 1 daño menos a este agente.",
        },
        {
          n: "Detonar",
          t: "La primera vez que este agente fuese a infligir daño a un agente enemigo con este perfil de arma durante la batalla, inflige por separado 1D6+6 de daño a ese agente y a cada otro agente dentro de la zona de control del agente enemigo si es un éxito normal, o 2D6+6 de daño si es un éxito crítico. Luego la acción termina y ganas 1 punto de Demolizión, más 1 punto adicional por cada agente que haya quedado incapacitado durante esa acción. El daño de esta arma no puede ignorarse ni reducirse.",
        },
      ],
    },
    {
      id: "tronchapeleon",
      name: "Tronchapeleón",
      type: "TRONCHAPELEÓN",
      img: "imagenes/demoledorez-img/tronchapeleon.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 12 },
      kw: ["DEMOLEDOREZ", "ORKO", "TRONCHADOR", "LUCHADOR"],
      w: [{ n: "Martillo brutal", a: 4, i: "3+", d: "5/6", r: ["Brutal"] }],
      ru: [
        {
          n: "Romper Kozaz (1PA)",
          t: "Selecciona un elemento de terreno en la zona de control de este agente. Si es terreno equipo, retíralo. Si no, sitúa una de tus fichas de Brecha en la zona de control de este agente, lo más cerca posible de ese terreno. Cuando un agente esté a 1\" o menos de esa ficha, considera como terreno Accesible las partes de ese elemento de terreno que no tengan más de 1\" de grosor. Este agente no puede realizar esta acción mientras esté en la zona de control de un agente enemigo, o si un elemento de terreno no está en su zona de control.",
          isAct: true,
        },
      ],
    },
    {
      id: "tronchamachakador",
      name: "Tronchamachakador",
      type: "TRONCHAMACHAKADOR",
      img: "imagenes/demoledorez-img/tronchamachakador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 12 },
      kw: ["DEMOLEDOREZ", "ORKO", "TRONCHADOR", "MACHAKADOR"],
      w: [{ n: "Kiebranudilloz", a: 4, i: "3+", d: "5/6", r: ["Brutal", "Choque", "Destrozar*"] }],
      ru: [
        {
          n: "Destrozar",
          t: "Cuando golpees, puedes mover en línea recta al agente enemigo hasta 1\". Si lo haces, debe terminar el movimiento más lejos de este agente y en un lugar donde pueda situarse. A continuación, mueve a este agente en línea recta hasta 1\", pero debe terminar ese movimiento en la zona de control del agente enemigo (si no es posible, no puedes moverlo).",
        },
        {
          n: "Blindado",
          t: "Cuando un agente enemigo dispare a este agente, o este agente combata o contraataque, tu oponente no puede guardar como éxitos críticos los resultados de dados de ataque inferiores a 6 (p. ej. de resultas de las reglas de armas Letal, Desgarradora o Severa).",
        },
      ],
    },
    {
      id: "artillero-petatankez",
      name: "Artillero Petatankez",
      type: "ARTILLERO PETATANKEZ",
      img: "imagenes/demoledorez-img/artillero-petatankez.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 12 },
      kw: ["DEMOLEDOREZ", "ORKO", "PETATANKEZ", "ARTILLERO"],
      w: [
        { n: "Lanzakobetez", a: 6, i: "5+", d: "4/5", r: ["Área 1\""] },
        { n: "Lanzakobetez pezado", a: 6, i: "4+", d: "4/5", r: ["Área 1\"", "Pesada (solo Correr)"] },
        { n: "Puñoz", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Ramalazo kompetitivo",
          t: "Una vez por acción de Disparar, si este agente dispara a un agente enemigo al que otro agente amigo haya disparado durante este punto de inflexión, ganas 1 punto de Demolizión. Determina esto cuando selecciones un blanco válido, pero al hacerlo puedes incluir objetivos secundarios (p. ej. gracias a la regla de arma Área).",
        },
      ],
    },
    {
      id: "kobeteador-petatankez",
      name: "Kobeteador Petatankez",
      type: "KOBETEADOR PETATANKEZ",
      img: "imagenes/demoledorez-img/kobeteador-petatankez.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 12 },
      kw: ["DEMOLEDOREZ", "ORKO", "PETATANKEZ", "KOBETEADOR"],
      w: [
        { n: "Kobete induktor", a: 6, i: "5+", d: "-", r: ["Pesada (solo Reposicionarse)", "Limitada 1", "Indukzión*"] },
        { n: "Lanzakobetez", a: 6, i: "5+", d: "4/5", r: ["Área 1\""] },
        { n: "Batería de kobetez", a: 6, i: "5+", d: "4/5", r: ["Área 2\"", "Pesada (solo Reposicionarse)", "Limitada 1", "Implacable"] },
        { n: "Puñoz", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Indukzión",
          t: "No selecciones un blanco válido. En su lugar, sitúa tu marcador de Indukzión visible para este agente, o en terreno ventajoso de un elemento de terreno visible para este agente. Ese marcador gana 1 punto de Indukzión (usa las fichas de puntos de Indukzión); luego tira los dados de ataque: el marcador gana 1 punto de Indukzión adicional por cada éxito (hasta un máximo de 3 puntos adicionales). Inflige 1D3 de daño por separado a cada agente a x\" o menos de ese marcador, donde x equivale a los puntos de Indukzión de ese marcador. Después la acción finaliza.",
        },
        {
          n: "Onda de choke",
          t: "Siempre que un agente esté a x\" o menos de tu marcador de Indukzión (ver columna contigua), empeora en 1 el atributo Imp de sus armas y resta 2\" a su atributo Movimiento. Esto se acumula con los efectos de estar herido. X equivale a los puntos de Indukzión de ese marcador. En el paso de preparación de cada fase de estrategia, resta 1 a los puntos de Indukzión que tenga tu marcador de Indukzión. Si un marcador de Indukzión llega a tener 0 puntos de Indukzión, retíralo del juego.",
        },
      ],
    },
  ],
  fr: {
    name: "Hazta laz cejaz",
    type: "REGLA DE FACCIÓN",
    text: "La primera vez que un agente DEMOLEDOREZ amigo (salvo el GARRAPATO BOMBA) con una orden de Trabarse realice tanto la acción Cargar, como la de Disparar o la de Combatir (salvo Ponerse en guardia) durante cada una de sus activaciones/reacciones, suma 1 a su atributo LPA hasta el inicio de su siguiente activación.",
    orders: [
      {
        n: "Embestida demoledora",
        t: "Cuando un agente DEMOLEDOREZ amigo dispare, combata o contraataque, en el paso de tirar dados de ataque:\n• Por cada resultado de 6 en los dados de ataque que guardes, ganas un punto de Demolizión.\n• Puedes gastar hasta 2 de tus puntos de Demolizión (salvo GARRAPATO BOMBA). Por cada punto que gastes así, guarda uno de tus fallos como éxito normal en lugar de descartarlo. Puedes ganar y perder puntos de Demolizión durante la misma acción y lo puedes hacer en el orden que elijas, salvo si empezaste la acción con 6, en cuyo caso solo puedes gastarlos.",
      },
    ],
  },
  frs: [
    {
      name: "Hazta laz cejaz",
      text: "La primera vez que un agente DEMOLEDOREZ amigo (salvo el GARRAPATO BOMBA) con una orden de Trabarse realice tanto la acción Cargar, como la de Disparar o la de Combatir (salvo Ponerse en guardia) durante cada una de sus activaciones/reacciones, suma 1 a su atributo LPA hasta el inicio de su siguiente activación.",
      subs: [],
    },
    {
      name: "Embestida demoledora",
      text: "Cuando un agente DEMOLEDOREZ amigo dispare, combata o contraataque, en el paso de tirar dados de ataque:\n• Por cada resultado de 6 en los dados de ataque que guardes, ganas un punto de Demolizión.\n• Puedes gastar hasta 2 de tus puntos de Demolizión (salvo GARRAPATO BOMBA). Por cada punto que gastes así, guarda uno de tus fallos como éxito normal en lugar de descartarlo. Puedes ganar y perder puntos de Demolizión durante la misma acción y lo puedes hacer en el orden que elijas, salvo si empezaste la acción con 6, en cuyo caso solo puedes gastarlos.",
      subs: [],
    },
  ],
  pl: {
    s: [
      { n: "Destrucción", t: "Las armas a distancia de los agentes DEMOLEDOREZ amigos tienen la regla de arma Saturación." },
      {
        n: "Vitaminadoz",
        t: "Cada agente DEMOLEDOREZ amigo que tenga una orden de Trabarse puede recuperar inmediatamente 1D3+1 de heridas perdidas (tira por separado para cada uno).",
      },
      { n: "¡Waaagh!", t: "Las armas de combate de los agentes DEMOLEDOREZ amigos tienen la regla de arma Equilibrada." },
      {
        n: "Tipoz duroz",
        t: "Cuando un agente dispare a un agente DEMOLEDOREZ amigo que tenga una orden de Trabarse, puedes repetir uno de tus dados de defensa.",
      },
    ],
    f: [
      {
        n: "Pelea de verdad",
        t: "Usa este ardid de tiroteo durante la activación de un agente TRONCHADOR DEMOLEDOREZ o NOBLE JEFAZO DEMOLEDOREZ amigo. Ese agente puede realizar dos acciones de Combatir durante esa activación.",
      },
      {
        n: "¡Kabum!",
        t: "Usa este ardid de tiroteo cuando un agente DEMOLEDOREZ amigo realice la acción Disparar y se seleccione un arma con la regla de arma Área. Hasta el final de esa acción, suma 1\" al Área de esa arma y tiene la regla de arma Severa al disparar al blanco principal. No puedes usar este ardid y la regla Kobetez taladro (ver equipo) durante la misma acción. Ten en cuenta que Severa no genera un punto de Demolizión (ya que no es un 6).",
      },
      {
        n: "Zolo ez un razguño",
        t: "Usa este ardid de tiroteo cuando un dado de ataque inflija daño normal a un agente DEMOLEDOREZ amigo (salvo GARRAPATO BOMBA). Ignora ese daño infligido.",
      },
      {
        n: "Trabajo de demolizión",
        t: "Usa este ardid de tiroteo después de que un agente DEMOLEDOREZ amigo realice la acción Combatir o Disparar, justo antes de retirar a los agentes incapacitados (si los hay). Sitúa uno de tus marcadores de Demolizión en la zona de combate del blanco (del blanco principal si se usa un arma Área). Cuando un agente DEMOLEDOREZ amigo (salvo GARRAPATO BOMBA) dispare, combata o contraataque a un agente situado a 3\" o menos de ese marcador, puedes gastar un punto de Demolizión gratis (aunque no tengas ninguno). En el paso de preparación de la siguiente fase de estrategia, retira ese marcador.",
      },
    ],
  },
  eq: [
    {
      n: "Azeite de motor",
      t: "Puedes usar esta regla una vez por punto de inflexión, al activar a un agente DEMOLEDOREZ amigo (salvo GARRAPATO BOMBA). Si lo haces, hasta el final de esa activación puedes ignorar cualquier cambio a los atributos de ese agente por estar herido (incluidos los atributos de sus armas).",
    },
    {
      n: "Glifoz",
      t: "La elección de este equipo comporta seleccionar los ardides estratégicos ¡Waaagh! o Destrucción. La primera vez que uses esa estratagema durante la batalla, te costará 0PM; a partir de ahí, te costará 0PM si tienes algún punto de Demolizión.",
    },
    {
      n: "Kobetaladradorez",
      t: "Una vez por punto de inflexión, cuando un agente DEMOLEDOREZ amigo realice la acción de Disparar y selecciones un lanzakobetez o lanzakobetez pezado, puedes usar esta regla. Si lo haces, hasta el final de esa acción dicha arma pierde la regla de arma Área, pero gana la regla de arma Penetración 1.",
    },
    {
      n: "Blindaje adicional",
      t: "Resta 1\" al atributo Movimiento de los agentes DEMOLEDOREZ amigos y mejora en 1 su atributo Salvación (salvo agentes GARRAPATO BOMBA). Esto no es acumulable con la regla Protector de una Barricada Portátil de equipo universal.",
    },
  ],
  er: [
    {
      v: "Comentarios de reglas · Junio 2026",
      ee: [
        {
          s: "Reglas de facción, hazta laz cejaz",
          t: "Cambiar las partes relevantes a: “La primera vez que un agente DEMOLEDOREZ amigo (salvo el GARRAPATO BOMBA) con una orden de Trabarse realice o la acción de Cargar, o la de Disparar, o la de Combatir (salvo Ponerse en guardia) durante cada una de sus activaciones/ reacciones, suma 1 a su atributo LPA [...]”",
        },
        {
          s: "Reglas de facción, embestida demoledora",
          t: "Cambiar la primera frase del segundo punto a: “Puedes gastar hasta 2 de tus puntos de Demolizión (a menos que sea un GARRAPATO BOMBA, en cuyo caso no puedes gastar ninguno)”. Cambia la segunda frase del segundo párrafo por: “Puedes ganar y gastar puntos de Demolizión durante la misma acción y lo puedes hacer en el orden que elijas, salvo si empezaste la acción con 6, en cuyo caso solo puedes gastarlos\".",
        },
        {
          s: "Agente noble jefazo, regla de arma salva",
          t: "Cambia la primera frase a: “Elige hasta 2 blancos válidos diferentes que no estén en la zona de control de agentes amigos.” P: Si un TRONCHAMACHAKADOR DEMOLEDOREZ que usa su regla de arma Destrozar mueve a un agente enemigo, y con ello un marcador que “terminaría esa acción” está en la zona de control de ese agente enemigo (p.ej., en los YAEGIR HERNKYN un FERROBRAEK con Minas AP-Pex) pero no en la zona de control del agente TRONCHAMACHAKADOR, ¿termina la acción de Combatir? R: No.",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Agente tronchademoledor, regla de arma detonar",
          t: "Añade este texto al final del primer párrafo: “El daño de esta arma no puede ignorarse ni reducirse\".",
        },
        {
          s: "Agente garrapato bomba, regla prescindible",
          t: "Cambia las partes relevantes de la segunda frase por: “También se ignora para condiciones de victoria y puntuar PV si esto requiere que agentes “escapen”, “sobrevivan” o queden incapacitados por agentes enemigos […]\"",
        },
        {
          s: "Equipo de facción, blindaje adicional",
          t: "Cambia a: “Resta 1\" al atributo Movimiento de los agentes DEMOLEDOREZ amigos y mejora en 1 su atributo Salvación (salvo agentes GARRAPATO BOMBA). Esto no es acumulable con la regla Protección de una Barricada Portátil de equipo universal”.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Seguridad", "Buscar y destruir"],
    required: [
      {
        type: "NOBLE JEFAZO",
        count: 1,
        loadouts: [
          { label: "Piztola lanzakobetez; martillo brutal", w: [{ n: "Piztola lanzakobetez" }, { n: "Martillo brutal" }] },
          { label: "Dos piztolaz lanzakobetez; rebanadora", w: [{ n: "Dos piztolaz lanzakobetez" }, { n: "Rebanadora" }] },
        ],
      },
      { type: "GARRAPATO BOMBA", count: 2 },
    ],
    pool: {
      slots: 5,
      note: "Salvo Tronchapeleones y Artilleros Petatankez, cada agente solo una vez.",
      entries: [
        { type: "TRONCHADEMOLEDOR", max: 1 },
        { type: "TRONCHAPELEÓN", max: null },
        { type: "TRONCHAMACHAKADOR", max: 1 },
        { type: "ARTILLERO PETATANKEZ", max: null, key: "artillero-pezado", label: "Artillero · lanzakobetez pezado" },
        { type: "ARTILLERO PETATANKEZ", max: null, key: "artillero-lanza", label: "Artillero · lanzakobetez" },
        {
          type: "KOBETEADOR PETATANKEZ",
          max: 1,
          loadouts: [
            { label: "Lanzakobetez; kobete induktor; puñoz", w: [{ n: "Lanzakobetez" }, { n: "Kobete induktor" }, { n: "Puñoz" }] },
            { label: "Lanzakobetez; batería de kobetez; puñoz", w: [{ n: "Lanzakobetez" }, { n: "Batería de kobetez" }, { n: "Puñoz" }] },
          ],
        },
      ],
    },
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
