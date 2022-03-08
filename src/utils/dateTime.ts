import { getDate as getDayOfMonth, getMonth, getYear, isValid } from 'date-fns';
import { assert } from './assert';
/**
 * Проверяет строку даты на соответствие формату DD.MM.YYYY
 * @param {string | } dateString
 */
export const isValidDate = (dateString?: Optional<string> | Date) => {
  if (!dateString || !isDDMMYYYYString(`${dateString}`)) {
    return dateString instanceof Date && isValid(dateString);
  }

  assert(typeof dateString === 'string');

  const [day, monthFormat, year] = dateString.split('.').map(Number);
  const month = monthFormat - 1;
  const date = new Date(year, month, day);

  return day === getDayOfMonth(date) && month === getMonth(date) && year === getYear(date);
};

/** Проверяет формат даты DD.MM.YYYY */
export const isDDMMYYYYString = (dateString?: Optional<string>) => {
  return /^(\d\d\.){2}\d{4}$/.test(dateString || '');
};
