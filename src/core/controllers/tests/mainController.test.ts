/**
 * @fileoverview Test for general api routes.
 */
import request from "supertest";
import server from "../../../server";
import config from "config";

describe("Test the root path", () => {
  test("It should return 200", async () => {
    const response = await request(server).get(config.BASE_ROUTE + "/");
    expect(response.statusCode).toBe(200);
  });
});
