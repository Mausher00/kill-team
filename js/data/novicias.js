// ============================================================
//  data/novicias.js — Novicias
//  Generado desde el PDF oficial: Novitiates
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['novicias'] = {
  id: "novicias",
  name: "Novicias",
  subfaction: "Adepta Sororitas",
  icon: "⚜️",
  img: "imagenes/novicias.png",
  desc: "Aspirantes de la Adepta Sororitas que demuestran su fe en primera línea con armas, reliquias y fervor.",
  tags: ["Imperium", "Reconocimiento", "Seguridad"],
  version: "Agosto 2026",
  source: "Novitiates",
  ops: [
    {
      id: "superiora",
      name: "Novicia Superiora",
      type: "SUPERIORA",
      img: "imagenes/novicias-img/novicia-superiora.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 9 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "LÍDER", "SUPERIORA"],
      w: [
        { n: "Bólter reliquia", a: 4, i: "3+", d: "3/5", r: ["Letal 5+"] },
        { n: "Pistola bólter reliquia", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Letal 5+"] },
        { n: "Pistola de plasma (normal)", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Pistola de plasma (sobrecarga)", a: 4, i: "3+", d: "4/5", r: ["Alcance 8\"", "Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Arma de energía", a: 4, i: "3+", d: "4/6", r: ["Letal 5+"] },
        { n: "Culata", a: 3, i: "3+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Ejemplo inspirador",
          t: "Siempre que esta agente incapacite a un agente enemigo, ganas 1 punto de fe, o 2 puntos de fe si ese agente enemigo tenía un atributo Heridas de 12 o más. Esta regla no tiene efecto cuando se usa el ardid de tiroteo Martirio glorioso.",
        },
      ],
    },
    {
      id: "condenadora",
      name: "Novicia Condenadora",
      type: "CONDENADORA",
      img: "imagenes/novicias-img/novicia-condenadora.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "CONDENADORA"],
      w: [
        { n: "Lanzaestacas condenación", a: 4, i: "3+", d: "3/3", r: ["AntiPSÍQUICO*", "Críticos de penetración 1", "Devastadora 2", "Silenciosa"] },
        { n: "Vara nulificadora", a: 4, i: "4+", d: "3/3", r: ["AntiPSÍQUICO*", "Choque"] },
      ],
      ru: [
        {
          n: "Vara nulificadora",
          t: "Las armas a distancia PSÍQUICAS no pueden infligir daños a esta agente. A efectos de acciones PSÍQUICAS, esta agente no puede ser elegida y nunca se considera que está dentro de la distancia requerida de esas acciones. Mientras un agente esté a 6\" o menos de esta agente:\n• Ese agente no puede realizar acciones PSÍQUICAS ni usar reglas adicionales PSÍQUICAS.\n• Ese agente no puede usar armas a distancia PSÍQUICAS.\n• Las armas de combate PSÍQUICAS no tienen reglas de armas y no pueden tener atributos Daño mayores que 3/4.",
        },
        {
          n: "AntiPSÍQUICO",
          t: "Cuando esta arma se use contra un agente que tiene la clave PSÍQUICO, suma 1 a ambos atributos Daño de esta arma y además tiene la regla de arma Letal 5+.",
        },
      ],
    },
    {
      id: "dialogante",
      name: "Novicia Dialogante",
      type: "DIALOGANTE",
      img: "imagenes/novicias-img/novicia-dialogante.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "DIALOGANTE"],
      w: [
        { n: "Pistola automática", a: 4, i: "4+", d: "2/3", r: ["Alcance 8\""] },
        { n: "Bastón de dialogante", a: 4, i: "4+", d: "3/3", r: ["Choque"] },
      ],
      ru: [
        {
          n: "Retórica Estimulante (1PA)",
          t: "APOYO. Elige una agente NOVICIA amiga distinta a 6\" o menos de esta agente y visible para ella, o a 6\" o menos de tu marcador de Autotransmisora. Hasta el final de la siguiente activación de esa agente, suma 1 a su atributo LPA (hasta un máximo de 3 después de haber calculado todos los cambios al atributo LPA). Esta agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
        {
          n: "Autotransmisora (0PA)",
          t: "Si tu marcador de Autotransmisora no se encuentra en la zona de aniquilación, colócalo a 8\" o menos en horizontal de esta agente; en caso contrario, mueve tu marcador de Autotransmisora hasta 8\" en horizontal. Si esta agente es retirada de la zona de aniquilación, retira tu marcador de Autotransmisora de la zona de aniquilación. Siempre que un agente enemigo a 3\" o menos de tu marcador de Autotransmisora dispare, combata o contraataque, tu oponente no puede repetir sus dados de ataque. Esta agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "duelista",
      name: "Novicia Duelista",
      type: "DUELISTA",
      img: "imagenes/novicias-img/novicia-duelista.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "DUELISTA"],
      w: [
        { n: "Pistola automática", a: 4, i: "4+", d: "2/3", r: ["Alcance 8\""] },
        { n: "Espadas de duelista", a: 4, i: "3+", d: "4/5", r: ["Incesante", "Parada y contraataque*"] },
      ],
      ru: [
        {
          n: "Parada y contraataque",
          t: "Siempre que bloquees con un éxito crítico, puedes también infligir al agente enemigo en esa secuencia tantos daños como el atributo Daño crítico del arma.",
        },
      ],
    },
    {
      id: "exactora",
      name: "Novicia Exactora",
      type: "EXACTORA",
      img: "imagenes/novicias-img/novicia-exactora.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "EXACTORA"],
      w: [
        { n: "Látigos neuronales (a distancia)", a: 5, i: "3+", d: "2/3", r: ["Alcance 3\"", "Aturdidora", "Letal 5+"] },
        { n: "Látigos neuronales (combate)", a: 5, i: "3+", d: "2/3", r: ["Choque", "Letal 5+"] },
      ],
      ru: [
        {
          n: "Inculcar a Latigazos (1PA)",
          t: "Elige una agente NOVICIA amiga distinta (salvo SUPERIORA) a 3\" o menos de esta agente, visible para ella y que no estuviera ya beneficiándose de los efectos de esta acción. Hasta el final de la siguiente activación de esa agente, suma 1 a su atributo LPA, suma 1\" a su atributo Mov, y puede realizar dos acciones de Combatir durante su siguiente activación. Esta agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "hospitalaria",
      name: "Novicia Hospitalaria",
      type: "HOSPITALARIA",
      img: "imagenes/novicias-img/novicia-hospitalaria.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "MÉDICO", "HOSPITALARIA"],
      w: [
        { n: "Pistola automática", a: 4, i: "4+", d: "2/3", r: ["Alcance 8\""] },
        { n: "Sierra quirúrgica", a: 4, i: "4+", d: "2/3", r: ["Desgarradora", "Letal 5+"] },
      ],
      ru: [
        {
          n: "¡Sanitaria!",
          t: "La primera vez durante cada punto de inflexión que otra agente NOVICIA amiga vaya a resultar incapacitada mientras era visible para esta agente y estaba a 3\" o menos de ella, puedes usar esta regla siempre que ni esta ni esa agente estén en la zona de control de algún agente enemigo. Si lo haces, esa agente amiga no queda incapacitada, le queda 1 herida y no puede resultar incapacitada durante el resto de la acción. Después de esa acción, esa agente amiga puede entonces realizar inmediatamente una acción libre de Correr, pero debe terminar ese movimiento en la zona de control de esta agente. Resta 1 a los atributos LPA de esta y de esa agente hasta el final de sus próximas activaciones respectivamente, y si esta regla fue usada durante la activación de esa agente amiga, esa activación termina. No puedes usar esta regla si esta agente resulta incapacitada, o si es una acción de Disparar y esta agente sería un blanco primario o secundario.",
        },
        {
          n: "Herramientas de Cirujana (1PA)",
          t: "Elige una agente NOVICIA amiga en la zona de control de esta agente para que recupere hasta 2D3 heridas perdidas. No puede ser una agente en la que se haya usado la regla ¡Sanitaria! durante este punto de inflexión. Esta agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "militante",
      name: "Novicia Militante",
      type: "MILITANTE",
      img: "imagenes/novicias-img/novicia-militante.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "MILITANTE"],
      w: [
        { n: "Rifle automático", a: 4, i: "4+", d: "2/3", r: [] },
        { n: "Pistola automática", a: 4, i: "4+", d: "2/3", r: ["Alcance 8\""] },
        { n: "Culata", a: 3, i: "4+", d: "2/3", r: [] },
        { n: "Espada de Novicia", a: 4, i: "4+", d: "4/5", r: [] },
      ],
      ru: [
        {
          n: "Fe militante",
          t: "Siempre que esta agente dispare, combata o contraataque, si usas un ACTO DE FE durante esa secuencia y un agente enemigo resulta incapacitado, recuperas los puntos de fe que has gastado en ese ACTO DE FE. Si usas el equipo Icono de la fe, solo recuperas los puntos de fe por uno de esos ACTOS DE FE (a tu elección).",
        },
      ],
    },
    {
      id: "penitente",
      name: "Novicia Penitente",
      type: "PENITENTE",
      img: "imagenes/novicias-img/novicia-penitente.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "PENITENTE"],
      w: [
        { n: "Pistola automática", a: 4, i: "4+", d: "2/3", r: ["Alcance 8\""] },
        { n: "Eviscerador penitente", a: 4, i: "4+", d: "5/6", r: ["Brutal", "Furia fanática*"] },
      ],
      ru: [
        { n: "Furia fanática", t: "Siempre que esta agente combate con esta arma, tiene la regla de armas Incesante." },
        {
          n: "Absolución mediante la destrucción",
          t: "Siempre que esta agente realiza una acción de Combatir, si no resulta incapacitada, puede realizar inmediatamente a continuación una acción libre de Combatir. Esto tiene preferencia sobre las restricciones de acciones, pero no puedes realizar más de dos acciones sucesivas de Combatir gracias a esta regla. Si esta agente se está beneficiando de los efectos de la acción Inculcar a latigazos (ver EXACTORA), esto se aplica a cada una de las acciones de Combatir debidas a dicho efecto.",
        },
      ],
    },
    {
      id: "preceptora",
      name: "Novicia Preceptora",
      type: "PRECEPTORA",
      img: "imagenes/novicias-img/novicia-preceptora.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "PRECEPTORA"],
      w: [{ n: "Maza de la rectitud", a: 4, i: "4+", d: "5/5", r: ["Brutal", "Severa"] }],
      ru: [
        {
          n: "Ejemplo implacable",
          t: "Siempre que esta agente incapacite a un agente enemigo apostado que se encuentre en su zona de control, ganas 1 punto de fe, o 2 puntos de fe si ese agente enemigo tenía un atributo Heridas de 12 o más.",
        },
        {
          n: "Himnos gloriosos",
          t: "APOYO. Mientras una agente NOVICIA amiga se encuentre a 3\" o menos de esta agente, las armas de esa agente amiga tienen la regla de armas Severa.",
        },
      ],
    },
    {
      id: "pronatus",
      name: "Novicia Pronatus",
      type: "PRONATUS",
      img: "imagenes/novicias-img/novicia-pronatus.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "PRONATUS"],
      w: [{ n: "Pistola automática", a: 4, i: "4+", d: "2/3", r: ["Alcance 8\""] }, { n: "Culata", a: 3, i: "4+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Buscadora de reliquias",
          t: "Una vez por activación de esta agente, puede realizar una acción de Colocar marcador, Recoger marcador o una acción de misión por 1 PA menos.",
        },
        {
          n: "Adquisición divina",
          t: "Una vez por punto de inflexión, cuando esta agente realice una acción de misión que requiera que controle un objetivo o marcador de misión, ganas tantos puntos de fe como el número del punto de inflexión actual.",
        },
      ],
    },
    {
      id: "purgatus",
      name: "Novicia Purgatus",
      type: "PURGATUS",
      img: "imagenes/novicias-img/novicia-purgatus.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "PURGATUS"],
      w: [
        { n: "Lanzallamas Ministorum", a: 4, i: "2+", d: "4/4", r: ["Alcance 8\"", "Ráfaga 2\"", "Saturación"] },
        { n: "Culata", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Purgar con llamas",
          t: "Una vez por punto de inflexión, puedes usar el ardid de tiroteo Inmolación por 0PM si esta es la agente NOVICIA amiga especificada.",
        },
      ],
    },
    {
      id: "relicaria",
      name: "Novicia Relicaria",
      type: "RELICARIA",
      img: "imagenes/novicias-img/novicia-relicaria.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 7 },
      kw: ["NOVICIA", "IMPERIUM", "ADEPTA SORORITAS", "RELICARIA"],
      w: [{ n: "Pistola automática", a: 4, i: "4+", d: "2/3", r: ["Alcance 8\""] }, { n: "Culata", a: 3, i: "4+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Portaicono",
          t: "Al determinar el control de un marcador, trata el atributo LPA de esta agente como si fuera 1 mayor de lo que es. Ten en cuenta que esto no es un cambio a su atributo LPA, de modo que cualquier cambio será acumulable con esto.",
        },
        {
          n: "Alzar Icono (1PA)",
          t: "Ganas 1 punto de fe. Si esta agente controla un marcador de objetivo, además ganas tantos puntos de fe como el número del punto de inflexión actual. Esta agente solo puede realizar esta acción una vez por punto de inflexión, y no puede realizarla si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
  ],
  fr: {
    name: "Actos de fe",
    type: "REGLA DE FACCIÓN",
    text: "En el paso de preparación de cada fase de estrategia, ganas un número de puntos de fe igual a la mitad del número de agentes NOVICIA amigas que no hayan sido incapacitadas (redondeando al alza). Siempre que una agente NOVICIA amiga dispare, combata o contraataque, o un agente dispare contra ella, en el paso de tirar dados de ataque (o el paso de tirar dados de defensa si un agente dispara contra ella), puedes gastar tus puntos de fe para usar un ACTO DE FE. No puedes usar más de un ACTO DE FE por secuencia, y su coste y efectos son los siguientes (ver reverso):",
    orders: [],
  },
  frs: [
    {
      name: "Actos de fe",
      text: "En el paso de preparación de cada fase de estrategia, ganas un número de puntos de fe igual a la mitad del número de agentes NOVICIA amigas que no hayan sido incapacitadas (redondeando al alza). Siempre que una agente NOVICIA amiga dispare, combata o contraataque, o un agente dispare contra ella, en el paso de tirar dados de ataque (o el paso de tirar dados de defensa si un agente dispara contra ella), puedes gastar tus puntos de fe para usar un ACTO DE FE. No puedes usar más de un ACTO DE FE por secuencia, y su coste y efectos son los siguientes (ver reverso):",
      subs: [],
    },
  ],
  pl: {
    s: [
      {
        n: "Rejuvenecimiento bendito",
        t: "Siempre que gastes puntos de fe, al final de esa acción, la agente amiga en la que los gastaste puede recuperar hasta 1D3 heridas perdidas. Ten en cuenta que este ardid no tiene ningún efecto si esa agente amiga quedó incapacitada durante esa acción, o si el ACTO DE FE no cuesta ningún punto de fe, p.ej., gracias al equipo Autocastigadores.",
      },
      {
        n: "Avance de las justas",
        t: "Hasta un tercio de las agentes NOVICIA amigas en la zona de aniquilación (redondeando a la baja, hasta un mínimo de 1) pueden realizar inmediatamente una acción libre de Correr en el orden que elijas, pero todas las que lo hagan deberán terminar ese movimiento más cerca de lo que estaban del agente enemigo más cercano a ella, del marcador de objetivo más cercano a ella o de la zona de descenso de tu oponente (puedes elegir por separado para cada una). No puedes usar este ardid durante el primer punto de inflexión.",
      },
      {
        n: "Venganza ferviente",
        t: "Siempre que una agente NOVICIA amiga dispare, combata o contraataque contra un agente enemigo usado, las armas de esa agente amiga tienen la regla de armas Castigadora.",
      },
      {
        n: "Defensoras de la fe",
        t: "Siempre que un agente dispare, combata o contraataque contra una agente NOVICIA amiga que dispute un marcador de objetivo, en el paso de Resolver dados de ataque de esa secuencia puedes reducir a la mitad (redondeando a un mínimo de 2) el daño infligido a esa agente amiga por un éxito.",
      },
    ],
    f: [
      {
        n: "Aura cegadora",
        t: "Usa este ardid de tiroteo cuando un agente enemigo realice una acción de Disparar y tome como blanco válido una agente NOVICIA amiga. Hasta el final de esa activación o reacción, si la agente amiga tomada como blanco se encuentra a más de 2\" del agente enemigo en cuestión, tu oponente no puede tomarla como blanco válido. Si no hay otros blancos válidos que tu oponente pueda elegir, esa acción termina (ten en cuenta que no se cancela, por lo que ese agente sigue habiéndola realizado). Este ardid no tiene ningún efecto si la agente no es un blanco elegido (p.ej., si es un blanco secundario de un arma de Área).",
      },
      {
        n: "Guiada por la fe",
        t: "Usa este ardid de tiroteo cuando una agente NOVICIA amiga realice una acción de Disparar y estés eligiendo arma a distancia. Hasta el final de esa acción, cuando la agente en cuestión dispare contra un agente a 6\" o menos de ella, su arma tiene la regla de armas Buscadora (Ligero).",
      },
      {
        n: "Martirio glorioso",
        t: "Usa este ardid de tiroteo cuando una agente NOVICIA amiga resulte incapacitada, antes de retirarla de la zona de aniquilación. Por cada agente enemigo a 2\" o menos de ella y visible para ella, ganas 1 punto de fe e infliges 1D3 daños a dicho agente enemigo (tira por cada uno por separado).",
      },
      {
        n: "Inmolación ardiente",
        t: "Usa este ardid de tiroteo cuando una agente NOVICIA amiga dispare con un lanzallamas del Ministorum e inflijas daño con algún éxito crítico. El blanco recibe una de tus fichas de Inmolación (si no tenía ya una). Siempre que un agente con una de tus fichas de Inmolación sea activado:\n• Inflígele 1D3 daños.\n• Su jugador controlador puede restar 1 al LPA de dicho agente hasta el final de esa activación para retirar esa ficha. Esto debe hacerse antes de que el agente con la ficha de Inmolación realice ninguna acción durante esa activación.",
      },
    ],
  },
  eq: [
    {
      n: "Autocastigadores",
      t: "Una vez por punto de inflexión, cuando una agente NOVICIA amiga dispare, combata o contraataque, en el paso de Tirar dados de ataque puedes infligir 1-3 daños a esa agente amiga (pero no lo suficiente como para incapacitarla). Si lo haces, durante esa secuencia puedes usar gratis un ACTO DE FE cuyo coste en puntos de fe no sea mayor que el daño que has infligido mediante esta regla.",
    },
    { n: "Émbrocas sagradas", t: "Puedes ignorar cualquier cambio al atributo Movimiento de las agentes NOVICIA amigas por estar lesionadas." },
    {
      n: "Icono de la fe",
      t: "Una vez por punto de inflexión, puedes usar hasta dos ACTOS DE FE durante una secuencia, pero cada uno debe ser distinto. Esto tiene preferencia sobre las reglas normales de ACTOS DE FE.",
    },
    {
      n: "Proyectiles santificados",
      t: "Siempre que una agente NOVICIA amiga dispare con un bólter reliquia, una pistola automática, una pistola bólter reliquia o un rifle automático, si gastas un punto de fe, esa arma tendrá la regla de armas Críticos de penetración 1 hasta el final de esa secuencia.",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Agosto 2026",
      ee: [
        {
          s: "Agente exactora, acción inculcar a latigazos",
          t: "Cambia la segunda frase a: \"Hasta el final de la siguiente activación de esa agente, suma 1 a su atributo LPA, suma 1\" a su atributo Mov, y puede realizar dos acciones de Combatir durante su siguiente activación, y una de ellas puede ser libre\".",
        },
      ],
    },
    {
      v: "Comentarios de reglas · Agosto 2026",
      ee: [
        {
          s: "Ardides de estrategia, defensoras de la fe",
          t: "Cambia a: “Siempre que un agente dispare, combata o contraataque contra una agente NOVICIA amiga que dispute algún marcador de objetivo o 1 de tus marcadores de misión, en el paso de Resolver dados de ataque de esa secuencia puedes reducir a la mitad (redondeando al alza y hasta un mínimo de 2) el daño infligido a esa agente amiga por un éxito normal”.",
        },
        {
          s: "Ardides de estrategia, rejuvenecimiento bendito",
          t: "Cambia a: “Siempre que gastes puntos de fe, al final de esa acción, la agente amiga en la que los gastaste puede recuperar hasta 1D3 heridas perdidas. Ten en cuenta que este ardid no tiene ningún efecto si esa agente amiga quedó incapacitada durante esa acción, o si el ACTO DE FE no cuesta ningún punto de fe, p.ej., gracias al equipo Autocastigadores\".",
        },
        {
          s: "Ardides de tiroteo, martirio glorioso",
          t: "Añade este texto al final de la primera frase: \"Usa este ardid de tiroteo cuando una agente NOVICIA amiga resulte incapacitada, antes de retirarla de la zona de aniquilación\".",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Ardides de tiroteo, inmolación ardiente",
          t: "Cambia la primera frase a: […] con un lanzallamas del Ministorum e inflijas daño con algún éxito crítico\".",
        },
        {
          s: "Agente hospitalaria, regla ¡sanitaria! regla",
          t: "Cambia a: “La primera vez durante cada punto de inflexión que otra agente NOVICIA amiga vaya a resultar incapacitada mientras es visible para esta agente y estaba a 3\" o menos de ella, puedes usar esta regla siempre que ni esta ni esa agente estén en la zona de control de algún agente enemigo. Si lo haces, esa agente amiga no queda incapacitada, le queda 1 herida y no puede resultar incapacitada durante el resto de la acción. Después de esa acción, esa agente amiga puede entonces realizar inmediatamente una acción libre de Correr, pero debe terminar ese movimiento en la zona de control de esta agente. Resta 1 a los atributos LPA de esta y de esa agente hasta el final de sus próximas activaciones respectivamente, y si esta regla fue usada durante la activación de esa agente amiga, esa activación termina. No puedes usar esta regla si esta agente resulta incapacitada, o si es una acción de Disparar y esta agente iba a ser el blanco primario o secundario”.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Reconocimiento", "Seguridad"],
    required: [
      {
        type: "SUPERIORA",
        count: 1,
        loadouts: [
          { label: "Pistola de plasma; arma de energía", w: [{ n: "Pistola de plasma" }, { n: "Arma de energía" }] },
          { label: "Bólter reliquia; culata", w: [{ n: "Bólter reliquia" }, { n: "Culata" }] },
          { label: "Pistola bólter reliquia; arma de energía", w: [{ n: "Pistola bólter reliquia" }, { n: "Arma de energía" }] },
        ],
      },
    ],
    pool: {
      slots: 9,
      note: "Salvo Militantes y Purgatus, cada agente solo una vez. Hasta dos Purgatus.",
      entries: [
        { type: "CONDENADORA", max: 1 },
        { type: "DIALOGANTE", max: 1 },
        { type: "DUELISTA", max: 1 },
        { type: "EXACTORA", max: 1 },
        { type: "HOSPITALARIA", max: 1 },
        { type: "PENITENTE", max: 1 },
        { type: "PRECEPTORA", max: 1 },
        { type: "PRONATUS", max: 1 },
        { type: "PURGATUS", max: 2 },
        { type: "RELICARIA", max: 1 },
        { type: "MILITANTE", max: null, key: "militante-pistola", label: "Militante · pistola automática y espada" },
        { type: "MILITANTE", max: null, key: "militante-rifle", label: "Militante · rifle automático" },
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
