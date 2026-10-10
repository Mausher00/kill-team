// ============================================================
//  data/ala-asesina.js — Ala Asesina
//  Generado desde el PDF oficial: Murderwing
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['ala-asesina'] = {
  id: "ala-asesina",
  name: "Ala Asesina",
  subfaction: "Astartes Herejes del Caos",
  icon: "🦅",
  img: "imagenes/alaasesina.png",
  desc: "Guerreros del Caos con propulsores de salto que atacan desde las alturas con velocidad y ferocidad devastadoras.",
  tags: ["Caos", "Reconocimiento", "Buscar y destruir"],
  version: "Agosto 2026",
  source: "Murderwing",
  ops: [
    {
      id: "senor-del-caos",
      name: "Señor del Caos del Ala Asesina",
      type: "SEÑOR DEL CAOS",
      img: "imagenes/ala-asesina-img/senor.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 15 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "LÍDER", "SEÑOR"],
      w: [
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Pistola de plasma (normal)", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Pistola de plasma (sobrecarga)", a: 4, i: "3+", d: "4/5", r: ["Alcance 8\"", "Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Arma de energía", a: 5, i: "3+", d: "4/6", r: ["Letal 5+"] },
        { n: "Garra relámpago", a: 5, i: "3+", d: "4/5", r: ["Desgarradora", "Letal 5+"] },
        { n: "Garras relámpago reliquia", a: 5, i: "3+", d: "4/6", r: ["Desgarradora", "Incesante", "Letal 5+"] },
        { n: "Puño de energía", a: 4, i: "3+", d: "5/7", r: ["Brutal", "Choque"] },
      ],
      ru: [
        {
          n: "Senda hacia la condenación",
          t: "Este agente empieza la batalla con 1 punto de Condenación. Una vez por acción, puedes intentar usar un Don de Condenación cuando se especifique (ver a la derecha). Si lo haces, tira 1D6 y compara el resultado con el número de puntos de Condenación que tenga este agente; si el resultado es:\n• Mayor: Resuelve la regla, y a continuación este agente gana 1 punto de Condenación.\n• Igual: No resuelvas la regla.\n• Menor: Inflige a este agente tantos daños como su número de puntos de Condenación y no resuelvas la regla. Si este agente tiene 6 puntos de Condenación, resuelve la regla sin tirar. Ten en cuenta que no puedes hacer un intento más de una vez por acción, con independencia del resultado del D6.",
        },
        {
          n: "Dones de Condenación",
          t: "Los Dones de Condenación son los siguientes (se resuelven tirando 1D6; ver a la izquierda):\n• Cuando un dado de ataque inflija 3 o más daños a este agente, puedes ignorar tantos daños como los puntos de Condenación de este agente.\n• Cuando este agente combate o contraataca y golpeas con un dado de ataque, puedes infligir tantos daños adicionales como los puntos de Condenación de este agente.",
        },
      ],
    },
    {
      id: "campeon",
      name: "Campeón del Ala Asesina",
      type: "CAMPEÓN",
      img: "imagenes/ala-asesina-img/campeon.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "CAMPEÓN"],
      w: [
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Pistola de plasma (normal)", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Pistola de plasma (sobrecarga)", a: 4, i: "3+", d: "4/5", r: ["Alcance 8\"", "Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Arma de energía", a: 5, i: "3+", d: "4/6", r: ["Letal 5+"] },
        { n: "Puño de energía", a: 4, i: "3+", d: "5/7", r: ["Brutal", "Choque"] },
      ],
      ru: [
        {
          n: "Campeón del Caos",
          t: "GAMBITO ESTRATÉGICO. Retira tu ficha de Desafío del agente enemigo que lo tenga (si lo hay), y a continuación elige un agente enemigo para que gane tu ficha de Desafío. Cuando este agente combata o contraataque contra un agente enemigo que tenga tu ficha de Desafío, durante el paso de elegir armas puedes seleccionar una de las siguientes reglas de armas para que la tengan las armas de combate de este agente hasta el final de la secuencia: Brutal, Castigadora, Choque, Equilibrada, Severa.",
        },
        { n: "Sendero a la gloria", t: "Siempre que este agente incapacite a un agente enemigo que tenga tu ficha de Desafío, obtienes 1PM." },
      ],
    },
    {
      id: "garramaldita",
      name: "Garramaldita del Ala Asesina",
      type: "GARRAMALDITA",
      img: "imagenes/ala-asesina-img/garramaldita.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "GARRAMALDITA"],
      w: [{ n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] }, { n: "Garras mutadas", a: 5, i: "3+", d: "4/5", r: ["Desgarradora"] }],
      ru: [
        {
          n: "Ataque frenético",
          t: "Si este agente queda incapacitado durante una acción de Combatir, puedes golpear al agente enemigo en esa secuencia con uno de tus éxitos sin resolver antes de retirar a este agente de la zona de aniquilación.",
        },
        {
          n: "Atrapar (1PA)",
          t: "Acción de IMPULSO. Elige un agente enemigo en la ZONA DE IMPULSO de este agente. Ambos jugadores tiran 1D6 y suman a su resultado el atributo Heridas de su respectivo agente. Si tu resultado es mayor, retira de la zona de aniquilación a ese agente enemigo y vuelve a desplegarlo en la ZONA DE IMPULSO o la zona de control de este agente. Debe desplegarse en una ubicación en la que pueda colocarse y no puede desplegarse más lejos de lo que estaba de este agente. Si ese agente enemigo se despliega en la zona de control de este agente, la acción de Retroceder o Reposicionarse termina (permitiendo a este agente terminar esa acción en la zona de control de agentes enemigos). Este agente no puede realizar esta acción de manera normal. En lugar de ello, la realiza durante una acción de Retroceder o Reposicionarse, tras desplegarse debido a un IMPULSO.",
          isAct: true,
        },
      ],
    },
    {
      id: "depredador",
      name: "Depredador del Ala Asesina",
      type: "DEPREDADOR",
      img: "imagenes/ala-asesina-img/depredador.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "DEPREDADOR"],
      w: [{ n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] }, { n: "Gran hacha sierra", a: 5, i: "4+", d: "5/7", r: ["Brutal"] }],
      ru: [
        {
          n: "Desmembramiento horripilante",
          t: "Siempre que este agente incapacite a un agente enemigo al combatir o contraatacar, elige un agente enemigo distinto a 3\" o menos de este agente o del agente enemigo incapacitado y visible para el mismo. Resta 1 al atributo LPA de ese agente enemigo hasta el final de su siguiente activación.",
        },
        {
          n: "Golpe Cercenador (1PA)",
          t: "Inflige 2D3 daños a cada otro agente visible para este agente y a 2\" o menos de él en el orden que elijas (tira por separado para cada uno). Este agente no puede realizar esta acción mientras tenga una orden de ocultarse, ni durante la misma activación en la que realizara la acción Rebanar desde lo alto (ver equipo de facción Filoaletas), la acción Cargar con garras (ver equipo de facción Armadura con garras) o dos acciones de Combatir (y viceversa)”.",
          isAct: true,
        },
      ],
    },
    {
      id: "maestro-cazador",
      name: "Maestro Cazador del Ala Asesina",
      type: "MAESTRO CAZADOR",
      img: "imagenes/ala-asesina-img/maestro.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "MAESTRO CAZADOR"],
      w: [{ n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] }, { n: "Arma de energía", a: 5, i: "3+", d: "4/6", r: ["Letal 5+"] }],
      ru: [
        {
          n: "Presa acorralada",
          t: "Siempre que un agente enemigo vaya a realizar una acción de Retroceder estando en la zona de control de este agente, si no hay otros agentes enemigos en la zona de control de este agente, puedes usar esta regla. Si lo haces, tira 2D6, o 1D6 si ese agente enemigo tiene un atributo Heridas mayor que este agente. Si sacas algún 4+, el agente enemigo no puede realizar esa acción durante esta activación/ reacción (y no gasta PA en ella).",
        },
        {
          n: "Golpear Desde Lo Alto (1PA)",
          t: "Acción de IMPULSO. Inflige 2D3+1 daños a un agente enemigo en la ZONA DE IMPULSO de este agente. Este agente no puede realizar esta acción de manera normal. En lugar de ello, la realiza durante una acción de Retroceder o Reposicionarse, tras desplegarse debido a un IMPULSO.",
          isAct: true,
        },
      ],
    },
    {
      id: "rapaz",
      name: "Rapaz del Ala Asesina",
      type: "RAPAZ",
      img: "imagenes/ala-asesina-img/rapaz.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "RAPAZ"],
      w: [
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Pistola de plasma (normal)", a: 4, i: "3+", d: "3/5", r: ["Alcance 8\"", "Penetración 1"] },
        { n: "Pistola de plasma (sobrecarga)", a: 4, i: "3+", d: "4/5", r: ["Alcance 8\"", "Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Espada sierra", a: 5, i: "3+", d: "4/5", r: [] },
      ],
      ru: [
        {
          n: "La excitación del vuelo",
          t: "Siempre que este agente se dé un IMPULSO durante su activación:\n• Puedes retirar cualesquiera cambios a su atributo LPA.\n• Puedes ignorar cualesquiera cambios a sus atributos por estar lesionado (incluyendo los atributos de sus armas) hasta el final de la activación.",
        },
      ],
    },
    {
      id: "estridente",
      name: "Estridente del Ala Asesina",
      type: "ESTRIDENTE",
      img: "imagenes/ala-asesina-img/estridente.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "ESTRIDENTE"],
      w: [{ n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] }, { n: "Espada sierra", a: 5, i: "3+", d: "4/5", r: [] }],
      ru: [
        {
          n: "Vocoemisores modificados",
          t: "Cuando un agente enemigo se encuentre a 3\" o menos de este agente, tu oponente debe gastar 1 PA adicional para que ese agente enemigo pueda realizar acciones de Recoger marcador o de misión. Al determinar el control de un marcador, considera el atributo LPA total de los agentes enemigos que lo estén disputando como si fuera 1 menos si al menos uno de esos agentes enemigos está a 3\" o menos de este agente. Ten en cuenta que esto no es un cambio a su atributo LPA, de modo que cualquier cambio es acumulable con esto.",
        },
        {
          n: "Alarido (1PA)",
          t: "Elige un agente enemigo a 6\" o menos de este agente y visible para él. Como alternativa, elige a un agente enemigo en la ZONA DE IMPULSO de este agente (con lo cual esta acción se convierte en una acción de IMPULSO). Si hay agentes enemigos en la zona de control de este agente, no puedes elegir a un agente enemigo que no lo esté. Inflige 1D3 daños al agente elegido y resta 1 a su atributo LPA hasta el final de su siguiente activación. Este agente no puede realizar esta acción mientras tenga una orden de ocultarse. Si estás eligiendo a un agente enemigo en la ZONA DE IMPULSO de este agente, este agente no puede realizar esta acción de manera normal. En lugar de ello, la realiza durante una acción de Retroceder o Reposicionarse tras desplegarse debido a un IMPULSO.",
          isAct: true,
        },
      ],
    },
    {
      id: "ignifero",
      name: "Ignífero del Ala Asesina",
      type: "IGNÍFERO",
      img: "imagenes/ala-asesina-img/ignifero.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "IGNÍFERO"],
      w: [
        { n: "Lanzallamas", a: 4, i: "2+", d: "3/3", r: ["Alcance 8\"", "Ráfaga 2”", "Saturación"] },
        { n: "Pistola bólter", a: 4, i: "3+", d: "3/4", r: ["Alcance 8\""] },
        { n: "Rifle de fusión", a: 4, i: "3+", d: "6/3", r: ["Alcance 6\"", "Devastadora 4", "Penetración 2"] },
        { n: "Rifle de plasma (normal)", a: 4, i: "3+", d: "4/6", r: ["Penetración 1"] },
        { n: "Rifle de plasma (sobrecarga)", a: 4, i: "3+", d: "5/6", r: ["Letal 5+", "Penetración 1", "Sobrecalentamiento"] },
        { n: "Puños", a: 4, i: "3+", d: "3/4", r: [] },
      ],
      ru: [],
    },
    {
      id: "espolon-de-la-disformidad",
      name: "Espolón de la Disformidad del Ala Asesina",
      type: "ESPOLÓN DE LA DISFORMIDAD",
      img: "imagenes/ala-asesina-img/espolon.jpg",
      s: { lpa: 3, mov: "6\"", salv: "3+", h: 14 },
      kw: ["ALA ASESINA", "CAOS", "ASTARTES HEREJES", "ESPOLÓN DE LA DISFORMIDAD"],
      w: [{ n: "Garras relámpago", a: 5, i: "3+", d: "4/5", r: ["Desgarradora", "Incesante", "Letal 5+"] }],
      ru: [
        {
          n: "Rajar el velo",
          t: "Al desplegar a este agente antes de la batalla, en lugar de ello puedes desplegarlo en la disformidad: sitúalo a un lado en lugar de en la zona de aniquilación. En la primera fase de tiroteo, cuando se active a este agente, coloca uno de tus marcadores de Disformidad completamente dentro de tu territorio, y a continuación este agente queda usado. En la segunda fase de tiroteo, cuando actives a este agente, despliégalo con una orden de tu elección en una ubicación en la que pueda colocarse, o bien completamente dentro de tu zona de descenso, o completamente dentro de tu territorio disputando tu marcador de Disformidad. Continúa con su activación de manera normal, pero durante esa activación no puede realizar más de dos acciones y no puede usar más de 4\" de distancia de movimiento. Hasta el paso de preparación de la siguiente fase de estrategia, este agente está ofuscado para los agentes a más de 3\" de él. Cuando este agente se encuentre en la disformidad, no puede ser el agente ALA ASESINA amigo apostado de cara al ardid de tiroteo Narcisismo malicioso.",
        },
      ],
    },
  ],
  fr: {
    name: "Propulsor de salto",
    type: "REGLA DE FACCIÓN",
    text: "Cuando un agente ALA ASESINA amigo esté realizando una acción de Cargar, Retroceder o Reposicionarse durante su activación, al inicio de cualquier incremento en línea recta y siempre y cuando ninguna parte de su peana se encuentre bajo terreno Aventajado, puede dar un IMPULSO en ese incremento. Si lo hace, no muevas al agente en ese incremento. En su lugar, retíralo de la zona de aniquilación y vuelve a desplegarlo completamente a x\" o menos en horizontal de su ubicación original. X es una distancia de tu elección (redondeando al alza hasta la pulgada más cercana, como en la acción de Reposicionarse), pero se añade a la distancia total de movimiento usada para esa acción (es decir, el movimiento más el IMPULSO no pueden exceder la capacidad de movimiento de la acción).",
    orders: [
      {
        n: "Ejemplo de acciones de impulso",
        t: "En este ejemplo, el agente de arriba (C) se encuentra en la ZONA DE IMPULSO del agente ALA ASESINA (A). El agente de abajo (B) no, ya que su peana está bajo terreno Aventajado. ZONA DE IMPULSO",
      },
      {
        n: "Astartes",
        t: "Durante la activación de cada agente ALA ASESINA amigo, puede realizar o dos acciones de Disparar o dos acciones de Combatir. Si son dos acciones de Disparar, debe seleccionarse una pistola bólter para al menos una de ellas. Cada agente ALA ASESINA amigo puede reaccionar sin importar cuál sea su orden.",
      },
      {
        n: "Ejemplo de propulsor de salto",
        t: "En este ejemplo, el agente ALA ASESINA (A) realiza un IMPULSO en el segundo incremento de movimiento. Se mueve de manera normal durante los incrementos primero y tercero, ya que no puede usar un IMPULSO desde ni hasta una ubicación que esté bajo terreno Aventajado. MOVIMIENTO de 1\" IMPULSO de 4\" MOVIMIENTO de 1\"",
      },
      {
        n: "Acciones de impulso",
        t: "Algunas acciones se conocen como acciones de IMPULSO. Estas son acciones que se realizan durante otras acciones, cuando se aplica un IMPULSO. Cada agente solo puede realizar una acción de IMPULSO por activación. La mayoría de acciones de IMPULSO afectan a los agentes enemigos que están en la ZONA DE IMPULSO del agente ALA ASESINA. Esta es la zona horizontal entre la ubicación actual de un agente ALA ASESINA amigo y la ubicación desde la que usó el IMPULSO. Puedes determinarlo colocando temporalmente un marcador del mismo tamaño que la peana del agente. Los agentes enemigos que tengan alguna parte de la peana bajo terreno Aventajado no se consideran en las ZONAS DE IMPULSO de los agentes ALA ASESINA amigos.",
      },
    ],
  },
  frs: [
    {
      name: "Propulsor de salto",
      text: "Cuando un agente ALA ASESINA amigo esté realizando una acción de Cargar, Retroceder o Reposicionarse durante su activación, al inicio de cualquier incremento en línea recta y siempre y cuando ninguna parte de su peana se encuentre bajo terreno Aventajado, puede dar un IMPULSO en ese incremento. Si lo hace, no muevas al agente en ese incremento. En su lugar, retíralo de la zona de aniquilación y vuelve a desplegarlo completamente a x\" o menos en horizontal de su ubicación original. X es una distancia de tu elección (redondeando al alza hasta la pulgada más cercana, como en la acción de Reposicionarse), pero se añade a la distancia total de movimiento usada para esa acción (es decir, el movimiento más el IMPULSO no pueden exceder la capacidad de movimiento de la acción).",
      subs: [],
    },
    {
      name: "Ejemplo de acciones de impulso",
      text: "En este ejemplo, el agente de arriba (C) se encuentra en la ZONA DE IMPULSO del agente ALA ASESINA (A). El agente de abajo (B) no, ya que su peana está bajo terreno Aventajado. ZONA DE IMPULSO",
      subs: [],
    },
    {
      name: "Astartes",
      text: "Durante la activación de cada agente ALA ASESINA amigo, puede realizar o dos acciones de Disparar o dos acciones de Combatir. Si son dos acciones de Disparar, debe seleccionarse una pistola bólter para al menos una de ellas. Cada agente ALA ASESINA amigo puede reaccionar sin importar cuál sea su orden.",
      subs: [],
    },
    {
      name: "Ejemplo de propulsor de salto",
      text: "En este ejemplo, el agente ALA ASESINA (A) realiza un IMPULSO en el segundo incremento de movimiento. Se mueve de manera normal durante los incrementos primero y tercero, ya que no puede usar un IMPULSO desde ni hasta una ubicación que esté bajo terreno Aventajado. MOVIMIENTO de 1\" IMPULSO de 4\" MOVIMIENTO de 1\"",
      subs: [],
    },
    {
      name: "Acciones de impulso",
      text: "Algunas acciones se conocen como acciones de IMPULSO. Estas son acciones que se realizan durante otras acciones, cuando se aplica un IMPULSO. Cada agente solo puede realizar una acción de IMPULSO por activación. La mayoría de acciones de IMPULSO afectan a los agentes enemigos que están en la ZONA DE IMPULSO del agente ALA ASESINA. Esta es la zona horizontal entre la ubicación actual de un agente ALA ASESINA amigo y la ubicación desde la que usó el IMPULSO. Puedes determinarlo colocando temporalmente un marcador del mismo tamaño que la peana del agente. Los agentes enemigos que tengan alguna parte de la peana bajo terreno Aventajado no se consideran en las ZONAS DE IMPULSO de los agentes ALA ASESINA amigos.",
      subs: [],
    },
  ],
  pl: {
    s: [
      {
        n: "Masacrar a los débiles",
        t: "Cuando un agente ALA ASESINA amigo dispare o combata, sus armas tienen la regla de armas Castigadora si el agente contra el que ese agente amigo está disparando o combatiendo cumple cualquiera de las siguientes condiciones:\n• Se encuentra al menos 2\" más bajo que el agente amigo.\n• Su LPA es menor de lo normal.\n• Estaba herido al inicio de la activación/reacción.",
      },
      {
        n: "Pesadilla en las alturas",
        t: "Cuando un agente dispare contra un agente ALA ASESINA amigo que se encuentre al menos 2\" más alto que el suelo de la zona de aniquilación, o que realizara un IMPULSO durante este punto de inflexión, puedes repetir uno de tus dados de defensa.",
      },
      {
        n: "Depredadores aéreos",
        t: "Cuando un agente ALA ASESINA amigo se encuentre al menos 2\" más alto que el suelo de la zona de aniquilación, sus armas tienen la regla de armas Equilibrada. Cuando un agente ALA ASESINA amigo use un IMPULSO, sus armas tienen la regla de armas Equilibrada hasta el final de esa activación.",
      },
      { n: "Instilar miedo", t: "Cuando un agente ALA ASESINA amigo combata, el Daño normal de 3 o más le inflige 1 daño menos." },
    ],
    f: [
      {
        n: "Descenso asesino",
        t: "Usa este ardid de tiroteo cuando un agente enemigo termine la acción de Cargar, Correr Retroceder o Reposicionarse a 3\" o menos en horizontal de un agente ALA ASESINA amigo (o, en combate cerrado, a 2\" o menos, y ese agente enemigo debe estar en una estancia distinta a aquella en la que empezó esa acción). Interrumpe la activación/reacción de ese agente enemigo y realiza inmediatamente una acción libre de Cargar con ese agente amigo. Debe terminar esa acción en la zona de control de ese agente enemigo. Si esto no es posible, la interrupción se cancela y esta regla no ha sido usada.",
      },
      {
        n: "Luchar sin honor",
        t: "Usa este ardid de tiroteo cuando un agente ALA ASESINA amigo combata o contraataque, al resolver un éxito crítico. En lugar de golpear o bloquear, termina esa secuencia (cualquier dado de ataque restante se descarta) y realiza inmediatamente con ese agente una acción libre de Retroceder de hasta 3\" (y entonces la acción de Combatir termina). Ese agente puede hacerlo aunque haya realizado una acción que le impida realizar la acción de Retroceder.",
      },
      {
        n: "Narcisismo malicioso",
        t: "Usa este ardid de tiroteo cuando sea tu turno para activar un agente amigo, si solo hay apostado un único agente ALA ASESINA amigo. Hasta el final del punto de inflexión, siempre que tengas menos agentes amigos apostados que tu oponente, puedes no activar (es decir, puedes retrasar la activación de ese agente ALA ASESINA amigo hasta que a tu oponente solo le quede 1 agente apostado.",
      },
      {
        n: "Alas de oscuridad",
        t: "Usa este ardid de tiroteo cuando un agente ALA ASESINA amigo realice la acción de Retroceder o Reposicionarse, cuando aplique un IMPULSO. Ese agente puede desplegarse a 3\" adicionales de distancia durante ese IMPULSO (añadiéndolos a la distancia de movimiento permitida), pero no puede realizar acciones de Disparar, Combatir o Golpe cercenador (ver agente DEPREDADOR) hasta el siguiente punto de inflexión. No puedes usar este ardid durante el primer punto de inflexión.",
      },
    ],
  },
  eq: [
    {
      n: "Armadura con garras",
      t: "Los agentes ALA ASESINA amigos pueden realizar la siguiente acción única:\n▸ CARGAR CON GARRAS 0PA: Acción de IMPULSO. Inflige 1 daño a un agente enemigo en la zona de control de este agente, y a continuación la acción de Cargar termina. Un agente no puede realizar esta acción de manera normal. En lugar de ello, la realiza durante una acción de Cargar, tras desplegarse debido a un IMPULSO.",
    },
    {
      n: "Combustible disforme",
      t: "Una vez por punto de inflexión, cuando un agente enemigo termine la acción de Retroceder durante su activación, si al menos un agente ALA ASESINA amigo se encontraba en su zona de control al inicio de esa acción, puedes usar esta regla. Uno de esos agentes amigos puede realizar de inmediato una acción libre de Reposicionarse o Cargar, pero no puede usar más de 3\" de distancia de movimiento. Ten en cuenta que si el agente enemigo no realiza la acción de Retroceder durante su propia activación, esto no tiene efecto.",
    },
    {
      n: "Filoaletas",
      t: "Los agentes ALA ASESINA amigos pueden realizar la siguiente acción única:\n▸ REBANAR DESDE LO ALTO 1PA: Acción de IMPULSO. Inflige 1D3+1 daños a un agente enemigo en la ZONA DE IMPULSO de este agente. Un agente no puede realizar esta acción de manera normal. En lugar de ello, la realiza durante la acción de Retroceder o Reposicionarse, tras desplegarse debido a un IMPULSO. Un agente DEPREDADOR no puede realizar esta acción durante la misma activación en la que realizara la acción Golpe cercenador (o viceversa).",
    },
    {
      n: "Vocoemisores",
      t: "Una vez por punto de inflexión, un agente ALA ASESINA amigo puede realizar la siguiente acción única:\n▸ VOCOGRITO 1PA: Cada agente enemigo a 2\" o menos de este agente hace un chequeo de aturdimiento. Para ello, tira 1D6: con 3+, resta 1 a su atributo LPA hasta el final de su siguiente activación. Un agente no puede realizar esta acción si tiene una orden de ocultarse.",
    },
  ],
  er: [
    {
      v: "Fe de erratas · Agosto 2026",
      ee: [
        {
          s: "Reglas de facción, propulsor de salto",
          t: "Cambia la parte relevante del segundo párrafo a: \"Si va a hacer un IMPULSO durante la acción de Cargar, el movimiento no podrá ser mayor de 6\"\".",
        },
      ],
    },
    {
      v: "Comentarios de reglas · Agosto 2026",
      ee: [
        {
          s: "Agente señor del caos, dones de condenación",
          t: "Cambia la parte relevante del segundo punto a: “Cuando este agente combate o contraataca y golpeas con un dado de ataque, puedes…”",
        },
        {
          s: "Agente depredador, acción golpe cercenador",
          t: "Cambia la condición a: “A efectos de las restricciones de acciones y la regla de facción Astartes, esta acción se trata como una acción de Combatir. Este agente no puede realizar esta acción mientras tenga una orden de Ocultarse, ni durante la misma activación en la que realizara la acción Rebanar desde lo alto (ver equipo de facción Filoaletas), la acción Cargar con garras (ver equipo de facción Armadura con garras) o dos acciones de Combatir (y viceversa)”.",
        },
        {
          s: "Agente espolón de la disformidad, regla rajar el velo",
          t: "Cambia la segunda y tercera frases del segundo párrafo por: “Continúa con su activación de manera normal, pero durante esa activación no puedes gastar más de 2PA en ella y no puede usar más de 4\" de distancia de movimiento. Hasta el paso de preparación de la siguiente fase de estrategia, este agente está ofuscado para los agentes a más de 3\" de él”.",
        },
        {
          s: "Reglas de facción, propulsor de salto",
          t: "Añade este texto al final del primer párrafo: “Si hace un IMPULSO durante la acción de Cargar, no sumes 2\" adicionales a la distancia que puede mover.\" P: ¿Puedo usar Alas de oscuridad durante la activación en la que un agente ESPOLÓN DE LA DISFORMIDAD se despliega desde la disformidad para usar una distancia de movimiento de más de 4\" durante esa activación? R: No. P: Al usar el ardid de tiroteo Luchar sin honor, si algo impide la acción de Retroceder (p. ej. Cepo de cadena de las MANDRÁGORAS ), ¿se recuperan los PM gastados? R: No.",
        },
      ],
    },
    {
      v: "Erratas anteriores",
      ee: [
        {
          s: "Ardides de tiroteo, narcisismo malicioso",
          t: "Cambia la segunda frase a: “Hasta el final del punto de inflexión, siempre que tengas menos agentes amigos apostados que tu oponente, puedes no activar (es decir, puedes retrasar la activación de ese agente ALA ASESINA amigo hasta que a tu oponente solo le quede 1 agente apostado)”.",
        },
        {
          s: "Ardides de tiroteo, descenso asesino",
          t: "Cambia la primera frase a: \"Usa este ardid de tiroteo cuando un agente enemigo termine la acción de Cargar, Correr, Retroceder o Reposicionarse a 3\" o menos en horizontal y a más de 2\" por debajo de algún agente ALA ASESINA amigo (o, en espacios cerrados, a 2\" o menos y ese agente enemigo debe estar en una estancia diferente a en la que inició la acción)”.",
        },
        {
          s: "Equipo de facción, vocoemisores, acción vocogrito",
          t: "Cambia la parte relevante de la primera frase del efecto por: “Cada agente enemigo a 2\" o menos de este agente realiza un chequeo de aturdimiento”.",
        },
      ],
    },
  ],
  roster: {
    archetypes: ["Reconocimiento", "Buscar y destruir"],
    required: [
      {
        type: "SEÑOR DEL CAOS",
        count: 1,
        loadouts: [
          { label: "Pistola bólter; garra relámpago", w: [{ n: "Pistola bólter" }, { n: "Garra relámpago" }] },
          { label: "Pistola bólter; puño de energía", w: [{ n: "Pistola bólter" }, { n: "Puño de energía" }] },
          { label: "Pistola bólter; arma de energía", w: [{ n: "Pistola bólter" }, { n: "Arma de energía" }] },
          { label: "Pistola de plasma; garra relámpago", w: [{ n: "Pistola de plasma" }, { n: "Garra relámpago" }] },
          { label: "Pistola de plasma; puño de energía", w: [{ n: "Pistola de plasma" }, { n: "Puño de energía" }] },
          { label: "Pistola de plasma; arma de energía", w: [{ n: "Pistola de plasma" }, { n: "Arma de energía" }] },
          { label: "Garras relámpago reliquia", w: [{ n: "Garras relámpago reliquia" }] },
        ],
      },
    ],
    pool: {
      slots: 5,
      note: "Salvo Rapaces, cada agente solo una vez. No puedes elegir en total más de dos agentes con armas combinadas (pistola de plasma, rifle de fusión o rifle de plasma).",
      entries: [
        {
          type: "CAMPEÓN",
          max: 1,
          loadouts: [
            { label: "Pistola bólter; puño de energía", w: [{ n: "Pistola bólter" }, { n: "Puño de energía" }] },
            { label: "Pistola bólter; arma de energía", w: [{ n: "Pistola bólter" }, { n: "Arma de energía" }] },
            { label: "Pistola de plasma; puño de energía", w: [{ n: "Pistola de plasma" }, { n: "Puño de energía" }] },
            { label: "Pistola de plasma; arma de energía", w: [{ n: "Pistola de plasma" }, { n: "Arma de energía" }] },
          ],
        },
        { type: "GARRAMALDITA", max: 1 },
        { type: "DEPREDADOR", max: 1 },
        { type: "MAESTRO CAZADOR", max: 1 },
        { type: "RAPAZ", max: null, key: "rapaz-bolter", label: "Rapaz · pistola bólter" },
        { type: "RAPAZ", max: null, key: "rapaz-plasma", label: "Rapaz · pistola de plasma" },
        { type: "ESTRIDENTE", max: 1 },
        {
          type: "IGNÍFERO",
          max: 1,
          loadouts: [
            { label: "Lanzallamas; pistola bólter; puños", w: [{ n: "Lanzallamas" }, { n: "Pistola bólter" }, { n: "Puños" }] },
            { label: "Pistola bólter; rifle de fusión; puños", w: [{ n: "Pistola bólter" }, { n: "Rifle de fusión" }, { n: "Puños" }] },
            { label: "Pistola bólter; rifle de plasma; puños", w: [{ n: "Pistola bólter" }, { n: "Rifle de plasma" }, { n: "Puños" }] },
          ],
        },
        { type: "ESPOLÓN DE LA DISFORMIDAD", max: 1 },
      ],
    },
    constraints: [
      {
        match: "plasma|fusión",
        max: 2,
        label: "Máx. 2 armas combinadas",
        msg: "No puedes elegir más de dos agentes con pistola de plasma, rifle de fusión o rifle de plasma.",
      },
    ],
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
