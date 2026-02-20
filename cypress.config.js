const { defineConfig } = require("cypress");

module.exports = defineConfig({
  pageLoadTimeout: 180000,      
  defaultCommandTimeout: 180000, 
  requestTimeout: 180000,        
  responseTimeout: 180000,       
  
  chromeWebSecurity: false,
  viewportWidth: 1280,
  viewportHeight: 720,
  
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'https://opensource-demo.orangehrmlive.com', 
  },
});