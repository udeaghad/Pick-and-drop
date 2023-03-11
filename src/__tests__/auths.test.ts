import request from "supertest";
import app from "../app";
import { connect, clearDatabase, closeDatabase} from "./db/db"

// jest.setTimeout(10000) 
const agent = request.agent(app);
const baseURL = "/api/v1/auths";

beforeAll( () => connect());

afterAll( () =>  closeDatabase());

afterEach( () => clearDatabase())

describe("Company Auths", () => {
 
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
      email: "company2@example.com",
      password: "mypassword"
    }

    const updateDetails = {
      currentPassword: "mypassword",
      newPassword: "password123"
    }

    const res = await agent.post(`${baseURL}/login`).send(loginDetails)
    const cookies = res.get("Set-Cookie")
    
    const { text, statusCode } = await agent.post(`${baseURL}/password/company/${res.body._id}`)
                                            .set("Cookie", cookies)
                                            .send(updateDetails)
    expect(statusCode).toEqual(200);
    expect(text).toBe("Password updated successfully")
  })

  it("Should return error on on wrong  current password", async () => {
    const loginDetails = {
      email: "company2@example.com",
      password: "mypassword"
    }

    const updateDetails = {
      currentPassword: "password",
      newPassword: "password123"
    }

    const res = await agent.post(`${baseURL}/login`).send(loginDetails)
    const cookies = res.get("Set-Cookie")

    const { text, statusCode } = await agent.post(`${baseURL}/password/company/${res.body._id}`)
                                            .set("Cookie", cookies)
                                            .send(updateDetails)
    expect(statusCode).toEqual(401);
    expect(text).toBe("Invalid Login Details")
  })
})

describe("Officer Auths", () => {

  let company: string
  let cookies: string[];

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
    
    const { text, statusCode } = await agent.post(`${baseURL}/register/officer`)
                                             .set('Cookie', cookies)
                                             .send(officerDetails)
    expect(statusCode).toEqual(401);
    expect(text).toBe("You are not authorised to perform this action")
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

describe("Login Officer", () => {
  
  beforeEach(async () => {
    //Create company
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
    const company = res.body._id
    const companyCookies = res.get("Set-Cookie") 

    //Create Officer
    const officerDetails = {
      name: "Joy",
      address: "Headbridge",
      company,
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }

    const officerRes = await agent.post(`${baseURL}/register/officer`)
                                            .set('Cookie', companyCookies)
                                            .send(officerDetails)
                                            .expect(201)

  })

  it("Should login successfully", async () => {
    const loginDetails = {
      phoneNumber: "08033548",
      password: "mypassword",
    }

    const { body, statusCode } = await agent.post(`${baseURL}/login`).send(loginDetails)
    expect(statusCode).toEqual(200)
    expect(body.name).toBe("Joy")
    expect(body.address).toBe("Headbridge")
    expect(body.location).toBe("Main mkt")
    expect(body.phoneNumber).toBe("08033548")
  } )

  it("Should error on wrong password", async () => {
    const loginDetails = {
      phoneNumber: "08033548",
      password: "massword",
    }

    const { text, statusCode } = await agent.post(`${baseURL}/login`).send(loginDetails)
    expect(statusCode).toEqual(401)
    expect(text).toBe("Invalid Login Details")
  } )

  it("Should error on wrong phone number", async () => {
    const loginDetails = {
      phoneNumber: "080",
      password: "massword",
    }

    const { text, statusCode } = await agent.post(`${baseURL}/login`).send(loginDetails)
    expect(statusCode).toEqual(401)
    expect(text).toBe("Invalid Login Details")
  } )

  it("Should update password successfully", async () => {

    //login officer
    const loginDetails = {
      phoneNumber: "08033548",
      password: "mypassword",
    }

    const res = await agent.post(`${baseURL}/login`).send(loginDetails)
    const cookies = res.get("Set-Cookie")
    const officerId = res.body._id

    //update officer password

    const updateDetails = {
      currentPassword: "mypassword",
      newPassword: "newpassword"
    }

    const { text, statusCode } = await agent.post(`${baseURL}/password/officer/${officerId}`)
                                             .set("Cookie", cookies)
                                             .send(updateDetails)
    expect(statusCode).toEqual(200)
    expect(text).toBe("Password updated successfully")
  })

  it("Should return error on wrong current password", async () => {
    //login officer
    const loginDetails = {
      phoneNumber: "08033548",
      password: "mypassword",
    }

    const res = await agent.post(`${baseURL}/login`).send(loginDetails)
    const cookies = res.get("Set-Cookie")
    const officerId = res.body._id

    //update officer password

    const updateDetails = {
      currentPassword: "assword",
      newPassword: "newpassword"
    }

    const { text, statusCode } = await agent.post(`${baseURL}/password/officer/${officerId}`)
                                             .set("Cookie", cookies)
                                             .send(updateDetails)
    expect(statusCode).toEqual(401)
    expect(text).toBe("Invalid Login Details")

  })
})

