// IA Responsable — Reglas en código
// Funciones que el asistente usa antes y después de hablar con el modelo.
// Este archivo lo usan la demo (index.html) y las pruebas (node pruebas.js).

// Quita tildes y pasa a minúsculas para comparar sin depender de cómo escribe el coder.
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// 1. Antes de enviar la pregunta al modelo, oculta los datos personales.
//    El orden importa: el celular se reemplaza antes que el documento,
//    porque un celular también tiene 10 dígitos.
function protegerDatos(texto) {
  return texto
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "[correo]")
    .replace(/\b3\d{9}\b/g, "[celular]")
    .replace(/\b\d{6,10}\b/g, "[documento]");
}

// 2. ¿El tema necesita a una persona? Salud o decisiones sobre alguien
//    (notas, permanencia, dinero). Se buscan raíces de palabras para cubrir
//    variantes como "duele", "suspender" o "síntoma" escrito sin tilde.
const ALTO_IMPACTO = [
  /\bdolor/, /\bduel[eo]/, /\bmedicament/, /\bpastilla/, /\bsintoma/,
  /\bdiagnostic/, /\bsalud\b/,
  /\bnotas?\b/, /\bsacar/, /\bexpuls/, /\bsuspend/, /\bpermanencia\b/,
  /\bdinero\b/, /\bprestamo/, /\bdeuda/,
];

function requiereHumano(pregunta) {
  const texto = normalizar(pregunta);
  return ALTO_IMPACTO.some((patron) => patron.test(texto));
}

// 3. El aviso que va bajo cada respuesta.
function aviso(fuentes) {
  if (fuentes.length === 0)
    return "Respuesta generada con IA sin fuentes: no la uses para decisiones importantes.";
  return `Respuesta generada con IA a partir de ${fuentes.length} fuentes: ${fuentes.join(", ")}. Verifica los datos importantes.`;
}

// 4. Prueba de sesgo por pares: la misma pregunta cambiando solo un dato personal.
//    plantilla: texto con "{dato}" donde va el dato que cambia.
//    variantes: los valores a comparar (por ejemplo, dos nombres o dos ciudades).
//    responder: función que recibe la pregunta y devuelve la respuesta del asistente.
function pruebaDeSesgo(plantilla, variantes, responder) {
  const preguntas = variantes.map((dato) => plantilla.replace("{dato}", dato));
  const respuestas = preguntas.map(responder);
  const referencia = normalizar(respuestas[0]).trim();
  const sinSesgo = respuestas.every((r) => normalizar(r).trim() === referencia);
  return { preguntas, respuestas, sinSesgo };
}

if (typeof module !== "undefined") {
  module.exports = { normalizar, protegerDatos, requiereHumano, aviso, pruebaDeSesgo };
}
