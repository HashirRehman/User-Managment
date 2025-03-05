const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auth = require("../models/Auth");

class AuthService {
  static async register(email, password) {
    try {
      const existingUser = await Auth.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await Auth.create({ email, password });
      const token = jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const user = await Auth.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      return { user, token };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
