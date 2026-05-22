// ============================================================
//  data/sucesores.js — Sucesores Recuperadores
//  img: ruta local desde la raíz del proyecto
// ============================================================

FACTIONS['sucesores'] = {
  id: 'sucesores', name: 'Sucesores Recuperadores', subfaction: 'Ligas de los Votann',
  icon: '⛏️', img: 'Imagenes/sucesores.png', desc: 'Guerreros Kin especializados en recuperación de recursos en pecios espaciales y zonas hostiles.',
  tags: ['Votann', 'Reconocimiento', 'Seguridad'], version: '1.2',

  ops: [
    {
      id: 'theyn', name: 'Theyn Sucesor', type: 'LÍDER',
      img: 'Imagenes/sucesores-img/theyn.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 9 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'LÍDER', 'THEYN'],
      w: [
        { n: 'Bláster iónico',               a: 4, i: '4+', d: '3/4', r: ['Críticos de penetración 1'] },
        { n: 'Bólter modelo Autoch',         a: 4, i: '4+', d: '3/4', r: ['Certera 1'] },
        { n: 'Pistola bólter modelo Autoch', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"', 'Certera 1'] },
        { n: 'Pistola de iones',             a: 4, i: '3+', d: '3/4', r: ['Alcance 8"', 'Críticos de penetración 1'] },
        { n: 'Pistola de plasma EtaCarn',    a: 4, i: '4+', d: '3/5', r: ['Alcance 8"', 'Penetración 1'] },
        { n: 'Rebóltver',                    a: 4, i: '3+', d: '3/5', r: ['Alcance 8"'] },
        { n: 'Arma de plasma',               a: 4, i: '3+', d: '4/6', r: ['Letal 5+'] },
        { n: 'Guantelete conmocionador',     a: 4, i: '4+', d: '5/7', r: ['Brutal', 'Choque'] },
      ],
      ru: [
        { n: 'Ojo de los ancestros', t: 'GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación. Elige un agente enemigo (o hasta dos si hay tres o más aliados incapacitados). Cada uno gana una de tus fichas de Agravio.' },
        { n: 'Cresta de campo entrelazado', t: '1 vez por batalla, cuando un dado de ataque inflija Daño normal a este agente, puedes ignorar ese daño infligido.' },
      ],
    },
    {
      id: 'bulldozer', name: 'Sucesor Bulldôzer', type: 'BULLDÔZER',
      img: 'Imagenes/sucesores-img/bulldozer.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'BULLDÔZER'],
      w: [
        { n: 'Pistola bólter modelo Autoch', a: 4, i: '4+', d: '3/4', r: ['Alcance 8"', 'Certera 1'] },
        { n: 'Nudillos de conmoción',        a: 4, i: '3+', d: '4/4', r: ['Choque', 'Incesante', 'Letal 5+'] },
      ],
      ru: [
        { n: 'Peleador', t: 'Cuando combata o contraataque: los enemigos no pueden asistir. Si resulta incapacitado, puedes golpear con un éxito sin resolver. El Daño normal de 4 o más le inflige 1 daño menos.' },
        { n: 'Nudillazo brutal (1PA)', t: 'Elige un enemigo en la zona de control. Puedes moverlo hasta 3". Inflígele 1D3+1 daños. Si el D3 es 3, resta 1 al LPA enemigo. A continuación puede Cargar libremente (máx. 3").', isAct: true },
      ],
    },
    {
      id: 'medico', name: 'Sucesor Médico de Campo', type: 'MÉDICO DE CAMPO',
      img: 'Imagenes/sucesores-img/medico.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'MÉDICO', 'MÉDICO DE CAMPO'],
      w: [
        { n: 'Rebóltver',          a: 4, i: '4+', d: '3/5', r: ['Alcance 8"'] },
        { n: 'Cuchillo de plasma', a: 4, i: '4+', d: '3/5', r: ['Letal 5+'] },
      ],
      ru: [
        { n: '¡Sanitario!', t: 'La primera vez por punto de inflexión que otro aliado vaya a resultar incapacitado, visible y a 3" o menos, si ninguno está en zona de control enemiga: ese agente no queda incapacitado (le queda 1 herida) y puede Correr hacia este agente. Resta 1 al LPA de ambos.' },
        { n: 'Botiquín (1PA)', t: 'Elige un aliado en la zona de control para recuperar 2D3 heridas. No posible en zona de control enemiga.', isAct: true },
      ],
    },
    {
      id: 'granadero', name: 'Sucesor Granadero', type: 'GRANADERO',
      img: 'Imagenes/sucesores-img/granadero.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'GRANADERO'],
      w: [
        { n: 'Pistola bólter modelo Autoch', a: 4, i: '4+', d: '3/4', r: ['Alcance 8"', 'Certera 1'] },
        { n: 'Carga C8 HX',                 a: 4, i: '3+', d: '4/6', r: ['Alcance 4"', 'Área 1"', 'Limitada 1', 'Penetración 1', 'Pesada (solo Reposicionarse)', 'Saturación'] },
        { n: 'Puños',                        a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Granadero', t: 'Puede usar granadas frag, perforantes, de humo y aturdidoras sin contar para los usos limitados de otros agentes. Al usar granada frag o perforante, mejora en 1 el Impactar.' },
        { n: 'Granada especial Vâyr-3 (1PA)', t: 'Coloca un marcador de Granada especial a 6" o menos. Los agentes a 3" o menos deben gastar 1PA adicional para Recoger marcador y acciones de misión.', isAct: true },
      ],
    },
    {
      id: 'tirador', name: 'Sucesor Tirador', type: 'TIRADOR',
      img: 'Imagenes/sucesores-img/tirador.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'TIRADOR'],
      w: [
        { n: 'Cañón rotativo LasMAX (concentrado)', a: 5, i: '4+', d: '4/5', r: ['Incesante', 'Pesada (solo Reposicionarse)', 'Saturación'] },
        { n: 'Cañón rotativo LasMAX (barrido)',     a: 4, i: '4+', d: '4/5', r: ['Incesante', 'Pesada (solo Reposicionarse)', 'Saturación', 'Ráfaga 1"'] },
        { n: 'Fusil lineal magnético',              a: 4, i: '4+', d: '4/2', r: ['Devastadora 3', 'Pesada (solo Correr)', 'Penetración 2'] },
        { n: 'Haz de plasma EtaCarn',               a: 4, i: '4+', d: '5/6', r: ['Penetración 1', 'Haz*'] },
        { n: 'Lanzamisiles L7 (área)',               a: 4, i: '4+', d: '3/5', r: ['Área 2"'] },
        { n: 'Lanzamisiles L7 (concentrado)',        a: 4, i: '4+', d: '5/6', r: ['Penetración 1'] },
        { n: 'Rifle automático LasMAX',              a: 4, i: '4+', d: '3/5', r: ['Incesante', 'Desgarradora'] },
        { n: 'Puños',                                a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Haz*', t: 'Cada éxito crítico con el Haz de plasma EtaCarn inflige 1D3 daños a cada agente a lo largo de una línea de haz (sin atravesar terreno Pesado). El blanco no resulta afectado.' },
      ],
    },
    {
      id: 'propulsor', name: 'Sucesor con Propulsor de Salto', type: 'PROPULSOR DE SALTO',
      img: 'Imagenes/sucesores-img/propulsor.jpg',
      s: { lpa: 2, mov: '8"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'SUCESOR CON PROPULSOR DE SALTO'],
      w: [
        { n: 'Pistola bólter modelo Autoch', a: 4, i: '4+', d: '3/4', r: ['Alcance 8"', 'Certera 1'] },
        { n: 'Arma de plasma',              a: 4, i: '3+', d: '4/6', r: ['Letal 5+', 'Impacto brutal*'] },
        { n: 'Puños',                        a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Propulsor de salto', t: 'Al moverse puede VOLAR: retíralo y colócalo a una distancia igual o menor a su MOV en horizontal. No puede terminar en zona de control enemiga salvo al Cargar.' },
        { n: 'Impacto brutal*', t: 'Si ha Cargado durante la activación, el Arma de plasma tiene la regla Brutal.' },
      ],
    },
    {
      id: 'radiovinculado', name: 'Sucesor Radiovinculado', type: 'RADIOVINCULADO',
      img: 'Imagenes/sucesores-img/radiovinculado.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'RADIOVINCULADO'],
      w: [
        { n: 'Bólter modelo Autoch', a: 4, i: '4+', d: '3/4', r: ['Certera 1'] },
        { n: 'Bláster iónico',       a: 4, i: '4+', d: '3/4', r: ['Críticos de penetración 1'] },
        { n: 'Puños',                a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Señal (1PA)', t: 'APOYO. Elige 1 aliado diferente en la zona de aniquilación, a 6" o menos y visible. Suma 1 a su LPA hasta el final de su siguiente activación.', isAct: true },
        { n: 'Interferir sistemas (1PA)', t: 'Elige un enemigo blanco válido sin ficha de Interferir sistemas; ese agente la gana y no podrá activarse hasta que cada enemigo sin ficha haya quedado usado.', isAct: true },
      ],
    },
    {
      id: 'analista', name: 'Sucesor Anâlista', type: 'ANÂLISTA',
      img: 'Imagenes/sucesores-img/analista.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'ANÂLISTA'],
      w: [
        { n: 'Bólter modelo Autoch', a: 4, i: '4+', d: '3/4', r: ['Certera 1'] },
        { n: 'Bláster iónico',       a: 4, i: '4+', d: '3/4', r: ['Críticos de penetración 1'] },
        { n: 'Puños',                a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Táctico', t: 'GAMBITO ESTRATÉGICO si está en la zona de aniquilación. Coloca tu marcador de Ataque o Defensa. Las armas de los aliados que ataquen a enemigos a 3" del marcador de Ataque tienen Equilibrada. Puedes repetir un dado de defensa contra enemigos a 3" del marcador de Defensa.' },
        { n: 'Evaluación apresurada (1PA)', t: 'Retira tu marcador de Ataque o Defensa y coloca uno nuevo. No posible en zona de control enemiga.', isAct: true },
      ],
    },
    {
      id: 'localizador', name: 'Sucesor Locâlizador', type: 'LOCÂLIZADOR',
      img: 'Imagenes/sucesores-img/localizador.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'LOCÂLIZADOR'],
      w: [
        { n: 'Bólter modelo Autoch', a: 4, i: '4+', d: '3/4', r: ['Certera 1'] },
        { n: 'Bláster iónico',       a: 4, i: '4+', d: '3/4', r: ['Críticos de penetración 1'] },
        { n: 'Puños',                a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Avistar (1PA)', t: 'APOYO. Elige un enemigo visible. Hasta el final del punto de inflexión, cuando un aliado a 3" dispare contra ese enemigo, sus armas tienen Buscadora y ese enemigo no puede estar ofuscado.', isAct: true },
        { n: 'Escaneo panespectral (1PA)', t: 'Coloca tu marcador de Escaneo. Cuando un aliado dispare contra un enemigo a 3" o menos del marcador, sus armas tienen Saturación.', isAct: true },
      ],
    },
    {
      id: 'sherpa', name: 'Sucesor Sherpa', type: 'SHERPA',
      img: 'Imagenes/sucesores-img/sherpa.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'SHERPA'],
      w: [
        { n: 'Bólter modelo Autoch', a: 4, i: '4+', d: '3/4', r: ['Certera 1'] },
        { n: 'Bláster iónico',       a: 4, i: '4+', d: '3/4', r: ['Críticos de penetración 1'] },
        { n: 'Puños',                a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Buenos suministros', t: 'Puedes seleccionar una opción de equipo adicional y obtienes 1 PM adicional en el Paso de preparación de la primera fase de estrategia.' },
        { n: '¡Yo me encargo!',    t: 'Una vez por activación, puede realizar una acción de misión por 1PA menos.' },
      ],
    },
    {
      id: 'combatiente', name: 'Sucesor Combatiente', type: 'COMBATIENTE',
      img: 'Imagenes/sucesores-img/combatiente.jpg',
      s: { lpa: 2, mov: '5"', salv: '3+', h: 8 },
      kw: ['SUCESOR RECUPERADOR', 'LIGAS DE LOS VOTANN', 'COMBATIENTE'],
      w: [
        { n: 'Bólter modelo Autoch', a: 4, i: '4+', d: '3/4', r: ['Certera 1'] },
        { n: 'Bláster iónico',       a: 4, i: '4+', d: '3/4', r: ['Críticos de penetración 1'] },
        { n: 'Puños',                a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Asegurar restos', t: 'Cuando un enemigo ataque a este agente mientras disputa un marcador de objetivo o de misión, puedes restar 1 al daño infligido debido a uno de los éxitos.' },
      ],
    },
  ],

  fr: {
    name: 'Agravio', type: 'REGLA DE FACCIÓN',
    text: 'Cuando un agente enemigo incapacite a un aliado SUCESOR RECUPERADOR, ese enemigo gana una de tus fichas de Agravio para esa batalla.',
    orders: [
      { n: 'Efecto del Agravio', t: 'Cuando un aliado dispare, combata o contraataque contra un enemigo, por cada ficha de Agravio que tenga ese enemigo puedes guardar uno de tus éxitos normales como éxito crítico. Las fichas no se retiran al hacer esto.' },
    ],
  },

  pl: {
    s: [
      { n: 'La necesidad mantiene',     t: 'Elige un marcador. El LPA total de los aliados que lo disputen se trata como 1 mayor. Cuando un aliado esté a 3" o menos, suma 1 al ATQ de sus armas de combate (máx. 4; si ya tiene 4, obtiene Equilibrada).' },
      { n: 'El trabajo obtiene',         t: 'Elige un marcador. Cuando un enemigo esté a 3" o menos de ese marcador, trátalo como si tuviera un marcador adicional de Agravio.' },
      { n: 'Defensa templada',           t: 'Siempre que un agente dispare contra un aliado, si sacaste 0-1 éxitos (incluyendo repeticiones), puedes guardar 1 de tus fallos como éxito.' },
      { n: 'Potencia de fuego cercana', t: 'Cuando un aliado dispare contra un enemigo a 6" o menos, mejora en 1 el Impactar de sus armas a distancia (máx. 3+).' },
    ],
    f: [
      { n: 'Los ancestros nos observan', t: 'Durante la activación de un aliado, puede realizar una acción libre de Combatir o Disparar, e ignorar cambios a atributos de arma por estar lesionado.' },
      { n: 'Esfuerzo final',             t: 'Cuando un aliado resulte incapacitado, puede realizar una acción libre de misión antes de ser retirado.' },
      { n: 'Robusto',                    t: 'Al reunir dados de defensa cuando disparen contra un aliado, cambia los éxitos críticos del atacante por éxitos normales.' },
      { n: 'Trabarse por la recompensa', t: 'Tras tirar dados de ataque con un aliado que dispara o combate contra un enemigo que controle un marcador de objetivo o de misión, puedes repetir algunos o todos los dados.' },
    ],
  },

  eq: [
    { n: 'Cuchillos de plasma',       t: 'Los aliados tienen: Cuchillo de plasma (ATQ 3 / IMP 4+ / DAÑO 3/5 / Letal 5+). El MÉDICO DE CAMPO ya lo tiene con mejores atributos.' },
    { n: 'Anclajes',                   t: 'Durante la activación de cada aliado, puedes: tratar la distancia vertical al trepar como 2"; o ignorar la distancia vertical al caer.' },
    { n: 'Herramientas de excavación', t: 'Los aliados pueden Recoger marcador por 1PA menos y no tienen que controlar el marcador (solo disputarlo).' },
    { n: 'Mandato de Reclamación',     t: '1 vez por batalla, si los aliados disputan dos o más marcadores de objetivo, tras desempatar para la iniciativa puedes repetir tu tirada.' },
  ],

  er: [
    { v: 'Abril 2026', ee: [
      { s: 'Los ancestros nos observan',    t: 'El agente puede realizar acción libre de Combatir o Disparar e ignorar cambios a atributos de arma por estar lesionado.' },
      { s: 'Agente con Propulsor de Salto', t: 'Cambia su atributo Movimiento a "8".' },
      { s: 'Agente Sherpa — Buenos suministros', t: 'Obtiene 1 PM adicional en el Paso de preparación de la primera fase de estrategia.' },
    ]},
    { v: 'Anteriores', ee: [
      { s: 'Reglas de Facción — Agravio',           t: 'Puedes guardar 1 éxito normal como éxito crítico (incluyendo los guardados por la regla Precisión).' },
      { s: 'Ardides — La necesidad mantiene',       t: 'Si el arma ya tiene ATQ 4, obtiene Equilibrada.' },
      { s: 'Ardides — Potencia de fuego cercana',   t: 'Puede aplicarse o retirarse durante una acción.' },
      { s: 'Agente Médico de Campo — ¡Sanitario!',  t: 'Si se usó durante la activación del agente amigo, esa activación finaliza.' },
      { s: 'Agente Theyn — Ojo de los ancestros',   t: 'GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación.' },
      { s: 'Agente Bulldôzer — Agresivo',           t: 'El Daño normal de 4 o más le inflige 1 daño menos.' },
      { s: 'Agente Radiovinculado — Señal',         t: 'Elige 1 aliado diferente que esté en la zona de aniquilación.' },
      { s: 'Agente Anâlista — Táctico',             t: 'GAMBITO ESTRATÉGICO si este agente está en la zona de aniquilación.' },
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
      { n: 'Alcance x"',               t: 'Solo agentes a esa distancia o menos pueden ser blancos válidos.' },
      { n: 'Área x"',                  t: 'Dispara también contra cada agente visible a esa distancia o menos del blanco primario.' },
      { n: 'Brutal',                   t: 'El oponente solo puede bloquear con éxitos críticos.' },
      { n: 'Certera x',                t: 'Puedes guardar hasta X dados de ataque como éxitos normales sin tirarlos.' },
      { n: 'Choque',                   t: 'La primera vez que golpees con crítico, descarta un éxito normal sin resolver del oponente.' },
      { n: 'Críticos de penetración x',t: 'Los éxitos críticos del atacante tienen Penetración X adicional.' },
      { n: 'Desgarradora',             t: 'Si guardas algún éxito crítico, puedes guardar uno de tus éxitos normales como éxito crítico.' },
      { n: 'Devastadora x',            t: 'Cada éxito crítico guardado inflige X daño adicional inmediato.' },
      { n: 'Equilibrada',              t: 'Puedes repetir 1 de tus dados de ataque.' },
      { n: 'Incesante',                t: 'Puedes repetir cualquiera de tus dados de ataque con un resultado concreto.' },
      { n: 'Letal x+',                 t: 'Tus éxitos iguales o superiores a X son éxitos críticos.' },
      { n: 'Limitada x',               t: 'El agente deja de tener esta arma tras usarla X veces.' },
      { n: 'Penetración x',            t: 'El defensor guarda X dados de defensa menos.' },
      { n: 'Pesada',                   t: 'No se puede usar si el agente ha movido, ni mover tras usarla.' },
      { n: 'Ráfaga x"',                t: 'Dispara también contra blancos secundarios válidos a esa distancia.' },
      { n: 'Saturación',               t: 'El defensor no puede guardar salvaciones por cobertura.' },
      { n: 'Severa',                   t: 'Si no guardas ningún éxito crítico, puedes cambiar un éxito normal a crítico.' },
    ],
  },
};
