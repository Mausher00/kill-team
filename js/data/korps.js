// ============================================================
//  data/korps.js — Korps de la Muerte
//  Generado desde el PDF oficial: Death Korps (abr. 2026)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['korps'] = {
  id: "korps",
  name: "Korps de la Muerte",
  subfaction: "Astra Militarum",
  icon: "💀",
  img: "imagenes/korps.webp",
  desc: "Especialistas del Imperium en asedios, trincheras y combate en zonas de alta toxicidad.",
  tags: ["Imperium", "Seguridad", "Buscar y destruir"],
  version: "Abril 2026",
  source: "Death Korps (abr. 2026)",
  ops: [
    {
      id: "vigia",
      name: "Vigía de los Korps",
      type: "VIGÍA",
      img: "imagenes/korps-img/vigia.webp",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 8 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "LÍDER", "VIGÍA"],
      w: [
        { n: "Bólter", a: 4, i: "3+", d: "3/4", r: [] },
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Pistola de plasma (normal)", a: 4, i: "4+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Pistola de plasma (sobrecarga)", a: 4, i: "4+", d: "4/5", r: ["Alcance 8\"", "Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Pistola láser reliquia", a: 4, i: "3+", d: "2/4", r: ["Alcance 8\"", "Letal 5+"] },
        { n: "Bayoneta", a: 4, i: "3+", d: "2/3", r: [] },
        { n: "Espada sierra", a: 4, i: "3+", d: "4/5", r: [] },
        { n: "Arma de energía", a: 4, i: "3+", d: "4/6", r: ["Letal 5+"] },
      ],
      ru: [
        {
          n: "Órdenes adaptativas",
          t: "Si este agente no da una ORDEN DE GUARDIA como GAMBITO ESTRATÉGICO, puedes usar el ardid de tiroteo Liderazgo inspirador por 0PM durante la activación de este agente.",
        },
        {
          n: "¡Abajo con él!",
          t: "GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación. Elige un agente enemigo. Siempre que un agente KORPS DE LA MUERTE amigo dispare, combata o contraataque contra ese agente enemigo, las armas de ese agente amigo tienen la regla de arma Castigadora.",
        },
      ],
    },
    {
      id: "maton",
      name: "Matón de los Korps",
      type: "MATÓN",
      img: "imagenes/korps-img/maton.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "MATÓN"],
      w: [{ n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] }, { n: "Garrote de trinchera", a: 4, i: "3+", d: "3/3", r: ["Choque"] }],
      ru: [
        {
          n: "Matón",
          t: "Una vez por punto de inflexión, cuando este agente combata o contraataque, en el paso de Resolver dados de ataque, puedes ignorar el daño que le haya infligido un éxito normal. Si este agente resulta incapacitado durante una acción de Combatir, puedes golpear al agente enemigo en esa secuencia con uno de tus éxitos sin resolver antes de retirar este agente de la zona de aniquilación.",
        },
      ],
    },
    {
      id: "solido",
      name: "Sólido de los Korps",
      type: "SÓLIDO",
      img: "imagenes/korps-img/solido-de-los-korps.webp",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "SÓLIDO"],
      w: [
        { n: "Bólter", a: 4, i: "4+", d: "3/4", r: [] },
        { n: "Pistola bólter", a: 4, i: "4+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Pistola láser reliquia", a: 4, i: "4+", d: "2/4", r: ["Alcance 8\"", "Letal 5+"] },
        { n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] },
        { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] },
        { n: "Espada sierra", a: 4, i: "4+", d: "4/5", r: [] },
      ],
      ru: [
        {
          n: "Segundo al mando",
          t: "Si un agente VIGÍA amigo resulta incapacitado y es retirado de la zona de aniquilación, puedes usar esta regla. Si lo haces, hasta el final de la batalla, este agente puede dar una ORDEN DE GUARDIA como GAMBITO ESTRATÉGICO (aunque no sea un agente VIGÍA).",
        },
        {
          n: "Directiva",
          t: "Siempre que este agente sea activado, si no has usado la regla Segundo al mando durante la batalla, puedes elegir otro agente KORPS DE LA MUERTE amigo apostado a 6\" o menos de este agente y visible para él. Cuando este agente sea usado, activa a ese otro agente amigo antes de que active tu oponente (si ese agente es un SOLDADO, ignora su regla de Activación en grupo).",
        },
      ],
    },
    {
      id: "tirador",
      name: "Tirador de los Korps",
      type: "TIRADOR",
      img: "imagenes/korps-img/tirador-de-los-korps.webp",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "TIRADOR"],
      w: [
        { n: "Lanzallamas", a: 4, i: "2+", d: "3/3", r: ["Alcance 8\"", "Ráfaga 2\"", "Saturación"] },
        { n: "Lanzagranadas (frag)", a: 4, i: "4+", d: "2/4", r: ["Área 2\""] },
        { n: "Lanzagranadas (perforante)", a: 4, i: "4+", d: "4/5", r: ["Penetración 1"] },
        { n: "Rifle de fusión", a: 4, i: "4+", d: "6/3", r: ["Alcance 6\"", "Devastadora 4", "Penetración 2"] },
        { n: "Rifle de plasma (normal)", a: 4, i: "4+", d: "4/6", r: ["Penetración 1"] },
        { n: "Rifle de plasma (sobrecarga)", a: 4, i: "4+", d: "5/6", r: ["Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [],
    },
    {
      id: "medico",
      name: "Médico de los Korps",
      type: "MÉDICO",
      img: "imagenes/korps-img/medico.webp",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "MÉDICO"],
      w: [{ n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] }, { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] }],
      ru: [
        {
          n: "¡Sanitario!",
          t: "La primera vez durante cada punto de inflexión que otro agente KORPS DE LA MUERTE amigo vaya a resultar incapacitado mientras es visible para este agente y se encuentra a 3\" o menos de él, puedes usar esta regla, siempre y cuando ni este ni el otro agente se encuentren en la zona de control de un agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le queda 1 herida y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede realizar inmediatamente una acción libre de Correr, pero debe terminar ese movimiento en la zona de control de este agente. Resta 1 a los atributos LPA de este y ese agente hasta el final de sus respectivas siguientes activaciones, y si esta regla se usa durante la activación de ese agente amigo, dicha activación finaliza. No puedes usar esta regla si este agente resulta incapacitado, o si es una acción de Disparar y este agente iba a ser el blanco primario o secundario.",
        },
        {
          n: "Botiquín (1PA)",
          t: "Elige un agente KORPS DE LA MUERTE amigo en la zona de control de este agente para que recupere 2D3 heridas perdidas. No puede ser un agente con el que se haya usado la regla ¡Sanitario! durante este punto de inflexión. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "zapador",
      name: "Zapador de los Korps",
      type: "ZAPADOR",
      img: "imagenes/korps-img/zapador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "ZAPADOR"],
      w: [
        { n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] },
        { n: "Detonador remoto", a: 4, i: "2+", d: "5/6", r: ["Limitada 1", "Penetración 1", "Pesada (solo Correr)", "Silenciosa", "Detonar*"] },
        { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Plantar minas",
          t: "Este agente lleva tu marcador de Mina. Puede realizar la acción de Recoger marcador sobre ese marcador, y cuando realiza la acción de Colocar marcador sobre ese marcador, puede realizar de inmediato una acción libre de Correr.",
        },
        {
          n: "Detonar",
          t: "No elijas un blanco válido. En su lugar, dispara contra cada agente a 2\" o menos de tu marcador de Mina, salvo que haya terreno Pesado completamente interpuesto entre ese agente y ese marcador. Ninguno de esos agentes está a cubierto u ofuscado. Tira cada secuencia por separado en el orden que elijas. Esta arma no puede ser elegida si tu marcador de Mina no está en la zona de aniquilación. Al final de la acción, retira tu marcador de Mina de la zona de aniquilación. En una zona de aniquilación que use reglas de combate cerrado (p. ej., Zona de aniquilación: Mundo Necrópolis), esta arma tiene la regla de armas Letal 5+.",
        },
      ],
    },
    {
      id: "francotirador",
      name: "Francotirador de los Korps",
      type: "FRANCOTIRADOR",
      img: "imagenes/korps-img/franco.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "FRANCOTIRADOR"],
      w: [
        { n: "Rifle láser telescópico (oculto)", a: 4, i: "2+", d: "3/3", r: ["Devastadora 3", "Pesada", "Silenciosa", "Posición oculta*"] },
        { n: "Rifle láser telescópico (móvil)", a: 4, i: "3+", d: "3/4", r: [] },
        { n: "Rifle láser telescópico (inmóvil)", a: 4, i: "2+", d: "3/3", r: ["Devastadora 3", "Pesada"] },
        { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [{ n: "Posición oculta", t: "Este agente solo puede usar esta arma la primera vez que realiza una acción de Disparar durante la batalla." }],
    },
    {
      id: "ojeador",
      name: "Ojeador de los Korps",
      type: "OJEADOR",
      img: "imagenes/korps-img/ojeador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "OJEADOR"],
      w: [
        { n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] },
        { n: "Andanada de mortero", a: 4, i: "4+", d: "3/5", r: ["Área 2\"", "Pesada (solo Correr)", "Silenciosa"] },
        { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Ojear (1PA)",
          t: "APOYO. Elige un agente enemigo visible para este agente. Hasta el final del punto de inflexión, siempre que un agente KORPS DE LA MUERTE amigo a 3\" o menos de este agente dispare contra ese agente enemigo, puedes usar este efecto.",
          isAct: true,
        },
        {
          n: "Si lo haces",
          t: "• Las armas de ese agente amigo tienen la regla de armas Buscadora (ligera).\n• Ese agente enemigo no puede estar ofuscado. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
        },
      ],
    },
    {
      id: "soldado",
      name: "Soldado de los Korps",
      type: "SOLDADO",
      img: "imagenes/korps-img/soldado.webp",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "SOLDADO"],
      w: [{ n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] }, { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Activación en grupo",
          t: "Cuando este agente quede usado, debes activar a continuación otro agente SOLDADO KORPS DE LA MUERTE amigo apostado (si es posible) antes de que active tu oponente. En cuanto ese otro agente quede usado, tu oponente activa de manera normal (es decir, no puedes activar más de dos agentes sucesivos mediante esta regla).",
        },
      ],
    },
    {
      id: "veterano",
      name: "Veterano de los Korps",
      type: "VETERANO",
      img: "imagenes/korps-img/veterano.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "VETERANO"],
      w: [{ n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] }, { n: "Brazo biónico", a: 3, i: "4+", d: "4/5", r: [] }],
      ru: [
        { n: "Guardia Veterano", t: "Siempre que este agente es activado, puede recibir una ORDEN DE GUARDIA." },
        { n: "Biónico", t: "El Daño normal de 3 o más inflige 1 daño menos a este agente." },
      ],
    },
    {
      id: "vocooperador",
      name: "Vocooperador de los Korps",
      type: "VOCOOPERADOR",
      img: "imagenes/korps-img/voco.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "VOCOOPERADOR"],
      w: [{ n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] }, { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] }],
      ru: [
        {
          n: "Transmitir órdenes",
          t: "Una vez por punto de inflexión, cuando este agente reciba una ORDEN DE GUARDIA, si no se encuentra en la zona de control de agentes enemigos, puede transmitir esa orden. Cuando una orden es transmitida, todos los agentes KORPS DE LA MUERTE amigos en la zona de aniquilación reciben esa orden, y a continuación resta 1 al atributo LPA de este agente hasta el final de su siguiente activación.",
        },
        {
          n: "Señal (1PA)",
          t: "APOYO. Elige un agente KORPS DE LA MUERTE amigo distinto a 6\" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "fanatico",
      name: "Fanático de los Korps",
      type: "FANÁTICO",
      img: "imagenes/korps-img/fanatico.jpg",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 7 },
      kw: ["KORPS DE LA MUERTE", "IMPERIUM", "ASTRA MILITARUM", "FANÁTICO"],
      w: [{ n: "Rifle láser", a: 4, i: "4+", d: "2/3", r: [] }, { n: "Bayoneta", a: 3, i: "4+", d: "2/3", r: [] }],
      ru: [
        { n: "El Emperador protege", t: "Cuando un agente dispare contra este agente, puedes repetir cualquiera de tus dados de defensa." },
        {
          n: "Manual de campaña",
          t: "APOYO. Siempre que un agente KORPS DE LA MUERTE amigo se encuentre a 3\" o menos de este agente, las armas de ese agente amigo tienen la regla de armas Severa.",
        },
      ],
    },
  ],
  fr: {
    name: "Órdenes de guardia",
    type: "REGLA DE FACCIÓN",
    text: "GAMBITO ESTRATÉGICO y APOYO. Un agente VIGÍA KORPS DE LA MUERTE amigo puede dar una ORDEN DE GUARDIA. Cuando haga tal cosa, elige una ORDEN DE GUARDIA que recibirán todos los agentes KORPS DE LA MUERTE amigos a 6\" o menos de él. Siempre que un agente amigo reciba una ORDEN DE GUARDIA, aplica sus reglas hasta el final del punto de inflexión. Los agentes no pueden beneficiarse de más de una ORDEN DE GUARDIA a la vez; solo se benefician de la orden más reciente que hayan recibido durante el punto de inflexión.",
    orders: [
      {
        n: "¡Apunten!",
        t: "Las armas a distancia de los agentes que hayan recibido esta orden (salvo andanada de mortero y detonador remoto) tienen la regla de arma Incesante.",
      },
      { n: "¡Fijen bayonetas!", t: "Las armas de combate de los agentes que hayan recibido esta orden tienen la regla de arma Incesante." },
      {
        n: "¡Atrinchérense!",
        t: "Siempre que un agente dispare contra un agente amigo que haya recibido esta orden, si puedes guardar alguna salvación por cobertura, puedes repetir todos tus dados de defensa que hayan sacado el mismo resultado a tu elección (p. ej. todos los resultados de 2).",
      },
      {
        n: "¡Vamos, vamos, muévanse!",
        t: "Siempre que un agente que haya recibido esta orden realiza una acción de Reposicionarse, suma 1\" a su atributo Movimiento.",
      },
    ],
  },
  frs: [
    {
      name: "Órdenes de guardia",
      text: "GAMBITO ESTRATÉGICO y APOYO. Un agente VIGÍA KORPS DE LA MUERTE amigo puede dar una ORDEN DE GUARDIA. Cuando haga tal cosa, elige una ORDEN DE GUARDIA que recibirán todos los agentes KORPS DE LA MUERTE amigos a 6\" o menos de él. Siempre que un agente amigo reciba una ORDEN DE GUARDIA, aplica sus reglas hasta el final del punto de inflexión. Los agentes no pueden beneficiarse de más de una ORDEN DE GUARDIA a la vez; solo se benefician de la orden más reciente que hayan recibido durante el punto de inflexión.",
      subs: [
        {
          n: "¡Apunten!",
          t: "Las armas a distancia de los agentes que hayan recibido esta orden (salvo andanada de mortero y detonador remoto) tienen la regla de arma Incesante.",
        },
        { n: "¡Fijen bayonetas!", t: "Las armas de combate de los agentes que hayan recibido esta orden tienen la regla de arma Incesante." },
        {
          n: "¡Atrinchérense!",
          t: "Siempre que un agente dispare contra un agente amigo que haya recibido esta orden, si puedes guardar alguna salvación por cobertura, puedes repetir todos tus dados de defensa que hayan sacado el mismo resultado a tu elección (p. ej. todos los resultados de 2).",
        },
        {
          n: "¡Vamos, vamos, muévanse!",
          t: "Siempre que un agente que haya recibido esta orden realiza una acción de Reposicionarse, suma 1\" a su atributo Movimiento.",
        },
      ],
    },
  ],
  pl: {
    s: [
      {
        n: "Tácticas de asedio",
        t: "Las armas a distancia de los agentes KORPS DE LA MUERTE amigos tienen las reglas de arma Saturación y Certera 1.",
      },
      {
        n: "Ponerse a cubierto",
        t: "Cuando un agente dispare contra un agente KORPS DE LA MUERTE amigo, si puedes guardar alguna salvación por cobertura mejora en 1 el atributo Salvación de ese agente amigo.",
      },
      {
        n: "¡Acabad con ellos!",
        t: "Las armas de combate de los agentes KORPS DE LA MUERTE amigos tienen la regla de arma Certera 1. Siempre que un agente KORPS DE LA MUERTE amigo esté combatiendo completamente dentro de tu territorio o esté contraaatacando, sus armas de combate tienen también la regla de arma Severa.",
      },
      {
        n: "Reagruparse",
        t: "APOYO. Elige un agente KORPS DE LA MUERTE amigo que se encuentre a más de 3\" de todo agente enemigo. Cada otro agente KORPS DE LA MUERTE amigo a 5\" o menos de ese agente y que no se encuentre en la zona de control de agentes enemigos, puede realizar inmediatamente una acción libre de Correr en el orden que elijas. Sin embargo, los agentes que lo hagan deben terminar ese movimiento más cerca de lo que estaban de ese agente. Ten en cuenta que el equipo universal Aparato de comunicaciones solo afecta a la segunda distancia de esta regla. No puedes usar este ardid y el GAMBITO ESTRATÉGICO del equipo de facción Cronómetro durante el mismo punto de inflexión.",
      },
    ],
    f: [
      {
        n: "Liderazgo inspirador",
        t: "APOYO. Usa este ardid de tiroteo durante la activación de un agente VIGÍA KORPS DE LA MUERTE o SÓLIDO KORPS DE LA MUERTE amigo, antes o después de que realice una acción. Ese agente da una ORDEN DE GUARDIA.",
      },
      {
        n: "Disparos combinados",
        t: "Usa este ardid de tiroteo tras tirar tus dados de ataque por un agente KORPS DE LA MUERTE amigo, si está disparando contra un agente enemigo que haya sido blanco de disparos de otro agente KORPS DE LA MUERTE amigo durante este punto de inflexión. Puedes repetir cualquiera de tus dados de ataque.",
      },
      {
        n: "Vergüenza en vida",
        t: "Usa este ardid de tiroteo cuando un agente KORPS DE LA MUERTE amigo sea activado y reciba una orden de trabarse. Recibe también todas las ÓRDENES DE GUARDIA. Esto tiene preferencia sobre la regla normal de que los agentes no pueden beneficiarse de más de una ORDEN DE GUARDIA a la vez.",
      },
      {
        n: "Expiación en la muerte",
        t: "Usa este ardid de tiroteo cuando un agente KORPS DE LA MUERTE amigo apostado resulte incapacitado, si se encuentra fuera de la zona de control de todo agente enemigo. Antes de que sea retirado de la zona de aniquilación, puede realizar inmediatamente una accción libre y puedes cambiar su orden para ello. Recuerda que el agente amigo está lesionado durante toda esa acción.",
      },
    ],
  },
  eq: [
    {
      n: "Cronómetro",
      t: "GAMBITO ESTRATÉGICO una vez por batalla, en el primer o segundo punto de inflexión. Cada agente KORPS DE LA MUERTE amigo que se encuentre completamente dentro de tu territorio puede realizar inmediatamente una acción libre de Correr en el orden que elijas, pero debe terminarla más cerca de lo que estaba de la zona de descenso o del borde de la zona de aniquilación de un oponente. No puedes usar este GAMBITO ESTRATÉGICO y el ardid de estrategia Reagruparse durante el mismo punto de inflexión.",
    },
    {
      n: "Comunicador portátil",
      t: "Siempre que un agente VIGÍA KORPS DE LA MUERTE amigo o un agente SÓLIDO KORPS DE LA MUERTE amigo da una ORDEN DE GUARDIA, puedes usar esta regla. Si lo haces, en lugar de que cada agente KORPS DE LA MUERTE amigo a 6\" o menos de él reciba la orden, puedes elegir un agente KORPS DE LA MUERTE amigo para que reciba esa orden.",
    },
    {
      n: "Hachas de mano",
      t: "Los agentes KORPS DE LA MUERTE amigos tienen la siguiente arma de combate:\n▸ Hacha de mano — ATQ 3 · IMP 4+ · DAÑO 3/4",
    },
    {
      n: "Bombardeo con gas",
      t: "GAMBITO ESTRATÉGICO de una vez por batalla. Coloca tu marcador de Gas en la zona de aniquilación; no puede colocarse bajo terreno Aventajado. Siempre que un agente se encuentre a 3\" o menos de ese marcador, resta 1 a su atributo LPA. En el paso de Preparación de la siguiente fase de estrategia, retira ese marcador. Ten en cuenta que el atributo LPA de un agente solo cambia mientras se encuentre a 3\" o menos de ese marcador. Si se mueve a más de 3\" de ese marcador, su atributo LPA ya no se ve modificador por esta regla.",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Abril 2026",
      ee: [
        {
          s: "Agente ojeador, acción ojear",
          t: "Cambiar la parte relevante de la tercera frase del efecto a: “Hasta el final del punto de inflexión, siempre que un agente KORPS DE LA MUERTE amigo a 3\" o menos de este agente dispare contra ese agente enemigo, […]”",
        },
        {
          s: "Agente matón, regla matón",
          t: "Añade este texto al final: “Si esta agente queda incapacitada durante una acción de Combatir, puedes golpear al agente enemigo en esa secuencia con uno de tus éxitos sin resolver antes de que sea retirada de la zona de aniquilación”.",
        },
        {
          s: "Agente médico, regla ¡sanitario!",
          t: "Cambiar a: “La primera vez durante cada punto de inflexión que otro agente KORPS DE LA MUERTE amigo vaya a resultar incapacitado mientras era visible para este agente y estaba a 3\" o menos de él, puedes usar esta regla siempre que ni este ni ese agente estén en la zona de control de algún agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le queda 1 herida y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede entonces realizar inmediatamente una acción libre de Correr, pero debe terminar ese movimiento en la zona de control de este agente. Resta 1 a los atributos LPA de este y de ese agente hasta el final de sus próximas activaciones respectivamente, y si esta regla fue usada durante la activación de ese agente amigo, esa activación termina. No puedes usar esta regla si este agente resulta incapacitado, o si es una acción de Disparar y este agente iba a ser el blanco primario o secundario”.",
        },
        {
          s: "Agente zapador, regla de arma detonar",
          t: "Añade este texto al final del párrafo: “En una zona de aniquilación que use las reglas de combate cerrado (p. ej., Zona de aniquilación: Mundo Necrópolis), esta arma tiene la regla de armas Letal 5+”.",
        },
        { s: "Agente vigía.", t: "Añadida la regla adicional “¡Abajo con él”" },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Ardides de tiroteo, expiación en la muerte",
          t: "Cambia la parte relevante de la segunda frase por “[…] puede realizar inmediatamente una acción libre con él y puedes cambiar su orden para ello”. Cambia la última frase a: “Recuerda que el agente amigo está lesionado durante toda esa acción.”",
        },
        {
          s: "Reglas de facción, órdenes de guardia",
          t: "Cambia las órdenes correspondientes por: “¡Apunten!: Las armas a distancia de los agentes que hayan recibido esta orden (salvo barrera de mortero y detonador remoto) tienen la regla de armas Incesante”. “¡Fijen bayonetas!: Las armas de combate de los agentes que hayan recibido esta orden tienen la regla de armas Incesante.” “Atrincherarse: Siempre que un agente dispare contra un agente amigo que haya recibido esta orden, si puedes guardar alguna salvación por cobertura, puedes repetir todos los dados de defensa que hayan obtenido el mismo resultado a tu elección (p.ej. todos los resultados de 2)”.",
        },
        {
          s: "Ardides de estrategia, tácticas de asedio",
          t: "Cambiar a: “Las armas a distancia de los agentes KORPS DE LA MUERTE amigos tienen las reglas de arma Saturación y Certera 1”.",
        },
        {
          s: "Ardides de estrategia, ¡acabad con ellos!",
          t: "Cambiar a: “Las armas de combate de los agentes KORPS DE LA MUERTE amigos tienen la regla de armas Certera 1. Siempre que un agente KORPS DE LA MUERTE amigo esté combatiendo completamente dentro de tu territorio, o cuando esté contraaatacando, sus armas de combate tienen la regla de arma Severa”.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Seguridad", "Buscar y destruir"],
    required: [
      {
        type: "VIGÍA",
        count: 1,
        loadouts: [
          { label: "Bólter; bayoneta", w: [{ n: "Bólter" }, { n: "Bayoneta" }] },
          { label: "Pistola bólter; espada sierra", w: [{ n: "Pistola bólter" }, { n: "Espada sierra" }] },
          { label: "Pistola bólter; arma de energía", w: [{ n: "Pistola bólter" }, { n: "Arma de energía" }] },
          { label: "Pistola de plasma; espada sierra", w: [{ n: "Pistola de plasma" }, { n: "Espada sierra" }] },
          { label: "Pistola de plasma; arma de energía", w: [{ n: "Pistola de plasma" }, { n: "Arma de energía" }] },
          { label: "Pistola láser reliquia; espada sierra", w: [{ n: "Pistola láser reliquia" }, { n: "Espada sierra" }] },
          { label: "Pistola láser reliquia; arma de energía", w: [{ n: "Pistola láser reliquia" }, { n: "Arma de energía" }] },
        ],
      },
    ],
    pool: {
      slots: 13,
      note: "4 Soldados obligatorios + 9 agentes de la lista. Salvo Soldados, cada agente solo una vez. Hasta cuatro veces, en lugar de uno de esos Soldados, puedes elegir un ardid KORPS DE LA MUERTE que te costará 0PM durante la batalla.",
      entries: [
        { type: "SOLDADO", max: null },
        { type: "ARDID_0PM", max: 4, note: "Sustituye a uno de los 4 Soldados obligatorios. Elige qué ardid pasa a costar 0PM." },
        { type: "MATÓN", max: 1 },
        {
          type: "SÓLIDO",
          max: 1,
          loadouts: [
            { label: "Bólter; bayoneta", w: [{ n: "Bólter" }, { n: "Bayoneta" }] },
            { label: "Rifle láser; bayoneta", w: [{ n: "Rifle láser" }, { n: "Bayoneta" }] },
            { label: "Pistola bólter; espada sierra", w: [{ n: "Pistola bólter" }, { n: "Espada sierra" }] },
            { label: "Pistola láser reliquia; espada sierra", w: [{ n: "Pistola láser reliquia" }, { n: "Espada sierra" }] },
          ],
        },
        { type: "TIRADOR", max: 1, key: "tirador-lanzallamas", label: "Tirador · lanzallamas" },
        { type: "TIRADOR", max: 1, key: "tirador-lanzagranadas", label: "Tirador · lanzagranadas" },
        { type: "TIRADOR", max: 1, key: "tirador-fusion", label: "Tirador · rifle de fusión" },
        { type: "TIRADOR", max: 1, key: "tirador-plasma", label: "Tirador · rifle de plasma" },
        { type: "MÉDICO", max: 1 },
        { type: "ZAPADOR", max: 1 },
        { type: "FRANCOTIRADOR", max: 1 },
        { type: "OJEADOR", max: 1 },
        { type: "VETERANO", max: 1 },
        { type: "VOCOOPERADOR", max: 1 },
        { type: "FANÁTICO", max: 1 },
      ],
    },
    constraints: [
      {
        types: ["SOLDADO", "ARDID_0PM"],
        min: 4,
        label: "Mín. 4 Soldados",
        msg: "Necesitas al menos 4 Soldados (o ardides 0PM que los sustituyan).",
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
