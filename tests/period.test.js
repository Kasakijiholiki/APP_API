
const request = require('supertest')
const app = require('../server')


//...........GET test...........//
describe("GET /period", () => {

    //200
    test("Should return a list of period.", async () => {
        const response = await request(app)
            .get("/api/period/get/21818674")
        expect(response.statusCode).toBe(200);
    });
    
    
    //404
    test("Should not return a list of period.", async () => {
        const response = await request(app)
            .get("/api/period/get/2181867400000")
        expect(response.statusCode).toBe(404);
    });
})
