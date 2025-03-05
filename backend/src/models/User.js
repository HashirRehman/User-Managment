const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  uuid: { type: DataTypes.STRING, primaryKey: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  picture: { type: DataTypes.STRING },
});

module.exports = User;
