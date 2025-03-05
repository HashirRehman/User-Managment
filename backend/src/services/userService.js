const axios = require("axios");
const User = require("../models/User");

const fetchAndStoreUsers = async () => {
  try {
    const { data } = await axios.get("https://randomuser.me/api/?results=20", {
      timeout: 5000,
    });

    if (!data || !data.results) {
      throw new Error("Invalid API response");
    }

    const users = data.results.map((user) => ({
      uuid: user.login.uuid,
      firstName: user.name.first,
      lastName: user.name.last,
      email: user.email,
      age: user.dob.age,
      gender: user.gender,
      city: user.location.city,
      country: user.location.country,
      phone: user.phone,
      picture: user.picture.large,
    }));

    // Log before attempting to store
    console.log(`Attempting to store ${users.length} users`);

    const result = await User.bulkCreate(users, {
      ignoreDuplicates: true,
      returning: true,
    });

    // Log success with number of new users added
    console.log(`Successfully stored ${result.length} new users`);

    return {
      success: true,
      newUsers: result.length,
      totalUsers: await User.count(),
    };
  } catch (error) {
    console.error("Error in fetchAndStoreUsers:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = fetchAndStoreUsers;
