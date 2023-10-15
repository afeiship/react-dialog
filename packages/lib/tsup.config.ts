import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,

  // react
  minify: true,
  sourcemap: true,
  splitting: true,
  target: 'es2016',
  bundle: true,
  external: ['react', 'react-dom'],
});
