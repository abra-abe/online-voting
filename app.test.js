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