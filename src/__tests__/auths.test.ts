import request from "supertest";
import app from "../app";
import { connect, clearDatabase, closeDatabase} from "./db"

const agent = request.agent(app);
const baseURL = "/api/v1/auths"
jest.setTimeout(10000) 

beforeAll(async () => await connect());

/* Closing database connection after each test. */
afterAll(async () =>  await closeDatabase());

afterEach(async () => await clearDatabase())

describe("Company", () => {
 
  it("Should create a new company successfully!", async() => {
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }

    const { statusCode, text} = await agent.post(`${baseURL}/register/company`).send(companyInput)

    expect(statusCode).toEqual(201)
    expect(text).toBe("Company created successfully")    
  });

  it("Should return 409 if company already exist", async () => {

    const companyInput1 = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }

    const companyInput2 = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }

    await agent.post(`${baseURL}/register/company`).send(companyInput1)
   
    const { statusCode, text } = await agent.post(`${baseURL}/register/company`).send(companyInput2)

    expect(statusCode).toEqual(409)
    expect(text).toBe("Company already exist")

  })

  it("Should return 401 if there is password mismatch", async () => {
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword12"
    }

    const { statusCode, text } = await agent.post(`${baseURL}/register/company`).send(companyInput)

    expect(statusCode).toEqual(401);
    expect(text).toBe("Password does not match")
  })

  it("Should return error if name is missing", async () => {
    const companyInput = {
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }

    const {statusCode, body } = await agent.post(`${baseURL}/register/company`).send(companyInput)
    
    expect(statusCode).toEqual(400)
    expect(body.message).toBe("Company validation failed: name: name must be provided")
  })

  it("Should return error if email is missing", async () => {
    const companyInput = {
      name: "company2",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }

    const {statusCode, body } = await agent.post(`${baseURL}/register/company`).send(companyInput)

    expect(statusCode).toEqual(400)
    expect(body.message).toBe("Company validation failed: email: Email Address must be provided")
  })

  it("Should return error if phone number is missing", async () => {
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }

    const {statusCode, body } = await agent.post(`${baseURL}/register/company`).send(companyInput)

    expect(statusCode).toEqual(400)
    expect(body.message).toBe("Company validation failed: phoneNumber: Phone number must be provided")
  })

  it("Should return error if city is missing", async () => {
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }

    const {statusCode, body } = await agent.post(`${baseURL}/register/company`).send(companyInput)

    expect(statusCode).toEqual(400)
    expect(body.message).toBe("Company validation failed: city: City must be provided")
  })

  it("Should return error if state is missing", async () => {
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      password: "mypassword",
      confirmPassword: "mypassword"
    }

    const {statusCode, body } = await agent.post(`${baseURL}/register/company`).send(companyInput)

    expect(statusCode).toEqual(400)
    expect(body.message).toBe("Company validation failed: state: State must be provided")
  }) 

  
 
})

