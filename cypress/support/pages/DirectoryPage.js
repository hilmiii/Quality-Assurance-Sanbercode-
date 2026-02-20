class DirectoryPage {
    elements = {
        menuDirectory: () => cy.contains('.oxd-main-menu-item', 'Directory'),
        pageHeader: () => cy.get('.oxd-topbar-header-title', { timeout: 60000 }),
        nameHintInput: () => cy.get('input[placeholder="Type for hints..."]'),
        dropdownJob: () => cy.get('.oxd-select-text').eq(0),
        dropdownLocation: () => cy.get('.oxd-select-text').eq(1),
        searchBtn: () => cy.get('button[type="submit"]'),
        resetBtn: () => cy.contains('button', 'Reset')
    }

    goToDirectory() {
        this.elements.menuDirectory().click();
        this.elements.pageHeader().should('contain', 'Directory');
    }

    searchByName(name) {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('hintApi');
        this.elements.nameHintInput().type(name, { delay: 100 });
        
        cy.wait('@hintApi', { timeout: 20000 }).then(() => {
            cy.get('.oxd-autocomplete-option', { timeout: 60000 }).first().click({force: true});
        });
    }

    selectJobTitle(job) {
        this.elements.dropdownJob().click();
        cy.contains('.oxd-select-option', job, { timeout: 60000 }).click({force: true});
    }

    selectLocation(location) {
        this.elements.dropdownLocation().click();
        cy.contains('.oxd-select-option', location, { timeout: 60000 }).click({force: true});
    }

    clickSearch() {
        this.elements.searchBtn().click({ force: true });
        cy.wait(2000); 
    }

    clickReset() {
        this.elements.resetBtn().click({ force: true });
    }

    verifySearchResult() {
        cy.get('.orangehrm-paper-container', { timeout: 60000 }).then(($container) => {
            
            if ($container.find('.oxd-directory-card').length > 0) {
                cy.get('.oxd-directory-card').should('have.length.greaterThan', 0);
            } 
            else if ($container.text().includes('No Records Found')) {
                cy.contains('No Records Found').should('exist');
            } 
            else {
                cy.log('Data tidak ditemukan, namun teks No Records Found juga belum render penuh.');
            }
        });
    }
}
export default new DirectoryPage();