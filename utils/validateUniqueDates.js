const validateUniqueDates = (slots) => {
  const dates = slots.map((slot) => slot.date.toISOString().split("T")[0]);
  const uniqueDates = new Set(dates);
  return dates.length === uniqueDates.size;
};

module.exports = validateUniqueDates;
