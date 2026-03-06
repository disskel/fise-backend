const { format, addDays } = require('date-fns');

const formatExcelDate = (excelDate) => {
  if (!excelDate) return null;
  // Excel cuenta los días desde el 30/12/1899
  const date = addDays(new Date(1899, 11, 30), excelDate);
  return format(date, 'yyyy-MM-dd');
};

const formatDateForDB = (date) => {
  if (!date) return null;
  return format(new Date(date), 'yyyy-MM-dd');
};

module.exports = { formatExcelDate, formatDateForDB };