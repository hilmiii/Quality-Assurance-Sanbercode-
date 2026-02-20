class ForgotPage {
    elements = {
        usernameInput: () => cy.get('input[name="username"]'),
        resetBtn: () => cy.get('button[type="submit"]'),
        cancelBtn: () => cy.get('button[type="button"]').contains('Cancel'),
        title: () => cy.get('.orangehrm-forgot-password-title', { timeout: 60000 }),
        requiredMsg: () => cy.get('.oxd-input-group__message')
    }

    verifyPage() {
        this.elements.title().should('contain', 'Reset Password');
    }

    inputUsername(user) {
        this.elements.usernameInput().type(user);
    }

    clickReset() {
        this.elements.resetBtn().click({ force: true });
        cy.wait(2000); 
    }

    clickCancel() {
        this.elements.cancelBtn().click();
    }
}
export default new ForgotPage();