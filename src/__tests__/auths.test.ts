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

describe("Create Company", () => {
 
  it("Should create a new company successfully!", (done) => {
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword"
    }
     
     agent
     .post('/api/v1/auths/register/company')
     .send(companyInput)
     .expect(200)
     .end((err, res) => {

       expect(res.status).toEqual(200);
       return done();
     })      
    
    
  });

  it("Should return error if name is mising", (done) => {
    const companyInput = {
      email:"company3@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword"
    }
    agent
     .post('/api/v1/auths/register/company')
     .send(companyInput)
     .expect(500)
     .end((err, res) => {

       expect(res.status).toEqual(500)
       return done();
     })
     
  })
  it("Should return error if email is mising", (done) => {
    const companyInput = {
      name: "company3",
      phoneNumber: "2348080425113",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword"
    }
    agent
     .post('/api/v1/auths/register/company')
     .send(companyInput)
     .expect(500)
     .end((err, res) => {
       
       expect(res.statusCode).toEqual(500)
       return done();
     })
     
  })
  it("Should return error if phone number is mising", (done) => {
    const companyInput = {
      name: "company5",
      email:"company5@example.com",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword"
    }
    agent
     .post('/api/v1/auths/register/company')
     .send(companyInput)
     .expect(500)
     .end((err, res) => {
       
       expect(res.statusCode).toEqual(500)
       return done();
     })
     
  })
})

  
describe("Login as a company", () => {
  
  it("Should login successfully", (done) => {
    const loginDetails = {
      email: "company2@example.com",
      password: "mypassword"
    }

    agent
    .post("/api/v1/auths/login/company")
    .send(loginDetails)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe("company2")
      return done();
    })

  })

  it("Should return error on wrong password", (done) => {
    const loginDetails = {
      email: "company2@example.com",
      password: "pasword"
    }

    agent
    .post("/api/v1/auths/login/company")
    .send(loginDetails)
    .expect(404)
    .end((err, res) => {

      expect(res.statusCode).toEqual(404)
      return done();
    })
    
    
  })
  
  it("Should return error on wrong company name", (done) => {
    const loginDetails = {
      email: "company21@example.com",
      password: "mypassword"
    }
    
    agent
    .post("/api/v1/auths/login/company")
    .send(loginDetails)
    .expect(200)
    .end((err, res) => {

      expect(res.statusCode).toEqual(404);
      expect(res.text).toBe("Account does not exist")
      return done()
    })
  })  
})

describe("Create Officer", () => {
  
  it("Should create officer account", (done) => {
    const companyLoginDetails = {
      email: "company2@example.com",
      password: "mypassword"
    }

  const OfficerAccountDetails = {
    name: "Joy",
    password: "mypassword",
    address: "Headbridge",
    companyId: "",
    location: "Main mkt",
    phoneNumber: "08033548"
  }

  agent
  .post("/api/v1/auths/login/company")
  .send(companyLoginDetails)
  .expect(200)
  .end((err, res) => {
    
    agent
    .post("/api/v1/auths/register/officer")
    .set('Cookie', [res.header['set-cookie']])
    .send({...OfficerAccountDetails, companyId: `${res.body._id}`})
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      return done();
    })
  })
     

  })

  it("Should login officer successfully", (done) => {
    const officerLoginDetails = {
      phoneNumber: "08033548",
      password: "mypassword"
    }

    agent
    .post("/api/v1/auths/login/company")
    .send(officerLoginDetails)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      return done()
    })
  })

  it("Should return error on wrong phone number", (done) => {
    const officerLoginDetails = {
      phoneNumber: "0803",
      password: "mypassword"
    }
    
        agent
        .post("/api/v1/auths/login/company")
        .send(officerLoginDetails)
        .expect(404)
        .end((err, res) => {
    
          expect(res.statusCode).toEqual(404)
          return done();
        })
        
        
      })

  it("Should return error on wrong password", (done) => {
    const officerLoginDetails = {
      phoneNumber: "08033548",
      password: "wrongpassword"
    }
    
        agent
        .post("/api/v1/auths/login/company")
        .send(officerLoginDetails)
        .expect(404)
        .end((err, res) => {
    
          expect(res.statusCode).toEqual(404)
          return done();
        })
        
        
      })
})

describe("Update password", () => {

  it("Should update company password successfully", (done) => {
    
      const loginDetails = {
        email: "company2@example.com",
        password: "mypassword"
      }

      const updateDetail = {
        password: "mypassword"
      }
    agent
    .post("/api/v1/auths/login/company")
    .send(loginDetails)
    .expect(200)
    .end((err, res) => {

      agent
      .post(`/api/v1/auths/password/company/${res.body._id}`)
      .set('Cookie', [res.header['set-cookie']])
      .send(updateDetail)
      .expect(200)
      .end((err, res) => {        
        expect(res.text).toBe("Password updated successfully")
        return done()
        
      })

    
    })
              
  })

  it("Should update officer password successfully", (done) => {
    const officerLoginDetails = {
      phoneNumber: "08033548",
      password: "mypassword"
    }

    const updateDetail = {
      password: "mypassword"
    }

    agent
    .post("/api/v1/auths/login/company")
    .send(officerLoginDetails)
    .expect(200)
    .end((err, res) => {

      agent
      .post(`/api/v1/auths/password/officer/${res.body._id}`)
      .set('Cookie', [res.header['set-cookie']])
      .send(updateDetail)
      .expect(200)
      .end((err, res) => {        
        expect(res.text).toBe("Password updated successfully")
        return done()
        
      })
   
    })

  }) 
})
