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

const senderDetails = {
  name: "Ngozi",
  phoneNumber: "080254654421",
  address: "13 Kano Street",
  location: "Main market"
}

describe("Sender", () => {
  it("Should create sender successfully", (done) => {
    

    //Create sender
    agent
    .post("/api/v1/senders")
    .send(senderDetails)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      return done()
    })
  })

  it("Should update sender records", (done) => {
    const updateDetail = {
      phoneNumber: "080254654421"
    }

    //Create sender
    agent
    .post("/api/v1/senders")
    .send(senderDetails)
    .expect(200)
    .end((err, res) => {
      const senderId = res.body._id
      //update sender record
      agent
      .put(`/api/v1/senders/${senderId}`)
      .send(updateDetail)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200)
        expect(res.body.phoneNumber).toBe(updateDetail.phoneNumber)
        return done()
      })
    })

  })

  it("Should get sender details", (done) => {
    agent
    .post("/api/v1/senders")
    .send(senderDetails)
    .expect(200)
    .end((err, res) => {
      const senderId = res.body._id
      //get sender details
      agent
      .get(`/api/v1/senders/${senderId}`)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200)
        expect(res.body.name).toBe(senderDetails.name)
        expect(res.body.phoneNumber).toBe(senderDetails.phoneNumber)
        expect(res.body.location).toBe(senderDetails.location)
        return done()
      })
    })
  })
})