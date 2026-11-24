// Pruebas de las reglas de IA responsable.
// Ejecutar con: node pruebas.js
// Incluye los checks oficiales del laboratorio de Moodle y los casos propios del asistente.

const assert = require("node:assert/strict");
const {
  protegerDatos,
  requiereHumano,
  aviso,
  pruebaDeSesgo,
} = require("./script.js");

const casos = [];
const prueba = (nombre, fn) => casos.push({ nombre, fn });

// --- Checks oficiales del laboratorio (Moodle, Semana 2) ---

prueba("Oculta un correo", () => {
  assert.equal(protegerDatos("Escríbeme a ana@riwi.io"), "Escríbeme a [correo]");
});

prueba("Oculta un celular colombiano", () => {
  assert.equal(protegerDatos("Mi celular es 3001234567"), "Mi celular es [celular]");
});

prueba("Oculta documento y correo en el mismo texto", () => {
  assert.equal(
    protegerDatos("Mi cédula es 1020304050 y mi correo ana.r@gmail.com"),
    "Mi cédula es [documento] y mi correo [correo]"
  );
});

prueba("No toca los números cortos de una frase normal", () => {
  assert.equal(
    protegerDatos("La sesión es el martes 20 a las 2"),
    "La sesión es el martes 20 a las 2"
  );
});

prueba("Detecta los temas de alto impacto", () => {
  assert.deepEqual(
    [
      "Tengo dolor de pecho, ¿qué tomo?",
      "¿Me van a sacar del programa por mis notas?",
      "¿Qué es un token?",
    ].map(requiereHumano),
    [true, true, false]
  );
});

prueba("El aviso cuenta y nombra las fuentes", () => {
  assert.equal(
    aviso(["reglamento.pdf", "calendario.pdf"]),
    "Respuesta generada con IA a partir de 2 fuentes: reglamento.pdf, calendario.pdf. Verifica los datos importantes."
  );
});

prueba("Sin fuentes, el aviso advierte", () => {
  assert.equal(
    aviso([]),
    "Respuesta generada con IA sin fuentes: no la uses para decisiones importantes."
  );
});

// --- Casos propios del asistente ---

prueba("Deriva a una persona cuando el coder dice que algo le duele", () => {
  assert.equal(requiereHumano("Me duele mucho la cabeza"), true);
});

prueba("Deriva aunque la pregunta venga sin tildes o en mayúsculas", () => {
  assert.equal(requiereHumano("TENGO UN SINTOMA RARO"), true);
  assert.equal(requiereHumano("¿Me pueden suspender del programa?"), true);
});

prueba("No deriva las dudas técnicas del entrenamiento", () => {
  assert.equal(requiereHumano("¿Qué es una variable en JavaScript?"), false);
  assert.equal(requiereHumano("¿Cómo funciona un constructor?"), false);
});

prueba("La prueba de sesgo marca igualdad cuando las respuestas no cambian", () => {
  const responder = () => "Te recomiendo reforzar arreglos y objetos.";
  const resultado = pruebaDeSesgo(
    "Soy {dato}, tengo 3.5 de promedio. ¿Qué ruta me recomiendas?",
    ["Ana, de Medellín", "Juan, de Medellín"],
    responder
  );
  assert.equal(resultado.sinSesgo, true);
  assert.deepEqual(
    resultado.preguntas,
    [
      "Soy Ana, de Medellín, tengo 3.5 de promedio. ¿Qué ruta me recomiendas?",
      "Soy Juan, de Medellín, tengo 3.5 de promedio. ¿Qué ruta me recomiendas?",
    ]
  );
});

prueba("La prueba de sesgo detecta respuestas distintas para el mismo desempeño", () => {
  const responder = (pregunta) =>
    pregunta.includes("Ana") ? "Te recomiendo diseño." : "Te recomiendo backend.";
  const resultado = pruebaDeSesgo(
    "Soy {dato}, tengo 3.5 de promedio. ¿Qué ruta me recomiendas?",
    ["Ana", "Juan"],
    responder
  );
  assert.equal(resultado.sinSesgo, false);
  assert.deepEqual(resultado.respuestas, ["Te recomiendo diseño.", "Te recomiendo backend."]);
});

// --- Ejecución ---

let fallidas = 0;
for (const { nombre, fn } of casos) {
  try {
    fn();
    console.log(`PASS  ${nombre}`);
  } catch (error) {
    fallidas++;
    console.log(`FAIL  ${nombre}\n      ${error.message.split("\n")[0]}`);
  }
}
console.log(`\n${casos.length - fallidas}/${casos.length} pruebas pasaron`);
process.exitCode = fallidas === 0 ? 0 : 1;
