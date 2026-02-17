class LoginPage {
    // --- LOCATORS (Selectors) ---
    elements = {
        usernameInput: () => cy.get('input[name="username"]'),
        passwordInput: () => cy.get('input[name="password"]'),
        loginBtn: () => cy.get('button[type="submit"]'),
        alertBanner: () => cy.get('.oxd-alert-content-text'),
        inputErrorMsg: () => cy.get('.oxd-input-group__message'),
        forgotPassLink: () => cy.contains('.orangehrm-login-forgot-header', 'Forgot your password?'),
        resetTitle: () => cy.get('.orangehrm-forgot-password-title'),
        breadcrumb: () => cy.get('.oxd-topbar-header-breadcrumb'),
        linkedinLink: () => cy.get('a[href*="linkedin"]')
    }

    // --- ACTIONS (Methods) ---
    
    visit() {
        cy.visit('/web/index.php/auth/login', { failOnStatusCode: false });
        cy.get('.orangehrm-login-branding', { timeout: 30000 }).should('be.visible');
    }

    inputUsername(username) {
        this.elements.usernameInput().type(username);
    }

    inputPassword(password) {
        this.elements.passwordInput().type(password);
    }

    clickLogin() {
        this.elements.loginBtn().click();
    }

    clickForgotPassword() {
        this.elements.forgotPassLink().click();
    }

    // --- ASSERTIONS (Validation) ---

    verifyDashboard() {
        this.elements.breadcrumb().should('contain', 'Dashboard');
    }

    verifyInvalidCredentials(message) {
        this.elements.alertBanner().should('be.visible').and('contain', message);
    }

    verifyRequiredFields(message) {
        this.elements.inputErrorMsg().should('have.length', 2);
        this.elements.inputErrorMsg().first().should('contain', message);
    }

    verifyPasswordMasked() {
        this.elements.passwordInput().should('have.attr', 'type', 'password');
    }

    verifyResetPage(partialUrl) {
        cy.url().should('include', partialUrl);
        this.elements.resetTitle().should('contain', 'Reset Password');
    }

    verifySocialLink(selector, url) {
        cy.get(selector).should('have.attr', 'href', url).and('have.attr', 'target', '_blank');
    }
}

export default new LoginPage();