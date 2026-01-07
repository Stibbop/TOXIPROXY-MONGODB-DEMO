const request = require("supertest");
const express = require("express");

// Mock controller methods
jest.mock("../controllers/MemberController", () => ({
  createMember: (req, res) => res.status(200).json({}),
  getAllMembers: (req, res) => res.status(200).json([]),
  getMembersByUser: (req, res) => res.status(200).json([]),
  getMember: (req, res) => res.status(200).json({}),
  updateMember: (req, res) => res.status(200).json({}),
}));

const memberRoutes = require("../routes/MemberRoutes"); //Import member routes

const app = express(); 
app.use(express.json());
app.use("/api/members", memberRoutes);
//Test suite for Member routes
describe("Member Routes Tests", () => {
  //Test Get all members route
  test("GET /api/members should return 200", async () => {
    const res = await request(app).get("/api/members");
    expect(res.statusCode).toBe(200);
  });

  //Test Create member route
  test("POST /api/members should return 200", async () => {
    const res = await request(app)
      .post("/api/members")
      .send({ firstName: "John", middleName: "A.", lastName: "Bistro", civilStatus: "Single", email: "john2025@test.com" });
    expect(res.statusCode).toBe(200);
  });
  
  //Test Get member by ID route
  test("GET /api/members/:id should return 200", async () => {
    const res = await request(app).get("/api/members/123");
    expect(res.statusCode).toBe(200);
  });

    //Test Get member by userID route
  test("GET /api/members/user/:userId should return 200", async () => {
    const res = await request(app).get("/api/members/user/123");
    expect(res.statusCode).toBe(200);
  });

  //Test Update member route
  test("PATCH /api/members/:id should return 200", async () => {
  const res = await request(app)
    .patch("/api/members/123")
    .send({ firstName: "Updated" });
  expect(res.statusCode).toBe(200);
});
});
