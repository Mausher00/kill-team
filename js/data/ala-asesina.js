// ============================================================
//  data/ala-asesina.js — Ala Asesina
//  img: ruta local desde la raíz del proyecto
// ============================================================

FACTIONS['ala-asesina'] = {
  id: 'ala-asesina', name: 'Ala Asesina', subfaction: 'Astartes Herejes del Caos',
  icon: '🦅', img: 'Imagenes/alaasesina.png', desc: 'Guerreros del Caos con propulsores de salto que atacan desde las alturas con velocidad y ferocidad devastadoras.',
  tags: ['Caos', 'Élite', 'Buscar y Destruir'], version: '1.2',

  ops: [
    {
      id: 'senor', name: 'Señor del Caos del Ala Asesina', type: 'LÍDER',
      img: 'Imagenes/ala-asesina-img/senor.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 15 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'LÍDER', 'SEÑOR'],
      w: [
        { n: 'Pistola bólter',                a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Pistola de plasma (normal)',     a: 4, i: '3+', d: '3/5', r: ['Alcance 8"', 'Penetración 1'] },
        { n: 'Pistola de plasma (sobrecarga)', a: 4, i: '3+', d: '4/5', r: ['Alcance 8"', 'Letal 5+', 'Penetración 1', 'Sobrecalentamiento'] },
        { n: 'Arma de energía',               a: 5, i: '3+', d: '4/6', r: ['Letal 5+'] },
        { n: 'Garra relámpago',               a: 5, i: '3+', d: '4/5', r: ['Desgarradora', 'Letal 5+'] },
        { n: 'Garras relámpago reliquia',      a: 5, i: '3+', d: '4/6', r: ['Desgarradora', 'Incesante', 'Letal 5+'] },
        { n: 'Puño de energía',               a: 4, i: '3+', d: '5/7', r: ['Brutal', 'Choque'] },
      ],
      ru: [
        { n: 'Senda hacia la condenación', t: 'Este agente empieza con 1 punto de Condenación. Una vez por acción, puedes intentar usar un Don de Condenación tirando 1D6 vs sus puntos. Mayor: resuelve y gana 1 punto. Igual: no resuelves. Menor: sufre tantos daños como sus puntos.' },
        { n: 'Dones de Condenación', t: '① Cuando un dado inflija 3+ daños, puedes ignorar tantos daños como sus puntos de Condenación. ② Cuando combate o contraataca y golpeas, puedes infligir tantos daños adicionales como sus puntos de Condenación.' },
      ],
    },
    {
      id: 'campeon', name: 'Campeón del Ala Asesina', type: 'CAMPEÓN',
      img: 'Imagenes/ala-asesina-img/campeon.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'CAMPEÓN'],
      w: [
        { n: 'Pistola bólter',                a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Pistola de plasma (normal)',     a: 4, i: '3+', d: '3/5', r: ['Alcance 8"', 'Penetración 1'] },
        { n: 'Pistola de plasma (sobrecarga)', a: 4, i: '3+', d: '4/5', r: ['Alcance 8"', 'Letal 5+', 'Penetración 1', 'Sobrecalentamiento'] },
        { n: 'Arma de energía',               a: 5, i: '3+', d: '4/6', r: ['Letal 5+'] },
        { n: 'Puño de energía',               a: 4, i: '3+', d: '5/7', r: ['Brutal', 'Choque'] },
      ],
      ru: [
        { n: 'Campeón del Caos', t: 'GAMBITO ESTRATÉGICO. Retira tu ficha de Desafío (si la hay) y elige un enemigo para que la gane. Cuando combatas o contraataques contra el agente con tu ficha de Desafío, puedes seleccionar una regla de arma: Brutal, Castigadora, Choque, Equilibrada o Severa.' },
        { n: 'Sendero a la gloria', t: 'Siempre que este agente incapacite a un enemigo que tenga tu ficha de Desafío, obtienes 1PM.' },
      ],
    },
    {
      id: 'garramaldita', name: 'Garramaldita del Ala Asesina', type: 'GARRAMALDITA',
      img: 'Imagenes/ala-asesina-img/garramaldita.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'GARRAMALDITA'],
      w: [
        { n: 'Pistola bólter', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Garras mutadas',  a: 5, i: '3+', d: '4/5', r: ['Desgarradora'] },
      ],
      ru: [
        { n: 'Ataque frenético', t: 'Si este agente queda incapacitado durante una acción de Combatir, puedes golpear al enemigo con uno de tus éxitos sin resolver antes de retirarlo.' },
        { n: 'Atrapar (1PA)', t: 'Acción de IMPULSO. Elige un enemigo en la ZONA DE IMPULSO. Ambos tiran 1D6 y suman Heridas. Si tu resultado es mayor, retira al enemigo y despliégalo en la ZONA DE IMPULSO o zona de control de este agente.', isAct: true },
      ],
    },
    {
      id: 'depredador', name: 'Depredador del Ala Asesina', type: 'DEPREDADOR',
      img: 'Imagenes/ala-asesina-img/depredador.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'DEPREDADOR'],
      w: [
        { n: 'Pistola bólter',    a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Gran hacha sierra', a: 5, i: '4+', d: '5/7', r: ['Brutal'] },
      ],
      ru: [
        { n: 'Desmembramiento horripilante', t: 'Siempre que este agente incapacite a un enemigo al combatir o contraatacar, elige un enemigo distinto a 3" o menos y visible. Resta 1 al LPA de ese enemigo hasta el final de su siguiente activación.' },
        { n: 'Golpe cercenador (1PA)', t: 'Inflige 2D3 daños a cada otro agente visible y a 2" o menos (tira por separado). Se trata como acción de Combatir. No posible con orden de ocultarse, ni en la misma activación que Rebanar desde lo alto, Cargar con garras o dos acciones de Combatir.', isAct: true },
      ],
    },
    {
      id: 'maestro', name: 'Maestro Cazador del Ala Asesina', type: 'MAESTRO CAZADOR',
      img: 'Imagenes/ala-asesina-img/maestro.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'MAESTRO CAZADOR'],
      w: [
        { n: 'Pistola bólter', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Arma de energía', a: 5, i: '3+', d: '4/6', r: ['Letal 5+'] },
      ],
      ru: [
        { n: 'Presa acorralada', t: 'Siempre que un enemigo vaya a Retroceder desde la zona de control de este agente, si no hay otros enemigos en su zona de control, tira 2D6 (o 1D6 si ese enemigo tiene más Heridas). Si sacas algún 4+, ese enemigo no puede realizar esa acción.' },
        { n: 'Golpear desde lo alto (1PA)', t: 'Acción de IMPULSO. Inflige 2D3+1 daños a un enemigo en la ZONA DE IMPULSO. Solo durante Retroceder o Reposicionarse, tras un IMPULSO.', isAct: true },
      ],
    },
    {
      id: 'rapaz', name: 'Rapaz del Ala Asesina', type: 'RAPAZ',
      img: 'Imagenes/ala-asesina-img/rapaz.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'RAPAZ'],
      w: [
        { n: 'Pistola bólter',                a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Pistola de plasma (normal)',     a: 4, i: '3+', d: '3/5', r: ['Alcance 8"', 'Penetración 1'] },
        { n: 'Pistola de plasma (sobrecarga)', a: 4, i: '3+', d: '4/5', r: ['Alcance 8"', 'Letal 5+', 'Penetración 1', 'Sobrecalentamiento'] },
        { n: 'Espada sierra',                  a: 5, i: '3+', d: '4/5', r: [] },
      ],
      ru: [
        { n: 'La excitación del vuelo', t: 'Siempre que este agente se dé un IMPULSO durante su activación: puedes retirar cualquier cambio a su LPA, y puedes ignorar cualquier cambio a sus atributos por estar lesionado hasta el final de la activación.' },
      ],
    },
    {
      id: 'estridente', name: 'Estridente del Ala Asesina', type: 'ESTRIDENTE',
      img: 'Imagenes/ala-asesina-img/estridente.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'ESTRIDENTE'],
      w: [
        { n: 'Pistola bólter', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Espada sierra',  a: 5, i: '3+', d: '4/5', r: [] },
      ],
      ru: [
        { n: 'Vocoemisores modificados', t: 'Cuando un enemigo esté a 3" o menos, tu oponente debe gastar 1PA adicional para acciones de Recoger marcador o de misión. Al determinar control de marcador, el LPA total de los enemigos que lo disputen se considera 1 menos si al menos uno está a 3" o menos de este agente.' },
        { n: 'Alarido (1PA)', t: 'Elige un enemigo a 6" o menos y visible (o en la ZONA DE IMPULSO como acción de IMPULSO). Inflige 1D3 daños y resta 1 a su LPA hasta el final de su siguiente activación.', isAct: true },
      ],
    },
    {
      id: 'ignifero', name: 'Ignífero del Ala Asesina', type: 'IGNÍFERO',
      img: 'Imagenes/ala-asesina-img/ignifero.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'IGNÍFERO'],
      w: [
        { n: 'Lanzallamas',                  a: 4, i: '2+', d: '3/3', r: ['Alcance 8"', 'Ráfaga 2"', 'Saturación'] },
        { n: 'Pistola bólter',               a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Rifle de fusión',              a: 4, i: '3+', d: '6/3', r: ['Alcance 6"', 'Devastadora 4', 'Penetración 2'] },
        { n: 'Rifle de plasma (normal)',      a: 4, i: '3+', d: '4/6', r: ['Penetración 1'] },
        { n: 'Rifle de plasma (sobrecarga)',  a: 4, i: '3+', d: '5/6', r: ['Letal 5+', 'Penetración 1', 'Sobrecalentamiento'] },
        { n: 'Puños',                         a: 4, i: '3+', d: '3/4', r: [] },
      ],
      ru: [],
    },
    {
      id: 'espolon', name: 'Espolón de la Disformidad del Ala Asesina', type: 'ESPOLÓN DE LA DISFORMIDAD',
      img: 'Imagenes/ala-asesina-img/espolon.jpg',
      s: { lpa: 3, mov: '6"', salv: '3+', h: 14 },
      kw: ['ALA ASESINA', 'CAOS', 'ASTARTES HEREJES', 'ESPOLÓN DE LA DISFORMIDAD'],
      w: [
        { n: 'Garras relámpago', a: 5, i: '3+', d: '4/5', r: ['Desgarradora', 'Incesante', 'Letal 5+'] },
      ],
      ru: [
        { n: 'Rajar el velo', t: 'Al desplegar antes de la batalla, puedes desplegarlo en la disformidad. En la 1ª fase de tiroteo: al activarlo, coloca un marcador de Disformidad en tu territorio y queda usado. En la 2ª fase de tiroteo: despliégalo con una orden a elección. Durante esa activación no puedes gastar más de 2PA ni usar más de 4" de movimiento.' },
      ],
    },
  ],

  fr: {
    name: 'Propulsor de Salto', type: 'REGLA DE FACCIÓN',
    text: 'Cuando un agente ALA ASESINA amigo realice Cargar, Retroceder o Reposicionarse, al inicio de cualquier incremento en línea recta y sin terreno Aventajado bajo su peana, puede dar un IMPULSO: retíralo y despliégalo a X" o menos en horizontal. La distancia cuenta para el movimiento total. Si IMPULSO durante Cargar, no suma 2" adicionales.',
    orders: [
      { n: 'Astartes', t: 'Durante la activación de cada agente ALA ASESINA amigo, puede realizar o dos acciones de Disparar o dos acciones de Combatir. Si son dos de Disparar, debe usar una pistola bólter para al menos una. Cada agente ALA ASESINA amigo puede reaccionar sin importar su orden.' },
      { n: 'Acciones de IMPULSO', t: 'Acciones que se realizan durante otras acciones cuando se aplica un IMPULSO. Cada agente solo puede realizar una acción de IMPULSO por activación. La ZONA DE IMPULSO es la zona horizontal entre la ubicación actual del agente y la ubicación desde la que usó el IMPULSO.' },
    ],
  },

  pl: {
    s: [
      { n: 'Depredadores aéreos',    t: 'Cuando un aliado ALA ASESINA esté al menos 2" más alto que el suelo, sus armas tienen Equilibrada. Cuando use un IMPULSO, sus armas tienen Equilibrada hasta el final de esa activación.' },
      { n: 'Masacrar a los débiles', t: 'Cuando un aliado dispare o combata, sus armas tienen Castigadora si el objetivo está al menos 2" más bajo, tiene el LPA reducido, o estaba herido al inicio de la activación/reacción.' },
      { n: 'Pesadilla en las alturas', t: 'Cuando un agente dispare contra un aliado ALA ASESINA que esté al menos 2" más alto o que haya usado un IMPULSO este punto de inflexión, puedes repetir uno de tus dados de defensa.' },
      { n: 'Instilar miedo',          t: 'Cuando un aliado ALA ASESINA combata, el Daño normal de 3 o más le inflige 1 daño menos.' },
    ],
    f: [
      { n: 'Narcisismo malicioso',  t: 'Úsalo cuando sea tu turno de activar, si solo hay apostado un único aliado ALA ASESINA. Hasta el final del punto de inflexión, siempre que tengas menos agentes apostados que tu oponente, puedes no activar hasta que al oponente solo le quede 1 agente apostado.' },
      { n: 'Descenso asesino',      t: 'Úsalo cuando un enemigo termine Cargar, Correr, Retroceder o Reposicionarse a 3" o menos en horizontal y a más de 2" por debajo de algún aliado ALA ASESINA. Interrumpe su activación y realiza una acción libre de Cargar con ese aliado.' },
      { n: 'Luchar sin honor',       t: 'Úsalo cuando un aliado ALA ASESINA combata o contraataque, al resolver un éxito crítico. En lugar de golpear o bloquear, termina la secuencia y realiza una acción libre de Retroceder de hasta 3".' },
      { n: 'Alas de oscuridad',      t: 'Úsalo cuando un aliado realice Retroceder o Reposicionarse con un IMPULSO. Puede desplegarse 3" adicionales, pero no puede Disparar, Combatir o usar Golpe cercenador hasta el siguiente punto de inflexión. No usable en el primer punto de inflexión.' },
    ],
  },

  eq: [
    { n: 'Filoaletas',          t: 'Los aliados ALA ASESINA pueden realizar: REBANAR DESDE LO ALTO (1PA, acción de IMPULSO) — Inflige 1D3+1 daños a un enemigo en la ZONA DE IMPULSO. Solo durante Retroceder o Reposicionarse, tras un IMPULSO.' },
    { n: 'Armadura con garras', t: 'Los aliados ALA ASESINA pueden realizar: CARGAR CON GARRAS (0PA, acción de IMPULSO) — Inflige 1 daño a un enemigo en la zona de control, y la acción de Cargar termina. Solo durante Cargar, tras un IMPULSO.' },
    { n: 'Combustible disforme', t: 'Una vez por punto de inflexión, cuando un enemigo termine Retroceder durante su activación, si al menos un aliado ALA ASESINA estaba en su zona de control al inicio, uno de esos aliados puede realizar una acción libre de Reposicionarse o Cargar (máx. 3").' },
    { n: 'Vocoemisores',         t: 'Una vez por punto de inflexión, un aliado ALA ASESINA puede realizar: VOCOGRITO (1PA) — Cada enemigo a 2" o menos hace un chequeo de aturdimiento (1D6: con 3+, resta 1 a su LPA). No posible con orden de ocultarse.' },
  ],

  er: [
    { v: 'Abril 2026', ee: [
      { s: 'Equipo — Vocoemisores, Vocogrito',          t: 'Cambiado a: "Cada agente enemigo a 2" o menos de este agente realiza un chequeo de aturdimiento".' },
      { s: 'Agente Espolón de la Disformidad — Rajar el velo', t: 'Durante esa activación no puedes gastar más de 2PA. La parte sobre quedar ofuscado ha sido eliminada.' },
      { s: 'Comentario: Alas de oscuridad + Espolón',   t: 'P: ¿Puedo usar Alas de oscuridad cuando el Espolón se despliega desde la disformidad para usar más de 4" de movimiento? R: No.' },
    ]},
    { v: 'Anteriores', ee: [
      { s: 'Agente Señor del Caos — Dones de Condenación', t: 'Cambiado el segundo punto: "Cuando este agente combate o contraataca y golpeas con un dado de ataque, puedes…"' },
      { s: 'Agente Depredador — Golpe cercenador',          t: 'Se trata como acción de Combatir a efectos de restricciones y la regla Astartes.' },
      { s: 'Reglas de Facción — Propulsor de Salto',        t: 'Añadido: si hace un IMPULSO durante Cargar, no sumes 2" adicionales.' },
      { s: 'Ardides — Narcisismo malicioso',                t: 'Puedes retrasar la activación hasta que al oponente solo le quede 1 agente apostado.' },
      { s: 'Ardides — Descenso asesino',                    t: 'El enemigo debe terminar a 3" o menos en horizontal y a más de 2" por debajo de algún aliado ALA ASESINA.' },
    ]},
  ],

  gr: {
    concepts: [
      { n: 'Zona de control', t: 'Algo está dentro de la zona de control de un agente si es visible para él y está a menos de 1" de él.' },
      { n: 'Blanco válido',   t: 'Con orden de trabarse: visible. Con orden de ocultarse: visible y no a cubierto.' },
      { n: 'Visible',         t: 'Línea recta sin obstrucciones desde la cabeza del agente hasta cualquier parte del objetivo.' },
      { n: 'Cobertura',       t: 'Terreno interpuesto en la zona de control. No aplica si está a 2" o menos del atacante.' },
      { n: 'IMPULSO',         t: 'Durante Cargar, Retroceder o Reposicionarse, sin terreno Aventajado bajo la peana, el agente puede retirarse y desplegarse a X" en horizontal. La distancia cuenta para el movimiento total.' },
      { n: 'ZONA DE IMPULSO', t: 'Zona horizontal entre la ubicación actual del agente y la ubicación desde la que usó el IMPULSO.' },
      { n: 'Herido / Lesionado / Incapacitado', t: 'Lesionado: menos de la mitad de heridas — pierde 2" de MOV y empeora en 1 su Impactar. Incapacitado: 0 heridas, se retira.' },
    ],
    orders: [
      { n: 'Orden de trabarse',  t: 'El agente puede realizar acciones normalmente y reaccionar.' },
      { n: 'Orden de ocultarse', t: 'El agente no es blanco válido mientras esté a cubierto. No puede Disparar ni Cargar.' },
    ],
    phases: [
      { n: 'Fase de estrategia',  t: 'Tira iniciativa. Ganan PM. Los jugadores alternan usando GAMBITOS ESTRATÉGICOS o pasando.' },
      { n: 'Fase de tiroteo',     t: 'Los jugadores alternan activando agentes hasta su LPA. Los agentes ALA ASESINA pueden realizar dos acciones de Disparar o dos de Combatir (regla Astartes).' },
      { n: 'Reaccionar',          t: 'Todos los agentes ALA ASESINA pueden reaccionar sin importar su orden. Acción libre de 1PA, una vez por punto de inflexión.' },
      { n: 'Repetición de mando', t: 'Ardid universal (1PM). Puedes repetir uno de tus dados de ataque o defensa.' },
    ],
    actions: [
      { n: 'Reposicionar', cost: '1PA', t: 'Mueve hasta MOV. No puede mover por zonas de control enemigas.' },
      { n: 'Correr',       cost: '1PA', t: 'Como Reposicionar, pero máx. 3", sin trepar, no en zona de control enemiga.' },
      { n: 'Retroceder',   cost: '2PA', t: 'Como Reposicionar, puede pasar por zonas de control enemigas sin terminar ahí.' },
      { n: 'Cargar',       cost: '1PA', t: 'Como Reposicionar, +2" adicionales, debe terminar en zona de control enemiga. Si usa IMPULSO durante Cargar, no suma 2" adicionales.' },
      { n: 'Disparar',     cost: '1PA', t: 'Elige arma y blanco válido. Tira dados de ataque. El defensor tira 3 dados de defensa.' },
      { n: 'Combatir',     cost: '1PA', t: 'Elige enemigo en zona de control; contraatacará. Ambos eligen arma y alternan Golpear o Bloquear.' },
    ],
    wr: [
      { n: 'Alcance x"',        t: 'Solo agentes a esa distancia o menos pueden ser blancos válidos.' },
      { n: 'Área x"',           t: 'Dispara también contra cada agente visible a esa distancia o menos del blanco primario.' },
      { n: 'Brutal',            t: 'El oponente solo puede bloquear con éxitos críticos.' },
      { n: 'Castigadora',       t: 'Si guardas algún éxito crítico, puedes guardar uno de tus fallos como éxito normal.' },
      { n: 'Choque',            t: 'La primera vez que golpees con crítico, descarta un éxito normal sin resolver del oponente.' },
      { n: 'Desgarradora',      t: 'Si guardas algún éxito crítico, puedes guardar uno de tus éxitos normales como éxito crítico.' },
      { n: 'Devastadora x',     t: 'Cada éxito crítico guardado inflige X daño adicional inmediato.' },
      { n: 'Equilibrada',       t: 'Puedes repetir 1 de tus dados de ataque.' },
      { n: 'Incesante',         t: 'Puedes repetir cualquiera de tus dados de ataque con un resultado concreto.' },
      { n: 'Letal x+',          t: 'Tus éxitos iguales o superiores a X son éxitos críticos.' },
      { n: 'Penetración x',     t: 'El defensor guarda X dados de defensa menos.' },
      { n: 'Ráfaga x"',         t: 'Dispara también contra blancos secundarios válidos a esa distancia.' },
      { n: 'Saturación',        t: 'El defensor no puede guardar salvaciones por cobertura.' },
      { n: 'Severa',            t: 'Si no guardas ningún éxito crítico, puedes cambiar un éxito normal a crítico.' },
      { n: 'Sobrecalentamiento', t: 'Tras usar esta arma, tira 1D6. Si el resultado es inferior al Impactar, sufres ese resultado × 2 de daño.' },
    ],
  },
};

// Facciones próximamente
window.COMING_SOON = [
  { name: 'Ork Kommandos',      icon: '🔧' },
  { name: 'Tempestus Aquilons', icon: '⚡' },
];