describe("Login Company", () => {
  beforeEach(async () => {

    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }
  
  await agent.post(`${baseURL}/register/company`).send(companyInput)
  })

  it("Should login company successfully", async () => {

    const loginDetails = {
      email: "company2@example.com",
      password: "mypassword"
    }

    const { statusCode, body } = await agent.post(`${baseURL}/login`).send(loginDetails)

    expect(statusCode).toEqual(200);
    expect(body.name).toBe("company2");
    expect(body.email).toBe("company2@example.com");
    expect(body.phoneNumber).toBe("2348080425123");
    expect(body.city).toBe("Onitsha");
    expect(body.state).toBe("Anambra");
    
  })

  it("Should return error on wrong password", async () =>{
    const loginDetails = {
      email: "company2@example.com",
      password: "mypassword12"
    }

    const { statusCode, text } = await agent.post(`${baseURL}/login`).send(loginDetails)
    expect(statusCode).toEqual(401)
    expect(text).toBe("Invalid Login Details")
  })

  it("Should return error on wrong email", async () => {
    const loginDetails = {
      email: "company3@example.com",
      password: "mypassword"
    }

    const { statusCode, text } = await agent.post(`${baseURL}/login`).send(loginDetails)
    expect(statusCode).toEqual(401)
    expect(text).toBe("Invalid Login Details")
  })

  it("Should update password successfully", async () => {
    const loginDetails = {
      email: "company3@example.com",
      password: "mypassword"
    }

    const updateDetails = {
      currentPassword: "mypassword",
      newPassword: "password123"
    }

    const res = await agent.post(`${baseURL}/login`).send(loginDetails).expect(200)
    const cookies = res.get("Set-Cookie")

    const { text, statusCode } = await agent.post(`${baseURL}/password/company/${res.body._id}`)
                                            .set("Cookie", cookies)
                                            .send(updateDetails)
    expect(statusCode).toEqual(200);
    expect(text).toBe("Password updated successfully")
  })

  it("Should return error on password change if the current password is wrong", async () => {
    const loginDetails = {
      email: "company3@example.com",
      password: "mypassword"
    }

    const updateDetails = {
      currentPassword: "password",
      newPassword: "password123"
    }

    const res = await agent.post(`${baseURL}/login`).send(loginDetails).expect(200)
    const cookies = res.get("Set-Cookie")

    const { text, statusCode } = await agent.post(`${baseURL}/password/company/${res.body._id}`)
                                            .set("Cookie", cookies)
                                            .send(updateDetails)
    expect(statusCode).toEqual(400);
    expect(text).toBe("Invalid Login Details")
  })
})

describe("Officer", () => {

  let company: string
  let cookies: any;

  beforeEach(async () => {
    //Create Company
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword",
      isAdmin: true
    }
    
     await agent.post(`${baseURL}/register/company`).send(companyInput).expect(201)
    
     //Login company to get companyId
     const loginDetails = {
      email: "company2@example.com",
      password: "mypassword"
    }

    const res = await agent.post(`${baseURL}/login`).send(loginDetails).expect(200)

    company = res.body._id;
    cookies = res.get('Set-Cookie');
  })

  it("Should create officer successfully", async () => {

    const officerDetails = {
      name: "Joy",
      address: "Headbridge",
      company,
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }
        
    const { text, statusCode } = await agent.post(`${baseURL}/register/officer`)
                                            .set('Cookie', cookies)
                                            .send(officerDetails)
    expect(statusCode).toEqual(201);
    expect(text).toBe("Officer created successfully")
  })

  it("Should return 409 if Officer with the same phone number already exist", async () => {

    const officerDetails1 = {
      name: "Joy",
      address: "Headbridge",
      company,
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }

    const officerDetails2 = {
      name: "Joy",
      address: "Headbridge",
      company,
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }
        
    await agent.post(`${baseURL}/register/officer`)
                .set('Cookie', cookies)
                .send(officerDetails1)
    const { text, statusCode } = await agent.post(`${baseURL}/register/officer`)
                                              .set('Cookie', cookies)
                                              .send(officerDetails2)
    expect(statusCode).toEqual(409);
    expect(text).toBe("Officer with the phone already exist")
  })

  it("Should return error if address is missing", async () => {
    const officerDetails = {
      name: "Joy",
      company,
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }
    
    const { body, statusCode } = await agent.post(`${baseURL}/register/officer`)
                                             .set('Cookie', cookies)
                                             .send(officerDetails)
    expect(statusCode).toEqual(400);
    expect(body.message).toBe("Officer validation failed: address: address must be provided")
  })

  it("Should return error if company is missing", async () => {
    const officerDetails = {
      name: "Joy",
      address: "Headbridge",
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }
    
    const { body, statusCode } = await agent.post(`${baseURL}/register/officer`)
                                             .set('Cookie', cookies)
                                             .send(officerDetails)
    expect(statusCode).toEqual(400);
    expect(body.message).toBe("Officer validation failed: company: Company ID must be provided")
  })

  it("Should return error if phone number is missing", async () => {
    const officerDetails = {
      name: "Joy",
      address: "Headbridge",
      company,
      location: "Main mkt",
      password: "mypassword",
      confirmPassword: "mypassword",
    }
    
    const { body, statusCode } = await agent.post(`${baseURL}/register/officer`)
                                             .set('Cookie', cookies)
                                             .send(officerDetails)
    expect(statusCode).toEqual(400);
    expect(body.message).toBe("Officer validation failed: phoneNumber: Phone Number must be provided")
  })

  it("Should return error if location is missing", async () => {
    const officerDetails = {
      name: "Joy",
      address: "Headbridge",
      company,
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }
    
    const { body, statusCode } = await agent.post(`${baseURL}/register/officer`)
                                             .set('Cookie', cookies)
                                             .send(officerDetails)
    expect(statusCode).toEqual(400);
    expect(body.message).toBe("Officer validation failed: location: location must be provided")
  })

  it("Should return error if there is password mismatch", async () => {
    const officerDetails = {
      name: "Joy",
      address: "Headbridge",
      company,
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword12",
    }
    
    const { text, statusCode } = await agent.post(`${baseURL}/register/officer`)
                                             .set('Cookie', cookies)
                                             .send(officerDetails)
    expect(statusCode).toEqual(401);
    expect(text).toBe("Password does not match")
  })
  
  

})

