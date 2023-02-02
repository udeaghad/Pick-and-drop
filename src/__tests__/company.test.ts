import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import app from "../app";

dotenv.config();
jest.setTimeout(10000);
mongoose.set('strictQuery', true);
const agent = request.agent(app);
beforeEach(async () => {
  await mongoose.connect(String(process.env.DB_TEST));
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("Company", () => {
  it("Should get all companies", (done) => {

    agent
    .get("/api/v1/companies")
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body.length).toBeGreaterThanOrEqual(0)
      return done()
    })
  })

  it("Should get a company with provided ID", (done) => {
    agent
    .get("/api/v1/companies")
    .end((err, res) => {      
      if(res.body.length > 0){        
        agent
        .get(`/api/v1/companies/${res.body[0]._id}`)
        .end((err, res) => {
            expect(res.statusCode).toEqual(200)
            return done()
        })
      }
      return done()
    })
  })

  it("Should return successful on company details update", (done) => {
     const companyLoginDetails = {
      email: "company2@example.com",
      password: "mypassword"
     }

     const updateDetail = {
      city: "Lagos"
     }

     agent
    .post("/api/v1/auths/login/company")
    .send(companyLoginDetails)
    .expect(200)
    .end((err, res) => {
      agent
      .put(`/api/v1/companies/${res.body._id}`)
      .set('Cookie', [res.header['set-cookie']])
      .send(updateDetail)
      .expect(200)
      .end((err, res) => {        
        expect(res.statusCode).toEqual(200)
        expect(res.body.city).toBe("Lagos")
        return done()
        
      })
    })
  })
})