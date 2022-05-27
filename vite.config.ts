import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSvgIcons from 'vite-plugin-svg-icons'
import ViteComponents, { NaiveUiResolver } from 'vite-plugin-components'
import path from 'path'
import dotenv from 'dotenv'

export default defineConfig(({ mode }) => {
  console.log('mode', mode)

  const dotenvConfig = dotenv.config({ path: `./.env.${mode}` })
  const dotenvObj = dotenvConfig.parsed
  return {
    base: dotenvObj.BUILD_PATH,
    plugins: [
      vue(),
      viteSvgIcons({
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      ViteComponents({
        customComponentResolvers: [NaiveUiResolver()],
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: path.resolve(process.cwd(), 'src') + '/',
        },
      ],
    },
    server: {
      port: 4900,
      open: true,
    },
    optimizeDeps: {
      include: [],
      exclude: ['vue-demi'],
    },
    build: {
      outDir: dotenvObj.BUILD_OUT_DIR || 'dist',
    },
  }
})
