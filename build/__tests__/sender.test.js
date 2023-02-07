"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("../app"));
dotenv_1.default.config();
mongoose_1.default.set('strictQuery', true);
jest.setTimeout(10000);
const agent = supertest_1.default.agent(app_1.default);
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(String(process.env.DB_TEST));
}));
/* Closing database connection after each test. */
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const senderDetails = {
    name: "Ngozi",
    phoneNumber: "080254654421",
    address: "13 Kano Street",
    location: "Main market"
};
describe("Sender", () => {
    it("Should create sender successfully", (done) => {
        //Create sender
        agent
            .post("/api/v1/senders")
            .send(senderDetails)
            .expect(200)
            .end((err, res) => {
            expect(res.statusCode).toEqual(200);
            return done();
        });
    });
    it("Should update sender records", (done) => {
        const updateDetail = {
            phoneNumber: "080254654421"
        };
        //Create sender
        agent
            .post("/api/v1/senders")
            .send(senderDetails)
            .expect(200)
            .end((err, res) => {
            const senderId = res.body._id;
            //update sender record
            agent
                .put(`/api/v1/senders/${senderId}`)
                .send(updateDetail)
                .expect(200)
                .end((err, res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.phoneNumber).toBe(updateDetail.phoneNumber);
                return done();
            });
        });
    });
    it("Should get sender details", (done) => {
        agent
            .post("/api/v1/senders")
            .send(senderDetails)
            .expect(200)
            .end((err, res) => {
            const senderId = res.body._id;
            //get sender details
            agent
                .get(`/api/v1/senders/${senderId}`)
                .expect(200)
                .end((err, res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.name).toBe(senderDetails.name);
                expect(res.body.phoneNumber).toBe(senderDetails.phoneNumber);
                expect(res.body.location).toBe(senderDetails.location);
                return done();
            });
        });
    });
});
