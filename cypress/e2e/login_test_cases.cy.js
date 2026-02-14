describe('OrangeHRM Login Automation Based on Excel Test Cases', () => {
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('.orangehrm-login-branding').should('be.visible'); 
  });

  // TS001: Login Functionality 
  it('TC001 - Login dengan data valid (Success)', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
  });

  it('TC002 - Login dengan username salah (Invalid Username)', () => {
    cy.get('input[name="username"]').type('BukanUser');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('TC003 - Login dengan password salah (Invalid Password)', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('bukanpass');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('TC004 - Login dengan field kosong (Empty Fields)', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message').should('have.length', 2); 
    cy.get('.oxd-input-group__message').first().should('contain', 'Required');
    cy.get('.oxd-input-group__message').last().should('contain', 'Required');
  });

  // TS002: Forgot Password
  it('TC005 - Verifikasi link "Forgot your password?"', () => {
    // Action: Klik link "Forgot your password?"
    cy.contains('p', 'Forgot your password?').click();

    cy.url().should('include', 'requestPasswordResetCode');
    cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
  });

  // TS003: UI Validation 
  it('TC006 - Masking Password', () => {
    cy.get('input[name="password"]').type('admin123');

    cy.get('input[name="password"]')
      .should('have.attr', 'type', 'password');
  });

  // TS004: Social Media Links
  it('TC007 - Redirect ke LinkedIn OrangeHRM', () => {
    const linkedinSelector = 'a[href="https://www.linkedin.com/company/orangehrm/mycompany/"]';
    cy.get(linkedinSelector)
      .should('be.visible')
      .and('have.attr', 'target', '_blank'); 
  });

});