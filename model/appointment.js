const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    professor_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Professor",
      required: true,
    },
    student_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Student",
      required: true,
    },
    appointment_date: {
      type: Date,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "declined", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
