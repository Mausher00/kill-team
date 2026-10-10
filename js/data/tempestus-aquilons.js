// ============================================================
//  data/tempestus-aquilons.js — Tempestus Aquilons
//  Generado desde el PDF oficial: Tempestus Aquilons
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['tempestus-aquilons'] = {
  id: "tempestus-aquilons",
  name: "Tempestus Aquilons",
  subfaction: "Militarum Tempestus",
  icon: "⚡",
  img: "imagenes/tempestus-aquilons.png",
  desc: "Soldados de élite que descienden en paracaídas gravíticos. Maestros del ataque por inserción, combinan potencia de fuego con posicionamiento táctico.",
  tags: ["Imperium", "Reconocimiento", "Buscar y destruir"],
  version: "Agosto 2026",
  source: "Tempestus Aquilons",
  ops: [
    {
      id: "tempestor",
      name: "Tempestor Aquilon",
      type: "TEMPESTOR",
      img: "imagenes/tempestus-aquilons-img/tempestor.jpg",
      s: { lpa: 3, mov: "6\"", salv: "4+", h: 9 },
      kw: ["TEMPESTUS AQUILON", "IMPERIUM", "LÍDER", "TEMPESTOR"],
      w: [
        { n: "Carabina láser potenciada", a: 4, i: "3+", d: "3/4", r: [] },
        { n: "Pistola láser potenciada", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Pistola bólter reliquia", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Letal 5+"] },
        { n: "Espada sierra", a: 4, i: "3+", d: "4/5", r: [] },
        { n: "Puños", a: 3, i: "3+", d: "2/3", r: [] },
        { n: "Arma de energía", a: 4, i: "3+", d: "4/6", r: ["Letal 5+"] },
      ],
      ru: [
        {
          n: "Veterano tempestus",
          t: "Una vez por batalla, puedes usar o bien un ardid de tiroteo por 0PM si este es el agente TEMPESTUS AQUILON especificado, o bien el ardid de tiroteo Repetición de mando por 0PM si este es el agente por el que se han tirado los dados de ataque o defensa.",
        },
        {
          n: "Mando (1PA)",
          t: "APOYO. Elige un agente TEMPESTUS AQUILON amigo distinto (salvo SERVOCENTINELA) a 6\" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "granadero",
      name: "Granadero Aquilon",
      type: "GRANADERO",
      img: "imagenes/tempestus-aquilons-img/granadero.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["TEMPESTUS AQUILON", "IMPERIUM", "GRANADERO"],
      w: [
        { n: "Pistola láser potenciada", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        {
          n: "Bomba de fusión",
          a: 4,
          i: "3+",
          d: "5/3",
          r: ["Alcance 3\"", "Devastadora 3", "Limitada 1", "Penetración 2", "Pesada (solo Reposicionarse)"],
        },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Granadero",
          t: "Este agente puede usar granadas frag, perforantes, de humo y aturdidoras (ver equipo universal). Hacer esto no cuenta de cara a los usos limitados que tengas (es decir, si también seleccionas esas granadas como equipo para otros agentes). Cuando este agente use una granada frag o perforante, mejora en 1 el atributo Impactar de esa arma.",
        },
      ],
    },
    {
      id: "pistolero",
      name: "Pistolero Aquilon",
      type: "PISTOLERO",
      img: "imagenes/tempestus-aquilons-img/pistolero.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["TEMPESTUS AQUILON", "IMPERIUM", "PISTOLERO"],
      w: [
        { n: "Pistolas láser potenciadas (concentradas)", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Desgarradora", "Incesante"] },
        { n: "Pistolas láser potenciadas (salva)", a: 4, i: "4+", d: "3/4", r: ["Alcance 8\"", "Salva*"] },
        { n: "Pistolas láser potenciadas (a bocajarro)", a: 4, i: "3+", d: "3/4", r: ["Incesante"] },
      ],
      ru: [
        {
          n: "Salva",
          t: "Elige hasta dos blancos válidos diferentes que no estén en la zona de control de agentes amigos. Dispara con esta arma contra ambos, en el orden que elijas (tira cada secuencia por separado).",
        },
        {
          n: "Tirotear",
          t: "Siempre que un agente enemigo a 8\" o menos de este agente dispare contra él, lleva la cuenta de cada dado de ataque que se haya descartado como fallo. Tras la acción, antes de retirar a los agentes incapacitados (incluyendo a este, si procede), este agente puede realizar una acción libre de Disparar (para ello, cambia su orden a trabarse), pero solo puede tomar como blanco a ese agente enemigo con sus pistolas láser potenciadas (concentrado), y solo puedes tirar tantos dados de ataque como los dados de ataque descartados del oponente más 1 (hasta un máximo de 4).",
        },
      ],
    },
    {
      id: "tirador",
      name: "Tirador Aquilon",
      type: "TIRADOR",
      img: "imagenes/tempestus-aquilons-img/tirador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["TEMPESTUS AQUILON", "IMPERIUM", "TIRADOR"],
      w: [
        { n: "Carabina de fusión", a: 4, i: "3+", d: "6/3", r: ["Alcance 6\"", "Devastadora 4", "Penetración 2"] },
        { n: "Carabina de plasma (normal)", a: 4, i: "3+", d: "4/6", r: ["Penetración 1"] },
        { n: "Carabina de plasma (sobrecarga)", a: 4, i: "3+", d: "5/6", r: ["Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [],
    },
    {
      id: "ojo-preciso",
      name: "Ojo Preciso Aquilon",
      type: "OJO PRECISO",
      img: "imagenes/tempestus-aquilons-img/ojo-preciso.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["TEMPESTUS AQUILON", "IMPERIUM", "OJO PRECISO"],
      w: [
        {
          n: "Rifle láser telescópico potenciado (oculto)",
          a: 4,
          i: "2+",
          d: "3/3",
          r: ["Devastadora 3", "Pesada", "Silenciosa", "Posición oculta*"],
        },
        { n: "Rifle láser telescópico potenciado (móvil)", a: 4, i: "3+", d: "3/4", r: [] },
        { n: "Rifle láser telescópico potenciado (inmóvil)", a: 4, i: "2+", d: "3/3", r: ["Devastadora 3", "Pesada"] },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Ventaja de francotirador",
          t: "Siempre que este agente esté en terreno Aventajado y dispare contra un agente que tenga una orden de trabarse y se encuentre al menos 2\" por debajo de él, todos los perfiles de su rifle láser telescópico potenciado tienen la regla de arma Severa.",
        },
        { n: "Posición oculta", t: "Este agente solo puede usar esta arma la primera vez que realiza una acción de Disparar durante la batalla." },
      ],
    },
    {
      id: "precursor",
      name: "Precursor Aquilon",
      type: "PRECURSOR",
      img: "imagenes/tempestus-aquilons-img/precursor.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["TEMPESTUS AQUILON", "IMPERIUM", "PRECURSOR"],
      w: [
        { n: "Pistola láser potenciada", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Daga Tempestus", a: 4, i: "3+", d: "3/4", r: ["Incesante", "Letal 5+"] },
      ],
      ru: [
        {
          n: "Salvaje luchador a cuchillo",
          t: "Cuando este agente combata, tras resolver tu primer dado de ataque, puedes resolver otro de inmediato (antes que tu oponente).",
        },
        {
          n: "Enérgico",
          t: "Siempre que este agente realice la acción de Combatir o Disparar, puede realizar inmediatamente después una acción libre de Correr. Puede hacerlo incluso si ha realizado una acción de Cargar durante esta activación.",
        },
      ],
    },
    {
      id: "servocentinela",
      name: "Servocentinela Aquilon",
      type: "SERVOCENTINELA",
      img: "imagenes/tempestus-aquilons-img/servocentinela.jpg",
      s: { lpa: 2, mov: "4\"", salv: "3+", h: 10 },
      kw: ["TEMPESTUS AQUILON", "IMPERIUM", "SERVOCENTINELA"],
      w: [
        { n: "Lanzallamas", a: 4, i: "2+", d: "3/3", r: ["Alcance 8\"", "Ráfaga 2\"", "Saturación"] },
        { n: "Lanzagranadas (frag)", a: 4, i: "4+", d: "2/4", r: ["Área 2\""] },
        { n: "Lanzagranadas (perforante)", a: 4, i: "4+", d: "4/5", r: ["Penetración 1"] },
        { n: "Fusil repetidor potenciado (concentrado)", a: 5, i: "4+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Fusil repetidor potenciado (barrido)", a: 4, i: "4+", d: "3/4", r: ["Críticos de penetración 1", "Ráfaga 1\""] },
      ],
      ru: [
        {
          n: "Máquina",
          t: "Este agente solo puede realizar acciones de Correr, Disparar, Reposicionarse y Retroceder. No puede contraatacar, asistir en un combate ni usar armas que no figuren en su tarjeta de datos.",
        },
        { n: "Torreta", t: "Este agente puede realizar dos acciones de Disparar durante su activación." },
      ],
    },
    {
      id: "soldado",
      name: "Soldado Aquilon",
      type: "SOLDADO",
      img: "imagenes/tempestus-aquilons-img/soldado.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["TEMPESTUS AQUILON", "IMPERIUM", "SOLDADO"],
      w: [{ n: "Carabina láser potenciada", a: 4, i: "3+", d: "3/4", r: [] }, { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Inserción rápida",
          t: "GAMBITO ESTRATÉGICO en el primer punto de inflexión. Cada agente SOLDADO TEMPESTUS AQUILON amigo completamente dentro de tu zona de descenso puede realizar inmediatamente una acción libre de Reposicionarse, pero debe terminar dicha acción completamente a 3\" o menos de tu zona de descenso.",
        },
        {
          n: "Aterrizaje raudo",
          t: "Cuando este agente aterrice, puedes desplegarlo a 4\" o menos en horizontal de uno de tus marcadores de descenso. Esto tiene preferencia sobre el requisito normal de distancia.",
        },
      ],
    },
  ],
  fr: {
    name: "Descenso de inserción",
    type: "REGLA DE FACCIÓN",
    text: "Al desplegar un comando TEMPESTUS AQUILON antes de la batalla, el primer tercio de tu comando debe desplegarse de manera normal. Cada tercio posterior puede ser desplegado en las alturas: colócalo a un lado en lugar de en la zona de aniquilación. Para cada tercio que se despliegue en las alturas, debes desplegar así todo ese tercio (no solo algunas de sus miniaturas), y a continuación colocar uno de tus marcadores de descenso completamente dentro de tu zona de descenso. Como GAMBITO ESTRATÉGICO en el primer y segundo punto de inflexión, puedes mover tus marcadores de descenso hasta 4\" en horizontal. En una zona de aniquilación que use el combate cerrado (p. ej., Zona de aniquilación: Mundo Necrópolis), puedes medir y moverlos a través de muros. Durante la fase de tiroteo, los agentes TEMPESTUS AQUILON amigos desplegados en las alturas se activan de manera normal. Al activar a cada agente, puedes decidir si aterriza o si es usado. Si aterriza, despliégalo en la zona de aniquilación en una ubicación donde pueda colocarse, de acuerdo a lo siguiente (y deja de estar en las alturas):",
    orders: [{ n: "Paracaídas gravítico", t: "Siempre que un agente TEMPESTUS AQUILON amigo se deja caer, ignora la distancia vertical." }],
  },
  frs: [
    {
      name: "Descenso de inserción",
      text: "Al desplegar un comando TEMPESTUS AQUILON antes de la batalla, el primer tercio de tu comando debe desplegarse de manera normal. Cada tercio posterior puede ser desplegado en las alturas: colócalo a un lado en lugar de en la zona de aniquilación. Para cada tercio que se despliegue en las alturas, debes desplegar así todo ese tercio (no solo algunas de sus miniaturas), y a continuación colocar uno de tus marcadores de descenso completamente dentro de tu zona de descenso. Como GAMBITO ESTRATÉGICO en el primer y segundo punto de inflexión, puedes mover tus marcadores de descenso hasta 4\" en horizontal. En una zona de aniquilación que use el combate cerrado (p. ej., Zona de aniquilación: Mundo Necrópolis), puedes medir y moverlos a través de muros. Durante la fase de tiroteo, los agentes TEMPESTUS AQUILON amigos desplegados en las alturas se activan de manera normal. Al activar a cada agente, puedes decidir si aterriza o si es usado. Si aterriza, despliégalo en la zona de aniquilación en una ubicación donde pueda colocarse, de acuerdo a lo siguiente (y deja de estar en las alturas):",
      subs: [],
    },
    { name: "Paracaídas gravítico", text: "Siempre que un agente TEMPESTUS AQUILON amigo se deja caer, ignora la distancia vertical.", subs: [] },
  ],
  pl: {
    s: [
      {
        n: "Ofensiva súbita",
        t: "Cuenta el número de agentes TEMPESTUS AQUILON amigos que no están incapacitados, y a continuación reduce ese número a la mitad (redondeando al alza), para obtener un resultado de x. Hasta el final de su activación, las armas de los x primeros agentes TEMPESTUS AQUILON amigos en ser activados durante este punto de inflexión tienen la regla de armas Equilibrada. Por ejemplo, si tienes cinco agentes se beneficiarán los primeros tres agentes amigos activados.",
      },
      {
        n: "Mantener la dinámica",
        t: "Siempre que un agente TEMPESTUS AQUILON amigo dispare o combata contra un agente enemigo apostado, sus armas tienen la regla de armas Severa.",
      },
      {
        n: "Ojos vigilantes",
        t: "Elige un agente enemigo. Dicho agente y todos los demás agentes enemigos a 3\" o menos de él ganan una de tus fichas de Detectado hasta el final del punto de inflexión. Siempre que un agente enemigo con una ficha de Detectado:\n• Dispare contra un agente TEMPESTUS AQUILON amigo, puedes repetir uno de tus dados de defensa.\n• Combata o contraataque contra un agente TEMPESTUS AQUILON amigo, uno de tus bloqueos puede asignarse a bloquear dos de los éxitos sin resolver (en lugar de solo uno).",
      },
      {
        n: "Descender y asegurar",
        t: "Elige un marcador.\n• Hasta el paso de Preparación del siguiente punto de inflexión, al determinar el control de ese marcador, trata el atributo LPA total de los agentes TEMPESTUS AQUILON amigos que lo estén disputando como si fuera 1 punto mayor, siempre y cuándo haya al menos un agente TEMPESTUS AQUILON amigo disputándolo.\n• Mientras un agente TEMPESTUS AQUILON amigo se encuentre a 3\" o menos de ese marcador, suma 1 al atributo Ataque de sus armas de combate (hasta un máximo de 4).",
      },
    ],
    f: [
      {
        n: "Inserción en zona caliente",
        t: "Usa este ardid de tiroteo tras tirar los dados de ataque por un agente TEMPESTUS AQUILON amigo que esté completamente en el territorio de tu oponente, o que haya aterrizado o se haya dejado caer desde terreno Aventajado al menos 2\" por encima del suelo de la zona de aniquilación durante esta activación. Si el blanco está a 6\" o menos de él, puedes repetir cualesquiera de tus dados de ataque.",
      },
      {
        n: "Ajustar coordenadas",
        t: "Usa este ardid de tiroteo cuando un agente TEMPESTUS AQUILON amigo aterrice. Puedes desplegarlo a 5\" o menos en horizontal de uno de tus marcadores de descenso. Esto tiene preferencia sobre el requisito normal de distancia. No puede realizar acciones de Combatir, Correr o Disparar durante este punto de inflexión.",
      },
      {
        n: "Tempestus ejemplares",
        t: "Usa este ardid de tiroteo durante la activación de un agente TEMPESTUS AQUILON amigo (salvo SERVOCENTINELA o cualquier agente con un atributo LPA mayor de 2). Durante esa activación, puede realizar la acción Colocar marcador, Recoger marcador o una acción de misión por 1 PA menos.",
      },
      {
        n: "Progena",
        t: "Usa este ardid de tiroteo cuando un agente TEMPESTUS AQUILON amigo (salvo SERVOCENTINELA) sea activado. Recupera 2D3 heridas perdidas, y durante esa activación puedes ignorar cualquier cambio a su atributo LPA.",
      },
    ],
  },
  eq: [
    {
      n: "Dagas tempestus",
      t: "Los agentes TEMPESTUS AQUILON amigos (salvo SERVOCENTINELA) tienen la siguiente arma de combate:\nATQ IMP DAÑO\n▸ Daga Tempestus — ATQ 3 · IMP 4+ · DAÑO 3/4",
    },
    {
      n: "Estimulantes de combate",
      t: "Puedes ignorar cualquier cambio al atributo Movimiento de los agentes TEMPESTUS AQUILON amigos por estar lesionados.",
    },
    {
      n: "Augurio preinserción",
      t: "Una vez durante la batalla, al activar un agente TEMPESTUS AQUILON amigo desplegado en las alturas, antes de decidir si el agente aterriza o es usado, puedes mover de nuevo uno de tus marcadores de descenso. No obstante, no puede moverse más cerca de lo que está de la zona de descenso de tu oponente.",
    },
    { n: "Supervisor remoto", t: "Una vez por batalla, tras desempatar para decidir la iniciativa, puedes repetir tu D6." },
  ],
  er: [
    {
      v: "Fe de erratas · Agosto 2026",
      ee: [
        {
          s: "Agente precursor, regla enérgico",
          t: "Elimina la parte relevante: Siempre que este agente realice una acción de Combatir o Disparar, puede realizar inmediatamente después una acción libre de Correr. Puede hacerlo incluso si ha realizado una acción de Cargar durante esta activación, pero solo puede usar la distancia restante que le quedase de esa acción de Cargar (hasta un máximo de 3\").",
        },
        {
          s: "Ardides estratégicos, mantener la dinámica",
          t: "Cambia a: “Siempre que un agente TEMPESTUS AQUILON amigo dispare a o combata contra un agente enemigo apostado, las armas de ese agente amigo tienen la regla de arma Severa.”",
        },
        {
          s: "Ardides de estrategia, descender y asegurar",
          t: "Cambia la parte relevante de la primera frase del primer punto a: “Hasta el paso de Preparación del siguiente punto de inflexión, al determinar el control de ese marcador, […]”",
        },
        {
          s: "Ardides de tiroteo, inserción en zona caliente",
          t: "Cambia la primera frase a: “Usa este ardid de tiroteo tras tirar los dados de ataque por un agente TEMPESTUS AQUILON amigo que esté completamente en el territorio de tu oponente, o que haya aterrizado o se haya dejado caer desde terreno Aventajado al menos 2\" por encima del suelo de la zona de aniquilación durante esta activación.” Esta sección aclara interacciones complejas o ambiguas entre reglas. P: Si un agente enemigo dispara a un agente amigo PISTOLERO y no descarta ningún fallo, ¿puedo yo seguir disparando con la regla Tirotear usando 1 dado de ataque? R: Sí.",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Selección de comando",
          t: "SERVOCENTINELA tiene ahora su propio punto separado. Elimina la siguiente frase y asteriscos en TIRADOR, OJO PRECISO y SERVOCENTINELA: “*No puedes elegir más de tres de estos agentes en total.”",
        },
        {
          s: "Agente pistolero, regla de arma salva",
          t: "Cambia la primera frase a: “Elige hasta 2 blancos válidos diferentes que no estén en la zona de control de agentes amigos.”",
        },
        { s: "Agente precursor, arma daga tempestus", t: "Añadida la regla de arma “Incesante”." },
      ],
    },
  ],
  roster: {
    archetypes: ["Reconocimiento", "Buscar y destruir"],
    required: [
      {
        type: "TEMPESTOR",
        count: 1,
        loadouts: [
          { label: "Pistola láser potenciada; arma de energía", w: [{ n: "Pistola láser potenciada" }, { n: "Arma de energía" }] },
          { label: "Pistola bólter reliquia; espada sierra", w: [{ n: "Pistola bólter reliquia" }, { n: "Espada sierra" }] },
          { label: "Carabina láser potenciada; puños", w: [{ n: "Carabina láser potenciada" }, { n: "Puños" }] },
        ],
      },
      {
        type: "SERVOCENTINELA",
        count: 1,
        loadouts: [
          { label: "Lanzallamas", w: [{ n: "Lanzallamas" }] },
          { label: "Lanzagranadas", w: [{ n: "Lanzagranadas" }] },
          { label: "Fusil repetidor potenciado", w: [{ n: "Fusil repetidor potenciado" }] },
        ],
      },
    ],
    pool: {
      slots: 9,
      note: "Salvo Soldados, cada agente solo una vez.",
      entries: [
        { type: "GRANADERO", max: 1 },
        { type: "PISTOLERO", max: 1 },
        { type: "TIRADOR", max: 1, key: "tirador-fusion", label: "Tirador · carabina de fusión" },
        { type: "TIRADOR", max: 1, key: "tirador-plasma", label: "Tirador · carabina de plasma" },
        { type: "OJO PRECISO", max: 1 },
        { type: "PRECURSOR", max: 1 },
        { type: "SOLDADO", max: null },
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