//   it("Should login officer successfully", (done) => {
//     const officerLoginDetails = {
//       phoneNumber: "08033548",
//       password: "mypassword"
//     }

//     agent
//     .post("/api/v1/auths/login/company")
//     .send(officerLoginDetails)
//     .expect(200)
//     .end((err, res) => {
//       expect(res.statusCode).toEqual(200)
//       return done()
//     })
//   })

//   it("Should return error on wrong phone number", (done) => {
//     const officerLoginDetails = {
//       phoneNumber: "0803",
//       password: "mypassword"
//     }
    
//         agent
//         .post("/api/v1/auths/login/company")
//         .send(officerLoginDetails)
//         .expect(404)
//         .end((err, res) => {
    
//           expect(res.statusCode).toEqual(404)
//           return done();
//         })
        
        
//       })

//   it("Should return error on wrong password", (done) => {
//     const officerLoginDetails = {
//       phoneNumber: "08033548",
//       password: "wrongpassword"
//     }
    
//         agent
//         .post("/api/v1/auths/login/company")
//         .send(officerLoginDetails)
//         .expect(404)
//         .end((err, res) => {
    
//           expect(res.statusCode).toEqual(404)
//           return done();
//         })
        
        
//       })
// })

// describe("Update password", () => {

//   it("Should update company password successfully", (done) => {
    
//       const loginDetails = {
//         email: "company2@example.com",
//         password: "mypassword"
//       }

//       const updateDetail = {
//         password: "mypassword"
//       }
//     agent
//     .post("/api/v1/auths/login/company")
//     .send(loginDetails)
//     .expect(200)
//     .end((err, res) => {

//       agent
//       .post(`/api/v1/auths/password/company/${res.body._id}`)
//       .set('Cookie', [res.header['set-cookie']])
//       .send(updateDetail)
//       .expect(200)
//       .end((err, res) => {        
//         expect(res.text).toBe("Password updated successfully")
//         return done()
        
//       })

    
//     })
              
//   })

//   it("Should update officer password successfully", (done) => {
//     const officerLoginDetails = {
//       phoneNumber: "08033548",
//       password: "mypassword"
//     }

//     const updateDetail = {
//       password: "mypassword"
//     }

//     agent
//     .post("/api/v1/auths/login/company")
//     .send(officerLoginDetails)
//     .expect(200)
//     .end((err, res) => {

//       agent
//       .post(`/api/v1/auths/password/officer/${res.body._id}`)
//       .set('Cookie', [res.header['set-cookie']])
//       .send(updateDetail)
//       .expect(200)
//       .end((err, res) => {        
//         expect(res.text).toBe("Password updated successfully")
//         return done()
        
//       })
   
//     })

//   }) 
// })
