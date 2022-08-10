const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

module.exports = {
  events: () => {
    return Event.find()
      .populate({
        path: "creator",
        populate: { path: "createdEvents" },
      })
      .then((events) => {
        return events.map((event) => {
          return {
            ...event._doc,
            creator: { ...event._doc.creator._doc, password: null },
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "62f2671949fac466244d3584",
    });
    let createdEvent;
    return event
      .save()
      .then((result) => {
        createdEvent = { ...result._doc };
        return User.findById("62f2671949fac466244d3584");
        console.log(result);
        return { ...result._doc };
      })
      .then((user) => {
        if (!user) {
          throw new Error("user not found");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then((result) => {
        return createdEvent;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("user already exists");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((result) => {
        return { ...result._doc, password: null };
      })
      .catch((err) => {
        throw err;
      });
  },
};
