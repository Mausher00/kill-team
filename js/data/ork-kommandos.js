// ============================================================
//  data/ork-kommandos.js — Orkomandos
//  Generado desde el PDF oficial: Kommandos (jun. 2026)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['orkomandos'] = {
  id: "orkomandos",
  name: "Orkomandos",
  subfaction: "Orkos",
  icon: "🔧",
  img: "imagenes/orkomandos.png",
  desc: "Kommandos Orkos que combinan la brutalidad de su especie con una astucia sorprendente. Expertos en infiltración y emboscada.",
  tags: ["Orkos", "Infiltración", "Buscar y destruir"],
  version: "Junio 2026",
  source: "Kommandos (jun. 2026)",
  ops: [
    {
      id: "noble",
      name: "Noble Orkomando",
      type: "NOBLE",
      img: "imagenes/orkomandos-img/noble.jpg",
      s: { lpa: 3, mov: "6\"", salv: "5+", h: 14 },
      kw: ["ORKOMANDO", "ORKO", "LÍDER", "NOBLE"],
      w: [
        { n: "Piztola", a: 4, i: "4+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Gran rebanadora", a: 5, i: "3+", d: "5/6", r: [] },
        { n: "Garra d'energía", a: 4, i: "3+", d: "5/7", r: ["Brutal", "Choque"] },
      ],
      ru: [
        { n: "La hora de laz tortaz", t: "Este agente puede realizar 2 acciones de Combatir durante su activación." },
        {
          n: "¡manoz a la Obra! (1PA)",
          t: "APOYO. Elige un agente ORKOMANDO amigo distinto (salvo GARRAPATO BOMBA) a 6\" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo, o como reacción.",
          isAct: true,
        },
      ],
    },
    {
      id: "garrapato-bomba",
      name: "Garrapato Bomba",
      type: "GARRAPATO BOMBA",
      img: "imagenes/orkomandos-img/garrapato.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 5 },
      kw: ["ORKOMANDO", "ORKO", "GARRAPATO BOMBA"],
      w: [
        { n: "Explozivoz", a: 6, i: "4+", d: "4/5", r: ["Área 1\"", "Limitada 1", "Explosiva*"] },
        { n: "Mordizquitoz", a: 3, i: "4+", d: "4/5", r: [] },
      ],
      ru: [
        {
          n: "Explosiva",
          t: "Este agente puede realizar la acción de Disparar con esta arma estando en la zona de control de un agente enemigo. No elijas un blanco válido. En lugar de eso, este agente es siempre el blanco principal y no puede estar a cubierto u ofuscado.",
        },
        {
          n: "¡Bum!",
          t: "Si este agente resulta incapacitado durante la batalla sin haber usado sus explozivoz, tira un D6, o dos D6 si quieres. Si algún dado saca 4+, este agente realiza una acción libre de Disparar con sus explozivoz antes de ser retirado de la zona de aniquilación. LA REGLAS CONTINÚAN EN EL REVERSO",
        },
        {
          n: "Eztúpido",
          t: "Durante la fase de tiroteo, al determinar la orden de este agente, no puedes elegir ocultarse. Este agente no puede realizar otras acciones que no sean Cargar, Combatir, Correr, Disparar o Reposicionarse, ni usar armas que no figuren en su tarjeta de datos.",
        },
        {
          n: "Prescindible",
          t: "Este agente se ignora para las operaciones de asesinato/eliminación de tu oponente (al quedar incapacitado, y al determinar tu número inicial de agentes). También se ignora para condiciones de victoria y puntuar PV si esto requiere que agentes “escapen”, “sobrevivan” o queden incapacitados por agentes enemigos (si escapa/sobrevive/es incapacitado, al determinar cuántos agentes deben escapar/sobrevivir/ser incapacitados, etc.).",
        },
      ],
    },
    {
      id: "orkorraso",
      name: "Orkorraso",
      type: "ORKORRASO",
      img: "imagenes/orkomandos-img/orkorraso.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["ORKOMANDO", "ORKO", "ORKORRASO"],
      w: [{ n: "Piztola", a: 4, i: "4+", d: "3/4", r: ["Alcance 8\""] }, { n: "Rebanadora", a: 4, i: "3+", d: "4/5", r: [] }],
      ru: [
        {
          n: "Kachivachez táktikoz",
          t: "Puedes llevar a cabo cada una de las siguientes opciones una vez por punto de inflexión:\n• Un agente ORKORRASO ORKOMANDO amigo puede realizar la acción Granada de humo.\n• Un agente ORKORRASO ORKOMANDO amigo puede realizar la acción Granada aturdidora. Las reglas para esas acciones figuran en el equipo universal. Realizar esas acciones usando esta regla no cuenta para sus límites de acciones (es decir, si también eliges esas granadas como equipo).",
        },
      ],
    },
    {
      id: "orkoriete",
      name: "Orkoriete",
      type: "ORKORIETE",
      img: "imagenes/orkomandos-img/orkoriete.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["ORKOMANDO", "ORKO", "ORKORIETE"],
      w: [
        { n: "Piztola", a: 4, i: "4+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Ariete de azedio", a: 4, i: "4+", d: "5/5", r: ["Brutal", "Choque", "Severa"] },
      ],
      ru: [
        {
          n: "Abrir Brecha (1PA)",
          t: "Coloca uno de tus marcadores de Brecha dentro de la zona de control de este agente y tan cerca como sea posible de un elemento de terreno dentro de su zona de control. Cuando un agente se encuentre a 1\" o menos de ese marcador, las partes de ese elemento de terreno que no tengan más de 1\" de grosor se considerarán terreno Accesible para él. Este agente puede realizar esta acción durante una acción de Cargar o Reposicionarse, y le cuesta 1 PA menos durante esas acciones. Tras hacerlo, puede usar la distancia de movimiento que le quedase. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo, o si no hay un elemento de terreno en su zona de control.",
          isAct: true,
        },
      ],
    },
    {
      id: "achicharrador",
      name: "Achicharrador",
      type: "ACHICHARRADOR",
      img: "imagenes/orkomandos-img/achicharrador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["ORKOMANDO", "ORKO", "ACHICHARRADOR"],
      w: [
        { n: "Achicharrador (tromba)", a: 4, i: "2+", d: "3/3", r: ["Alcance 4\"", "Buscadora", "Saturación", "Ráfaga 0”"] },
        { n: "Achicharrador (estándar)", a: 4, i: "2+", d: "3/3", r: ["Alcance 8\"", "Ráfaga 2\"", "Saturación"] },
        { n: "Puñoz", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Nota",
          t: "Recuerda que Ráfaga 0\" significa que no puedes elegir blancos secundarios, pero esta arma sigue teniendo la regla de arma Ráfaga a efectos de todas las demás reglas, p.ej., la regla de Fortaleza Condensada (ver Zona de aniquilación: Volkus, Libro Básico de Kill Team).",
        },
      ],
    },
    {
      id: "teleko",
      name: "Teleko",
      type: "TELEKO",
      img: "imagenes/orkomandos-img/teleko.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["ORKOMANDO", "ORKO", "TELEKO"],
      w: [
        { n: "Piztola kalambrazo", a: 6, i: "4+", d: "1/0", r: ["Alcance 8\"", "Aturdidora", "Devastadora 2", "Severa"] },
        { n: "Puñoz", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Tengo un plan, chavalez",
          t: "Una vez por activación de este agente, puede realizar una acción de Colocar marcador, Recoger marcador o una acción de misión por 1 PA menos.",
        },
        {
          n: "Ezkuchadme (1PA)",
          t: "APOYO. Elige un agente ORKOMANDO amigo distinto (salvo GARRAPATO BOMBA) a 6\" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "zueltadakka",
      name: "Zueltadakka",
      type: "ZUELTADAKKA",
      img: "imagenes/orkomandos-img/zueltadaka.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["ORKOMANDO", "ORKO", "ZUELTADAKKA"],
      w: [
        { n: "Dakkatralladora (largo alcance)", a: 5, i: "4+", d: "3/4", r: [] },
        { n: "Dakkatralladora (corto alcance)", a: 5, i: "4+", d: "3/4", r: ["Alcance 9\"", "Incesante"] },
        { n: "Puñoz", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "¡dakka a Toda Mecha! (1PA)",
          t: "Realiza una acción libre de Correr y una acción libre de Disparar con este agente en cualquier orden. Solo puedes elegir una dakkatralladora para esa acción de Disparar. Este agente no puede realizar esta acción mientras esté en la zona de control de un agente enemigo, o mientras tenga una orden de ocultarse.",
          isAct: true,
        },
      ],
    },
    {
      id: "kanijo",
      name: "Kanijo Komando",
      type: "KANIJO",
      img: "imagenes/orkomandos-img/kanijo.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 5 },
      kw: ["ORKOMANDO", "ORKO", "GROT"],
      w: [{ n: "Rebanadora de Grot", a: 3, i: "5+", d: "1/4", r: [] }],
      ru: [
        {
          n: "Ezkurridizo",
          t: "Este agente no puede tener una orden de trabarse. Siempre que este agente esté tras cobertura, no puede ser elegido como blanco válido, teniendo esto prioridad sobre todas las demás reglas (p. ej. Buscadora, terreno Aventajado) salvo estar a 2\" o menos.",
        },
        {
          n: "Gancho Pa’ Trepar (1PA)",
          t: "Elige un punto visible en un elemento de terreno para este agente. Retira a este agente de la zona de aniquilación y despliégalo de nuevo a 1\" o menos en horizontal de ese punto, en una localización donde ser desplegado, fuera de la zona de control de todo agente enemigo y con el punto elegido visible para él. Este agente no puede realizar la acción Operar portillo durante esta acción. Esta acción se considera una acción de Reposicionarse. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo, ni durante una activación en la que haya realizado una acción de Cargar o Retroceder (o viceversa).",
          isAct: true,
        },
      ],
    },
    {
      id: "chiko-kobete",
      name: "Chiko Kobete",
      type: "CHIKO KOBETE",
      img: "imagenes/orkomandos-img/kobete.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["ORKOMANDO", "ORKO", "CHIKO KOBETE"],
      w: [
        { n: "Lanzakobetez (apuntado)", a: 6, i: "4+", d: "4/5", r: ["Área 1\"", "Incesante", "Pesada (solo Correr)"] },
        { n: "Lanzakobetez (móvil)", a: 6, i: "4+", d: "4/5", r: ["Área 1\""] },
        { n: "Puñoz", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "rajador",
      name: "Rajador",
      type: "RAJADOR",
      img: "imagenes/orkomandos-img/rajador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["ORKOMANDO", "ORKO", "RAJADOR"],
      w: [
        { n: "Kuchilloz arrojadizoz", a: 4, i: "3+", d: "2/5", r: ["Alcance 6\"", "Silenciosa"] },
        { n: "Rebanadoraz gemelaz", a: 4, i: "3+", d: "4/5", r: ["Incesante", "Letal 5+"] },
      ],
      ru: [
        {
          n: "¿Ez lo mejor ke zabez hazer?",
          t: "Después de que este agente combata o contraataque, si no resulta incapacitado puedes infligir 1D3 daños al agente enemigo en dicha secuencia.",
        },
      ],
    },
    {
      id: "francotiradork",
      name: "Francotiradork",
      type: "FRANCOTIRADORK",
      img: "imagenes/orkomandos-img/francotiradork.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["ORKOMANDO", "ORKO", "FRANCOTIRADORK"],
      w: [
        { n: "Akribillador pezado kon mirilla (oculto)", a: 5, i: "3+", d: "3/3", r: ["Devastadora 2", "Pesada", "Silenciosa", "Posición oculta*"] },
        { n: "Akribillador pezado kon mirilla (inmóvil)", a: 5, i: "3+", d: "3/3", r: ["Devastadora 2", "Pesada"] },
        { n: "Akribillador pezado kon mirilla (barrido)", a: 5, i: "3+", d: "3/4", r: ["Pesada (solo Correr)", "Ráfaga 1\""] },
        { n: "Puñoz", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [{ n: "Posición oculta", t: "Este agente solo puede usar esta arma la primera vez que realice la acción de Disparar durante la batalla." }],
    },
  ],
  fr: {
    name: "Degolladorez",
    type: "REGLA DE FACCIÓN",
    text: "Cada agente ORKOMANDO amigo (salvo GARRAPATO BOMBA) puede realizar acciones de Cargar aunque tenga una orden de ocultarse.",
    orders: [],
  },
  frs: [
    {
      name: "Degolladorez",
      text: "Cada agente ORKOMANDO amigo (salvo GARRAPATO BOMBA) puede realizar acciones de Cargar aunque tenga una orden de ocultarse.",
      subs: [],
    },
  ],
  pl: {
    s: [
      { n: "¡Dakka! ¡dakka! ¡dakka!", t: "Las armas a distancia de los agentes ORKOMANDO amigos tienen la regla de arma Castigadora." },
      {
        n: "¡Sssshhhh!",
        t: "Cada agente ORKOMANDO amigo que no sea un blanco válido para los agentes enemigos, o que tenga una orden de ocultarse y se encuentre a más de 6\" de todo agente enemigo, puede realizar inmediatamente una acción libre de Correr. No puedes usar este ardid durante el primer punto de inflexión.",
      },
      { n: "¡Waaagh!", t: "Las armas de combate de los agentes ORKOMANDO amigos tienen la regla de arma Equilibrada." },
      {
        n: "Ezkondidoz",
        t: "Cada vez que un agente enemigo dispara a un agente ORKOMANDO amigo que tenga una orden de ocultarse, puedes guardar uno de tus dados de defensa como éxito normal sin tirarlo (además de la salvación por cobertura, si dispones de ella).",
      },
    ],
    f: [
      {
        n: "Zolo ez un razguño",
        t: "Usa este ardid de tiroteo cuando un dado de ataque inflige Daño normal a un agente ORKOMANDO amigo (que no sea GARRAPATO BOMBA o GROT). Ignora ese daño infligido.",
      },
      {
        n: "No te parez",
        t: "Usa este ardid de tiroteo cuando un agente ORKOMANDO amigo es activado, o cuando su atributo LPA cambia. Hasta el inicio del siguiente punto de inflexión, puedes ignorar cualquier cambio a su atributo LPA.",
      },
      {
        n: "¡Machakazloz!",
        t: "Usa este ardid de tiroteo al final de la fase de tiroteo. Elige un agente ORKOMANDO amigo. Este puede realizar inmediatamente una acción libre de Combatir.",
      },
      {
        n: "Aztutoz pero brutoz",
        t: "Usa este ardid de tiroteo cuando un agente ORKOMANDO amigo que tenga una orden de ocultarse esté combatiendo durante una activación en la que haya realizado una acción de Cargar, al resolver el primer dado de ataque, si este golpea con un éxito normal. Ese éxito normal se considera un éxito crítico en su lugar.",
      },
    ],
  },
  eq: [
    {
      n: "Rebanadoraz",
      t: "Los agentes ORKOMANDO amigos (salvo GARRAPATO BOMBA o GROT) tienen la siguiente arma de combate. Ten en cuenta que algunos agentes ya tienen esta arma pero con mejores atributos; en ese caso, usa la versión que sea mejor.\nATQ IMP DAÑO\n▸ Rebanadora — ATQ 3 · IMP 3+ · DAÑO 4/5",
    },
    {
      n: "Culata plegable",
      t: "Elimina la regla de arma Alcance de las siguientes armas a distancia que tengan los agentes ORKOMANDO amigos:\n• Piztola kalambrazo\n• Piztola",
    },
    {
      n: "Dinamita",
      t: "Una vez por batalla, un agente ORKOMANDO amigo (que no sea GARRAPATO BOMBA o GROT) puede usar la siguiente arma a distancia:\nATQ IMP DAÑO\nREGLAS DE ARMAS\nAlcance 4\", Área 1\", Pesada (solo Reposicionarse),\nSaturación\n▸ Dinamita — ATQ 5 · IMP 4+ · DAÑO 4/5",
    },
    {
      n: "Arpón",
      t: "Una vez por punto de inflexión, un agente ORKOMANDO amigo (salvo GARRAPATO BOMBA o GROT) puede usar la siguiente arma a distancia:\nATQ IMP DAÑO\nREGLAS DE ARMAS\nAlcance 8\", Aturdidora, Letal 5+\n▸ Arpón — ATQ 4 · IMP 4+ · DAÑO 4/5",
    },
  ],
  er: [
    {
      v: "Comentarios de reglas · Junio 2026",
      ee: [
        { s: "Agente jefe noble, arma gran rebanadora", t: "Cambia su atributo Atq a “5”. “Borra la regla de arma Castigadora”." },
        { s: "Agente jefe noble, arma garra d’energía", t: "“Añade la regla de arma Choque”." },
        { s: "Agente jefe noble", t: "Regla adicional “La hora de laz tortaz” añadida." },
        { s: "Agente zueltadakka, perfil de arma dakkatralladora (corto alcance)", t: "La regla de arma Alcance 6\" cambia a “Alcance 9\"”." },
        {
          s: "Equipo de facción, culata plegable",
          t: "Cambia las partes relevantes de la primera frase por: “Elimina la regla de arma Alcance de las siguientes […]” Elimina el primer punto: “Dakkatralladora (corto alcance)”",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Agente kanijo, regla eskurridizo",
          t: "Cambia la segunda frase a: “Siempre que este agente esté en cobertura, no puede ser elegido como blanco válido, teniendo esto prioridad sobre todas las demás reglas (p. ej. Buscadora, Terreno aventajado) salvo estar a 2\" o menos\".",
        },
        {
          s: "Agente garrapato bomba, regla prescindible",
          t: "Cambia las partes relevantes de la segunda frase por: “También se ignora para condiciones de victoria y puntuar PV si esto requiere que agentes “escapen”, “sobrevivan” o queden incapacitados por agentes enemigos […]’",
        },
        {
          s: "Agente achicharrador, perfil de arma achicharrador (tromba)",
          t: "“Regla de arma “Buscadora (Ligera)” cambiada a “Buscadora”. Añade la regla de arma “Ráfaga 0\"*\". Añade este texto a la tarjeta de datos: “*Recuerda que Ráfaga 0\" significa que no puedes elegir blancos secundarios, pero esta arma sigue teniendo la regla de arma Ráfaga a efectos de todas las demás reglas, p.ej., la regla de Fortaleza compacta (ver Zona de aniquilación: Volkus, Libro Básico de Kill Team).”",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Infiltración", "Buscar y destruir"],
    required: [
      {
        type: "NOBLE",
        count: 1,
        loadouts: [
          { label: "Piztola; gran rebanadora", w: [{ n: "Piztola" }, { n: "Gran rebanadora" }] },
          { label: "Piztola; garra d'energía", w: [{ n: "Piztola" }, { n: "Garra d'energía" }] },
        ],
      },
    ],
    pool: {
      slots: 9,
      note: "Salvo Orkorrasos, cada agente solo una vez. El Garrapato bomba y el Kanijo cuentan como media opción cada uno: puedes elegir ambos y cuentan como una sola.",
      entries: [
        { type: "GARRAPATO BOMBA", max: 1, half: true },
        { type: "KANIJO", max: 1, half: true },
        { type: "ORKORRASO", max: null },
        { type: "ORKORIETE", max: 1 },
        { type: "ACHICHARRADOR", max: 1 },
        { type: "TELEKO", max: 1 },
        { type: "ZUELTADAKKA", max: 1 },
        { type: "CHIKO KOBETE", max: 1 },
        { type: "RAJADOR", max: 1 },
        { type: "FRANCOTIRADORK", max: 1 },
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
