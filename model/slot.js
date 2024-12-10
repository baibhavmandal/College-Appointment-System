const mongoose = require("mongoose");
const validateUniqueDates = require("../utils/validateUniqueDates.js");

const slotSchema = new mongoose.Schema(
  {
    professor_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Professor",
      required: true,
    },
    free_slots: {
      type: [
        {
          date: { type: Date, required: true },
          times: [String], // Array of time strings
        },
      ],
      validate: {
        validator: validateUniqueDates,
        message: "Free slots cannot have duplicate dates.",
      },
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Slot = mongoose.model("Slot", slotSchema);
module.exports = Slot;
