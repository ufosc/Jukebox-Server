/**
 * @fileoverview userController unit tests.
 */
import { Request, Response } from "express";
import request from "supertest";
import server from "../../server";
import UserManager from "../../models/user.manager";
import { UserType } from "models/user.model";
import { generateRandomString } from "../../utils/generator";

describe("userController", () => {
  let username = "test";
  let password = "testPass";
  let accessToken = "testToken";
  let user: UserType;

  beforeEach(async () => {
    username = username + generateRandomString(4);
    user = await UserManager.createUser(username, password, {
      accessToken: accessToken,
    });
  });

  it("Should register a user", async () => {
    let newUsername = username + generateRandomString(4);
    const response = await request(server).post("/api/user/register").send({
      username: newUsername,
      password: password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
  });

  it("Should log in a user", async () => {
    const response = await request(server).post("/api/user/login").send({
      username: username,
      password: password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Should get current logged in user", async () => {
    const token = await request(server)
      .post("/api/user/login")
      .send({
        username: username,
        password: password,
      })
      .then((response) => {
        return response.body.token;
      });
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await request(server).get("/api/user/me").set(headers);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
  });
});
