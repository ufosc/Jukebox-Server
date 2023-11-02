/**
 * @fileoverview Manager for the user model.
 */
import User from "./user.model";
import { UserType } from "./user.types";

export default class UserManager {
  private static instance: UserManager = new UserManager();
  /**
   * Parse the data for a user.
   * Used internally to standardize received data format.
   *
   * @param data The data to parse.
   * @return The parsed data.
   */
  private parseData(data: any) {
    let parsedData = {};

    if (data.username) parsedData = { ...parsedData, username: data.username };
    if (data.password) parsedData = { ...parsedData, password: data.password };
    if (data.accessToken) parsedData = { ...parsedData, accessToken: data.accessToken };
    if (data.refreshToken) parsedData = { ...parsedData, refreshToken: data.refreshToken };
    if (data.id || data._id) parsedData = { ...parsedData, _id: data.id || data._id };

    return parsedData;
  }

  /**
   * Create a new user.
   *
   * @param username The username of the user.
   * @param password The password of the user.
   * @return The created user.
   */
  static async createUser(username: string, password: string, data: any) {
    let parsedData = this.instance.parseData(data);
    let payload = {
      ...parsedData,
      username: username,
      password: password,
    };

    let user = User.create(payload)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw err;
      });

    return user;
  }

  static async createUserFromObject(data: any) {
    let payload = this.instance.parseData(data);

    let user = User.create(payload)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw err;
      });

    return user;
  }

  /**
   * Update a user.
   *
   * @param id The id of the user.
   * @param data The data to update the user with.
   * @return The updated user.
   */
  static async updateUser(id: string, data: any): Promise<UserType> {
    let payload = this.instance.parseData(data);
    let update = await User.findOneAndUpdate({ _id: id }, payload, { new: true })
      .then((user) => {
        if (!user) throw new Error("User not found");
        return user;
      })
      .catch((err) => {
        throw err;
      });

    return update;
  }

  /**
   * Delete a user.
   *
   * @param id The id of the user.
   * @return The deleted user.
   */
  static async deleteUser(id: string) {
    const user = await User.findById(id);

    if (!user) throw new Error("User not found");

    return user
      .deleteOne()
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Get a user.
   *
   * @param id The id of the user.
   * @return The user.
   */
  static async getUser(id: string): Promise<UserType | null> {
    return User.findById(id)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Get all users.
   *
   * @return All users.
   */
  static async getAllUsers() {
    return User.find()
      .then((users) => {
        return users;
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Get a user's access token.
   *
   * @param id The id of the user.
   * @return The user's access token.
   */
  static async getUserAccessToken(id: string) {
    const user: UserType = await User.findById(id)
      .then((user) => {
        if (!user) throw new Error("User not found");
        return user;
      })
      .catch((err) => {
        throw err;
      });

    return user.accessToken;
  }

  /**
   * Get a user's refresh token.
   *
   * @param id The id of the user.
   * @return The user's refresh token.
   */
  static async getUserRefreshToken(id: string) {
    const user: UserType = await User.findById(id)
      .then((user) => {
        if (!user) throw new Error("User not found");
        return user;
      })
      .catch((err) => {
        throw err;
      });

    return user.refreshToken;
  }

  /**
   * Get a user by their access token.
   *
   * @param token The access token of the user.
   * @return The user.
   */
  static async getUserByAccessToken(token?: string) {
    if (!token || token === "") throw new Error("No token provided");

    const user: UserType = await User.findOne({ accessToken: token })
      .then((user) => {
        if (!user) throw new Error("User not found");
        return user;
      })
      .catch((err) => {
        throw err;
      });

    return user;
  }

  /**
   * Get a user by their refresh token.
   *
   * @param token The refresh token of the user.
   * @return The user.
   */
  static async getUserByRefreshToken(token?: string): Promise<UserType> {
    if (!token || token === "") throw new Error("No token provided");

    const user: UserType = await User.findOne({ refreshToken: token })
      .then((user) => {
        if (!user) throw new Error("User not found");
        return user;
      })
      .catch((err) => {
        throw err;
      });

    return user;
  }
}
