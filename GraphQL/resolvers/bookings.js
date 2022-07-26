const Booking = require("../../models/bookings");
const Event = require("../../models/event");
const { transformBooking } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    // isAuth middleware from app.js passes this information:
    if (!req.isAuth) {
      throw new Error("Unauthorised access for non subscribers");
    }
    try {
      const bookings = await Booking.find();

      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async (args, req) => {
    // isAuth middleware from app.js passes this information:
    if (!req.isAuth) {
      throw new Error("Unauthorised access for non subscribers");
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    // isAuth middleware from app.js passes this information:
    if (!req.isAuth) {
      throw new Error("Unauthorised access for non subscribers");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      console.log(booking);

      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (error) {
      throw error;
    }
  },
};
