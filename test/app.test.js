const request = require('supertest');
const app = require('../app');

describe("GET /", () => {
  describe("all data on home page", () => {

    test("return all book and magazine (201 status code)", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(201)
    })
  })
})

describe("GET /find", () => {
    
    describe("given a author email", () => {
        
        // user entered correct author email
        test("return all book and magazine(201 status code)", async () => {
            const response = await request(app).get("/find?author=null-lieblich@echocat.org");
            expect(response.statusCode).toBe(201)
        })

        // user eneterd wrong author email
        test("return No Book or Magazine exist for given author email (401 status code)", async () => {
            const response = await request(app).get("/find?author=null-lieblich@echocat.ind");
            expect(response.statusCode).toBe(401)
        })
    })


})