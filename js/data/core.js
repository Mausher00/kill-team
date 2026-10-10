// ============================================================
//  data/core.js — Reglas generales comunes a todos los comandos
//  (resumen de referencia; el Reglamento básico manda).
//  render.js usa f.gr si un comando lo define; si no, CORE_GR.
// ============================================================

window.CORE_GR = {
  concepts: [
    {
      n: "Zona de control",
      t: "Algo está dentro de la zona de control de un agente si es visible para él y está a menos de 1\" de él."
    },
    {
      n: "Blanco válido",
      t: "Con orden de trabarse: visible. Con orden de ocultarse: visible y no a cubierto."
    },
    {
      n: "Visible",
      t: "Línea recta sin obstrucciones desde la cabeza del agente hasta cualquier parte del objetivo."
    },
    {
      n: "Cobertura",
      t: "Terreno interpuesto en la zona de control. No aplica si está a 2\" o menos del atacante."
    },
    {
      n: "Herido / Lesionado / Incapacitado",
      t: "Lesionado: menos de la mitad de heridas — pierde 2\" de MOV y empeora en 1 su Impactar. Incapacitado: 0 heridas, se retira."
    }
  ],
  orders: [
    {
      n: "Orden de trabarse",
      t: "El agente puede realizar acciones normalmente y reaccionar."
    },
    {
      n: "Orden de ocultarse",
      t: "El agente no es blanco válido mientras esté a cubierto. No puede Disparar ni Cargar."
    }
  ],
  phases: [
    {
      n: "Fase de estrategia",
      t: "Tira iniciativa. Ganan PM. Los jugadores alternan usando GAMBITOS ESTRATÉGICOS o pasando."
    },
    {
      n: "Fase de tiroteo",
      t: "Los jugadores alternan activando agentes hasta su LPA."
    },
    {
      n: "Reaccionar",
      t: "Si todos tus agentes están usados, uno con orden de trabarse puede reaccionar: acción libre de 1PA, sin mover más de 2\"."
    },
    {
      n: "Repetición de mando",
      t: "Ardid universal (1PM). Puedes repetir uno de tus dados de ataque o defensa."
    }
  ],
  actions: [
    {
      n: "Reposicionar",
      cost: "1PA",
      t: "Mueve hasta MOV. No puede mover por zonas de control enemigas."
    },
    {
      n: "Correr",
      cost: "1PA",
      t: "Como Reposicionar, pero máx. 3\", sin trepar, no en zona de control enemiga."
    },
    {
      n: "Retroceder",
      cost: "2PA",
      t: "Como Reposicionar, puede pasar por zonas de control enemigas sin terminar ahí."
    },
    {
      n: "Cargar",
      cost: "1PA",
      t: "Como Reposicionar, +2\" adicionales, debe terminar en zona de control enemiga."
    },
    {
      n: "Disparar",
      cost: "1PA",
      t: "Elige arma y blanco válido. Tira dados de ataque. El defensor tira 3 dados de defensa."
    },
    {
      n: "Combatir",
      cost: "1PA",
      t: "Elige enemigo en zona de control; contraatacará. Ambos eligen arma y alternan Golpear o Bloquear."
    }
  ],
  wr: [
    {
      n: "Alcance x\"",
      t: "Solo agentes a esa distancia o menos pueden ser blancos válidos."
    },
    {
      n: "Área x\"",
      t: "Dispara también contra cada agente visible a esa distancia o menos del blanco primario."
    },
    {
      n: "Aturdidora",
      t: "Si guardas algún éxito crítico, resta 1 al atributo LPA del agente objetivo hasta el final de su siguiente activación."
    },
    {
      n: "Brutal",
      t: "El oponente solo puede bloquear con éxitos críticos."
    },
    {
      n: "Buscadora (ligero)",
      t: "Los agentes con orden de ocultarse no pueden usar terreno Ligero para estar a cubierto."
    },
    {
      n: "Castigadora",
      t: "Si guardas algún éxito crítico, puedes guardar uno de tus fallos como éxito normal."
    },
    {
      n: "Certera x",
      t: "Puedes guardar hasta X dados de ataque como éxitos normales sin tirarlos."
    },
    {
      n: "Choque",
      t: "La primera vez que golpees con crítico, descarta un éxito normal sin resolver del oponente."
    },
    {
      n: "Críticos de penetración x",
      t: "Los éxitos críticos del atacante tienen Penetración X adicional."
    },
    {
      n: "Desgarradora",
      t: "Si guardas algún éxito crítico, puedes guardar uno de tus éxitos normales como éxito crítico."
    },
    {
      n: "Devastadora x",
      t: "Cada éxito crítico guardado inflige X daño adicional inmediato."
    },
    {
      n: "Equilibrada",
      t: "Puedes repetir 1 de tus dados de ataque."
    },
    {
      n: "Implacable",
      t: "Puedes repetir cualquiera de tus dados de ataque."
    },
    {
      n: "Incesante",
      t: "Puedes repetir cualquiera de tus dados de ataque con un resultado concreto."
    },
    {
      n: "Letal x+",
      t: "Tus éxitos iguales o superiores a X son éxitos críticos."
    },
    {
      n: "Limitada x",
      t: "El agente deja de tener esta arma tras usarla X veces."
    },
    {
      n: "Penetración x",
      t: "El defensor guarda X dados de defensa menos."
    },
    {
      n: "Pesada",
      t: "No se puede usar si el agente ha movido, ni mover tras usarla."
    },
    {
      n: "Pesada (solo Correr)",
      t: "Solo puede usarse si la única acción de movimiento fue Correr."
    },
    {
      n: "Pesada (solo Reposicionarse)",
      t: "Solo puede usarse si la única acción de movimiento fue Reposicionarse."
    },
    {
      n: "Ráfaga x\"",
      t: "Dispara también contra blancos secundarios válidos a esa distancia."
    },
    {
      n: "Saturación",
      t: "El defensor no puede guardar salvaciones por cobertura."
    },
    {
      n: "Severa",
      t: "Si no guardas ningún éxito crítico, puedes cambiar un éxito normal a crítico."
    },
    {
      n: "Silenciosa",
      t: "Puede usarse aunque el agente tenga orden de ocultarse."
    },
    {
      n: "Sobrecalentamiento",
      t: "Tras usar esta arma, tira 1D6. Si el resultado es inferior al Impactar, sufres ese resultado × 2 de daño."
    }
  ]
};
