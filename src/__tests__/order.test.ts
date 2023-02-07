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

let companyId: string = ""
let officerId: string = ""
let senderId: string = ""
let orderId: string = ""
let receiverId: string = ""  

const companyInput = {
  name: "company2",
  email:"company2@example.com",
  phoneNumber: "2348080425123",
  city: "Onitsha",
  state: "Anambra",
  password: "mypassword"
}

const companyLoginDetails = {
  email: "company2@example.com",
  password: "mypassword"
}

const OfficerAccountDetails = {
  name: "Malik",
  password: "mypassword",
  address: "Headbridge",
  companyId: "",
  location: "Main mkt",
  phoneNumber: "080735483654"
}

const officerLoginDetails = {
  phoneNumber:  "080735483654",
  password: "mypassword",
}

const senderDetails = {
  name: "Ngozi",
  phoneNumber: "080254654421",
  address: "13 Kano Street",
  location: "Main market"
}

const receiverDetails = { 
  name: "Oma",
  phoneNumber: "+23458214",
  city: "Enugu"
}


describe("Order", () => {
  it("get companyId, officerId, senderId and receiverId", (done) => { 
    
    //create company if doesnot exist
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
      .send({...OfficerAccountDetails, companyId})
      .expect(200)
      .end((err, res) => {
        //Login officer to get the Id
        agent
        .post("/api/v1/auths/login/company")
        .send(officerLoginDetails)
        .expect(200)
        .end((err, res) => {          
          officerId = res.body._id   
          
          //Create sender
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
              return done()
            })
          })
        })
      })
      
    })
  
    })
  })
  it("Should create order successfully", (done) => {
    const orderdetails = {
      content: "weavon",
      companyId,
      receiverId,
      senderId,
      officerId,
      deliveryPoint: "Park",
      deliveryAddress: "Peace Park Upper iweka",
      serviceFee: "500",
      RegisteredWaybill: "false"
    } 

    agent
    .post("/api/v1/orders")
    .send(orderdetails)
    .expect(200)
    .end((err, res) => {
      orderId = res.body._id
      expect(res.statusCode).toEqual(200)
      return done()
    })
  })

  it("Should update order successfully", (done) => {
    const updateDetail= {      
      content: "Wristwatch",
    }    

    agent
    .put(`/api/v1/orders/${orderId}`)
    .send(updateDetail)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body.content).toBe(updateDetail.content)
      return done()
    })
  })

  it("Should get order details with and Id", (done) => {
    agent
    .get(`/api/v1/orders/${orderId}`)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body.deliveryPoint).toBe("Park")
      return done()
    })
  })

  it("should get orders with  start date", (done) => {
    agent
    .get(`/api/v1/orders/companies/${companyId}?startDate=2023-01-01`)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      return done()
    })
  })
 
  it("should get orders with  start date and end date", (done) => {
    agent
    .get(`/api/v1/orders/companies/${companyId}?startDate=2023-01-01&endDate=${new Date()}`)
    .expect(200)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200)
      return done()
    })
  })

  it("Should increase officer pending count by 1 when new order is created", (done) => {
    let pendingOrderCount: number

    const orderDetails = {
      content: "iPhone",
      companyId,
      receiverId,
      senderId,
      officerId,
      deliveryPoint: "Park",
      serviceFee: "500",
      RegisteredWaybill: "false"
    } 
     
    //Let's get the exisiting pending count
    agent
      .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
      .end((err, res) => {        
        pendingOrderCount = res.body.pending
        // Lets create new order
        agent
        .post("/api/v1/orders")
        .send(orderDetails)
        .end(() => {
          //Let's compare result
          agent
            .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
            .end((err, res) => { 
              expect(res.body.pending).toBeGreaterThan(pendingOrderCount)
              return done()
            }) 
        })
    })
  })

  it("Should increase the officer view count and reduce pending count when order status is changed to view", (done) => {

    let pendingOrderCount: number
    let viewedOrderCount: number
    const updateOrderStatus = {
      status: "Viewed"
    }

    //Let's get the exisiting pending counts
    agent
      .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
      .end((err, res) => {        
        pendingOrderCount = res.body.pending
        viewedOrderCount = res.body.viewed

      //let's update an order
      agent
      .put(`/api/v1/orders/${orderId}`)
      .send(updateOrderStatus)
      .end(() => {
        //Lets compare
        agent
          .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
          .end((err, res) => {
            expect(res.body.pending).toBeLessThan(pendingOrderCount)
            expect(res.body.viewed).toBeGreaterThan(viewedOrderCount)
            return done()
          }) 
      })
    })
  })
  it("Should increase the officer  picked count and reduce view count when order status is changed to on-transit", (done) => {

    let viewedOrderCount: number
    let pickedOrderCount: number
    const updateOrderStatus = {
      status: "Received"
    }

    //Let's get the exisiting pending counts
    agent
      .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
      .end((err, res) => {        
        viewedOrderCount = res.body.viewed
        pickedOrderCount = res.body.picked

      //let's update an order
      agent
      .put(`/api/v1/orders/${orderId}`)
      .send(updateOrderStatus)
      .end(() => {
        //Lets compare
        agent
          .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
          .end((err, res) => {
            expect(res.body.viewed).toBeLessThan(viewedOrderCount)
            expect(res.body.picked).toBeGreaterThan(pickedOrderCount)
            return done()
          }) 
      })
    })
  })
  it("Should increase the officer  picked count and reduce view count when order status is changed to Reviewed", (done) => {

    let viewedOrderCount: number
    let pickedOrderCount: number
    const updateOrderStatus = {
      status: "Received"
    }

    //Let's get the exisiting pending counts
    agent
      .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
      .end((err, res) => {        
        viewedOrderCount = res.body.viewed
        pickedOrderCount = res.body.picked

      //let's update an order
      agent
      .put(`/api/v1/orders/${orderId}`)
      .send(updateOrderStatus)
      .end(() => {
        //Lets compare
        agent
          .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
          .end((err, res) => {
            expect(res.body.viewed).toBeLessThan(viewedOrderCount)
            expect(res.body.picked).toBeGreaterThan(pickedOrderCount)
            return done()
          }) 
      })
    })
  })

  it("Should increase the officer transit count and decrease picked count when order status is changed to on-transit", (done) => {

    let pickedOrderCount: number
    let transitOrderCount: number
    const updateOrderStatus = {
      status: "On Transit"
    }

    //Let's get the exisiting pending counts
    agent
      .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
      .end((err, res) => {        
        pickedOrderCount = res.body.picked
        transitOrderCount = res.body.transit

      //let's update an order
      agent
      .put(`/api/v1/orders/${orderId}`)
      .send(updateOrderStatus)
      .end(() => {
        //Lets compare
        agent
          .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
          .end((err, res) => {
            expect(res.body.picked).toBeLessThan(pickedOrderCount)
            expect(res.body.transit).toBeGreaterThan(transitOrderCount)
            return done()
          }) 
      })
    })
  })

  it("Should decrease transit count when order status is changed to Delivered", (done) => {

    let transitOrderCount: number
    const updateOrderStatus = {
      status: "Delivered"
    }

    //Let's get the exisiting pending counts
    agent
      .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
      .end((err, res) => {        
        transitOrderCount = res.body.transit

      //let's update an order
      agent
      .put(`/api/v1/orders/${orderId}`)
      .send(updateOrderStatus)
      .end(() => {
        //Lets compare
        agent
          .get(`/api/v1/officers/${officerId}/companies/${companyId}`)
          .end((err, res) => {
            expect(res.body.transit).toBeLessThan(transitOrderCount)
            return done()
          }) 
      })
    })
  })
})