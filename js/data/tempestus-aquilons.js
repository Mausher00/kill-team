// ============================================================
//  data/tempestus-aquilons.js — Tempestus Aquilons
//  img: ruta local desde la raíz del proyecto
// ============================================================

FACTIONS['tempestus-aquilons'] = {
  id: 'tempestus-aquilons', name: 'Tempestus Aquilons', subfaction: 'Militarum Tempestus',
  icon: '⚡', img: 'Imagenes/tempestus-aquilons.png',
  desc: 'Soldados de élite del Imperium que descienden desde las alturas en paracaídas gravíticos. Maestros del ataque por inserción, combinan potencia de fuego con posicionamiento táctico.',
  tags: ['Imperium', 'Élite', 'Reconocimiento', 'Buscar y Destruir'], version: '1.0',

  ops: [
    {
      id: 'tempestor', name: 'Tempestor Aquilon', type: 'LÍDER',
      img: 'Imagenes/tempestus-aquilons-img/tempestor.jpg',
      s: { lpa: 3, mov: '6"', salv: '4+', h: 9 },
      kw: ['TEMPESTUS AQUILON', 'IMPERIUM', 'LÍDER', 'TEMPESTOR'],
      w: [
        { n: 'Carabina láser potenciada',  a: 4, i: '3+', d: '3/4', r: [] },
        { n: 'Pistola láser potenciada',   a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Pistola bólter reliquia',    a: 4, i: '3+', d: '3/5', r: ['Alcance 8"', 'Letal 5+'] },
        { n: 'Espada sierra',              a: 4, i: '3+', d: '4/5', r: [] },
        { n: 'Puños',                      a: 3, i: '3+', d: '2/3', r: [] },
        { n: 'Arma de energía',            a: 4, i: '3+', d: '4/6', r: ['Letal 5+'] },
      ],
      ru: [
        { n: 'Veterano tempestus', t: 'Una vez por batalla, puedes usar o bien un ardid de tiroteo por 0PM si este es el agente TEMPESTUS AQUILON especificado, o bien el ardid de tiroteo Repetición de mando por 0PM si este es el agente por el que se han tirado los dados de ataque o defensa.' },
        { n: 'Mando (1PA)', t: 'APOYO. Elige un agente TEMPESTUS AQUILON amigo distinto (salvo SERVOCENTINELA) a 6" o menos de este agente y visible para él. Hasta el final de la siguiente activación de ese agente, suma 1 a su atributo LPA. No puede realizarse si está en zona de control enemiga.', isAct: true },
      ],
    },
    {
      id: 'granadero', name: 'Granadero Aquilon', type: 'GRANADERO',
      img: 'Imagenes/tempestus-aquilons-img/granadero.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 8 },
      kw: ['TEMPESTUS AQUILON', 'IMPERIUM', 'GRANADERO'],
      w: [
        { n: 'Pistola láser potenciada', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Bomba de fusión',          a: 4, i: '3+', d: '5/3', r: ['Alcance 3"', 'Devastadora 3', 'Limitada 1', 'Penetración 2', 'Pesada (solo Reposicionarse)'] },
        { n: 'Puños',                    a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Granadero', t: 'Este agente puede usar granadas frag, perforantes, de humo y aturdidoras (ver equipo universal). Hacer esto no cuenta de cara a los usos limitados que tengas. Cuando use una granada frag o perforante, mejora en 1 el atributo Impactar de esa arma.' },
      ],
    },
    {
      id: 'pistolero', name: 'Pistolero Aquilon', type: 'PISTOLERO',
      img: 'Imagenes/tempestus-aquilons-img/pistolero.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 8 },
      kw: ['TEMPESTUS AQUILON', 'IMPERIUM', 'PISTOLERO'],
      w: [
        { n: 'Pistolas láser potenciadas (concentradas)', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"', 'Desgarradora', 'Incesante'] },
        { n: 'Pistolas láser potenciadas (salva)',        a: 4, i: '4+', d: '3/4', r: ['Alcance 8"', 'Salva*'] },
        { n: 'Pistolas láser potenciadas (a bocajarro)',  a: 4, i: '3+', d: '3/4', r: ['Incesante'] },
      ],
      ru: [
        { n: 'Salva*', t: 'Elige hasta dos blancos válidos diferentes que no estén en la zona de control de agentes amigos. Dispara con esta arma contra ambos en el orden que elijas (tira cada secuencia por separado).' },
        { n: 'Tirotear', t: 'Siempre que un agente enemigo a 8" o menos de este agente dispare contra él, lleva la cuenta de cada dado de ataque descartado como fallo. Tras la acción, antes de retirar a los agentes incapacitados, este agente puede realizar una acción libre de Disparar (cambia su orden a trabarse), pero solo puede tomar como blanco a ese agente enemigo con sus pistolas láser potenciadas (concentrado), y solo puedes tirar tantos dados de ataque como los dados descartados del oponente más 1 (máx. 4).' },
      ],
    },
    {
      id: 'tirador', name: 'Tirador Aquilon', type: 'TIRADOR',
      img: 'Imagenes/tempestus-aquilons-img/tirador.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 8 },
      kw: ['TEMPESTUS AQUILON', 'IMPERIUM', 'TIRADOR'],
      w: [
        { n: 'Carabina de fusión',              a: 4, i: '3+', d: '6/3', r: ['Alcance 6"', 'Devastadora 4', 'Penetración 2'] },
        { n: 'Carabina de plasma (normal)',      a: 4, i: '3+', d: '4/6', r: ['Penetración 1'] },
        { n: 'Carabina de plasma (sobrecarga)',  a: 4, i: '3+', d: '5/6', r: ['Letal 5+', 'Penetración 1', 'Sobrecalentamiento'] },
        { n: 'Puños',                            a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [],
    },
    {
      id: 'ojo-preciso', name: 'Ojo Preciso Aquilon', type: 'OJO PRECISO',
      img: 'Imagenes/tempestus-aquilons-img/ojo-preciso.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 8 },
      kw: ['TEMPESTUS AQUILON', 'IMPERIUM', 'OJO PRECISO'],
      w: [
        { n: 'Rifle láser telescópico potenciado (oculto)',   a: 4, i: '2+', d: '3/3', r: ['Devastadora 3', 'Pesada', 'Silenciosa', 'Posición oculta*'] },
        { n: 'Rifle láser telescópico potenciado (móvil)',    a: 4, i: '3+', d: '3/4', r: [] },
        { n: 'Rifle láser telescópico potenciado (inmóvil)',  a: 4, i: '2+', d: '3/3', r: ['Devastadora 3', 'Pesada'] },
        { n: 'Puños',                                         a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Posición oculta*', t: 'Este agente solo puede usar el perfil oculto la primera vez que realiza una acción de Disparar durante la batalla.' },
        { n: 'Ventaja de francotirador', t: 'Siempre que este agente esté en terreno Aventajado y dispare contra un agente que tenga una orden de trabarse y se encuentre al menos 2" por debajo de él, todos los perfiles de su rifle láser telescópico potenciado tienen la regla de arma Severa.' },
      ],
    },
    {
      id: 'precursor', name: 'Precursor Aquilon', type: 'PRECURSOR',
      img: 'Imagenes/tempestus-aquilons-img/precursor.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 8 },
      kw: ['TEMPESTUS AQUILON', 'IMPERIUM', 'PRECURSOR'],
      w: [
        { n: 'Pistola láser potenciada', a: 4, i: '3+', d: '3/4', r: ['Alcance 8"'] },
        { n: 'Daga Tempestus',           a: 4, i: '3+', d: '3/4', r: ['Incesante', 'Letal 5+'] },
      ],
      ru: [
        { n: 'Salvaje luchador a cuchillo', t: 'Cuando este agente combata, tras resolver tu primer dado de ataque, puedes resolver otro de inmediato (antes que tu oponente).' },
        { n: 'Enérgico', t: 'Siempre que este agente realice la acción de Combatir o Disparar, puede realizar inmediatamente después una acción libre de Correr. Puede hacerlo incluso si ha realizado una acción de Cargar durante esta activación, pero solo puede usar la distancia restante que le quedase de esa acción de Cargar (hasta un máximo de 3").' },
      ],
    },
    {
      id: 'servocentinela', name: 'Servocentinela Aquilon', type: 'SERVOCENTINELA',
      img: 'Imagenes/tempestus-aquilons-img/servocentinela.jpg',
      s: { lpa: 2, mov: '4"', salv: '3+', h: 10 },
      kw: ['TEMPESTUS AQUILON', 'IMPERIUM', 'SERVOCENTINELA'],
      w: [
        { n: 'Lanzallamas',                               a: 4, i: '2+', d: '3/3', r: ['Alcance 8"', 'Ráfaga 2"', 'Saturación'] },
        { n: 'Lanzagranadas (frag)',                       a: 4, i: '4+', d: '2/4', r: ['Área 2"'] },
        { n: 'Lanzagranadas (perforante)',                 a: 4, i: '4+', d: '4/5', r: ['Penetración 1'] },
        { n: 'Fusil repetidor potenciado (concentrado)',   a: 5, i: '4+', d: '3/4', r: ['Críticos de penetración 1'] },
        { n: 'Fusil repetidor potenciado (barrido)',       a: 4, i: '4+', d: '3/4', r: ['Críticos de penetración 1', 'Ráfaga 1"'] },
      ],
      ru: [
        { n: 'Máquina', t: 'Este agente solo puede realizar acciones de Correr, Disparar, Reposicionarse y Retroceder. No puede contraatacar, asistir en un combate ni usar armas que no figuren en su tarjeta de datos.' },
        { n: 'Torreta', t: 'Este agente puede realizar dos acciones de Disparar durante su activación.' },
      ],
    },
    {
      id: 'soldado', name: 'Soldado Aquilon', type: 'SOLDADO',
      img: 'Imagenes/tempestus-aquilons-img/soldado.jpg',
      s: { lpa: 2, mov: '6"', salv: '4+', h: 8 },
      kw: ['TEMPESTUS AQUILON', 'IMPERIUM', 'SOLDADO'],
      w: [
        { n: 'Carabina láser potenciada', a: 4, i: '3+', d: '3/4', r: [] },
        { n: 'Puños',                     a: 3, i: '4+', d: '2/3', r: [] },
      ],
      ru: [
        { n: 'Inserción rápida', t: 'GAMBITO ESTRATÉGICO en la primera fase de estrategia. Cada agente SOLDADO TEMPESTUS AQUILON amigo completamente dentro de tu zona de descenso puede realizar inmediatamente una acción libre de Reposicionarse, pero debe terminar dicha acción completamente a 3" o menos de tu zona de descenso.' },
        { n: 'Aterrizaje raudo', t: 'Cuando este agente aterrice, puedes desplegarlo a 4" o menos en horizontal de uno de tus marcadores de descenso. Esto tiene preferencia sobre el requisito normal de distancia.' },
      ],
    },
  ],

  // ── REGLAS GENERALES ───────────────────────────────────────
  gr: {
    concepts: [
      { n: 'Descenso de inserción', t: 'El primer tercio del comando se despliega normalmente. Los tercios posteriores pueden desplegarse "en las alturas" (a un lado, no en la zona de aniquilación). Por cada tercio en las alturas se coloca un marcador de descenso dentro de tu zona de descenso. En los puntos de inflexión 1 y 2 puedes mover los marcadores de descenso hasta 4" como GAMBITO ESTRATÉGICO. Al activar un agente en las alturas decides si aterriza (se despliega a 3" de un marcador de descenso o en tu zona, fuera de zonas de control enemigas salvo PRECURSOR, sin peana bajo terreno Aventajado, con la orden que elijas, gastando PA como Reposicionarse) o permanece en las alturas. El agente que aterriza se considera ofuscado hasta el final de la siguiente activación o del punto de inflexión. Menos de la mitad de tus agentes pueden estar en las alturas al final del primer punto de inflexión. Al preparar los puntos de inflexión 2 y 3 se retira un marcador; los agentes que sigan en las alturas quedan incapacitados al final del segundo punto de inflexión.' },
      { n: 'Paracaídas gravítico', t: 'Siempre que un agente TEMPESTUS AQUILON amigo se deja caer, ignora la distancia vertical.' },
      { n: 'Ficha de Detectado', t: 'Ficha obtenida mediante el ardid Ojos vigilantes. Mientras un agente enemigo la porte: si dispara contra un TEMPESTUS AQUILON amigo, puedes repetir uno de tus dados de defensa; si combate/contraataca contra un TEMPESTUS AQUILON amigo, uno de tus bloqueos puede asignarse a bloquear dos éxitos sin resolver.' },
    ],
    orders: [
      { n: 'Orden de trabarse', t: 'El agente puede realizar acciones y reaccionar normalmente.' },
      { n: 'Orden de ocultarse', t: 'El agente no es blanco válido mientras esté a cubierto. No puede Disparar ni Cargar.' },
    ],
    phases: [
      { n: 'Fase de estrategia', t: 'Tira iniciativa (Supervisor remoto permite repetir el D6). Se ganan PM. Los jugadores alternan usando GAMBITOS ESTRATÉGICOS o pasando. Los marcadores de descenso pueden moverse 4" en los puntos de inflexión 1 y 2.' },
      { n: 'Fase de tiroteo', t: 'Los jugadores alternan activando agentes. Cada agente en las alturas puede aterrizar o mantenerse. El Servocentinela puede realizar dos acciones de Disparar por activación.' },
    ],
    actions: [
      { n: 'Reposicionarse', cost: '1PA', t: 'Mueve hasta MOV. No puede moverse a través de zonas de control enemigas.' },
      { n: 'Correr',         cost: '1PA', t: 'Como Reposicionar, pero máx. 3", sin trepar, no en zona de control enemiga.' },
      { n: 'Cargar',         cost: '1PA', t: 'Como Reposicionar, +2" adicionales, debe terminar en zona de control enemiga.' },
      { n: 'Retroceder',     cost: '2PA', t: 'Como Reposicionar, puede pasar por zonas de control enemigas sin terminar ahí.' },
      { n: 'Disparar',       cost: '1PA', t: 'Elige arma y blanco válido. Tira dados de ataque. El defensor tira 3 dados de defensa.' },
      { n: 'Combatir',       cost: '1PA', t: 'Elige enemigo en zona de control; contraatacará. Ambos eligen arma y alternan Golpear o Bloquear.' },
      { n: 'Mando',          cost: '1PA', t: 'APOYO (solo Tempestor). Suma 1 LPA a un agente TEMPESTUS AQUILON amigo a 6" o menos hasta el final de su siguiente activación.' },
    ],
    wr: [
      { n: 'Salva*',              t: 'Elige hasta dos blancos válidos diferentes que no estén en zona de control amiga. Dispara contra ambos por separado.' },
      { n: 'Posición oculta*',    t: 'Solo puede usarse la primera vez que el agente realiza una acción de Disparar en la batalla.' },
      { n: 'Desgarradora',        t: 'Si guardas algún éxito crítico, puedes guardar uno de tus éxitos normales como éxito crítico.' },
      { n: 'Incesante',           t: 'Puedes repetir cualquiera de tus dados de ataque con un resultado concreto.' },
      { n: 'Letal 5+',            t: 'Tus éxitos iguales o superiores a 5 son éxitos críticos.' },
      { n: 'Devastadora 3/4',     t: 'Cada éxito crítico guardado inflige X daño adicional inmediato.' },
      { n: 'Penetración 1/2',     t: 'El defensor guarda X dados de defensa menos.' },
      { n: 'Pesada',              t: 'No se puede usar si el agente ha movido, ni mover tras usarla.' },
      { n: 'Silenciosa',          t: 'Puede usarse aunque el agente tenga orden de ocultarse.' },
      { n: 'Severa',              t: 'Si no guardas ningún éxito crítico, puedes cambiar un éxito normal a crítico.' },
      { n: 'Saturación',          t: 'El defensor no puede guardar salvaciones por cobertura.' },
      { n: 'Ráfaga 1"/2"',        t: 'Dispara también contra blancos secundarios válidos a esa distancia.' },
      { n: 'Área 2"',             t: 'Dispara también contra cada agente visible a 2" o menos del blanco primario.' },
      { n: 'Críticos de penetración 1', t: 'Los éxitos críticos del atacante tienen Penetración 1 adicional.' },
      { n: 'Sobrecalentamiento',  t: 'Tras usar esta arma, tira 1D6. Si el resultado es inferior al Impactar, sufres ese resultado × 2 de daño.' },
      { n: 'Limitada 1',          t: 'El agente deja de tener esta arma tras usarla 1 vez.' },
      { n: 'Equilibrada',         t: 'Puedes repetir 1 de tus dados de ataque.' },
    ],
  },

  // ── REGLAS DE FACCIÓN ──────────────────────────────────────
  fr: {
    type: 'Reglas de facción',
    name: 'Tempestus Aquilons — Militarum Tempestus',
    text: 'Dos reglas de facción: DESCENSO DE INSERCIÓN y PARACAÍDAS GRAVÍTICO.',
    orders: [
      { n: 'Descenso de inserción', t: 'Al desplegar, el primer tercio del comando se despliega normalmente. Cada tercio posterior puede desplegarse "en las alturas": se coloca a un lado y se sitúa un marcador de descenso dentro de tu zona de descenso. En los puntos de inflexión 1 y 2, puedes mover marcadores de descenso hasta 4" como GAMBITO ESTRATÉGICO (en combate cerrado puedes medirlos y moverlos a través de muros). Al activar un agente en las alturas, decides si aterriza (a 3" de un marcador o en tu zona, fuera de zonas de control enemigas salvo PRECURSOR, sin peana bajo terreno Aventajado, con orden a tu elección, gastando PA como Reposicionarse, y considerado ofuscado hasta el final de la siguiente activación o del punto de inflexión) o si permanece en las alturas. Menos de la mitad de tus agentes pueden estar en las alturas al final del primer punto de inflexión. Al preparar los puntos de inflexión 2 y 3 se retira un marcador; los agentes que sigan en las alturas al final del segundo punto de inflexión quedan incapacitados.' },
      { n: 'Paracaídas gravítico', t: 'Siempre que un agente TEMPESTUS AQUILON amigo se deja caer, ignora la distancia vertical.' },
    ],
  },

  // ── ARDIDES ────────────────────────────────────────────────
  pl: {
    s: [
      { n: 'Ofensiva súbita', t: 'Cuenta el número de agentes TEMPESTUS AQUILON amigos no incapacitados y redúcelo a la mitad redondeando al alza (resultado X). Hasta el final de su activación, las armas de los X primeros agentes TEMPESTUS AQUILON amigos en ser activados durante este punto de inflexión tienen la regla de armas Equilibrada.' },
      { n: 'Mantener la dinámica', t: 'Siempre que un agente TEMPESTUS AQUILON amigo dispare contra o combata contra un agente enemigo apostado, sus armas tienen la regla de arma Severa.' },
      { n: 'Ojos vigilantes', t: 'Elige un agente enemigo. Ese agente y todos los demás a 3" o menos de él ganan una de tus fichas de Detectado hasta el final del punto de inflexión. Mientras un agente enemigo con ficha de Detectado dispare contra un TEMPESTUS AQUILON amigo, puedes repetir uno de tus dados de defensa; si combate o contraataca contra un TEMPESTUS AQUILON amigo, uno de tus bloqueos puede asignarse a bloquear dos éxitos sin resolver (en lugar de solo uno).' },
      { n: 'Descender y asegurar', t: 'Elige un marcador. Hasta el paso de Preparación del siguiente punto de inflexión: al determinar el control de ese marcador, trata el LPA total de los agentes TEMPESTUS AQUILON amigos que lo disputen como 1 mayor (si hay al menos uno disputándolo); mientras un agente TEMPESTUS AQUILON amigo esté a 3" o menos de ese marcador, suma 1 al atributo Ataque de sus armas de combate (máx. 4).' },
    ],
    f: [
      { n: 'Inserción en zona caliente', t: 'Úsalo tras tirar los dados de ataque de un agente TEMPESTUS AQUILON amigo que esté completamente en el territorio del oponente, o que haya aterrizado o se haya dejado caer desde terreno Aventajado al menos 2" por encima del suelo de la zona de aniquilación durante esta activación. Si el blanco está a 6" o menos, puedes repetir cualesquiera de tus dados de ataque.' },
      { n: 'Ajustar coordenadas', t: 'Úsalo cuando un agente TEMPESTUS AQUILON amigo aterrice. Puedes desplegarlo a 5" o menos en horizontal de uno de tus marcadores de descenso (preferencia sobre el requisito normal de distancia). No puede realizar acciones de Combatir, Correr o Disparar durante este punto de inflexión.' },
      { n: 'Tempestus ejemplares', t: 'Úsalo durante la activación de un agente TEMPESTUS AQUILON amigo (salvo SERVOCENTINELA o cualquier agente con LPA mayor de 2). Durante esa activación, puede realizar la acción Colocar marcador, Recoger marcador o una acción de misión por 1PA menos.' },
      { n: 'Progena', t: 'Úsalo cuando un agente TEMPESTUS AQUILON amigo (salvo SERVOCENTINELA) sea activado. Recupera 2D3 heridas perdidas y durante esa activación puedes ignorar cualquier cambio a su atributo LPA.' },
    ],
  },

  // ── EQUIPO ─────────────────────────────────────────────────
  eq: [
    { n: 'Dagas Tempestus', t: 'Los agentes TEMPESTUS AQUILON amigos (salvo SERVOCENTINELA) tienen la siguiente arma de combate adicional: Daga Tempestus — ATQ 3, IMP 4+, DAÑO 3/4.' },
    { n: 'Estimulantes de combate', t: 'Puedes ignorar cualquier cambio al atributo Movimiento de los agentes TEMPESTUS AQUILON amigos por estar lesionados.' },
    { n: 'Augurio preinserción', t: 'Una vez durante la batalla, al activar un agente TEMPESTUS AQUILON amigo desplegado en las alturas, antes de decidir si aterriza o es usado, puedes mover de nuevo uno de tus marcadores de descenso. No obstante, no puede moverse más cerca de lo que está de la zona de descenso del oponente.' },
    { n: 'Supervisor remoto', t: 'Una vez por batalla, tras desempatar para decidir la iniciativa, puedes repetir tu D6.' },
  ],

  // ── ERRATAS ────────────────────────────────────────────────
  er: [
    {
      v: 'Junio 2025',
      ee: [
        { s: 'Agente Pistolero — Regla de arma Salva', t: 'La primera frase cambia a: "Elige hasta dos blancos válidos diferentes que no estén en la zona de control de agentes amigos."' },
      ],
    },
    {
      v: 'Anteriores',
      ee: [
        { s: 'Ardides estratégicos — Mantener la dinámica', t: 'Cambia a: "Siempre que un agente TEMPESTUS AQUILON amigo dispare contra o combata contra un agente enemigo apostado, sus armas tienen la regla de arma Severa."' },
        { s: 'Ardides de estrategia — Descender y asegurar', t: 'La primera frase del primer punto cambia a: "Hasta el paso de Preparación del siguiente punto de inflexión, al determinar el control de ese marcador, [...]"' },
        { s: 'Ardides de tiroteo — Inserción en zona caliente', t: 'La primera frase cambia a: "Úsalo tras tirar los dados de ataque de un agente TEMPESTUS AQUILON amigo que esté completamente en el territorio del oponente, o que haya aterrizado o se haya dejado caer desde terreno Aventajado al menos 2\\" por encima del suelo de la zona de aniquilación durante esta activación."' },
        { s: 'Selección de comando — Servocentinela', t: 'SERVOCENTINELA pasa a tener su propio punto separado en la selección de comando. Se elimina la restricción "No puedes elegir más de tres de estos agentes en total" en TIRADOR, OJO PRECISO y SERVOCENTINELA.' },
        { s: 'Agente Precursor — Arma Daga Tempestus', t: 'Se añade la regla de arma Incesante a la Daga Tempestus del Precursor.' },
      ],
    },
  ],
};
