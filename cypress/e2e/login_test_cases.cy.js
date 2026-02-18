Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('OrangeHRM Login Automation (Refactored)', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/*.css').as('cssReq');
    cy.intercept('GET', '**/*.js').as('jsReq');
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
      timeout: 120000,
      failOnStatusCode: false
    });

    cy.get('.orangehrm-login-branding', { timeout: 30000 }).should('be.visible');
  });

  // --- TC 1: Login Valid (API Call - Dynamic) ---
  it('TC001 - Login Valid (Intercept: API Validate)', () => {
    cy.intercept('POST', '**/auth/validate').as('loginReq');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginReq', { timeout: 20000 }).its('response.statusCode').should('be.oneOf', [200, 302]);
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
  });

  // --- TC 2: Invalid Username (Localization - Semi Dynamic) ---
  it('TC002 - Login Username Salah (Intercept: Localization Messages)', () => {
    cy.intercept('GET', '**/core/i18n/messages').as('i18n');
    cy.get('input[name="username"]').type('SalahUser');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // --- TC 3: Invalid Password (Static Image - Cached) ---
  it('TC003 - Login Password Salah (Intercept: Branding Image)', () => {
    cy.intercept('GET', '**/ohrm_branding.png').as('logoImg');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salahpass');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // --- TC 4: Empty Fields (Static JS - Cached) ---
  it('TC004 - Field Kosong (Intercept: JS File)', () => {
    cy.intercept('GET', '**/web/dist/js/app.js*').as('jsFile');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message').first().should('contain', 'Required');
  });

  // --- TC 5: Forgot Password (Page Navigation - Dynamic) ---
  it('TC005 - Forgot Password Link (Intercept: Page Navigation)', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('navReset');
    cy.contains('p', 'Forgot your password?').click();
    cy.wait('@navReset', { timeout: 20000 });
    cy.url().should('include', 'requestPasswordResetCode');
    cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
  });

  // --- TC 6: Masking Password (Static CSS - Cached) ---
  it('TC006 - Masking Password (Intercept: CSS)', () => {
    cy.intercept('GET', '**/web/dist/css/app.css*').as('appStyles');
    cy.get('input[name="password"]').type('admin123');
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  // --- TC 7: External Link (Static SVG - Cached) ---
  it('TC007 - LinkedIn Redirect (Intercept: SVG)', () => {
    cy.intercept('GET', '**/*.svg').as('svgIcons');
    cy.get('a[href*="linkedin"]')
      .should('be.visible')
      .and('have.attr', 'target', '_blank'); 
  });
});