import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7_FF9zCatiybPL7BBhtpt-cbKxQdvPHQ",
  authDomain: "loteria-prueba-ll.firebaseapp.com",
  databaseURL: "https://loteria-prueba-ll-default-rtdb.firebaseio.com",
  projectId: "loteria-prueba-ll",
  storageBucket: "loteria-prueba-ll.appspot.com",
  messagingSenderId: "266376757381",
  appId: "1:266376757381:web:47c0ec87c0aa3605e869ec"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const boletosSeleccionados = [];
let bloquearGeneracion = false; // Variable de control

function mostrarNumerosDisponibles() {
  
   const numerosRef = ref(database, 'boletos');
 
   onValue(numerosRef, (numerosSnapshot) => {
     const contenedorNumeros = document.getElementById('contenedorNumeros');
     contenedorNumeros.innerHTML = '';
 
     numerosSnapshot.forEach((numerosChildSnapshot) => {
       const numero = numerosChildSnapshot.key;
       const estadoNumero = numerosChildSnapshot.val().estado;
 
       if (estadoNumero === 'disponible') {
         const numeroFormateado = ('00000' + numero).slice(-5);
 
         const boton = document.createElement('button');
         boton.textContent = numeroFormateado;
         boton.addEventListener('click', () => seleccionarBoleto(numero));
 
         contenedorNumeros.appendChild(boton);
         boton.style.borderRadius = '10px';  // Puedes ajustar el valor según tus preferencias
        boton.style.fontFamily = 'Arial, sans-serif';  // Cambia la fuente según tus preferencias
        boton.style.fontWeight = 'bold';  // Ajusta el grosor de la fuente
        boton.style.fontSize = '16px';  // Puedes ajustar el tamaño de la fuente según tus preferencias
        boton.style.textTransform = 'uppercase';  // Cambia el texto a mayúsculas
       }
     });
     // Establecer el borde verde alrededor de todos los números
    contenedorNumeros.style.backgroundColor = '#70b578';  // Puedes ajustar el color según tus preferencias
    contenedorNumeros.style.border = '15px solid #008F39';
   });
 }
 
const contenedorNumeros = document.getElementById('contenedorNumeros');

contenedorNumeros.addEventListener('click', (event) => {
    const botonSeleccionado = event.target;

    if (botonSeleccionado.tagName === 'BUTTON') {
        cambiarColorSeleccionado(botonSeleccionado);
        mostrarNumeroArriba(botonSeleccionado.textContent);
    }
});

function mostrarNumeroArriba(numero) {
  // Implementa la lógica para mostrar el número arriba
  // Aquí puedes agregar la lógica para mostrar el número en algún lugar de tu interfaz de usuario
}


function cambiarColorSeleccionado(boton) {
  if (boton.classList.contains('seleccionado')) {
    boton.classList.remove('seleccionado');
    boton.style.backgroundColor = ''; 
  } else {
    boton.classList.add('seleccionado');
    boton.style.backgroundColor = '#008F39';
  }
}

function seleccionarBoleto(numeroSeleccionado) {
 
  const boletoExistente = boletosSeleccionados.find((boleto) => boleto.numero === numeroSeleccionado);

  if (boletoExistente) {
    const indice = boletosSeleccionados.findIndex((boleto) => boleto.numero === numeroSeleccionado);
    boletosSeleccionados.splice(indice, 1);

    mostrarNumerosAleatorios(boletosSeleccionados);
  } else {
    obtenerNumerosAleatorios((numerosAleatorios) => {
      const nuevoBoleto = { numero: numeroSeleccionado, oportunidades: numerosAleatorios };
      boletosSeleccionados.push(nuevoBoleto);
      mostrarNumerosAleatorios(boletosSeleccionados);
    });
  }
}


// Función para obtener números aleatorios
function obtenerNumerosAleatorios(callback) {
  
  // Realizar consulta a Firebase para obtener las oportunidades disponibles
  onValue(ref(database, 'oportunidades404'), (snapshot) => {
    const oportunidadesDisponibles = [];

    // Obtener las oportunidades disponibles
    snapshot.forEach((childSnapshot) => {
      const oportunidad = childSnapshot.val();
      if (oportunidad.estado === 'disponible') {
        oportunidadesDisponibles.push(childSnapshot.key);
      }
    });

    // Generar números aleatorios únicos dentro del rango de las oportunidades disponibles
    const numerosAleatorios = [];
    while (numerosAleatorios.length < 5 && oportunidadesDisponibles.length > 0) {
      const index = Math.floor(Math.random() * oportunidadesDisponibles.length);
      const numeroAleatorio = oportunidadesDisponibles[index];
      numerosAleatorios.push(numeroAleatorio);
      oportunidadesDisponibles.splice(index, 1); // Eliminar la oportunidad asignada de la lista de disponibles
    }

    callback(numerosAleatorios);
  });
}

let costoTotal = 0;

const precioUnitario = 10;

