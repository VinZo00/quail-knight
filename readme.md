# Quest of Quail Knight

> A small pixel art game built with Phaser 3 and modern frontend tooling.

![License](https://img.shields.io/badge/license-MIT-green)
![Phaser](https://img.shields.io/badge/Phaser-3-8B5CF6)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

![Game cover](materials/cover.jpg)

## About the Game

**Quest of Quail Knight** is a small **pixel art** game made purely for fun. It tells the adventures of **Vito**, a somewhat clumsy but determined knight, on his quest to **hunt quails**. The project began as a personal experiment to explore **Phaser 3** and modern front-end development techniques applied to game development. Simple, ironic, and deliberately retro, *Quest of Quail Knight* is a tribute to old arcade games — with a touch of humor and a lot of passion for pixel art.

<details>
<summary>🇮🇹 Leggi in italiano</summary>

<br>

**Quest of Quail Knight** è un piccolo gioco in **pixel art** realizzato per puro divertimento. Racconta le avventure di **Vito**, un cavaliere un po' goffo ma determinato, impegnato nella sua missione di **caccia alle quaglie**. Il progetto nasce come esperimento personale per esplorare **Phaser 3** e le moderne tecniche di sviluppo frontend applicate al game development. Semplice, ironico e volutamente rétro, *Quest of Quail Knight* è un tributo ai vecchi giochi arcade — con un tocco di umorismo e tanta passione per la pixel art.

</details>

---

## Credits

- **Development & Design:** [VinZo](https://github.com/VinZo00)
- **Website:** [vincenzociaccia.it](https://vincenzociaccia.it)

---

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm. For Windows users there is [nvm-windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and npm with nvm:

```bash
nvm install node
nvm use node
```

Replace `node` with `latest` for `nvm-windows`.

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/VinZo00/quest-of-quail-knight.git
cd quest-of-quail-knight
npm install
```

Start the development server:

```bash
npm run start
```

Create a production build:

```bash
npm run build
```

The compiled files will be placed in the `dist` folder, ready to be uploaded to a web server. 🎉

## Project Structure

```
.
├── dist
├── node_modules
├── public
├── src
│   ├── scenes/
│   ├── main.js
├── index.html
├── package.json
```

JavaScript source files live in the `src` folder. `main.js` is the entry point referenced by `index.html`. Scenes are organized inside `src/scenes`.

## Static Assets

Static assets like images and audio files go in the `public` folder and are served from the root.

```
public
├── images/
├── music/
├── sfx/
```

They can be loaded in Phaser with:

```js
this.load.image('my-image', 'images/my-image.png');
```

## Dev Server Port

The dev server port can be changed in `vite.config.js`:

```js
{
  server: { host: '0.0.0.0', port: 8000 },
}
```

---

## Acknowledgments

This project stands on the shoulders of open source giants:

- **[Phaser 3](https://phaser.io/)** — the HTML5 game framework that powers the gameplay. © Photon Storm Ltd., released under the [MIT License](https://github.com/phaserjs/phaser/blob/master/license.txt).
- **[phaser3-vite-template](https://github.com/ourcade/phaser3-vite-template)** by [ourcade](https://github.com/ourcade) — the project scaffolding and build setup were initially based on this template, released under the [MIT License](https://github.com/ourcade/phaser3-vite-template/blob/master/LICENSE).
- **[Vite](https://vitejs.dev/)** — the build tool and dev server.
- **[ESLint](https://eslint.org/)** — code linting.

Heartfelt thanks to all maintainers and contributors of these projects.

---

## License

This project is released under the [MIT License](./LICENSE). The game code is free to use, modify, and redistribute under the terms of that license.

> **Note on assets.** Original pixel art and creative assets in the `materials/` and `public/` folders are © Vincenzo Ciaccia. They are part of this project but not separately licensed for reuse without permission.
