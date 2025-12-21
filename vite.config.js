import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['icon/favicon.ico', 'icon/apple-touch-icon.png', 'icon/mask-icon.svg'],
			manifest: {
				name: 'Quest of the Quail Knight',
				short_name: 'Quail Knight',
				description: 'Developed by VinZo',
				theme_color: '#313448',
				background_color: '#313448',
				display: 'fullscreen',
				orientation: 'landscape',
				icons: [
					{
						src: 'icon/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icon/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				// Cache degli asset di Phaser (sprites, audio, ecc.)
				globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,gif}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'cdn-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 anno
							}
						}
					},
					{
						urlPattern: /.*\.mp3$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'audio-cache',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 giorni
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			}
		})
	],
	server: { host: '0.0.0.0', port: 8001 },
	clearScreen: false,
})
