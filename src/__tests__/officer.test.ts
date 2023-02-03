import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import app from "../app";

dotenv.config();
mongoose.set('strictQuery', true);
jest.setTimeout(10000);
const agent = request.agent(app);

beforeEach(async () => {
  await mongoose.connect(String(process.env.DB_TEST));
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("Officer", () => {
  it("Should get all officers under a company", (done) => {
    const companyLoginDetails = {
      email: "company2@example.com",
      password: "mypassword"
    }

    const OfficerAccountDetails = {
      name: "Malik",
      password: "mypassword",
      address: "Headbridge",
      companyId: "",
      location: "Main mkt",
      phoneNumber: "080735483654"
    }

    let companyId: string = '';
    
    //Login to the company
    agent
    .post("/api/v1/auths/login/company")
    .send(companyLoginDetails)
    .expect(200)
    .end((err, res) => {
      //Create officer
      companyId = res.body._id;
      agent
      .post("/api/v1/auths/register/officer")
      .set('Cookie', [res.header['set-cookie']])
      .send({...OfficerAccountDetails, companyId})
      .expect(200)
      .end((err, res) => {
        //get all officers
        agent
        .get(`/api/v1/officers/companies/${companyId}`)
        .expect(200)
        .end((err, res) => {
          console.log(res.body)
          expect(res.statusCode).toEqual(200)
          expect(res.body.length).toBeGreaterThanOrEqual(0)
          return done()
        })
      })      
    })
  })
  
  

})