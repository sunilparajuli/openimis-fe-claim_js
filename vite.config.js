import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path' 
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.jsx'),
      name: 'OpenIMISFeClaim',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'es' : 'cjs'}.js`
    },
   
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'redux',
        'redux-redux',
        'redux-api-middleware',
        'prop-types',
        'moment',
        'lodash',
        'lodash-uuid',
        'classnames',
        'clsx',
        'react-autosuggest',
        'react-router-dom',
        'history',
        '@material-ui/core',
        '@material-ui/icons',
        '@material-ui/lab',
        '@material-ui/pickers',
        '@date-io/core',
        '@date-io/moment',
        '@openimis/fe-core',
        /^@babel-.*/, 
        /^@openimis.*/
      ],
      output: { 
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})