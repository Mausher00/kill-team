// ============================================================
//  data/demoledorez.js — Demoledorez (Wrecka Krew)
//  img: ruta local desde la raíz del proyecto
// ============================================================

FACTIONS['demoledorez'] = {
  id: 'demoledorez', name: 'Demoledorez', subfaction: 'Orkos',
  icon: '💥',  img: 'Imagenes/demoledorez.png',
  desc: 'Orkos obsesionados con la destrucción. Cuanto más atacan, más puntos de Demolizión generan y más letales se vuelven.',
  tags: ['Caos Orko', 'Élite', 'Buscar y Destruir', 'Seguridad'], version: '1.2',

  ops: [
    {
      id: 'noble-jefazo', name: 'Noble Jefazo Demoledorez', type: 'LÍDER',
      img: 'Imagenes/demoledorez-img/noble-jefazo.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 14 },
      kw: ['DEMOLEDOREZ', 'ORKO', 'LÍDER', 'NOBLE JEFAZO'],
      w: [
        { n: 'Piztola lanzakobetez',                    a: 6, i: '5+', d: '4/5', r: ['Alcance 8"', 'Área 1"'] },
        { n: 'Dos pistolaz lanzakobetez (concentrado)', a: 6, i: '4+', d: '4/5', r: ['Alcance 8"', 'Área 1"', 'Incesante'] },
        { n: 'Dos pistolaz lanzakobetez (salva)',       a: 6, i: '5+', d: '4/5', r: ['Alcance 8"', 'Área 1"', 'Salva*'] },
        { n: 'Rebanadora',                              a: 4, i: '3+', d: '4/5', r: [] },
        { n: 'Martillo brutal',                         a: 4, i: '3+', d: '5/6', r: ['Brutal'] },
      ],
      ru: [
        { n: 'Jefe Demoledorez', t: 'Cuando este agente realice una acción de Combatir o Disparar (salvo Ponerse en guardia), ganas 1 punto de Demolizión.' },
        { n: 'Salva*', t: 'Elige hasta 2 blancos válidos diferentes que no estén en la zona de control de agentes amigos. Dispara con esta arma a ambos blancos principales en el orden que elijas, y luego a todos los blancos secundarios restantes. No puedes disparar a cada blanco más de una vez durante la acción.' },
      ],
    },
    {
      id: 'garrapato-bomba', name: 'Garrapato Bomba Demoledorez', type: 'GARRAPATO BOMBA',
      img: 'Imagenes/demoledorez-img/garrapato-bomba.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 5 },
      kw: ['DEMOLEDOREZ', 'ORKO', 'GARRAPATO BOMBA'],
      w: [
        { n: 'Explozivoz',    a: 6, i: '4+', d: '4/5', r: ['Área 1"', 'Limitada 1', 'Explosiva*'] },
        { n: 'Mordizquitoz', a: 3, i: '4+', d: '4/5', r: [] },
      ],
      ru: [
        { n: 'Explosiva*', t: 'Este agente puede realizar la acción Disparar con esta arma mientras esté en la zona de control de un agente enemigo. No selecciones un blanco válido. Este agente siempre es el blanco principal y no puede estar tras cobertura u ofuscado.' },
        { n: 'Eztúpido', t: 'Durante la fase de tiroteo, al determinar la orden de este agente, no puedes elegir ocultarse. Este agente no puede realizar otras acciones que no sean Cargar, Combatir, Correr, Disparar o Reposicionarse, ni usar armas que no figuren en su tarjeta de datos.' },
        { n: '¡Bum!', t: 'Si este agente queda incapacitado sin haber usado sus explozivoz, tira un D6 (o dos D6 si quieres). Si algún dado saca 4+, este agente realiza una acción libre de Disparar con sus explozivoz antes de ser retirado.' },
        { n: 'Prescindible', t: 'Este agente se ignora en las operaciones de asesinato/eliminación del oponente y a la hora de determinar el número inicial de agentes. También se ignora para condiciones de victoria y puntuar PV si requiere que agentes escapen, sobrevivan o queden incapacitados.' },
      ],
    },
    {
      id: 'tronchademoledor', name: 'Tronchademoledor', type: 'TRONCHADOR',
      img: 'Imagenes/demoledorez-img/tronchademoledor.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 12 },
      kw: ['DEMOLEDOREZ', 'ORKO', 'TRONCHADOR', 'DEMOLEDOR'],
      w: [
        { n: 'Palokabum (golpetazo)', a: 4, i: '3+', d: '4/5', r: [] },
        { n: 'Palokabum (detonar)',   a: 4, i: '3+', d: '*',   r: ['Letal 5+', 'Limitada 1', 'Detonar*'] },
      ],
      ru: [
        { n: 'Temperamento temerario', t: 'El daño normal de 4 o más inflige 1 daño menos a este agente. Si tiene una orden de Trabarse, el daño crítico de 4 o más también inflige 1 daño menos.' },
        { n: 'Detonar*', t: 'La primera vez que fuese a infligir daño con este perfil durante la batalla, inflige por separado 1D6+6 de daño a ese agente y a cada otro agente dentro de su zona de control si es un éxito normal, o 2D6+6 si es un éxito crítico. Luego la acción termina y ganas 1 punto de Demolizión, más 1 por cada agente incapacitado durante esa acción. El daño no puede ignorarse ni reducirse.' },
      ],
    },
    {
      id: 'tronchapeleon', name: 'Tronchapeleón', type: 'TRONCHADOR',
      img: 'Imagenes/demoledorez-img/tronchapeleon.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 12 },
      kw: ['DEMOLEDOREZ', 'ORKO', 'TRONCHADOR', 'LUCHADOR'],
      w: [
        { n: 'Martillo brutal', a: 4, i: '3+', d: '5/6', r: ['Brutal'] },
      ],
      ru: [
        { n: 'Romper Kozaz (1PA)', t: 'Selecciona un elemento de terreno en la zona de control de este agente. Si es terreno equipo, retíralo. Si no, sitúa una ficha de Brecha en la zona de control de este agente lo más cerca posible de ese terreno. Cuando un agente esté a 1" o menos de esa ficha, considera como terreno Accesible las partes de ese elemento con no más de 1" de grosor. No posible en zona de control enemiga ni sin terreno en su zona de control.', isAct: true },
      ],
    },
    {
      id: 'tronchamachakador', name: 'Tronchamachakador', type: 'TRONCHADOR',
      img: 'Imagenes/demoledorez-img/tronchamachakador.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 12 },
      kw: ['DEMOLEDOREZ', 'ORKO', 'TRONCHADOR', 'MACHAKADOR'],
      w: [
        { n: 'Kiebranudilloz', a: 4, i: '3+', d: '5/6', r: ['Brutal', 'Choque', 'Destrozar*'] },
      ],
      ru: [
        { n: 'Destrozar*', t: 'Cuando golpees, puedes mover en línea recta al agente enemigo hasta 1". Debe terminar más lejos de este agente en un lugar donde pueda situarse. A continuación, mueve a este agente en línea recta hasta 1", terminando en la zona de control del enemigo (si no es posible, no puedes moverlo).' },
        { n: 'Blindado', t: 'Cuando un agente enemigo dispare a este agente, o este agente combata o contraataque, tu oponente no puede guardar como éxitos críticos los resultados de dados de ataque inferiores a 6 (p.ej. por las reglas Letal, Desgarradora o Severa).' },
      ],
    },
    {
      id: 'artillero-petatankez', name: 'Artillero Petatankez', type: 'PETATANKEZ',
      img: 'Imagenes/demoledorez-img/artillero-petatankez.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 12 },
      kw: ['DEMOLEDOREZ', 'ORKO', 'PETATANKEZ', 'ARTILLERO'],
      w: [
        { n: 'Lanzakobetez',        a: 6, i: '5+', d: '4/5', r: ['Área 1"'] },
        { n: 'Lanzakobetez pezado', a: 6, i: '4+', d: '4/5', r: ['Área 1"', 'Pesada (solo Correr)'] },
        { n: 'Puñoz',               a: 3, i: '3+', d: '3/4', r: [] },
      ],
      ru: [
        { n: 'Ramalazo kompetitivo', t: 'Una vez por acción de Disparar, si este agente dispara a un agente enemigo al que otro aliado haya disparado durante este punto de inflexión, ganas 1 punto de Demolizión. Determina esto al seleccionar el blanco válido, pudiendo incluir objetivos secundarios (p.ej. por Área).' },
      ],
    },
    {
      id: 'kobeteador-petatankez', name: 'Kobeteador Petatankez', type: 'PETATANKEZ',
      img: 'Imagenes/demoledorez-img/kobeteador-petatankez.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 12 },
      kw: ['DEMOLEDOREZ', 'ORKO', 'PETATANKEZ', 'KOBETEADOR'],
      w: [
        { n: 'Kobete induktor',    a: 6, i: '5+', d: '—',   r: ['Pesada (solo Reposicionarse)', 'Limitada 1', 'Indukzión*'] },
        { n: 'Lanzakobetez',      a: 6, i: '5+', d: '4/5', r: ['Área 1"'] },
        { n: 'Batería de kobetez', a: 6, i: '5+', d: '4/5', r: ['Área 2"', 'Pesada (solo Reposicionarse)', 'Limitada 1', 'Implacable'] },
        { n: 'Puñoz',              a: 3, i: '3+', d: '3/4', r: [] },
      ],
      ru: [
        { n: 'Indukzión*', t: 'No selecciones blanco. Sitúa tu marcador de Indukzión visible para este agente o en terreno ventajoso. Gana 1 punto de Indukzión + 1 por cada éxito al tirar dados de ataque (máx. 3 adicionales). Inflige 1D3 de daño por separado a cada agente a X" o menos del marcador, donde X = puntos de Indukzión. Luego finaliza la acción.' },
        { n: 'Onda de choke', t: 'Siempre que un agente esté a X" o menos del marcador de Indukzión (X = puntos del marcador), empeora en 1 el atributo Imp de sus armas y resta 2" a su MOV. Se acumula con los efectos de estar herido. En el paso de preparación de cada fase de estrategia, resta 1 a los puntos de Indukzión del marcador; si llega a 0, se retira.' },
      ],
    },
  ],

  fr: {
    name: 'Embestida Demoledora', type: 'REGLA DE FACCIÓN',
    text: 'Cuando un agente DEMOLEDOREZ amigo dispare, combata o contraataque, en el paso de tirar dados de ataque: por cada resultado de 6 guardado, ganas 1 punto de Demolizión. Puedes gastar hasta 2 puntos de Demolizión (el GARRAPATO BOMBA no puede gastar ninguno): por cada punto gastado, guarda uno de tus fallos como éxito normal. Puedes ganar y perder puntos durante la misma acción en el orden que elijas, salvo si empezaste la acción con 6, en cuyo caso solo puedes gastarlos.',
    orders: [
      { n: 'Hazta laz cejaz', t: 'La primera vez que un agente DEMOLEDOREZ amigo (salvo GARRAPATO BOMBA) con una orden de Trabarse realice tanto la acción Cargar como la de Disparar o Combatir (salvo Ponerse en guardia) durante cada una de sus activaciones/reacciones, suma 1 a su atributo LPA hasta el inicio de su siguiente activación. El bono se suma al inicio de la acción Cargar, antes de mover.' },
      { n: 'Demolizión', t: 'Recurso compartido del comando. Se gana con resultados de 6 en dados de ataque, con la regla Jefe Demoledorez y con la regla Detonar*. Se gasta para convertir fallos en éxitos (máx. 2 por acción, salvo GARRAPATO BOMBA que no puede gastar ninguno).' },
    ],
  },

  pl: {
    s: [
      { n: '¡Waaagh!',    t: 'Las armas de combate de los agentes DEMOLEDOREZ amigos tienen la regla de arma Equilibrada.' },
      { n: 'Tipoz Duroz', t: 'Cuando un agente dispare a un agente DEMOLEDOREZ amigo que tenga una orden de Trabarse, puedes repetir uno de tus dados de defensa.' },
      { n: 'Destrucción', t: 'Las armas a distancia de los agentes DEMOLEDOREZ amigos tienen la regla de arma Saturación.' },
      { n: 'Vitaminadoz', t: 'Cada agente DEMOLEDOREZ amigo que tenga una orden de Trabarse puede recuperar inmediatamente 1D3+1 de heridas perdidas (tira por separado para cada uno).' },
    ],
    f: [
      { n: 'Pelea de Verdad',      t: 'Úsalo durante la activación de un agente TRONCHADOR DEMOLEDOREZ o NOBLE JEFAZO DEMOLEDOREZ amigo. Ese agente puede realizar dos acciones de Combatir durante esa activación.' },
      { n: '¡Kabum!',              t: 'Úsalo cuando un aliado DEMOLEDOREZ realice la acción Disparar y seleccione un arma con Área. Hasta el final de esa acción, suma 1" al Área de esa arma y tiene Severa al disparar al blanco principal. No combinable con Kobetez taladro en la misma acción. Severa no genera punto de Demolizión.' },
      { n: 'Zolo ez un razguño',   t: 'Úsalo cuando un dado de ataque inflija daño normal a un agente DEMOLEDOREZ amigo (salvo GARRAPATO BOMBA). Ignora ese daño infligido.' },
      { n: 'Trabajo de Demolizión', t: 'Úsalo después de que un aliado DEMOLEDOREZ realice Combatir o Disparar, justo antes de retirar incapacitados. Sitúa un marcador de Demolizión en la zona del blanco. Cuando un aliado (salvo GARRAPATO BOMBA) dispare, combata o contraataque a un agente a 3" o menos de ese marcador, puedes gastar 1 punto de Demolizión gratis. Se retira en el paso de preparación de la siguiente fase de estrategia.' },
    ],
  },

  eq: [
    { n: 'Kobetaladradorez',  t: 'Una vez por punto de inflexión, cuando un aliado DEMOLEDOREZ realice la acción Disparar y selecciones un lanzakobetez o lanzakobetez pezado, puedes usar esta regla. Hasta el final de esa acción, dicha arma pierde Área pero gana Penetración 1.' },
    { n: 'Blindaje Adicional', t: 'Resta 1" al atributo Movimiento de los agentes DEMOLEDOREZ amigos y mejora en 1 su Salvación. Excluye a GARRAPATO BOMBA y no es acumulable con la regla Protección de una Barricada Portátil.' },
    { n: 'Azeite de Motor',   t: 'Puedes usar esta regla una vez por punto de inflexión, al activar un agente DEMOLEDOREZ amigo (salvo GARRAPATO BOMBA). Hasta el final de esa activación, puedes ignorar cualquier cambio a los atributos de ese agente por estar herido (incluidos los de sus armas).' },
    { n: 'Glifoz',            t: 'Al elegir este equipo, selecciona el ardid estratégico ¡Waaagh! o Destrucción. La primera vez que uses esa estratagema durante la batalla, te costará 0PM. A partir de ahí, te costará 0PM si tienes algún punto de Demolizión.' },
  ],

  er: [
    {
      v: 'Abril 2026',
      ee: [
        { s: 'Reglas de Facción — Embestida Demoledora', t: 'Cambiado: "Puedes gastar hasta 2 de tus puntos de Demolizión (a menos que sea un GARRAPATO BOMBA, en cuyo caso no puedes gastar ninguno)".' },
        { s: 'Comentario de reglas — Hazta laz cejaz', t: 'P: ¿Cuándo sumo al atributo LPA de mi agente por realizar una acción de Carga? R: Al inicio de esa acción, antes de mover.' },
      ],
    },
    {
      v: 'Anteriores',
      ee: [
        { s: 'Reglas de Facción — Hazta laz cejaz',           t: 'La primera vez por activación/reacción que el agente realice tanto Cargar como Disparar o Combatir (salvo Ponerse en guardia), suma 1 al LPA.' },
        { s: 'Reglas de Facción — Embestida Demoledora',       t: 'Puedes ganar y perder puntos de Demolizión durante la misma acción en el orden que elijas, salvo si empezaste la acción con 6, en cuyo caso solo puedes gastarlos.' },
        { s: 'Agente Noble Jefazo — Salva*',                   t: 'Cambiado: "Elige hasta 2 blancos válidos diferentes que no estén en la zona de control de agentes amigos."' },
        { s: 'Agente Tronchademoledor — Detonar*',             t: 'Añadido: el daño de esta arma no puede ignorarse ni reducirse.' },
        { s: 'Agente Garrapato Bomba — Prescindible',          t: 'También se ignora para condiciones de victoria y puntuar PV si requiere que agentes escapen, sobrevivan o queden incapacitados por agentes enemigos.' },
        { s: 'Equipo — Blindaje Adicional',                    t: 'Excluye a GARRAPATO BOMBA y no es acumulable con la regla Protección de una Barricada Portátil de equipo universal.' },
        { s: 'Comentario previo — Garrapato Bomba + ¡Bum!',   t: 'P: Si un GARRAPATO BOMBA queda incapacitado en Combatir en puerta/escotilla, ¿el otro agente es blanco secundario para ¡Bum!? R: No como resultado de esas reglas.' },
        { s: 'Comentario previo — Tronchamachakador + Destrozar*', t: 'P: Si Destrozar* mueve a un enemigo y un marcador que "terminaría la acción" está en la zona de control del enemigo pero no del Tronchamachakador, ¿termina la acción de Combatir? R: No.' },
      ],
    },
  ],

  gr: {
    concepts: [
      { n: 'Zona de control',       t: 'Algo está dentro de la zona de control de un agente si es visible para él y está a menos de 1" de él.' },
      { n: 'Blanco válido',         t: 'Con orden de trabarse: visible. Con orden de ocultarse: visible y no a cubierto.' },
      { n: 'Visible',               t: 'Línea recta sin obstrucciones desde la cabeza del agente hasta cualquier parte del objetivo.' },
      { n: 'Cobertura',             t: 'Terreno interpuesto en la zona de control. No aplica si está a 2" o menos del atacante.' },
      { n: 'Demolizión',            t: 'Recurso orko. Se gana con resultados de 6, con Jefe Demoledorez y con Detonar*. Gasta hasta 2 por acción para convertir fallos en éxitos. Si empezaste la acción con 6 puntos, solo puedes gastarlos.' },
      { n: 'Herido / Lesionado / Incapacitado', t: 'Lesionado: menos de la mitad de heridas — pierde 2" de MOV y empeora en 1 su Impactar. Incapacitado: 0 heridas, se retira.' },
    ],
    orders: [
      { n: 'Orden de trabarse',  t: 'El agente puede realizar acciones normalmente y reaccionar.' },
      { n: 'Orden de ocultarse', t: 'El agente no es blanco válido mientras esté a cubierto. No puede Disparar ni Cargar. Los GARRAPATO BOMBA no pueden recibir esta orden.' },
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
      { n: 'Alcance x"',    t: 'Solo agentes a esa distancia o menos pueden ser blancos válidos.' },
      { n: 'Área x"',       t: 'Dispara también contra cada agente visible a esa distancia o menos del blanco primario.' },
      { n: 'Brutal',        t: 'El oponente solo puede bloquear con éxitos críticos.' },
      { n: 'Choque',        t: 'La primera vez que golpees con crítico, descarta un éxito normal sin resolver del oponente.' },
      { n: 'Equilibrada',   t: 'Puedes repetir 1 de tus dados de ataque.' },
      { n: 'Implacable',    t: 'Puedes repetir cualquiera de tus dados de ataque.' },
      { n: 'Incesante',     t: 'Puedes repetir cualquiera de tus dados de ataque con un resultado concreto.' },
      { n: 'Letal x+',      t: 'Tus éxitos iguales o superiores a X son éxitos críticos.' },
      { n: 'Limitada x',    t: 'El agente deja de tener esta arma tras usarla X veces.' },
      { n: 'Penetración x', t: 'El defensor guarda X dados de defensa menos.' },
      { n: 'Pesada',        t: 'No se puede usar si el agente ha movido, ni mover tras usarla.' },
      { n: 'Saturación',    t: 'El defensor no puede guardar salvaciones por cobertura.' },
      { n: 'Severa',        t: 'Si no guardas ningún éxito crítico, puedes cambiar un éxito normal a crítico.' },
    ],
  },
};
