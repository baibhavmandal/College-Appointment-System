const {
  validateAppointmentRequest,
  validateCheckFreeSlotsSchema,
} = require("../validators/validators.js");
const Professor = require("../model/professor.js");
const Student = require("../model/student.js");
const Appointment = require("../model/appointment.js");
const Slot = require("../model/slot.js");

const validateAppointmentWithFreeSlots = require("../utils/validateAppointmentWithFreeSlots.js");

const checkAppointmentStatus = async (req, res) => {
  const user = req.user;
  const { id, role } = user;

  if (role != "student") {
    return res.status(403).json({ message: "Invalid URL accessed" });
  }

  const student = await Student.findById(id);

  if (!student) {
    return res.status(404).json({ message: "User not found" });
  }

  const appointment = await Appointment.find({ student_id: id });

  if (!appointment) {
    return res.end("No appointments scheduled");
  }

  res.json(appointment);
};
const requestAppointment = async (req, res) => {
  const data = req.body;

  const { error } = validateAppointmentRequest(data);

  if (error) {
    return res.status(400).json({
      sucess: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
  }

  const user = req.user;
  const { id, role } = user;

  if (role != "student") {
    return res.status(403).json({ message: "Invalid URL accessed" });
  }

  const student = await Student.findById(id);

  if (!student) {
    return res.status(404).json({ message: "User not found" });
  }

  const { professor_id, date, start_time, end_time } = data;

  const professor = await Professor.findById(professor_id);

  if (!professor) {
    return res.status(404).json({ message: "Not a valid professor id" });
  }

  const slot = await Slot.findOne({ professor_id: professor_id });

  if (!slot) {
    return res
      .status(404)
      .json({ message: "Professor has not assigned any free slots." });
  }

  const { free_slots } = slot;

  if (!validateAppointmentWithFreeSlots(data, free_slots)) {
    return res.status(400).json({
      message:
        "The requested appointment does not fall within the professor's available free slots. Please choose a valid time slot.",
    });
  }

  const oldAppointment = await Appointment.findOne({ id, professor_id });

  if (oldAppointment) {
    return res.status(409).json({
      message:
        "You already have an appointment scheduled with this professor. Below are the details of your existing appointment.",
      existingAppointment: oldAppointment,
    });
  }

  const newAppointment = new Appointment({
    student_id: id,
    professor_id: professor_id,
    appointment_date: date,
    start_time: start_time,
    end_time: end_time,
  });

  const appointment = await newAppointment.save();

  res.json(appointment);
};
const checkFreeSlot = async (req, res) => {
  const data = req.body;

  const { error } = validateCheckFreeSlotsSchema(data);

  if (error) {
    res.status(400).json({
      sucess: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
  }

  const user = req.user;
  const { id, role } = user;

  if (role != "student") {
    return res.status(403).json({ message: "Invalid URL accessed" });
  }

  const student = await Student.findById(id);

  if (!student) {
    return res.status(404).json({ message: "User not found" });
  }

  const slot = await Slot.findOne({ professor_id: data.professor_id });

  if (!slot) {
    return res
      .status(404)
      .json({ message: "No free slots found for the specified professor." });
  }

  res.json(slot);
};

module.exports = { checkAppointmentStatus, requestAppointment, checkFreeSlot };
