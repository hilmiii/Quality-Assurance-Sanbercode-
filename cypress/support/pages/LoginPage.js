class LoginPage {
    elements = {
        username: () => cy.get('input[name="username"]'),
        password: () => cy.get('input[name="password"]'),
        loginBtn: () => cy.get('button[type="submit"]'),
        errorMsg: () => cy.get('.oxd-alert-content-text'),
        requiredMsg: () => cy.get('.oxd-input-group__message'),
        forgotPassLnk: () => cy.contains('.orangehrm-login-forgot-header', 'Forgot your password?')
    }

    visit() {
        cy.window().then(win => win.location.href = 'about:blank');
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { failOnStatusCode: false });
        cy.get('.orangehrm-login-branding', { timeout: 30000 }).should('be.visible');
    }

    login(user, pass) {
        if (user) this.elements.username().type(user);
        if (pass) this.elements.password().type(pass);
        this.elements.loginBtn().click();
    }

    clickForgotPassword() {
        this.elements.forgotPassLnk().click();
    }
}
export default new LoginPage();