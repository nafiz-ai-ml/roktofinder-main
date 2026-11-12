import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: process.env.VERCEL ? "vercel" : process.env.NITRO_PRESET,
  },
});
