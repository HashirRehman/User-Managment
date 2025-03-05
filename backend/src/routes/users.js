const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { Op } = require("sequelize");

// Get all users with pagination
router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      attributes: ["uuid", "firstName", "lastName", "age", "picture"],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      users: users.rows,
      total: users.count,
      currentPage: page,
      totalPages: Math.ceil(users.count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.findAll({
      where: {
        [Op.or]: [
          {
            firstName: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            lastName: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by UUID
router.get("/:uuid", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
