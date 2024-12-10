const isTimeGreaterOrEqual = (time1, time2) => {
  const date1 = new Date(`1970-01-01T${time1}:00Z`);
  const date2 = new Date(`1970-01-01T${time2}:00Z`);
  return date1 >= date2;
};

const validateAppointmentWithFreeSlots = (
  appointmentRequest,
  availableSlots
) => {
  const {
    date,
    start_time: requestStartTime,
    end_time: requestEndTime,
  } = appointmentRequest;

  const matchingFreeSlot = availableSlots.find((slot) => {
    const freeSlotDate = slot.date;
    const requestDate = new Date(date);

    return (
      freeSlotDate.toISOString().split("T")[0] ===
      requestDate.toISOString().split("T")[0]
    );
  });

  if (!matchingFreeSlot || !matchingFreeSlot.times.length) {
    return false;
  }

  for (const timeRange of matchingFreeSlot.times) {
    const [slotStartTime, slotEndTime] = timeRange.split(" - ");

    if (
      isTimeGreaterOrEqual(requestStartTime, slotStartTime) &&
      isTimeGreaterOrEqual(slotEndTime, requestEndTime)
    ) {
      return true;
    }
  }

  return false;
};

module.exports = validateAppointmentWithFreeSlots;
