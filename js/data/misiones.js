// ============================================================
//  data/misiones.js — Operaciones aprobadas 2025 (juego equilibrado)
//  Fuente: recopilación de aficionado del mazo «Approved Ops 2025»
//  (KTbay-DIY, ago. 2026). Traducción al castellano con la
//  terminología de las reglas oficiales en español.
//  Imágenes de las cartas originales: imagenes/misiones/
//  Script de extracción: herramientas/misiones/extraer.py
// ============================================================

window.OPS = {
  version: 'Approved Ops 2025',

  // ── Secuencia de juego equilibrado ─────────────────────────
  secuencia: [
    { t: 'Preparar la batalla', p: [
      'Elegid los equipos y montad la zona de aniquilación.',
      'Determinad la operación crítica y colocad los marcadores de objetivo.',
      'Tirada enfrentada: el ganador decide quién tiene la iniciativa.',
      'El jugador con la iniciativa elige zona de despliegue.' ] },
    { t: 'Elegir agentes', p: [
      'Revelad a la vez la selección de agentes y cuatro opciones de equipo.',
      'Cada jugador gana 2PM.',
      'Cada jugador elige en secreto una operación táctica.' ] },
    { t: 'Desplegar (empieza quien tiene la iniciativa)', p: [
      'Alternad colocando los elementos de equipo.',
      'Alternad desplegando ⅓ del equipo, totalmente dentro de la zona de despliegue, con orden de ocultarse.' ] },
    { t: 'Jugar la batalla', p: [
      'Tirada enfrentada de iniciativa (los empates se mantienen). El perdedor empieza; alternad jugando cartas de iniciativa hasta que ambos paséis.',
      'Aplicad antes las reglas de tirada enfrentada de los equipos, empezando por el perdedor.',
      'El ganador elige quién tiene la iniciativa. El perdedor (salvo en el PI 4) gana la carta de iniciativa de ese punto de inflexión. Si hay empate, gana quien no tenía la iniciativa.',
      'Como GAMBITO ESTRATÉGICO del primer punto de inflexión, elegid en secreto la operación principal.',
      'Máximo 6PV por cada operación.' ] },
    { t: 'Terminar la batalla', p: [
      'Tras 4 puntos de inflexión, revelad a la vez la operación principal y puntuad PV adicionales iguales a la mitad (redondeando hacia arriba) de lo puntuado con ella.',
      'Gana quien tenga más PV. Si hay empate, es un empate.' ] },
  ],

  // ── Operación principal ────────────────────────────────────
  primaria: {
    txt: 'Como GAMBITO ESTRATÉGICO en el primer punto de inflexión, cada jugador elige en secreto una de sus tres operaciones (1. Crítica, 2. Eliminación, 3. Táctica) como operación principal. Al final de la batalla, los jugadores revelan su elección a la vez y puntúan PV adicionales iguales a la mitad de lo que puntuaron con esa operación (redondeando hacia arriba).',
    cartas: { crit: 'imagenes/misiones/primaria-crit.webp', kill: 'imagenes/misiones/primaria-kill.webp', tac: 'imagenes/misiones/primaria-tac.webp' },
  },

  // ── Operación de eliminación ───────────────────────────────
  kill: {
    name: 'Operación de eliminación',
    img: 'imagenes/misiones/kill-op.webp',
    txt: 'Empiezas sin grado de eliminación. A medida que incapacitas agentes enemigos tu grado sube, hasta un máximo de 5. Cada vez que alcanzas un grado nuevo, puntúas 1PV. Al final del cuarto punto de inflexión, si tu grado es mayor que el de tu rival, puntúas 1PV.',
    // filas: número inicial de agentes enemigos -> enemigos incapacitados necesarios para cada grado (1–5)
    tabla: {
      5: [1, 2, 3, 4, 5], 6: [1, 2, 4, 5, 6], 7: [1, 3, 4, 6, 7], 8: [2, 3, 5, 6, 8], 9: [2, 4, 5, 7, 9],
      10: [2, 4, 6, 8, 10], 11: [2, 4, 6, 9, 11], 12: [2, 5, 7, 10, 12], 13: [3, 5, 8, 10, 13], 14: [3, 6, 8, 11, 14],
    },
  },

  // ── Cartas de iniciativa ───────────────────────────────────
  iniciativa: [
    { id: 'rr', name: 'Repetir', sub: 'tu tirada de iniciativa', img: 'imagenes/misiones/ini-repetir.webp',
      txt: 'Para el jugador que NO tenía la iniciativa al preparar la batalla (no eligió zona de despliegue). Puede usarla una vez en una fase de estrategia posterior.' },
    { id: 'i1', name: '+1 / −1', sub: 'a tu tirada de iniciativa', img: 'imagenes/misiones/ini-1.webp',
      txt: 'Para el jugador que perdió la tirada de iniciativa del primer punto de inflexión. Puede usarla una vez en una fase de estrategia posterior.' },
    { id: 'i2', name: '+2 / −2', sub: 'a tu tirada de iniciativa', img: 'imagenes/misiones/ini-2.webp',
      txt: 'Para el jugador que perdió la tirada de iniciativa del segundo punto de inflexión. Puede usarla una vez en una fase de estrategia posterior.' },
    { id: 'i3', name: '+3 / −3', sub: 'a tu tirada de iniciativa', img: 'imagenes/misiones/ini-3.webp',
      txt: 'Para el jugador que perdió la tirada de iniciativa del tercer punto de inflexión. Puede usarla una vez en una fase de estrategia posterior.' },
  ],

  // ── Operaciones críticas ───────────────────────────────────
  // acciones: { n, pa, ef: [efectos ⯈], no: restricción ⯁ }
  crit: [
    { n: 1, id: 'secure', name: 'Asegurar', en: 'Secure', img: 'imagenes/misiones/crit-1.webp',
      acciones: [{ n: 'Asegurar', pa: 1,
        ef: ['Un marcador de objetivo que controle el agente activo queda asegurado por tu equipo hasta que el equipo enemigo asegure ese marcador.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión ni mientras esté en la zona de control de un agente enemigo.' }],
      pv: ['Al final de cada punto de inflexión después del primero:',
        '• Si tu equipo tiene asegurado algún marcador de objetivo, puntúas 1PV.',
        '• Si tu equipo tiene asegurados más marcadores de objetivo que el equipo rival, puntúas 1PV.'] },

    { n: 2, id: 'loot', name: 'Saquear', en: 'Loot', img: 'imagenes/misiones/crit-2.webp',
      acciones: [{ n: 'Saquear', pa: 1,
        ef: ['Un marcador de objetivo que controle el agente activo queda saqueado.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión, mientras esté en la zona de control de un agente enemigo, o si ese marcador ya ha sido saqueado durante este punto de inflexión.' }],
      pv: ['Cada vez que un agente amigo realiza la acción Saquear, puntúas 1PV (máximo 2PV por punto de inflexión).'] },

    { n: 3, id: 'transmission', name: 'Transmisión', en: 'Transmission', img: 'imagenes/misiones/crit-3.webp',
      acciones: [{ n: 'Iniciar transmisión', pa: 1,
        ef: ['Un marcador de objetivo que controle el agente activo está transmitiendo hasta el inicio del siguiente punto de inflexión.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión ni mientras esté en la zona de control de un agente enemigo.' }],
      pv: ['Al final de cada punto de inflexión después del primero:',
        '• Si los agentes amigos controlan algún marcador de objetivo que esté transmitiendo, puntúas 1PV.',
        '• Si los agentes amigos controlan más marcadores que estén transmitiendo que los agentes enemigos, puntúas 1PV.'] },

    { n: 4, id: 'orb', name: 'Orbe', en: 'Orb', img: 'imagenes/misiones/crit-4.webp',
      reglas: ['Al inicio de la batalla, el marcador de objetivo central tiene la ficha de Orbe.'],
      acciones: [{ n: 'Mover orbe', pa: 1,
        ef: ['Si el agente activo controla el marcador de objetivo que tiene la ficha de Orbe, mueve esa ficha así:',
          '• Si la tiene el marcador central, muévela al marcador de objetivo de cualquiera de los jugadores (a tu elección).',
          '• Si la tiene el marcador de un jugador, muévela al marcador central.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión, mientras esté en la zona de control de un agente enemigo, o si no controla el marcador que tiene la ficha de Orbe.' }],
      pv: ['Al final de cada punto de inflexión después del primero, por cada marcador de objetivo que controlen los agentes amigos y que no tenga la ficha de Orbe, puntúas 1PV.'] },

    { n: 5, id: 'stake-claim', name: 'Reclamar posición', en: 'Stake Claim', img: 'imagenes/misiones/crit-5.webp',
      reglas: ['Al inicio del paso de gambito de cada fase de estrategia después de la primera, empezando por el jugador con la iniciativa, cada jugador debe elegir un marcador de objetivo y una de estas reclamaciones para ese punto de inflexión:',
        '• Los agentes amigos controlarán ese marcador de objetivo al final de este punto de inflexión.',
        '• Los agentes enemigos no disputarán ese marcador de objetivo al final de este punto de inflexión.',
        'Cada jugador no puede elegir el mismo marcador más de una vez por batalla (debe elegir cada marcador una vez durante la batalla).'],
      pv: ['Al final de cada punto de inflexión después del primero:',
        '• Si los agentes amigos controlan más marcadores de objetivo que los agentes enemigos, puntúas 1PV.',
        '• Si tu reclamación es cierta, puntúas 1PV.'] },

    { n: 6, id: 'energy-cells', name: 'Células de energía', en: 'Energy Cells', img: 'imagenes/misiones/crit-6.webp',
      reglas: ['Los agentes pueden realizar la acción Recoger marcador sobre cada marcador de objetivo en estos puntos de inflexión:',
        '• 2: gastando 2PA adicionales (la acción no puede ser gratuita ni reducirse su coste en PA).',
        '• 3: gastando 1PA adicional (la acción no puede ser gratuita ni reducirse su coste en PA).',
        '• 4: de la forma normal.',
        'Mientras un agente lleve un marcador de objetivo, no puede ser retirado y desplegado de nuevo a más de 6" de distancia.'],
      pv: ['Al final de cada punto de inflexión después del primero, si los agentes amigos controlan más marcadores de objetivo que los agentes enemigos, puntúas 1PV.',
        'Al final de la batalla, por cada marcador de objetivo que lleven agentes amigos, puntúas 1PV.'] },

    { n: 7, id: 'download', name: 'Descarga', en: 'Download', img: 'imagenes/misiones/crit-7.webp',
      acciones: [{ n: 'Descargar', pa: 1,
        ef: ['El marcador de objetivo central o el del rival que controle el agente activo queda descargado.'],
        no: 'Un agente no puede realizar esta acción durante el primer o el segundo punto de inflexión, mientras esté en la zona de control de un agente enemigo, o si ese marcador ya ha sido descargado durante la batalla.' }],
      pv: ['• Al final de cada punto de inflexión después del primero, si los agentes amigos controlan más marcadores de objetivo que los agentes enemigos, puntúas 1PV. Ignora los marcadores descargados para determinarlo.',
        '• Cada vez que un agente amigo realiza la acción Descargar durante el tercer punto de inflexión, puntúas 1PV.',
        '• Cada vez que un agente amigo realiza la acción Descargar durante el cuarto punto de inflexión, puntúas 2PV.'] },

    { n: 8, id: 'data', name: 'Datos', en: 'Data', img: 'imagenes/misiones/crit-8.webp',
      acciones: [
        { n: 'Recopilar datos', pa: 1,
          ef: ['Un marcador de objetivo que controle el agente activo gana 1 punto de Datos. Usa un dado como ficha para llevar la cuenta de los puntos de Datos de ese marcador.'],
          no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión, mientras esté en la zona de control de un agente enemigo, o si ese marcador ya ha ganado un punto de Datos durante este punto de inflexión.' },
        { n: 'Enviar datos', pa: 1,
          ef: ['Retira todos los puntos de Datos de un marcador de objetivo que controle el agente activo.'],
          no: 'Un agente no puede realizar esta acción durante el primer, segundo o tercer punto de inflexión, mientras esté en la zona de control de un agente enemigo, o si ese marcador no tiene puntos de Datos que retirar.' }],
      pv: ['• Al final del segundo y del tercer punto de inflexión, si los agentes amigos han realizado más acciones Recopilar datos durante ese punto de inflexión que los agentes enemigos, puntúas 1PV.',
        '• Cada vez que un agente amigo realiza la acción Enviar datos, puntúas tantos PV como puntos de Datos se hayan retirado.'] },

    { n: 9, id: 'reboot', name: 'Reinicio', en: 'Reboot', img: 'imagenes/misiones/crit-9.webp',
      reglas: ['Al preparar la batalla, tras colocar los marcadores de objetivo, numéralos del 1 al 3.',
        'Al inicio del paso de gambito de cada fase de estrategia, cada jugador elige en secreto un marcador de objetivo poniendo en su mano tantos dados como el número de ese marcador; después se revelan a la vez:',
        '• Si ambos eligieron el mismo, ese marcador está inerte durante este punto de inflexión.',
        '• Si no, el marcador que no eligió ningún jugador está inerte durante este punto de inflexión.'],
      acciones: [{ n: 'Reiniciar', pa: 2,
        ef: ['Un marcador de objetivo inerte que controle el agente activo deja de estar inerte.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión ni mientras esté en la zona de control de un agente enemigo.' }],
      pv: ['Al final de cada punto de inflexión después del primero, por cada marcador de objetivo que controlen los agentes amigos, puntúas 1PV. Ignora los marcadores inertes para determinarlo.'] },
  ],

  // ── Operaciones tácticas (por arquetipo) ───────────────────
  tac: [
    // SEGURIDAD
    { id: 'envoy', arq: 'Seguridad', name: 'Emisario', en: 'Envoy', img: 'imagenes/misiones/tac-envoy.webp',
      revelar: 'La primera vez que eliges un emisario.',
      reglas: ['Como GAMBITO ESTRATÉGICO en cada punto de inflexión después del primero, elige un agente amigo como tu emisario hasta el paso de preparación de la siguiente fase de estrategia. No puedes elegir un agente que ya elegiste en un punto de inflexión anterior ni un agente que se ignore para la operación de eliminación.'],
      pv: ['Al final de cada punto de inflexión después del primero, si tu emisario está totalmente dentro del territorio enemigo y no está en la zona de control de agentes enemigos, puntúas 1PV; si además tu emisario no ha perdido ninguna herida durante ese punto de inflexión, puntúas 2PV en su lugar.'] },
    { id: 'martyrs', arq: 'Seguridad', name: 'Mártires', en: 'Martyrs', img: 'imagenes/misiones/tac-martyrs.webp',
      revelar: 'La primera vez que un agente amigo queda incapacitado mientras disputa un marcador de objetivo.',
      reglas: ['Cada vez que un agente amigo queda incapacitado mientras disputa un marcador de objetivo, ese marcador gana una de tus fichas de Mártir.',
        'Solo cuenta la primera vez que cada agente queda incapacitado: si un agente incapacitado vuelve a desplegarse (p. ej., Protocolos de reanimación del CÍRCULO HIEROTEK) y vuelve a quedar incapacitado, no se gana una segunda ficha de Mártir.'],
      pv: ['Al final de cada punto de inflexión después del primero, si los agentes amigos disputan un marcador de objetivo que tenga una o más de tus fichas de Mártir, puedes retirar cualquier número de ellas. Por cada ficha que retires, puntúas 1PV; si los agentes amigos además controlan ese marcador, puntúas 2PV en su lugar.',
        'No puedes puntuar más de 2PV con esta operación por punto de inflexión.'] },
    { id: 'plant-banner', arq: 'Seguridad', name: 'Plantar estandarte', en: 'Plant Banner', img: 'imagenes/misiones/tac-plant-banner.webp',
      revelar: 'Cuando realizas la acción Plantar estandarte.',
      acciones: [{ n: 'Plantar estandarte', pa: 1,
        ef: ['Coloca tu marcador de misión de Estandarte en la zona de control del agente activo, totalmente dentro del territorio de tu rival y a más de 5" de un borde neutral de la zona de aniquilación. Los agentes pueden realizar la acción Recoger marcador sobre tu marcador de Estandarte.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión, mientras esté en la zona de control de un agente enemigo, o si un agente amigo ya la ha realizado durante la batalla.' }],
      pv: ['Al final de cada punto de inflexión después del primero, si tu marcador de Estandarte está totalmente dentro del territorio de tu rival y lo controlan agentes amigos, puntúas 1PV; si además ningún agente enemigo lo disputa, puntúas 2PV en su lugar.',
        'El marcador de Estandarte debe estar en la zona de aniquilación (no llevado por un agente) para puntuar.'] },

    // RECONOCIMIENTO
    { id: 'flank', arq: 'Reconocimiento', name: 'Flanquear', en: 'Flank', img: 'imagenes/misiones/tac-flank.webp',
      revelar: 'Como GAMBITO ESTRATÉGICO.',
      reglas: ['Divide la zona de aniquilación en dos flancos (izquierdo y derecho) trazando una línea imaginaria como la línea central, pero que va del centro del borde de la zona de aniquilación de un jugador al del otro. Un agente disputa un flanco mientras esté totalmente dentro de él y totalmente dentro del territorio de su rival. Los agentes amigos controlan un flanco si la suma del atributo LPA de los que lo disputan es mayor que la de los agentes enemigos.'],
      pv: ['Después de revelar esta operación, al final de cada punto de inflexión después del primero, por cada flanco que controlen los agentes amigos, puntúas 1PV.',
        'En el cuarto punto de inflexión, si los agentes amigos también controlaban ese flanco al final del tercero, puntúas 2PV en su lugar.',
        'No puedes puntuar más de 2PV con esta operación por punto de inflexión.'] },
    { id: 'retrieval', arq: 'Reconocimiento', name: 'Recuperación', en: 'Retrieval', img: 'imagenes/misiones/tac-retrieval.webp',
      revelar: 'La primera vez que puntúas PV con esta operación.',
      acciones: [{ n: 'Recuperar', pa: 1,
        ef: ['Si el agente activo controla un marcador de objetivo que no haya sido registrado por agentes amigos, ese agente pasa a llevar uno de tus marcadores de misión de Recuperación y ese marcador de objetivo queda registrado por agentes amigos. Los agentes amigos pueden realizar la acción Recoger marcador sobre tus marcadores de Recuperación.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión, mientras esté en la zona de control de un agente enemigo, o si ya lleva un marcador.' }],
      pv: ['La primera vez que agentes amigos registran cada marcador de objetivo, puntúas 1PV.',
        'Al final de la batalla, por cada marcador de Recuperación que lleven agentes amigos, puntúas 1PV.'] },
    { id: 'scout', arq: 'Reconocimiento', name: 'Explorar movimiento enemigo', en: 'Scout Enemy Movement', img: 'imagenes/misiones/tac-scout.webp',
      revelar: 'La primera vez que un agente amigo realiza la acción Explorar.',
      acciones: [{ n: 'Explorar', pa: 1,
        ef: ['Elige un agente enemigo preparado que sea visible para el agente activo y esté a más de 6" de él. Ese agente enemigo queda vigilado hasta el paso de preparación de la siguiente fase de estrategia.'],
        no: 'Un agente no puede realizar esta acción mientras tenga orden de trabarse, durante el primer punto de inflexión, ni mientras esté en la zona de control de un agente enemigo.' }],
      pv: ['Al final de cada punto de inflexión después del primero, por cada agente enemigo vigilado que sea visible para agentes amigos, puntúas 1PV. No tiene por qué ser el agente que realizó la acción Explorar.',
        'No puedes puntuar más de 2PV con esta operación por punto de inflexión.'] },

    // BUSCAR Y DESTRUIR
    { id: 'sweep-clear', arq: 'Buscar y destruir', name: 'Barrer y limpiar', en: 'Sweep & Clear', img: 'imagenes/misiones/tac-sweep-clear.webp',
      revelar: 'La primera vez que un agente enemigo queda incapacitado mientras disputa un marcador de objetivo, o la primera vez que un agente amigo realiza la acción Limpiar (lo que ocurra antes).',
      reglas: ['Cuando un agente enemigo que disputa un marcador de objetivo queda incapacitado, ese marcador queda barrido hasta el paso de preparación de la siguiente fase de estrategia.'],
      acciones: [{ n: 'Limpiar', pa: 1,
        ef: ['Un marcador de objetivo que controle el agente activo queda limpio durante el punto de inflexión.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión ni mientras esté en la zona de control de un agente enemigo.' }],
      pv: ['Al final de cada punto de inflexión después del primero, si el marcador central o el de tu rival está limpio y ningún agente enemigo lo disputa, puntúas 1PV. Si además ese marcador está barrido, puntúas 2PV en su lugar.',
        'Si los agentes amigos controlan un marcador de objetivo que esté barrido, puntúas 1PV.',
        'No puedes puntuar más de 2PV con esta operación por punto de inflexión.'] },
    { id: 'dominate', arq: 'Buscar y destruir', name: 'Dominar', en: 'Dominate', img: 'imagenes/misiones/tac-dominate.webp',
      revelar: 'La primera vez que un agente amigo incapacita a un agente enemigo.',
      reglas: ['Cada vez que un agente amigo incapacita a un agente enemigo, ese agente amigo gana una de tus fichas de Dominio, o dos si ese agente enemigo tenía un atributo de Heridas de 12 o más.'],
      pv: ['Al final del tercer y del cuarto punto de inflexión, puedes retirar fichas de Dominio de agentes amigos que estén en la zona de aniquilación y no estén incapacitados. Por cada una que retires, puntúas 1PV.',
        'No puedes puntuar más de 3PV con esta operación por punto de inflexión.'] },
    { id: 'rout', arq: 'Buscar y destruir', name: 'Desbandada', en: 'Rout', img: 'imagenes/misiones/tac-rout.webp',
      revelar: 'La primera vez que puntúas PV con esta operación.',
      pv: ['Cada vez que un agente amigo incapacita a un agente enemigo, si ese agente amigo está a 6" o menos de la zona de despliegue de tu rival, puntúas 1PV; si además ese agente enemigo tenía un atributo de Heridas de 12 o más, puntúas 2PV en su lugar.',
        'No puedes puntuar más de 2PV con esta operación por punto de inflexión.'] },

    // INFILTRACIÓN
    { id: 'plant-devices', arq: 'Infiltración', name: 'Colocar dispositivos', en: 'Plant Devices', img: 'imagenes/misiones/tac-plant-devices.webp',
      revelar: 'La primera vez que un agente amigo realiza la acción Colocar dispositivo.',
      acciones: [{ n: 'Colocar dispositivo', pa: 1,
        ef: ['Un marcador de objetivo que controle el agente activo gana una de tus fichas de Dispositivo.'],
        no: 'Un agente no puede realizar esta acción durante el primer punto de inflexión, mientras esté en la zona de control de un agente enemigo, o si ese marcador ya tiene una de tus fichas de Dispositivo.' }],
      pv: ['Al final de cada punto de inflexión después del primero:',
        '• Si el marcador de objetivo de tu rival tiene una de tus fichas de Dispositivo, puntúas 1PV.',
        '• Por cada otro marcador de objetivo que disputen agentes enemigos y tenga una de tus fichas de Dispositivo, puntúas 1PV.',
        'No puedes puntuar más de 2PV con esta operación por punto de inflexión.'] },
    { id: 'steal-intelligence', arq: 'Infiltración', name: 'Robar inteligencia', en: 'Steal Intelligence', img: 'imagenes/misiones/tac-steal-intelligence.webp',
      revelar: 'La primera vez que un agente enemigo queda incapacitado.',
      reglas: ['Cada vez que un agente enemigo queda incapacitado, antes de retirarlo de la zona de aniquilación, coloca uno de tus marcadores de misión de Inteligencia en su zona de control.',
        'Los agentes amigos pueden realizar la acción Recoger marcador sobre tus marcadores de Inteligencia y, para las condiciones de esa acción, ignoran el primer marcador de Inteligencia que lleve el agente activo. Es decir, cada agente amigo puede llevar hasta dos marcadores de Inteligencia, o uno y otro marcador distinto.'],
      pv: ['Al final de cada punto de inflexión después del primero, si algún agente amigo lleva alguno de tus marcadores de Inteligencia, puntúas 1PV.',
        'Al final de la batalla, por cada marcador de Inteligencia que lleven agentes amigos, puntúas 1PV.'] },
    { id: 'track-enemy', arq: 'Infiltración', name: 'Rastrear al enemigo', en: 'Track Enemy', img: 'imagenes/misiones/tac-track-enemy.webp',
      revelar: 'La primera vez que puntúas PV con esta operación.',
      reglas: ['Un agente enemigo está siendo rastreado si es un blanco válido para un agente amigo que esté a 6" o menos de él. Ese agente amigo debe tener orden de ocultarse, no puede ser un blanco válido para el agente enemigo que intenta rastrear y no puede estar en la zona de control de agentes enemigos.'],
      pv: ['Al final de cada punto de inflexión después del primero:',
        '• Si un agente enemigo está siendo rastreado, puntúas 1PV, o 2PV si es el cuarto punto de inflexión.',
        '• Si dos o más agentes enemigos están siendo rastreados, puntúas 2PV.',
        'No puedes puntuar más de 2PV con esta operación por punto de inflexión.'] },
  ],
};

// ── Zonas de aniquilación y mapas (mazo Approved Ops 2025) ──
//  mapa: { id, label, img }   · claves: imágenes de la leyenda de terreno
//  Los mapas están girados a horizontal: la zona de despliegue que en la
//  carta está abajo queda a la izquierda (J1) y la de arriba a la derecha (J2).
(() => {
  const M = (z, ids) => ids.map(id => ({ id, label: id.replace('-', '.').replace('asedio.', 'Asedio '), img: `imagenes/mapas/${z}/${id}.webp` }));
  const K = (z, n) => Array.from({ length: n }, (_, k) => `imagenes/mapas/${z}/clave-${k + 1}.webp`);
  const six = p => [1, 2, 3, 4, 5, 6].map(n => p + n);
  window.ZONAS = [
    { id: 'volkus', name: 'Volkus', claves: K('volkus', 3), maps: M('volkus', [...six('I-'), ...six('II-'), 'asedio-1', 'asedio-2']) },
    { id: 'bheta-decima', name: 'Bheta-Décima', claves: K('bheta-decima', 1), maps: M('bheta-decima', [...six('I-'), ...six('II-')]) },
    { id: 'gallowdark', name: 'Horcasombría', claves: K('gallowdark', 2), maps: M('gallowdark', six('')) },
    { id: 'necropolis', name: 'Mundo Necrópolis', claves: K('necropolis', 2), maps: M('necropolis', six('')) },
    { id: 'octarius', name: 'Octarius', claves: K('octarius', 1), maps: M('octarius', six('')) },
    { id: 'generica', name: 'Genérica', claves: K('generica', 1), maps: M('generica', six('')) },
  ];
})();
