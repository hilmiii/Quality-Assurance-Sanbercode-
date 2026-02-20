import loginPage from '../support/pages/LoginPage';
import forgotPage from '../support/pages/ForgotPage';
import directoryPage from '../support/pages/DirectoryPage';
import data from '../fixtures/orangeData.json';

Cypress.on('uncaught:exception', () => false);

describe('OrangeHRM Automation Suite (POM & Intercepts)', () => {

    // =========================================================
    // FEATURE 1: LOGIN FUNCTIONALITY
    // =========================================================
    describe('Login Feature', () => {
        beforeEach(() => {
            loginPage.visit();
        });

        it('TC01 - Should login successfully with valid credentials', () => {
            cy.intercept('POST', '**/auth/validate').as('apiLogin');
            loginPage.login(data.validUser, data.validPass);
            cy.wait('@apiLogin').its('response.statusCode').should('be.oneOf', [200, 302, 304]);
            cy.url().should('include', '/dashboard');
        });

        it('TC02 - Should fail login with invalid username', () => {
            loginPage.login(data.invalidUser, data.validPass);
            loginPage.elements.errorMsg().should('contain', 'Invalid credentials');
        });

        it('TC03 - Should fail login with invalid password', () => {
            loginPage.login(data.validUser, data.invalidPass);
            loginPage.elements.errorMsg().should('contain', 'Invalid credentials');
        });

        it('TC04 - Should show required message when username is empty', () => {
            loginPage.login(null, data.validPass);
            loginPage.elements.requiredMsg().should('contain', 'Required');
        });

        it('TC05 - Should show required message when password is empty', () => {
            loginPage.login(data.validUser, null);
            loginPage.elements.requiredMsg().should('contain', 'Required');
        });

        it('TC06 - Should show required messages when both fields are empty', () => {
            loginPage.elements.loginBtn().click();
            loginPage.elements.requiredMsg().should('have.length', 2);
        });
    });

    // =========================================================
    // FEATURE 2: FORGOT PASSWORD FUNCTIONALITY
    // =========================================================
    describe('Forgot Password Feature', () => {
        beforeEach(() => {
            loginPage.visit();
            cy.intercept('GET', '**/auth/requestPasswordResetCode').as('loadForgotPage');
            loginPage.clickForgotPassword();
            cy.wait('@loadForgotPage');
        });

        it('TC07 - Should display the forgot password UI correctly', () => {
            forgotPage.verifyPage();
        });

        it('TC08 - Should navigate back to login page when cancel is clicked', () => {
            forgotPage.clickCancel();
            cy.url().should('include', '/auth/login');
        });

        it('TC09 - Should show required message when submitting empty username', () => {
            forgotPage.clickReset();
            forgotPage.elements.requiredMsg().should('contain', 'Required');
        });

        it('TC10 - Should successfully request password reset with valid username', () => {
            cy.intercept('POST', '**/auth/requestPasswordResetCode', (req) => {
                req.reply({
                    statusCode: 200,
                    body: '<html><body><h6 class="orangehrm-forgot-password-title">Reset Password link sent successfully</h6></body></html>'
                });
            }).as('mockReset');
            
            forgotPage.inputUsername(data.validUser);
            forgotPage.clickReset();
        
            cy.get('.orangehrm-forgot-password-title', { timeout: 10000 })
              .should('contain', 'Reset Password link sent successfully');
        });
    });

    // =========================================================
    // FEATURE 3: DIRECTORY SEARCH & FILTER
    // =========================================================
    describe('Dashboard - Directory Feature', () => {
        beforeEach(() => {
            loginPage.visit();
            loginPage.login(data.validUser, data.validPass);
            
            cy.intercept('GET', '**/api/v2/directory/employees**').as('apiDirectoryLoad');
            directoryPage.goToDirectory();
            cy.wait('@apiDirectoryLoad', { timeout: 20000 });
        });

        it('TC11 - Should search employee by exact Name', () => {
            directoryPage.searchByName(data.search.empName);
            
            cy.intercept('GET', '**/directory/employees?*').as('apiSearch');
            directoryPage.clickSearch();
            
            cy.wait('@apiSearch', { timeout: 20000 });
            directoryPage.verifySearchResult();
        });

        it('TC12 - Should filter employees by Job Title', () => {
            directoryPage.selectJobTitle(data.search.jobTitle);
            
            cy.intercept('GET', '**/directory/employees?*').as('apiSearch');
            directoryPage.clickSearch();
            
            cy.wait('@apiSearch', { timeout: 20000 });
            directoryPage.verifySearchResult();
        });

        it('TC13 - Should filter employees by Location', () => {
            directoryPage.selectLocation(data.search.location);
            
            cy.intercept('GET', '**/directory/employees?*').as('apiSearch');
            directoryPage.clickSearch();
            
            cy.wait('@apiSearch', { timeout: 20000 });
            directoryPage.verifySearchResult();
        });

        it('TC14 - Should filter employees by multiple criteria (Job & Location)', () => {
            directoryPage.selectJobTitle(data.search.jobTitle);
            directoryPage.selectLocation(data.search.location);
            
            cy.intercept('GET', '**/directory/employees?*').as('apiSearch');
            directoryPage.clickSearch();
            
            cy.wait('@apiSearch', { timeout: 20000 });
            directoryPage.verifySearchResult();
        });

        it('TC15 - Should reset search filters to default state', () => {
            directoryPage.selectJobTitle(data.search.jobTitle);
            directoryPage.clickReset();
            directoryPage.elements.dropdownJob().should('contain', '-- Select --');
        });
    });
});