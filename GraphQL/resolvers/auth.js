const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
// the problem with this function is that I can't hide the password in creator.  how can I mask it by default from User?

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("user already exists");
      }
      //   if user doesn't exist already, then ...
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return {
        ...result._doc,
        password: null,
      };
    } catch (error) {
      throw error;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("user does not exist in database");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("passwords do not match");
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "secretkey",
      { expiresIn: "1h" }
    );
    return { userId: user._id, token: token, tokenExpiration: 1 };
  },
};
