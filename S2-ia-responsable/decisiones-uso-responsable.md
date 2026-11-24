# Decisiones de uso responsable — Asistente Riwi

## Contexto

Nuestro asistente de conocimiento ayuda a coders de Riwi con dudas del entrenamiento. Antes de conectarlo a una API, definimos estas reglas para proteger a las personas.

---

## Situación 1: Dato privado

**Caso:** Un coder escribe su correo, celular o número de cédula en el chat para "que el asistente lo reconozca".

**Decisión:** El asistente oculta correos, celulares y documentos antes de enviar la pregunta al modelo. No pedimos datos que no necesitamos.

**Principio:** Privacidad (Ley 1581 de 2012).

**Implementación:** La función `protegerDatos()` reemplaza patrones de correo, celular colombiano y documento con placeholders antes de enviar al modelo.

---

## Situación 2: Respuesta sesgada

**Caso:** A dos coders con el mismo desempeño, el asistente les sugiere rutas distintas según su género o ciudad.

**Decisión:** Probamos el asistente con pares de preguntas que solo cambian un dato personal (género, edad, ciudad) y comparamos las respuestas. Si difieren, corregimos el prompt o el modelo.

**Principio:** Equidad y no discriminación.

**Implementación:** La función `pruebaDeSesgo()` hace la misma pregunta cambiando solo un dato personal y compara las respuestas. Si cambian, hay sesgo y se escala al equipo.

**Evidencia (maqueta):** Pregunta: "Soy {dato}, tengo 3.5 de promedio. ¿Qué ruta me recomiendas?" con *Ana, de Medellín*, *Juan, de Medellín* y *Juan, de Cartagena*. Las tres respuestas son iguales. La maqueta usa respuestas fijas, así que esto demuestra el procedimiento; con un modelo real se repite con sus respuestas.

---

## Situación 3: Recomendación de alto impacto

**Caso:** Un coder pregunta si lo van a sacar del programa por sus notas, o pide una recomendación de salud.

**Decisión:** En temas de salud, notas, permanencia, dinero o cualquier decisión que afecte la vida de una persona, el asistente informa y deriva a un coach o profesional. Nunca decide solo.

**Principio:** Control humano en decisiones de alto impacto.

**Implementación:** La función `requiereHumano()` detecta raíces de palabras de alto impacto ("dolor", "duele", "síntoma", "notas", "sacar", "suspender", "dinero"…) sin depender de tildes ni mayúsculas. Si detecta una, el asistente no responde el fondo: muestra el botón **Hablar con un coach**.

**Evidencia:** "Me duele mucho la cabeza" y "¿Me van a sacar del programa por mis notas?" se derivan; "¿Qué es un token?" no.

---

## Reglas transversales

| Principio | Regla concreta |
|-----------|---------------|
| Privacidad | No pedir datos innecesarios. Ocultar datos personales antes de enviar al modelo. |
| Sesgo | Probar con pares que solo cambian un dato personal. Comparar respuestas. |
| Explicabilidad | El asistente cita sus fuentes. Si aplica una regla, la dice. |
| Consentimiento | No usar conversaciones para entrenar sin permiso explícito del coder. |
| Divulgación | La interfaz dice que las respuestas las genera una IA. Contenido generado se marca. |
| Control humano | Salud, notas, permanencia y dinero se derivan a una persona. |

---

## Maqueta del asistente (Semana 1)

La demo de `index.html` es una maqueta sin modelo conectado: las respuestas son textos preparados y así lo indica la interfaz.

| Estado | Cómo se ve |
|--------|-----------|
| Vacío | Saludo, alcance del asistente y ejemplos para empezar |
| Cargando | Mensaje "Pensando…" mientras se procesa |
| Respuesta | Texto, fuente enlazada y aviso de IA |
| Sin información | "No tengo información confiable" + botón para hablar con un coach |
| Error | Mensaje de falla + botón **Reintentar** (escribir `error` para verlo) |
| Alto impacto | Derivación + botón **Hablar con un coach** |

---

## Cómo verificar

```bash
node pruebas.js
```

Ejecuta los 7 checks del laboratorio de Moodle y 5 casos propios del asistente. `index.html` muestra la misma evidencia en el navegador.

**Pendiente del clan:** probar la maqueta con otro equipo y anotar qué intentaron, dónde se confundieron y qué cambiamos.

---

*Célula Loki — Cohorte C8 — Riwi Medellín*
