import request from "supertest";
import { Server } from "http";
import app from "../app";

describe("index.ts", () => {
  let server: Server;

  beforeAll(() => {
    const port = 3001;
    server = app.listen(port);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("starting the server", () => {
    it("should start on given port", async () => {
      expect(server.address()).toEqual(
        expect.objectContaining({
          address: expect.any(String),
          family: expect.any(String),
          port: 3001,
        })
      );
    });
  });

  describe("files route", () => {
    it("should respond to the GET method", async () => {
      const response = await request(app).get("/files");
      expect(response.statusCode).toBe(200);
    });

    it("should receive an array data", async () => {
      const response = await request(app).get("/files");
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should receive an array that contains JSON objects", async () => {
      const response = await request(app).get("/files");
      expect(typeof response.body[0]).toBe("object");
    });
  });
});
