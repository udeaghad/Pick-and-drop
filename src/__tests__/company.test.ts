import request from "supertest";
import app from "../app";
import { connect, clearDatabase, closeDatabase} from "./db"

const agent = request.agent(app);
const baseURL = "/api/v1/companies"
jest.setTimeout(10000) 


beforeAll(async () => await connect());

afterAll(async () =>  await closeDatabase());

afterEach(async () => await clearDatabase())

describe("Company", () => {
  let companyId: string;
  let cookies: string[];

  beforeEach(async () => {

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
      name: "company3",
      email:"company3@example.com",
      phoneNumber: "48080425123",
      city: "Ikeja",
      state: "Lagos",
      password: "mypassword",
      confirmPassword: "mypassword"    
    }
  
    await agent.post(`/api/v1/auths/register/company`).send(companyInput1)
    await agent.post(`/api/v1/auths/register/company`).send(companyInput2)

    const res = await agent.post("/api/v1/auths/login").send({email:"company3@example.com", password: "mypassword"})
    companyId = res.body._id
    cookies = res.get("Set-Cookie")
  })

  it("Should get all companies", async () => {

    const { body, statusCode } = await agent.get(baseURL)
    console.log(body)
    expect(statusCode).toEqual(200)
    expect(body).toHaveLength(2)
  })

  it("Should get a company with company ID", async () => {
    const { body, statusCode } = await agent.get(`${baseURL}/${companyId}`)

    expect(statusCode).toEqual(200);
    expect(body._id).toBe(companyId);
    expect(body.name).toBe("company3");
    expect(body.email).toBe("company3@example.com");
    expect(body.phoneNumber).toBe("48080425123");
    expect(body.city).toBe("Ikeja");
    expect(body.state).toBe("Lagos");
  })

  it("Should update company details successfully", async () => {
      const updateDetails = {
        city: "New York",
      }

      const { statusCode, body } = await agent.put(`${baseURL}/${companyId}`)
                                              .set("Cookie", cookies)
                                              .send(updateDetails)

      

      expect(statusCode).toEqual(200);
      expect(body.city).toBe("New York")
      expect(body.isAdmin).toBe(true)
    })

  it("Should return error if company ID is wrong", async () => {
    const updateDetails = {
      city: "New York"
    }

    const { statusCode, text } = await agent.put(`${baseURL}/12345678`)
                                            .set("Cookie", cookies)
                                            .send(updateDetails)

    expect(statusCode).toEqual(401);
    expect(text).toBe("You are not authorised to make changes")
  })

  it("Should delete a company successfully", async () => {

    const { statusCode, text } = await agent.delete(`${baseURL}/${companyId}`)
                                            .set("Cookie", cookies)
    
    expect(statusCode).toEqual(200)
    expect(text).toBe("Company deleted successfully")
  })

})