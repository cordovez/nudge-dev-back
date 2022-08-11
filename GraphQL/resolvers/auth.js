const bcrypt = require("bcryptjs");

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
};
