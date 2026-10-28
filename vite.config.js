import { defineConfig } from 'vite';

// GitHub Pages serves the site from /ptsTattoo/ (build and `vite preview`); dev stays at /
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/ptsTattoo/' : '/',
}));
