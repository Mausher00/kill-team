// ============================================================
//  data/asaltantes-phobos.js — Asaltantes Phobos
//  Generado desde el PDF oficial: Phobos Strike Team (dic. 2025)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['asaltantes-phobos'] = {
  id: "asaltantes-phobos",
  name: "Asaltantes Phobos",
  subfaction: "Adeptus Astartes",
  icon: "🛰️",
  img: "imagenes/asaltantes-phobos.webp",
  desc: "Primaris de armadura Phobos: Infiltradores, Incursores y Saqueadores que golpean desde las sombras.",
  tags: ["Imperium", "Infiltración", "Reconocimiento"],
  version: "Noviembre 2025",
  source: "Phobos Strike Team (dic. 2025)",
  ops: [
    {
      id: "sargento-infiltrador",
      name: "Sargento Infiltrador",
      type: "SARGENTO INFILTRADOR",
      img: "imagenes/asaltantes-phobos-img/sargento-infiltrador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 13 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "LÍDER", "INFILTRADOR", "SARGENTO"],
      w: [{ n: "Carabina bólter de tirador", a: 4, i: "3+", d: "3/4", r: ["Letal 5+"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Ventaja táctica",
          t: "Puedes realizar cada una de las siguientes opciones una vez por batalla:\n• Tras desempatar para decidir la iniciativa, si este agente se encuentra en la zona de aniquilación, puedes repetir tu D6.\n• Puedes usar un ardid de tiroteo por 0PM si este es el agente ASALTANTE PHOBOS especificado (incluyendo Repetición de mando si los dados de ataque o de defensa se tiraban para este agente), o el ardid de tiroteo Emboscada paciente por 0PM si este agente está apostado y fuera de la zona de control de todo agente enemigo.",
        },
      ],
    },
    {
      id: "comunicador-infiltrador",
      name: "Comunicador Infiltrador",
      type: "COMUNICADOR INFILTRADOR",
      img: "imagenes/asaltantes-phobos-img/comunicador-infiltrador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "INFILTRADOR", "COMUNICADOR"],
      w: [{ n: "Carabina bólter de tirador", a: 4, i: "3+", d: "3/4", r: ["Letal 5+"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Vigilancia estratégica",
          t: "En el paso de Preparación de cada fase de estrategia, cuando ganes PM, si este agente está en la zona de aniquilación y no está en la zona de control de agentes enemigos, puedes usar esta regla. Si lo haces, tira 1D6: con 4+, ganas 1 PM adicional.",
        },
        {
          n: "Matriz de comunicaciones",
          t: "Una vez por punto de inflexión, durante la activación o reacción de un agente ASALTANTE PHOBOS amigo, antes o después de que realice una acción, si este agente está en la zona de aniquilación, puedes cambiar un ardid de estrategia que hayas usado en este punto de inflexión (eso no te cuesta PM).",
        },
      ],
    },
    {
      id: "adepto-helix-infiltrador",
      name: "Adepto Helix Infiltrador",
      type: "ADEPTO HELIX INFILTRADOR",
      img: "imagenes/asaltantes-phobos-img/adepto-helix-infiltrador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "MÉDICO", "INFILTRADOR", "ADEPTO HELIX"],
      w: [{ n: "Carabina bólter de tirador", a: 4, i: "3+", d: "3/4", r: ["Letal 5+"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "¡Sanitario!",
          t: "La primera vez durante cada punto de inflexión que otro agente ASALTANTE PHOBOS amigo vaya a resultar incapacitado mientras era visible para este agente y estaba a 3\" o menos de él, puedes usar esta regla siempre que ni este ni ese agente estén en la zona de control de algún agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le queda 1 herida y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede entonces realizar inmediatamente una acción libre de CORRER, pero debe terminar ese movimiento en la zona de control de este agente. Resta 1 a los atributos LPA de este y de ese agente hasta el final de sus próximas activaciones respectivamente, y si esta regla fue usada durante la activación de ese agente amigo, esa activación termina. No puedes usar esta regla si este agente está incapacitado, o si es una acción de DISPARAR y este agente iba a ser el blanco primario o secundario.",
        },
        {
          n: "Guantelete Helix (1PA)",
          t: "Elige un agente ASALTANTE PHOBOS amigo en la zona de control de este agente para que recupere hasta 1D3+3 heridas perdidas. No puede ser un agente en el que se haya utilizado la regla ¡Sanitario! durante este punto de inflexión. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "zapador-infiltrador",
      name: "Zapador Infiltrador",
      type: "ZAPADOR INFILTRADOR",
      img: "imagenes/asaltantes-phobos-img/zapador-infiltrador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "INFILTRADOR", "ZAPADOR"],
      w: [
        { n: "Carabina bólter de tirador", a: 4, i: "3+", d: "3/4", r: ["Letal 5+"] },
        { n: "Detonador remoto", a: 4, i: "2+", d: "5/6", r: ["Limitada 1", "Penetración 1", "Pesada (solo Correr)", "Silenciosa", "Detonar*"] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Detonar",
          t: "No elijas un blanco válido. En su lugar, dispara contra cada agente a 2\" o menos de tu marcador de Explosivos, salvo que haya terreno Pesado completamente interpuesto entre ese agente y ese marcador. Ninguno de esos agentes puede estar a cubierto u ofuscado. Tira cada secuencia por separado en el orden que elijas. No puedes elegir esta arma si tu marcador de Explosivos no está en la zona de aniquilación. Al final de la acción, retira tu marcador de Explosivos de la zona de aniquilación. En una zona de aniquilación que use las reglas de combate cerrado (p. ej., Zona de aniquilación: Mundo Necrópolis), esta arma tiene la regla de armas Letal 5+.",
        },
        {
          n: "Poner explosivos",
          t: "Este agente lleva tu marcador de Explosivos. Puede realizar la acción de Recoger marcador sobre ese marcador, y cuando realiza la acción de Colocar marcador sobre ese marcador, puede realizar de inmediato una acción libre de Correr.",
        },
      ],
    },
    {
      id: "veterano-infiltrador",
      name: "Veterano Infiltrador",
      type: "VETERANO INFILTRADOR",
      img: "imagenes/asaltantes-phobos-img/veterano-infiltrador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "INFILTRADOR", "VETERANO"],
      w: [{ n: "Carabina bólter personalizada", a: 4, i: "3+", d: "3/4", r: ["Personalizada*"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Personalizada",
          t: "Al final del paso de Elegir agentes, si este agente es elegido para el despliegue, elige hasta dos de las siguientes reglas de armas para que las tenga esta arma durante la batalla: Críticos de penetración 1, Desgarradora, Equilibrada, Letal 5+, Saturación.",
        },
      ],
    },
    {
      id: "vocopirata-infiltrador",
      name: "Vocopirata Infiltrador",
      type: "VOCOPIRATA INFILTRADOR",
      img: "imagenes/asaltantes-phobos-img/vocopirata-infiltrador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "INFILTRADOR", "VOCOPIRATA"],
      w: [{ n: "Carabina bólter de tirador", a: 4, i: "3+", d: "3/4", r: ["Letal 5+"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Vocopirata",
          t: "Cuando un agente enemigo esté a 6\" o menos de este agente, tu oponente no puede repetir sus dados de ataque o dados de defensa para ese agente.",
        },
        {
          n: "Escaneo Auspex (1PA)",
          t: "Hasta el inicio de la siguiente activación de este agente, o hasta que quede incapacitado (lo que ocurra antes), siempre que un agente ASALTANTE PHOBOS amigo dispare a un agente enemigo a 8\" o menos de este agente, dicho agente enemigo no puede estar ofuscado; si ese agente amigo es un INCURSOR, sus armas a distancia tienen además la regla de arma Buscadora (Ligero). Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "combatiente-infiltrador",
      name: "Combatiente Infiltrador",
      type: "COMBATIENTE INFILTRADOR",
      img: "imagenes/asaltantes-phobos-img/combatiente-infiltrador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "INFILTRADOR", "COMBATIENTE"],
      w: [{ n: "Carabina bólter de tirador", a: 4, i: "3+", d: "3/4", r: ["Letal 5+"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Vanguardia",
          t: "Una vez por punto de inflexión, un agente ASALTANTE PHOBOS amigo con esta regla puede realizar la acción Recoger marcador o una acción de misión por 1 PA menos.",
        },
      ],
    },
    {
      id: "sargento-incursor",
      name: "Sargento Incursor",
      type: "SARGENTO INCURSOR",
      img: "imagenes/asaltantes-phobos-img/sargento-incursor.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 13 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "LÍDER", "INCURSOR", "SARGENTO"],
      w: [{ n: "Carabina bólter occulus", a: 4, i: "3+", d: "3/4", r: ["Saturación"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Ventaja táctica",
          t: "Puedes realizar cada una de las siguientes opciones una vez por batalla:\n• Tras desempatar para decidir la iniciativa, si este agente se encuentra en la zona de aniquilación, puedes repetir tu D6.\n• Puedes usar un ardid de tiroteo por 0PM si este es el agente ASALTANTE PHOBOS especificado (incluyendo Repetición de mando si los dados de ataque o de defensa se tiraban para este agente), o el ardid de tiroteo Emboscada paciente por 0PM si este agente está apostado y fuera de la zona de control de todo agente enemigo.",
        },
      ],
    },
    {
      id: "ojo-preciso-incursor",
      name: "Ojo Preciso Incursor",
      type: "OJO PRECISO INCURSOR",
      img: "imagenes/asaltantes-phobos-img/ojo-preciso-incursor.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "INCURSOR", "OJO PRECISO"],
      w: [
        { n: "Carabina bólter de tirador silencio", a: 4, i: "2+", d: "3/4", r: ["Letal 5+", "Penetración 1"] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Rastrear blanco",
          t: "Este agente puede realizar la acción de Ponerse en guardia durante su activación (ver las reglas de combate cerrado, en el Reglamento básico de Kill Team) en cualquier zona de aniquilación. Puede realizar la acción de Ponerse en guardia aún teniendo una orden de ocultarse, pero cuando realices la acción libre de Combatir o Disparar durante la interrupción, debes cambiar su orden por trabarse.",
        },
      ],
    },
    {
      id: "minador-incursor",
      name: "Minador Incursor",
      type: "MINADOR INCURSOR",
      img: "imagenes/asaltantes-phobos-img/minador-incursor.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "INCURSOR", "MINADOR"],
      w: [{ n: "Carabina bólter occulus", a: 4, i: "3+", d: "3/4", r: ["Saturación"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Mina de disrupción",
          t: "Este agente lleva tu marcador de Mina de disrupción. Puede realizar la acción de Recoger marcador sobre ese marcador, pero ese marcador no puede ser colocado en la zona de control de un agente enemigo (si este agente queda incapacitado mientras lleva el marcador en cuestión y el marcador no puede ser colocado, es retirado junto con este agente).",
        },
        {
          n: "Mina de proximidad",
          t: "La primera vez que tu marcador de Mina de disrupción quede dentro de la zona de control de otro agente, retira ese marcador, resta 1 al atributo LPA de ese agente hasta el final de su siguiente activación, e inflígele 2D3+3 daños; si no resulta incapacitado, termina su acción (si está realizando una), aunque los efectos de la misma no se hayan completado. Si no puede ser colocado, muévelo la distancia mínima hasta que pueda. Este agente se ignora de cara a esos efectos (no puede activar ese marcador ni sufrir daños debido al mismo).",
        },
      ],
    },
    {
      id: "combatiente-incursor",
      name: "Combatiente Incursor",
      type: "COMBATIENTE INCURSOR",
      img: "imagenes/asaltantes-phobos-img/combatiente-incursor.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "INCURSOR", "COMBATIENTE"],
      w: [{ n: "Carabina bólter occulus", a: 4, i: "3+", d: "3/4", r: ["Saturación"] }, { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Vanguardia",
          t: "Una vez por punto de inflexión, un agente ASALTANTE PHOBOS amigo con esta regla puede realizar la acción Recoger marcador o una acción de misión por 1 PA menos.",
        },
      ],
    },
    {
      id: "sargento-saqueador",
      name: "Sargento Saqueador",
      type: "SARGENTO SAQUEADOR",
      img: "imagenes/asaltantes-phobos-img/sargento-saqueador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 13 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "LÍDER", "SAQUEADOR", "SARGENTO"],
      w: [
        { n: "Carabina bólter", a: 4, i: "3+", d: "3/4", r: ["Certera 1"] },
        { n: "Pistola bólter especial", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Filoarma", a: 5, i: "3+", d: "4/5", r: [] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Ventaja táctica",
          t: "Puedes realizar cada una de las siguientes opciones una vez por batalla:\n• Tras desempatar para decidir la iniciativa, si este agente se encuentra en la zona de aniquilación, puedes repetir tu D6.\n• Puedes usar un ardid de tiroteo por 0PM si este es el agente ASALTANTE PHOBOS especificado (incluyendo Repetición de mando si los dados de ataque o de defensa se tiraban para este agente), o el ardid de tiroteo Emboscada paciente por 0PM si este agente está apostado y fuera de la zona de control de todo agente enemigo.",
        },
        {
          n: "Paracaídas gravítico y lanzagarfios",
          t: "Siempre que este agente trepe, puedes tratar la distancia vertical como 2\" (sin importar lo lejos que se mueva verticalmente el agente en realidad). Cuando este agente se deje caer, ignora la distancia vertical.",
        },
      ],
    },
    {
      id: "combatiente-saqueador",
      name: "Combatiente Saqueador",
      type: "COMBATIENTE SAQUEADOR",
      img: "imagenes/asaltantes-phobos-img/combatiente-saqueador.webp",
      s: { lpa: 3, mov: "7\"", salv: "3+", h: 12 },
      kw: ["ASALTANTE PHOBOS", "IMPERIUM", "ADEPTUS ASTARTES", "SAQUEADOR", "COMBATIENTE"],
      w: [
        { n: "Carabina bólter", a: 4, i: "3+", d: "3/4", r: ["Certera 1"] },
        { n: "Pistola bólter especial", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Filoarma", a: 5, i: "3+", d: "4/5", r: [] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Paracaídas gravítico y lanzagarfios",
          t: "Siempre que este agente trepe, puedes tratar la distancia vertical como 2\" (sin importar lo lejos que se mueva verticalmente el agente en realidad). Cuando este agente se deje caer, ignora la distancia vertical.",
        },
        {
          n: "Vanguardia",
          t: "Una vez por punto de inflexión, un agente ASALTANTE PHOBOS amigo con esta regla puede realizar la acción Recoger marcador o una acción de misión por 1 PA menos.",
        },
      ],
    },
  ],
  fr: {
    name: "Omniinterferidor",
    type: "REGLA DE FACCIÓN",
    text: "GAMBITO ESTRATÉGICO si en la zona de aniquilación hay un agente INFILTRADOR amigo. Elige un agente enemigo visible para un agente INFILTRADOR amigo, o a 6\" o menos de un agente VOCOPIRATA amigo. En la fase de tiroteo de este punto de inflexión, dicho agente enemigo no podrá ser activado ni realizar acciones a menos que se cumpla una de las siguientes condiciones:\n• Tu oponente ha activado un número de agentes enemigos igual al número de agentes INFILTRADOR amigos en la zona de aniquilación cuando se usó este GAMBITO ESTRATÉGICO.\n• Es el último agente enemigo en ser activado.",
    orders: [
      {
        n: "Terror",
        t: "Cuando un agente enemigo se encuentre a 3\" o menos de algún agente SAQUEADOR amigo, tu oponente debe gastar 1 PA adicional para que ese agente enemigo realice una acción de Recoger marcador o de misión. Al determinar el control de un marcador, considera el atributo LPA total de los agentes enemigos que lo estén disputando como si fuera 1 menos si al menos uno de esos agentes enemigos se encuentra a 3\" o menos de algún agente SAQUEADOR amigo. Ten en cuenta que esto no es un cambio a su atributo LPA, de modo que cualquier cambio es acumulable con esto.",
      },
      {
        n: "Astartes",
        t: "Durante la activación de cada agente ASALTANTE PHOBOS amigo, este puede realizar o bien dos acciones de Combatir, o bien dos acciones de Disparar. Si son dos acciones de Disparar, debe seleccionarse un arma bólter al menos para una de ellas. Un arma bólter es cualquier arma a distancia que incluya la palabra “bólter” en el nombre, como por ejemplo “carabina bólter de tirador”, “pistola bólter especial”, etc. Cada agente ASALTANTE PHOBOS puede reaccionar sin importar cuál sea su orden.",
      },
      { n: "Sistema multiespectro", t: "Cuando un agente INCURSOR amigo dispara, los agentes enemigos no pueden estar ofuscados." },
    ],
  },
  frs: [
    {
      name: "Omniinterferidor",
      text: "GAMBITO ESTRATÉGICO si en la zona de aniquilación hay un agente INFILTRADOR amigo. Elige un agente enemigo visible para un agente INFILTRADOR amigo, o a 6\" o menos de un agente VOCOPIRATA amigo. En la fase de tiroteo de este punto de inflexión, dicho agente enemigo no podrá ser activado ni realizar acciones a menos que se cumpla una de las siguientes condiciones:\n• Tu oponente ha activado un número de agentes enemigos igual al número de agentes INFILTRADOR amigos en la zona de aniquilación cuando se usó este GAMBITO ESTRATÉGICO.\n• Es el último agente enemigo en ser activado.",
      subs: [],
    },
    {
      name: "Terror",
      text: "Cuando un agente enemigo se encuentre a 3\" o menos de algún agente SAQUEADOR amigo, tu oponente debe gastar 1 PA adicional para que ese agente enemigo realice una acción de Recoger marcador o de misión. Al determinar el control de un marcador, considera el atributo LPA total de los agentes enemigos que lo estén disputando como si fuera 1 menos si al menos uno de esos agentes enemigos se encuentra a 3\" o menos de algún agente SAQUEADOR amigo. Ten en cuenta que esto no es un cambio a su atributo LPA, de modo que cualquier cambio es acumulable con esto.",
      subs: [],
    },
    {
      name: "Astartes",
      text: "Durante la activación de cada agente ASALTANTE PHOBOS amigo, este puede realizar o bien dos acciones de Combatir, o bien dos acciones de Disparar. Si son dos acciones de Disparar, debe seleccionarse un arma bólter al menos para una de ellas. Un arma bólter es cualquier arma a distancia que incluya la palabra “bólter” en el nombre, como por ejemplo “carabina bólter de tirador”, “pistola bólter especial”, etc. Cada agente ASALTANTE PHOBOS puede reaccionar sin importar cuál sea su orden.",
      subs: [],
    },
    { name: "Sistema multiespectro", text: "Cuando un agente INCURSOR amigo dispara, los agentes enemigos no pueden estar ofuscados.", subs: [] },
  ],
  pl: {
    s: [
      {
        n: "Guerra de guerrillas",
        t: "Los agentes ASALTANTE PHOBOS amigos pueden realizar la siguiente acción única:\n▸ GUERRA DE GUERRILLAS 1PA: Cambia la orden de este agente. Un agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
      },
      {
        n: "Asaltos letales",
        t: "Cuando un agente ASALTANTE PHOBOS combate, sus armas de combate tienen la regla de armas Equilibrada. Si lo hace durante una activación en la que ese agente amigo ha realizado una acción de Cargar, sus armas de combate tienen también la regla de armas Letal 5+.",
      },
      {
        n: "Y no conocerán el miedo",
        t: "Puedes ignorar cualquier cambio a los atributos de los agentes ASALTANTE PHOBOS amigos por estar lesionados (incluyendo los atributos de sus armas).",
      },
      {
        n: "Disparos letales",
        t: "Cuando un agente ASALTANTE PHOBOS amigo dispare durante una activación en la que no haya llevado a cabo una acción de Cargar, Retroceder o Reposicionarse, o dispare contra un agente que no se encuentre a cubierto y esté a más de 6\" de él, las armas a distancia de ese agente amigo tienen la regla de arma Equilibrada. Ten en cuenta que, para el primer requisito, el agente amigo no tiene prohibido realizar dichas acciones tras disparar.",
      },
    ],
    f: [
      { n: "Emboscada paciente", t: "Usa este ardid de tiroteo cuando sea tu turno de activar un agente amigo. Puedes saltarte esa activación." },
      {
        n: "Asalto sigiloso",
        t: "Usa este ardid de tiroteo cuando un agente ASALTANTE PHOBOS amigo que tenga una orden de ocultarse sea activado, reciba una orden de trabarse, realice una acción de Cargar y a continuación una acción de Combatir, y estés resolviendo tu primer dado de ataque de esta activación. Tras hacerlo, puedes resolver de inmediato otro de tus dados de ataque (antes que tu oponente). El agente no puede haber realizado ninguna otra acción durante esta activación (pero sí puede hacer tal cosa tras resolver este ardid).",
      },
      {
        n: "Disparo crítico",
        t: "Usa este ardid de tiroteo cuando resuelvas un impacto crítico de un agente ASALTANTE PHOBOS amigo que esté disparando con un arma bólter. Inflige 1D3 daños adicionales.",
      },
      {
        n: "Fisiología transhumana",
        t: "Usa este ardid de tiroteo cuando un agente dispare contra un agente ASALTANTE PHOBOS amigo, en el paso de tirar dados de defensa. Puedes guardar uno de tus éxitos normales como un éxito crítico en su lugar.",
      },
    ],
  },
  eq: [
    {
      n: "Sellos de pureza",
      t: "Una vez por punto de inflexión, cuando un agente ASALTANTE PHOBOS amigo dispare o combata, si sacas dos o más fallos, puedes descartar uno de ellos para guardar el otro como éxito normal en su lugar.",
    },
    {
      n: "Munición especial",
      t: "Una vez por punto de inflexión, cuando un agente ASALTANTE PHOBOS amigo realice la acción Disparar y elijas una carabina bólter, una carabina bólter de tirador o una carabina bólter occulus, puedes usar esta regla. Si lo haces, hasta el final del punto de inflexión dicha arma tendrá la regla Penetración 1.",
    },
    {
      n: "Granadas especiales adicionales",
      t: "Este equipo te permite seleccionar cuatro granadas especiales adicionales del equipo de granadas especiales (ver equipo universal). No puedes además elegir ese equipo de forma normal (y por tanto tener cinco o seis).",
    },
    {
      n: "Filopuñales",
      t: "Los Agentes ASALTANTE PHOBOS amigos tienen la siguiente arma de combate:\nATQ IMP DAÑO\n▸ Filopuñal — ATQ 5 · IMP 3+ · DAÑO 3/4",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Noviembre 2025",
      ee: [
        {
          s: "Agente zapador, regla de armar detonar",
          t: "Añade este texto al final del primer párrafo… “En una zona de aniquilación que use las reglas de combate cerrado (p. ej., Zona de aniquilación: Mundo Necrópolis), esta arma tiene la regla de armas Letal 5+”.",
        },
      ],
    },
    {
      v: "Cambios · Noviembre 2025",
      ee: [
        {
          s: "Ardides de estrategia, disparos letales",
          t: "Cambia la parte relevante de la primera frase por: ”[…] o contra un agente que no se encuentre a cubierto y esté a más de 6\" de él, las armas a distancia de ese agente amigo tienen la regla de arma Equilibrada.”",
        },
        {
          s: "Agentes sargento saqueador y combatiente saqueador, regla paracaídas gravítico y lanzagarfios",
          t: "Cambia la parte relevante de la primera frase por: “Siempre que este agente trepe, puedes tratar la distancia vertical como […]”",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Agente adepto helix, regla ¡sanitario!",
          t: "Cambiar a: “La primera vez durante cada punto de inflexión que otro agente ASALTANTE PHOBOS amigo vaya a resultar incapacitado mientras era visible para este agente y estaba a 3\" o menos de él, puedes usar esta regla siempre que ni este ni ese agente estén en la zona de control de algún agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le quedan 1D3 heridas y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede entonces realizar inmediatamente una acción libre de Correr, pero debe terminar ese movimiento en la zona de control de este agente. Resta 1 a los atributos LPA de este y de ese agente hasta el final de sus próximas activaciones respectivamente, y si esta regla fue usada durante la activación de ese agente amigo, esa activación termina. No puedes usar esta regla si este agente está incapacitado, o si es una acción de Disparar y este agente iba a ser el blanco primario o secundario”.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Infiltración", "Reconocimiento"],
    required: [],
    pool: {
      slots: 6,
      note: "1 sargento y 5 agentes. Salvo Combatientes, cada agente solo una vez.",
      entries: [
        { type: "SARGENTO INFILTRADOR", max: 1, section: "Líder (elige 1)" },
        { type: "SARGENTO INCURSOR", max: 1, section: "Líder (elige 1)" },
        {
          type: "SARGENTO SAQUEADOR",
          max: 1,
          section: "Líder (elige 1)",
          loadouts: [
            { label: "Pistola bólter especial; filoarma", w: [{ n: "Pistola bólter especial" }, { n: "Filoarma" }] },
            { label: "Carabina bólter; puños", w: [{ n: "Carabina bólter" }, { n: "Puños" }] },
          ],
        },
        { type: "COMUNICADOR INFILTRADOR", max: 1, section: "Agentes" },
        { type: "ADEPTO HELIX INFILTRADOR", max: 1, section: "Agentes" },
        { type: "ZAPADOR INFILTRADOR", max: 1, section: "Agentes" },
        { type: "VETERANO INFILTRADOR", max: 1, section: "Agentes" },
        { type: "VOCOPIRATA INFILTRADOR", max: 1, section: "Agentes" },
        { type: "COMBATIENTE INFILTRADOR", max: null, section: "Agentes" },
        { type: "OJO PRECISO INCURSOR", max: 1, section: "Agentes" },
        { type: "MINADOR INCURSOR", max: 1, section: "Agentes" },
        { type: "COMBATIENTE INCURSOR", max: null, section: "Agentes" },
        {
          type: "COMBATIENTE SAQUEADOR",
          max: null,
          key: "cs-pistola",
          label: "Combatiente Saqueador · pistola bólter especial",
          section: "Agentes",
        },
        { type: "COMBATIENTE SAQUEADOR", max: null, key: "cs-carabina", label: "Combatiente Saqueador · carabina bólter", section: "Agentes" },
      ],
    },
    constraints: [
      {
        types: ["SARGENTO INFILTRADOR", "SARGENTO INCURSOR", "SARGENTO SAQUEADOR"],
        min: 1,
        max: 1,
        label: "1 sargento",
        msg: "Elige exactamente un sargento.",
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
