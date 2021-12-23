
const request = require('supertest')
const app = require('../server')


//...........GET test...........//
describe("GET /dashboard", () => {

    //200
    test("Should return 200", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/1234567/1010")
        expect(response.statusCode).toBe(200);
    });




    //404
    test("Should return  404", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/billdetaillistbydigit/2181867/400000/2")
        expect(response.statusCode).toBe(404);
    });

    //200
    test("Should return  200", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/billdetaillistbydigit/1234567/1010/3")
        expect(response.statusCode).toBe(200);
    });




    //200
    test("Should return  200", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/billlist/1234567/1010")
        expect(response.statusCode).toBe(200);
    });

    //200
    test("Should return  404", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/billlist/12345678/1010")
        expect(response.statusCode).toBe(404);
    });


    //200
    test("Should return  200", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/billdetaillist/a0dbbd98-ff93-4a3b-b847-c9f87bfd00cb")
        expect(response.statusCode).toBe(200);
    });
    //404
    test("Should return  404", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/billdetaillist/9c45d6de-2a9f-4675-a4c5-b7ebfa3c89259")
        expect(response.statusCode).toBe(403);
    });


    //200
    test("Should return  200", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/cancelbilllist/1234567/1010")
        expect(response.statusCode).toBe(200);
    });
    //404
    test("Should return  404", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/cancelbilllist/1234567/10100")
        expect(response.statusCode).toBe(404);
    });

    //200
    test("Should return  200", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/cancelbilldetaillist/18a4d867-7677-44d7-9086-81764697ac69")
        expect(response.statusCode).toBe(200);
    });
 //200
    test("Should return  404", async () => {
        const response = await request(app)
            .get("/api/dashboard/get/cancelbilldetaillist/d5c7e00e-fe1a-4c1b-b31a-00fcf5b35f145")
        expect(response.statusCode).toBe(403);
    });
})


