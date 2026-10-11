import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
const repo=process.env.GITHUB_REPOSITORY?.split('/')[1]||'itz-fizz';
export default defineConfig({plugins:[react(),tailwindcss()],base:process.env.GITHUB_ACTIONS?`/${repo}/`:'/'})
