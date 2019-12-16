import moment from 'moment';

const monthName = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const monthSelect = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const getGreetingTime = (currentTime, user = null) => {
  if (!currentTime || !currentTime.isValid()) {
    return `Hello ${user ? ` ${user}` : ''}`;
  }

  const splitAfternoon = 12; // 24hr time to split the afternoon
  const splitEvening = 17; // 24hr time to split the evening
  const currentHour = parseFloat(currentTime.format('HH'));
  let greetingText = 'Good morning'; // Between dawn and noon

  if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
    // Between 12 PM and 5PM
    greetingText = 'Good afternoon';
  } else if (currentHour >= splitEvening) {
    // Between 5PM and Midnight
    greetingText = 'Good evening';
  }

  return `${greetingText}${user ? `, ${user}` : ''}`;
};

export const getCurrentTime = () => Math.floor(Date.now() / 1000);
export const getCurrentTimeMs = () => Date.now();
export const getTimestampName = () => Date.now() + Math.floor(Math.random() * 9);
export const getDateMonthYear = dateVal =>
  `${dateVal.getDate()} ${monthName[dateVal.getMonth()]} ${dateVal.getFullYear()}`;
export const getMonthDateYear = dateVal =>
  `${monthName[dateVal.getMonth()]}, ${dateVal.getDate()} ${dateVal.getFullYear()}`;
export const getMonthYear = dateVal => `${monthName[dateVal.getMonth()]} ${dateVal.getFullYear()}`;
export const getTimeToNow = (dateValue, withoutSuffix = false) => moment(dateValue).toNow(withoutSuffix);
export const getTimeFromNow = (dateValue, withoutSuffix = false) => moment(dateValue).fromNow(withoutSuffix);
export const getFormatedDate = (dateValue, stringFormat) => moment(dateValue).format(stringFormat);
export const getUTCNow = () => moment().utc();
export const getUTCDateTime = arrDate => moment(arrDate).utc();
export const isBeforeNow = dateValue => {
  const now = getUTCNow();

  return moment(dateValue).isBefore(now);
};
export const getCurrentMonth = () => moment().month() + 1;
export const getCurrentYear = () => moment().year();
export const getMonthSelectOption = () => monthSelect;
export const getYearSelectOption = start => {
  const options = [];
  const currentYear = moment().year();
  for (let index = start; index <= currentYear; index += 1) {
    options.push({ label: index, value: index });
  }

  return options;
};
export const setToTime = (dateValue, h = 0, m = 0, s = 0) => {
  const newDate = moment(dateValue)
    .hours(h)
    .minutes(m)
    .seconds(s);

  return newDate;
};
export const getHumanizedGreeting = (user = null) => getGreetingTime(moment(), user);
