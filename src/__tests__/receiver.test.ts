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

const receiverDetails = { 
  name: "Oma",
  phoneNumber: "+23458214",
  city: "Enugu"
}

describe("Receiver", () => {
  let  receiverId = ""
  let senderId = ""
  it("Should create receiver successfully", (done) => {

    const senderDetails = {
      name: "Ngozi",
      phoneNumber: "080254654421",
      address: "13 Kano Street",
      location: "Main market"
    }
    
    //create sender
    agent
    .post("/api/v1/senders")
    .send(senderDetails)
    .expect(200)
    .end((err, res) => {
      senderId = res.body._id
      //create receiver
      agent
      .post(`/api/v1/receivers/senders/${senderId}`)
      .send(receiverDetails)
      .expect(200)
      .end((err, res) => {
        receiverId = res.body._id
         expect(res.statusCode).toEqual(200)
         return done()
      })
    })    
  })

  it("should update receiver records", (done) => {
    const updateDetail = {
      city: "Enugu"
    }

    agent
    .put(`/api/v1/receivers/${receiverId}`)
    .send(updateDetail)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body.city).toBe(updateDetail.city)
      return done()
    })
  })

  it("Should get receiver details", (done) => {
    agent
    .get(`/api/v1/receivers/${receiverId}`)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body.name).toBe(receiverDetails.name)
      expect(res.body.phoneNumber).toBe(receiverDetails.phoneNumber)
      return done()
    })
  })
})