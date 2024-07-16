import axiosInstance from "../axiosInstance";
import axiosMockAdapter from "axios-mock-adapter";

describe("axiosInstance", () => {
  let mock: axiosMockAdapter;

  beforeEach(() => {
    mock = new axiosMockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should have the correct baseURL", () => {
    expect(axiosInstance.defaults.baseURL).toBe(
      process.env.REACT_APP_API_BASE_URL ||
        `http://localhost:${process.env.REACT_APP_API_PORT}`
    );
  });

  it("should make a GET request successfully", async () => {
    const mockData = { data: "test data" };

    mock.onGet("/test-endpoint").reply(200, mockData);

    const response = await axiosInstance.get("/test-endpoint");

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });

  it("should handle a GET request error", async () => {
    mock.onGet("/test-endpoint").reply(500);

    await expect(axiosInstance.get("/test-endpoint")).rejects.toThrow(
      expect.objectContaining({
        response: expect.objectContaining({
          status: 500,
        }),
      })
    );
  });

  it("should make a POST request successfully", async () => {
    const requestData = { key: "value" };
    const mockResponseData = { data: "response data" };

    mock.onPost("/test-endpoint", requestData).reply(200, mockResponseData);

    const response = await axiosInstance.post("/test-endpoint", requestData);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponseData);
  });

  it("should handle a POST request error", async () => {
    const requestData = { key: "value" };

    mock.onPost("/test-endpoint", requestData).reply(500);

    await expect(axiosInstance.post("/test-endpoint", requestData)).rejects.toThrow(
      expect.objectContaining({
        response: expect.objectContaining({
          status: 500,
        }),
      })
    );
  });
});
