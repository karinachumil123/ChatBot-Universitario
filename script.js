// Base de datos de universidades, facultades, carreras y jornadas
const universidades = {
    "USAC": { "Facultades": ["Medicina", "Ingeniería", "Ciencias Económicas", "Administración de Empresas"], "Costo": "Bajo", "Ubicación": "Centro" },
    "UMG": { "Facultades": ["Medicina", "Ingeniería", "Ciencias Económicas", "Administración de Empresas"], "Costo": "Medio", "Ubicación": "Zona 10" },
    "Del Valle": { "Facultades": ["Medicina", "Ingeniería", "Ciencias Económicas", "Administración de Empresas"], "Costo": "Alto", "Ubicación": "Zona 15" },
    "Francisco Marroquín": { "Facultades": ["Medicina", "Ingeniería", "Ciencias Económicas", "Administración de Empresas"], "Costo": "Muy Alto", "Ubicación": "Zona 20" }
};

const facultades = {
    "Medicina": ["Medicina General", "Enfermería", "Odontología", "Farmacia"],
    "Ingeniería": ["Ingeniería Civil", "Ingeniería en Sistemas", "Ingeniería Eléctrica", "Ingeniería Mecánica"],
    "Ciencias Económicas": ["Economía", "Contaduría Pública", "Administración de Empresas", "Finanzas"],
    "Administración de Empresas": ["Administración de Empresas", "Mercadotecnia", "Recursos Humanos", "Negocios Internacionales"]
};

const jornadas = ["Matutina", "Vespertina", "Nocturna"];

// Variables para almacenar las respuestas del usuario
let costo = null;
let ubicacion = null;
let aptitudes = null;
let intereses = null;
let disponibilidad = null;

// Estado del chatbot
let step = 0;

