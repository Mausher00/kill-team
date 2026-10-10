// ============================================================
//  data/mano-arconte.js — Mano del Arconte
//  Generado desde el PDF oficial: Hand of the Archon (ene. 2026)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['mano-arconte'] = {
  id: "mano-arconte",
  name: "Mano del Arconte",
  subfaction: "Drukhari",
  icon: "🗡️",
  img: "imagenes/mano-arconte.webp",
  desc: "Kabalistas drukhari al servicio de un Arconte: venenos, armas de luzoscura y crueldad refinada.",
  tags: ["Aeldari", "Reconocimiento", "Buscar y destruir"],
  version: "Enero 2026",
  source: "Hand of the Archon (ene. 2026)",
  ops: [
    {
      id: "archisibarita",
      name: "Archisibarita Kabalista",
      type: "ARCHISIBARITA",
      img: "imagenes/mano-arconte-img/archisibarita-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 9 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "LÍDER", "ARCHISIBARITA"],
      w: [
        { n: "Pistola bláster", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Penetración 2"] },
        { n: "Pistola cristalina", a: 4, i: "3+", d: "2/4", r: ["Alcance 8\"", "Letal 5+"] },
        { n: "Rifle cristalino", a: 4, i: "3+", d: "2/4", r: ["Letal 5+"] },
        { n: "Agonizador", a: 4, i: "3+", d: "3/5", r: ["Brutal", "Choque", "Letal 5+"] },
        { n: "Arma de energía", a: 4, i: "3+", d: "4/6", r: ["Letal 5+"] },
        { n: "Cuchillas por doquier", a: 3, i: "3+", d: "3/4", r: [] },
        { n: "Espada venenosa", a: 4, i: "3+", d: "4/5", r: ["Letal 4+"] },
      ],
      ru: [
        {
          n: "Astucia",
          t: "En el paso de gambito de cada fase de estrategia, si este agente está en la zona de aniquilación y pasas en la primera oportunidad que tengas, ganas 1PM. Ignora cada GAMBITO ESTRATÉGICO del pack de misiones (si lo hay) al determinar esto.",
        },
        {
          n: "Ojo para la tortura",
          t: "Una vez durante cada activación de este agente, si no tiene ninguna de tus fichas de Dolor cuando realiza una acción de Combatir o Disparar, puede obtener una de tus fichas de Dolor cuando elijas un blanco válido o un agente enemigo contra el que combatir.",
        },
      ],
    },
    {
      id: "espia",
      name: "Espía Kabalista",
      type: "ESPÍA",
      img: "imagenes/mano-arconte-img/espia-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 8 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "ESPÍA"],
      w: [{ n: "Rifle cristalino", a: 4, i: "3+", d: "2/4", r: ["Letal 5+"] }, { n: "Cuchillas por doquier", a: 3, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Competición sádica",
          t: "Una vez por punto de inflexión que otro agente MANO DEL ARCONTE amigo obtenga una de tus fichas de Dolor, un ESPÍA MANO DEL ARCONTE amigo que no tenga una de tus fichas de Dolor puede también obtener una.",
        },
      ],
    },
    {
      id: "duelista-carmesi",
      name: "Duelista Carmesí Kabalista",
      type: "DUELISTA CARMESÍ",
      img: "imagenes/mano-arconte-img/duelista-carmesi-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 8 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "DUELISTA CARMESÍ"],
      w: [
        { n: "Pistola cristalina", a: 4, i: "3+", d: "2/4", r: ["Alcance 8\"", "Letal 5+"] },
        { n: "Enredador cuchilla", a: 4, i: "2+", d: "4/5", r: ["Brutal", "Enredar*"] },
      ],
      ru: [
        {
          n: "Exhibición brutal",
          t: "Una vez por punto de inflexión, cuando este agente incapacite a un agente enemigo en su zona de control, puedes elegir a otro agente enemigo a 6\" o menos de cualquier agente o del agente enemigo incapacitado y que sea visible para él. Hasta el inicio del siguiente punto de inflexión, ese otro agente enemigo no puede controlar marcadores ni realizar acciones de Recoger marcador ni de misión.",
        },
        { n: "Duelista Carmesí", t: "Este agente puede realizar 2 acciones de Combatir durante su activación." },
        {
          n: "Enredar",
          t: "Cuando este agente combate o contraataca con esta arma, cada uno de tus bloqueos puede asignarse para bloquear dos éxitos sin resolver (en lugar de uno).",
        },
      ],
    },
    {
      id: "discipulo-de-yaelindra",
      name: "Discípulo de Yaelindra Kabalista",
      type: "DISCÍPULO DE YAELINDRA",
      img: "imagenes/mano-arconte-img/discipulo-de-yaelindra-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 8 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "DISCÍPULO DE YAELINDRA"],
      w: [
        { n: "Pistola aguijón", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Letal 5+", "Aguijón*"] },
        { n: "Cuchillas por doquier", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Aguijón",
          t: "Cuando un agente enemigo queda incapacitado por esta arma, antes de retirarlo de la zona de aniquilación, inflige 1D3 daños a cada otro agente a 2\" o menos ese agente enemigo y visible para él (tira por separado por cada uno). Cada agente que quede subsiguientemente incapacitado debido a esta regla de armas provocará que esto vuelva a suceder.",
        },
        {
          n: "Granada Tormento (1PA)",
          t: "Elige un agente enemigo a 6\" o menos de este agente y visible para él. El agente enemigo elegido y cada otro agente a 1\" o menos de él hacen un chequeo de veneno. Para que un agente haga un chequeo de veneno, tira 1D6, sumando 1 al resultado si ese agente tiene un atributo Salvación de 4+ o peor: si el resultado es 3+, infliges 1D3 daños a ese agente y este obtiene una de tus fichas de Veneno (si no tiene ya una). Cuando un agente que tenga una de tus fichas de Veneno sea activado, inflígele 1D3 daños. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "elixicante",
      name: "Elixicante Kabalista",
      type: "ELIXICANTE",
      img: "imagenes/mano-arconte-img/elixicante-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 8 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "ELIXICANTE"],
      w: [
        { n: "Rifle cristalino", a: 4, i: "3+", d: "2/4", r: ["Letal 5+"] },
        { n: "Inyectaestimulantes", a: 4, i: "3+", d: "0/0", r: ["Alcance 3\"", "Aturdidora", "Letal 3+"] },
        { n: "Cuchillas por doquier", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Drogas de combate",
          t: "Al final del paso de Elegir agentes, si este agente es elegido para el despliegue, elige una de las siguientes reglas DROGA DE COMBATE, que tendrán los agentes MANO DEL ARCONTE durante esta batalla:\n• Dolorosa: Cuando un dado de ataque inflija un daño de 3 o más a este agente, tira 1D6: con un 6, resta 1 al daño infligido.\n• Adrenaluz: En el paso de preparación de cada fase de estrategia, elige un agente amigo que tenga esta DROGA DE COMBATE; ese agente obtiene una de tus fichas de Dolor.\n• Velocet: Puedes ignorar cualquier cambio al atributo Movimiento de este agente por estar lesionado.",
        },
        {
          n: "Administrar Droga (1PA)",
          t: "Elige un agente MANO DEL ARCONTE amigo a 3\" o menos de esta agente y visible para él, y a continuación elige una de las siguientes opciones para ese agente amigo:\n• Recupera hasta 2D3 heridas perdidas.\n• Elige una regla DROGA DE COMBATE distinta para que la tenga en esa batalla (esto reemplaza a la anterior). Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "despellejador",
      name: "Despellejador Kabalista",
      type: "DESPELLEJADOR",
      img: "imagenes/mano-arconte-img/despellejador-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 8 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "DESPELLEJADOR"],
      w: [{ n: "Escultores de dolor", a: 4, i: "3+", d: "4/5", r: ["Incesante", "Desollar*"] }],
      ru: [
        { n: "Insensible al dolor", t: "Los Daños normales y críticos de 3 o más infligen 1 daño menos a este agente." },
        {
          n: "Desollar",
          t: "Siempre que este agente usa esta arma, la primera vez que golpees con un éxito crítico durante esa secuencia, puedes elegir un agente MANO DEL ARCONTE amigo a 6\" o menos de él para que obtenga una de tus fichas de Dolor.",
        },
      ],
    },
    {
      id: "tirador",
      name: "Tirador Kabalista",
      type: "TIRADOR",
      img: "imagenes/mano-arconte-img/tirador-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 8 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "TIRADOR"],
      w: [
        { n: "Bláster", a: 4, i: "3+", d: "4/5", r: ["Penetración 2"] },
        { n: "Desgarrador", a: 4, i: "3+", d: "4/5", r: ["Desgarradora", "Ráfaga 2\""] },
        { n: "Cuchillas por doquier", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "tirador-pesado",
      name: "Tirador Pesado Kabalista",
      type: "TIRADOR PESADO",
      img: "imagenes/mano-arconte-img/tirador-pesado-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 8 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "TIRADOR PESADO"],
      w: [
        { n: "Cañón cristalino (concentrado)", a: 5, i: "3+", d: "3/5", r: ["Letal 5+", "Pesada (solo Correr)"] },
        { n: "Cañón cristalino (barrido)", a: 4, i: "3+", d: "3/5", r: ["Letal 5+", "Pesada (solo Correr)", "Ráfaga 1\""] },
        { n: "Lanza oscura", a: 4, i: "3+", d: "6/7", r: ["Penetración 2", "Pesada (solo Correr)"] },
        { n: "Cuchillas por doquier", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "asesino-partecielos",
      name: "Asesino Partecielos Kabalista",
      type: "ASESINO PARTECIELOS",
      img: "imagenes/mano-arconte-img/asesino-partecielos-kabalista.webp",
      s: { lpa: 2, mov: "7\"", salv: "4+", h: 8 },
      kw: ["MANO DEL ARCONTE", "AELDARI", "DRUKHARI", "ASESINO PARTECIELOS"],
      w: [
        { n: "Filopluma", a: 4, i: "4+", d: "1/2", r: ["Buscadora", "Saturación", "Silenciosa"] },
        { n: "Carabina cristalina", a: 4, i: "2+", d: "2/2", r: ["Devastadora 2", "Letal 5+"] },
        { n: "Cuchillas por doquier", a: 3, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Cazador implacable",
          t: "Si este agente no realiza la acción única Marcar (ver reverso de la tarjeta) durante su activación, puede realizar dos acciones de Disparar durante su activación, pero debe elegirse un filopluma para una (y solo una) de estas acciones.",
        },
        {
          n: "Presagio",
          t: "En el paso de Elegir agentes, cuando selecciones el equipo, puedes elegir un agente enemigo u otro agente MANO DEL ARCONTE amigo distinto (revela tu selección cuando reveles el equipo). Cuando se tiren dados de ataque o defensa por ese agente:\n• Si es un agente enemigo, tu oponente debe repetir sus resultados de 6.\n• Si es un agente amigo, puedes repetir cualesquiera de tus resultados de 1.",
        },
        {
          n: "Marcar (1PA)",
          t: "Elige un agente enemigo visible para este agente. Hasta el final del punto de inflexión, cuando este agente dispare contra ese agente enemigo, puedes usar este efecto.",
          isAct: true,
        },
        {
          n: "Si lo haces",
          t: "• Las armas a distancia de este agente tienen la regla de armas Buscadora (Ligero).\n• Ese agente enemigo no puede estar ofuscado. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
        },
      ],
    },
  ],
  fr: {
    name: "Poder del dolor",
    type: "REGLA DE FACCIÓN",
    text: "Después de que un agente MANO DEL ARCONTE amigo realice una acción, ganará una de tus fichas de Dolor si:\n• Un agente enemigo ha sido lesionado durante esa acción, pero no ha quedado incapacitado.\n• Un agente enemigo ha quedado incapacitado durante esa acción. Si ese agente enemigo tenía un atributo Heridas de 12 o más, en lugar de lo anterior el agente amigo en cuestión gana dos de tus fichas de Dolor. Puedes gastar fichas de Dolor de agentes amigos en potenciaciones siempre que se cumpla la condición “cuándo”. No puedes usar más de una potenciación por activación o reacción, excepto Sentidos estimulados, que puede utilizarse una vez por activación o reacción además de otra potenciación.",
    orders: [
      {
        n: "Rifles",
        t: "Siempre que un agente MANO DEL ARCONTE amigo dispara con un rifle cristalino durante una activación en la que no haya realizado una acción de Cargar, Retroceder o Reposicionarse, esa arma tiene la regla de armas Certera 1. Ten en cuenta que el agente no se ve impedido de realizar esas acciones después de disparar.",
      },
    ],
  },
  frs: [
    {
      name: "Poder del dolor",
      text: "Después de que un agente MANO DEL ARCONTE amigo realice una acción, ganará una de tus fichas de Dolor si:\n• Un agente enemigo ha sido lesionado durante esa acción, pero no ha quedado incapacitado.\n• Un agente enemigo ha quedado incapacitado durante esa acción. Si ese agente enemigo tenía un atributo Heridas de 12 o más, en lugar de lo anterior el agente amigo en cuestión gana dos de tus fichas de Dolor. Puedes gastar fichas de Dolor de agentes amigos en potenciaciones siempre que se cumpla la condición “cuándo”. No puedes usar más de una potenciación por activación o reacción, excepto Sentidos estimulados, que puede utilizarse una vez por activación o reacción además de otra potenciación.",
      subs: [],
    },
    {
      name: "Rifles",
      text: "Siempre que un agente MANO DEL ARCONTE amigo dispara con un rifle cristalino durante una activación en la que no haya realizado una acción de Cargar, Retroceder o Reposicionarse, esa arma tiene la regla de armas Certera 1. Ten en cuenta que el agente no se ve impedido de realizar esas acciones después de disparar.",
      subs: [],
    },
  ],
  pl: {
    s: [
      { n: "Artistas de la hoja", t: "Las armas de combate de los agentes MANO DEL ARCONTE amigos tienen la regla de armas Desgarradora." },
      {
        n: "Sádicos despiadados",
        t: "Siempre que un agente MANO DEL ARCONTE amigo dispare o combata contra un agente enemigo herido, las armas de dicho agente amigo tienen la regla de armas Equilibrada.",
      },
      {
        n: "Desde la oscuridad, muerte",
        t: "Cuando un agente MANO DEL ARCONTE amigo sea activado, antes de determinar su orden puedes elegir un agente enemigo para el que dicho agente amigo no sea un blanco válido. Hasta el final de esa activación, la primera vez que ese agente amigo dispare o combata contra ese agente enemigo, puedes guardar uno de tus éxitos normales como éxito crítico en su lugar.",
      },
      {
        n: "Moradores de la noche",
        t: "Siempre que un agente enemigo dispare contra un agente MANO DEL ARCONTE amigo a más de 2\" de todo agente enemigo, si hay terreno Pesado o Ligero interpuesto o cualquier parte de la peana de ese agente amigo se encuentra bajo terreno Aventajado, puedes repetir uno de tus dados de defensa.",
      },
    ],
    f: [
      {
        n: "Engaño cruel",
        t: "Usa este ardid de tiroteo durante la activación de un agente MANO DEL ARCONTE amigo, antes o después de que realice una acción. Durante esa activación, ese agente puede realizar una acción de Retroceder por 1 PA menos.",
      },
      {
        n: "Argucia retorcida",
        t: "Usa este ardid de tiroteo después de que un oponente utilice un ardid de tiroteo (excepto uno que cueste 0PM). La siguiente vez que fuera a usar ese ardid, debe gastar 1 PM adicional para hacerlo (y en ese momento este efecto termina). No puedes usar este ardid de nuevo durante la batalla hasta que su efecto haya terminado.",
      },
      { n: "Arrogancia atroz", t: "Usa este ardid de tiroteo cuando sea tu turno de activar un agente amigo. Puedes saltarte esa activación." },
      {
        n: "Depredar a los heridos",
        t: "Usa este ardid de tiroteo tras tirar tus dados de ataque por un agente MANO DEL ARCONTE amigo, si está disparando o combatiendo contra un agente enemigo herido. Puedes repetir cualquiera de tus dados de ataque.",
      },
    ],
  },
  eq: [
    {
      n: "Cepo de cadena",
      t: "Cuando un agente enemigo vaya a realizar una acción de Retroceder mientras se encuentra en la zona de control de un agente MANO DEL ARCONTE amigo, si no hay otros agente enemigos en la zona de control de ese agente amigo, puedes usar esta regla. En tal caso, tira dos D6, o un D6 si ese agente enemigo tiene un atributo Heridas mayor que el del agente amigo en cuestión. Si cualquier resultado es un 4+, dicho agente enemigo no puede realizar esa acción durante esta activación o reacción (no se gastan PA en ella), y no puedes volver a usar esta regla durante este punto de inflexión.",
    },
    { n: "Hojas mezquinas", t: "Suma 1 al atributo Ataque de las cuchillas por doquier de los agentes MANO DEL ARCONTE amigos." },
    {
      n: "Cobertura tóxica",
      t: "Hasta dos veces por punto de inflexión, cuando un agente MANO DEL ARCONTE amigo combata o contraataque y estés eligiendo un arma de combate, puedes usar esta regla. Si lo haces, hasta el final de esa secuencia el arma de combate de dicho agente tiene la regla de armas Letal 5+.",
    },
    {
      n: "Veneno refinado",
      t: "Hasta dos veces por punto de inflexión, cuando un agente MANO DEL ARCONTE amigo realice la acción Disparar y elijas una carabina cristalina, un cañón cristalino, una pistola cristalina, un rifle cristalino o una pistola aguijón, puedes usar esta regla. Si lo haces, hasta el final de la acción suma 1 al atributo Daño normal de dicha arma.",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Enero 2026",
      ee: [
        { s: "Agente archisibarita", t: "Añadida la regla “Ojo para la tortura”." },
        {
          s: "Agente elixicante, regla drogas de combate",
          t: "Cambia el segundo punto a: “Adrenaluz: En el paso de preparación de cada fase de estrategia, puedes elegir un agente amigo que tenga esta DROGA DE COMBATE; ese agente obtiene una de tus fichas de Dolor”.",
        },
        {
          s: "Equipo de facción, cepo de cadena",
          t: "Cambia la última frase a: “Si cualquier resultado es un 4+, dicho agente enemigo no puede realizar esa acción durante esta activación o reacción (no se gastan PA en ella), y no puedes volver a usar esta regla durante este punto de inflexión”.",
        },
        {
          s: "Agente archisibarita, regla astucia",
          t: "Cambia la primera frase a: “En el paso de gambito de cada fase de estrategia, si este agente está en la zona de aniquilación y pasas en la primera oportunidad que tengas, ganas 1PM”. Añade este texto al final: “Ignora cada GAMBITO ESTRATÉGICO del pack de misiones (si lo hay) al determinar esto.”",
        },
        {
          s: "Agente duelista carmesí, regla duelista carmesí",
          t: "Cambiar a: “Este agente puede realizar 2 acciones de Combatir durante su activación”.",
        },
        { s: "Agente asesino partecielos, arma filopluma", t: "Cambia su atributo Ataq. a “4”." },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Ardides de estrategia, moradores de la noche",
          t: "Cambiar la parte relevante a: “[...] si hay terreno Pesado o Ligero interpuesto, [...]”",
        },
        {
          s: "Ardides de tiroteo, engaño cruel",
          t: "Cambiar la primera frase a: “Usa este ardid de tiroteo durante la activación de un agente MANO DEL ARCONTE amigo, antes o después de que realice una acción.”",
        },
        {
          s: "Reglas de facción, poder del dolor",
          t: "Cambia la segunda frase del segundo párrafo por: No puedes usar más de una potenciación por activación o reacción, excepto Sentidos estimulados, que puede utilizarse 1 vez por activación o reacción además de otra potenciación.” Sentidos estimulados Cambia el efecto a: “Puedes repetir cualquiera de tus dados que tengan un resultado concreto (p. ej., los que hayan obtenido un resultado de 2)”.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Reconocimiento", "Buscar y destruir"],
    required: [
      {
        type: "ARCHISIBARITA",
        count: 1,
        loadouts: [
          { label: "Pistola bláster; espada venenosa", w: [{ n: "Pistola bláster" }, { n: "Espada venenosa" }] },
          { label: "Pistola cristalina; espada venenosa", w: [{ n: "Pistola cristalina" }, { n: "Espada venenosa" }] },
          { label: "Pistola cristalina; agonizador", w: [{ n: "Pistola cristalina" }, { n: "Agonizador" }] },
          { label: "Pistola cristalina; arma de energía", w: [{ n: "Pistola cristalina" }, { n: "Arma de energía" }] },
          { label: "Rifle cristalino; cuchillas por doquier", w: [{ n: "Rifle cristalino" }, { n: "Cuchillas por doquier" }] },
        ],
      },
    ],
    pool: {
      slots: 8,
      note: "Salvo Espías, cada agente solo una vez. Hasta dos armas de luzoscura (pistola bláster, bláster y lanza oscura).",
      entries: [
        { type: "ESPÍA", max: null },
        { type: "DUELISTA CARMESÍ", max: 1 },
        { type: "DISCÍPULO DE YAELINDRA", max: 1 },
        { type: "ELIXICANTE", max: 1 },
        { type: "DESPELLEJADOR", max: 1 },
        {
          type: "TIRADOR",
          max: 1,
          loadouts: [
            { label: "Bláster; cuchillas por doquier", w: [{ n: "Bláster" }, { n: "Cuchillas por doquier" }] },
            { label: "Desgarrador; cuchillas por doquier", w: [{ n: "Desgarrador" }, { n: "Cuchillas por doquier" }] },
          ],
        },
        {
          type: "TIRADOR PESADO",
          max: 1,
          loadouts: [
            { label: "Lanza oscura; cuchillas por doquier", w: [{ n: "Lanza oscura" }, { n: "Cuchillas por doquier" }] },
            { label: "Cañón cristalino; cuchillas por doquier", w: [{ n: "Cañón cristalino" }, { n: "Cuchillas por doquier" }] },
          ],
        },
        { type: "ASESINO PARTECIELOS", max: 1 },
      ],
    },
    constraints: [
      {
        match: "bláster|lanza oscura",
        max: 2,
        label: "Máx. 2 luzoscura",
        msg: "Solo puedes incluir hasta dos armas de luzoscura (pistola bláster, bláster, lanza oscura).",
      },
    ],
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
