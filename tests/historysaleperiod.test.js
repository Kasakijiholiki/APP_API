
const request = require('supertest')
const app = require('../server')

//...........GET test...........//
describe("GET /HistorySalePeriod", () => {

    //200
    test("Should return 200", async () => {
        const response = await request(app)
            .get("/api/HistorySalePeriod/get/1234567/1010")
        expect(response.statusCode).toBe(200);
    });


    //500
    test("Should return 500", async () => {
        const response = await request(app)
            .get("/api/HistorySalePeriod/get/12345617/1010")
        expect(response.statusCode).toBe(500);
    });
})