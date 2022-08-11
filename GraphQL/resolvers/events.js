const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map((event) => {
        return transformEvent(event);
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
      creator: "62f3b192f74add192117f8da",
    });
    let createdEvent;

    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById("62f3b192f74add192117f8da");

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
};
