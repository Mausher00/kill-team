// ============================================================
//  data/escuadra-exaccion.js — Escuadra de Exacción
//  Generado desde el PDF oficial: Exaction Squad (jun. 2026)
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['escuadra-exaccion'] = {
  id: "escuadra-exaccion",
  name: "Escuadra de Exacción",
  subfaction: "Adeptus Arbites",
  icon: "⚖️",
  img: "imagenes/escuadra-exaccion.png",
  desc: "Agentes del Adeptus Arbites que imponen la Lex Imperialis a golpe de escopeta, cibermastín y escudo de asalto.",
  tags: ["Imperium", "Seguridad", "Buscar y destruir"],
  version: "Junio 2026",
  source: "Exaction Squad (jun. 2026)",
  ops: [
    {
      id: "proctojuez",
      name: "Arbites Proctojuez",
      type: "PROCTOJUEZ",
      img: "imagenes/escuadra-exaccion-img/arbites-proctojuez.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 9 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "LÍDER", "PROCTOJUEZ"],
      w: [
        { n: "Escopeta de combate (corto alcance)", a: 4, i: "2+", d: "4/4", r: ["Alcance 6\""] },
        { n: "Escopeta de combate (largo alcance)", a: 4, i: "4+", d: "2/2", r: [] },
        { n: "Pistolón", a: 4, i: "3+", d: "3/3", r: ["Alcance 8\""] },
        { n: "Porra de supresión", a: 3, i: "3+", d: "2/3", r: [] },
        { n: "Mazo dominador y escudo de asalto", a: 4, i: "3+", d: "4/4", r: ["Choque", "Letal 5+", "Represor*"] },
      ],
      ru: [
        { n: "Escudo de asalto", t: "Si este agente tiene un mazo dominador y escudo de asalto, tiene un atributo Salvación de 3+." },
        {
          n: "Nuncio Aquila",
          t: "• Cuando un agente enemigo se encuentre a 3\" o menos de tu marcador de Nuncio Aquila (o de este agente, si tu marcador de Nuncio Aquila no se encuentra en la zona de aniquilación), tu oponente debe gastar 1 PA adicional por ese agente enemigo para realizar la acción Recoger marcador y acciones de misión.\n• Al determinar el control de un marcador, el atributo LPA total de los agentes enemigos que lo disputan se considera como si fuese 1 menos si hay por lo menos uno de esos agentes enemigos a 3\" o menos de tu marcador de Nuncio Aquila (o de este agente, si tu marcador de Nuncio Aquila no se encuentra en la zona de aniquilación). Ten en cuenta que esto no es un cambio al atributo LPA, por lo que cualquier cambio se acumula con esto.",
        },
        {
          n: "Desplegar Nuncio Aquila (0PA)",
          t: "Si tu marcador de Nuncio Aquila no se encuentra en la zona de aniquilación, colócalo a 6\" o menos horizontalmente de este agente; de lo contrario, mueve tu marcador de Nuncio Aquila hasta 6\" horizontalmente. Si este agente es retirado de la zona de aniquilación, retira también de la zona de aniquilación tu marcador de Nuncio Aquila. Este agente no puede realizar esta acción si se encuentra en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "martirizador",
      name: "Arbites Martirizador",
      type: "MARTIRIZADOR",
      img: "imagenes/escuadra-exaccion-img/arbites-martirizador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "MÉDICO", "MARTIRIZADOR"],
      w: [
        { n: "Escopeta de combate (corto alcance)", a: 4, i: "3+", d: "4/4", r: ["Alcance 6\""] },
        { n: "Escopeta de combate (largo alcance)", a: 4, i: "5+", d: "2/2", r: [] },
        { n: "Porra de supresión", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "¡Sanitario!",
          t: "La primera vez durante cada punto de inflexión que otro agente ESCUADRA DE EXACCIÓN amigo vaya a resultar incapacitado estando a 3” o menos de este agente y visible para él, puedes usar esta regla, siempre que ninguno de los dos agentes amigos implicados estén en la zona de control de un agente enemigo. Si lo haces, ese agente amigo no resulta incapacitado, le queda 1 herida, y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede realizar inmediatamente una acción libre de Correr, pero debe terminar ese movimiento en la zona de control de agente. Resta 1 al LPA de ambos agentes hasta el final de sus siguientes activaciones respectivas, y si esta regla se usó durante la activación del otro agente amigo, esa activación termina. No puedes usar esta regla si este agente resulta incapacitado, o si es una acción de Disparar y este agente iba a ser el blanco primario o secundario.",
        },
        {
          n: "Botiquín (1PA)",
          t: "Elige un agente ESCUADRA DE EXACCIÓN amigo en la zona de control de este agente para que recupere hasta 2D3 heridas perdidas. No puede ser un agente en el que se haya usado la regla ¡Sanitario! durante este punto de inflexión. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "amo-adiestrador",
      name: "Arbites Amo Adiestrador",
      type: "AMO ADIESTRADOR",
      img: "imagenes/escuadra-exaccion-img/arbites-amo-adiestrador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "AMO ADIESTRADOR"],
      w: [
        { n: "Escopeta de combate (corto alcance)", a: 4, i: "3+", d: "4/4", r: ["Alcance 6\""] },
        { n: "Escopeta de combate (largo alcance)", a: 4, i: "5+", d: "2/2", r: [] },
        { n: "Pistolón", a: 4, i: "4+", d: "3/3", r: ["Alcance 8\""] },
        { n: "Porra de supresión", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Instructor",
          t: "Cuando este agente sea activado, puedes activar a la vez a un agente R-VR CIBERMASTÍN ESCUADRA DE EXACCIÓN amigo apostado. Completa sus activaciones de acción en acción en cualquier orden.",
        },
        {
          n: "Pauta de ataque",
          t: "GAMBITO ESTRATÉGICO en el primer punto de inflexión. Elige dos de las siguientes pautas de ataque para que la tenga en esa batalla un agente R-VR CIBERMASTÍN ESCUADRA DE EXACCIÓN amigo:\n• Agresivo: Sus armas de combate tienen la regla de armas Implacable.\n• Ágil: Suma 2\" a su atributo Movimiento.\n• Defensivo: Mejora en 1 su atributo Salvación.",
        },
        {
          n: "Orden R-vr (0PA)",
          t: "Elige un agente R-VR CIBERMASTÍN ESCUADRA DE EXACCIÓN amigo y cambia una de sus pautas de ataque.",
          isAct: true,
        },
      ],
    },
    {
      id: "r-vr-cibermastin",
      name: "R-VR Cibermastín",
      type: "R-VR CIBERMASTÍN",
      img: "imagenes/escuadra-exaccion-img/r-vr-cibermastin.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "R-VR CIBERMASTÍN"],
      w: [{ n: "Mordisco mecánico", a: 4, i: "4+", d: "3/5", r: ["Letal 5+"] }],
      ru: [
        {
          n: "Bestia",
          t: "Este agente solo puede realizar acciones de Apresar, Cargar, Correr, Retroceder, Combatir, En guardia, Reposicionarse, Recoger marcador y Colocar marcador. No puede usar ninguna arma que no aparezca en su tarjeta de datos.",
        },
        {
          n: "Apresar (0PA)",
          t: "Elige un agente enemigo en la zona de control de este agente. Hasta que ese agente enemigo deje de estar en la zona de control de este agente, o hasta que este agente realice esta acción de nuevo (lo que ocurra antes), empeora en 1 el atributo Impactar de las armas de ese agente enemigo (esto no es acumulativo con estar lesionado); además, ese agente enemigo no puede realizar la acción Retroceder. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "castigador",
      name: "Arbites Castigador",
      type: "CASTIGADOR",
      img: "imagenes/escuadra-exaccion-img/arbites-castigador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "CASTIGADOR"],
      w: [
        { n: "Escopeta de combate (corto alcance)", a: 4, i: "3+", d: "4/4", r: ["Alcance 6\""] },
        { n: "Escopeta de combate (largo alcance)", a: 4, i: "5+", d: "2/2", r: [] },
        { n: "Mazo excruciador", a: 4, i: "3+", d: "5/5", r: ["Choque", "Desgarradora"] },
      ],
      ru: [
        {
          n: "Ni una distracción",
          t: "Puedes ignorar cualesquiera cambios a los atributos de este agente (incluyendo sus atributos de armas, pero excluyendo su atributo Salvación).",
        },
        {
          n: "Dedicación fanática",
          t: "Cuando un dado de ataque inflige un daño de 3 o más a este agente, tira 1D6: con un 5+, resta 1 a ese daño infligido.",
        },
        {
          n: "Arresto de Castigador",
          t: "Cuando un agente enemigo se encuentre en la zona de control de este agente, si no hay otros agentes enemigos en la zona de control de este agente, dicho agente enemigo no puede realizar la acción Retroceder.",
        },
      ],
    },
    {
      id: "tirador",
      name: "Arbites Tirador",
      type: "TIRADOR",
      img: "imagenes/escuadra-exaccion-img/arbites-tirador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "TIRADOR"],
      w: [
        { n: "Lanzagranadas", a: 5, i: "4+", d: "4/5", r: ["Penetración 1"] },
        { n: "Ametralladora pesada (concentrada)", a: 5, i: "4+", d: "4/5", r: ["Pesada (solo Correr)"] },
        { n: "Ametralladora pesada (barrido)", a: 4, i: "4+", d: "4/5", r: ["Pesada (solo Correr)", "Ráfaga 1\""] },
        { n: "Lanzarredes", a: 4, i: "3+", d: "4/5", r: ["Alcance 12\"", "Aturdidora", "Severa"] },
        { n: "Porra de supresión", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [],
    },
    {
      id: "doctoforense",
      name: "Arbites Doctoforense",
      type: "DOCTOFORENSE",
      img: "imagenes/escuadra-exaccion-img/arbites-doctoforense.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "DOCTOFORENSE"],
      w: [
        { n: "Escopeta de combate (corto alcance)", a: 4, i: "3+", d: "4/4", r: ["Alcance 6\""] },
        { n: "Escopeta de combate (largo alcance)", a: 4, i: "5+", d: "2/2", r: [] },
        { n: "Porra de supresión", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Atento a todo",
          t: "Una vez por activación de este agente, puede realizar la acción de Recoger marcador, Colocar marcador, Lentes de guía, o una acción de misión por 1 PA menos.",
        },
        {
          n: "Lentes de Guía (1PA)",
          t: "Elige un agente enemigo visible para este agente. Hasta el inicio de la siguiente activación de este agente, hasta que este agente quede incapacitado o realice esta acción de nuevo (lo que ocurra antes), cuando un agente ESCUADRA DE EXACCIÓN amigo dispare, combata o contraataque contra ese agente enemigo, las armas de ese agente tienen la regla de arma Letal 5+ y Severa. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "ojo-preciso",
      name: "Arbites Ojo Preciso",
      type: "OJO PRECISO",
      img: "imagenes/escuadra-exaccion-img/arbites-ojo-preciso.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "OJO PRECISO"],
      w: [
        { n: "Escopeta de verdugo (oculta)", a: 4, i: "2+", d: "4/0", r: ["Devastadora 4", "Pesada", "Posición oculta*", "Silenciosa"] },
        { n: "Escopeta de verdugo (móvil)", a: 4, i: "3+", d: "4/4", r: [] },
        { n: "Escopeta de verdugo (inmóvil)", a: 4, i: "2+", d: "4/0", r: ["Devastadora 4", "Pesada"] },
        { n: "Porra de supresión", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        { n: "Posición oculta", t: "Este agente solo puede usar esta arma la primera vez que realiza una acción de Disparar durante la batalla." },
        {
          n: "Óptica (1PA)",
          t: "Hasta el inicio de la siguiente activación de este agente, los perfiles oculta e inmóvil de su escopeta de verdugo tienen la regla de armas Letal 5+, y además cuando dispare con dicha arma los agentes enemigos no pueden estar ofuscados. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "revelatum",
      name: "Arbites Revelatum",
      type: "REVELATUM",
      img: "imagenes/escuadra-exaccion-img/arbites-revelatum.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "REVELATUM"],
      w: [
        { n: "Pistolón con mira láser (largo alcance)", a: 4, i: "3+", d: "3/3", r: [] },
        { n: "Pistolón con mira láser (corto alcance)", a: 4, i: "3+", d: "3/3", r: ["Alcance 8\"", "Letal 5+"] },
        { n: "Porra de supresión", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "El primero en llegar",
          t: "GAMBITO ESTRATÉGICO durante el primer punto de inflexión. Si este agente se encuentra completamente dentro de tu zona de descenso, puede realizar inmediatamente una acción libre de Reposicionarse.",
        },
        {
          n: "Avistar (1PA)",
          t: "Elige un agente enemigo visible para este agente y a 8\" o menos de él. Hasta el final del punto de inflexión, cuando un agente ESCUADRA DE EXACCIÓN amigo dispare contra el agente enemigo elegido, puedes usar este efecto.",
          isAct: true,
        },
        {
          n: "Si lo haces",
          t: "• Las armas a distancia de este agente tienen la regla de armas Buscadora (ligera).\n• Ese agente enemigo no puede estar ofuscado. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
        },
      ],
    },
    {
      id: "sojuzgador",
      name: "Arbites Sojuzgador",
      type: "SOJUZGADOR",
      img: "imagenes/escuadra-exaccion-img/arbites-sojuzgador.jpg",
      s: { lpa: 2, mov: "6\"", salv: "3+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "SOJUZGADOR"],
      w: [
        { n: "Pistolón", a: 4, i: "4+", d: "3/3", r: ["Alcance 8\""] },
        { n: "Mazo de choque y escudo de asalto", a: 4, i: "4+", d: "4/4", r: ["Choque", "Represor*"] },
      ],
      ru: [{ n: "Subyugatercos", t: "Puedes ignorar cualquier cambio al atributo Impactar de las armas de combate de este agente." }],
    },
    {
      id: "vigilante",
      name: "Arbites Vigilante",
      type: "VIGILANTE",
      img: "imagenes/escuadra-exaccion-img/arbites-vigilante.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "VIGILANTE"],
      w: [
        { n: "Escopeta de combate (corto alcance)", a: 4, i: "3+", d: "4/4", r: ["Alcance 6\""] },
        { n: "Escopeta de combate (largo alcance)", a: 4, i: "5+", d: "2/2", r: [] },
        { n: "Porra de supresión", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Vigilancia en combate cerrado",
          t: "Este agente puede realizar la acción Disparar (salvo En guardia) mientras se encuentre en la zona de control de un agente enemigo, pero solo si no ha realizado la acción Cargar durante esa activación, o si es una reacción. Este agente no tiene prohibido realizar la acción de Cargar tras realizar la acción de Disparar.",
        },
      ],
    },
    {
      id: "vocotransmisor",
      name: "Arbites Vocotransmisor",
      type: "VOCOTRANSMISOR",
      img: "imagenes/escuadra-exaccion-img/arbites-vocotransmisor.jpg",
      s: { lpa: 2, mov: "6\"", salv: "4+", h: 8 },
      kw: ["ESCUADRA DE EXACCIÓN", "IMPERIUM", "ADEPTUS ARBITES", "VOCOTRANSMISOR"],
      w: [
        { n: "Escopeta de combate (corto alcance)", a: 4, i: "3+", d: "4/4", r: ["Alcance 6\""] },
        { n: "Escopeta de combate (largo alcance)", a: 4, i: "5+", d: "2/2", r: [] },
        { n: "Porra de supresión", a: 3, i: "4+", d: "2/3", r: [] },
      ],
      ru: [
        {
          n: "Señal (1PA)",
          t: "APOYO. Elige un agente ESCUADRA DE EXACCIÓN amigo distinto visible para este agente. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
  ],
  fr: {
    name: "Eficiencia despiadada",
    type: "REGLA DE FACCIÓN",
    text: "Cuando un agente ESCUADRA DE EXACCIÓN amigo dispare (excepto si dispara una granada frag o perforante) y estás eligiendo un blanco válido, puedes usar esta regla. Si lo haces, tener a otros agentes ESCUADRA DE EXACCIÓN amigos dentro de la zona de control de un agente enemigo no impide que dicho agente enemigo sea elegido.",
    orders: [
      {
        n: "Marcado para hacer justicia",
        t: "GAMBITO ESTRATÉGICO. Elige un agente enemigo para que sea tu marca en ese punto de inflexión. Cuando un agente ESCUADRA DE EXACCIÓN amigo dispare, combata o contraataque contra tu marca, las armas de ese agente amigo tienen la regla de armas Castigadora. Cuando tu marca quede incapacitado, puedes elegir a un nuevo agente enemigo para que sea tu marca en ese punto de inflexión (y puedes seguir haciéndolo durante este punto de inflexión).",
      },
      {
        n: "Represor",
        t: "Algunas armas que aparecen en las reglas de este comando tienen la regla de armas Represor, indicada abajo. *Represor: Cuando este agente use esta arma:\n• Cada uno de tus bloqueos puede asignarse a bloquear dos éxitos no resueltos (en lugar de uno).\n• Si este agente está contratacando, resuelve el primer dado de ataque (es decir, el defensor en lugar del atacante).",
      },
    ],
  },
  frs: [
    {
      name: "Eficiencia despiadada",
      text: "Cuando un agente ESCUADRA DE EXACCIÓN amigo dispare (excepto si dispara una granada frag o perforante) y estás eligiendo un blanco válido, puedes usar esta regla. Si lo haces, tener a otros agentes ESCUADRA DE EXACCIÓN amigos dentro de la zona de control de un agente enemigo no impide que dicho agente enemigo sea elegido.",
      subs: [],
    },
    {
      name: "Marcado para hacer justicia",
      text: "GAMBITO ESTRATÉGICO. Elige un agente enemigo para que sea tu marca en ese punto de inflexión. Cuando un agente ESCUADRA DE EXACCIÓN amigo dispare, combata o contraataque contra tu marca, las armas de ese agente amigo tienen la regla de armas Castigadora. Cuando tu marca quede incapacitado, puedes elegir a un nuevo agente enemigo para que sea tu marca en ese punto de inflexión (y puedes seguir haciéndolo durante este punto de inflexión).",
      subs: [],
    },
    {
      name: "Represor",
      text: "Algunas armas que aparecen en las reglas de este comando tienen la regla de armas Represor, indicada abajo. *Represor: Cuando este agente use esta arma:\n• Cada uno de tus bloqueos puede asignarse a bloquear dos éxitos no resueltos (en lugar de uno).\n• Si este agente está contratacando, resuelve el primer dado de ataque (es decir, el defensor en lugar del atacante).",
      subs: [],
    },
  ],
  pl: {
    s: [
      {
        n: "La culpa se ve de lejos",
        t: "Cuando vayas a elegir un blanco válido para un agente ESCUADRA DE EXACCIÓN amigo, los agentes enemigos a 4\" o menos de él no pueden estar a cubierto (en lugar de a 2\" o menos). Esto puede permitir que el agente sea tomado como blanco (suponiendo que sea visible), pero no le niega la salvación por cobertura de la que disponga, a menos que el agente ESCUADRA DE EXACCIÓN amigo se encuentre a 2\" o menos, como es habitual.",
      },
      {
        n: "Jurisdicción protegida",
        t: "Cuando un agente dispare contra un agente ESCUADRA DE EXACCIÓN amigo a 2\" o menos de un marcador de objetivo o un agente enemigo, puedes repetir uno de tus dados de defensa.",
      },
      {
        n: "Impartir justicia",
        t: "Cuando un agente ESCUADRA DE EXACCIÓN amigo combata o contraataque, si no se ha movido más que su atributo Movimiento durante la activación, o si es una reacción, sus armas de combate tienen la regla de armas Incesante.",
      },
      {
        n: "Decreto terminal",
        t: "Cuando un agente ESCUADRA DE EXACCIÓN amigo dispare contra un agente enemigo a 6\" o menos de él, o cuando un agente TIRADOR ESCUADRA DE EXACCIÓN dispare, las armas a distancia de ese agente amigo tienen la regla de armas Equilibrada.",
      },
    ],
    f: [
      {
        n: "La implacable ley del Emperador",
        t: "Usa este ardid de tiroteo cuando un agente ESCUADRA DE EXACCIÓN amigo realice la acción Disparar y tú hayas elegido un arma con la regla de armas Alcance x (salvo granada frag o perforante). Hasta el final de dicha acción, suma 3\" a la x.",
      },
      {
        n: "Ejecutar castigo",
        t: "Usa este ardid de tiroteo después de que un agente enemigo dispare o combata contra un agente ESCUADRA DE EXACCIÓN amigo a 6\" o menos de él, y ese agente amigo no quede incapacitado debido a ello. El agente amigo en cuestión puede realizar inmediatamente o bien una acción libre de Combatir o bien una acción libre de Disparar, pero durante dicha acción no se puede combatir contra otro agente enemigo distinto ni tomar como blanco de un disparo a otro agente enemigo distinto (los blancos secundarios de la regla de armas Área sí que pueden ser elegidos de manera normal).",
      },
      {
        n: "Refuerzos brutales",
        t: "Usa este ardid de tiroteo durante la activación de un agente ESCUADRA DE EXACCIÓN amigo, antes o después de que realice una acción. Elige un agente enemigo en su zona de control. Otro agente ESCUADRA DE EXACCIÓN amigo distinto puede realizar inmediatamente una acción libre de Combatir, pero solo puede combatir contra el agente enemigo elegido.",
      },
      {
        n: "Orden de ejecución",
        t: "Usa este ardid de tiroteo cuando un agente enemigo realice una acción de misión (salvo Operar portillo). Como alternativa, úsalo al final de la fase de tiroteo y elige un agente enemigo que controle un marcador de objetivo. En cualquiera de los dos casos, la siguiente vez que tu oponente vaya a activar a ese agente enemigo, puedes interrumpir dicha activación y activar a un agente ESCUADRA DE EXACCIÓN amigo apostado. Si lo haces, durante dicha activación el agente amigo en cuestión deberá combatir o disparar contra ese agente enemigo, y hasta entonces no podrá hacerlo contra ningún otro agente enemigo (si esto no es posible, la activación del agente amigo en cuestión se cancelará). Tras completar la activación del agente amigo en cuestión, sigue con la activación de ese agente enemigo (si es posible). No puedes volver a usar este ardid de tiroteo hasta que ese agente enemigo sea activado o quede incapacitado.",
      },
    ],
  },
  eq: [
    {
      n: "Visor de espejo reforzado",
      t: "Puedes ignorar cualesquiera cambios a los atributos LPA de los agentes ESCUADRA DE EXACCIÓN amigos, que además no se ven afectados por la regla de armas Choque de los agentes enemigos.",
    },
    {
      n: "Esposas",
      t: "Cuando un agente enemigo vaya a realizar una acción de Retroceder mientras se encuentra en la zona de control de un agente ESCUADRA DE EXACCIÓN amigo, si no hay otros agente enemigos en la zona de control de ese agente amigo, puedes usar esta regla. En tal caso, tira dos D6, o un D6 si ese agente enemigo tiene un atributo Heridas mayor que el del agente amigo en cuestión. Si algún resultado es un 4+, dicho agente enemigo no puede realizar esa acción durante esta activación o reacción (no se gastan PA en ella), y no puedes usar esta regla otra vez durante este punto de inflexión.",
    },
    {
      n: "Bengala estroboscópica",
      t: "Cuando un agente enemigo dispara, combate o contraataca contra un agente ESCUADRA DE EXACCIÓN amigo a 2\" o menos de él, tu oponente no puede repetir los dados de ataque con resultados de 1.",
    },
    {
      n: "Proyectiles especiales",
      t: "Hasta 2 veces por punto de inflexión, cuando un agente ESCUADRA DE EXACCIÓN amigo realice una acción de Disparar y elijas una escopeta bólter, una escopeta de verdugo, un pistolón con mira láser o un pistolón, puedes usar esta regla. Si lo haces, elige una de las siguientes reglas de armas para que la tenga el arma en cuestión hasta el final de esa acción:\n• Saturación.\n• Penetración 1, pero solo si el blanco tiene un atributo Salvación de 3+ o mejor.\n• Ráfaga 1\", pero no puedes elegir más de un blanco secundario.",
    },
  ],
  er: [
    {
      v: "Cambios · Junio 2026",
      ee: [
        {
          s: "Agente amo adiestrador, regla pauta de ataque",
          t: "Cambia la parte relevante de la segunda frase por \"Elige 2 de las siguientes pautas de ataque […]\"",
        },
        {
          s: "Agente amo adiestrador, acción orden r-vr",
          t: "Cambiar la parte relevante del efecto a: \"[…] y cambia 1 de sus pautas de ataque\".",
        },
        { s: "Agente tirador, arma lanzagranadas", t: "Cambia su atributo Atq a “5”. Los atributos Dañ cambian a \"4/5\"" },
        {
          s: "Agente revelatum, acción avistar",
          t: "Cambia el primer párrafo del efecto a: \"APOYO. Elige 1 agente enemigo visible para este agente y a 8\" o menos de él. Hasta el final del punto de inflexión, cuando un agente ESCUADRA DE EXACCIÓN amigo que esté a 3” o menos de este agente dispare contra ese agente enemigo, puedes usar este efecto. Si lo haces:\"",
        },
        {
          s: "Agente martirizador, regla ¡sanitario!",
          t: "Cambia a: “La primera vez durante cada punto de inflexión que otro agente ESCUADRA DE EXACCIÓN amigo vaya a resultar incapacitado mientras es visible para este agente y estaba a 3\" o menos de él, puedes usar esta regla siempre que ni este ni ese agente estén en la zona de control de algún agente enemigo. Si lo haces, ese agente amigo no queda incapacitado, le queda 1 herida y no puede resultar incapacitado durante el resto de la acción. Después de esa acción, ese agente amigo puede entonces realizar inmediatamente una acción libre de Correr, pero debe",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        { s: "Lista de armas del agente amo adiestrador", t: "Se añade el arma “Pistolón”." },
        {
          s: "Agente doctoforense, acción lentes de guía",
          t: "Cambia las partes relevantes de la segunda frase del efecto por: “[...] las armas de ese agente amigo tienen las reglas de arma Letal 5+ y Severa. Si el arma ya tiene esa regla, también tiene la regla de armas Letal 5+”.",
        },
        { s: "Reglas de facción", t: "Se añade la regla de facción \"Represor\"." },
        {
          s: "Ardides de tiroteo, orden de ejecución",
          t: "Cambia la parte relevante de la primera frase del segundo párrafo a: “En cualquiera de los dos casos, la siguiente vez que tu oponente vaya a activar a ese agente enemigo, [...]”",
        },
        {
          s: "Equipo de facción, munición especial",
          t: "Cambia la parte relevante de la primera frase por: “Hasta dos veces por punto de inflexión, [...]”",
        },
        {
          s: "Equipo de facción, esposas",
          t: "Cambia la última frase a: “Si sacas algún 4+, el agente enemigo no puede realizar esa acción durante esta activación/reacción (y no gasta PA en ella), y no puedes usar esta regla de nuevo durante este punto de inflexión”.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Seguridad", "Buscar y destruir"],
    required: [
      {
        type: "PROCTOJUEZ",
        count: 1,
        loadouts: [
          { label: "Escopeta de combate; porra de supresión", w: [{ n: "Escopeta de combate" }, { n: "Porra de supresión" }] },
          { label: "Pistolón; mazo dominador y escudo de asalto", w: [{ n: "Pistolón" }, { n: "Mazo dominador y escudo de asalto" }] },
        ],
      },
    ],
    pool: {
      slots: 10,
      note: "Salvo Tiradores, Sojuzgadores y Vigilantes, cada agente solo una vez. Hasta dos Tiradores (con opciones distintas) y hasta cuatro Sojuzgadores.",
      entries: [
        { type: "CASTIGADOR", max: 1 },
        { type: "MARTIRIZADOR", max: 1 },
        { type: "AMO ADIESTRADOR", max: 1 },
        { type: "R-VR CIBERMASTÍN", max: 1 },
        { type: "DOCTOFORENSE", max: 1 },
        { type: "OJO PRECISO", max: 1 },
        { type: "REVELATUM", max: 1 },
        { type: "SOJUZGADOR", max: 4 },
        { type: "VIGILANTE", max: null },
        { type: "VOCOTRANSMISOR", max: 1 },
        { type: "TIRADOR", max: 1, key: "tirador-lg", label: "Tirador · lanzagranadas" },
        { type: "TIRADOR", max: 1, key: "tirador-amp", label: "Tirador · ametralladora pesada" },
        { type: "TIRADOR", max: 1, key: "tirador-redes", label: "Tirador · lanzarredes" },
      ],
    },
    constraints: [{ types: ["TIRADOR"], max: 2, label: "Máx. 2 Tiradores", msg: "Solo puedes incluir hasta dos Tiradores." }],
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
