import mongoose, { Types } from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import Company from "../models/CompanyModel";
import app from "../app";
import * as authsController from "../controllers/authsController";

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
      name: "company2",
      email:"company2@example.com",
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