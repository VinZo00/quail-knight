# TODO Phaser Game

## Fase 0 · Setup progetto
- [x] Crea struttura cartelle
  - `/public/assets/{maps,tilesets,sprites,ui,audio}`
  - `/src/{scenes,systems,entities}`
- [x] Installa dipendenze
  - `npm i phaser`
  - opzionale: `npm i phaser3-rex-plugins`
- [x] Configura Vite (accesso da mobile)
  - `vite.config.js → server: { host: true, port: 5173 }`
- [x] `index.html` minimale con canvas e `<script type="module" src="/src/main.js">`
- [x] `main.js` con config Phaser (Scale.FIT, pixelArt, Arcade), scene registrate
- [x] ✅ Done when: `npm run dev` avvia e vedi una scena vuota

## Fase 1 · Asset & Tilemap
- [ ] Scegli risoluzione (tile 16×16 o 32×32; zoom camera coerente)
- [ ] Tileset città (strade, erba, case) → `public/assets/tilesets/city.png`
- [ ] Mappa in Tiled (layer: ground, walls) → `public/assets/maps/city.json`
- [ ] Imposta collisioni in Tiled: proprietà tile `collides=true` per muri/case
- [ ] Sprite: `player.png` (4 direzioni), `quail.png`, `quail_big.png`, `npc.png`
- [ ] UI & audio: `ui/heart.png`, `audio/pet.wav`, `audio/hit.wav`
- [ ] ✅ Done when: la mappa si carica, i layer appaiono in gioco

## Fase 2 · Scene & Flow
- [ ] `BootScene` (passa a Preload)
- [ ] `PreloadScene` (carica tutte le risorse + crea animazioni player)
- [ ] `MenuScene` (Inizia + Ringraziamenti + ENTER/Pointer)
- [ ] `GameScene` (core gameplay)
- [ ] `UIScene` (overlay cuori vite, no scroll)
- [ ] ✅ Done when: dal Menu entri in Game e si avvia anche UI

## Fase 3 · Mappa, camera, collisioni
- [ ] Crea tilemap in `GameScene` (city-map + tileset)
- [ ] Layer & collisioni: `walls.setCollisionByProperty({ collides:true })`
- [ ] Player: physics sprite con hitbox ridotta (`setSize/setOffset`)
- [ ] Camera “stile Pokémon”: `startFollow(player)` + `setZoom()` + `setRoundPixels(true)`
- [ ] ✅ Done when: il player non attraversa muri/case e la camera lo segue fluida

## Fase 4 · Input (desktop + mobile)
- [ ] Crea `systems/InputManager.js`
- [ ] Desktop: frecce/WASD + tasto Q per “accarezza”
- [ ] Mobile: rex virtual joystick + bottone rotondo “pet” (overlay UI)
- [ ] Rilevamento device e visibilità condizionale dei controlli
- [ ] Movimento: velocità costante, animazioni 4 direzioni
- [ ] ✅ Done when: su desktop muovi con tastiera e su mobile con joystick, Q/bottone invia evento “pet”

## Fase 5 · Entità (quaglie, quaglie giganti, NPC)
- [ ] Gruppi: `quails`, `bigQuails`, `npcs`
- [ ] Spawn base (qualche quaglia normale, 1–2 giganti, 1–2 NPC)
- [ ] Collider: entità vs walls; NPC immovable
- [ ] AI minima: jitter/idle semplice per quaglie
- [ ] ✅ Done when: entità si muovono leggermente, non attraversano muri

## Fase 6 · Interazioni (accarezzare & danno)
- [ ] Overlap player ↔ quaglie normali: abilita `canPet` quando vicino
- [ ] Azione “accarezza” (`tryPet()`): solo se `canPet true`, feedback (suono, flash)
- [ ] Quaglie giganti: al contatto infliggono danno + leggera spinta + cooldown
- [ ] ✅ Done when: puoi accarezzare solo quaglie normali; le giganti fanno perdere vita

## Fase 7 · Vite & Game Over
- [ ] Sistema vite: 3 cuori in `UIScene`; evento `update-lives`
- [ ] Hit: decremento vite + suono + tint breve
- [ ] Game Over: a 0 vite, stop UI e ritorno al Menu dopo breve delay
- [ ] ✅ Done when: i cuori scalano correttamente e la game over riporta al Menu

## Fase 8 · Responsive & qualità vita
- [ ] Scala & zoom: verifica leggibilità su smartphone (regola `setZoom` se serve)
- [ ] Resize handler: riposiziona joystick/bottone su `scale.on('resize')`
- [ ] Frame pacing: no debug Arcade in produzione, limita update non necessari
- [ ] ✅ Done when: su telefono tutto è cliccabile/leggibile e i controlli restano ancorati

## Fase 9 · Audio & polishing
- [ ] Volumi di pet e hit, no clipping
- [ ] BGM (opzionale) con loop e stop sul game over
- [ ] Micro feedback: tint, popup “+affetto” (opzionale), piccoli effetti particellari
- [ ] ✅ Done when: l’azione “pet” è gratificante e il danno è chiaro

## Fase 10 · Build & test
- [ ] `npm run build` e `npm run preview` per test della build
- [ ] Test su mobile reale (IP locale)
- [ ] Verifica asset paths (tutto carica dalla build)
- [ ] ✅ Done when: la build gira identica al dev server su desktop e mobile

## Extra (opzionali, dopo la demo)
- [ ] Dialoghi NPC (box testo, avanti/indietro)
- [ ] Pathfinding base (`easystar.js`) per NPC/quaglie giganti
- [ ] Zone trigger (entrata casa, cartelli, eventi)
- [ ] Salvataggio (localStorage: posizione, vite, quaglie accarezzate)
- [ ] Più mappe (porte/warp a nuove aree)
- [ ] Gamepad support (API nativa Phaser)
- [ ] Asset definitivi (tileset coerente, palette, font pixel)

## Definition of Done (per la tua “prima versione giocabile”)
- [ ] Menu con “Inizia” e “Ringraziamenti” funzionanti
- [ ] Città piccola con collisioni corrette
- [ ] Player con movimento 4 direzioni + camera follow
- [ ] Input desktop (WASD/frecce + Q) e mobile (joystick + bottone pet)
- [ ] Quaglie normali accarezzabili; quaglie giganti pericolose
- [ ] 3 vite visibili, danno e game over → ritorno al menu
- [ ] Build Vite funzionante su desktop e telefono reale
