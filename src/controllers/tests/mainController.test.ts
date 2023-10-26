/**
 * @fileoverview Test for general api routes.
 */
import request from "supertest";
import server from "../../server";

describe("Test the root path", () => {
  test("It should return 200", async () => {
    const response = await request(server).get("/");
    expect(response.statusCode).toBe(200);
  });
});