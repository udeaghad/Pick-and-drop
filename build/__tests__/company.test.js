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
describe("Company", () => {
    it("Should get all companies", (done) => {
        agent
            .get("/api/v1/companies")
            .end((err, res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThanOrEqual(0);
            return done();
        });
    });
    it("Should get a company with provided ID", (done) => {
        agent
            .get("/api/v1/companies")
            .end((err, res) => {
            if (res.body.length > 0) {
                agent
                    .get(`/api/v1/companies/${res.body[0]._id}`)
                    .end((err, res) => {
                    expect(res.statusCode).toEqual(200);
                    return done();
                });
            }
            return done();
        });
    });
});
describe("Update company", () => {
    it("Should return successful on company details update", (done) => {
        const companyLoginDetails = {
            email: "company2@example.com",
            password: "mypassword"
        };
        const updateDetail = {
            city: "Lagos"
        };
        agent
            .post("/api/v1/auths/login/company")
            .send(companyLoginDetails)
            .expect(200)
            .end((err, res) => {
            agent
                .put(`/api/v1/companies/${res.body._id}`)
                .set('Cookie', [res.header['set-cookie']])
                .send(updateDetail)
                .expect(200)
                .end((err, res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.city).toBe("Lagos");
                return done();
            });
        });
    });
    it("Should return error if company ID is wrong", (done) => {
        const companyLoginDetails = {
            email: "company2@example.com",
            password: "mypassword"
        };
        const updateDetail = {
            city: "Lagos"
        };
        agent
            .post("/api/v1/auths/login/company")
            .send(companyLoginDetails)
            .expect(200)
            .end((err, res) => {
            agent
                .put(`/api/v1/companies/${123456}`)
                .set('Cookie', [res.header['set-cookie']])
                .send(updateDetail)
                .expect(200)
                .end((err, res) => {
                expect(res.statusCode).toEqual(401);
                expect(res.text).toBe("You are not authorised to make changes");
                return done();
            });
        });
    });
});
describe("Delete Company", () => {
    it("Should delete company successfully", (done) => {
        const companyInput = {
            name: "company3",
            email: "company3@example.com",
            phoneNumber: "2348080425663",
            city: "Ikeja",
            state: "Lagos",
            password: "mypassword"
        };
        const companyLoginDetails = {
            email: "company3@example.com",
            password: "mypassword"
        };
        //Create company
        agent
            .post('/api/v1/auths/register/company')
            .send(companyInput)
            .expect(200)
            .end(() => {
            //Login to company     
            agent
                .post("/api/v1/auths/login/company")
                .send(companyLoginDetails)
                .expect(200)
                .end((err, res) => {
                //Delete company
                agent
                    .delete(`/api/v1/companies/${res.body._id}`)
                    .set('Cookie', [res.header['set-cookie']])
                    .expect(200)
                    .end((err, res) => {
                    expect(res.statusCode).toEqual(200);
                    expect(res.text).toBe("Company deleted successfully");
                    return done();
                });
            });
        });
    });
});
