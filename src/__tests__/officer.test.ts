import request from "supertest";
import app from "../app";
import { connect, clearDatabase, closeDatabase} from "./db/db"

jest.setTimeout(10000) 
const agent = request.agent(app);
const baseURL = "/api/v1/officers";


beforeAll( () =>  connect());

afterAll( () =>   closeDatabase());

afterEach( () =>  clearDatabase())


describe("Officer", () => {
  let companyId: string;
  let companyCookies: string[];
  let officerId: string;
  let officerCookies: string[];

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
    
    //Create company
    await agent.post(`/api/v1/auths/register/company`).send(companyInput)
     
    //Login Company to get ID, create officer, and get cookies
    const companyRes = await agent.post("/api/v1/auths/login").send({email:"company2@example.com", password: "mypassword"})
    companyId = companyRes.body._id;
    companyCookies = companyRes.get("Set-Cookie");

    //Create Officers
    const officerDetails1 = {
      name: "Joy",
      address: "Headbridge",
      company: companyId,
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }

    const officerDetails2 = {
      name: "Grace",
      address: "Balogun",
      company: companyId,
      location: "Island",
      phoneNumber: "08033548123",
      password: "mypassword",
      confirmPassword: "mypassword",
    }
    await agent.post(`/api/v1/auths/register/officer`)
                                            .set('Cookie', companyCookies)
                                            .send(officerDetails1)
    await agent.post(`/api/v1/auths/register/officer`)
                                            .set('Cookie', companyCookies)
                                            .send(officerDetails2)

    //Login one officer to get ID and cookies    
    const officerRes =  await agent.post(`/api/v1/auths/login`).send({phoneNumber: "08033548123",password: "mypassword"})
    officerId = officerRes.body._id;
    officerCookies = officerRes.get("Set-Cookie");
  })

  it("Should get all officers under a company", async () => {
    const { statusCode, body } = await agent.get(`${baseURL}/companies/${companyId}`)

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(2);
  });

  it("Should get an officer", async () => {
    const { body, statusCode } = await agent.get(`${baseURL}/${officerId}/companies/${companyId}`);

    expect(statusCode).toEqual(200);
    expect(body._id).toBe(officerId);
    expect(body.name).toBe("Grace");
    expect(body.address).toBe("Balogun");
    expect(body.company.name).toBe("company2");
    expect(body.location).toBe("Island");
    expect(body.phoneNumber).toBe("08033548123");
  })

  it("Should update an officer records", async () => {
    const updateDetail = {
      location: "Main mkt"
    }

    const { body, statusCode } = await agent.put(`${baseURL}/${officerId}/companies/${companyId}`)
                                            .set("Cookie", officerCookies)
                                            .send(updateDetail)
    
    expect(statusCode).toEqual(200)
    expect(body.location).toBe("Main mkt")
  })

  it("Should delete officer by company admin", async () => {
    const { text, statusCode } = await agent.delete(`${baseURL}/${officerId}/companies/${companyId}`)
                                            .set("Cookie", companyCookies)
                                        
    expect(statusCode).toEqual(200);
    expect(text).toBe("Officer deleted successfully")
  })

})