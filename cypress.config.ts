import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Altere se o seu Next.js rodar em outra porta
    supportFile: 'cypress/support/e2e.ts',
  },
});
