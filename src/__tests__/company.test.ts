import mongoose, { Types } from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import Company from "../models/CompanyModel";
import app from "../app";
import * as authsController from "../controllers/authsController";
import jwt, {Secret} from "jsonwebtoken"

dotenv.config();
jest.setTimeout(10000);
mongoose.set('strictQuery', true);

beforeEach(async () => {
  await mongoose.connect(String(process.env.DB_TEST));
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});


const companyPayload = {
  _id: expect.any(String),
  name: "company2",
  email:"company2@example.com",
  phoneNumber: "2348080425123",
  city: "Onitsha",
  state: "Anambra",
  offices: [],
  rating: 0,
  isAdmin: true,
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  __v:0
  }

describe("Create Company", () => {
  it("Should create a new company successfully!", async() => {
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword"
    }
     
     const { statusCode } = await request(app)
     .post('/api/v1/auths/register/company')
     .send(companyInput)      
    
     expect(statusCode).toEqual(200);
    
  });

  it("Should return error if name is mising", async() => {
    const companyInput = {
      email:"company3@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword"
    }
    const { statusCode } = await request(app)
     .post('/api/v1/auths/register/company')
     .send(companyInput)
     
     expect(statusCode).toEqual(500)
  })
  it("Should return error if email is mising", async() => {
    const companyInput = {
      name: "company3",
      phoneNumber: "2348080425113",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword"
    }
    const { statusCode } = await request(app)
     .post('/api/v1/auths/register/company')
     .send(companyInput)
     
     expect(statusCode).toEqual(500)
  })
  it("Should return error if phone number is mising", async() => {
    const companyInput = {
      name: "company5",
      email:"company5@example.com",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword"
    }
    const { statusCode } = await request(app)
     .post('/api/v1/auths/register/company')
     .send(companyInput)
     
     expect(statusCode).toEqual(500)
  })
})

describe("Login as a company", () => {
  it("Should login successfully", async() => {
    const loginDetails = {
      email: "company2@example.com",
      password: "mypassword"
    }

    const { statusCode, body } = await request(app).post("/api/v1/auths/login/company").send(loginDetails);

    expect(statusCode).toEqual(200);
    expect(body.name).toBe("company2")
  })
  it("Should return error on wrong password", async() => {
    const loginDetails = {
      email: "company2@example.com",
      password: "password"
    }

    const { statusCode } = await request(app).post("/api/v1/auths/login/company").send(loginDetails);

    expect(statusCode).toEqual(404);
    
  })
  it("Should return error on wrong company name", async() => {
    const loginDetails = {
      email: "company21@example.com",
      password: "mypassword"
    }

    const { statusCode } = await request(app).post("/api/v1/auths/login/company").send(loginDetails);

    expect(statusCode).toEqual(404);
    
  })  
})

// describe("Update password", () => {
//   it("Should update password successfully", async() => {

//     // const secretKey: Secret = String(process.env.JWT);    

//     // const loginDetails = {
//     //   email: "company2@example.com",
//     //   password: "mypassword"
//     // }
    
//     const updatePassword = {
//       password: "mypassword123"
//     }
//     // const{ body } = await request(app).post("/api/v1/auths/login/company").send(loginDetails)

//     const { statusCode } = await request(app).post(`/api/v1/auths/password/company/63da3a52a897ab8799ab9911`).send(updatePassword)
//     expect(statusCode).toEqual(200)
//   })

// })