import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

export default defineConfig({
  plugins: [uni()],
  base: '/zuopinguanlixitongXCX/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss"; @import "@/assets/styles/mixins.scss";`
      }
    }
  },
  define: {
    'process.env.UNI_STAT_ENABLED': JSON.stringify('false')
  }
})