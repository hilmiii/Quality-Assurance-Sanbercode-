Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('OrangeHRM Login Automation', () => {

  beforeEach(() => {
    cy.window().then(win => win.location.href = 'about:blank');
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('.orangehrm-login-branding', { timeout: 30000 }).should('be.visible');
  });

  // --- TC 1 ---
  it('TC001 - Login Valid (Intercept: API Validate)', () => {
    cy.intercept('POST', '**/auth/validate').as('loginReq');
    
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginReq');
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
  });

  // --- TC 2 ---
  it('TC002 - Login Username Salah (Intercept: Localization)', () => {
    cy.intercept('GET', '**/core/i18n/messages').as('i18n');

    cy.get('input[name="username"]').type('SalahUser');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // --- TC 3 ---
  it('TC003 - Login Password Salah (Intercept: Branding Image)', () => {
    cy.intercept('GET', '**/ohrm_branding.png').as('logoImg');
    cy.reload();
    cy.wait('@logoImg');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salahpass');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // --- TC 4 ---
  it('TC004 - Field Kosong (Intercept: JS File)', () => {
    cy.intercept('GET', '**/web/dist/js/app.js*').as('jsFile');
    cy.reload();
    cy.wait('@jsFile');
    cy.get('button[type="submit"]').click();   
    cy.get('.oxd-input-group__message').first().should('contain', 'Required');
  });

  // --- TC 5 ---
  it('TC005 - Forgot Password Link (Intercept: Page Navigation)', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('navReset');
    cy.contains('p', 'Forgot your password?').click();
    cy.wait('@navReset');
    cy.url().should('include', 'requestPasswordResetCode');
    cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
  });

  // --- TC 6 ---
  it('TC006 - Masking Password (Intercept: CSS)', () => {
    cy.intercept('GET', '**/web/dist/css/app.css*').as('appStyles');

    cy.reload();
    cy.wait('@appStyles');

    cy.get('input[name="password"]').type('admin123');
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  // --- TC 7 ---
  it('TC007 - LinkedIn Redirect (Intercept: SVG)', () => {
    cy.intercept('GET', '**/*.svg').as('svgIcons');   
    const linkedinSelector = 'a[href*="linkedin"]';
    cy.get(linkedinSelector).should('be.visible').and('have.attr', 'target', '_blank'); 
  });

});