import request from "supertest";
import app from "../app";
import { connect, clearDatabase, closeDatabase} from "./db/db"

jest.setTimeout(10000) 
const agent = request.agent(app);
const baseURL = "/api/v1"

beforeAll( () =>  connect());

afterAll( () =>   closeDatabase());

afterEach( () =>  clearDatabase())

describe("Officer status count", () => {
  let company: string;
  let officer: string;
  let sender: string; 
  let receiver: string;
  let officerPendingCount: number
  let officerViewedCount: number
  let officerPickedCount: number
  let officerTransitCount: number
  let order: string

  beforeEach(async () => {

    //Create company
    const companyInput = {
      name: "company2",
      email:"company2@example.com",
      phoneNumber: "2348080425123",
      city: "Onitsha",
      state: "Anambra",
      password: "mypassword",
      confirmPassword: "mypassword"
    }  
  
    await agent.post(`${baseURL}/auths/register/company`).send(companyInput)
    

    const companyRes = await agent.post(`${baseURL}/auths/login`).send({email:"company2@example.com", password: "mypassword"})
    company = companyRes.body._id
    const companyCookies = companyRes.get("Set-Cookie")
    
    //Create Officer
    const officerDetails = {
      name: "Joy",
      address: "Headbridge",
      company,
      location: "Main mkt",
      phoneNumber: "08033548",
      password: "mypassword",
      confirmPassword: "mypassword",
    }

    await agent.post(`${baseURL}/auths/register/officer`)
                                            .set('Cookie', companyCookies)
                                            .send(officerDetails)
    
    const officerRes = await agent.post(`${baseURL}/auths/login`).send({phoneNumber: "08033548", password: "mypassword"})
    officer = officerRes.body._id;

    //Create Sender
    const senderDetails = {
      name: "Favor",
      phoneNumber: "0802566551",
      address: "05 Lagos Street",
      location: "Okota"
    }

    const senderRes = await agent.post(`${baseURL}/senders`).send(senderDetails);

    sender = senderRes.body._id;

  //Create receiver
    const receiverDetails = { 
      name: "Oma",
      phoneNumber: "+23458214",
      city: "Enugu"
    }
  
    const receiverRes = await agent.post(`${baseURL}/receivers/senders/${sender}`).send(receiverDetails)
  
    receiver = receiverRes.body._id

   //get officer's current status count
    const {body} = await agent.get(`${baseURL}/officers/${officer}/companies/${company}`)
    
    officerPendingCount = body.statusCount.pending
    officerViewedCount = body.statusCount.viewed
    officerPickedCount = body.statusCount.picked
    officerTransitCount = body.statusCount.transit 

    //create order
    const orderdetail = {
      content: "weavon",
      company,
      receiver,
      sender,
      officer,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: 500,
      RegisteredWaybill: false,
      orderDate: "2022-01-01"
    } 

   const res = await agent.post(`${baseURL}/orders`).send(orderdetail)
   order = res.body._id
 
  })   
  

  it("Should increase officer pending count by 1 when new order is created", async () => {
    //get new pending count of the officer
    
    const { body } = await agent.get(`${baseURL}/officers/${officer}/companies/${company}`)
    

    expect(body.statusCount.pending).toEqual(officerPendingCount + 1)    

  })

  it("Should increase officer viewed count by 1 when order status is updated", async () => {
    //Update order status
    const updateDetail= {      
      status: "Viewed",
    } 
    
    await agent.put(`${baseURL}/orders/${order}`).send(updateDetail)
    
    //get new pending count of the officer
    
    const { body } = await agent.get(`${baseURL}/officers/${officer}/companies/${company}`)
   

    expect(body.statusCount.viewed).toEqual(officerViewedCount + 1)       
         

  })

  it("Should increase officer picked count by 1 when order status is updated", async () => {
    //Update order status
    const updateDetail= {      
      status: "Received",
    } 
    
    await agent.put(`${baseURL}/orders/${order}`).send(updateDetail)
    
    //get new pending count of the officer
    
    const { body } = await agent.get(`${baseURL}/officers/${officer}/companies/${company}`)
   

    expect(body.statusCount.picked).toEqual(officerPickedCount + 1)       

  })
  it("Should increase officer transit count by 1 when order status is updated", async () => {
    //Update order status
    const updateDetail= {      
      status: "On Transit",
    } 
    
    await agent.put(`${baseURL}/orders/${order}`).send(updateDetail)
    
    //get new pending count of the officer
    
    const { body } = await agent.get(`${baseURL}/officers/${officer}/companies/${company}`)
   

    expect(body.statusCount.transit).toEqual(officerTransitCount + 1)       

  })
})
