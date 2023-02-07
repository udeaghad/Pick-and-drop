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
const companyInput = {
    name: "company2",
    email: "company2@example.com",
    phoneNumber: "2348080425123",
    city: "Onitsha",
    state: "Anambra",
    password: "mypassword"
};
const companyLoginDetails = {
    email: "company2@example.com",
    password: "mypassword"
};
const OfficerAccountDetails = {
    name: "Malik",
    password: "mypassword",
    address: "Headbridge",
    companyId: "",
    location: "Main mkt",
    phoneNumber: "080735483654"
};
const officerLoginDetails = {
    phoneNumber: "080735483654",
    password: "mypassword",
};
describe("Officer", () => {
    let companyId;
    let officerId;
    it("Should get all officers under a company", (done) => {
        //create Company if it does not exist
        agent
            .post('/api/v1/auths/register/company')
            .send(companyInput)
            .expect(200)
            .end(() => {
            //Login to the company
            agent
                .post("/api/v1/auths/login/company")
                .send(companyLoginDetails)
                .expect(200)
                .end((err, res) => {
                //Create officer
                companyId = res.body._id;
                agent
                    .post("/api/v1/auths/register/officer")
                    .set('Cookie', [res.header['set-cookie']])
                    .send(Object.assign(Object.assign({}, OfficerAccountDetails), { companyId }))
                    .expect(200)
                    .end((err, res) => {
                    //Login officer to get the Id
                    agent
                        .post("/api/v1/auths/login/company")
                        .send(officerLoginDetails)
                        .expect(200)
                        .end((err, res) => {
                        officerId = res.body._id;
                        //get all officers
                        agent
                            .get(`/api/v1/officers/companies/${companyId}`)
                            .expect(200)
                            .end((err, res) => {
                            expect(res.statusCode).toEqual(200);
                            expect(res.body.length).toBeGreaterThanOrEqual(0);
                            return done();
                        });
                    });
                });
            });
        });
    });
    it("Should get an officer", (done) => {
        // console.log("officer", officerId)
        // console.log("company", companyId)
        agent
            .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
            .expect(200)
            .end((err, res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe("malik");
            return done();
        });
    });
    it("Should update an officer's record", (done) => {
        const { phoneNumber, password } = OfficerAccountDetails;
        const updateDetail = {
            location: "Main mkt"
        };
        //Login Officer
        agent
            .post("/api/v1/auths/login/company")
            .send({ phoneNumber, password })
            .expect(200)
            .end((err, res) => {
            //update officer record
            agent
                .put(`/api/v1/officers/${officerId}/companies/${companyId}`)
                .set('Cookie', [res.header['set-cookie']])
                .send(updateDetail)
                .expect(200)
                .end((err, res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.location).toBe(updateDetail.location);
                return done();
            });
        });
    });
    it("Should delete officer by company admin", (done) => {
        //Login company
        agent
            .post("/api/v1/auths/login/company")
            .send(companyLoginDetails)
            .expect(200)
            .end((err, res) => {
            //delete officer      
            agent
                .delete(`/api/v1/officers/${officerId}/companies/${companyId}`)
                .set('Cookie', [res.header['set-cookie']])
                .expect(200)
                .end((err, res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.text).toBe("Officer deleted successfully");
                return done();
            });
        });
    });
});
