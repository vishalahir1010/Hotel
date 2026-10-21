export const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDateOffset = (days, startDate = new Date()) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
};

export const addDaysToDate = (dateString, days) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
};

export const getStayNights = (checkIn, checkOut) => {
  const parseDate = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;

    const [, year, month, day] = match;
    const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day));
    const parsed = new Date(timestamp);
    if (
      parsed.getUTCFullYear() !== Number(year) ||
      parsed.getUTCMonth() !== Number(month) - 1 ||
      parsed.getUTCDate() !== Number(day)
    ) {
      return null;
    }
    return timestamp;
  };

  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (start === null || end === null || end <= start) return 0;

  return (end - start) / 86400000;
};
