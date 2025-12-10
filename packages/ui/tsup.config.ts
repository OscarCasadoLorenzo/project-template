import { readFileSync, writeFileSync } from 'fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  splitting: false,
  onSuccess: async () => {
    const filePath = 'dist/index.js';
    const content = readFileSync(filePath, 'utf-8');
    writeFileSync(filePath, `"use client";\n${content}`);
  },
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
  },
});
