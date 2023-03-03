import request from "supertest";
import app from "../app";
import { connect, clearDatabase, closeDatabase} from "./db/db"

jest.setTimeout(10000) 
const agent = request.agent(app);
const baseURL = "/api/v1"

beforeAll( () =>  connect());

afterAll( () =>   closeDatabase());

afterEach( () =>  clearDatabase())

describe("Order", () => {

  let company: string;
  let officer: string;
  let sender: string; 
  let receiver: string;

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

  })

  it("Should create order successfully", async () => {

    const orderdetails = {
      content: "weavon",
      company,
      receiver,
      sender,
      officer,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: 500,
      RegisteredWaybill: false
    } 

    const { body, statusCode } = await agent.post(`${baseURL}/orders`).send(orderdetails)

    expect(statusCode).toEqual(201)
    expect(body.content).toBe("weavon")
    expect(body.deliveryPoint).toBe("Park")
    expect(body.deliveryAddress).toBe("Peace Park Upper iweka")
    expect(body.serviceFee).toBe(500)
    expect(body.RegisteredWaybill).toBe(false)
  })

  it("Should update order successfully", async () => {
    const orderdetails = {
      content: "weavon",
      company,
      receiver,
      sender,
      officer,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: 500,
      RegisteredWaybill: false
    } 

    const orderRes = await agent.post(`${baseURL}/orders`).send(orderdetails)
    const orderId = orderRes.body._id
    
    const updateDetail= {      
      content: "Wristwatch",
    } 
    
    const { body, statusCode } = await agent.put(`${baseURL}/orders/${orderId}`).send(updateDetail)
    expect(statusCode).toEqual(200)
    expect(body.content).toBe(updateDetail.content)
  })
  
  it("Should get order details using order ID", async () => {
    const orderdetails = {
      content: "weavon",
      company,
      receiver,
      sender,
      officer,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: 500,
      RegisteredWaybill: false
    } 
  
    const orderRes = await agent.post(`${baseURL}/orders`).send(orderdetails)
    const orderId = orderRes.body._id

    const { body, statusCode } = await agent.get(`${baseURL}/orders/${orderId}`)

    expect(statusCode).toEqual(200);
    expect(body.content).toBe("weavon")
    expect(body.deliveryPoint).toBe("Park")
    expect(body.deliveryAddress).toBe("Peace Park Upper iweka")
    expect(body.serviceFee).toBe(500)
    expect(body.RegisteredWaybill).toBe(false)
    expect(body.company.name).toBe("company2")
    expect(body.sender.name).toBe("Favor")
    expect(body.sender.phoneNumber).toBe("0802566551")
    expect(body.sender.address).toBe("05 Lagos Street")
    expect(body.sender.location).toBe("Okota")
    expect(body.officer.name).toBe("Joy")
    expect(body.officer.phoneNumber).toBe("08033548")
    expect(body.officer.location).toBe("Main mkt")
    expect(body.receiver.name).toBe("Oma")
    expect(body.receiver.phoneNumber).toBe("+23458214")
    expect(body.receiver.city).toBe("Enugu")
  })

  it("Should filter orders for a company with a start date", async () => {
    const orderdetail1 = {
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
    const orderdetail2 = {
      content: "wristwatch",
      company,
      receiver,
      sender,
      officer,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: 500,
      RegisteredWaybill: false,
      orderDate: "2022-01-02"
    } 
    const orderdetail3 = {
      content: "Clothings",
      company,
      receiver,
      sender,
      officer,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: 500,
      RegisteredWaybill: false,
      orderDate: "2022-01-03"
    } 
  
    await agent.post(`${baseURL}/orders`).send(orderdetail1)
    await agent.post(`${baseURL}/orders`).send(orderdetail2)
    await agent.post(`${baseURL}/orders`).send(orderdetail3)

    const { body, statusCode } = await agent.get(`${baseURL}/orders/companies/${company}?startDate=2022-01-02`)

    expect(statusCode).toEqual(200);
    expect(body).toHaveLength(2)
    expect(body[0].content).toBe("Clothings")
    expect(body[1].content).toBe("wristwatch")
    
  })

  it("Should filter orders for a company with a start date and end date", async () => {
    const orderdetail1 = {
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
    const orderdetail2 = {
      content: "wristwatch",
      company,
      receiver,
      sender,
      officer,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: 500,
      RegisteredWaybill: false,
      orderDate: "2022-01-02"
    } 
    const orderdetail3 = {
      content: "Clothings",
      company,
      receiver,
      sender,
      officer,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: 500,
      RegisteredWaybill: false,
      orderDate: "2022-01-03"
    } 
  
    await agent.post(`${baseURL}/orders`).send(orderdetail1)
    await agent.post(`${baseURL}/orders`).send(orderdetail2)
    await agent.post(`${baseURL}/orders`).send(orderdetail3)

    const { body, statusCode } = await agent.get(`${baseURL}/orders/companies/${company}?startDate=2022-01-01&endDate=2022-01-02`)
   
    expect(statusCode).toEqual(200);
    expect(body).toHaveLength(2)
    expect(body[0].content).toBe("wristwatch")
    expect(body[1].content).toBe("weavon")    
    
  })

})

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
    
    officerPendingCount = body.pending
    officerViewedCount = body.viewed
    officerPickedCount = body.picked
    officerTransitCount = body.transit

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
    

    expect(body.pending).toEqual(officerPendingCount + 1)    

  })

  it("Should increase officer viewed count by 1 when order status is updated", async () => {
    //Update order status
    const updateDetail= {      
      status: "Viewed",
    } 
    
    await agent.put(`${baseURL}/orders/${order}`).send(updateDetail)
    
    //get new pending count of the officer
    
    const { body } = await agent.get(`${baseURL}/officers/${officer}/companies/${company}`)
   

    expect(body.viewed).toEqual(officerViewedCount + 1)       
         

  })

  it("Should increase officer picked count by 1 when order status is updated", async () => {
    //Update order status
    const updateDetail= {      
      status: "Received",
    } 
    
    await agent.put(`${baseURL}/orders/${order}`).send(updateDetail)
    
    //get new pending count of the officer
    
    const { body } = await agent.get(`${baseURL}/officers/${officer}/companies/${company}`)
   

    expect(body.picked).toEqual(officerPickedCount + 1)       

  })
  it("Should increase officer transit count by 1 when order status is updated", async () => {
    //Update order status
    const updateDetail= {      
      status: "On Transit",
    } 
    
    await agent.put(`${baseURL}/orders/${order}`).send(updateDetail)
    
    //get new pending count of the officer
    
    const { body } = await agent.get(`${baseURL}/officers/${officer}/companies/${company}`)
   

    expect(body.transit).toEqual(officerTransitCount + 1)       

  })
})
