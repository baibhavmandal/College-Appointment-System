const express = require("express");

// import controllers
const {
  getAppointments,
  acceptAppointment,
  allotFreeSlots,
} = require("../controllers/professor.js");

const router = express.Router();

router
  .get("/appointments", getAppointments)
  .post("/appointments/accept", acceptAppointment)
  .post("/slot/allotfreeslots", allotFreeSlots);

module.exports = router;
