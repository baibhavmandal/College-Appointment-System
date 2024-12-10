const Joi = require("joi");

const validateUniqueDates = require("../utils/validateUniqueDates.js");

// Custom validator for time range in the format "HH:MM - HH:MM"
const validateTimeRangeArray = (value, helpers) => {
  const [start, end] = value.split(" - ").map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(1970, 0, 1, hours, minutes);
  });

  if (start >= end) {
    return helpers.message(
      `Invalid time range: "${value}". "start_time" must be earlier than "end_time".`
    );
  }

  return value;
};

// Custom validator to check start_time < end_time in appointment schemas
const validateTimeRange = (value, helpers) => {
  const [startHours, startMinutes] = value.start_time.split(":").map(Number);
  const [endHours, endMinutes] = value.end_time.split(":").map(Number);
  const startDate = new Date(1970, 0, 1, startHours, startMinutes);
  const endDate = new Date(1970, 0, 1, endHours, endMinutes);

  if (startDate >= endDate) {
    return helpers.message(`"start_time" must be earlier than "end_time".`);
  }

  return value;
};

// Common schema for free slot times and date validation
const freeSlotSchema = Joi.object({
  date: Joi.date().min("now").required().messages({
    "date.now": "Date must be today or in the future.",
  }),
  times: Joi.array()
    .items(
      Joi.string()
        .custom(validateTimeRangeArray, "time range validation")
        .required()
    )
    .required()
    .messages({
      "string.base":
        "Each time slot must be a string in 'HH:MM - HH:MM' format.",
    }),
});

// Email and Password Validation
const validateEmailAndPassword = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).max(20).required().messages({
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password cannot exceed 20 characters.",
      "any.required": "Password is required.",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

// Slot Details Validation
const validateSlotDetails = (data) => {
  const schema = Joi.array()
    .items(freeSlotSchema)
    .custom((value, helpers) => {
      if (!validateUniqueDates(value)) {
        return helpers.error(
          "any.custom",
          "Free slots cannot have duplicate dates."
        );
      }
      return value;
    })
    .messages({
      "any.custom": "Free slots cannot have duplicate dates.",
    });
  return schema.validate(data, { abortEarly: false });
};

// Free Slot Update Validation
const validateFreeSlotUpdate = (data) => {
  return freeSlotSchema.validate(data, { abortEarly: false });
};

// Appointment Acceptance Validation
const validateAppointmentAcceptance = (data) => {
  const schema = Joi.object({
    appointment_id: Joi.string().required().messages({
      "any.required": "Appointment ID is required.",
    }),
    status: Joi.string()
      .valid("accepted", "declined", "pending")
      .default("pending")
      .messages({
        "any.only": "Status must be one of: accepted, declined, or pending.",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

// Appointment Request Validation
const validateAppointmentRequest = (data) => {
  const schema = Joi.object({
    professor_id: Joi.string().required().messages({
      "any.required": "Professor ID is required.",
    }),
    date: Joi.date().min("now").required().messages({
      "date.min": "Date must be today or in the future.",
      "any.required": "Date is required.",
    }),
    start_time: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "Start time must be in 'HH:MM' format.",
        "any.required": "Start time is required.",
      }),
    end_time: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "End time must be in 'HH:MM' format.",
        "any.required": "End time is required.",
      }),
  }).custom(validateTimeRange);

  return schema.validate(data, { abortEarly: false });
};

// Check Free Slot Validation
const validateCheckFreeSlotsSchema = (data) => {
  const schema = Joi.object({
    professor_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Professor ID must be a valid ObjectId.",
        "any.required": "Professor ID is required.",
        "string.empty": "Professor ID cannot be empty.",
      }),
  });

  return schema.validate(data);
};

module.exports = {
  validateEmailAndPassword,
  validateSlotDetails,
  validateFreeSlotUpdate,
  validateAppointmentAcceptance,
  validateAppointmentRequest,
  validateCheckFreeSlotsSchema,
};
