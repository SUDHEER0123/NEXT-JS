import { format, parse } from 'date-fns';

/**
 * Formats a given date into the specified format.
 * @param date - The date to format. Can be a Date object, a timestamp, or an ISO string.
 * @param dateFormat - The format string (e.g., 'yyyy-MM-dd', 'MMMM d, yyyy', etc.).
 * @returns The formatted date string.
 */
export const formatDate = (date: Date | number | string | undefined, dateFormat = 'E, dd MMM yyyy'): string => {
  try {
    if (!date) return '';
    const str = date.toString().trim();
    const normalized = str.includes('+') ? str.split('+')[0] : str;
    let parsedDate: Date;
    if (!isNaN(Date.parse(normalized))) {
      parsedDate = new Date(normalized.includes('Z') ? normalized : normalized + 'Z');
    } else if (normalized.includes('/')) {
      parsedDate = parse(normalized, 'dd/MM/yyyy', new Date());
    } else {
      parsedDate = parse(normalized, 'E, dd MMM yyyy', new Date());
    }

    return format(parsedDate, dateFormat);
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return '';
  }
};

/**
 * Formats a date to include the time and the timezone offset.
 * @param date - The date to format. Can be a Date object, a timestamp, or an ISO string.
 * @returns The formatted date string (e.g., '12:32 GMT+9').
 */
export const formatDateWithTimeZone = (date: Date | number | string): string => {
  try {
    const parsedDate = new Date(date); // Ensure the date is a Date object

    // Get time components
    const hours = parsedDate.getHours().toString().padStart(2, '0');
    const minutes = parsedDate.getMinutes().toString().padStart(2, '0');

    // Get timezone offset in hours
    const timezoneOffsetMinutes = parsedDate.getTimezoneOffset();
    const timezoneOffsetHours = -Math.floor(timezoneOffsetMinutes / 60); // Negative because getTimezoneOffset is in reverse
    const timezoneSign = timezoneOffsetHours >= 0 ? '+' : '-';

    return `${hours}:${minutes} GMT${timezoneSign}${Math.abs(timezoneOffsetHours)}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
