import request from "supertest";
import app from "../app";
import { connect, clearDatabase, closeDatabase} from "./db/db"

// jest.setTimeout(10000) 
const agent = request.agent(app);
const baseURL = "/api/v1/senders"


beforeAll( () => connect());

afterAll( () =>  closeDatabase());

afterEach( () => clearDatabase())

describe("Sender", () => {
  let  senderId: string;

  beforeEach(async () => {

    const senderDetails = {
      name: "Favor",
      phoneNumber: "0802566551",
      address: "05 Lagos Street",
      location: "Okota"
    }
  
    const {body} = await agent.post(`${baseURL}`).send(senderDetails);
  
    senderId = body._id;
  })

  it("Should create a sender successfully", async () =>{

    const senderDetails = {
      name: "Ngozi",
      phoneNumber: "080254654421",
      address: "13 Kano Street",
      location: "Main market"
    }

    const {body, statusCode } = await agent.post(`${baseURL}`).send(senderDetails);
    expect(statusCode).toEqual(201)
    expect(body.name).toBe("Ngozi")
    expect(body.phoneNumber).toBe("080254654421");
    expect(body.address).toBe("13 Kano Street");
    expect(body.location).toBe("Main market");

  })

  it("Should return error if sender already exist", async () =>{

    const senderDetails1 = {
      name: "Ngozi",
      phoneNumber: "080254654421",
      address: "13 Kano Street",
      location: "Main market"
    }
    const senderDetails2 = {
      name: "Ngozi",
      phoneNumber: "080254654421",
      address: "13 Kano Street",
      location: "Main market"
    }

    await agent.post(`${baseURL}`).send(senderDetails1);
    const {body, statusCode } = await agent.post(`${baseURL}`).send(senderDetails2);

    expect(statusCode).toEqual(409);
    expect(body.name).toBe("Ngozi")
    expect(body.phoneNumber).toBe("080254654421");
    expect(body.address).toBe("13 Kano Street");
    expect(body.location).toBe("Main market"); 

  })

  it("Should update sender successfully", async () => {

    const updateDetail = {
      phoneNumber: "080254654666"
    }

    const { body, statusCode } = await agent.put(`${baseURL}/${senderId}`).send(updateDetail)

    expect(statusCode).toEqual(200);
    expect(body.phoneNumber).toBe(updateDetail.phoneNumber)
  })

  it("Should get sender details", async () => {
    const {body, statusCode} = await agent.get(`${baseURL}/${senderId}`)

    expect(statusCode).toEqual(200)
    expect(body.name).toBe("Favor")
    expect(body.phoneNumber).toBe("0802566551")
    expect(body.address).toBe("05 Lagos Street")
    expect(body.location).toBe("Okota")
  })
})