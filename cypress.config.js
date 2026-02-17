const { defineConfig } = require("cypress");

module.exports = defineConfig({
  pageLoadTimeout: 120000,        // 2 menit
  defaultCommandTimeout: 20000,   // 20 detik
  chromeWebSecurity: false,
  viewportWidth: 1280,
  viewportHeight: 720,
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'https://opensource-demo.orangehrmlive.com', 
  },
});