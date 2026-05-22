// ============================================================
//  data/orkomandos.js — Orkomandos (Ork Kommandos)
//  img: ruta local desde la raíz del proyecto
// ============================================================

FACTIONS['orkomandos'] = {
  id: 'orkomandos', name: 'Orkomandos', subfaction: 'Orkos',
  icon: '🔧', img: 'Imagenes/orkomandos.png',
  desc: 'Kommandos Orkos que combinan la brutalidad de su especie con una astucia sorprendente. Expertos en infiltración y emboscada, caen sobre el enemigo desde las sombras antes de que pueda reaccionar.',
  tags: ['Orkos', 'Infiltración', 'Buscar y Destruir'], version: '1.0',

  ops: [
    {
      id: 'noble', name: 'Noble Orkomando', type: 'LÍDER',
      img: 'Imagenes/orkomandos-img/noble.jpg',
      s: { lpa: 3, mov: '6"', salv: '5+', h: 14 },
      kw: ['ORKOMANDO', 'ORKO', 'LÍDER', 'NOBLE'],
      w: [
        { n: 'Piztola',          a: 4, i: '4+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Gran rebanadora',  a: 5, i: '3+', d: '5/6', r: [] },
        { n: 'Garra d\'energía', a: 4, i: '3+', d: '5/7', r: ['Brutal', 'Choque'] },
      ],
      ru: [
        { n: 'La hora de laz tortaz', t: 'Este agente puede realizar 2 acciones de Combatir durante su activación.' },
        { n: '¡Manoz a la obra! (1PA)', t: 'APOYO. Elige un agente ORKOMANDO amigo distinto (salvo GARRAPATO BOMBA) a 6" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. No puede realizarse si está en zona de control enemiga o como reacción.', isAct: true },
      ],
    },
    {
      id: 'orkorraso', name: 'Orkorraso', type: 'ORKORRASO',
      img: 'Imagenes/orkomandos-img/orkorraso.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 10 },
      kw: ['ORKOMANDO', 'ORKO', 'ORKORRASO'],
      w: [
        { n: 'Piztola',     a: 4, i: '4+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Rebanadora',  a: 4, i: '3+', d: '4/5', r: [] },
      ],
      ru: [
        { n: 'Kachivachez táktikoz', t: 'Puedes llevar a cabo cada una de las siguientes opciones una vez por punto de inflexión: • Un agente ORKORRASO ORKOMANDO amigo puede realizar la acción Granada de humo. • Un agente ORKORRASO ORKOMANDO amigo puede realizar la acción Granada aturdidora. Realizarlas así no cuenta para sus límites de acciones (es decir, si también eliges esas granadas como equipo).' },
      ],
    },
    {
      id: 'orkoriete', name: 'Orkoriete', type: 'ORKORIETE',
      img: 'Imagenes/orkomandos-img/orkoriete.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 10 },
      kw: ['ORKOMANDO', 'ORKO', 'ORKORIETE'],
      w: [
        { n: 'Piztola',          a: 4, i: '4+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Ariete de azedio', a: 4, i: '4+', d: '5/5', r: ['Brutal', 'Choque', 'Severa'] },
      ],
      ru: [
        { n: 'Abrir brecha (1PA)', t: 'Coloca uno de tus marcadores de Brecha dentro de la zona de control de este agente, tan cerca como sea posible de un elemento de terreno en su zona de control. Cuando un agente se encuentre a 1" o menos de ese marcador, las partes de ese elemento de terreno que no tengan más de 1" de grosor se considerarán terreno Accesible para él. Puede realizarse durante una acción de Cargar o Reposicionarse, y le cuesta 1PA menos durante esas acciones; tras hacerlo, puede usar la distancia de movimiento restante. No puede realizarse si está en zona de control enemiga o si no hay un elemento de terreno en su zona de control.', isAct: true },
      ],
    },
    {
      id: 'achicharrador', name: 'Achicharrador', type: 'ACHICHARRADOR',
      img: 'Imagenes/orkomandos-img/achicharrador.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 10 },
      kw: ['ORKOMANDO', 'ORKO', 'ACHICHARRADOR'],
      w: [
        { n: 'Achicharrador (tromba)',    a: 4, i: '2+', d: '3/3', r: ['Alcance 4"', 'Buscadora (Ligero)', 'Saturación', 'Ráfaga 0"*'] },
        { n: 'Achicharrador (estándar)', a: 4, i: '2+', d: '3/3', r: ['Alcance 8"', 'Ráfaga 2"', 'Saturación'] },
        { n: 'Puñoz',                    a: 3, i: '3+', d: '3/4', r: [] },
      ],
      ru: [
        { n: 'Ráfaga 0"*', t: 'Ráfaga 0" significa que no puedes elegir blancos secundarios, pero esta arma sigue teniendo la regla de arma Ráfaga a efectos de todas las demás reglas (p.ej., la regla de Fortaleza Condensada).' },
      ],
    },
    {
      id: 'teleko', name: 'Teleko', type: 'TELEKO',
      img: 'Imagenes/orkomandos-img/teleko.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 10 },
      kw: ['ORKOMANDO', 'ORKO', 'TELEKO'],
      w: [
        { n: 'Piztola kalambrazo', a: 6, i: '4+', d: '1/0', r: ['Alcance 8"', 'Aturdidora', 'Devastadora 2', 'Severa'] },
        { n: 'Puñoz',              a: 3, i: '3+', d: '3/4', r: [] },
      ],
      ru: [
        { n: 'Tengo un plan, chavalez', t: 'Una vez por activación de este agente, puede realizar una acción de Colocar marcador, Recoger marcador o una acción de misión por 1PA menos.' },
        { n: 'Ezkuchadme (1PA)', t: 'APOYO. Elige un agente ORKOMANDO amigo distinto (salvo GARRAPATO BOMBA) a 6" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. No puede realizarse si está en zona de control enemiga.', isAct: true },
      ],
    },
    {
      id: 'zueltadakka', name: 'Zueltadakka', type: 'ZUELTADAKKA',
      img: 'Imagenes/orkomandos-img/zueltadakka.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 10 },
      kw: ['ORKOMANDO', 'ORKO', 'ZUELTADAKKA'],
      w: [
        { n: 'Dakkatralladora (largo alcance)', a: 5, i: '4+', d: '3/4', r: [] },
        { n: 'Dakkatralladora (corto alcance)', a: 5, i: '4+', d: '3/4', r: ['Alcance 9"', 'Incesante'] },
        { n: 'Puñoz',                          a: 3, i: '3+', d: '3/4', r: [] },
      ],
      ru: [
        { n: '¡Dakka a toda mecha! (1PA)', t: 'Realiza una acción libre de Correr y una acción libre de Disparar con este agente en cualquier orden. Solo puedes elegir una dakkatralladora para esa acción de Disparar. No puede realizarse si está en zona de control enemiga o si tiene una orden de ocultarse.', isAct: true },
      ],
    },
    {
      id: 'rajador', name: 'Rajador', type: 'RAJADOR',
      img: 'Imagenes/orkomandos-img/rajador.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 10 },
      kw: ['ORKOMANDO', 'ORKO', 'RAJADOR'],
      w: [
        { n: 'Kuchilloz arrojadizoz', a: 4, i: '3+', d: '2/5', r: ['Alcance 6"', 'Silenciosa'] },
        { n: 'Rebanadoraz gemelaz',   a: 4, i: '3+', d: '4/5', r: ['Incesante', 'Letal 5+'] },
      ],
      ru: [
        { n: '¿Ez lo mejor ke zabez hazer?', t: 'Después de que este agente combata o contraataque, si no resulta incapacitado, puedes infligir 1D3 daños al agente enemigo en dicha secuencia.' },
      ],
    },
    {
      id: 'francotiradork', name: 'Francotiradork', type: 'FRANCOTIRADORK',
      img: 'Imagenes/orkomandos-img/francotiradork.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 10 },
      kw: ['ORKOMANDO', 'ORKO', 'FRANCOTIRADORK'],
      w: [
        { n: 'Akribillador pezado kon mirilla (oculto)',  a: 5, i: '3+', d: '3/3', r: ['Devastadora 2', 'Pesada', 'Silenciosa', 'Posición oculta*'] },
        { n: 'Akribillador pezado kon mirilla (inmóvil)', a: 5, i: '3+', d: '3/3', r: ['Devastadora 2', 'Pesada'] },
        { n: 'Akribillador pezado kon mirilla (barrido)', a: 5, i: '3+', d: '3/4', r: ['Pesada (solo Correr)', 'Ráfaga 1"'] },
        { n: 'Puñoz',                                    a: 3, i: '3+', d: '3/4', r: [] },
      ],
      ru: [
        { n: 'Posición oculta*', t: 'Este agente solo puede usar el perfil oculto la primera vez que realice la acción de Disparar durante la batalla.' },
      ],
    },
    {
      id: 'chiko-kobete', name: 'Chiko Kobete', type: 'CHIKO KOBETE',
      img: 'Imagenes/orkomandos-img/chiko-kobete.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 10 },
      kw: ['ORKOMANDO', 'ORKO', 'CHIKO KOBETE'],
      w: [
        { n: 'Lanzakobetez (apuntado)', a: 6, i: '4+', d: '4/5', r: ['Área 1"', 'Incesante', 'Pesada (solo Correr)'] },
        { n: 'Lanzakobetez (móvil)',    a: 6, i: '4+', d: '4/5', r: ['Área 1"'] },
        { n: 'Puñoz',                  a: 3, i: '3+', d: '3/4', r: [] },
      ],
      ru: [],
    },
    {
      id: 'kanijo', name: 'Kanijo Komando', type: 'KANIJO',
      img: 'Imagenes/orkomandos-img/kanijo.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 5 },
      kw: ['ORKOMANDO', 'ORKO', 'GROT'],
      w: [
        { n: 'Rebanadora de Grot', a: 3, i: '5+', d: '1/4', r: [] },
      ],
      ru: [
        { n: 'Ezkurridizo', t: 'Este agente no puede tener una orden de trabarse. Siempre que esté tras cobertura, no puede ser elegido como blanco válido, teniendo esto prioridad sobre todas las demás reglas (p.ej. Buscadora, terreno Aventajado) salvo estar a 2" o menos.' },
        { n: 'Gancho pa\' trepar (1PA)', t: 'Elige un punto visible en un elemento de terreno. Retira a este agente de la zona de aniquilación y despliégalo a 1" o menos en horizontal de ese punto, fuera de toda zona de control enemiga, con el punto elegido visible para él. No puede realizar la acción Operar portillo durante esta acción. Se considera una acción de Reposicionarse. No puede realizarse si está en zona de control enemiga, ni durante una activación en la que haya realizado una acción de Cargar o Retroceder (o viceversa).', isAct: true },
      ],
    },
    {
      id: 'garrapato-bomba', name: 'Garrapato Bomba', type: 'GARRAPATO BOMBA',
      img: 'Imagenes/orkomandos-img/garrapato-bomba.jpg',
      s: { lpa: 2, mov: '6"', salv: '5+', h: 5 },
      kw: ['ORKOMANDO', 'ORKO', 'GARRAPATO BOMBA'],
      w: [
        { n: 'Explozivoz',    a: 6, i: '4+', d: '4/5', r: ['Área 1"', 'Limitada 1', 'Explosiva*'] },
        { n: 'Mordizquitoz', a: 3, i: '4+', d: '4/5', r: [] },
      ],
      ru: [
        { n: 'Explosiva*', t: 'Este agente puede realizar la acción de Disparar con esta arma estando en la zona de control de un agente enemigo. No elijas un blanco válido. En lugar de eso, este agente es siempre el blanco principal y no puede estar a cubierto u ofuscado.' },
        { n: '¡Bum!', t: 'Si este agente resulta incapacitado durante la batalla sin haber usado sus explozivoz, tira un D6, o dos D6 si quieres. Si algún dado saca 4+, este agente realiza una acción libre de Disparar con sus explozivoz antes de ser retirado de la zona de aniquilación.' },
        { n: 'Eztúpido', t: 'Durante la fase de tiroteo, al determinar la orden de este agente, no puedes elegir ocultarse. Este agente no puede realizar otras acciones que no sean Cargar, Combatir, Correr, Disparar o Reposicionarse, ni usar armas que no figuren en su tarjeta de datos.' },
        { n: 'Prescindible', t: 'Este agente se ignora para las operaciones de asesinato/eliminación del oponente (al quedar incapacitado y al determinar el número inicial de agentes). También se ignora para condiciones de victoria y puntuar PV si esto requiere que agentes "escapen", "sobrevivan" o queden incapacitados por agentes enemigos.' },
      ],
    },
  ],

  // ── REGLAS GENERALES ───────────────────────────────────────
  gr: {
    concepts: [
      { n: 'Marcador de Brecha', t: 'Colocado por el Orkoriete. Los agentes a 1" o menos del marcador tratan las partes de ese elemento de terreno con hasta 1" de grosor como terreno Accesible.' },
      { n: 'Prescindible (GARRAPATO BOMBA)', t: 'El Garrapato Bomba se ignora para operaciones de asesinato/eliminación y para condiciones de victoria que requieran que agentes escapen, sobrevivan o sean incapacitados.' },
      { n: 'Ezkurridizo (KANIJO)', t: 'El Kanijo no puede tener orden de trabarse. Mientras esté tras cobertura no puede ser elegido como blanco válido (salvo estar a 2" o menos), con prioridad sobre Buscadora y terreno Aventajado.' },
    ],
    orders: [
      { n: 'Orden de trabarse', t: 'El agente puede realizar acciones y reaccionar normalmente.' },
      { n: 'Orden de ocultarse', t: 'El agente no es blanco válido mientras esté a cubierto. No puede Disparar ni Cargar (salvo con la regla DEGOLLADOREZ).' },
    ],
    phases: [
      { n: 'Fase de estrategia', t: 'Tira iniciativa y se ganan PM. Los jugadores alternan usando GAMBITOS ESTRATÉGICOS o pasando.' },
      { n: 'Fase de tiroteo', t: 'Los jugadores alternan activando agentes. Cada agente ORKOMANDO (salvo GARRAPATO BOMBA) puede Cargar aunque tenga orden de ocultarse (DEGOLLADOREZ).' },
    ],
    actions: [
      { n: 'Reposicionarse', cost: '1PA', t: 'Mueve hasta MOV. No puede moverse a través de zonas de control enemigas.' },
      { n: 'Correr',         cost: '1PA', t: 'Como Reposicionar, pero máx. 3", sin trepar, no en zona de control enemiga.' },
      { n: 'Cargar',         cost: '1PA', t: 'Como Reposicionar, +2" adicionales, debe terminar en zona de control enemiga.' },
      { n: 'Retroceder',     cost: '2PA', t: 'Como Reposicionar, puede pasar por zonas de control enemigas sin terminar ahí.' },
      { n: 'Disparar',       cost: '1PA', t: 'Elige arma y blanco válido. Tira dados de ataque. El defensor tira 3 dados de defensa.' },
      { n: 'Combatir',       cost: '1PA', t: 'Elige enemigo en zona de control; contraatacará. Ambos eligen arma y alternan Golpear o Bloquear.' },
    ],
    wr: [
      { n: 'Explosiva*',            t: 'El agente puede Disparar esta arma en zona de control enemiga. No elige blanco: él mismo es el blanco principal, sin cobertura ni ofuscación.' },
      { n: 'Posición oculta*',      t: 'Solo puede usarse la primera vez que el agente realiza la acción de Disparar durante la batalla.' },
      { n: 'Ráfaga 0"*',            t: 'No puedes elegir blancos secundarios, pero el arma sigue teniendo la regla Ráfaga a todos los demás efectos.' },
      { n: 'Brutal',                t: 'El oponente solo puede bloquear con éxitos críticos.' },
      { n: 'Choque',                t: 'La primera vez que golpees con crítico, descarta un éxito normal sin resolver del oponente.' },
      { n: 'Severa',                t: 'Si no guardas ningún éxito crítico, puedes cambiar un éxito normal a crítico.' },
      { n: 'Incesante',             t: 'Puedes repetir cualquiera de tus dados de ataque con un resultado concreto.' },
      { n: 'Letal 5+',              t: 'Tus éxitos iguales o superiores a 5 son éxitos críticos.' },
      { n: 'Silenciosa',            t: 'Puede usarse aunque el agente tenga orden de ocultarse.' },
      { n: 'Saturación',            t: 'El defensor no puede guardar salvaciones por cobertura.' },
      { n: 'Devastadora 2',         t: 'Cada éxito crítico guardado inflige 2 daños adicionales inmediatos.' },
      { n: 'Área 1"',               t: 'Dispara también contra cada agente visible a 1" o menos del blanco primario.' },
      { n: 'Limitada 1',            t: 'El agente deja de tener esta arma tras usarla 1 vez.' },
      { n: 'Pesada (solo Correr)',   t: 'Solo puede usarse si la única acción de movimiento fue Correr.' },
      { n: 'Aturdidora',            t: 'Si el resultado de cualquier dado de ataque es 6, el agente objetivo tiene su LPA reducido en 1 hasta el final de su siguiente activación.' },
      { n: 'Ráfaga 1"/2"',          t: 'Dispara también contra blancos secundarios válidos a esa distancia.' },
      { n: 'Buscadora (Ligero)',     t: 'Los agentes con orden de ocultarse no pueden usar terreno Ligero para estar a cubierto.' },
      { n: 'Equilibrada',           t: 'Puedes repetir 1 de tus dados de ataque.' },
    ],
  },

  // ── REGLAS DE FACCIÓN ──────────────────────────────────────
  fr: {
    type: 'Regla de facción',
    name: 'Orkomandos',
    text: 'Una regla de facción: DEGOLLADOREZ.',
    orders: [
      { n: 'Degolladorez', t: 'Cada agente ORKOMANDO amigo (salvo GARRAPATO BOMBA) puede realizar acciones de Cargar aunque tenga una orden de ocultarse.' },
    ],
  },

  // ── ARDIDES ────────────────────────────────────────────────
  pl: {
    s: [
      { n: '¡Dakka! ¡Dakka! ¡Dakka!', t: 'Las armas a distancia de los agentes ORKOMANDO amigos tienen la regla de arma Castigadora.' },
      { n: '¡Waaagh!', t: 'Las armas de combate de los agentes ORKOMANDO amigos tienen la regla de arma Equilibrada.' },
      { n: 'Ezkondidoz', t: 'Cada vez que un agente enemigo dispara a un agente ORKOMANDO amigo que tenga una orden de ocultarse, puedes guardar uno de tus dados de defensa como éxito normal sin tirarlo (además de la salvación por cobertura, si dispones de ella).' },
      { n: '¡Sssshhhh!', t: 'Cada agente ORKOMANDO amigo que no sea un blanco válido para los agentes enemigos, o que tenga una orden de ocultarse y se encuentre a más de 6" de todo agente enemigo, puede realizar inmediatamente una acción libre de Correr. No puede usarse durante el primer punto de inflexión.' },
    ],
    f: [
      { n: 'Zolo ez un razguño', t: 'Úsalo cuando un dado de ataque inflija Daño normal a un agente ORKOMANDO amigo (que no sea GARRAPATO BOMBA o GROT). Ignora ese daño infligido.' },
      { n: 'No te parez', t: 'Úsalo cuando un agente ORKOMANDO amigo sea activado, o cuando su atributo LPA cambie. Hasta el inicio del siguiente punto de inflexión, puedes ignorar cualquier cambio a su atributo LPA.' },
      { n: '¡Machakazloz!', t: 'Úsalo al final de la fase de tiroteo. Elige un agente ORKOMANDO amigo. Puede realizar inmediatamente una acción libre de Combatir.' },
      { n: 'Aztutoz pero brutoz', t: 'Úsalo cuando un agente ORKOMANDO amigo que tenga una orden de ocultarse esté combatiendo durante una activación en la que haya realizado una acción de Cargar, al resolver el primer dado de ataque, si este golpea con un éxito normal. Ese éxito normal se considera un éxito crítico en su lugar.' },
    ],
  },

  // ── EQUIPO ─────────────────────────────────────────────────
  eq: [
    { n: 'Rebanadoraz', t: 'Los agentes ORKOMANDO amigos (salvo GARRAPATO BOMBA o GROT) tienen la siguiente arma de combate: Rebanadora — ATQ 3, IMP 3+, DAÑO 4/5. Si el agente ya tiene esta arma con mejores atributos, usa la versión mejor.' },
    { n: 'Dinamita', t: 'Una vez por batalla, un agente ORKOMANDO amigo (que no sea GARRAPATO BOMBA o GROT) puede usar la siguiente arma a distancia: Dinamita — ATQ 5, IMP 4+, DAÑO 4/5. Reglas: Alcance 4", Área 1", Pesada (solo Reposicionarse), Saturación.' },
    { n: 'Arpón', t: 'Una vez por punto de inflexión, un agente ORKOMANDO amigo (salvo GARRAPATO BOMBA o GROT) puede usar la siguiente arma a distancia: Arpón — ATQ 4, IMP 4+, DAÑO 4/5. Reglas: Alcance 8", Aturdidora, Letal 5+.' },
    { n: 'Culata plegable', t: 'Elimina la regla de arma Alcance de las siguientes armas a distancia de los agentes ORKOMANDO amigos: Piztola kalambrazo y Piztola.' },
  ],

  // ── ERRATAS ────────────────────────────────────────────────
  er: [
    {
      v: 'Octubre 2025',
      ee: [
        { s: 'Agente Noble Orkomando — Gran rebanadora', t: 'Su atributo ATQ cambia a 5. Se borra la regla de arma Castigadora.' },
        { s: 'Agente Noble Orkomando — Garra d\'energía', t: 'Se añade la regla de arma Choque.' },
        { s: 'Agente Noble Orkomando', t: 'Se añade la regla: "La hora de laz tortaz: Este agente puede realizar 2 acciones de Combatir durante su activación."' },
        { s: 'Agente Zueltadakka — Dakkatralladora (corto alcance)', t: 'La regla de arma Alcance 6" cambia a Alcance 9".' },
        { s: 'Equipo de facción — Culata plegable', t: 'Se elimina "Dakkatralladora (corto alcance)" de la lista de armas afectadas. Solo afecta a Piztola kalambrazo y Piztola.' },
      ],
    },
    {
      v: 'Anteriores',
      ee: [
        { s: 'Agente Kanijo — Ezkurridizo', t: 'La segunda frase cambia a: "Siempre que este agente esté tras cobertura, no puede ser elegido como blanco válido, teniendo esto prioridad sobre todas las demás reglas (p.ej. Buscadora, terreno Aventajado) salvo estar a 2\\" o menos."' },
        { s: 'Agente Garrapato Bomba — Prescindible', t: 'La segunda frase cambia a: "También se ignora para condiciones de victoria y puntuar PV si esto requiere que agentes \'escapen\', \'sobrevivan\' o queden incapacitados por agentes enemigos [...]"' },
        { s: 'Agente Achicharrador — Achicharrador (tromba)', t: 'Se añade la regla de arma Ráfaga 0"*. Se añade nota: "Ráfaga 0\\" significa que no puedes elegir blancos secundarios, pero esta arma sigue teniendo la regla de arma Ráfaga a efectos de todas las demás reglas."' },
        { s: 'Comentario de regla — Garrapato Bomba y ¡Bum!', t: 'P: Si un Garrapato Bomba queda incapacitado durante una acción de Combatir en puerta o Combatir en escotilla, ¿es el otro agente un blanco secundario para la acción de Disparar de ¡Bum!? R: No.' },
      ],
    },
  ],
};
