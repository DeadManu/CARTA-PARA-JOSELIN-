# Carta web con sobre, música, fuego, tulipán y máquina de escribir

Este proyecto está listo para subirlo a GitHub y publicarlo con Vercel.

## Incluye

- Foto integrada en un marco elegante.
- Música de fondo generada desde la página.
- Botón para activar o pausar música.
- Sobre animado que se abre.
- Carta con efecto de máquina de escribir.
- Botón para mostrar la carta completa.
- Contador con efecto de fuego.
- Cuando el contador llega a cero, el fuego se apaga.
- Tulipán con pétalos que se desprenden.
- Diseño adaptable para teléfono.

## Archivos

- `index.html`
- `css/styles.css`
- `js/script.js`
- `assets/favicon.svg`
- `assets/foto-joselin.png`
- `README.md`
- `vercel.json`
- `package.json`

## Cómo abrir la página

1. Descomprime el ZIP.
2. Abre `index.html` con doble clic.

## Cómo subirlo a GitHub

1. Crea un repositorio.
2. Sube todos los archivos.
3. Asegúrate de que `index.html` quede en la raíz del repositorio.

## Cómo publicarlo en Vercel

1. Entra a Vercel.
2. Importa tu repositorio de GitHub.
3. Déjalo como proyecto estático.
4. Publica.
5. Vercel te dará un enlace para compartir en teléfono.

## Música

La música no usa archivos externos. Se genera con código usando Web Audio API.
Por seguridad, los navegadores no permiten música automática sin tocar la pantalla.
Por eso se activa con el botón `♪ Música`.

## Fecha final del contador

El contador usa una fecha fija para que todos vean el mismo tiempo.

Fecha configurada:

`2027-06-11T04:44:56Z`

Para cambiarla, abre `index.html` y busca:

```html
data-end="2027-06-11T04:44:56Z"
```

Cámbiala por una fecha en este formato:

```text
2027-06-17T23:59:59Z
```
