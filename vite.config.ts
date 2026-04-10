import preact from '@preact/preset-vite'
import {merge} from '@slimr/util'
import react from '@vitejs/plugin-react-swc'
import {resolve} from 'node:path'
import {defineConfig, UserConfigExport} from 'vite'

/** CLI basename (`vite`, `vitest`, `storybook`, …) used to pick plugin and alias sets. */
const invokation = process.argv[1].split('/').at(-1) // i.e. vite, vitest or storybook

// https://vitejs.dev/config/

/** Production J-Lite bundle: Preact, path aliases, and single-chunk output options. */
const prodConfig: UserConfigExport = {
  plugins: [
    /*
     * The react plugin works too, but HMR breaks and you loose some dev features.
     * Pro tip: you can use vanilla react and react dev tools if you swap the preact
     * plugin with react and disable the preact alias. Sometimes useful for debugging,
     * and React dev tools are little more feature rich.
     */
    preact(),
  ],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      '~': resolve(__dirname, 'src'),
    },
  },
  build: {
    // cssCodeSplit: false,
    modulePreload: {
      // Disable module preload bc it disrupts lazy loading, and the service worker
      // will download them in the background anyways.
      resolveDependencies: () => [],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Uncomment below to bundle as a single IIFE blob
        // format: 'iife', // Bundle as an IIFE (not a module)

        // name: 'J-Lite', // Global variable name for your bundle
        entryFileNames: 'main.js', // Always output as bundle.js
        assetFileNames: '[name][extname]', // Keep asset names clean

        // Comment out manualChunks for default code-splitting
        /**
         * Manual chunks is a key/val or function that returns an answer
         * of which bundle a module should be placed in for splitting.
         * Returning undefined will use the default strategy.
         *
         * @param {string} id - The module id aka the path to the module
         *
         * @returns {string | undefined} - The name of the chunk to place the module in or undefined to use default
         */
        manualChunks: () => {
          //   const fileNameNoExt = id.split('/').at(-1).split('.').slice(0, -1).join('.')
          //   if (id.includes('@slimr/mdi-paths') && !id.includes('component')) {
          //     return 'icons/' + fileNameNoExt
          //   }
          //   if (id.includes('highlight.js') && !id.includes('lazy')) {
          //     return 'highlightjs'
          //   }
          //   // if (id.includes('@slimr')) {
          //   //   return 'slimr'
          //   // }
          //   // if (id.includes('pages') && !id.includes('pages/index')) {
          //   //   return 'pages/' + fileNameNoExt
          //   // }
          //   if (id.includes('workbox')) {
          //     return 'workbox'
          //   }
          return 'main'
        },
      },
    },
  },
}

/** Storybook dev server: swaps React aliases and prepends the SWC React plugin. */
const storybookConfig: UserConfigExport = merge(prodConfig, {
  // storybook doesn't like preact plugin but is fine with alias.
  // But, let's undo alias anyways so HMR works.
  plugins: [react(), ...prodConfig.plugins.slice(1)],
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
    },
  },
})

console.log('invokation', invokation)

/** Vite setup: Preact aliases for the app, React plugin swap when Storybook runs. */
export default defineConfig(invokation === 'storybook' ? storybookConfig : prodConfig)
