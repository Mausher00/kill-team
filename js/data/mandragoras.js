// ============================================================
//  data/mandragoras.js — Mandrágoras
//  Generado desde el PDF oficial: Mandrakes (ene. 2026)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['mandragoras'] = {
  id: "mandragoras",
  name: "Mandrágoras",
  subfaction: "Drukhari",
  icon: "🌑",
  img: "imagenes/mandragoras.webp",
  desc: "Asesinos de sombra que se deslizan entre la realidad y el Velo para emboscar a sus presas.",
  tags: ["Aeldari", "Infiltración", "Reconocimiento"],
  version: "Enero 2026",
  source: "Mandrakes (ene. 2026)",
  ops: [
    {
      id: "nocturna",
      name: "Mandrágora Nocturna",
      type: "NOCTURNA",
      img: "imagenes/mandragoras-img/mandragora-nocturna.webp",
      s: { lpa: 2, mov: "7\"", salv: "5+", h: 9 },
      kw: ["MANDRÁGORAS", "AELDARI", "DRUKHARI", "LÍDER", "NOCTURNA"],
      w: [{ n: "Rayo impío", a: 4, i: "3+", d: "3/4", r: ["Rompealmas*"] }, { n: "Marchitador", a: 5, i: "3+", d: "4/6", r: ["Choque", "Letal 5+"] }],
      ru: [
        {
          n: "Susurros atormentadores",
          t: "Cada vez que un oponente vaya a activar un agente enemigo a 6\" o menos de esta agente, puedes tirar 1D6 (no puedes hacerlo si ya has interrumpido la activación de ese agente con esta regla o la regla adicional Persecución obsesiva del agente FAUCES FÚNEBRES durante este punto de inflexión): si el resultado es mayor que el atributo LPA de ese agente enemigo, no puede activarlo durante esta activación. Si no hay otros agentes enemigos elegibles para ser activados, esta regla no tiene efecto.",
        },
        {
          n: "Oubliex",
          t: "Cada vez que este agente es apostado, o si esta agente incapacita a un agente enemigo con su marchitador, se activa su oubliex. Si su oubliex está activo y un dado de ataque inflige daño a este agente, puedes tirar 1D6: con 5+, ignora el daño infligido por ese dado de ataque y su oubliex se desactiva.",
        },
      ],
    },
    {
      id: "abisal",
      name: "Mandrágora Abisal",
      type: "ABISAL",
      img: "imagenes/mandragoras-img/mandragora-abisal.webp",
      s: { lpa: 2, mov: "7\"", salv: "5+", h: 8 },
      kw: ["MANDRÁGORAS", "AELDARI", "DRUKHARI", "ABISAL"],
      w: [
        { n: "Descarga impía (estallido)", a: 5, i: "3+", d: "3/4", r: ["Área 2\"", "Rompealmas*"] },
        { n: "Descarga impía (quemadura)", a: 5, i: "3+", d: "3/4", r: ["Letal 5+", "Rompealmas*"] },
        { n: "Filo trémulo", a: 4, i: "3+", d: "4/5", r: ["Letal 5+"] },
      ],
      ru: [
        {
          n: "Fuegoimpío",
          t: "Cuando una agente MANDRÁGORAS amiga dispare a un agente enemigo que tenga una de tus fichas de Fuegoimpío, suma 1 a los dos atributos Daño de las armas a distancia de esa agente amiga, y además tienen la regla de arma Saturación. Cuando un agente dispare a una agente MANDRÁGORAS amiga que tenga una de tus fichas de Fuegoimpío, resta 1 (hasta un mínimo de 1) a los dos atributos Daño de las armas a distancia de ese agente.",
        },
        {
          n: "Envolver en Fuegoimpío (1PA)",
          t: "Elige un agente visible para esta agente que no tenga una de tus fichas de Fuegoimpío. Hasta el inicio de la siguiente activación de esta agente, hasta que quede incapacitada o hasta que efectúe esta acción de nuevo (lo que ocurra antes), el agente elegido obtiene una de tus fichas de Fuegoimpío. Esta agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "catadora-de-carnes",
      name: "Mandrágora Catadora de Carnes",
      type: "CATADORA DE CARNES",
      img: "imagenes/mandragoras-img/mandragora-catadora-de-carnes.webp",
      s: { lpa: 2, mov: "7\"", salv: "5+", h: 8 },
      kw: ["MANDRÁGORAS", "AELDARI", "DRUKHARI", "CATADORA DE CARNES"],
      w: [{ n: "Rayo impío", a: 4, i: "3+", d: "3/4", r: ["Rompealmas*"] }, { n: "Filo impío", a: 4, i: "3+", d: "5/6", r: ["Brutal", "Letal 5+"] }],
      ru: [
        {
          n: "Cosecha de almas",
          t: "Cada vez que un agente enemigo quede incapacitado como resultado de la regla Cobrarse una parte o el filo impío de esta agente, obtienes 1 punto de Cosecha de almas, o 2 si ese agente enemigo tenía un atributo LPA de 3 o más. Cada vez que una agente MANDRÁGORAS amiga sea activada, puedes gastar 1 de tus puntos de Cosecha de almas para o bien sumar 1 a su atributo LPA hasta el final de la batalla, o bien curarle 2D3 heridas perdidas. Ten en cuenta que puedes gastar tus puntos de Cosecha de almas aunque esta agente esté incapacitada.",
        },
        {
          n: "Cobrarse una parte",
          t: "Cada vez que un agente enemigo efectúe una acción de Retroceder mientras está en la zona de control de esta agente, puedes usar esta regla. Si lo haces, inflige 2D3 daños a ese agente enemigo antes de que se mueva.",
        },
      ],
    },
    {
      id: "fauces-funebres",
      name: "Mandrágora Fauces Fúnebres",
      type: "FAUCES FÚNEBRES",
      img: "imagenes/mandragoras-img/mandragora-fauces-funebres.webp",
      s: { lpa: 2, mov: "7\"", salv: "5+", h: 8 },
      kw: ["MANDRÁGORAS", "AELDARI", "DRUKHARI", "FAUCES FÚNEBRES"],
      w: [
        { n: "Rayo impío", a: 4, i: "3+", d: "3/4", r: ["Rompealmas*"] },
        { n: "Grito horripilante", a: 5, i: "2+", d: "2/2", r: ["Alcance 6\"", "Aturdidora", "Buscadora (Ligero)", "Devastadora 2", "Rompealmas*"] },
        { n: "Filo trémulo", a: 4, i: "3+", d: "4/5", r: ["Letal 5+"] },
      ],
      ru: [
        {
          n: "Persecución obsesiva",
          t: "GAMBITO ESTRATÉGICO. Elige un agente enemigo. Hasta el paso de preparación de la siguiente fase de estrategia, obtiene tu ficha de Persecución obsesiva. La siguiente vez que tu oponente vaya a activar un agente enemigo con tu ficha de Persecución obsesiva, si este agente está apostado, puedes activar este agente primero (no puedes hacerlo si también tiraste para evitar la activación de ese agente con la regla adicional Susurros atormentadores del agente NOCTURNA durante este punto de inflexión). Si lo haces, durante esa activación, esta agente debe combatir o dispara contra ese agente enemigo, y hasta que lo haga no puede combatir o disparar contra ningún otro agente (si no le es posible hacerlo, la activación de esta agente se cancela). Después de completar la activación de esta agente, tu oponente activa ese agente enemigo (si es posible), o activa un agente enemigo diferente si no puede.",
        },
        {
          n: "Proyección Pareidólica (1PA)",
          t: "Elige un agente enemigo que sea un blanco válido para esta agente o que esté ENSOMBRECIDO. Hasta el inicio de la siguiente activación de esta agente, hasta que quede incapacitada o hasta que efectúe esta acción de nuevo (lo que ocurra antes), empeora en 1 el atributo Imp de las armas de ese agente enemigo y resta 2\" a su atributo Movimiento (esto no se acumula con las lesiones). Esta agente no puede realizar esta acción si está en la zona de control de un agente enemigo, a menos que el único agente enemigo en cuya zona de control se encuentre sea el elegido para esta acción.",
          isAct: true,
        },
      ],
    },
    {
      id: "tejesombras",
      name: "Mandrágora Tejesombras",
      type: "TEJESOMBRAS",
      img: "imagenes/mandragoras-img/mandragora-tejesombras.webp",
      s: { lpa: 2, mov: "7\"", salv: "5+", h: 8 },
      kw: ["MANDRÁGORAS", "AELDARI", "DRUKHARI", "TEJESOMBRAS"],
      w: [{ n: "Rayo impío", a: 4, i: "3+", d: "3/4", r: ["Rompealmas*"] }, { n: "Filo trémulo", a: 4, i: "3+", d: "4/5", r: ["Letal 5+"] }],
      ru: [
        {
          n: "Portal sombrío",
          t: "Cuando esta agente realiza una acción de Reposicionarse usando un PASO SOMBRÍO (ver regla de facción), puedes usar esta regla. Si lo haces, retira tus marcadores de Portal sombrío de la zona de aniquilación (de haberlos), y a continuación coloca uno de tus marcadores de Portal sombrío en la zona de control de esta agente antes de que sea retirada y otro en su zona de control después de que sea desplegada. Cada agente MANDRÁGORAS amiga puede usar un PASO SOMBRÍO cada punto de inflexión (con prioridad sobre una vez por turno de inflexión) si uno de tus marcadores de Portal sombrío está en la zona de control de esa agente cuando es retirada y el otro lo está cuando es desplegada. Ten en cuenta que las agentes amigas pueden hacer tal cosa aunque esta agente haya quedado incapacitada, y hacerlo no evita que otra agente use un PASO SOMBRÍO de forma normal.",
        },
        {
          n: "Tejer las Tinieblas (1PA)",
          t: "Retira tu marcador de Tejer las tinieblas de la zona de aniquilación (de haberlo). A continuación, coloca tu marcador de Tejer las tinieblas visible para esta agente, o en un terreno Aventajado de un elemento de terreno visible para esta agente. Ese marcador crea un área de humo con el mismo tamaño y efectos que una granada de humo, excepto que no la retiras en el siguiente punto de inflexión. Si esta agente queda incapacitada, retira tu marcador de Tejer las tinieblas de la zona de aniquilación. Esta agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "combatiente",
      name: "Mandrágora Combatiente",
      type: "COMBATIENTE",
      img: "imagenes/mandragoras-img/mandragora-combatiente.webp",
      s: { lpa: 2, mov: "7\"", salv: "5+", h: 8 },
      kw: ["MANDRÁGORAS", "AELDARI", "DRUKHARI", "COMBATIENTE"],
      w: [{ n: "Rayo impío", a: 4, i: "3+", d: "3/4", r: ["Rompealmas*"] }, { n: "Filo trémulo", a: 4, i: "3+", d: "4/5", r: ["Letal 5+"] }],
      ru: [{ n: "Guerrera sombría", t: "Cuando esta agente esté ENSOMBRECIDA, suma 1 al atributo Daño crítico de su filo trémulo." }],
    },
  ],
  fr: {
    name: "Paso sombrío",
    type: "REGLA DE FACCIÓN",
    text: "Una vez por punto de inflexión, una agente MANDRÁGORAS amiga puede usar un PASO SOMBRÍO cuando realice una acción de Reposicionarse. Si lo hace, no la muevas. En su lugar, retírala de la zona de aniquilación y vuelve a desplegarla ENSOMBRECIDA. Cuando vuelvas a desplegarla, no puede:\n• Estar en la zona de control de ningún agente enemigo.\n• Ser un blanco válido para un agente enemigo.\n• Realizar acciones de Disparar o Combatir hasta el inicio del siguiente punto de inflexión.",
    orders: [
      {
        n: "Entes umbríos",
        t: "Cada vez que un agente dispare contra una agente MANDRÁGORAS amiga, ignora la regla de arma Penetración. Cuando una agente MANDRÁGORAS amiga esté ENSOMBRECIDA, mejora en 1 su atributo Salvación.",
      },
      {
        n: "Rompealmas",
        t: "Algunas armas en las reglas de este comando tienen la regla de arma Rompealmas, que se explica a continuación. *Rompealmas: Los dados de defensa con éxito se determinan de forma diferente. Cada resultado igual o menor al atributo LPA del blanco es un éxito y se guarda. Cada resultado mayor que el atributo LPA del blanco es un fallo y se descarta. Todo resultado de 1 es siempre un éxito crítico. Los demás éxitos son éxitos normales. Todo resultado de 6 es siempre un fallo. Nota de diseño: Muchas de las reglas de este comando hacen referencia al atributo LPA de un agente enemigo. Este sería el atributo LPA en el momento en que tiene efecto la regla (es decir, incluyendo cambios).",
      },
      {
        n: "Ensombrecido",
        t: "Una agente está ENSOMBRECIDA si se cumple alguna de las siguientes condiciones:\n• Está a 1\" o menos de terreno Pesado que no está por debajo de ella.\n• Cualquier parte de su peana está debajo de un terreno Aventajado.\n• Hay un marcador de Portal sombrío dentro de su zona de control (ver agente TEJESOMBRAS).",
      },
    ],
  },
  frs: [
    {
      name: "Paso sombrío",
      text: "Una vez por punto de inflexión, una agente MANDRÁGORAS amiga puede usar un PASO SOMBRÍO cuando realice una acción de Reposicionarse. Si lo hace, no la muevas. En su lugar, retírala de la zona de aniquilación y vuelve a desplegarla ENSOMBRECIDA. Cuando vuelvas a desplegarla, no puede:\n• Estar en la zona de control de ningún agente enemigo.\n• Ser un blanco válido para un agente enemigo.\n• Realizar acciones de Disparar o Combatir hasta el inicio del siguiente punto de inflexión.",
      subs: [],
    },
    {
      name: "Entes umbríos",
      text: "Cada vez que un agente dispare contra una agente MANDRÁGORAS amiga, ignora la regla de arma Penetración. Cuando una agente MANDRÁGORAS amiga esté ENSOMBRECIDA, mejora en 1 su atributo Salvación.",
      subs: [],
    },
    {
      name: "Rompealmas",
      text: "Algunas armas en las reglas de este comando tienen la regla de arma Rompealmas, que se explica a continuación. *Rompealmas: Los dados de defensa con éxito se determinan de forma diferente. Cada resultado igual o menor al atributo LPA del blanco es un éxito y se guarda. Cada resultado mayor que el atributo LPA del blanco es un fallo y se descarta. Todo resultado de 1 es siempre un éxito crítico. Los demás éxitos son éxitos normales. Todo resultado de 6 es siempre un fallo. Nota de diseño: Muchas de las reglas de este comando hacen referencia al atributo LPA de un agente enemigo. Este sería el atributo LPA en el momento en que tiene efecto la regla (es decir, incluyendo cambios).",
      subs: [],
    },
    {
      name: "Ensombrecido",
      text: "Una agente está ENSOMBRECIDA si se cumple alguna de las siguientes condiciones:\n• Está a 1\" o menos de terreno Pesado que no está por debajo de ella.\n• Cualquier parte de su peana está debajo de un terreno Aventajado.\n• Hay un marcador de Portal sombrío dentro de su zona de control (ver agente TEJESOMBRAS).",
      subs: [],
    },
  ],
  pl: {
    s: [
      {
        n: "Horror reptante",
        t: "Tras la activación de cada agente enemigo, antes de que se active el siguiente agente, una agente MANDRÁGORAS amiga que tenga una orden de ocultarse efectuar una acción libre de Correr si empieza y termina esa acción ENSOMBRECIDA. No puedes usar este ardid durante el primer punto de inflexión, y cada agente amiga solo puede ser elegida para este ardid una vez por punto de inflexión.",
      },
      {
        n: "Mortaja de crepúsculo",
        t: "Cada vez que un agente dispara contra una agente MANDRÁGORAS amiga que esté ENSOMBRECIDA, puedes guardar uno de tus dados de defensa como éxito normal sin tirarlo (además de la salvación por cobertura, si dispones de ella).",
      },
      {
        n: "Filo en la oscuridad",
        t: "Cada agente MANDRÁGORAS amiga puede efectuar acciones de Cargar aún teniendo una orden de ocultarse si empieza o termina esa acción ENSOMBRECIDA.",
      },
      {
        n: "Pesadilla inescapable",
        t: "Cada vez que una agente MANDRÁGORAS amiga dispare, combata o contraataque, si está ENSOMBRECIDA, puedes volver a tirar uno de tus dados de ataque.",
      },
    ],
    f: [
      {
        n: "Desaparición sibilina",
        t: "Usa este ardid de tiroteo al final de la activación de cualquier agente. Elige una agente MANDRÁGORAS amiga con una orden de trabarse y que esté ENSOMBRECIDA. Cambia la orden de esa agente por ocultarse.",
      },
      {
        n: "Festín de almas",
        t: "Usa este ardid de tiroteo cuando una agente MANDRÁGORAS amiga dispare, combata o contraataque contra un agente enemigo a 6\" o menos de ella, al final del paso de resolver dados de ataque. Esa agente amiga recupera un número de heridas perdidas igual al atributo LPA del agente enemigo, multiplicado por el número de tus dados de ataque que infligieran daño durante esa secuencia. El exceso de dados de ataque se ignora (es decir, si el agente enemigo queda incapacitado antes de que se resuelvan los dados de ataque restantes). No puedes usar este ardid si esa agente MANDRÁGORAS amiga es incapacitada.",
      },
      {
        n: "No hay donde esconderse",
        t: "Usa este ardid de tiroteo durante la activación de una agente MANDRÁGORAS amiga, cuando realice una acción en la que se mueva. Hasta el final de esa activación, esa agente puede moverse a través de partes de elementos de terreno como si no estuvieran ahí, pero no puede mover más que su atributo Movimiento si es una acción de Cargar y debe terminar esos movimientos en una ubicación en la que pueda ser colocada.",
      },
      {
        n: "Mordisco de las sombras",
        t: "Usa este ardid de tiroteo cuando un agente enemigo efectúe una acción de Combatir en una activación en la que haya efectuado una acción de Cargar, y elija combatir contra una agente MANDRÁGORAS amiga ENSOMBRECIDA. En el paso de resolver dados de ataque de esa secuencia, tú resuelves el primer dado de ataque (es decir, el defensor antes que el atacante).",
      },
    ],
  },
  eq: [
    {
      n: "Cepo de cadena",
      t: "Cada vez que un agente enemigo vaya a efectuar una acción de Retroceder estando en la zona de control de una agente MANDRÁGORAS amiga, si no hay otros agentes enemigos dentro de la zona de control de esa agente amiga, puedes usar esta regla. Si lo haces, tira dos D6, o 1D6 si ese agente enemigo tiene un atributo Heridas mayor que esa agente amiga. Si cualquier resultado es 4+, dicho agente enemigo no puede realizar esa acción durante esta activación o reacción (no se gastan PA en ella), y no puedes volver a usar esta regla durante este punto de inflexión.",
    },
    {
      n: "Glifo sombrío",
      t: "Una vez por punto de inflexión, cuando una agente MANDRÁGORAS amiga se active estando ENSOMBRECIDA, puedes usar esta regla. Si lo haces, hasta el inicio de la siguiente activación de esa agente, mientras tenga una orden de ocultarse y esté a cubierto, no podrá ser elegida como blanco válido. Esto tiene prioridad sobre todas las demás reglas (p. ej., terreno Aventajado).",
    },
    {
      n: "Gema de alma",
      t: "Una vez por punto de inflexión, cuando una agente MANDRÁGORAS amiga realice una acción de Disparar y elijas un rayo impío, puedes usar esta regla. Si lo haces, hasta el final de esa acción, esa arma tiene la regla de arma Área 1\".",
    },
    {
      n: "Dardos de hueso",
      t: "Una vez por punto de inflexión, una agente MANDRÁGORAS amiga puede usar la siguiente arma a distancia:\nREGLAS DE ARMAS\nAlcance 6\", Desgarradora, Silenciosa\n▸ Dardo de hueso — ATQ 4 · IMP 3+ · DAÑO 2/4",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Enero 2026",
      ee: [
        {
          s: "Ardides de tiroteo, no hay donde esconderse",
          t: "Cambia la parte relevante de la segunda frase a: “[…] como si no estuvieran ahí, pero no puede mover más que su atributo Movimiento si es una acción de Cargar y debe terminar esos movimientos en una ubicación en la que pueda ser colocada”.",
        },
        {
          s: "Agente nocturna, regla susurros atormentadores",
          t: "Cambia la parte relevante de la primera frase a: “[…] puedes tirar 1D6 (no puedes hacerlo si ya has interrumpido la activación de ese agente con esta regla o la regla adicional Persecución obsesiva del agente FAUCES FÚNEBRES durante este punto de inflexión): [...]”",
        },
        {
          s: "Agente fauces fúnebres, acción proyección pareidólica",
          t: "Borra la parte relevante de la última frase del efecto: “[…] (esto no se acumula con las lesiones); además, no se puede sumar nada al atributo LPA de ese agente enemigo (retira todos los cambios positivos que tenga su atributo LPA)”.",
        },
        {
          s: "Equipo de facción, cepo de cadena",
          t: "Cambia la última frase a: “Si cualquier resultado es un 4+, dicho agente enemigo no puede realizar esa acción durante esta activación o reacción (no se gastan PA en ella), y no puedes volver a usar esta regla durante este punto de inflexión”.",
        },
        {
          s: "Reglas de facción, paso sombrío",
          t: "Cambia la primera frase a: “Una vez por punto de inflexión, 1 agente MANDRÁGORA amiga ENSOMBRECIDA puede usar un PASO SOMBRÍO cuando realice la acción de Reposicionarse.”",
        },
        {
          s: "Equipo de facción, glifo sombrío",
          t: "Cambia la segunda frase a: “Si lo haces, hasta el inicio de su siguiente activación, mientras esta agente tenga una orden de Ocultarse y esté tras cobertura, no puede ser elegida como blanco válido, teniendo esto prioridad sobre todas las demás reglas (p. ej. Buscadora, Terreno aventajado) salvo estar a 2\" o menos.”",
        },
        {
          s: "Agente nocturno, regla susurros atormentadores",
          t: "Cambia la parte relevante de la primera frase por: “[…] puedes tirar 1D6 (no puedes hacerlo si también interrumpiste la activación de ese agente con la regla adicional Persecución obsesiva del agente FAUCES FÚNEBRES durante este punto de inflexión):”’",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Agente fauces fúnebres, regla persecución obsesiva",
          t: "Cambia la cuarte frase a: “La siguiente vez que tu oponente vaya a activar un agente enemigo con tu ficha de Persecución obsesiva, si este agente está apostado, puedes activar este agente primero (no puedes hacerlo si también tiraste para evitar la activación de ese agente con la regla adicional Susurros atormentadores del agente NOCTURNO durante este punto de inflexión).” Cambia la última frase a: “Después de completar la activación de este agente, tu oponente activa ese agente enemigo (si es posible), o activa un agente enemigo diferente si no puede.”",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Infiltración", "Reconocimiento"],
    required: [{ type: "NOCTURNA", count: 1 }],
    pool: {
      slots: 8,
      note: "Salvo Combatientes, cada agente solo una vez.",
      entries: [
        { type: "ABISAL", max: 1 },
        { type: "CATADORA DE CARNES", max: 1 },
        { type: "FAUCES FÚNEBRES", max: 1 },
        { type: "TEJESOMBRAS", max: 1 },
        { type: "COMBATIENTE", max: null },
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
