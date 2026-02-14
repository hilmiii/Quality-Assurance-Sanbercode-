describe('OrangeHRM Login Automation Based on Excel Test Cases', () => {

  // Pre-condition: User mengakses halaman login sebelum setiap test case
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('.orangehrm-login-branding').should('be.visible'); // Memastikan halaman siap
  });

  // --- TS001: Login Functionality ---

  it('TC001 - Login dengan data valid (Success)', () => {
    // Data Test: Username Admin, Password admin123
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Expected Result: User berhasil login dan diarahkan ke halaman Dashboard
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
  });

  it('TC002 - Login dengan username salah (Invalid Username)', () => {
    // Data Test: Username BukanUser, Password admin123
    cy.get('input[name="username"]').type('BukanUser');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Expected Result: Login gagal. Muncul pesan error "Invalid credentials"
    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('TC003 - Login dengan password salah (Invalid Password)', () => {
    // Data Test: Username Admin, Password bukanpass
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('bukanpass');
    cy.get('button[type="submit"]').click();

    // Expected Result: Login gagal. Muncul pesan error "Invalid credentials"
    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('TC004 - Login dengan field kosong (Empty Fields)', () => {
    // Data Test: Kosongkan field
    cy.get('button[type="submit"]').click();

    // Expected Result: Muncul pesan error "Required" di bawah field Username dan Password
    cy.get('.oxd-input-group__message').should('have.length', 2); // Ada 2 pesan error
    cy.get('.oxd-input-group__message').first().should('contain', 'Required');
    cy.get('.oxd-input-group__message').last().should('contain', 'Required');
  });

  // --- TS002: Forgot Password ---

  it('TC005 - Verifikasi link "Forgot your password?"', () => {
    // Action: Klik link "Forgot your password?"
    cy.contains('p', 'Forgot your password?').click();

    // Expected Result: User diarahkan ke halaman Reset Password
    cy.url().should('include', 'requestPasswordResetCode');
    cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
  });

  // --- TS003: UI Validation ---

  it('TC006 - Masking Password', () => {
    // Action: Ketik karakter pada field Password
    cy.get('input[name="password"]').type('admin123');

    // Expected Result: Karakter password harus tersembunyi (type="password")
    cy.get('input[name="password"]')
      .should('have.attr', 'type', 'password');
  });

  // --- TS004: Social Media Links ---

  it('TC007 - Redirect ke LinkedIn OrangeHRM', () => {
    // Action: Klik ikon LinkedIn (Cypress mengecek atribut href untuk link eksternal)
    const linkedinSelector = 'a[href="https://www.linkedin.com/company/orangehrm/mycompany/"]';
    
    // Expected Result: Membuka halaman LinkedIn di tab baru (target="_blank")
    cy.get(linkedinSelector)
      .should('be.visible')
      .and('have.attr', 'target', '_blank'); 
      // Catatan: Cypress secara default tidak mendukung multi-tab, 
      // jadi validasi terbaik adalah mengecek atribut target="_blank".
  });

});