import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'commonjs'
    },
    {
      file: 'dist/index.mjs',
      format: 'esm'
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      include: './src/**/*.ts'
    }),
    del({
      verbose: true,
      targets: 'dist/*'
    })
  ]
})
