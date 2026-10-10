// ============================================================
//  data/sucesores.js — Sucesores Recuperadores
//  Generado desde el PDF oficial: Hearthkyn Salvagers (abr. 2026)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['sucesores'] = {
  id: "sucesores",
  name: "Sucesores Recuperadores",
  subfaction: "Ligas de los Votann",
  icon: "⛏️",
  img: "imagenes/sucesores.png",
  desc: "Guerreros Kin especializados en recuperación de recursos en pecios espaciales y zonas hostiles.",
  tags: ["Votann", "Reconocimiento", "Seguridad"],
  version: "Abril 2026",
  source: "Hearthkyn Salvagers (abr. 2026)",
  ops: [
    {
      id: "theyn",
      name: "Theyn Sucesor",
      type: "THEYN",
      img: "imagenes/sucesores-img/theyn.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 9 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "LÍDER", "THEYN"],
      w: [
        { n: "Bláster iónico", a: 4, i: "4+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Certera 1"] },
        { n: "Pistola bólter modelo Autoch", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Certera 1"] },
        { n: "Pistola de iones", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\"", "Críticos de penetración 1"] },
        { n: "Pistola de plasma EtaCarn", a: 4, i: "4+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Rebóltver", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\""] },
        { n: "Arma de plasma", a: 4, i: "3+", d: "4/6", r: ["Letal 5+"] },
        { n: "Guantelete conmocionador", a: 4, i: "4+", d: "5/7", r: ["Brutal", "Choque"] },
      ],
      ru: [
        {
          n: "Ojo de los ancestros",
          t: "GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación. Elige un agente enemigo, o hasta dos agentes enemigos si hay tres o más agentes SUCESOR RECUPERADOR amigos incapacitados. Cada uno de esos agentes enemigos gana una de tus fichas de Agravio.",
        },
        {
          n: "Cresta de campo entrelazado",
          t: "1 vez por batalla, cuando un dado de ataque inflija Daño normal a este agente, puedes ignorar ese daño infligido.",
        },
      ],
    },
    {
      id: "bulldozer",
      name: "Sucesor Bulldôzer",
      type: "BULLDÔZER",
      img: "imagenes/sucesores-img/bulldozer.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "BULLDÔZER"],
      w: [
        { n: "Pistola bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Alcance 8\"", "Certera 1"] },
        { n: "Nudillos de conmoción", a: 4, i: "3+", d: "4/4", r: ["Choque", "Incesante", "Letal 5+"] },
      ],
      ru: [
        {
          n: "Peleador",
          t: "Cuando este agente combata o contraataque:\n• Los agentes enemigos no pueden asistir.\n• Si este agente resulta incapacitado, durante esa secuencia puedes golpear al agente enemigo con uno de tus éxitos sin resolver, antes de que sea retirado de la zona de aniquilación.\n• El Daño normal de 4 o más le inflige 1 daño menos.",
        },
        {
          n: "Nudillazo Brutal (1PA)",
          t: "Elige un agente enemigo en la zona de control de este agente. Puedes mover a ese agente enemigo hasta 3\" a una localización donde pueda ser colocado. A continuación inflígele 1D3+1 daños (incluso si no lo has movido); Si el resultado del D3 es un 3, hasta el final de su siguiente activación resta también 1 al atributo LPA del agente enemigo. A continuación este agente puede realizar una acción libre de Cargar (incluso si ya ha realizado la acción de Cargar durante esa activación), pero no puede moverse más de 3\" durante esa acción. Este agente no puede realizar esta acción a menos que haya un agente enemigo en su zona de control.",
          isAct: true,
        },
      ],
    },
    {
      id: "medico-de-campo",
      name: "Sucesor Médico de Campo",
      type: "MÉDICO DE CAMPO",
      img: "imagenes/sucesores-img/medico.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "MÉDICO", "MÉDICO DE CAMPO"],
      w: [{ n: "Rebóltver", a: 4, i: "4+", d: "3/5", r: ["Alcance 8\""] }, { n: "Cuchillo de plasma", a: 4, i: "4+", d: "3/5", r: ["Letal 5+"] }],
      ru: [
        {
          n: "¡Sanitario!",
          t: "La primera vez durante cada punto de inflexión que otro agente SUCESOR RECUPERADOR amigo vaya a resultar incapacitado mientras es visible para este agente y se encuentra a 3\" o menos de él, puedes usar esta regla, siempre y cuando ni este ni el otro agente se encuentren en la zona de control de un agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le queda 1 herida, y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, puede realizar una acción libre de Correr, pero debe terminarla dentro de la zona de control de este agente. Resta 1 a los atributos LPA de este y ese agente hasta el final de sus respectivas siguientes activaciones, y si esta regla se usa durante la activación de ese agente amigo, dicha activación finaliza. No puedes usar esta regla si este agente resulta incapacitado, o si es una acción de Disparar y este agente iba a ser el blanco primario o secundario.",
        },
        {
          n: "Botiquín (1PA)",
          t: "Elige un agente SUCESOR RECUPERADOR amigo en la zona de control de este agente para que recupere hasta 2D3 heridas perdidas. No puede ser un agente con el que se haya usado la regla ¡Sanitario! durante este punto de inflexión. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "granadero",
      name: "Sucesor Granadero",
      type: "GRANADERO",
      img: "imagenes/sucesores-img/granadero.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "GRANADERO"],
      w: [
        { n: "Pistola bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Alcance 8\"", "Certera 1"] },
        {
          n: "Carga C8 HX",
          a: 4,
          i: "3+",
          d: "4/6",
          r: ["Alcance 4\"", "Área 1\"", "Limitada 1", "Penetración 1", "Pesada (solo Reposicionarse)", "Saturación"],
        },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Granadero",
          t: "Este agente puede usar granadas frag, perforantes, de humo y aturdidoras (ver equipo universal). Hacer esto no cuenta de cara a los usos limitados que tengas (es decir, si también seleccionas esas granadas como equipo para otros agentes). Cuando este agente usa una granada frag o perforante, mejora en 1 el atributo Impactar de esa arma. GRANADA ESPECIAL VÂYR-3 1PA Coloca uno de tus marcadores de Granada especial a 6\" o menos de este agente. Debe ser visible para este agente, o encontrarse en el terreno aventajado de un elemento de terreno que sea visible para este agente. Cuando un agente se encuentre a 3\" o menos de ese marcador de Granada especial, el jugador que controla a dicho agente debe gastar 1PA adicional para que ese agente realice la acción de Recoger marcador y las acciones de misión. En el paso de Preparación de la siguiente fase de estrategia, tira 1D3. Retira ese marcador de Granada especial tras haber completado un número de activaciones igual al resultado de la tirada, o al final del punto de inflexión (lo que ocurra antes). Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
        },
      ],
    },
    {
      id: "tirador",
      name: "Sucesor Tirador",
      type: "TIRADOR",
      img: "imagenes/sucesores-img/tirador.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "TIRADOR"],
      w: [
        { n: "Cañón rotativo LasMAX (concentrado)", a: 5, i: "4+", d: "4/5", r: ["Incesante", "Pesada (solo Reposicionarse)", "Saturación"] },
        {
          n: "Cañón rotativo LasMAX (barrido)",
          a: 4,
          i: "4+",
          d: "4/5",
          r: ["Incesante", "Pesada (solo Reposicionarse)", "Saturación", "Ráfaga 1\""],
        },
        { n: "Fusil lineal magnético", a: 4, i: "4+", d: "4/2", r: ["Devastadora 3", "Pesada (solo Correr)", "Penetración 2"] },
        { n: "Haz de plasma EtaCarn", a: 4, i: "4+", d: "5/6", r: ["Penetración 1", "Haz*"] },
        { n: "Lanzamisiles L7 (área)", a: 4, i: "4+", d: "3/5", r: ["Área 2\""] },
        { n: "Lanzamisiles L7 (concentrado)", a: 4, i: "4+", d: "5/6", r: ["Penetración 1"] },
        { n: "Rifle automático LasMAX", a: 4, i: "4+", d: "3/5", r: ["Incesante", "Desgarradora"] },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Haz",
          t: "Cuando este agente dispare con esta arma, cada éxito crítico guardado inflige inmediatamente 1D3 daños a cada otro agente que se encuentre a lo largo de una (y solo una) línea de haz (tira por separado por cada agente), pero el blanco no resulta afectado. Un agente se encuentra a lo largo de una línea de haz si se puede trazar una línea desde este agente hasta la peana de dicho agente, atravesando la peana del blanco original pero sin atravesar terreno Pesado. En este ejemplo, el agente A es el blanco. Los agentes B y C se encuentran a lo largo de la línea del haz, pero el agente D no.",
        },
      ],
    },
    {
      id: "propulsor-de-salto",
      name: "Sucesor con Propulsor de Salto",
      type: "PROPULSOR DE SALTO",
      img: "imagenes/sucesores-img/propulsor.jpg",
      s: { lpa: 2, mov: "8\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "SUCESOR CON PROPULSOR DE SALTO"],
      w: [
        { n: "Pistola bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Alcance 8\"", "Certera 1"] },
        { n: "Arma de plasma", a: 4, i: "3+", d: "4/6", r: ["Letal 5+", "Impacto brutal*"] },
      ],
      ru: [
        {
          n: "Propulsor de salto",
          t: "Cuando este agente realice una acción en la que se mueva, puede VOLAR. Si lo hace, no lo muevas. En lugar de eso, retíralo de la zona de aniquilación y vuelve a colocarlo completamente a una distancia de su localización original igual o menor a su atributo Movimiento (o a 3\" o menos si era un movimiento de Correr) en horizontal (en una zona de aniquilación que use Combate cerrado, como Horcacaída, esta distancia no se puede medir sobre o a través de terreno Muro, y ese agente no puede desplegarse al otro lado de un punto de acceso, es decir, no puede volar a través de una escotilla). Ten en cuenta que no gana distancia adicional al realizar la acción Cargar. Debe desplegarse en una localización en la que pueda ser colocado y, a menos que la acción sea Cargar, no puede desplegarse en la zona de control de un agente enemigo.",
        },
        {
          n: "Impacto brutal",
          t: "Cuando este agente combata con esta arma, si ha realizado la acción de Cargar durante la activación, esta arma tiene la regla de armas Brutal.",
        },
      ],
    },
    {
      id: "radiovinculado",
      name: "Sucesor Radiovinculado",
      type: "RADIOVINCULADO",
      img: "imagenes/sucesores-img/radiovinculado.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "RADIOVINCULADO"],
      w: [
        { n: "Bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Certera 1"] },
        { n: "Bláster iónico", a: 4, i: "4+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Señal (1PA)",
          t: "APOYO. Elige un agente SUCESOR RECUPERADOR amigo distinto que esté en la zona de aniquilación, a 6\" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
          isAct: true,
        },
        {
          n: "Interferir Sistemas (1PA)",
          t: "Elige un agente enemigo que sea un blanco válido para este agente y que no tenga una de tus fichas de Interferir sistemas; dicho agente enemigo gana una. Hasta el final de la batalla, mientras un agente enemigo tenga una de tus fichas de Interferir sistemas, no podrá activarse hasta que cada agente enemigo sin una de estas fichas haya quedado usado. Cuando un agente enemigo que tenga una de tus fichas de Interferir sistemas sea activado, retírale esa ficha. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "analista",
      name: "Sucesor Anâlista",
      type: "ANÂLISTA",
      img: "imagenes/sucesores-img/analista.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "ANÂLISTA"],
      w: [
        { n: "Bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Certera 1"] },
        { n: "Bláster iónico", a: 4, i: "4+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Táctico",
          t: "GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación. Coloca o bien tu marcador de Ataque o bien tu marcador de Defensa en la zona de aniquilación. Cuando un agente SUCESOR RECUPERADOR amigo dispare, combata o contraataque contra un agente enemigo que se encuentre a 3\" o menos de tu marcador de Ataque, las armas de ese agente amigo tienen la regla de arma Equilibrada. Cuando un agente enemigo dispare contra un agente SUCESOR RECUPERADOR amigo que se encuentre a 3\" o menos de tu marcador de Defensa, puedes repetir la tirada de uno de tus dados de Defensa. En el paso de Preparación de la siguiente fase de estrategia, retira ese marcador.",
        },
        {
          n: "Evaluación Apresurada (1PA)",
          t: "Si tu marcador de Ataque o de Defensa está en la zona de aniquilación, retíralo. Coloca tu marcador de Ataque o de Defensa en la zona de aniquilación. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "localizador",
      name: "Sucesor Locâlizador",
      type: "LOCÂLIZADOR",
      img: "imagenes/sucesores-img/localizador.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "LOCÂLIZADOR"],
      w: [
        { n: "Bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Certera 1"] },
        { n: "Bláster iónico", a: 4, i: "4+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Avistar (1PA)",
          t: "APOYO. Elige un agente enemigo visible para este agente. Hasta el final del punto de inflexión, cuando un agente SUCESOR RECUPERADOR amigo a 3\" o menos de este agente dispare contra el agente enemigo elegido, puedes usar este efecto.",
          isAct: true,
        },
        {
          n: "Si lo haces",
          t: "• Las armas a distancia de este agente amigo tienen la regla de armas Buscadora (ligera).\n• Ese agente enemigo no puede estar ofuscado. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
        },
        {
          n: "Escaneo Panespectral (1PA)",
          t: "Coloca tu marcador de Escaneo panespectral en la zona de aniquilación. Cuando un agente SUCESOR RECUPERADOR amigo dispare contra un agente enemigo a 3\" o menos de ese marcador, las armas a distancia de ese agente amigo tienen la regla de armas Saturación. En el paso de Preparación de la siguiente fase de estrategia, retira ese marcador. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "sherpa",
      name: "Sucesor Sherpa",
      type: "SHERPA",
      img: "imagenes/sucesores-img/sherpa.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "SHERPA"],
      w: [
        { n: "Bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Certera 1"] },
        { n: "Bláster iónico", a: 4, i: "4+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Buenos suministros",
          t: "Puedes seleccionar una opción de equipo adicional, y en el Paso de preparación de a primera fase de estrategia, obtienes 1 PM adicional.",
        },
        { n: "¡Yo me encargo!", t: "Una vez por activación de este agente, puede realizar una acción de misión por 1 PA menos." },
      ],
    },
    {
      id: "combatiente",
      name: "Sucesor Combatiente",
      type: "COMBATIENTE",
      img: "imagenes/sucesores-img/combatiente.jpg",
      s: { lpa: 2, mov: "5\"", salv: "3+", h: 8 },
      kw: ["SUCESOR RECUPERADOR", "LIGAS DE LOS VOTANN", "COMBATIENTE"],
      w: [
        { n: "Bólter modelo Autoch", a: 4, i: "4+", d: "3/4", r: ["Certera 1"] },
        { n: "Bláster iónico", a: 4, i: "4+", d: "3/4", r: ["Críticos de penetración 1"] },
        { n: "Puños", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Asegurar restos",
          t: "Siempre que un agente enemigo dispare, combata o contraataque contra este agente, si este agente disputa un marcador de objetivo o uno de tus marcadores de misión, en el paso de Resolver dados de ataque puedes restar 1 al daño infligido a ese agente debido a uno de los éxitos.",
        },
      ],
    },
  ],
  fr: {
    name: "Agravio",
    type: "REGLA DE FACCIÓN",
    text: "Cuando un agente enemigo incapacite a un agente SUCESOR RECUPERADOR amigo, dicho agente enemigo gana una de tus fichas de Agravio para esa batalla. Cuando un agente SUCESOR RECUPERADOR amigo dispare, combata o contraataque contra un agente enemigo, por cada una de tus fichas de Agravio que tenga ese agente enemigo, puedes guardar uno de tus éxitos normales como éxito crítico en su lugar (incluyendo cualquier éxito normal ya guardado debido a la regla de arma Precisión). Ten en cuenta que las fichas de Agravio no se retiran cuando haces esto.",
    orders: [],
  },
  frs: [
    {
      name: "Agravio",
      text: "Cuando un agente enemigo incapacite a un agente SUCESOR RECUPERADOR amigo, dicho agente enemigo gana una de tus fichas de Agravio para esa batalla. Cuando un agente SUCESOR RECUPERADOR amigo dispare, combata o contraataque contra un agente enemigo, por cada una de tus fichas de Agravio que tenga ese agente enemigo, puedes guardar uno de tus éxitos normales como éxito crítico en su lugar (incluyendo cualquier éxito normal ya guardado debido a la regla de arma Precisión). Ten en cuenta que las fichas de Agravio no se retiran cuando haces esto.",
      subs: [],
    },
  ],
  pl: {
    s: [
      {
        n: "Defensa templada",
        t: "Siempre que un agente dispare contra un agente SUCESOR RECUPERADOR amigo, si sacaste 0-1 éxitos (incluyendo las repeticiones), puedes guardar 1 de tus fallos como un éxito en su lugar.",
      },
      {
        n: "Potencia de fuego cercana",
        t: "Cuando un agente SUCESOR RECUPERADOR amigo dispare contra un agente enemigo a 6\" o menos de él, mejora en 1 el atributo Impactar de las armas a distancia de ese agente amigo (hasta un máximo de 3+). Esto puede permitirte aplicar o retirar el cambio al atributo Impactar durante una acción (esto tiene prioridad sobre las reglas básicas).",
      },
      {
        n: "La necesidad mantiene",
        t: "Elige un marcador de objetivo o uno de tus marcadores de misión.\n• Al determinar el control de ese marcador, trata el atributo LPA total de los agentes SUCESOR RECUPERADOR amigos que lo disputen como si fuera 1 punto mayor si al menos un agente SUCESOR RECUPERADOR amigo disputa ese marcador. Ten en cuenta que esto no es un cambio al atributo LPA, de modo que cualquier cambio es acumulativo con esto.\n• Cuando un agente SUCESOR RECUPERADOR amigo se encuentre a 3\" o menos de ese marcador, suma 1 al atributo Ataque de sus armas de combate (hasta un máximo de 4); si el arma ya tiene un atributo Ataque de 4, obtiene la regla de arma Equilibrada.",
      },
      {
        n: "El trabajo obtiene",
        t: "Elige un marcador de objetivo o uno de tus marcadores de misión. Cuando un agente enemigo se encuentre a 3\" o menos de ese marcador, trátalo como si tuviera un marcador adicional de Agravio.",
      },
    ],
    f: [
      {
        n: "Robusto",
        t: "Usa este ardid de tiroteo cuando un agente dispare contra un agente SUCESOR RECUPERADOR amigo, cuando reúnas tus dados de defensa. Cambia los éxitos críticos guardados de tu atacante por éxitos normales (cualquier regla de armas que ya se haya resuelto no se ve afectada, p. ej., Críticos de penetración).",
      },
      {
        n: "Trabarse por la recompensa",
        t: "Usa este ardid de tiroteo tras tirar tus dados de ataque por un agente SUCESOR RECUPERADOR amigo, si dispara o combate contra un agente enemigo que controle un marcador de objetivo o uno de tus marcadores de misión. Puedes repetir la tirada de algunos o todos tus dados de ataque.",
      },
      {
        n: "Los ancestros nos observan",
        t: "Usa este ardid de tiroteo durante la activación de un agente SUCESOR RECUPERADOR amigo. Hasta el final de esa activación, el agente en cuestión puede realizar o bien una acción libre de Combatir o bien una acción libre de Disparar y puedes ignorar cualquier cambio a los atributos de arma de ese agente por estar lesionado.",
      },
      {
        n: "Esfuerzo final",
        t: "Usa este ardid de tiroteo cuando un agente SUCESOR RECUPERADOR amigo resulte incapacitado. Puede realizar una acción libre de misión antes de ser retirado de la zona de aniquilación.",
      },
    ],
  },
  eq: [
    {
      n: "Herramientas de excavación",
      t: "Los agentes SUCESOR RECUPERADOR amigos pueden realizar la acción Recoger marcador por 1PA menos, y no tienen que controlar el marcador para hacer esto (lo cual tiene preferencia sobre las condiciones de esa acción – solo necesitan disputar el marcador).",
    },
    {
      n: "Mandato de reclamación",
      t: "Una vez por batalla, si los agentes SUCESOR RECUPERADOR amigos disputan dos o más marcadores de objetivo, tras desempatar para determinar la iniciativa, puedes usar esta regla. Si lo haces, puedes repetir tu tirada.",
    },
    {
      n: "Cuchillos de plasma",
      t: "Los agentes SUCESOR RECUPERADOR amigos tienen la siguiente arma de combate. Ten en cuenta que el agente MÉDICO DE CAMPO ya tiene esta arma pero con mejores atributos; en ese caso, usa la mejor versión.\nREGLAS DE ARMAS\nLetal 5+\n▸ Cuchillo de plasma — ATQ 3 · IMP 4+ · DAÑO 3/5",
    },
    {
      n: "Anclajes",
      t: "Durante la activación de cada agente SUCESOR RECUPERADOR amigo, puedes hacer una de las siguientes cosas:\n• Cuando ese agente trepe, puedes tratar la distancia vertical como si fuera 2\" (sin importar cuánto mueva en vertical el agente realmente).\n• Cuando ese agente se deja caer, ignora la distancia vertical.",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Abril 2026",
      ee: [
        {
          s: "Ardides de tiroteo, los ancestros nos observan",
          t: "Añade este texto al final de la segunda frase: “[…] el agente en cuestión puede realizar o bien una acción libre de Combatir o bien una acción libre de Disparar y puedes ignorar cualquier cambio a los atributos de arma de ese agente por estar lesionado”.",
        },
        { s: "Agente con propulsor de salto", t: "Cambia su atributo Movimiento a “8”." },
        {
          s: "Agente sherpa, regla buenos suministros",
          t: "Añade este texto al final: “Puedes seleccionar una opción de equipo adicional, y en el Paso de preparación de a primera fase de estrategia, obtienes 1 PM adicional”.",
        },
        {
          s: "Reglas de facción, agravio",
          t: "Cambia la parte relevante de la primera frase del segundo párrafo a: “[…] puedes guardar 1 de tus éxitos normales como éxito crítico en su lugar (incluyendo cualquier éxito normal ya guardado debido a la regla de arma Precisión)”.",
        },
        {
          s: "Ardides de estrategia, la necesidad mantiene",
          t: "Cambia la parte relevante del segundo punto a: “[…] suma 1 al atributo Atq de sus armas de combate (hasta un máximo de 4); si el arma ya tiene un atributo Atq de 4, entonces tiene la regla de arma Equilibrada”.",
        },
        {
          s: "Ardides de estrategia, potencia de fuego cercana",
          t: "Añade este texto al final: “Esto puede permitirte aplicar o retirar el cambio al atributo Impactar durante una acción (esto tiene prioridad sobre las reglas básicas).”",
        },
        {
          s: "Ardides de estrategia, defensa templada",
          t: "Cambiar a: “Siempre que un agente dispare contra un agente SUCESOR RECUPERADOR amigo, si sacaste 0-1 éxitos (incluyendo las repeticiones), puedes guardar 1 de tus fallos como un éxito en su lugar”.",
        },
        {
          s: "Agente médico de campo, regla ¡sanitario!",
          t: "Cambiar a: “La primera vez durante cada punto de inflexión que otro agente SUCESORES RECUPERADORES amigo vaya a resultar incapacitado mientras era visible para este agente y estaba a 3\" o menos de él, puedes usar esta regla siempre que ni este ni ese agente estén en la zona de control de algún agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le queda 1 herida y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede entonces realizar inmediatamente una acción libre de Correr, pero debe terminar ese movimiento en la zona de control de este agente. Resta 1 a los atributos LPA de este y de ese agente hasta el final de sus próximas activaciones respectivamente, y si esta regla fue usada durante la activación de ese agente amigo, esa activación termina. No puedes usar esta regla si este agente resulta incapacitado, o si es una acción de Disparar y este agente iba a ser el blanco primario o secundario”.",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Agente theyn, regla cresta de campo entrelazado",
          t: "Cambiar a: “1 vez por batalla, cuando un dado de ataque inflija Daño normal a este agente, puedes ignorar ese daño infligido”.",
        },
        {
          s: "Agente theyn, regla ojo de los ancestros",
          t: "Cambia la primera frase a: “GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación.”",
        },
        { s: "Agenter bulldôzer, regla agresivo", t: "Añade este punto al final: “El Daño normal de 4 o más le inflige 1 daño menos.”" },
        {
          s: "Agente radiovinculado, acción señal",
          t: "Cambia la segunda frase del efecto a: “Elige 1 agente HSUCESOR RECUPERADOR amigo diferente que esté en la zona de aniquilación”.",
        },
        {
          s: "Agente anâlista, regla táctico",
          t: "Cambia la primera frase a: “GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación.” Cambia la parte relevante de la tercera frase por: “[…] un agente enemigo que esté a 3” o menos de tu marcador de Ataque, las armas de dicho agente amigo tienen la regla de armas Equilibrada”.",
        },
        {
          s: "Equipo de facción, anclajes",
          t: "Cambiar a: “Durante la activación de cada agente SUCESOR RECUPERADOR amigo, puedes elegir una de las siguientes opciones: • \u0007Siempre que este agente trepa por terreno, la distancia vertical se considera 2\" (sin importar la distancia real que mueva en vertical dicho agente). • \u0007Cuando este agente se deja caer, ignora la distancia vertical”.",
        },
        {
          s: "Equipo de facción, mandato de reclamación",
          t: "Cambiar a: 1 vez por batalla, si los agentes SUCESOR RECUPERADOR amigos disputan dos o más marcadores de objetivo, tras desempatar para determinar la iniciativa, puedes usar esta regla. Si lo haces, puedes repetir tu tirada.” Esta sección aclara interacciones complejas o ambiguas entre reglas. P: Si un agente BULLDÔZER SUCESOR RECUPERADOR que realiza su acción de Nudillazo brutal mueve a un agente enemigo, y durante ese movimiento un marcador que vaya a “terminar su acción” está en la zona de control de ese agente enemigo (p. ej. Minas AP-Pex del FERROBRAEK YAEGIRS HERNKYN), pero no en la zona de control del agente BULLDÔZER, ¿termina la acción de Nudillazo brutal? R: No.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Reconocimiento", "Seguridad"],
    required: [
      {
        type: "THEYN",
        count: 1,
        loadouts: [
          {
            label: "Pistola bólter modelo Autoch; guantelete conmocionador",
            w: [{ n: "Pistola bólter modelo Autoch" }, { n: "Guantelete conmocionador" }],
          },
          { label: "Pistola bólter modelo Autoch; arma de plasma", w: [{ n: "Pistola bólter modelo Autoch" }, { n: "Arma de plasma" }] },
          { label: "Bólter modelo Autoch; guantelete conmocionador", w: [{ n: "Bólter modelo Autoch" }, { n: "Guantelete conmocionador" }] },
          { label: "Bólter modelo Autoch; arma de plasma", w: [{ n: "Bólter modelo Autoch" }, { n: "Arma de plasma" }] },
          { label: "Rebóltver; guantelete conmocionador", w: [{ n: "Rebóltver" }, { n: "Guantelete conmocionador" }] },
          { label: "Rebóltver; arma de plasma", w: [{ n: "Rebóltver" }, { n: "Arma de plasma" }] },
          {
            label: "Pistola de plasma EtaCarn; guantelete conmocionador",
            w: [{ n: "Pistola de plasma EtaCarn" }, { n: "Guantelete conmocionador" }],
          },
          { label: "Pistola de plasma EtaCarn; arma de plasma", w: [{ n: "Pistola de plasma EtaCarn" }, { n: "Arma de plasma" }] },
          { label: "Bláster iónico; guantelete conmocionador", w: [{ n: "Bláster iónico" }, { n: "Guantelete conmocionador" }] },
          { label: "Bláster iónico; arma de plasma", w: [{ n: "Bláster iónico" }, { n: "Arma de plasma" }] },
          { label: "Pistola de iones; guantelete conmocionador", w: [{ n: "Pistola de iones" }, { n: "Guantelete conmocionador" }] },
          { label: "Pistola de iones; arma de plasma", w: [{ n: "Pistola de iones" }, { n: "Arma de plasma" }] },
        ],
      },
    ],
    pool: {
      slots: 9,
      note: "Salvo Tiradores y Combatientes, cada agente solo una vez. Hasta tres Tiradores, cada uno con una opción distinta.",
      entries: [
        { type: "BULLDÔZER", max: 1 },
        { type: "MÉDICO DE CAMPO", max: 1 },
        { type: "GRANADERO", max: 1 },
        { type: "PROPULSOR DE SALTO", max: 1 },
        { type: "RADIOVINCULADO", max: 1 },
        { type: "ANÂLISTA", max: 1 },
        { type: "LOCÂLIZADOR", max: 1 },
        { type: "SHERPA", max: 1 },
        { type: "TIRADOR", max: 1, key: "tirador-haz", label: "Tirador · haz de plasma EtaCarn" },
        { type: "TIRADOR", max: 1, key: "tirador-rifle", label: "Tirador · rifle automático LasMAX" },
        { type: "TIRADOR", max: 1, key: "tirador-multi", label: "Tirador · multicañón LasMAX" },
        { type: "TIRADOR", max: 1, key: "tirador-l7", label: "Tirador · lanzamisiles L7" },
        { type: "TIRADOR", max: 1, key: "tirador-lineal", label: "Tirador · fusil lineal magnético" },
        { type: "COMBATIENTE", max: null, key: "combatiente-bolter", label: "Combatiente · bólter modelo Autoch" },
        { type: "COMBATIENTE", max: null, key: "combatiente-ion", label: "Combatiente · bláster iónico" },
      ],
    },
    constraints: [{ types: ["TIRADOR"], max: 3, label: "Máx. 3 Tiradores", msg: "Solo puedes incluir hasta tres Tiradores." }],
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