// Elementos del DOM
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Función para agregar un mensaje al chat
function addMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    // Agregar el emoji según el remitente (bot o usuario)
    if (sender === 'bot') {
        messageElement.innerHTML = `
            <span class="emoji">🤖</span>
            <p>${message}</p>
        `;
    } else if (sender === 'user') {
        messageElement.innerHTML = `
            <p>${message}</p>
            <span class="emoji">👤</span>
        `;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Función para validar la entrada del usuario
function validarEntrada(entrada, opciones) {
    return opciones.includes(entrada);
}

// Función para manejar la lógica del chatbot
function handleUserInput() {
    const input = userInput.value.trim();
    if (!input) return;

    addMessage('user', input);

    switch (step) {
        case 0:
            if (validarEntrada(input, ["Bajo", "Medio", "Alto", "Muy Alto"])) {
                costo = input;
                addMessage('bot', '¿En qué ubicación prefieres estudiar? (Centro, Zona 10, Zona 15, Zona 20)');
                step++;
            } else {
                addMessage('bot', 'Por favor, ingresa un costo válido: Bajo, Medio, Alto, Muy Alto.');
            }
            break;
        case 1:
            if (validarEntrada(input, ["Centro", "Zona 10", "Zona 15", "Zona 20"])) {
                ubicacion = input;
                addMessage('bot', '¿Cuáles son tus aptitudes? (Ej: Ciencias, Matemáticas, Economía, Administración)');
                step++;
            } else {
                addMessage('bot', 'Por favor, ingresa una ubicación válida: Centro, Zona 10, Zona 15, Zona 20.');
            }
            break;
            case 2:
                if (validarEntrada(input, ["Ciencias", "Matemáticas", "Economía", "Administración"])) {
                    aptitudes = input;
                    addMessage('bot', '¿Qué intereses tienes? (Ej: salud, software, finanzas, Mercadotecnia)');
                    step++;
                } else {
                    addMessage('bot', 'Por favor, ingresa una aptitud válida: Ciencias, Matemáticas, Economía, Administración');
                }
                break;
                case 3:
                    if (validarEntrada(input, ["salud", "software", "finanzas", "Mercadotecnia"])) {
                    intereses = input;
                    addMessage('bot', '¿Qué disponibilidad tienes? (Mañana, Tarde, Noche)');
                    step++;
                    } else {
                        addMessage('bot', 'Por favor, ingresa un interes válido: salud, software, finanzas, Mercadotecnia');
                    }
                    break;
                    case 4:
                        if (validarEntrada(input.toLowerCase(), ["mañana", "tarde", "noche"])) {
                            disponibilidad = input.toLowerCase();
                            const universidadRec = recomendarUniversidad(costo, ubicacion);
                            const facultadRec = recomendarFacultad(aptitudes);
                            const carreraRec = recomendarCarrera(facultadRec, intereses);
                            const jornadaRec = recomendarJornada(disponibilidad);
                    
                            if (universidadRec.length > 0 && facultadRec && carreraRec && jornadaRec) {
                                addMessage('bot', `Te recomiendo lo siguiente:
                                - Universidad: ${universidadRec[0]}
                                - Facultad: ${facultadRec}
                                - Carrera: ${carreraRec}
                                - Jornada: ${jornadaRec}`);
                            } else {
                                addMessage('bot', 'No se pudo encontrar una recomendación adecuada.');
                            }
                            step = 0; // Reiniciar el chatbot
                        } else {
                            addMessage('bot', 'Por favor, ingresa una disponibilidad válida: Mañana, Tarde, Noche.');
                        }
                        break;
    }

    userInput.value = ''; // Limpiar el input
}

// Funciones de recomendación
function recomendarUniversidad(costo, ubicacion) {
    return Object.keys(universidades).filter(uni => 
        universidades[uni].Costo === costo && universidades[uni].Ubicación === ubicacion
    );
}

function recomendarFacultad(aptitudes) {
    if (aptitudes.includes("Ciencias")) return "Medicina";
    if (aptitudes.includes("Matemáticas")) return "Ingeniería";
    if (aptitudes.includes("Economía")) return "Ciencias Económicas";
    if (aptitudes.includes("Administración")) return "Administración de Empresas";
    return null;
}

function recomendarCarrera(facultad, intereses) {
    const carreras = facultades[facultad] || [];

    // Convertir intereses a minúsculas para una comparación insensible a mayúsculas/minúsculas
    const interesesNormalizados = intereses.toLowerCase();

    // Mapeo de intereses a carreras específicas
    const interesesCarreras = {
        "software": "Ingeniería en Sistemas",
        "programación": "Ingeniería en Sistemas",
        "desarrollo web": "Ingeniería en Sistemas",
        "circuitos": "Ingeniería Eléctrica",
        "eléctrica": "Ingeniería Eléctrica",
        "electrónica": "Ingeniería Eléctrica",
        "medicina": "Medicina General",
        "salud": "Medicina General",
        "enfermería": "Enfermería",
        "odontología": "Odontología",
        "farmacia": "Farmacia",
        "economía": "Economía",
        "finanzas": "Finanzas",
        "contabilidad": "Contaduría Pública",
        "administración": "Administración de Empresas",
        "negocios": "Administración de Empresas",
        "mercadotecnia": "Mercadotecnia",
        "recursos humanos": "Recursos Humanos",
        "internacionales": "Negocios Internacionales"
    };

    // Buscar la carrera más relevante basada en los intereses
    for (const [keyword, carrera] of Object.entries(interesesCarreras)) {
        if (interesesNormalizados.includes(keyword)) {
            return carrera;
        }
    }

    // Si no hay coincidencia, devolver la primera carrera de la facultad
    return carreras[0];
}

function recomendarJornada(disponibilidad) {
    if (disponibilidad === "mañana") return "Matutina";
    if (disponibilidad === "tarde") return "Vespertina";
    if (disponibilidad === "noche") return "Nocturna";
    return null;
}

// Event listeners
sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

// Mensaje inicial del chatbot

addMessage('bot', 'Hola, soy un chatbot que te ayudará a elegir la universidad, facultad, carrera y jornada que mejor se ajusten a tus condiciones. ¿Qué costo prefieres? (Bajo, Medio, Alto, Muy Alto)');
