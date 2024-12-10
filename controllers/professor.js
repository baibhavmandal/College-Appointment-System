const {
  validateAppointmentAcceptance,
  validateSlotDetails,
} = require("../validators/validators.js");

// Models
const Professor = require("../model/professor.js");
const Appointment = require("../model/appointment.js");
const Slot = require("../model/slot.js");

const getAppointments = async (req, res) => {
  const user = req.user;

  const { id, role } = user;

  if (role != "professor") {
    return res.status(403).json({ message: "Invalid URL accessed" });
  }

  const professor = await Professor.findById(id);

  if (!professor) {
    return res.status(404).json({ message: "User not found" });
  }

  const appointments = await Appointment.find({ professor_id: id });

  if (!appointments) {
    return res.end("No appointments scheduled");
  }

  res.json(appointments);
};

const acceptAppointment = async (req, res) => {
  const data = req.body;
  const { error } = validateAppointmentAcceptance(data);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
  }

  const user = req.user;

  const { role } = user;

  if (role != "professor") {
    return res.status(403).json({ message: "Invalid URL accessed" });
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    data.appointment_id,
    { status: data.status }
  );

  if (!updatedAppointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  res.json(updatedAppointment);
};

const allotFreeSlots = async (req, res) => {
  const data = req.body;

  const { error } = validateSlotDetails(data);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
  }

  const user = req.user;

  const { id, role } = user;

  if (role != "professor") {
    return res.status(403).json({ message: "Invalid URL accessed" });
  }

  const professor = await Professor.findById(id);

  if (!professor) {
    return res.status(404).json({ message: "User not found" });
  }

  const slotExist = await Slot.findOne({ professor_id: id });

  if (slotExist) {
    return res.status(400).json({
      message:
        "Unable to add free slots: Professor already has existing free slots. Please update or clear the existing slots first.",
    });
  }

  const newSlot = new Slot({
    professor_id: id,
    free_slots: data,
  });

  const slot = await newSlot.save();

  res.json(slot);
};

module.exports = {
  getAppointments,
  acceptAppointment,
  allotFreeSlots,
};
