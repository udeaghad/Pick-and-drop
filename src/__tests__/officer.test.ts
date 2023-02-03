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

describe("Officer", () => {
  it("Should get all officers under a company", (done) => {
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
          
          expect(res.statusCode).toEqual(200)
          expect(res.body.length).toBeGreaterThanOrEqual(0)
          return done()
        })
      })      
    })
  })
  
  it("Should get an officer", (done) => {

    let companyId: string = ""
    //get all companies
    agent
    .get("/api/v1/companies")
    .expect(200)
    .end((err, res)  => {
      
      companyId = res.body[0]._id
      //get all officers under this company
      agent
      .get(`/api/v1/officers/companies/${companyId}`)
      .expect(200)
      .end((err, res) => {
        //get officer with the ID
        const officerId = res.body[1]._id;
        agent
        .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200)
          expect(res.body.name).toBe("malik")
          return done()
        })

      })
    })
  })
  
  it("Should update an officer's record", (done) => {
    
    const { phoneNumber, password } = OfficerAccountDetails

    const updateDetail = {
      location: "Main mkt"
    }
    //fetch company ID
    let companyId: string = ""    
    agent
    .get("/api/v1/companies")
    .expect(200)
    .end((err, res)  => {      
      companyId = res.body[0]._id
      //Login Officer
      agent
      .post("/api/v1/auths/login/company")
      .send({phoneNumber, password})
      .expect(200)
      .end((err, res) => {
        const officerId = res.body._id
        //update officer record
        agent
        .put(`/api/v1/officers/${officerId}/companies/${companyId}`)
        .set('Cookie', [res.header['set-cookie']])
        .send(updateDetail)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200)
          expect(res.body.location).toBe(updateDetail.location)
          return done()
        })
      })
    })
  })

  it("Should delete officer by company admin", (done) => {
    let officerId: string = ""
    let companyId: string = ""
    //Login company
    agent
    .post("/api/v1/auths/login/company")
    .send(companyLoginDetails)
    .expect(200)
    .end((err, res) => {
      //delete officer
      companyId = res.body._id;
      officerId = res.body.offices[1]
      
      agent
      .delete(`/api/v1/officers/${officerId}/companies/${companyId}`)
      .set('Cookie', [res.header['set-cookie']])
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200)
        expect(res.text).toBe("Officer deleted successfully")
        return done()
      })

    })
  })
})