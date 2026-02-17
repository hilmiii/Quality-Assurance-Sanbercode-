import loginPage from '../support/pages/LoginPage';
import data from '../fixtures/loginData.json';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('OrangeHRM Login Automation (POM Pattern)', () => {

    beforeEach(() => {
        loginPage.visit();
    });

    it('TC001 - Login Success (POM + Intercept)', () => {
        cy.intercept('POST', '**/auth/validate').as('loginReq');

        loginPage.inputUsername(data.validUser);
        loginPage.inputPassword(data.validPass);
        loginPage.clickLogin();

        cy.wait('@loginReq');
        cy.url().should('include', data.urls.dashboard);
        loginPage.verifyDashboard();
    });

    it('TC002 - Invalid Username (POM)', () => {
        cy.intercept('POST', '**/auth/validate').as('loginFail');

        loginPage.inputUsername(data.invalidUser);
        loginPage.inputPassword(data.validPass);
        loginPage.clickLogin();

        cy.wait('@loginFail');
        loginPage.verifyInvalidCredentials(data.messages.invalid);
    });

    it('TC003 - Invalid Password (POM)', () => {
        loginPage.inputUsername(data.validUser);
        loginPage.inputPassword(data.invalidPass);
        loginPage.clickLogin();

        loginPage.verifyInvalidCredentials(data.messages.invalid);
    });

    it('TC004 - Empty Fields (POM)', () => {
        loginPage.clickLogin();
        loginPage.verifyRequiredFields(data.messages.required);
    });

    it('TC005 - Forgot Password Navigation (POM)', () => {
        cy.intercept('GET', '**/requestPasswordResetCode').as('resetPage');
        
        loginPage.clickForgotPassword();
        
        cy.wait('@resetPage');
        loginPage.verifyResetPage(data.urls.resetPassword);
    });

    it('TC006 - Password Masking Check (POM)', () => {
        loginPage.inputPassword(data.validPass);
        loginPage.verifyPasswordMasked();
    });

    it('TC007 - LinkedIn Link Verification (POM)', () => {

        const linkedInSelector = 'a[href*="linkedin"]';
        loginPage.verifySocialLink(linkedInSelector, data.social.linkedin);
    });

});