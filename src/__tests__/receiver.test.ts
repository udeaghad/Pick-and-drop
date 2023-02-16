import request from "supertest";
import app from "../app";
import { connect, clearDatabase, closeDatabase} from "./db"

const agent = request.agent(app);
const baseURL = "/api/v1/receivers"
jest.setTimeout(10000) 


beforeAll(async () => await connect());

afterAll(async () =>  await closeDatabase());

afterEach(async () => await clearDatabase())

describe("Receiver", () => {
  let  senderId: string;

  beforeEach(async () => {

    const senderDetails = {
      name: "Favor",
      phoneNumber: "0802566551",
      address: "05 Lagos Street",
      location: "Okota"
    }
  
    const {body} = await agent.post("/api/v1/senders").send(senderDetails);
  
    senderId = body._id;
  })

  it("Should create receiver successfully", async () => {
    const receiverDetails = { 
      name: "Oma",
      phoneNumber: "+23458214",
      city: "Enugu"
    }

    const { body, statusCode } = await agent.post(`${baseURL}/senders/${senderId}`).send(receiverDetails)

    expect(statusCode).toEqual(201)
    expect(body.name).toBe("Oma")
    expect(body.phoneNumber).toBe("+23458214")
    expect(body.city).toBe( "Enugu")
  })

  it("Should update receiver successfully", async () => {
    //Create Receiver
    const receiverDetails = { 
      name: "Oma",
      phoneNumber: "+23458214",
      city: "Enugu"
    }

    const res = await agent.post(`${baseURL}/senders/${senderId}`).send(receiverDetails)
    const receiverId = res.body._id
    

    const updateDetail = {
      city: "Awka"
    }

    const { body, statusCode } = await agent.put(`${baseURL}/${receiverId}`).send(updateDetail)

    expect(statusCode).toEqual(200)
    expect(body.city).toBe(updateDetail.city)
  })

  it("Should get receiver details", async () => {
    const receiverDetails = { 
      name: "Oma",
      phoneNumber: "+23458214",
      city: "Enugu"
    }

    const res = await agent.post(`${baseURL}/senders/${senderId}`).send(receiverDetails)
    const receiverId = res.body._id

    const { body, statusCode } = await agent.get(`${baseURL}/${receiverId}`)

    expect(statusCode).toEqual(200);
    expect(body.name).toBe("Oma")
    expect(body.phoneNumber).toBe("+23458214")
    expect(body.city).toBe( "Enugu")
  })
})
  