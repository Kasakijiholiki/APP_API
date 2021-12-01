
const request = require('supertest')
const app = require('../server')


//...........Login test...........//
describe("POST /login", () => {

    //200
    test("Should login pass.", async () => {
        const response = await request(app)
            .post("/api/account/login/21818715/123")

        expect(response.statusCode).toBe(200);
    });
    //404
    test("device code Or password incorrect.", async () => {
        const response = await request(app)
            .post("/api/account/login/21818715/12300")
        expect(response.statusCode).toBe(404);
    });
})


//...........PasswordChange...........//
describe("POST /userpasswordchange", () => {

    //400
    test("Data empty.", async () => {
        const response = await request(app)
            .post(`/api/userpasswordchange/${21818715}/${12300}`)
        expect(response.statusCode).toBe(404);
    });
    //200
    test("Password Updated.", async () => {
        const response = await request(app)
            .post(`/api/account/userpasswordchange/21818715/123/123`)
        expect(response.statusCode).toBe(200);
    });
    //404
    test("password not change.", async () => {
        const response = await request(app)
            .post(`/api/userpasswordchange/${21818715}/${12300}/${123}`)
        expect(response.statusCode).toBe(404);
    });
})