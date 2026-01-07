// Mock toxiproxy-node-client 
const mockToxiproxyInstance = {
  getProxy: jest.fn(),
  createProxy: jest.fn()
};
//Mock toxiproxy package
jest.mock("toxiproxy-node-client", () => ({
  Toxiproxy: jest.fn(() => mockToxiproxyInstance)
}));

const { setupProxy } = require("../Toxiproxy.js"); //Import Toxiproxy.js

//Test suite for Toxiproxy
describe("Toxiproxy Tests", () => {
  let consoleSpy; //Initialize consoleSpy

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
      // Reset mock implementations
    mockToxiproxyInstance.getProxy.mockReset();
    mockToxiproxyInstance.createProxy.mockReset();
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  //Test case for Toxiproxy - should use existing proxy
  test("setupProxy should use existing proxy and add latency toxic", async () => {
    const mockAddToxic = jest.fn().mockResolvedValue({ type: "latency" });
    //Fake existing proxy object
    const existingProxy = {
      listen: "0.0.0.0:8666",
      addToxic: mockAddToxic
    };
    //There is an existing proxy
    mockToxiproxyInstance.getProxy.mockResolvedValue(existingProxy);

    await setupProxy();

    expect(mockToxiproxyInstance.getProxy).toHaveBeenCalledWith("members_proxy"); //Check if getProxy was called
    expect(mockToxiproxyInstance.createProxy).not.toHaveBeenCalled(); //createProxy should NOT be called because no need to create new proxy
    expect(mockAddToxic).toHaveBeenCalledWith({
      type: "latency",
      attributes: {
        latency: 2000,
        jitter: 100
      },
      stream: "upstream"
    }); //Confirms correct latency configuration used
    expect(consoleSpy.log).toHaveBeenCalledWith("Proxy already exists:", "0.0.0.0:8666");
    expect(consoleSpy.log).toHaveBeenCalledWith("Latency toxic added:", "latency");
    expect(consoleSpy.log).toHaveBeenCalledWith("Now you can make POST/GET requests to http://localhost:8666/members to see latency effect.");
  });

  //Test case for setupProxy - should create proxy when it doesn't exist
  test("setupProxy should create proxy and add latency toxic", async () => {
    const mockAddToxic = jest.fn().mockResolvedValue({ type: "latency" });
    const newProxy = {  
      listen: "0.0.0.0:8666",
      addToxic: mockAddToxic
    };
    
    mockToxiproxyInstance.getProxy.mockRejectedValue(new Error("Proxy not found")); //Simulate proxy not found
    mockToxiproxyInstance.createProxy.mockResolvedValue(newProxy); //Simulate successful proxy creation

    await setupProxy();

    expect(mockToxiproxyInstance.getProxy).toHaveBeenCalledWith("members_proxy"); //Check if getProxy was called
    expect(mockToxiproxyInstance.createProxy).toHaveBeenCalledWith({
      name: "1members_proxy",
      listen: "0.0.0.0:8666",
      upstream: "host.docker.internal:3000"
    }); //Check if createProxy was called with correct config
    expect(mockAddToxic).toHaveBeenCalledWith({
      type: "latency",
      attributes: {
        latency: 2000,
        jitter: 100
      },
      stream: "upstream"
    }); //Check if addToxic was called with correct parameters
    expect(consoleSpy.log).toHaveBeenCalledWith("Proxy created:", "0.0.0.0:8666");
    expect(consoleSpy.log).toHaveBeenCalledWith("Latency toxic added:", "latency");
  });

  //Test case for setupProxy error handling
  test("setupProxy should handle errors gracefully", async () => {
    mockToxiproxyInstance.getProxy.mockRejectedValue(new Error("Proxy not found")); //Simulate proxy not found
    mockToxiproxyInstance.createProxy.mockRejectedValue(new Error("Failed to create proxy")); //Simulate proxy creation failure

    await setupProxy();

    expect(mockToxiproxyInstance.getProxy).toHaveBeenCalledWith("members_proxy"); //Check if getProxy was called
    expect(mockToxiproxyInstance.createProxy).toHaveBeenCalled(); //Check if createProxy was attempted
    expect(consoleSpy.error).toHaveBeenCalledWith("Error setting up proxy:", "Failed to create proxy"); //Check if error was logged
  });

  //Test case for setupProxy error during addToxic
  test("setupProxy should handle addToxic errors", async () => {
    const mockAddToxic = jest.fn().mockRejectedValue(new Error("Failed to add toxic")); //Simulate addToxic failure
    const proxy = {
      listen: "0.0.0.0:8666",
      addToxic: mockAddToxic
    };
    //Check if getProxy was called
    mockToxiproxyInstance.getProxy.mockResolvedValue(proxy);

    await setupProxy();

    expect(mockAddToxic).toHaveBeenCalled(); //Check if addToxic was called
    expect(consoleSpy.error).toHaveBeenCalledWith("Error setting up proxy:", "Failed to add toxic"); //Check if error was logged
  });
});


