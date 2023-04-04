const app = require("./app");
const request = require("supertest");

describe("POST /test", () => {
    describe("When username an password are passed", () => {
        test("should be redirected and respond with status 302", async () => {
            const response = await request(app).post("/register").send({
                username: "username", 
                password: "password"
            })
            expect(response.status).toBe(302)
        })
    })
})

describe("GET /test", () => {
    describe("when the home page is reached", () => {
        test("Should respond with status code 200", async () => {
            const response = await request(app).get("/")
            expect(response.status).toBe(200) 
        })
    })
    describe("Is the database connected successfully to the node js app", () => {
        test("the api endpoint /results should respond with status code 200", async () => {
            const response = await request(app).get("/results")
            expect(response.status).toBe(200)
        })
    })
})