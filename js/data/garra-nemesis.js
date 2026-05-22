// ============================================================
//  data/garra-nemesis.js — Garra Némesis (Amos de la Noche)
//  img: ruta local desde la raíz del proyecto
// ============================================================

FACTIONS['garra-nemesis'] = {
  id: 'garra-nemesis', name: 'Garra Némesis', subfaction: 'Astartes Herejes del Caos',
  icon: '🦀', img: 'Imagenes/garra-nemesis.png', desc: 'Comandos de los Amos de la Noche que usan el miedo como arma: venenos, terror psíquico y violencia obscena para aniquilar a sus presas.',
  tags: ['Caos', 'Élite', 'Infiltración', 'Buscar y Destruir'], version: '1.0',

  ops: [
    {
      id: 'visionario', name: 'Visionario Amo de la Noche', type: 'LÍDER',
      img: 'Imagenes/garra-nemesis-img/visionario.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 15 },
      kw: ['GARRA NÉMESIS', 'CAOS', 'ASTARTES HEREJES', 'PSÍQUICO', 'LÍDER', 'VISIONARIO'],
      w: [
        { n: 'Pistola bólter',                  a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Pistola de plasma (normal)',        a: 4, i: '3+', d: '3/5', r: ['Alcance 8"', 'Penetración 1'] },
        { n: 'Pistola de plasma (sobrecarga)',    a: 4, i: '3+', d: '4/5', r: ['Alcance 8"', 'Letal 5+', 'Penetración 1', 'Sobrecalentamiento'] },
        { n: 'Cuchilla sierra de Nostramo',      a: 5, i: '3+', d: '4/5', r: ['Desgarradora'] },
        { n: 'Puño de energía',                  a: 5, i: '4+', d: '5/7', r: ['Brutal'] },
        { n: 'Maza de energía',                  a: 5, i: '3+', d: '4/6', r: ['Choque'] },
        { n: 'Arma de energía',                  a: 5, i: '3+', d: '4/6', r: ['Letal 5+'] },
      ],
      ru: [
        { n: 'Clarividencia', t: 'PSÍQUICA. En el paso de preparación de cada fase de estrategia, ganas 1D3 puntos de Clarividencia. Al final de cada punto de inflexión, descarta tus puntos de Clarividencia. Puedes gastarlos en la fase de tiroteo (máx. una vez por regla por punto de inflexión): • Corazonada: cuando sea tu turno de activar un agente amigo, gasta 1 punto para saltarte esa activación. • Portento: cuando un dado de ataque inflija Daño normal a este agente, gasta 1 punto para ignorar ese daño. No puedes ganar ni gastar puntos de Clarividencia si este agente está incapacitado.' },
        { n: 'Premonición (1PA)', t: 'PSÍQUICA. Gasta 1 de tus puntos de Clarividencia para ganar 1PM. No puede realizarse si está en la zona de control de un agente enemigo, ni más de una vez por punto de inflexión.', isAct: true },
      ],
    },
    {
      id: 'siembramiedos', name: 'Siembramiedos Amo de la Noche', type: 'SIEMBRAMIEDOS',
      img: 'Imagenes/garra-nemesis-img/siembramiedos.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['GARRA NÉMESIS', 'CAOS', 'ASTARTES HEREJES', 'SIEMBRAMIEDOS'],
      w: [
        { n: 'Pistola bólter con mirilla (corto alcance)',  a: 4, i: '3+', d: '3/4', r: ['Alcance 8"', 'Letal 5+'] },
        { n: 'Pistola bólter con mirilla (largo alcance)', a: 4, i: '3+', d: '3/4', r: [] },
        { n: 'Vial de terrortoxinas',                      a: 5, i: '3+', d: '2/0', r: ['Alcance 6"', 'Área 2"', 'Devastadora 3', 'Limitada 1', 'Saturación', 'Terrortoxinas*'] },
        { n: 'Filo contaminado',                           a: 5, i: '3+', d: '3/5', r: ['Terrortoxinas*'] },
      ],
      ru: [
        { n: 'Terrortoxinas*', t: 'En el paso de resolver dados de ataque, si infliges daño con algún éxito crítico, el agente contra el que se esté usando esta arma gana una de tus fichas de Terrortoxinas (si no tiene ya una).' },
        { n: 'Veneno de terrortoxinas', t: 'Siempre que se active un agente que tenga 1 de tus fichas de Terrortoxinas, inflígele 1D3 daños.' },
        { n: 'Envenenar objetivo (1PA)', t: 'Elige un marcador de objetivo que controle este agente; ese marcador gana una de tus fichas de Terrortoxinas. No puede ser un marcador en zona de control enemiga ni que ya tenga una ficha. La primera vez que ese marcador esté en zona de control de un enemigo sin ficha de Terrortoxinas, ese agente gana la ficha e inflígele 2D3 daños (si es durante una acción, al final de dicha acción). No puede realizarse si está en zona de control enemiga.', isAct: true },
      ],
    },
    {
      id: 'tirador', name: 'Tirador Amo de la Noche', type: 'TIRADOR',
      img: 'Imagenes/garra-nemesis-img/tirador.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['GARRA NÉMESIS', 'CAOS', 'ASTARTES HEREJES', 'TIRADOR'],
      w: [
        { n: 'Pistola bólter',             a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Lanzallamas',                a: 4, i: '2+', d: '3/3', r: ['Alcance 8"', 'Ráfaga 2"', 'Saturación'] },
        { n: 'Rifle de fusión',            a: 4, i: '3+', d: '6/3', r: ['Alcance 6"', 'Devastadora 4', 'Penetración 2'] },
        { n: 'Rifle de plasma (normal)',   a: 4, i: '3+', d: '4/6', r: ['Penetración 1'] },
        { n: 'Rifle de plasma (sobrecarga)', a: 4, i: '3+', d: '5/6', r: ['Letal 5+', 'Penetración 1', 'Sobrecalentamiento'] },
        { n: 'Puños',                      a: 4, i: '3+', d: '3/4', r: [] },
      ],
      ru: [],
    },
    {
      id: 'tirador-pesado', name: 'Tirador Pesado Amo de la Noche', type: 'TIRADOR PESADO',
      img: 'Imagenes/garra-nemesis-img/tirador-pesado.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['GARRA NÉMESIS', 'CAOS', 'ASTARTES HEREJES', 'TIRADOR PESADO'],
      w: [
        { n: 'Pistola bólter',                    a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Bólter pesado (concentrado)',        a: 5, i: '3+', d: '4/5', r: ['Críticos de penetración 1', 'Pesada (solo Reposicionarse)'] },
        { n: 'Bólter pesado (barrido)',            a: 4, i: '3+', d: '4/5', r: ['Críticos de penetración 1', 'Pesada (solo Reposicionarse)', 'Ráfaga 1"'] },
        { n: 'Lanzamisiles (frag)',                a: 4, i: '3+', d: '3/5', r: ['Área 2"', 'Pesada (solo Reposicionarse)'] },
        { n: 'Lanzamisiles (perforante)',          a: 4, i: '3+', d: '5/7', r: ['Penetración 1', 'Pesada (solo Reposicionarse)'] },
        { n: 'Puños',                             a: 4, i: '3+', d: '3/4', r: [] },
      ],
      ru: [],
    },
    {
      id: 'aullador', name: 'Aullador Amo de la Noche', type: 'AULLADOR',
      img: 'Imagenes/garra-nemesis-img/aullador.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['GARRA NÉMESIS', 'CAOS', 'ASTARTES HEREJES', 'AULLADOR'],
      w: [
        { n: 'Garras relámpago', a: 5, i: '3+', d: '4/5', r: ['Incesante', 'Letal 5+'] },
      ],
      ru: [
        { n: 'Aullador', t: 'Cuando un agente enemigo a 3" o menos de este agente dispare, combata o contraataque, tu oponente no podrá repetir sus dados de ataque.' },
        { n: 'Apetito por la crueldad', t: 'Cuando este agente combata contra un agente enemigo herido, las garras relámpago tienen la regla de arma Letal 4+.' },
      ],
    },
    {
      id: 'robapieles', name: 'Robapieles Amo de la Noche', type: 'ROBAPIELES',
      img: 'Imagenes/garra-nemesis-img/robapieles.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['GARRA NÉMESIS', 'CAOS', 'ASTARTES HEREJES', 'ROBAPIELES'],
      w: [
        { n: 'Pistola bólter',          a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Archa sierra de Nostramo', a: 5, i: '3+', d: '4/6', r: ['Desgarradora'] },
      ],
      ru: [
        { n: 'Arrancadle la piel', t: 'Una vez por punto de inflexión, cuando este agente incapacite a un agente enemigo en su zona de control, puedes elegir a otro agente enemigo a 6" o menos de este agente o del incapacitado y visible para él. Hasta el inicio del siguiente punto de inflexión, ese agente no puede controlar marcadores ni realizar acciones de Recoger marcador ni de misión.' },
        { n: 'Tirano de los pozos de desollado', t: 'Cuando este agente combate o contraataca, el Daño Normal y Crítico de 3 o más le inflige 1 daño menos.' },
      ],
    },
    {
      id: 'ventrilokar', name: 'Ventrilokar Amo de la Noche', type: 'VENTRILOKAR',
      img: 'Imagenes/garra-nemesis-img/ventrilokar.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['GARRA NÉMESIS', 'CAOS', 'ASTARTES HEREJES', 'PSÍQUICO', 'VENTRILOKAR'],
      w: [
        { n: 'Pistola bólter', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Espada sierra',  a: 5, i: '3+', d: '4/5', r: [] },
      ],
      ru: [
        { n: 'Portaicono', t: 'Al determinar el control de un marcador, trata el atributo LPA de este agente como si fuera 1 mayor. Esto no es un cambio al atributo LPA, de modo que cualquier cambio será acumulable con esto.' },
        { n: 'Imitación desconcertante (1PA)', t: 'PSÍQUICA. Elige un agente enemigo a 6" o menos. Elige una de las siguientes opciones (solo una vez por batalla cada una): • Hasta el final de su siguiente activación, resta 1 a su atributo LPA. • Cambia su orden. • Realiza una acción libre de Correr con él. No puede realizarse si está en zona de control enemiga.', isAct: true },
      ],
    },
    {
      id: 'combatiente', name: 'Combatiente Amo de la Noche', type: 'COMBATIENTE',
      img: 'Imagenes/garra-nemesis-img/combatiente.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['GARRA NÉMESIS', 'CAOS', 'ASTARTES HEREJES', 'COMBATIENTE'],
      w: [
        { n: 'Pistola bólter', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Bólter',         a: 4, i: '3+', d: '3/4', r: [] },
        { n: 'Espada sierra',  a: 5, i: '3+', d: '4/5', r: [] },
        { n: 'Puños',          a: 4, i: '3+', d: '3/4', r: [] },
      ],
      ru: [
        { n: 'Atormentador cruel', t: 'Cuando este agente dispara, combate o contraataca contra un agente enemigo lesionado o con un atributo Heridas de 7 o menos, las armas de este agente tienen la regla de arma Letal 5+.' },
      ],
    },
  ],

  // ── REGLAS GENERALES ───────────────────────────────────────
  gr: {
    concepts: [
      { n: 'Clarividencia', t: 'Recurso psíquico del Visionario. Se gana cada fase de estrategia (1D3 puntos) y se descarta al final de cada punto de inflexión. Se gasta para activar Corazonada o Portento.' },
      { n: 'Terrortoxinas', t: 'Ficha que se aplica a agentes enemigos o marcadores de objetivo. Un agente con la ficha sufre 1D3 daños cada vez que se activa.' },
      { n: 'Trofeo atroz', t: 'Ficha que obtiene un agente al incapacitar un enemigo a 2" o menos. Mientras la porta, resta 1 al atributo Ataque de las armas de enemigos a 2" o menos.' },
    ],
    orders: [
      { n: 'Orden de trabarse', t: 'El agente puede realizar acciones normalmente y reaccionar.' },
      { n: 'Orden de ocultarse', t: 'El agente no es blanco válido mientras esté a cubierto. No puede Disparar ni Cargar.' },
    ],
    phases: [
      { n: 'Fase de estrategia', t: 'Tira iniciativa. Ganan PM. El Visionario gana 1D3 puntos de Clarividencia. Los jugadores alternan usando GAMBITOS ESTRATÉGICOS o pasando.' },
      { n: 'Fase de tiroteo', t: 'Los jugadores alternan activando agentes hasta su LPA. Cada agente GARRA NÉMESIS puede realizar dos acciones de Combatir o dos de Disparar (Astartes). Todos pueden reaccionar sin importar su orden.' },
    ],
    actions: [
      { n: 'Reposicionarse', cost: '1PA', t: 'Mueve hasta MOV. No puede mover por zonas de control enemigas.' },
      { n: 'Correr',         cost: '1PA', t: 'Como Reposicionar, pero máx. 3", sin trepar, no en zona de control enemiga.' },
      { n: 'Cargar',         cost: '1PA', t: 'Como Reposicionar, +2" adicionales, debe terminar en zona de control enemiga.' },
      { n: 'Retroceder',     cost: '2PA', t: 'Como Reposicionar, puede pasar por zonas de control enemigas sin terminar ahí.' },
      { n: 'Disparar',       cost: '1PA', t: 'Elige arma y blanco válido. Tira dados de ataque. El defensor tira 3 dados de defensa.' },
      { n: 'Combatir',       cost: '1PA', t: 'Elige enemigo en zona de control; contraatacará. Ambos eligen arma y alternan Golpear o Bloquear.' },
    ],
    wr: [
      { n: 'Terrortoxinas*', t: 'Si infliges daño con un éxito crítico, el objetivo gana una ficha de Terrortoxinas (si no tiene ya una).' },
      { n: 'Desgarradora',   t: 'Si guardas algún éxito crítico, puedes guardar uno de tus éxitos normales como éxito crítico.' },
      { n: 'Letal 4+/5+',    t: 'Tus éxitos iguales o superiores a X son éxitos críticos.' },
      { n: 'Incesante',      t: 'Puedes repetir cualquiera de tus dados de ataque con un resultado concreto.' },
      { n: 'Brutal',         t: 'El oponente solo puede bloquear con éxitos críticos.' },
      { n: 'Choque',         t: 'La primera vez que golpees con crítico, descarta un éxito normal sin resolver del oponente.' },
      { n: 'Devastadora 3/4',t: 'Cada éxito crítico guardado inflige X daño adicional inmediato.' },
      { n: 'Área 2"',        t: 'Dispara también contra cada agente visible a 2" o menos del blanco primario.' },
      { n: 'Saturación',     t: 'El defensor no puede guardar salvaciones por cobertura.' },
      { n: 'Limitada 1',     t: 'El agente deja de tener esta arma tras usarla 1 vez.' },
      { n: 'Penetración 1/2',t: 'El defensor guarda X dados de defensa menos.' },
      { n: 'Críticos de penetración 1', t: 'Los éxitos críticos del atacante tienen Penetración 1 adicional.' },
      { n: 'Pesada (solo Reposicionarse)', t: 'Solo puede usarse si la única acción de movimiento fue Reposicionarse.' },
      { n: 'Ráfaga 1"/2"',   t: 'Dispara también contra blancos secundarios válidos a esa distancia.' },
      { n: 'Sobrecalentamiento', t: 'Tras usar esta arma, tira 1D6. Si el resultado es inferior al Impactar, sufres ese resultado × 2 de daño.' },
    ],
  },

  // ── REGLAS DE FACCIÓN ──────────────────────────────────────
  fr: {
    type: 'Reglas de facción',
    name: 'Garra Némesis — Amos de la Noche',
    text: 'Dos reglas de facción definen al comando: ASTARTES y ATAVIADOS DE MEDIANOCHE.',
    orders: [
      { n: 'Astartes', t: 'Durante la activación de cada agente GARRA NÉMESIS amigo, puede realizar o bien dos acciones de Combatir, o bien dos acciones de Disparar. Si elige dos de Disparar, debe usar una pistola bólter, un bólter o una pistola bólter con mirilla para al menos una. Cada agente GARRA NÉMESIS amigo puede reaccionar sin importar cuál sea su orden.' },
      { n: 'Ataviados de medianoche', t: 'Cuando un agente enemigo dispara contra un agente GARRA NÉMESIS amigo, dicho agente amigo está ofuscado si: (1) se encuentra a más de 8" de agentes enemigos para los que sea visible, y (2) tiene terreno Pesado en su zona de control, o cualquier parte de su peana se encuentra bajo terreno Aventajado.' },
    ],
  },

  // ── ARDIDES ────────────────────────────────────────────────
  pl: {
    s: [
      { n: 'La caza negra', t: 'Cuando un agente GARRA NÉMESIS amigo dispara, combate o contraataca contra un agente enemigo herido, puedes repetir uno de tus dados de ataque.' },
      { n: 'Avistar la presa', t: 'Cuando elijas un blanco válido para un agente GARRA NÉMESIS amigo, los agentes enemigos a 6" o menos de él no podrán usar terreno Ligero como cobertura. Esto puede permitir que sean tomados como blanco (si son visibles), pero no les niega la salvación por cobertura de la que dispongan.' },
      { n: 'Venimos a por vosotros', t: 'Cuando un agente GARRA NÉMESIS amigo es activado, si la primera acción es una acción de Cargar, al terminar su movimiento puedes infligir 1D3 daños a un agente enemigo en su zona de control.' },
      { n: 'Volver a la oscuridad', t: 'Un agente GARRA NÉMESIS amigo puede realizar de inmediato una acción libre de Retroceder o Reposicionarse, pero debe terminar con terreno Pesado en su zona de control o con cualquier parte de su peana bajo terreno Aventajado. No puede mover más de 4" ni terminar más cerca de agentes enemigos de lo que estaba.' },
    ],
    f: [
      { n: 'Vocogrito', t: 'Úsalo cuando tu oponente vaya a activar un agente enemigo visible para un agente GARRA NÉMESIS amigo. Tira 1D6: si el resultado es mayor que el LPA del agente enemigo, tu oponente no puede activarlo. Si es menor o igual, este ardid no se usa, recuperas los PM y no puedes volver a usarlo este punto de inflexión. Si no hay otros enemigos para activar, no tiene efecto. Coste creciente: 1PM la primera vez, 2PM la segunda, etc.' },
      { n: 'Muerte al falso Emperador', t: 'Úsalo tras tirar los dados de ataque de un agente GARRA NÉMESIS amigo, si dispara, combate o contraataca contra un enemigo con clave IMPERIUM. Las armas de ese agente tienen Incesante hasta el final de esa secuencia. Si el enemigo tiene también ADEPTUS ASTARTES, tienen Implacable en su lugar.' },
      { n: 'Predisposición homicida', t: 'Úsalo tras que un agente GARRA NÉMESIS amigo incapacite a un agente enemigo dentro de su zona de control. Ese agente amigo puede realizar de inmediato una acción libre de Cargar (máx. 3") o de Correr, incluso si ha realizado una acción que normalmente lo impediría.' },
      { n: 'Luchador rastrero', t: 'Úsalo cuando un agente GARRA NÉMESIS amigo contraataque, al inicio del paso de resolver dados de ataque. Puedes resolver uno de tus éxitos antes del orden normal. Si lo haces, no puedes resolver ningún otro éxito durante esa secuencia.' },
    ],
  },

  // ── EQUIPO ─────────────────────────────────────────────────
  eq: [
    { n: 'Piel desollada', t: 'Cuando un agente enemigo dispara, combate o contraataca contra un agente GARRA NÉMESIS amigo a 2" o menos de él, tu oponente no puede repetir sus dados de ataque con resultados de 1.' },
    { n: 'Gancho colgante', t: 'Cuando un agente enemigo vaya a Retroceder desde la zona de control de un agente GARRA NÉMESIS amigo, si no hay otros enemigos en esa zona de control, puedes usar esta regla. Tira dos D6 (o uno si ese enemigo tiene más Heridas que el agente amigo). Si cualquier resultado es 4+, dicho agente enemigo no puede realizar esa acción.' },
    { n: 'Trofeo atroz', t: 'Una vez por batalla, cuando un agente GARRA NÉMESIS amigo incapacite a un enemigo a 2" o menos, ese agente amigo obtiene una ficha de Trofeo atroz (si no tiene ya una). Mientras la porte y sea visible para un enemigo a 2" o menos, resta 1 al atributo Ataque de las armas de ese enemigo.' },
    { n: 'Inhibidores de comunicaciones', t: 'Siempre que un agente enemigo esté a 3" o menos de un agente GARRA NÉMESIS amigo, no se puede aumentar el atributo LPA de ese agente enemigo. No afecta a los atributos LPA que ya hayan sido cambiados.' },
  ],

  // ── ERRATAS ────────────────────────────────────────────────
  er: [
    {
      v: 'Octubre 2025',
      ee: [
        { s: 'Ardides de tiroteo — Vocogrito', t: 'Se añade coste creciente: 1PM la primera vez que se usa en la batalla, 2PM la segunda, y así sucesivamente.' },
        { s: 'Reglas de facción — Ataviados de medianoche', t: 'El primer punto cambia a: "Se encuentra a más de 8\\" de agentes enemigos para los que sea visible."' },
        { s: 'Equipo de facción — Inhibidores de comunicaciones', t: 'Cambia a: "Siempre que un agente enemigo esté a 3\\" o menos de un agente GARRA NÉMESIS amigo, [...]"' },
        { s: 'Ardides de tiroteo — ¡Muerte al falso Emperador!', t: 'La primera frase cambia a: "Úsalo después de tirar los dados de ataque de un agente GARRA NÉMESIS amigo, si está disparando, combatiendo o contraatacando contra un agente enemigo que tiene la clave IMPERIUM."' },
        { s: 'Ardides de estrategia — Volver a la oscuridad', t: 'Cambia la última frase a: "No puede mover más de 4\\" durante esa acción y no puede terminar ese movimiento más cerca de agentes enemigos de lo que estaba."' },
        { s: 'Agente Siembramiedos — Veneno de terrortoxinas', t: 'Cambia a: "Siempre que se active un agente que tenga 1 de tus fichas de terrortoxinas, inflígele 1D3 daños."' },
        { s: 'Agente Visionario — Clarividencia', t: 'Se añade: "Al final de cada punto de inflexión, descarta tus puntos de Clarividencia."' },
      ],
    },
  ],
};