function mostrarNumerosAleatorios(boletos) {
  const contenedorOportunidadesSeleccionadas = document.getElementById('contenedorOportunidadesSeleccionadas');

  contenedorOportunidadesSeleccionadas.innerHTML = '';

  if (boletos.length > 0) {
    const encabezadoNumeroBoleto = document.createElement('h3');
    encabezadoNumeroBoleto.id = 'encabezadoNumeroBoleto';
    encabezadoNumeroBoleto.textContent = 'Oportunidades';

    contenedorOportunidadesSeleccionadas.style.display = 'flex';
    contenedorOportunidadesSeleccionadas.style.flexDirection = 'column';
    contenedorOportunidadesSeleccionadas.style.alignItems = 'center';

    contenedorOportunidadesSeleccionadas.appendChild(encabezadoNumeroBoleto);
  } else {
    contenedorOportunidadesSeleccionadas.style.display = 'none';
    return;
  }

  boletos.forEach((boleto) => {
    const numeroBoleto = boleto.numero;
    const oportunidades = boleto.oportunidades;

    const nuevoContenedorBoleto = document.createElement('div');
    nuevoContenedorBoleto.id = `boleto-${numeroBoleto}`;
    nuevoContenedorBoleto.className = 'boleto-container';
    nuevoContenedorBoleto.style.display = 'flex';
    nuevoContenedorBoleto.style.flexDirection = 'row';
    nuevoContenedorBoleto.style.alignItems = 'flex-start';

    const botonBoletoNegro = document.createElement('button');
    botonBoletoNegro.textContent = numeroBoleto;
    botonBoletoNegro.style.backgroundColor = '#000';
    botonBoletoNegro.style.color = '#fff';

    const contenidoOportunidades = document.createElement('p');
    contenidoOportunidades.textContent = `[${oportunidades.join(', ')}]`;
    contenidoOportunidades.style.margin = '0';
    contenidoOportunidades.style.fontSize = '14px';

    nuevoContenedorBoleto.appendChild(botonBoletoNegro);
    nuevoContenedorBoleto.appendChild(contenidoOportunidades);

    contenedorOportunidadesSeleccionadas.appendChild(nuevoContenedorBoleto);
  });

  // boletos seleccionados
  const cantidadBoletosSeleccionados = boletos.length;
  const contenedorCantidadBoletos = document.createElement('div');
  contenedorCantidadBoletos.id = 'contenedorCantidadBoletos';
  contenedorCantidadBoletos.textContent = `${cantidadBoletosSeleccionados} BOLETO SELECCIONADO `;
  contenedorOportunidadesSeleccionadas.appendChild(contenedorCantidadBoletos);

  // costo total
  costoTotal = cantidadBoletosSeleccionados * precioUnitario;
  const contenedorCostoTotal = document.createElement('div');
  contenedorCostoTotal.id = 'contenedorCostoTotal';
  contenedorCostoTotal.textContent = `Costo Total: $${costoTotal}`;
  contenedorOportunidadesSeleccionadas.appendChild(contenedorCostoTotal);

  const botonReservar = document.createElement('button');
  botonReservar.id = 'botonReservar';
  botonReservar.textContent = 'Reservar';
  botonReservar.addEventListener('click', mostrarVentanaEmergente);
  bloquearGeneracion = true;
  //  botón Reservar
  if (boletos.length > 0) {
    contenedorOportunidadesSeleccionadas.appendChild(botonReservar);
  }
}

function bloquearSeleccionBoletos() {
  const contenedorNumeros = document.getElementById('contenedorNumeros');
  contenedorNumeros.style.pointerEvents = 'none';
}

function desbloquearSeleccionBoletos() {
  const contenedorNumeros = document.getElementById('contenedorNumeros');
  contenedorNumeros.style.pointerEvents = 'auto';
}


