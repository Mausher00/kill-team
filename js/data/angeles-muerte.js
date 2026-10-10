// ============================================================
//  data/angeles-muerte.js — Ángeles de la Muerte
//  Generado desde el PDF oficial: Angels of Death (ago. 2025)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['angeles-muerte'] = {
  id: "angeles-muerte",
  name: "Ángeles de la Muerte",
  subfaction: "Adeptus Astartes",
  icon: "🪽",
  img: "imagenes/angeles-muerte.png",
  desc: "Marines Espaciales Intercesores con Tácticas de Capítulo y Doctrinas de Combate: versátiles, duros y letales a cualquier distancia.",
  tags: ["Imperium", "Seguridad", "Buscar y destruir"],
  version: "Agosto 2026",
  source: "Angels of Death (ago. 2025)",
  ops: [
    {
      id: "capitan-marine-espacial",
      name: "Capitán Marine Espacial",
      type: "CAPITÁN MARINE ESPACIAL",
      img: "imagenes/angeles/capitan.png",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 15 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "LÍDER", "CAPITÁN MARINE ESPACIAL"],
      w: [
        { n: "Pistola de plasma (normal)", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Pistola de plasma (sobrecarga)", a: 4, i: "3+", d: "4/5", r: ["Alcance 8\"", "Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Puño de energía", a: 5, i: "3+", d: "5/7", r: ["Brutal"] },
      ],
      ru: [
        {
          n: "Líder heroico",
          t: "Una vez por punto de inflexión, puedes elegir una de las siguientes opciones:\n• Usar un ardid de tiroteo por 0PM si este es el agente ÁNGEL DE LA MUERTE especificado (excepto repetición de mando).\n• Usa el ardid de estrategia Doctrina de combate cuando actives un agente ÁNGEL DE LA MUERTE si este agente está en la zona de aniquilación y no está en la zona de control de ningún agente enemigo (pagando su coste en PM de manera normal). Ten en cuenta que no puedes hacer si ya has usado ese ardida durante este punto de inflexión.\n• Usa el ardid de tiroteo Ajustar doctrina por 0PM si este agente está en la zona de aniquilación y fuera de la zona de control de todos los agentes enemigos. Aura de hierro: Una vez por batalla, cuando un dado de ataque inflija Daño normal a este agente, puedes ignorar ese daño infligido.",
        },
      ],
    },
    {
      id: "sargento-intercesor-de-asalto",
      name: "Sargento Intercesor de Asalto",
      type: "SARGENTO INTERCESOR DE ASALTO",
      img: "imagenes/angeles/sargento-asalto.png",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 15 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "LÍDER", "INTERCESOR DE ASALTO", "SARGENTO"],
      w: [
        { n: "Pistola bólter pesada", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Críticos de penetración 1"] },
        { n: "Pistola de plasma (normal)", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Pistola de plasma (sobrecarga)", a: 4, i: "3+", d: "4/5", r: ["Alcance 8\"", "Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Pistola lanzallamas", a: 4, i: "2+", d: "3/3", r: ["Alcance 6\"", "Ráfaga 1\"", "Saturación"] },
        { n: "Arma de energía", a: 5, i: "3+", d: "4/6", r: ["Letal 5+"] },
        { n: "Espada sierra", a: 5, i: "3+", d: "4/5", r: [] },
        { n: "Martillo de trueno", a: 5, i: "4+", d: "5/6", r: ["Aturdidora", "Choque"] },
        { n: "Puño de energía", a: 5, i: "4+", d: "5/7", r: ["Brutal"] },
      ],
      ru: [
        {
          n: "Guerra según las doctrinas",
          t: "Puedes realizar cada una de las siguientes opciones una vez por batalla:\n• Cuando uses el ardid de estrategia Doctrina de combate y elijas Asalto, si este agente está en la zona de aniquilación, te cuesta 0PM.\n• Cuando uses el ardid de estrategia Doctrina de combate y elijas Táctica, si este agente está en la zona de aniquilación, te cuesta 0PM.",
        },
        {
          n: "Veterano del Capítulo",
          t: "Al final del paso de Elegir agentes, si este agente es elegido para el despliegue, elige una TÁCTICA DE CAPÍTULO adicional para que este agente la tenga durante esta batalla. A diferencia de las TÁCTICAS DE CAPÍTULO primarias y secundarias, no tienes que elegir la misma en cada batalla de una campaña o torneo.",
        },
      ],
    },
    {
      id: "sargento-intercesor",
      name: "Sargento Intercesor",
      type: "SARGENTO INTERCESOR",
      img: "imagenes/angeles/sargento.png",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 15 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "LÍDER", "INTERCESOR", "SARGENTO"],
      w: [
        { n: "Rifle bólter automático", a: 4, i: "3+", d: "3/4", r: ["Ráfaga 1\""] },
        { n: "Rifle bólter", a: 4, i: "3+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Rifle bólter silencio (pesado)", a: 4, i: "3+", d: "3/5", r: ["Críticos de penetración 1", "Letal 5+", "Pesada (solo Correr)"] },
        { n: "Rifle bólter silencio (móvil)", a: 4, i: "3+", d: "3/4", r: ["-      -"] },
        { n: "Arma de energía", a: 4, i: "3+", d: "4/6", r: ["Letal 5+"] },
        { n: "Espada sierra", a: 4, i: "3+", d: "4/5", r: [] },
        { n: "Martillo de trueno", a: 4, i: "4+", d: "5/6", r: ["Aturdidora", "Choque"] },
        { n: "Puño de energía", a: 4, i: "4+", d: "5/7", r: ["Brutal"] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Guerra según las doctrinas",
          t: "Puedes realizar cada una de las siguientes opciones una vez por batalla:\n• Cuando uses el ardid de estrategia Doctrina de combate y elijas Devastadora, si este agente está en la zona de aniquilación, te cuesta 0PM.\n• Cuando uses el ardid de estrategia Doctrina de combate y elijas Táctica, si este agente está en la zona de aniquilación, te cuesta 0PM.",
        },
        {
          n: "Veterano del Capítulo",
          t: "Al final del paso de Elegir agentes, si este agente es elegido para el despliegue, elige una TÁCTICA DE CAPÍTULO adicional para que este agente la tenga durante esta batalla. A diferencia de las TÁCTICAS DE CAPÍTULO primarias y secundarias, no tienes que elegir la misma en cada batalla de una campaña o torneo.",
        },
      ],
    },
    {
      id: "granadero-intercesor-de-asalto",
      name: "Granadero Intercesor de Asalto",
      type: "GRANADERO INTERCESOR DE ASALTO",
      img: "imagenes/angeles/granadero-intercesor.png",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "INTERCESOR DE ASALTO", "GRANADERO"],
      w: [
        { n: "Pistola bólter pesada", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Críticos de penetración 1"] },
        { n: "Espada sierra", a: 5, i: "3+", d: "4/5", r: [] },
      ],
      ru: [
        {
          n: "Granadero",
          t: "Este agente puede usar granadas frag y perforantes (ver equipo universal). Hacer esto no cuenta de cara a los usos limitados que tengas (es decir, si también seleccionas esas granadas como equipo para otros agentes). Cuando lo hace, mejora en 1 el atributo Impactar de esa arma.",
        },
      ],
    },
    {
      id: "combatiente-intercesor-de-asalto",
      name: "Combatiente Intercesor de Asalto",
      type: "COMBATIENTE INTERCESOR DE ASALTO",
      img: "imagenes/angeles/combatiente-asalto.png",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "INTERCESOR DE ASALTO", "COMBATIENTE"],
      w: [
        { n: "Pistola bólter pesada", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Críticos de penetración 1"] },
        { n: "Espada sierra", a: 5, i: "3+", d: "4/5", r: [] },
      ],
      ru: [],
    },
    {
      id: "tirador-intercesor-pesado",
      name: "Tirador Intercesor Pesado",
      type: "TIRADOR INTERCESOR PESADO",
      img: "imagenes/angeles/tirador-pesado.png",
      s: { lpa: 3, mov: "5\"", salv: "3+", h: 18 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "INTERCESOR PESADO", "TIRADOR"],
      w: [
        { n: "Bólter pesado (concentrado)", a: 5, i: "3+", d: "4/5", r: ["Críticos de penetración 1"] },
        { n: "Bólter pesado (barrido)", a: 4, i: "3+", d: "4/5", r: ["Críticos de penetración 1", "Ráfaga 1\""] },
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "tirador-intercesor",
      name: "Tirador Intercesor",
      type: "TIRADOR INTERCESOR",
      img: "imagenes/angeles/tirador-intercesor.png",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "INTERCESOR", "TIRADOR"],
      w: [
        { n: "Lanzagranadas auxiliar (frag)", a: 4, i: "3+", d: "2/4", r: ["Área 2\""] },
        { n: "Lanzagranadas auxiliar (perforante)", a: 4, i: "3+", d: "4/5", r: ["Penetración 1"] },
        { n: "Rifle bólter", a: 4, i: "3+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Rifle bólter automático", a: 4, i: "3+", d: "3/4", r: ["Ráfaga 1\""] },
        { n: "Rifle bólter silencio (pesado)", a: 4, i: "3+", d: "3/5", r: ["Críticos de penetración 1", "Letal 5+", "Pesada (solo Correr)"] },
        { n: "Rifle bólter silencio (móvil)", a: 4, i: "3+", d: "3/4", r: [] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "combatiente-intercesor",
      name: "Combatiente Intercesor",
      type: "COMBATIENTE INTERCESOR",
      img: "imagenes/angeles/combatiente.png",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "INTERCESOR", "COMBATIENTE"],
      w: [
        { n: "Rifle bólter automático", a: 4, i: "3+", d: "3/4", r: ["Ráfaga 1\""] },
        { n: "Rifle bólter", a: 4, i: "3+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Rifle bólter silencio (pesado)", a: 4, i: "3+", d: "3/5", r: ["Críticos de penetración 1", "Letal 5+", "Pesada (solo Correr)"] },
        { n: "Rifle bólter silencio (móvil)", a: 4, i: "3+", d: "3/4", r: [] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "francotirador-eliminador",
      name: "Francotirador Eliminador",
      type: "FRANCOTIRADOR ELIMINADOR",
      img: "imagenes/angeles/francotirador-eliminador.png",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ÁNGEL DE LA MUERTE", "IMPERIUM", "ADEPTUS ASTARTES", "ELIMINADOR", "FRANCOTIRADOR"],
      w: [
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        {
          n: "Rifle bólter de francotirador (ejecutor)",
          a: 4,
          i: "2+",
          d: "3/4",
          r: ["Buscadora (Ligero)", "Pesada (solo Correr)", "Saturación", "Silenciosa"],
        },
        { n: "Rifle bólter de francotirador (hiperfrag)", a: 4, i: "2+", d: "2/4", r: ["Área 1\"", "Pesada (solo Correr)", "Silenciosa"] },
        {
          n: "Rifle bólter de francotirador (mortis)",
          a: 4,
          i: "2+",
          d: "3/3",
          r: ["Devastadora 3", "Penetración 1", "Pesada (solo Correr)", "Silenciosa"],
        },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Capa de camuflaje",
          t: "Siempre que un agente dispare contra este agente, ignora la regla de arma Saturación. Este agente tiene la TÁCTICA DE CAPÍTULO Sigilosos. Si ya habías elegido esa TÁCTICA DE CAPÍTULO, puedes hacer sus dos opciones (es decir, guardar dos salvaciones por cobertura; un éxito normal y uno crítico).",
        },
        {
          n: "Óptica (1PA)",
          t: "Hasta el inicio de la siguiente activación de este agente, siempre que dispare, los agentes enemigos no pueden estar ofuscados. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
  ],
  fr: {
    name: "Tácticas de capítulo",
    type: "REGLA DE FACCIÓN",
    text: "Al elegir tu comando, elige una TÁCTICA DE CAPÍTULO primaria y otra secundaria que los agentes ÁNGEL DE LA MUERTE amigos obtendrán durante esta batalla. Los efectos de múltiples instancias de la misma TÁCTICA DE CAPÍTULO no se acumulan. Nota de diseño: Si estás jugando una serie de partidas, como una campaña o un torneo, debes elegir la misma TÁCTICA DE CAPÍTULO primaria y secundaria en cada batalla (sigues pudiendo cambiar la secundaria con el ardid de estrategia Tácticas flexibles).",
    orders: [
      { n: "1. Agresivos", t: "Las armas de combate de este agente tienen la regla de armas Desgarradora." },
      {
        n: "2. Duelistas",
        t: "Siempre que este agente combata o contraataque, cada uno de tus éxitos normales puede bloquear un éxito crítico sin resolver (a menos que el arma del agente enemigo tenga la regla de arma Brutal).",
      },
      { n: "3. Resueltos", t: "Puedes ignorar cualquier cambio al atributo LPA de este agente." },
      {
        n: "4. Sigilosos",
        t: "Siempre que un agente dispare contra este agente, si puedes guardar alguna salvación por cobertura, puedes guardar una salvación por cobertura adicional o, en su lugar, puedes guardar una salvación por cobertura como éxito crítico. Esto no se acumula con las salvaciones por cobertura mejoradas debido a terreno Aventajado.",
      },
      {
        n: "5. Móviles",
        t: "• Este agente puede realizar la acción de Retroceder por 1 PA menos.\n• Este agente puede realizar acciones de Cargar aún estando en la zona de control de un agente enemigo, y al hacerlo puede abandonar la zona de control de dicho agente (pero luego se siguen aplicando los requisitos normales para ese movimiento).",
      },
      {
        n: "6. Robustos",
        t: "Siempre que un agente dispara contra este agente, los resultados de 5+ en los dados de defensa son éxitos críticos, además, siempre que este agente contraataque, la primera vez que un dado de ataque inflija Daño normal de 3 o más a este agente durante esa secuencia, reduce en 1 el daño que le inflige ese dado.",
      },
      {
        n: "Astartes",
        t: "Durante la activación de cada agente ÁNGEL DE LA MUERTE amigo, este puede realizar o bien dos acciones de Combatir, o bien dos acciones de Disparar. Si son dos acciones de Disparar, debe seleccionarse un arma bólter al menos para una de ellas, y si es un rifle bólter de francotirador o un bólter pesado, debe gastarse 1 PA adicional en la segunda acción si ambas usan esa arma. Cada agente ÁNGEL DE LA MUERTE amigo puede reaccionar sin importar cuál sea su orden.",
      },
    ],
  },
  frs: [
    {
      name: "Tácticas de capítulo",
      text: "Al elegir tu comando, elige una TÁCTICA DE CAPÍTULO primaria y otra secundaria que los agentes ÁNGEL DE LA MUERTE amigos obtendrán durante esta batalla. Los efectos de múltiples instancias de la misma TÁCTICA DE CAPÍTULO no se acumulan. Nota de diseño: Si estás jugando una serie de partidas, como una campaña o un torneo, debes elegir la misma TÁCTICA DE CAPÍTULO primaria y secundaria en cada batalla (sigues pudiendo cambiar la secundaria con el ardid de estrategia Tácticas flexibles).",
      subs: [
        { n: "1. Agresivos", t: "Las armas de combate de este agente tienen la regla de armas Desgarradora." },
        {
          n: "2. Duelistas",
          t: "Siempre que este agente combata o contraataque, cada uno de tus éxitos normales puede bloquear un éxito crítico sin resolver (a menos que el arma del agente enemigo tenga la regla de arma Brutal).",
        },
        { n: "3. Resueltos", t: "Puedes ignorar cualquier cambio al atributo LPA de este agente." },
        {
          n: "4. Sigilosos",
          t: "Siempre que un agente dispare contra este agente, si puedes guardar alguna salvación por cobertura, puedes guardar una salvación por cobertura adicional o, en su lugar, puedes guardar una salvación por cobertura como éxito crítico. Esto no se acumula con las salvaciones por cobertura mejoradas debido a terreno Aventajado.",
        },
        {
          n: "5. Móviles",
          t: "• Este agente puede realizar la acción de Retroceder por 1 PA menos.\n• Este agente puede realizar acciones de Cargar aún estando en la zona de control de un agente enemigo, y al hacerlo puede abandonar la zona de control de dicho agente (pero luego se siguen aplicando los requisitos normales para ese movimiento).",
        },
        {
          n: "6. Robustos",
          t: "Siempre que un agente dispara contra este agente, los resultados de 5+ en los dados de defensa son éxitos críticos, además, siempre que este agente contraataque, la primera vez que un dado de ataque inflija Daño normal de 3 o más a este agente durante esa secuencia, reduce en 1 el daño que le inflige ese dado.",
        },
      ],
    },
    {
      name: "Astartes",
      text: "Durante la activación de cada agente ÁNGEL DE LA MUERTE amigo, este puede realizar o bien dos acciones de Combatir, o bien dos acciones de Disparar. Si son dos acciones de Disparar, debe seleccionarse un arma bólter al menos para una de ellas, y si es un rifle bólter de francotirador o un bólter pesado, debe gastarse 1 PA adicional en la segunda acción si ambas usan esa arma. Cada agente ÁNGEL DE LA MUERTE amigo puede reaccionar sin importar cuál sea su orden.",
      subs: [],
    },
  ],
  pl: {
    s: [
      {
        n: "Doctrina de combate",
        t: "Elige una DOCTRINA DE COMBATE de las siguientes. Siempre que un agente ÁNGEL DE LA MUERTE amigo haga X, sus armas tienen la regla de arma Equilibrada. X depende de la DOCTRINA DE COMBATE que hayas elegido.\n• Doctrina devastadora: Disparar contra un agente a más de 6\" de él.\n• Doctrina táctica: Disparar contra un agente a 6\" o menos de él.\n• Doctrina de asalto: Combatir o contraatacar.",
      },
      {
        n: "Indomitus",
        t: "Siempre que un agente dispara contra un agente ÁNGEL DE LA MUERTE amigo, si sacas dos o más fallos, puedes descartar uno de ellos para guardar el otro como éxito normal en su lugar.",
      },
      {
        n: "Y no conocerán el miedo",
        t: "Puedes ignorar cualquier cambio a los atributos de agentes ÁNGEL DE LA MUERTE amigos debido a estar lesionados (incluyendo los atributos de sus armas).",
      },
      {
        n: "Tácticas flexibles",
        t: "Cambia tu TÁCTICA DE CAPÍTULO secundaria. Ten en cuenta que este ardid solo dura hasta el final del punto de inflexión, tras lo cual recuperas tu TÁCTICA DE CAPÍTULO secundaria original.",
      },
    ],
    f: [
      {
        n: "Ajustar doctrina",
        t: "Usa este ardid de tiroteo durante la activación de un agente ÁNGEL DE LA MUERTE amigo, antes o después de que realice una acción. Si has usado el ardid de estrategia Doctrina de combate durante este punto de inflexión, cambia la DOCTRINA DE COMBATE que hayas elegido.",
      },
      {
        n: "Ira de venganza",
        t: "Usa este ardid de tiroteo cuando un agente ÁNGEL DE LA MUERTE amigo reaccione. Puede realizar una acción de 1PA adicional gratis durante esa reacción, pero ambas acciones deben ser distintas.",
      },
      {
        n: "Fisiología transhumana",
        t: "Usa este ardid de tiroteo cuando un agente dispare contra un agente ÁNGEL DE LA MUERTE amigo, en el paso de tirar dados de defensa. Puedes guardar uno de tus éxitos normales como éxito crítico en su lugar.",
      },
      {
        n: "Asalto de choque",
        t: "Usa este ardid de tiroteo cuando un agente ÁNGEL DE LA MUERTE amigo realiza una acción de Combatir durante una activación en la que haya realizado una acción de Cargar, al inicio del paso de resolver dados de ataque. Hasta el final de esa acción:\n• Su arma de combate tiene la regla de arma Choque.\n• La primera vez que golpees durante esa secuencia, inflige 1 daño adicional (hasta un máximo de 7).",
      },
    ],
  },
  eq: [
    {
      n: "Sellos de pureza",
      t: "Una vez por punto de inflexión, cuando un agente ÁNGEL DE LA MUERTE amigo dispare, combata o contraataque, si sacas dos o más fallos, puedes descartar uno de ellos para guardar otro como un éxito normal en su lugar.",
    },
    {
      n: "Auspex",
      t: "Una vez por punto de inflexión, cuando un agente ÁNGEL DE LA MUERTE amigo realiza una acción de Disparar y estás eligiendo blanco válido, puedes usar esta regla. Si lo haces, hasta el final de la activación (o reacción), los agentes enemigos a 8\" o menos de ese agente amigo no pueden estar ofuscados.",
    },
    {
      n: "Relicarios del capítulo",
      t: "Puedes usar el ardid de tiroteo Ira de venganza por 0PM si el agente amigo especificado tiene una orden de trabarse.",
    },
    {
      n: "Escudos decorativos",
      t: "Una vez por punto de inflexión, cuando un agente ÁNGEL DE LA MUERTE amigo combate o contraataca, después de que tu oponente tire sus dados de ataque, pero antes de que se repitan tiradas, puedes usar esta regla. Si lo haces, tu oponente no puede guardar dados de ataque con un resultado menor que 6 como éxitos críticos durante esa secuencia (por ejemplo, debido a las reglas de arma Letal, Desgarradora o Severa).",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Agosto 2026",
      ee: [
        {
          s: "Reglas de facción, táctica de capítulo",
          t: "Robusto Se deshace el cambio previo: “Siempre que este agente contraataque, la primera vez que un dado de ataque inflija Daño normal de 3 o más a este agente durante esa secuencia, reduce en 1 el daño que le inflige ese dado”.",
        },
        {
          s: "Selección de comando",
          t: "Elimina la siguiente frase y asteriscos en FRANCOTIRADOR ELIMINADOR e INTERCESOR PESADO: “No puedes elegir más de 1 de estos agentes en total.”",
        },
        {
          s: "Reglas de facción, tácticas de capítulo",
          t: "Duelistas Cambia a: “Siempre que este agente combata o contraataque, cada uno de tus éxitos normales puede bloquear un éxito crítico sin resolver (a menos que el arma del agente enemigo tenga la regla de arma Brutal).” Resueltos Cambia a: “Puedes ignorar cualquier cambio al atributo LPA de este agente, y además no se ve afectado por las reglas de armas Choque de los agentes enemigos”. Francotirador Cambiar las partes relevantes a: “[...] sus armas bólter tienen las reglas de armas Certera 1 y Severa”. Especialista en asedios Frase adicional: “Siempre que este agente combata o contraataque, los agentes enemigos no pueden asistir”.",
        },
        {
          s: "Agente sargento intercesor, regla guerra según las doctrinas",
          t: "Cambia a: “Puedes aplicar cada una de las siguientes opciones una vez por batalla: • \u0007Cuando uses el ardid de estrategia Doctrina de combate y elijas Devastadora, si este agente está en la zona de aniquilación, te cuesta 0PM. • \u0007Cuando uses el ardid de estrategia Doctrina de combate y elijas Táctica, si este agente está en la zona de aniquilación, te cuesta 0PM.”",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Agente sargento intercesor de asalto, regla guerra según las doctrinas",
          t: "Cambia a: “Puedes aplicar cada una de las siguientes opciones una vez por batalla: • \u0007Cuando uses el ardid de estrategia Doctrina de combate y elijas Asalto, si este agente está en la zona de aniquilación, te cuesta 0PM. • \u0007Cuando uses el ardid de estrategia Doctrina de combate y elijas Táctica, si este agente está en la zona de aniquilación, te cuesta 0PM.”",
        },
        { s: "Agente tirador intercesor pesado", t: "Cambia su atributo Mov a “5”." },
        { s: "Agente tirador intercesor pesado, lista de armas", t: "Añadida el arma “pistola bólter”." },
        {
          s: "Agente capitán marine espacial, regla líder heroico",
          t: "Cambia a: “Una vez por punto de inflexión, puedes elegir 1 de las siguientes opciones: • \u0007Usar un ardid de tiroteo por 0PM si este es el agente ÁNGEL DE LA MUERTE especificado (excepto repetición de mando). • \u0007Usar el ardid de estrategia Doctrina de combate al activar un agente ÁNGEL DE LA MUERTE amigo si este agente está en la zona de aniquilación y no tiene agentes enemigos en su zona de control (pagando su coste en PM de manera normal). Ten en cuenta que no puedes hacer esto si ya has usado ese ardid durante este punto de inflexión. • \u0007Usar el ardid de tiroteo Ajustar doctrina por 0PM si este agente está en la zona de aniquilación y no tiene agentes enemigos en su zona de control”.",
        },
        {
          s: "Equipo de facción, escudos decorativos",
          t: "Cambia la parte relevante de la primera frase por: ”[…] después de que tu oponente tire sus dados de ataque, pero antes de que se repitan tiradas, puedes usar esta regla\".",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Seguridad", "Buscar y destruir"],
    required: [],
    pool: {
      slots: 6,
      note: "1 líder y 5 agentes. Salvo Combatientes, cada agente solo una vez.",
      entries: [
        {
          type: "SARGENTO INTERCESOR DE ASALTO",
          max: 1,
          section: "Líder (elige 1)",
          loadouts: [
            { label: "Pistola lanzallamas; espada sierra", w: [{ n: "Pistola lanzallamas" }, { n: "Espada sierra" }] },
            { label: "Pistola lanzallamas; puño de energía", w: [{ n: "Pistola lanzallamas" }, { n: "Puño de energía" }] },
            { label: "Pistola lanzallamas; arma de energía", w: [{ n: "Pistola lanzallamas" }, { n: "Arma de energía" }] },
            { label: "Pistola lanzallamas; martillo de trueno", w: [{ n: "Pistola lanzallamas" }, { n: "Martillo de trueno" }] },
            { label: "Pistola bólter pesada; espada sierra", w: [{ n: "Pistola bólter pesada" }, { n: "Espada sierra" }] },
            { label: "Pistola bólter pesada; puño de energía", w: [{ n: "Pistola bólter pesada" }, { n: "Puño de energía" }] },
            { label: "Pistola bólter pesada; arma de energía", w: [{ n: "Pistola bólter pesada" }, { n: "Arma de energía" }] },
            { label: "Pistola bólter pesada; martillo de trueno", w: [{ n: "Pistola bólter pesada" }, { n: "Martillo de trueno" }] },
            { label: "Pistola de plasma; espada sierra", w: [{ n: "Pistola de plasma" }, { n: "Espada sierra" }] },
          ],
        },
        {
          type: "SARGENTO INTERCESOR",
          max: 1,
          section: "Líder (elige 1)",
          loadouts: [
            { label: "Rifle bólter automático; espada sierra", w: [{ n: "Rifle bólter automático" }, { n: "Espada sierra" }] },
            { label: "Rifle bólter automático; puños", w: [{ n: "Rifle bólter automático" }, { n: "Puños" }] },
            { label: "Rifle bólter automático; puño de energía", w: [{ n: "Rifle bólter automático" }, { n: "Puño de energía" }] },
            { label: "Rifle bólter automático; arma de energía", w: [{ n: "Rifle bólter automático" }, { n: "Arma de energía" }] },
            { label: "Rifle bólter automático; martillo de trueno", w: [{ n: "Rifle bólter automático" }, { n: "Martillo de trueno" }] },
            { label: "Rifle bólter; espada sierra", w: [{ n: "Rifle bólter" }, { n: "Espada sierra" }] },
            { label: "Rifle bólter; puños", w: [{ n: "Rifle bólter" }, { n: "Puños" }] },
            { label: "Rifle bólter; puño de energía", w: [{ n: "Rifle bólter" }, { n: "Puño de energía" }] },
            { label: "Rifle bólter; arma de energía", w: [{ n: "Rifle bólter" }, { n: "Arma de energía" }] },
            { label: "Rifle bólter; martillo de trueno", w: [{ n: "Rifle bólter" }, { n: "Martillo de trueno" }] },
            { label: "Rifle bólter silencio; espada sierra", w: [{ n: "Rifle bólter silencio" }, { n: "Espada sierra" }] },
            { label: "Rifle bólter silencio; puños", w: [{ n: "Rifle bólter silencio" }, { n: "Puños" }] },
            { label: "Rifle bólter silencio; puño de energía", w: [{ n: "Rifle bólter silencio" }, { n: "Puño de energía" }] },
            { label: "Rifle bólter silencio; arma de energía", w: [{ n: "Rifle bólter silencio" }, { n: "Arma de energía" }] },
            { label: "Rifle bólter silencio; martillo de trueno", w: [{ n: "Rifle bólter silencio" }, { n: "Martillo de trueno" }] },
          ],
        },
        { type: "CAPITÁN MARINE ESPACIAL", max: 1, section: "Líder (elige 1)" },
        { type: "GRANADERO INTERCESOR DE ASALTO", max: 1, section: "Agentes" },
        { type: "COMBATIENTE INTERCESOR DE ASALTO", max: null, section: "Agentes" },
        { type: "FRANCOTIRADOR ELIMINADOR", max: 1, section: "Agentes" },
        { type: "TIRADOR INTERCESOR PESADO", max: 1, section: "Agentes" },
        {
          type: "TIRADOR INTERCESOR",
          max: 1,
          section: "Agentes",
          loadouts: [
            {
              label: "Lanzagranadas auxiliar; rifle bólter automático; puños",
              w: [{ n: "Lanzagranadas auxiliar" }, { n: "Rifle bólter automático" }, { n: "Puños" }],
            },
            { label: "Lanzagranadas auxiliar; rifle bólter; puños", w: [{ n: "Lanzagranadas auxiliar" }, { n: "Rifle bólter" }, { n: "Puños" }] },
            {
              label: "Lanzagranadas auxiliar; rifle bólter silencio; puños",
              w: [{ n: "Lanzagranadas auxiliar" }, { n: "Rifle bólter silencio" }, { n: "Puños" }],
            },
          ],
        },
        { type: "COMBATIENTE INTERCESOR", max: null, key: "ci-auto", label: "Combatiente Intercesor · rifle bólter automático", section: "Agentes" },
        { type: "COMBATIENTE INTERCESOR", max: null, key: "ci-rifle", label: "Combatiente Intercesor · rifle bólter", section: "Agentes" },
        {
          type: "COMBATIENTE INTERCESOR",
          max: null,
          key: "ci-silencio",
          label: "Combatiente Intercesor · rifle bólter silencio",
          section: "Agentes",
        },
      ],
    },
    constraints: [
      {
        types: ["SARGENTO INTERCESOR DE ASALTO", "SARGENTO INTERCESOR", "CAPITÁN MARINE ESPACIAL"],
        min: 1,
        max: 1,
        label: "1 líder",
        msg: "Elige exactamente un líder (Sargento de Asalto, Sargento o Capitán).",
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
