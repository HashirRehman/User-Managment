const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Auth = require('../models/Auth');

class AuthService {
  static async register(email, password) {
    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await Auth.create({ email, password });

    const token = AuthService.generateToken(user);

    return { user, token };
  }

  static async login(email, password) {
    const user = await Auth.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = AuthService.generateToken(user);

    return { user, token };
  }

  static generateToken(user) {
    return jwt.sign(
      { uuid: user.uuid, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

module.exports = AuthService;
