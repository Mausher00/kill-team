// ============================================================
//  data/vespid.js — Aguijones Alados Véspid
//  Generado desde el PDF oficial: Vespid Stingwings
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['vespid'] = {
  id: "vespid",
  name: "Aguijones Alados Véspid",
  subfaction: "Imperio T'au",
  icon: "🐝",
  img: "imagenes/vespid.webp",
  desc: "Insectoides voladores aliados del Imperio T'au, armados con neutrones y guiados por un dron de vigilancia.",
  tags: ["T'au", "Reconocimiento", "Buscar y destruir"],
  version: "Agosto 2026",
  source: "Vespid Stingwings",
  ops: [
    {
      id: "himenoptero",
      name: "Himenóptero Véspid",
      type: "HIMENÓPTERO",
      img: "imagenes/vespid/himenoptero.png",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 10 },
      kw: ["AGUIJÓN ALADO VÉSPID", "IMPERIO T'AU", "LÍDER", "HIMENÓPTERO"],
      w: [{ n: "Bláster de neutrones", a: 4, i: "3+", d: "3/3", r: ["Devastadora 2"] }, { n: "Garras", a: 3, i: "4+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Casco de comunión",
          t: "Una vez durante cada una de las activaciones de este agente, elegir 1 de las siguientes opciones:\n• Gastar 1 punto de comunión de manera gratuita.\n• Gasta 1 punto de comunión y elige 1 agente AGUIJÓN ALADO VÉSPID amigo a 3\" o menos de este agente. Ese otro agente aliado puede realizar inmediatamente una acción de misión libre de 1PA (aún debes gastar 1 punto de Comunión para que realice esa acción normalmente, y esto no se puede ignorar usando el equipo Estimulante de Convergencia).",
        },
        {
          n: "Entrar en comunión",
          t: "Al elegir tus agentes para la batalla, elige también un ardid de estrategia AGUIJÓN ALADO VÉSPID. Si este agente está en la zona de aniquilación y fuera de la zona de control de todo agente enemigo, dicho ardid te cuesta 0PM.",
        },
      ],
    },
    {
      id: "dron-de-vigilancia",
      name: "Dron de Vigilancia",
      type: "DRON DE VIGILANCIA",
      img: "imagenes/vespid/dron.png",
      s: { lpa: 2, mov: "8\"", salv: "2+", h: 5 },
      kw: ["AGUIJÓN ALADO VÉSPID", "IMPERIO T'AU", "DRON DE VIGILANCIA", "DRON"],
      w: [{ n: "Topetazo", a: 3, i: "5+", d: "1/2", r: [] }],
      ru: [
        {
          n: "Dron evasivo",
          t: "• Este agente solo puede realizar acciones de Cargar, Combatir, Correr, Guía aérea, Reposicionarse y Retroceder.\n• Al determinar el control de marcadores de objetivo, trata el atributo LPA de este agente como si fuera 1 menos.\n• Al determinar qué es visible para este agente, el disco redondo en la parte superior de la miniatura es su cabeza.\n• Si este agente tiene una orden de ocultarse y se encuentra tras cobertura, no puede ser tomado como blanco válido, y esto tiene prioridad sobre todas las demás reglas (p. ej., terreno Aventajado).\n• Cuando un agente dispare contra este agente, ignora la regla de arma Penetración.",
        },
        {
          n: "Guía Aérea (1PA)",
          t: "APOYO. Hasta el inicio de la siguiente activación de este agente, cuando otro agente AGUIJÓN ALADO VÉSPID amigo a 6\" o menos de este agente y visible para él dispare contra un agente enemigo visible para este agente, las armas a distancia de dicho agente amigo tienen las reglas de armas Saturación y Letal 5+. Esto no tiene efecto si este agente está en la zona de control de un agente enemigo. Este agente no puede realizar esta acción si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "aguijonlargo",
      name: "Aguijónlargo Véspid",
      type: "AGUIJÓNLARGO",
      img: "imagenes/vespid/aguijonlargo.png",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 9 },
      kw: ["AGUIJÓN ALADO VÉSPID", "IMPERIO T'AU", "AGUIJÓNLARGO"],
      w: [
        { n: "Rifle acelerador de neutrones (normal)", a: 4, i: "4+", d: "4/4", r: ["Devastadora 2", "Fragmento de neutrones*"] },
        {
          n: "Rifle acelerador de neutrones (apuntado)",
          a: 4,
          i: "3+",
          d: "4/4",
          r: ["Devastadora 2", "Letal 5+", "Pesada (solo Correr)", "Fragmento de neutrones*"],
        },
        { n: "Garras", a: 3, i: "4+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Fragmento de neutrones",
          t: "Si el blanco no resulta incapacitado pero resuelves algún dado de ataque, el blanco gana una de tus fichas de Fragmento de neutrones. Siempre que un agente que tenga alguna de tus fichas de Fragmento de neutrones sea activado, inflígele 1D3 daños por cada ficha de Fragmento de neutrones que tenga (tira por separado por cada una)",
        },
      ],
    },
    {
      id: "cepasombria",
      name: "Cepasombría Véspid",
      type: "CEPASOMBRÍA",
      img: "imagenes/vespid/cepasombria.png",
      s: { lpa: 2, mov: "6\"", salv: "3+", h: 9 },
      kw: ["AGUIJÓN ALADO VÉSPID", "IMPERIO T'AU", "CEPASOMBRÍA"],
      w: [
        { n: "Aguijón de neutrones", a: 4, i: "4+", d: "3/3", r: ["Alcance 8\"", "Devastadora 2"] },
        { n: "Granada de neutrones", a: 4, i: "4+", d: "3/3", r: ["Alcance 6\"", "Área 2\"", "Devastadora 2", "Limitada 1", "Saturación"] },
        { n: "Garras", a: 3, i: "4+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Ingenio espectral",
          t: "Mientras este agente tenga una orden de ocultarse, tu oponente no podrá elegirlo como blanco válido a menos que esté a 6\" o menos del agente que trata de tomarlo como blanco. Ten en cuenta que esta regla no tiene efecto si el agente no es elegido como el blanco válido, p.ej., si es un blanco secundario debido a la regla de arma Área.",
        },
        {
          n: "Camuflado",
          t: "Siempre que un agente dispare contra este agente, ignora la regla de arma Penetración, y todas las salvaciones de cobertura se guardan como éxitos críticos. Esta regla no tiene efecto si el agente no es elegido como el blanco válido, p.ej., si es un blanco secundario debido a la regla de arma Área.",
        },
      ],
    },
    {
      id: "bombaceleste",
      name: "Bombaceleste Véspid",
      type: "BOMBACELESTE",
      img: "imagenes/vespid/bombaceleste.png",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 9 },
      kw: ["AGUIJÓN ALADO VÉSPID", "IMPERIO T'AU", "BOMBACELESTE"],
      w: [
        { n: "Lanzagranadas de neutrones", a: 4, i: "4+", d: "3/3", r: ["Área 2\"", "Devastadora 2", "Bombardeo de neutrones*"] },
        { n: "Garras", a: 3, i: "4+", d: "3/4", r: [] },
      ],
      ru: [
        { n: "Bombardeo de neutrones", t: "Coloca uno de tus marcadores de Lluvia de neutrones dentro de la zona de control del blanco principal." },
        {
          n: "Lluvia de neutrones",
          t: "Una vez durante cada activación de un agente enemigo, tan pronto como dicho agente enemigo se encuentre a 2\" o menos de uno de tus marcadores de lluvia de neutrones, inflígele 1D3 daños (este efecto no se acumula con más de un marcador).",
        },
      ],
    },
    {
      id: "guardiaenjambre",
      name: "Guardiaenjambre Véspid",
      type: "GUARDIAENJAMBRE",
      img: "imagenes/vespid/guardaenjambre.png",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 9 },
      kw: ["AGUIJÓN ALADO VÉSPID", "IMPERIO T'AU", "GUARDIAENJAMBRE"],
      w: [
        { n: "Lanzallamas (normal)", a: 4, i: "2+", d: "3/3", r: ["Alcance 8\"", "Ráfaga 2\"", "Saturación"] },
        { n: "Lanzallamas (antorcha celeste)", a: 4, i: "2+", d: "3/3", r: ["Antorcha celeste*"] },
        { n: "Garras", a: 3, i: "4+", d: "3/4", r: [] },
      ],
      ru: [
        {
          n: "Antorcha celeste",
          t: "Un agente solo puede usar esta arma durante la acción de Asalto con antorcha celeste (ver reverso de esta tarjeta). Si lo hace, no elijas un blanco válido. En su lugar, dispara contra cada agente dentro de su zona de achicharramiento (excepto agentes que estén completamente bajo terreno Aventajado); no se consideran a cubierto ni ofuscados. Tira cada secuencia por separado en orden desde el agente más lejano al más cercano. La zona de achicharramiento es el área entre la posición actual y previa del agente. Se puede colocar temporalmente bajo este agente un marcador redondo de Antorcha celeste de 28 mm antes de moverlo, como ayuda a la hora de determinar esto. ZONA DE ACHICHARRA- MIENTO",
        },
        {
          n: "Asalto con Antorcha Celeste (2PA)",
          t: "Realiza una acción libre de Reposicionarse con este agente. Durante esa acción, este debe VOLAR y puede mover 2\" adicionales. A continuación, realiza una acción libre de Disparar. Solo puedes elegie un lanzallamas (antorcha celeste) para dicha acción de Disparar. Este agente no puede realizar esta acción si tiene una orden de ocultarse, o si está en la zona de control de un agente enemigo.",
          isAct: true,
        },
      ],
    },
    {
      id: "combatiente",
      name: "Combatiente Véspid",
      type: "COMBATIENTE",
      img: "imagenes/vespid/combatiente-vespid.png",
      s: { lpa: 2, mov: "6\"", salv: "5+", h: 9 },
      kw: ["AGUIJÓN ALADO VÉSPID", "IMPERIO T'AU", "COMBATIENTE"],
      w: [{ n: "Bláster de neutrones", a: 4, i: "4+", d: "3/3", r: ["Devastadora 2"] }, { n: "Garras", a: 3, i: "4+", d: "3/4", r: [] }],
      ru: [
        {
          n: "Instintos de combatiente",
          t: "Siempre que este agente dispara, si no gastas puntos de comunión durante esa secuencia, su bláster de neutrones tiene la regla de arma Certera 1 hasta el final de esa secuencia.",
        },
      ],
    },
  ],
  fr: {
    name: "Carga de neutrones",
    type: "REGLA DE FACCIÓN",
    text: "Las armas de neutrones son todas las armas que tienen la palabra “neutrones” en su nombre, p.ej. bláster de neutrones, lanzagranadas de neutrones, etc. Cuando un agente AGUIJÓN ALADO VÉSPID amigo se mueva o use VOLAR, sus armas de neutrones tienen la regla de arma Penetración 1 hasta el final del punto de inflexión.",
    orders: [
      {
        n: "Comunión",
        t: "Los puntos de comunión se utilizan para mantener la concentración táctica de los agentes AGUIJÓN ALADO VÉSPID amigos. En el paso de preparación de cada fase de estrategia ganas 1D3 puntos de comunión, más 1 si hay un agente DRON DE VIGILANCIA amigo en la zona de aniquilación. Los puntos de comunión se utilizan del siguiente modo (los agentes DRON DE VIGILANCIA no se ven afectados por lo siguiente):",
      },
      {
        n: "Volar",
        t: "Cuando un agente AGUIJÓN ALADO VÉSPID amigo realiza una acción en la que se mueva, puede VOLAR. Si lo hace, no lo muevas. En lugar de eso, retíralo de la zona de aniquilación y vuelve a colocarlo completamente a una distancia en horizontal de su localización original igual o menor a su atributo Movimiento (o a 3\" o menos en caso de Correr). En una zona de aniquilación que utilice las reglas de combate cerrado (p.ej., Zona de aniquilación: Mundo Necrópolis), no puedes medir la distancia sobre o a través de terreno de Muro, y ese agente no puede desplegarse en el otro lado de un punto de acceso (en otras palabras, no puede VOLAR a través de una escotilla abierta). Ten en cuenta que no gana distancia adicional al realizar una acción de Cargar. Debe desplegarse en una ubicación en la que pueda ser colocado y, a menos que la acción sea Cargar, no puede desplegarse en la zona de control de un agente enemigo.",
      },
    ],
  },
  frs: [
    {
      name: "Carga de neutrones",
      text: "Las armas de neutrones son todas las armas que tienen la palabra “neutrones” en su nombre, p.ej. bláster de neutrones, lanzagranadas de neutrones, etc. Cuando un agente AGUIJÓN ALADO VÉSPID amigo se mueva o use VOLAR, sus armas de neutrones tienen la regla de arma Penetración 1 hasta el final del punto de inflexión.",
      subs: [],
    },
    {
      name: "Comunión",
      text: "Los puntos de comunión se utilizan para mantener la concentración táctica de los agentes AGUIJÓN ALADO VÉSPID amigos. En el paso de preparación de cada fase de estrategia ganas 1D3 puntos de comunión, más 1 si hay un agente DRON DE VIGILANCIA amigo en la zona de aniquilación. Los puntos de comunión se utilizan del siguiente modo (los agentes DRON DE VIGILANCIA no se ven afectados por lo siguiente):",
      subs: [],
    },
    {
      name: "Volar",
      text: "Cuando un agente AGUIJÓN ALADO VÉSPID amigo realiza una acción en la que se mueva, puede VOLAR. Si lo hace, no lo muevas. En lugar de eso, retíralo de la zona de aniquilación y vuelve a colocarlo completamente a una distancia en horizontal de su localización original igual o menor a su atributo Movimiento (o a 3\" o menos en caso de Correr). En una zona de aniquilación que utilice las reglas de combate cerrado (p.ej., Zona de aniquilación: Mundo Necrópolis), no puedes medir la distancia sobre o a través de terreno de Muro, y ese agente no puede desplegarse en el otro lado de un punto de acceso (en otras palabras, no puede VOLAR a través de una escotilla abierta). Ten en cuenta que no gana distancia adicional al realizar una acción de Cargar. Debe desplegarse en una ubicación en la que pueda ser colocado y, a menos que la acción sea Cargar, no puede desplegarse en la zona de control de un agente enemigo.",
      subs: [],
    },
  ],
  pl: {
    s: [
      {
        n: "Exoesqueleto endurecido",
        t: "Siempre que un agente AGUIJÓN ALADO VÉSPID amigo (salvo DRON DE VIGILANCIA) combate o contraataca, el Daño normal de 4 o más le inflige 1 daño menos.",
      },
      {
        n: "Agilidad aérea",
        t: "Siempre que un agente dispare contra un agente AGUIJÓN ALADO VÉSPID amigo mientras este último está reaccionandoo interrumpiendo, o durante una activación en la que ese agente que dispara se haya movido o haya sido desplegado, tira 1D6 cuando un éxito normal vaya a infligir daño. Con 5+, ignora ese daño infligido. No puedes ignorar más de un dado de ataque en cada secuencia de acción de Disparar de este modo.",
      },
      {
        n: "Depredadores aerotransportados",
        t: "Siempre que un agente AGUIJÓN ALADO VÉSPID se mueva o use VOLAR durante su activación, sus armas tienen la regla de arma Equilibrada hasta el final de esa activación.",
      },
      {
        n: "Aguijón",
        t: "Mejora en 1 el atributo Imp de las garras de los agentes AGUIJÓN ALADO VÉSPID amigos, y esas armas tienen las reglas de armas Letal 5+ y Choque.",
      },
    ],
    f: [
      {
        n: "Ocelos",
        t: "Usa este ardid de tiroteo cuando un agente AGUIJÓN ALADO VÉSPID amigo realice una acción de Disparar durante una activación en la que haya usado VOLAR. Hasta el final de dicha acción, al elegir un blanco válido, trata a ese agente amigo como si estuviera en terreno Aventajado y a 3\" más de altura de donde se encuentra (es decir, que se beneficiará de la segunda regla de terreno Aventajado).",
      },
      {
        n: "Vuelo raudo",
        t: "Usa este ardid de tiroteo cuando un agente AGUIJÓN ALADO VÉSPID amigo realiza una acción de Reposicionarse. Hasta el final de esa acción, puede moverse 1D3\" adicionales, o desplegarse a 1D3\" adicionales de distancia si usa VOLAR. En cualquier caso, durante el resto del punto de inflexión no podrá realizar acciones de Combatir ni de Disparar.",
      },
      {
        n: "Sobrecarga de neutrones",
        t: "Usa este ardid de tiroteo cuando resuelvas un éxito crítico para un agente AGUIJÓN ALADO VÉSPID amigo que esté disparando con un arma de neutrones durante una activación en la que se haya movido o haya usado VOLAR. Si el blanco está a 4\" o menos de él, le inflige 1D3 daños adicionales.",
      },
      {
        n: "Veneno agresivo",
        t: "Usa este ardid de tiroteo cuando un agente AGUIJÓN ALADO VÉSPID amigo (salvo DRON DE VIGILANCIA) esté combatiendo y golpee con un éxito crítico. Inflige 1D3 daños adicionales",
      },
    ],
  },
  eq: [
    {
      n: "Neuroestimulante",
      t: "En el paso de preparación de cada fase de estrategia, al determinar cuántos puntos de Comunión ganas, puedes tirar 2D3 y elegir cuál de los dos usar.",
    },
    {
      n: "Estimulante de convergencia",
      t: "Una vez por punto de inflexión, un agente AGUIJÓN ALADO VÉSPID amigo puede realizar una acción Recoger marcador o una acción de misión sin que tengas que gastar un punto de Comunión.",
    },
    {
      n: "Estimulante acelerador",
      t: "Siempre que un agente AGUIJÓN ALADO VÉSPID amigo (salvo DRON DE VIGILANCIA) realiza una acción de Cargar o Correr, puede moverse 1\" adicional. Si utiliza VOLAR para esta acción, puedes redesplegarlo a 1\" más de distancia.",
    },
    {
      n: "Estimulante de agresividad",
      t: "Siempre que un agente AGUIJÓN ALADO VÉSPID amigo (salvo DRON DE VIGILANCIA) combata, sus armas de combate tienen la regla de arma Incesante.",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Agosto 2026",
      ee: [
        {
          s: "Ardides de estrategia, agilidad aérea",
          t: "Cambia la parte relevante de la primera frase por: \"Siempre que un agente dispare contra un agente AGUIJÓN ALADO VÉSPID amigo mientras este último está reaccionando o interrumpiendo, […]\"",
        },
        {
          s: "Agente himenóptero, regla casco de comunión",
          t: "Cambia a: “Una vez durante cada activación de este agente, puedes elegir 1 de las siguientes opciones: • Gastar 1 punto de comunión de manera gratuita. • \u0007Gasta 1 punto de comunión y elige 1 agente AGUIJÓN ALADO VÉSPID amigo a 3\" o menos de este agente. Ese otro agente aliado puede realizar inmediatamente una acción de misión libre de 1PA (aún debes gastar 1 punto de Comunión para que realice esa acción normalmente, y esto no se puede ignorar usando el equipo Estimulante de Convergencia).\"",
        },
        { s: "Selección de comando", t: "Cambia el tercer punto de flecha a: “9 agentes AGUIJÓN ALADO VÉSPID elegidos de la siguiente lista:”" },
        {
          s: "Agente dron de vigilancia, regla dron evasivo",
          t: "Cambia el cuarto punto a: “Siempre que este agente tenga una orden de Ocultarse y esté tras cobertura, no puede ser elegido como blanco válido, teniendo esto prioridad sobre todas las demás reglas (p. ej. Buscadora, terreno Aventajado) salvo estar a 2\" o menos.”",
        },
        {
          s: "Agente dron de vigilancia, acción guía aérea",
          t: "Cambia la segunda frase del efecto a: Hasta el inicio de la siguiente activación de este agente, cuando otro agente AGUIJÓN ALADO VÉSPID amigo a 6\" o menos de este agente y visible para él dispare contra un agente enemigo visible para este agente, las armas a distancia de dicho agente amigo tienen las reglas de armas Letal 5+ y Saturación.”",
        },
        { s: "Agente guardiaenjambre", t: "Añadida acción única “Asalto con antorcha celeste\"." },
        { s: "Agente guardiaenjambre, perfil de arma lanzallamas (antorcha celeste)", t: "Añade las reglas de arma “Saturación” y “Ráfaga 0\"”." },
        {
          s: "Agente guardiaenjambre, regla de arma antorcha celeste",
          t: "Cambia la primera frase a: “Un agente solo puede usar esta arma durante la acción Asalto con antorcha celeste (ver reverso de la tarjeta).” Añade este texto al final del párrafo: “*Recuerda que Ráfaga 0\" significa que no puedes elegir blancos secundarios, pero esta arma sigue teniendo la regla de arma Ráfaga a efectos de todas las demás reglas, p.ej., la regla de Fortaleza compacta (ver Zona de aniquilación: Volkus, Libro Básico de Kill Team).”",
        },
        {
          s: "Agente aguijónlargo, regla de arma fragmento de neutrones",
          t: "Cambia la última frase a: “Siempre que un agente que tenga alguna de tus fichas de Fragmento de neutrones sea activado, inflígele 1D3 daños por cada ficha de Fragmento de neutrones que tenga (tira por separado por cada una)\".",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Reglas de facción, carga de neutrones",
          t: "Cambia la segunda frase a: Cuando un agente AGUIJÓN ALADO VÉSPID amigo se mueva o use VOLAR, sus armas de neutrones tienen la regla de arma Penetración 1 hasta el final del punto de inflexión.",
        },
        {
          s: "Reglas de facción, comunión",
          t: "Cambia la parte relevante de la segunda frase del primer párrafo a: “En el paso de preparación de cada fase de estrategia, retira todos los puntos de comunión del punto de inflexión anterior, y entonces ganas 1D3 puntos de comunión […]” Cambiar las partes relevantes de 2. a: \"Siempre que un agente AGUIJÓN ALADO VÉSPID amigo (salvo DRON) realice la acción de Cargar, […]’ Cambiar la parte relevante de 3. a: “Siempre que realices una acción de Recoger marcador o una acción de misión (salvo Operar portillo) con un agente AGUIJÓN ALADO VÉSPID amigo, […]”",
        },
        {
          s: "Ardides estratégicos, depredadores aerotransportados",
          t: "Cambia a: “Siempre que un agente AGUIJONES ALADOS VÉSPID amigo mueva o use VOLAR durante su activación, sus armas tienen la regla de arma Equilibrada hasta el final del punto de esa activación.”",
        },
        {
          s: "Ardides de tiroteo, ocelos",
          t: "Cambia la última frase a: \"Hasta el final de esa acción, obtiene todos los beneficios de la primera y segunda características principales del Terreno aventajado. Al determinar la diferencia de altura entre agentes para las reglas de Terreno aventajado, trata a ese agente amigo como si estuviera 3\" más alto de lo que está en realidad (pero no al determinar la distancia para Comunión)\".",
        },
        {
          s: "Ardides de estrategia, aguijón",
          t: "Cambia a: \"Mejora en 1 el atributo Impactar de las garras de los agentes AGUIJÓN ALADO VÉSPID amigos, y esas armas tienen las reglas de armas Letal 5+ y Choque.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Reconocimiento", "Buscar y destruir"],
    required: [{ type: "HIMENÓPTERO", count: 1 }, { type: "DRON DE VIGILANCIA", count: 1 }],
    pool: {
      slots: 9,
      note: "Salvo Combatientes, cada agente solo una vez.",
      entries: [
        { type: "AGUIJÓNLARGO", max: 1 },
        { type: "CEPASOMBRÍA", max: 1 },
        { type: "BOMBACELESTE", max: 1 },
        { type: "GUARDIAENJAMBRE", max: 1 },
        { type: "COMBATIENTE", max: null },
      ],
    },
    equipment: {
      slots: 4,
      universal: [
        "deposito-municion",
        "alambre-puas",
        "aparato-comunicaciones",
        "minas",
        "barricadas-ligeras",
        "barricada-pesada",
        "escaleras",
        "granadas-especiales",
        "granadas-explosivas",
        "carga-demolicion",
        "barricada-portatil",
      ],
    },
  },
};
