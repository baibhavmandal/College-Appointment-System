const express = require("express");

// import controllers
const {
  checkAppointmentStatus,
  requestAppointment,
  checkFreeSlot,
} = require("../controllers/student.js");

const router = express.Router();

router
  .get("/appointments/status", checkAppointmentStatus)
  .post("/appointments/request", requestAppointment)
  .post("/slot/checkfreeslot", checkFreeSlot);

module.exports = router;
