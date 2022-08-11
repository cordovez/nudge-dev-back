const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/bookings");
// const { populate } = require("../../models/event");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      //   old chain:
      //   .populate({
      //     path: "creator",
      //     populate: { path: "createdEvents" },
      //   });
      return events.map((event) => {
        return {
          ...event._doc,
          creator: { ...event._doc.creator._doc, password: null },
        };
      });
    } catch (error) {
      throw error;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find().populate("user").populate("event");

      return bookings.map((booking) => {
        return {
          ...booking._doc,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "62f4ce0322875a23250a7d51",
    });
    let createdEvent;

    try {
      const result = await event.save();
      const creator = await User.findById("62f4ce0322875a23250a7d51");

      createdEvent = {
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: creator,
      };

      if (!creator) {
        throw new Error("user not found");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

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
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "62f3b192f74add192117f8da",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        creator: User.findById("62f3b192f74add192117f8da"),
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
