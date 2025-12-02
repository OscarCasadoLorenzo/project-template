import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  treeshake: true,
  splitting: true,
  external: [
    'react',
    'react-dom',
    'next',
    'next/navigation',
    '@radix-ui/*',
    'class-variance-authority',
    'lucide-react',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
  },
});
