// ============================================================
//  data/garra-nemesis.js — Garra Némesis
//  Generado desde el PDF oficial: Nemesis Claw (jun. 2026)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['garra-nemesis'] = {
  id: "garra-nemesis",
  name: "Garra Némesis",
  subfaction: "Astartes Herejes del Caos",
  icon: "🦀",
  img: "imagenes/garra-nemesis.webp",
  desc: "Comandos de los Amos de la Noche que usan el miedo como arma: venenos, terror psíquico y violencia obscena para aniquilar a sus presas.",
  tags: ["Caos", "Infiltración", "Buscar y destruir"],
  version: "Junio 2026",
  source: "Nemesis Claw (jun. 2026)",
  ops: [
    {
      id: "visionario",
      name: "Visionario Amo de la Noche",
      type: "VISIONARIO",
      img: "imagenes/garra-nemesis-img/visionario.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 15 },
      kw: ["GARRA NÉMESIS", "CAOS", "ASTARTES HEREJES", "PSÍQUICO", "LÍDER", "VISIONARIO"],
      w: [
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Pistola de plasma (normal)", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Pistola de plasma (sobrecarga)", a: 4, i: "3+", d: "4/5", r: ["Alcance 8\"", "Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Arma de energía", a: 5, i: "3+", d: "4/6", r: ["Letal 5+"] },
        { n: "Cuchilla sierra de Nostramo", a: 5, i: "3+", d: "4/5", r: ["Desgarradora"] },
        { n: "Maza de energía", a: 5, i: "3+", d: "4/6", r: ["Choque"] },
        { n: "Puño de energía", a: 5, i: "4+", d: "5/7", r: ["Brutal"] },
      ],
      ru: [
        {
          n: "Clarividencia",
          t: "PSÍQUICA. En el paso de preparación de cada fase de estrategia, ganas 1D3 puntos de Clarividencia. Al final de cada punto de inflexión, descarta tus puntos de Claridivencia. Puedes gastar tus puntos de Clarividencia en la fase de tiroteo tal como se indica a continuación (no puedes usar cada una de las siguientes reglas más de una vez por punto de inflexión):\n• Corazonada: PSÍQUICA. Cuando sea tu turno de activar un agente amigo, puedes gastar 1 de tus puntos de Clarividencia para saltarte esa activación.\n• Portento: PSÍQUICA. Cuando un dado de ataque inflige Daño normal a este agente, puedes gastar 1 de tus puntos de Clarividencia para ignorar ese daño infligido. No puedes ganar ni gastar tus puntos de Clarividencia si este agente está incapacitado.",
        },
        {
          n: "Premonición (1PA)",
          t: "PSÍQUICA. Gasta 1 de tus puntos de Clarividencia para ganar 1PM. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo, ni más de una vez por punto de inflexión.",
          isAct: true,
        },
      ],
    },
    {
      id: "siembramiedos",
      name: "Siembramiedos Amo de la Noche",
      type: "SIEMBRAMIEDOS",
      img: "imagenes/garra-nemesis-img/siembramiedos.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["GARRA NÉMESIS", "CAOS", "ASTARTES HEREJES", "SIEMBRAMIEDOS"],
      w: [
        { n: "Pistola bólter con mirilla (corto alcance)", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Letal 5+"] },
        { n: "Pistola bólter con mirilla (largo alcance)", a: 4, i: "3+", d: "3/4", r: [] },
        {
          n: "Vial de terrortoxinas",
          a: 5,
          i: "3+",
          d: "2/0",
          r: ["Alcance 6\"", "Área 2\"", "Devastadora 3", "Limitada 1", "Saturación", "Terrortoxinas*"],
        },
        { n: "Filo contaminado", a: 5, i: "3+", d: "3/5", r: ["Terrortoxinas*"] },
      ],
      ru: [
        {
          n: "Terrortoxinas",
          t: "En el paso de resolver dados de ataque, si infliges daño con algún éxito crítico, incluido como resultado de la regla de armas Devastadora, el agente contra el que se esté usando esta arma gana una de tus fichas de Terrortoxinas (si no tiene ya una).",
        },
        {
          n: "Veneno de terrortoxinas",
          t: "Siempre que se active un agente que tenga 1 de tus fichas de terrotoxinas, inflígele 1D3 daños. LAS REGLAS SIGUEN EN LA OTRA CARA",
        },
        {
          n: "Envenenar Objetivo (1PA)",
          t: "Elige un marcador de objetivo que controle este agente; este gana una de tus fichas de Terrortoxinas. No puede ser un marcador de objetivo que esté en la zona de control de agentes enemigos o que tenga ya una de tus fichas de Terrortoxinas. La primera vez que un agente enemigo que no tenga ninguna de tus fichas de Terrotoxinas dispute ese marcador de objetivo, ese agente gana esa ficha de Terrortoxinas, y a continuación inflígele 2D3 daños (si es durante una acción, al final de dicha acción). Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "tirador",
      name: "Tirador Amo de la Noche",
      type: "TIRADOR",
      img: "imagenes/garra-nemesis-img/tirador.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["GARRA NÉMESIS", "CAOS", "ASTARTES HEREJES", "TIRADOR"],
      w: [
        { n: "Lanzallamas", a: 4, i: "2+", d: "3/3", r: ["Alcance 8\"", "Ráfaga 2”", "Saturación"] },
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Rifle de fusión", a: 4, i: "3+", d: "6/3", r: ["Alcance 6\"", "Devastadora 4", "Penetración 2"] },
        { n: "Rifle de plasma (normal)", a: 4, i: "3+", d: "4/6", r: ["Penetración 1"] },
        { n: "Rifle de plasma (sobrecarga)", a: 4, i: "3+", d: "5/6", r: ["Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "tirador-pesado",
      name: "Tirador Pesado Amo de la Noche",
      type: "TIRADOR PESADO",
      img: "imagenes/garra-nemesis-img/tirador-pesado.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["GARRA NÉMESIS", "CAOS", "ASTARTES HEREJES", "TIRADOR PESADO"],
      w: [
        { n: "Bólter pesado (concentrado)", a: 5, i: "3+", d: "4/5", r: ["Críticos de penetración 1", "Pesada (solo Reposicionarse)"] },
        { n: "Bólter pesado (barrido)", a: 4, i: "3+", d: "4/5", r: ["Críticos de penetración 1", "Pesada (solo Reposicionarse)", "Ráfaga 1\""] },
        { n: "Lanzamisiles (frag)", a: 4, i: "3+", d: "3/5", r: ["Área 2\"", "Pesada (solo Reposicionarse)"] },
        { n: "Lanzamisiles (perforante)", a: 4, i: "3+", d: "5/7", r: ["Penetración 1", "Pesada (solo Reposicionarse)"] },
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "aullador",
      name: "Aullador Amo de la Noche",
      type: "AULLADOR",
      img: "imagenes/garra-nemesis-img/aullador.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["GARRA NÉMESIS", "CAOS", "ASTARTES HEREJES", "AULLADOR"],
      w: [{ n: "Garras relámpago", a: 5, i: "3+", d: "4/5", r: ["Incesante", "Letal 5+"] }],
      ru: [
        {
          n: "Aullador",
          t: "Cuando un agente enemigo a 3” o menos de este agente dispare, combata o contraataque, tu oponente no podrá repetir sus dados de ataque.",
        },
        {
          n: "Apetito por la crueldad",
          t: "Cuando este agente combata contra un agente enemigo herido, las garras relámpago de este agente tienen la regla de arma Letal 4+.",
        },
      ],
    },
    {
      id: "robapieles",
      name: "Robapieles Amo de la Noche",
      type: "ROBAPIELES",
      img: "imagenes/garra-nemesis-img/robapieles.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["GARRA NÉMESIS", "CAOS", "ASTARTES HEREJES", "ROBAPIELES"],
      w: [
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Archa sierra de Nostramo", a: 5, i: "3+", d: "4/6", r: ["Desgarradora"] },
      ],
      ru: [
        {
          n: "Arrancadle la piel",
          t: "Una vez por punto de inflexión, cuando este agente incapacite a un agente enemigo en su zona de control, puedes elegir a otro agente enemigo a 6\" o menos de este agente o del agente enemigo incapacitado y visible para él. Hasta el inicio del siguiente punto de inflexión, ese otro agente enemigo no puede controlar marcadores ni realizar acciones de Recoger marcador ni de misión.",
        },
        {
          n: "Tirano de los pozos de desollado",
          t: "Cuando este agente combate o contraataca, el Daño Normal y Crítico de 3 o más le inflige 1 daño menos.",
        },
      ],
    },
    {
      id: "ventrilokar",
      name: "Ventrilokar Amo de la Noche",
      type: "VENTRILOKAR",
      img: "imagenes/garra-nemesis-img/ventrilokar.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["GARRA NÉMESIS", "CAOS", "ASTARTES HEREJES", "PSÍQUICO", "VENTRILOKAR"],
      w: [{ n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] }, { n: "Espada sierra", a: 5, i: "3+", d: "4/5", r: [] }],
      ru: [
        {
          n: "Portaicono",
          t: "Al determinar el control de un marcador, trata el atributo LPA de este agente como si fuera 1 mayor. Ten en cuenta que esto no es un cambio a su atributo LPA, de modo que cualquier cambio será acumulable con esto.",
        },
        {
          n: "Imitación Desconcertante (1PA)",
          t: "PSÍQUICA. Elige un agente enemigo a 6\" o menos de este agente, y a continuación elige una de las siguientes opciones para ese agente enemigo (solo puedes elegir cada opción una vez por batalla):\n• Hasta el final de su siguiente activación, resta 1 a su atributo LPA.\n• Cambia su orden.\n• Realiza una acción libre de Correr con él (indica a tu oponente la localización a la que se moverá). Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "combatiente",
      name: "Combatiente Amo de la Noche",
      type: "COMBATIENTE",
      img: "imagenes/garra-nemesis-img/combatiente.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["GARRA NÉMESIS", "CAOS", "ASTARTES HEREJES", "COMBATIENTE"],
      w: [
        { n: "Bólter", a: 4, i: "3+", d: "3/4", r: [] },
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Espada sierra", a: 5, i: "3+", d: "4/5", r: [] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Atormentador cruel",
          t: "Cuando este agente dispara, combata o contraataca contra un agente enemigo lesionado o contra un agente enemigo con un atributo Heridas de 7 o menos, las armas de este agente tienen la regla de arma Letal 5+.",
        },
      ],
    },
  ],
  fr: {
    name: "Astartes",
    type: "REGLA DE FACCIÓN",
    text: "Durante la activación de cada agente GARRA NÉMESIS amigo, puede realizar o bien dos acciones de Combatir, o bien dos acciones de Disparar. Si se decide por dos acciones de Disparar, debe seleccionarse una pistola bólter, un bólter o una pistola bólter con mirilla para al menos una de ellas. Cada agente GARRA NÉMESIS amigo puede reaccionar sin importar cuál sea su orden.",
    orders: [
      {
        n: "Ataviados de medianoche",
        t: "Cuando un agente enemigo dispara contra un agente GARRA NÉMESIS amigo, dicho agente amigo está ofuscado si se cumplen ambas condiciones siguientes:\n• Se encuentra a más de 8\" de agentes enemigos para los que sea visible.\n• Se encuentra a 1” o menos de terreno Pesado que no está por debajo de ella, o cualquier parte de su peana se encuentra bajo terreno Aventajado.",
      },
    ],
  },
  frs: [
    {
      name: "Astartes",
      text: "Durante la activación de cada agente GARRA NÉMESIS amigo, puede realizar o bien dos acciones de Combatir, o bien dos acciones de Disparar. Si se decide por dos acciones de Disparar, debe seleccionarse una pistola bólter, un bólter o una pistola bólter con mirilla para al menos una de ellas. Cada agente GARRA NÉMESIS amigo puede reaccionar sin importar cuál sea su orden.",
      subs: [],
    },
    {
      name: "Ataviados de medianoche",
      text: "Cuando un agente enemigo dispara contra un agente GARRA NÉMESIS amigo, dicho agente amigo está ofuscado si se cumplen ambas condiciones siguientes:\n• Se encuentra a más de 8\" de agentes enemigos para los que sea visible.\n• Se encuentra a 1” o menos de terreno Pesado que no está por debajo de ella, o cualquier parte de su peana se encuentra bajo terreno Aventajado.",
      subs: [],
    },
  ],
  pl: {
    s: [
      {
        n: "La caza negra",
        t: "Cuando un agente GARRA NÉMESIS amigo dispara, combate o contraataca contra un agente enemigo herido, puedesrepetiruno de tus dados de ataque.",
      },
      {
        n: "Avistar la presa",
        t: "Siempre que una agente GARRA NÉMESIS amigo realice una acción de Disparar, puedes usar este regla. Si lo haces, hasta el final de esa acción, las armas a distancia de ese agente amigo tienen las reglas de armas Alcance 6” y Buscadora.",
      },
      {
        n: "Venimos a por vosotros",
        t: "Cuando un agente GARRA NÉMESIS amigo es activado, si la primera acción que lleva a cabo durante esa activación es una acción de Cargar, al terminar su movimiento durante dicha acción puedes infligir 1D3 daños a un agente enemigo en su zona de control.",
      },
      {
        n: "Volver a la oscuridad",
        t: "Un agente GARRA NÉMESIS amigo puede realizar de inmediato una acción libre de Retroceder o Reposicionarse, pero debe terminar dicho movimiento con terreno Pesado en su zona de control, o con cualquier parte de su peana debajo de terreno Aventajado. Además, no puede mover más de 4” durante esa acción y no puede terminar ese movimiento más cerca de agentes enemigos de lo que estaba (en una zona de aniquilación que use las reglas de combate cerrado, p.ej. Zona de aniquilación: Horcaombría, ignora el terreno Muro al determinar esto).",
      },
    ],
    f: [
      {
        n: "Muerte al falso Emperador",
        t: "Usa este ardid de tiroteo después de tirar los dados de ataque de un agente GARRA NÉMESIS amigo, si está disparando, combatiendo o reaccionando contra un agente enemigo que tiene la clave IMPERIUM. Las armas de ese agente amigo tienen la regla de arma Incesante hasta el final de esa secuencia; si el agente enemigo en cuestión tiene también la clave ADEPTUS ASTARTES, en su lugar las armas de ese agente amigo tienen la regla de arma Implacable hasta el final de esa secuencia.",
      },
      {
        n: "Predisposición homicida",
        t: "Usa este ardid de tiroteo después de que un agente GARRA NÉMESIS amigo incapacite a un agente enemigo dentro de su zona de control. Ese agente amigo puede realizar de inmediato una acción libre de Cargar o de Correr (en el primer caso, no puede mover más de 3\"), incluso si ha realizado una acción que le impida realizar acciones de Cargar o de Correr.",
      },
      {
        n: "Vocogrito",
        t: "Usa este ardid de tiroteo cuando tu oponente vaya a activar un agente enemigo visible para un agente GARRA NÉMESIS amigo. Tira 1D6: si el resultado es mayor que el atributo LPA de ese agente enemigo, tu oponente no puede activarlo durante esta activación, pero, si el resultado es menor o igual al atributo LPA de ese agente enemigo, este ardid no se usa, recuperas los PM gastados y no puedes volver a usarlo durante este punto de inflexión. Si no hay otros agentes enemigos que elegir para ser activados, este ardid no tiene efecto.",
      },
      {
        n: "Luchador rastrero",
        t: "Usa este ardid de tiroteo cuando un agente GARRA NÉMESIS amigo contraataque, al inicio del paso de resolver dados de ataque. Puedes resolver uno de tus éxitos antes del orden normal. Si lo haces, no puedes resolver ningún otro éxito durante esa secuencia.",
      },
    ],
  },
  eq: [
    {
      n: "Cepo de cadena",
      t: "Cuando un agente enemigo vaya a realizar una acción de Retroceder mientras se encuentra en la zona de control de un agente GARRA NÉMESIS amigo, si no hay otros agente enemigos en la zona de control de ese agente amigo, puedes usar esta regla. En tal caso, tira dos D6, o un D6 si ese agente enemigo tiene un atributo Heridas mayor que el del agente amigo en cuestión. Si cualquier resultado es un 4+, dicho agente enemigo no puede realizar esa acción durante esta activación o reacción (no se gastan PA en ella), y no puedes volver a usar esta regla durante este punto de inflexión.",
    },
    {
      n: "Trofeo atroz",
      t: "Una vez por batalla, cuando un agente GARRA NÉMESIS amigo incapacite a un agente enemigo a 2\" o menos de él, puedes usar esta regla. Si lo haces, ese agente amigo obtiene una de tus fichas de Trofeo atroz (si no tiene ya una). Cuando un agente GARRA NÉMESIS amigo que tenga uno de tus fichas de Trofeo atroz se encuentre a 2\" o menos de un agente enemigo y sea visible para él, resta 1 al atributo Ataque de las armas de ese agente enemigo.",
    },
    {
      n: "Piel desollada",
      t: "Cuando un agente enemigo dispara, combate o contraataca contra un agente GARRA NÉMESIS amigo a 2\" o menos de él, tu oponente no puede repetir sus dados de ataque con resultados de 1.",
    },
    {
      n: "Inhibidores de comunicaciones",
      t: "Cuando un agente enemigo se encuentre a 3\" o menos de un agente GARRA NÉMESIS amigo, no se puede aumentar el atributo LPA de ese agente enemigo. Ten en cuenta que esto no afecta a los atributos LPA que ya hayan sido cambiados.",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Junio 2026",
      ee: [
        {
          s: "Agente siembramiedos, acción envenenar objetivo",
          t: "Cambiar la parte relevante de la tercera frase del efecto a: \"La primera vez que un agente enemigo que no tenga ninguna de tus fichas de Terrotoxinas dispute ese marcador de objetivo, ese agente […]\"",
        },
      ],
    },
    {
      v: "Cambios · Junio 2026",
      ee: [
        {
          s: "Reglas de facción, ataviados de medianoche",
          t: "Cambia el primer punto a: “Se encuentra a más de 8\" de agentes enemigos para los que sea visible.” Cambia el segundo punto a: “Se encuentra a 1\" o menos de terreno Pesado que no está por debajo de ella, o cualquier parte de su peana se encuentra bajo terreno Aventajado”.",
        },
        {
          s: "Equipo de facción, cepo de cadena",
          t: "Cambia la última frase a: “Si sacas algún 4+, el agente enemigo no puede realizar esa acción durante esta activación/reacción (y no gasta PA en ella), y no puedes usar esta regla de nuevo durante este punto de inflexión”.",
        },
        {
          s: "Equipo de facción, inhibidores de comunicaciones",
          t: "Cambia la parte relevante de la primera frase por: “Siempre que un agente enemigo esté a 3\" o menos de un agente GARRA NÉMESIS amigo, […]”",
        },
        {
          s: "Ardides de tiroteo, ¡muerte al falso emperador!",
          t: "Cambia la primera frase a: \"Usa este ardid de tiroteo después de tirar tus dados de ataque para un agente GARRA NÉMESIS amigo, si está disparando, combatiendo o contraatacando contra un agente enemigo que tiene la clave IMPERIUM\".",
        },
        {
          s: "Ardides de estrategia, avistar la presa",
          t: "Cambia a: “Siempre que un agente GARRA NÉMESIS amigo realice una acción de Disparar, puedes usar este regla. Si lo haces, hasta el final de esa acción, las armas a distancia de ese agente amigo tienen las reglas de armas Alcance 6\" y Buscadora”.",
        },
        {
          s: "Ardides de estrategia, volver a la oscuridad",
          t: "Cambia la última frase a: “Además, no puede mover más de 4\" durante esa acción y no puede terminar ese movimiento más cerca de agentes enemigos de lo que estaba (en zonas de aniquilación que usen reglas de combate cerrado, p.ej. Horcasombría, ignora el terreno Muro al determinar esto)”.",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Ardides de tiroteo, vocogrito",
          t: "Cambia a: \"Usa este ardid de tiroteo cuando tu oponente fuera a activar un agente enemigo que es visible para algún agente GARRA NÉMESIS amigo. Tira 1D6: si el resultado es mayor que el atributo LPA de ese agente enemigo, tu oponente no puede activarlo durante esta activación, pero, si el resultado es menor o igual al atributo LPA de ese agente enemigo, este ardid no se usa, recuperas los PM gastados y no puedes volver a usarlo durante este punto de inflexión. Si no hay otros agentes enemigos que elegir para ser activados, este ardid no tiene efecto. Este ardid te cuesta 1PM adicional por cada vez previa que lo hayas usado durante la batalla (es decir, 1PM la primera vez, 2PM la segunda vez, etc.)”.",
        },
        {
          s: "Agente siembramiedos, regla de armas *terrortoxinas",
          t: "Cambiar la parte relevante a: “[…] si infliges daño con cualquier éxito crítico, incluido como resultado de la regla de armas Devastadora, […]”",
        },
        {
          s: "Agente siembramiedos, veneno de terrotoxinas",
          t: "Cambia a: “Siempre que se active un agente que tenga 1 de tus fichas de terrotoxinas, inflígele 1D3 daños.”",
        },
        {
          s: "Agente visionario, regla clarividencia",
          t: "Añade este texto entre la segunda y la tercera frase: “Al final de cada punto de inflexión, descarta tus puntos de Clarividencia”.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Infiltración", "Buscar y destruir"],
    required: [
      {
        type: "VISIONARIO",
        count: 1,
        loadouts: [
          { label: "Pistola bólter; puño de energía", w: [{ n: "Pistola bólter" }, { n: "Puño de energía" }] },
          { label: "Pistola bólter; maza de energía", w: [{ n: "Pistola bólter" }, { n: "Maza de energía" }] },
          { label: "Pistola bólter; arma de energía", w: [{ n: "Pistola bólter" }, { n: "Arma de energía" }] },
          { label: "Pistola de plasma; cuchilla sierra de Nostramo", w: [{ n: "Pistola de plasma" }, { n: "Cuchilla sierra de Nostramo" }] },
        ],
      },
    ],
    pool: {
      slots: 5,
      note: "Salvo Combatientes, cada agente solo una vez.",
      entries: [
        { type: "SIEMBRAMIEDOS", max: 1 },
        {
          type: "TIRADOR",
          max: 1,
          loadouts: [
            { label: "Pistola bólter; lanzallamas; puños", w: [{ n: "Pistola bólter" }, { n: "Lanzallamas" }, { n: "Puños" }] },
            { label: "Pistola bólter; rifle de fusión; puños", w: [{ n: "Pistola bólter" }, { n: "Rifle de fusión" }, { n: "Puños" }] },
            { label: "Pistola bólter; rifle de plasma; puños", w: [{ n: "Pistola bólter" }, { n: "Rifle de plasma" }, { n: "Puños" }] },
          ],
        },
        {
          type: "TIRADOR PESADO",
          max: 1,
          loadouts: [
            { label: "Pistola bólter; bólter pesado; puños", w: [{ n: "Pistola bólter" }, { n: "Bólter pesado" }, { n: "Puños" }] },
            { label: "Pistola bólter; lanzamisiles; puños", w: [{ n: "Pistola bólter" }, { n: "Lanzamisiles" }, { n: "Puños" }] },
          ],
        },
        { type: "AULLADOR", max: 1 },
        { type: "ROBAPIELES", max: 1 },
        { type: "VENTRILOKAR", max: 1 },
        { type: "COMBATIENTE", max: null, key: "combatiente-pistola", label: "Combatiente · pistola bólter y espada sierra" },
        { type: "COMBATIENTE", max: null, key: "combatiente-bolter", label: "Combatiente · bólter y puños" },
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