function mostrarVentanaEmergente() {
  cerrarVentanaEmergente();

  bloquearSeleccionBoletos();
  

  const fondoObscuro = document.createElement('div');
  fondoObscuro.className = 'fondo-obscuro';

  fondoObscuro.addEventListener('click', (event) => {
    if (event.target === fondoObscuro) {
      cerrarVentanaEmergente(ventanaEmergente, fondoObscuro);
    }
  });

  const ventanaEmergente = document.createElement('div');
  ventanaEmergente.className = 'ventana-emergente';

  const mensajeBienvenida = document.createElement('p');
  mensajeBienvenida.textContent = 'LLENA TUS DATOS Y DA CLICK EN APARTAR';

  const mensajeSeleccion = document.createElement('p');
  mensajeSeleccion.textContent = `${boletosSeleccionados.length} BOLETO SELECCIONADO`;

  const campoWhatsApp = document.createElement('input');
  campoWhatsApp.placeholder = 'NÚMERO WHATSAPP (10 dígitos)';
  campoWhatsApp.addEventListener('input', validarInformacion);

  const campoNombre = document.createElement('input');
  campoNombre.placeholder = 'NOMBRE(S)';
  campoNombre.addEventListener('input', validarInformacion);

  const campoApellido = document.createElement('input');
  campoApellido.placeholder = 'APELLIDOS';
  campoApellido.addEventListener('input', validarInformacion);

  const estadosMexico = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
    "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo",
    "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca",
    "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
    "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

const selectEstado = document.createElement('select');
selectEstado.id = 'selectEstado';

// Agrega opciones al select basadas en la lista de estados de México
estadosMexico.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    selectEstado.appendChild(option);
});

  const mensajeadicional = document.createElement('h8');
  mensajeadicional.textContent = '¡Al finalizar serás redirigido a WhatsApp para enviar la información de tu boleto!';

  const botonEnviarReserva = document.createElement('button');
  botonEnviarReserva.textContent = 'RESERVAR BOLETOS';
  botonEnviarReserva.addEventListener('click', async () => {
      const numeroWhatsApp = campoWhatsApp.value;
      const nombre = campoNombre.value;
      const apellido = campoApellido.value;
      const estadoSeleccionado = selectEstado.value;
     

      if (numeroWhatsApp && /^\d+$/.test(numeroWhatsApp) && nombre && apellido && estadoSeleccionado) {
          const cantidadBoletos = boletosSeleccionados.length;
       
          try {
              await Promise.all(boletosSeleccionados.map(async (boleto) => {
                  const boletoNumero = boleto.numero;
                  const oportunidades = boleto.oportunidades;
  
                  // Actualizar el estado del boleto y sus oportunidades
                  await set(ref(database, `boletos/${boletoNumero}/estado`), 'reservado');
                  await set(ref(database, `boletos/${boletoNumero}/oportunidades`), oportunidades);
                  
                  // Guardar la información adicional del boleto en Firebase
                  await set(ref(database, `boletos/${boletoNumero}/informacionAdicional`), {
                      nombre: nombre,
                      apellido: apellido,
                      numero: numeroWhatsApp,
                      estado: estadoSeleccionado
                  });
  
                 
                  
              }));

        
        const mensaje = `Hola, Aparte boletos de la rifa!!
        NOMBRE DE LA RIFA 
        ~~~~~~~~~~~~~~~~~~~
        BOLETOS SELECCIONADOS (${cantidadBoletos} boletos):
        ${boletosSeleccionados.map(boleto => `*${boleto.numero}* (${boleto.oportunidades.join(', ')})`).join('\n')}
        
        Nombre: ${nombre} ${apellido}
        
        1 BOLETO POR   10$
        2 BOLETOS POR  20$
        3 BOLETOS POR  30$
        5 BOLETOS POR  50$
        10 BOLETOS POR 100$
        
        ~~~~~~~~~~~~~~~~~~~~
        Enlace para ver las cuentas de pago:
        https://extirpable-composit.000webhostapp.com/cuentas.html
        
        El siguiente paso es enviar foto del comprobante de pago por este medio:
        
        Costo Total: ${costoTotal} pesos MX
        Celular: ${numeroWhatsApp}`;  
        const urlWhatsApp = `https://wa.me/${4411302946}?text=${encodeURIComponent(mensaje)}`;
  
        const temporizador = document.createElement('p');
        temporizador.textContent = 'Redirigiendo';
        ventanaEmergente.appendChild(temporizador);
  
        setTimeout(() => {
          window.location.href = urlWhatsApp;
        }, 2000);
      } catch (error) {
        console.error("Error al reservar boletos:", error);
      }
    } else {
      alert('Por favor, ingrese un número de WhatsApp válido.');
    }
  });

  const botonCerrar = document.createElement('span');
botonCerrar.className = 'cerrar-ventana';
botonCerrar.innerHTML = 'x';
botonCerrar.addEventListener('click', () => {
  cerrarVentanaEmergente(ventanaEmergente, fondoObscuro);
});

  ventanaEmergente.appendChild(botonCerrar);
  ventanaEmergente.appendChild(mensajeBienvenida);
  ventanaEmergente.appendChild(mensajeSeleccion);
  ventanaEmergente.appendChild(campoWhatsApp);
  ventanaEmergente.appendChild(campoNombre);
  ventanaEmergente.appendChild(campoApellido);
  ventanaEmergente.appendChild(selectEstado);
  ventanaEmergente.appendChild(mensajeadicional);
  ventanaEmergente.appendChild(botonEnviarReserva);
  

  document.body.appendChild(fondoObscuro);
  document.body.appendChild(ventanaEmergente);

  function validarInformacion() {
    const numeroWhatsApp = campoWhatsApp.value;
    const nombre = campoNombre.value;
    const apellido = campoApellido.value;
    const estadoSeleccionado = selectEstado.value;

    // Verifica que todos los campos estén completos y el estado sea seleccionado
    const informacionCompleta = numeroWhatsApp && /^\d+$/.test(numeroWhatsApp) && nombre && apellido && estadoSeleccionado;

    // Habilita o deshabilita el botón de enviar dependiendo de si toda la información está completa
    botonEnviarReserva.disabled = !informacionCompleta;
}
}




function cerrarVentanaEmergente(ventanaEmergente, fondoObscuro) {
  if (ventanaEmergente && fondoObscuro) {
    ventanaEmergente.remove();
    fondoObscuro.remove();
    desbloquearSeleccionBoletos();
  }
}


mostrarNumerosDisponibles();
