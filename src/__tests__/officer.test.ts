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

const companyInput = {
  name: "company2",
  email:"company2@example.com",
  phoneNumber: "2348080425123",
  city: "Onitsha",
  state: "Anambra",
  password: "mypassword"
}

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

const officerLoginDetails = {
  phoneNumber:  "080735483654",
  password: "mypassword",
}


describe("Officer", () => {
  let companyId: string 
  let officerId: string 

  it("Should get all officers under a company", (done) => { 
    //create Company if it does not exist
    agent
     .post('/api/v1/auths/register/company')
     .send(companyInput)
     .expect(200)
     .end(() => {

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
        //Login officer to get the Id
        agent
        .post("/api/v1/auths/login/company")
        .send(officerLoginDetails)
        .expect(200)
        .end((err, res) => {          
          officerId = res.body._id
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
    })
  })
  
  it("Should get an officer", (done) => {
    // console.log("officer", officerId)
    // console.log("company", companyId)
    agent
    .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body.name).toBe("malik")
      return done()
    })

  })
    
  
  
  it("Should update an officer's record", (done) => {
    
    const { phoneNumber, password } = OfficerAccountDetails

    const updateDetail = {
      location: "Main mkt"
    }
    
      //Login Officer
      agent
      .post("/api/v1/auths/login/company")
      .send({phoneNumber, password})
      .expect(200)
      .end((err, res) => {
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
  

  it("Should delete officer by company admin", (done) => {
    
    //Login company
    agent
    .post("/api/v1/auths/login/company")
    .send(companyLoginDetails)
    .expect(200)
    .end((err, res) => {
      //delete officer      
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