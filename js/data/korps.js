// ============================================================
//  data/korps.js — Korps de la Muerte
//  img: ruta local desde la raíz del proyecto
// ============================================================

FACTIONS['korps'] = {
  id: 'korps', name: 'Korps de la Muerte', subfaction: 'Astra Militarum',
  icon: '💀', img: 'Imagenes/korps.png', desc: 'Especialistas del Imperium en asedios, trincheras y combate en zonas de alta toxicidad.',
  tags: ['Imperium', 'Élite', 'Disparos'], version: '1.2',

  ops: [
    {
      id: 'vigia', name: 'Vigía de los Korps', type: 'VIGÍA',
      img: 'Imagenes/korps-img/vigia.jpg',
      s: { lpa: 3, mov: '6"', salv: '5+', h: 8 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'VIGÍA'],
      w: [
        { n: 'Pistola láser',   a: 4, i: '4+', d: '2/3', r: [] },
        { n: 'Pistola bólter',  a: 4, i: '3+', d: '3/4', r: [] },
        { n: 'Espada de poder', a: 4, i: '3+', d: '4/5', r: ['Severa'] },
        { n: 'Bayoneta',        a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Orden de mando', t: 'Una vez por activación, un agente KDM amigo apostado a 6" o menos puede recibir una ORDEN DE GUARDIA.' },
        { n: 'Sólido', t: 'Este agente puede recibir una ORDEN DE GUARDIA al inicio de cada punto de inflexión sin coste de PA.' },
      ],
    },
    {
      id: 'granadero', name: 'Granadero de los Korps', type: 'GRANADERO',
      img: 'Imagenes/korps-img/granadero.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'GRANADERO'],
      w: [
        { n: 'Rifle de plasma (estándar)',    a: 4, i: '3+', d: '4/5', r: ['Pesada'] },
        { n: 'Rifle de plasma (sobrecarga)',  a: 4, i: '2+', d: '5/6', r: ['Pesada', 'Sobrecalentamiento'] },
        { n: 'Lanzagranadas (fragmentación)', a: 4, i: '4+', d: '3/4', r: ['Área 2"', 'Pesada'] },
        { n: 'Lanzagranadas (perforante)',    a: 4, i: '4+', d: '4/5', r: ['Penetración 1', 'Pesada'] },
        { n: 'Bayoneta',                      a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Armadura reforzada', t: 'Este agente tiene salvación de 4+. Las heridas de daño normal de 4 o más se reducen en 1.' },
      ],
    },
    {
      id: 'lanzallamas', name: 'Portallamas de los Korps', type: 'PORTALLAMAS',
      img: 'Imagenes/korps-img/lanzallamas.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'PORTALLAMAS'],
      w: [
        { n: 'Lanzallamas', a: 5, i: '3+', d: '2/3', r: ['Ráfaga 6"', 'Saturación'] },
        { n: 'Bayoneta',    a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Bautismo de fuego', t: 'Cuando use el lanzallamas, los objetivos secundarios no pueden beneficiarse de cobertura por terreno.' },
      ],
    },
    {
      id: 'demoledor', name: 'Demoledor de los Korps', type: 'DEMOLEDOR',
      img: 'Imagenes/korps-img/demoledor.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'DEMOLEDOR'],
      w: [
        { n: 'Meltagun', a: 4, i: '3+', d: '5/8', r: ['Alcance 6"', 'Penetración 2'] },
        { n: 'Bayoneta', a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Carga explosiva (1PA)', t: 'APOYO. Coloca un marcador de Carga a 1" de este agente. Al inicio del siguiente punto de inflexión, cada agente a 3" recibe D3+1 heridas (sin salvación).', isAct: true },
      ],
    },
    {
      id: 'artillero', name: 'Artillero de los Korps', type: 'ARTILLERO',
      img: 'Imagenes/korps-img/artillero.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'ARTILLERO'],
      w: [
        { n: 'Cañón láser', a: 4, i: '3+', d: '6/8', r: ['Devastadora 2', 'Pesada'] },
        { n: 'Bayoneta',    a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Disparo de precisión', t: 'Cuando use el cañón láser y guarde al menos un éxito crítico, el objetivo pierde la cobertura hasta el final del punto de inflexión.' },
      ],
    },
    {
      id: 'medico', name: 'Médico de los Korps', type: 'MÉDICO',
      img: 'Imagenes/korps-img/medico.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'MÉDICO'],
      w: [
        { n: 'Rifle láser', a: 4, i: '4+', d: '2/3', r: [] },
        { n: 'Bayoneta',    a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: '¡Sanitario!', t: 'La primera vez por punto de inflexión que otro agente KDM amigo vaya a ser incapacitado, visible y a 3" o menos, puedes usarla: ese agente no queda incapacitado (le queda 1 herida) y puede Correr hacia este agente.' },
        { n: 'Botiquín (1PA)', t: 'Elige un agente KDM amigo en la zona de control para recuperar 2D3 heridas.', isAct: true },
      ],
    },
    {
      id: 'franco', name: 'Francotirador de los Korps', type: 'FRANCOTIRADOR',
      img: 'Imagenes/korps-img/franco.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'FRANCOTIRADOR'],
      w: [
        { n: 'Rifle telescópico (oculto)',  a: 4, i: '2+', d: '3/3', r: ['Devastadora 3', 'Pesada', 'Silenciosa'] },
        { n: 'Rifle telescópico (móvil)',   a: 4, i: '3+', d: '3/4', r: [] },
        { n: 'Rifle telescópico (inmóvil)', a: 4, i: '2+', d: '3/3', r: ['Devastadora 3', 'Pesada'] },
        { n: 'Bayoneta',                    a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Posición oculta', t: 'El rifle telescópico (oculto) solo puede usarse la primera vez que este agente realiza una acción de Disparar durante la batalla.' },
      ],
    },
    {
      id: 'soldado', name: 'Soldado de los Korps', type: 'SOLDADO',
      img: 'Imagenes/korps-img/soldado.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'SOLDADO'],
      w: [
        { n: 'Rifle láser', a: 4, i: '4+', d: '2/3', r: [] },
        { n: 'Bayoneta',    a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Activación en grupo', t: 'Cuando este agente quede usado, debes activar otro agente SOLDADO KDM amigo apostado antes de que active el oponente.' },
      ],
    },
    {
      id: 'zapador', name: 'Zapador de los Korps', type: 'ZAPADOR',
      img: 'Imagenes/korps-img/zapador.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'ZAPADOR'],
      w: [
        { n: 'Rifle láser',      a: 4, i: '4+', d: '2/3', r: [] },
        { n: 'Detonador remoto', a: 4, i: '2+', d: '5/6', r: ['Limitada 1', 'Penetración 1', 'Pesada', 'Silenciosa'] },
        { n: 'Bayoneta',         a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Plantar minas', t: 'Este agente lleva el marcador de Mina. Al colocar marcador puede realizar una acción libre de Correr.' },
        { n: 'Detonar', t: 'Dispara contra cada agente a 2" o menos del marcador de Mina. Ninguno está a cubierto. Al final retira el marcador.' },
      ],
    },
    {
      id: 'ojeador', name: 'Ojeador de los Korps', type: 'OJEADOR',
      img: 'Imagenes/korps-img/ojeador.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'OJEADOR'],
      w: [
        { n: 'Rifle láser',         a: 4, i: '4+', d: '2/3', r: [] },
        { n: 'Andanada de mortero', a: 4, i: '4+', d: '3/5', r: ['Área 2"', 'Pesada', 'Silenciosa'] },
        { n: 'Bayoneta',            a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Ojear (1PA)', t: 'APOYO. Elige un agente enemigo visible. Cuando un aliado a 3" dispare contra ese enemigo, sus armas tienen Buscadora y el enemigo no puede estar ofuscado.', isAct: true },
      ],
    },
    {
      id: 'veterano', name: 'Veterano de los Korps', type: 'VETERANO',
      img: 'Imagenes/korps-img/veterano.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'VETERANO'],
      w: [
        { n: 'Rifle láser',   a: 4, i: '4+', d: '2/3', r: [] },
        { n: 'Brazo biónico', a: 3, i: '4+', d: '4/5', r: [] },
      ],
      ru: [
        { n: 'Guardia veterano', t: 'Siempre que este agente es activado, puede recibir una ORDEN DE GUARDIA.' },
        { n: 'Biónico', t: 'El daño normal de 3 o más inflige 1 daño menos a este agente.' },
      ],
    },
    {
      id: 'voco', name: 'Vocooperador de los Korps', type: 'VOCOOPERADOR',
      img: 'Imagenes/korps-img/voco.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'VOCOOPERADOR'],
      w: [
        { n: 'Rifle láser', a: 4, i: '4+', d: '2/3', r: [] },
        { n: 'Bayoneta',    a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Transmitir órdenes', t: 'Una vez por punto de inflexión, al recibir una ORDEN DE GUARDIA, la transmite a todos los agentes KDM en zona de aniquilación.' },
        { n: 'Señal (1PA)', t: 'APOYO. Elige un aliado KDM distinto a 6" o menos y visible. Suma 1 a su LPA hasta el final de su siguiente activación.', isAct: true },
      ],
    },
    {
      id: 'fanatico', name: 'Fanático de los Korps', type: 'FANÁTICO',
      img: 'Imagenes/korps-img/fanatico.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 7 },
      kw: ['KORPS DE LA MUERTE', 'IMPERIUM', 'ASTRA MILITARUM', 'FANÁTICO'],
      w: [
        { n: 'Rifle láser', a: 4, i: '4+', d: '2/3', r: [] },
        { n: 'Bayoneta',    a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'El Emperador protege', t: 'Cuando un agente dispare contra este agente, puedes repetir cualquiera de tus dados de defensa.' },
        { n: 'Manual de campaña', t: 'APOYO. Siempre que un aliado KDM esté a 3" o menos, sus armas tienen Severa.' },
      ],
    },
  ],

  fr: {
    name: 'Órdenes de Guardia', type: 'GAMBITO ESTRATÉGICO y APOYO',
    text: 'Un agente VIGÍA KDM amigo puede dar una ORDEN DE GUARDIA a todos los aliados KDM a 6" o menos.',
    orders: [
      { n: '¡Apunten!',                t: 'Las armas a distancia (salvo andanada de mortero y detonador remoto) tienen Incesante.' },
      { n: '¡Fijen bayonetas!',        t: 'Las armas de combate tienen Incesante.' },
      { n: '¡Atrinchérense!',          t: 'Si se puede guardar salvación por cobertura, puedes repetir todos los dados de defensa con el mismo resultado.' },
      { n: '¡Vamos, vamos, muévanse!', t: 'Al Reposicionarse, suma 1" al Movimiento.' },
    ],
  },

  pl: {
    s: [
      { n: 'Tácticas de asedio',  t: 'Las armas a distancia de los aliados KDM tienen Saturación y Certera 1.' },
      { n: 'Ponerse a cubierto',  t: 'Cuando un agente dispare contra un aliado KDM con salvación por cobertura, mejora en 1 su Salvación.' },
      { n: '¡Acabad con ellos!',  t: 'Las armas de combate de los aliados KDM tienen Certera 1. Si combate en tu territorio o contraataca, tienen también Severa.' },
      { n: 'Reagruparse',         t: 'APOYO. Elige un aliado KDM a más de 3" de todo enemigo. Cada otro aliado a 5" o menos puede hacer una acción libre de Correr.' },
    ],
    f: [
      { n: 'Liderazgo inspirador',   t: 'APOYO. Durante la activación de un VIGÍA o SÓLIDO KDM amigo, ese agente da una ORDEN DE GUARDIA.' },
      { n: 'Disparos combinados',    t: 'Tras tirar dados de ataque contra un enemigo ya blanco de otro aliado KDM este punto de inflexión, puedes repetir cualquiera de tus dados.' },
      { n: 'Vergüenza en vida',      t: 'Cuando un aliado KDM reciba orden de trabarse, recibe también todas las ÓRDENES DE GUARDIA activas.' },
      { n: 'Expiación en la muerte', t: 'Cuando un aliado KDM apostado resulte incapacitado fuera de zona de control enemiga, puede realizar una acción libre antes de retirarse.' },
    ],
  },

  eq: [
    { n: 'Cronómetro',           t: 'GAMBITO ESTRATÉGICO, una vez por batalla. Cada aliado KDM en tu territorio puede hacer una acción libre de Correr.' },
    { n: 'Comunicador portátil', t: 'Cuando un VIGÍA o SÓLIDO KDM da una ORDEN DE GUARDIA, puedes elegir que afecte a un único aliado en lugar de a todos los que estén a 6".' },
    { n: 'Hachas de mano',       t: 'Los aliados KDM tienen: Hacha de mano (ATQ 3 / IMP 4+ / DAÑO 3/4).' },
    { n: 'Bombardeo con gas',    t: 'GAMBITO ESTRATÉGICO, una vez por batalla. Coloca el marcador de Gas. Todos los agentes a 3" o menos pierden 1 LPA.' },
  ],

  er: [
    { v: '1.2', ee: [
      { s: '¡Acabad con ellos!', t: 'Si un aliado KDM combate dentro de tu territorio o contraataca, sus armas tienen también Severa.' },
    ]},
    { v: 'Anteriores', ee: [
      { s: 'Agente Médico — ¡Sanitario!',              t: 'Si se usa durante la activación del agente amigo, dicha activación finaliza.' },
      { s: 'Reglas de Facción — Órdenes de Guardia',   t: '¡Apunten! excluye andanada de mortero y detonador remoto.' },
      { s: 'Ardides — Expiación en la muerte',         t: 'El agente está lesionado durante toda la acción libre.' },
    ]},
  ],

  gr: {
    concepts: [
      { n: 'Zona de control', t: 'Algo está dentro de la zona de control de un agente si es visible para él y está a menos de 1" de él.' },
      { n: 'Blanco válido',   t: 'Con orden de trabarse: visible. Con orden de ocultarse: visible y no a cubierto.' },
      { n: 'Visible',         t: 'Línea recta sin obstrucciones desde la cabeza del agente hasta cualquier parte del objetivo.' },
      { n: 'Cobertura',       t: 'Terreno interpuesto en la zona de control. No aplica si está a 2" o menos del atacante.' },
      { n: 'Herido / Lesionado / Incapacitado', t: 'Lesionado: menos de la mitad de heridas — pierde 2" de MOV y empeora en 1 su Impactar. Incapacitado: 0 heridas, se retira.' },
    ],
    orders: [
      { n: 'Orden de trabarse',  t: 'El agente puede realizar acciones normalmente y reaccionar.' },
      { n: 'Orden de ocultarse', t: 'El agente no es blanco válido mientras esté a cubierto. No puede Disparar ni Cargar.' },
    ],
    phases: [
      { n: 'Fase de estrategia',  t: 'Tira iniciativa. Ganan PM. Los jugadores alternan usando GAMBITOS ESTRATÉGICOS o pasando.' },
      { n: 'Fase de tiroteo',     t: 'Los jugadores alternan activando agentes hasta su LPA.' },
      { n: 'Reaccionar',          t: 'Si todos tus agentes están usados, uno con orden de trabarse puede reaccionar: acción libre de 1PA, sin mover más de 2".' },
      { n: 'Repetición de mando', t: 'Ardid universal (1PM). Puedes repetir uno de tus dados de ataque o defensa.' },
    ],
    actions: [
      { n: 'Reposicionar', cost: '1PA', t: 'Mueve hasta MOV. No puede mover por zonas de control enemigas.' },
      { n: 'Correr',       cost: '1PA', t: 'Como Reposicionar, pero máx. 3", sin trepar, no en zona de control enemiga.' },
      { n: 'Retroceder',   cost: '2PA', t: 'Como Reposicionar, puede pasar por zonas de control enemigas sin terminar ahí.' },
      { n: 'Cargar',       cost: '1PA', t: 'Como Reposicionar, +2" adicionales, debe terminar en zona de control enemiga.' },
      { n: 'Disparar',     cost: '1PA', t: 'Elige arma y blanco válido. Tira dados de ataque. El defensor tira 3 dados de defensa.' },
      { n: 'Combatir',     cost: '1PA', t: 'Elige enemigo en zona de control; contraatacará. Ambos eligen arma y alternan Golpear o Bloquear.' },
    ],
    wr: [
      { n: 'Alcance x"',        t: 'Solo agentes a esa distancia o menos pueden ser blancos válidos.' },
      { n: 'Área x"',           t: 'Dispara también contra cada agente visible a esa distancia o menos del blanco primario.' },
      { n: 'Brutal',            t: 'El oponente solo puede bloquear con éxitos críticos.' },
      { n: 'Castigadora',       t: 'Si guardas algún éxito crítico, puedes guardar uno de tus fallos como éxito normal.' },
      { n: 'Certera x',         t: 'Puedes guardar hasta X dados de ataque como éxitos normales sin tirarlos.' },
      { n: 'Choque',            t: 'La primera vez que golpees con crítico, descarta un éxito normal sin resolver del oponente.' },
      { n: 'Desgarradora',      t: 'Si guardas algún éxito crítico, puedes guardar uno de tus éxitos normales como éxito crítico.' },
      { n: 'Devastadora x',     t: 'Cada éxito crítico guardado inflige X daño adicional inmediato.' },
      { n: 'Equilibrada',       t: 'Puedes repetir 1 de tus dados de ataque.' },
      { n: 'Incesante',         t: 'Puedes repetir cualquiera de tus dados de ataque con un resultado concreto.' },
      { n: 'Letal x+',          t: 'Tus éxitos iguales o superiores a X son éxitos críticos.' },
      { n: 'Limitada x',        t: 'El agente deja de tener esta arma tras usarla X veces.' },
      { n: 'Penetración x',     t: 'El defensor guarda X dados de defensa menos.' },
      { n: 'Pesada',            t: 'No se puede usar si el agente ha movido, ni mover tras usarla.' },
      { n: 'Ráfaga x"',         t: 'Dispara también contra blancos secundarios válidos a esa distancia.' },
      { n: 'Saturación',        t: 'El defensor no puede guardar salvaciones por cobertura.' },
      { n: 'Severa',            t: 'Si no guardas ningún éxito crítico, puedes cambiar un éxito normal a crítico.' },
      { n: 'Silenciosa',        t: 'Puede usarse aunque el agente tenga orden de ocultarse.' },
      { n: 'Sobrecalentamiento', t: 'Tras usar esta arma, tira 1D6. Si el resultado es inferior al Impactar, sufres ese resultado × 2 de daño.' },
    ],
  },
};
