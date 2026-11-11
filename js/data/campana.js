// ============================================================
//  data/campana.js — Reglas del modo campaña
//  Adaptación propia del juego narrativo de la edición anterior de
//  Kill Team (hoja de datos, experiencia, honores, cicatrices,
//  requisición y operaciones especiales) a las reglas actuales.
//  NO es material oficial: son reglas de la casa. Edita este archivo
//  para ajustarlas a tu grupo; la página las lee de aquí.
// ============================================================
window.CAMPANA = {
  maxOps: 20,          // operativos en la hoja de datos
  maxPR: 10,           // puntos de requisición acumulables
  rangos: [            // experiencia necesaria para cada rango
    { n: 'Recluta', xp: 0 }, { n: 'Veterano', xp: 6 }, { n: 'As', xp: 16 }, { n: 'Curtido', xp: 31 }, { n: 'Venerado', xp: 51 },
  ],
  xp: { jugar: 1, destacado: 1 },                 // por participar · operativo destacado de la partida
  pr: { jugar: 1, ganar: 1 },                     // requisición por partida · extra por ganar
  costes: [
    { n: 'Reclutar un operativo', pr: 1 }, { n: 'Dar de alta a un operativo en recuperación', pr: 1 },
    { n: 'Equipo raro (se guarda en el arsenal)', pr: 1 }, { n: 'Quitar una cicatriz de batalla', pr: 2 },
  ],
  // Prueba de baja: 1D6 por cada operativo incapacitado en la partida
  baja: [
    { de: 1, a: 1, r: 'scar', t: 'Cicatriz de batalla (tira en la tabla). Si ya tenía dos, muere.' },
    { de: 2, a: 3, r: 'rec', t: 'En recuperación: se pierde la siguiente partida.' },
    { de: 4, a: 6, r: 'ok', t: 'Sin consecuencias.' },
  ],
  cicatrices: [
    { n: 'Cojera', t: 'Su Movimiento se reduce 1".' },
    { n: 'Vieja herida', t: 'Empieza cada batalla con 1 herida menos.' },
    { n: 'Nervios rotos', t: 'En el primer punto de inflexión no puede beneficiarse de ardides de estrategia.' },
    { n: 'Visión dañada', t: 'Una vez por batalla, el rival puede obligarle a repetir un dado de ataque con éxito al disparar.' },
    { n: 'Brazo débil', t: 'Una vez por batalla, el rival puede obligarle a repetir un dado de ataque con éxito al combatir.' },
    { n: 'Mala racha', t: 'Gana 1 XP menos tras cada batalla (mínimo 0).' },
  ],
  // Honores de batalla: al subir de rango se elige especialidad y se tira 1D6
  honores: {
    Combate: [
      { n: 'Golpe certero', t: 'Una vez por batalla, al combatir, repite un dado de ataque.' },
      { n: 'Duelista', t: 'Una vez por batalla, al combatir, una de tus paradas con éxito normal cuenta como crítica.' },
      { n: 'Imparable', t: 'Una vez por batalla puede cargar aunque haya retrocedido en esa activación.' },
      { n: 'Sed de sangre', t: 'La primera vez que incapacite a un enemigo en combate en cada batalla, gana 1 XP extra.' },
      { n: 'Rápido de reflejos', t: 'Una vez por batalla, al combatir, resuelve primero uno de sus dados aunque sea el defensor.' },
      { n: 'Brutal', t: 'Elige una de sus armas cuerpo a cuerpo: gana +1 al daño crítico.' },
    ],
    Tirador: [
      { n: 'Pulso firme', t: 'Una vez por batalla, al disparar, repite un dado de ataque.' },
      { n: 'Tiro de precisión', t: 'Una vez por batalla, uno de sus éxitos normales al disparar cuenta como crítico.' },
      { n: 'Disparo en movimiento', t: 'Una vez por batalla puede disparar un arma Pesada aunque se haya movido.' },
      { n: 'Ojo de halcón', t: 'Elige una de sus armas a distancia: su Alcance aumenta 2" (si lo tiene).' },
      { n: 'Sangre fría', t: 'Ignora el modificador por estar lesionado al disparar.' },
      { n: 'Munición especial', t: 'Elige una de sus armas a distancia: gana +1 al daño crítico.' },
    ],
    Firme: [
      { n: 'Duro de matar', t: 'Tiene 1 herida más.' },
      { n: 'Curtido', t: 'Una vez por batalla, repite un dado de defensa.' },
      { n: 'Imperturbable', t: 'Ignora el modificador por estar lesionado al moverse.' },
      { n: 'Voluntad de hierro', t: 'Supera automáticamente su primera prueba de baja de cada campaña.' },
      { n: 'Escudo humano', t: 'Una vez por batalla, un amigo a 2" o menos repite un dado de defensa.' },
      { n: 'Superviviente', t: 'Suma 1 a sus tiradas de prueba de baja.' },
    ],
    Explorador: [
      { n: 'Pies ligeros', t: 'Su Movimiento aumenta 1".' },
      { n: 'Sigiloso', t: 'Una vez por batalla, cuenta como si tuviera orden de ocultarse frente a un disparo.' },
      { n: 'Trepador', t: 'Trepar y saltar le cuesta 1" menos (mínimo 1").' },
      { n: 'Avanzadilla', t: 'Tras desplegar, puede hacer un movimiento gratuito de 2".' },
      { n: 'Saqueador', t: 'La acción de recoger o interactuar con un marcador le cuesta 1PA menos (mínimo 0) una vez por batalla.' },
      { n: 'Instinto', t: 'Una vez por batalla puede cambiar su orden al ser activado sin coste.' },
    ],
  },
};
