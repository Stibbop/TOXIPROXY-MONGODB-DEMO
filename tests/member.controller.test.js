const MemberController = require("../controllers/MemberController"); //Import MemberController
const Member = require("../models/Member"); //Import Member model

jest.mock("../models/Member"); //Mock Member model

//Mock response object
const mockRes = () => { 
  const res = {};
  res.status = jest.fn().mockReturnValue(res); 
  res.json = jest.fn(); 
  return res;
};

// Test suite for MemberController
describe("Member Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Test case for createMember
  test("createMember should create a member", async () => {
    Member.mockImplementation(() => ({ 
      save: jest.fn().mockResolvedValue(true), // mock function that resolves value to true 
    }));
    //Mock request object
    const req = {
      body: {
        firstName: "John",
        middleName: "A.",
        lastName: "Bistro",
        civilStatus: "Single",
        email: "john2025@gmail.com",
      },
    };
    const res = mockRes(); //Mock response object
    await MemberController.createMember(req, res);
    expect(res.json).toHaveBeenCalled(); //Check if res.json was called
  });
  //Test case for createMember with userID
  test("createMember should create a member with userId", async () => {
    Member.mockImplementation(() => ({ 
      save: jest.fn().mockResolvedValue(true),
    }));
    //Mock request object
    const req = {
      body: {
        firstName: "John",
        middleName: "A.",
        lastName: "Bistro",
        civilStatus: "Single",
        email: "john2025@gmail.com",
        userId: "691e5ba884f35e6b2edd5f7a",
      },
    };
    const res = mockRes(); //Mock response object
    await MemberController.createMember(req, res);
    expect(res.json).toHaveBeenCalled(); //Check if res.json was called
  });
  //Test case for createMember database error handling
  test("createMember should handle errors", async () => {
    Member.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Database error")),
    }));
    const req = {
      body: {
        firstName: "John",
        middleName: "A.",
        lastName: "Bistro",
        civilStatus: "Single",
        email: "john2025@gmail.com",
      },
    };
    const res = mockRes(); //Mock response object
    await MemberController.createMember(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" }); //Check if res.json was called
  });

  //Test case for getAllMembers
  test("getAllMembers should return members", async () => {
    Member.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ firstName: "John" }]),
    });

    const req = {}; //Mock request object
    const res = mockRes(); //Mock response object
    await MemberController.getAllMembers(req, res);
    //Check if res.json was called
    expect(res.json).toHaveBeenCalled();
  });
  //Test case for getAllMembers database error handling
  test("getAllMembers should handle errors", async () => {
    Member.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    const req = {}; //Mock request object
    const res = mockRes(); //Mock response object
    await MemberController.getAllMembers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" }); //Check if res.json was called
  });
  //Test case for getMember by ID
  test("getMember should return a member", async () => {
    Member.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue({ firstName: "John" }),
    });

    const req = { params: { id: "691e5ba884f35e6b2edd5f7a" } }; //Mock request object
    const res = mockRes(); //Mock response object
    await MemberController.getMember(req, res);
    expect(res.json).toHaveBeenCalledWith({ firstName: "John" });  //Check if res.json was called with member data
  });
  //Test case for getMember not found
  test("getMember should return 404 if member not found", async () => {
    Member.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const req = { params: { id: "123" } }; //Mock request object
    const res = mockRes();  //Mock response object

    await MemberController.getMember(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Member not found" }); //Check if res.json was called with not found message
  });
  //Test case for getMember database error handling
  test("getMember should handle errors", async () => {
    Member.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    const req = { params: { id: "123" } }; //Mock request object
    const res = mockRes(); //Mock response object

    await MemberController.getMember(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" }); //Check if res.json was called with error message
  });
  //Test case for updateMember
  test("updateMember should update a member with firstname, email and userID", async () => {
    Member.findByIdAndUpdate = jest.fn().mockResolvedValue({ firstName: "Stibbop", email: "john2026@gmail.com", userId: "user123" });
    //Mock request object
    const req = { 
      params: { id: "123" },
      body: { firstName: "Stibbop", email: "john2026@gmail.com", userId: "user123" }
    };
    const res = mockRes();  //Mock response object

    await MemberController.updateMember(req, res);
    expect(res.json).toHaveBeenCalledWith({ firstName: "Stibbop", email: "john2026@gmail.com", userId: "user123" });  //Check if res.json was called with updated member data
  });
  //Test case for updateMember not found
  test("updateMember should return 404 if member not found", async () => {
    Member.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    //Mock request object
    const req = { 
      params: { id: "123" },
      body: { firstName: "Updated", email: "john2026@gmail.com", userId: "user123" }
    };
    const res = mockRes(); //Mock response object

    await MemberController.updateMember(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Member not found" }); //Check if res.json was called with not found message
  });
  //Test case for updateMember database error handling
  test("updateMember should handle errors", async () => {
    Member.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("Database error"));
    //Mock request object
    const req = { 
      params: { id: "123" },
      body: { firstname: "Updated", email: "john2026@gmail.com", userId: "user123" }
    };
    const res = mockRes();

    await MemberController.updateMember(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" }); //Check if res.json was called with error message
  });
  
  //Test case for updateMember with only firstName
  test("updateMember should update member with only firstName", async () => {
    Member.findByIdAndUpdate = jest.fn().mockResolvedValue({ firstName: "UpdatedName" });
    //Mock request object with only firstName
    const req = { 
      params: { id: "123" },
      body: { firstName: "UpdatedName" } // Only firstName, no email or userId
    };
    const res = mockRes(); //Mock response object

    await MemberController.updateMember(req, res);
    expect(res.json).toHaveBeenCalledWith({ firstName: "UpdatedName" }); //Check if res.json was called with updated member data
  });

  //Test case for updateMember with only email
  test("updateMember should update member with only email", async () => {
    Member.findByIdAndUpdate = jest.fn().mockResolvedValue({ email: "newemail@test.com" });
    //Mock request object with only email
    const req = { 
      params: { id: "123" },
      body: { email: "newemail@test.com" } // Only email, no firstName or userId
    };
    const res = mockRes(); //Mock response object

    await MemberController.updateMember(req, res);
    expect(res.json).toHaveBeenCalledWith({ email: "newemail@test.com" }); //Check if res.json was called with updated member data
  });

  //Test case for updateMember with only userId
  test("updateMember should update member with only userId", async () => {
    Member.findByIdAndUpdate = jest.fn().mockResolvedValue({ user: "newuser123" });
    //Mock request object with only userId
    const req = { 
      params: { id: "123" },
      body: { userId: "1234" } // Only userId, no firstName or email
    };
    const res = mockRes(); //Mock response object

    await MemberController.updateMember(req, res);
    expect(res.json).toHaveBeenCalledWith({ user: "newuser123" }); //Check if res.json was called with updated member data
  });

  //Test case for updateMember with no valid fields
  test("updateMember should handle request with no valid update fields", async () => {
    Member.findByIdAndUpdate = jest.fn().mockResolvedValue({ id: "123" });
    //Mock request object with no valid update fields
    const req = { 
      params: { id: "123" },
      body: { invalidField: "someValue" } // No firstName, email, or userId
    };
    const res = mockRes(); //Mock response object

    await MemberController.updateMember(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: "123" }); //Check if res.json was called with member data
  });

  //Test case for getMembersByUser
  test("getMembersByUser should return members for a user", async () => {
    Member.find = jest.fn().mockResolvedValue([{ firstName: "John" }]);

    const req = { params: { userId: "user123" } }; //Mock request object
    const res = mockRes(); //Mock response object

    await MemberController.getMembersByUser(req, res);
    expect(res.json).toHaveBeenCalledWith([{ firstName: "John" }]); //Check if res.json was called with member data
  });
  //Test case for getMembersByUser no members found
  test("getMembersByUser should return 404 if no members found", async () => {
    Member.find = jest.fn().mockResolvedValue([]);

    const req = { params: { userId: "user123" } }; //Mock request object
    const res = mockRes(); //Mock response object

    await MemberController.getMembersByUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No members found for this user" }); //Check if res.json was called with not found message
  });
  //Test case for getMembersByUser error handling
  test("getMembersByUser should handle errors", async () => {
    Member.find = jest.fn().mockRejectedValue(new Error("Database error"));

    const req = { params: { userId: "user123" } }; //Mock request object
    const res = mockRes(); //Mock response object

    await MemberController.getMembersByUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" }); //Check if res.json was called with error message
  });
});
