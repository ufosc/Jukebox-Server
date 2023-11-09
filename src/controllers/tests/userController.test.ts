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
    username = username + generateRandomString(5);
    user = await UserManager.createUser(username, password, {
      accessToken: accessToken,
    });
  });

  it("Should sign up a user", async () => {
    let newUsername = generateRandomString(10);
    const response = await request(server).post("/api/user/signup").send({
      username: newUsername,
      password: password,
    });
    expect(response.statusCode).toBe(200);
  });
  
  it("Should log in a user", async () => {
    const response = await request(server).post("/api/user/login").send({
      username: username,
      password: password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body.accessToken).toEqual(accessToken);
  });
  
  it("Should get current logged in user", async () => {
    const response = await request(server).get("/api/user/me");
    expect(response.statusCode).toBe(200);
  });
});
