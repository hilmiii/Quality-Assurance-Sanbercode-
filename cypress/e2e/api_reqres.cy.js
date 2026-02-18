describe('Reqres.in API Automation with API Key & Rate Limit Handling', () => {
    const apiKey = 'reqres_4b4c146a51154d20b6cb012789343d27';
    const headers = {
        'x-api-key': apiKey, // API Key Wajib
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', // Bypass Cloudflare
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    afterEach(() => {
        cy.wait(1000); 
    });

    // 1. GET - List Users
    it('1. GET - List Users (Page 2)', () => {
        cy.request({
            method: 'GET',
            url: '/api/users?page=2',
            headers: headers
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('page', 2);
            expect(response.body.data).to.be.an('array');
        });
    });

    // 2. GET - Single User
    it('2. GET - Single User (ID 2)', () => {
        cy.request({
            method: 'GET',
            url: '/api/users/2',
            headers: headers
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.id).to.eq(2);
            expect(response.body.data.first_name).to.exist;
        });
    });

    // 3. GET - User Not Found (Negative Test)
    it('3. GET - User Not Found', () => {
        cy.request({
            method: 'GET',
            url: '/api/users/23',
            headers: headers,
            failOnStatusCode: false 
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.deep.equal({});
        });
    });

    // 4. POST - Create User
    it('4. POST - Create New User', () => {
        const payload = { name: "Rizky", job: "QA Automation" };
        
        cy.request({
            method: 'POST',
            url: '/api/users',
            body: payload,
            headers: headers
        }).then((response) => {
            expect(response.status).to.eq(201); 
            expect(response.body.name).to.eq("Rizky");
            expect(response.body).to.have.property('createdAt');
        });
    });

    // 5. POST - Register (Success)
    it('5. POST - Register Successful', () => {
        const payload = { 
            email: "eve.holt@reqres.in", 
            password: "securepassword" 
        };

        cy.request({
            method: 'POST',
            url: '/api/register',
            body: payload,
            headers: headers
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            expect(response.body).to.have.property('id');
        });
    });

    // 6. PUT - Update User
    it('6. PUT - Update User Data', () => {
        const payload = { name: "Rizky Updated", job: "Senior QA" };

        cy.request({
            method: 'PUT',
            url: '/api/users/2',
            body: payload,
            headers: headers
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.job).to.eq("Senior QA");
            expect(response.body).to.have.property('updatedAt');
        });
    });

    // 7. DELETE - Delete User
    it('7. DELETE - Remove User', () => {
        cy.request({
            method: 'DELETE',
            url: '/api/users/2',
            headers: headers
        }).then((response) => {
            expect(response.status).to.eq(204); 
        });
    });

    // 8. POST - Login Successful
    it('8. POST - Login Successful', () => {
        const loginData = {
            email: "eve.holt@reqres.in",
            password: "cityslicka"
        };

        cy.request({
            method: 'POST',
            url: '/api/login',
            body: loginData,
            headers: headers
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token'); 
        });
    });

    // 9. POST - Login Unsuccessful (Negative Test)
    it('9. POST - Login Unsuccessful (Missing Password)', () => {
        const loginData = {
            email: "peter@klaven" 
        };

        cy.request({
            method: 'POST',
            url: '/api/login',
            body: loginData,
            headers: headers,
            failOnStatusCode: false 
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('error', 'Missing password');
        });
    });

    // 10. GET - List Resources (Unknown)
    it('10. GET - List Resource (Colors)', () => {
        cy.request({
            method: 'GET',
            url: '/api/unknown',
            headers: headers
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.be.an('array');
            expect(response.body.data[0]).to.have.property('color');
            expect(response.body.data[0]).to.have.property('pantone_value');
        });
    });
});