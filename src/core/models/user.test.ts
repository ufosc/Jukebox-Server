/**
 * @fileoverview User model tests.
 */
import UserManager from "./user.manager";
import { UserOrNull, UserType } from "./user.types";

describe("User Model", () => {
  let user: UserType;

  beforeEach(async () => {
    user = await UserManager.createUserFromObject({
      username: "test",
      password: "test",
      spotifyAccessToken: "testToken",
      spotifyRefreshToken: "testRefreshToken",
    })
  });

  it("should create a user", async () => {
    let newUser: UserType = await UserManager.createUser("test2", "test2", {});
    expect(newUser.username).toEqual("test2");
  });

  it("should update a user", async () => {
    const updatedUser = await UserManager.updateUser(user.id, {
      username: "test2",
      password: "test2",
    });
    

    expect(updatedUser.username).toEqual("test2");
  });

  it("should delete a user", async () => {
    await UserManager.deleteUser(user.id);
    const deletedUser = await UserManager.getUser(user.id);
    expect(deletedUser).toBeNull();
  });

  it("should get a user", async () => {
    const foundUser: UserOrNull = await UserManager.getUser(user.id);
    expect(foundUser).not.toBeNull();
    expect(foundUser!.id).toEqual(user.id);
  });

  it("should get all users", async () => {
    let users = await UserManager.getAllUsers();
    expect(users).toHaveLength(1);
  });

  it("should get a user's access token", async () => {
    const token = await UserManager.getUserAccessToken(user.id);
    expect(token).toEqual(user.spotifyAccessToken);
  });

  it("should get a user's refresh token", async () => {
    const token = await UserManager.getUserRefreshToken(user.id);
    expect(token).toEqual(user.spotifyRefreshToken);
  });

  it("should get a user by their access token", async () => {
    const token = user.spotifyAccessToken;
    const foundUser = await UserManager.getUserByAccessToken(token);

    expect(foundUser.id).toEqual(user.id);
  });

  it("should get a user by their refresh token", async () => {
    const token = user.spotifyRefreshToken;
    const foundUser = await UserManager.getUserByRefreshToken(token);

    expect(foundUser.id).toEqual(user.id);
  });
});
