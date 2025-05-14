import {
  addSeconds,
  format,
  intervalToDuration,
  parseISO,
  startOfDay,
} from 'date-fns';
import { arSA as arLocale, enGB as enLocale } from 'date-fns/locale';

export const appDateFormat = {
  default: 'dd/MM/yyyy',
  dayNameOnly: 'EEEE',
  yyyy_mm_dd: {
    dash: 'yyyy-MM-dd',
  },
  defaultWithTime: 'dd/MM/yyyy hh:mm',
  time: {
    hh_mm_ss: 'hh:mm:ss',
    mm_ss: 'mm:ss',
  },
};

export const fns_format = (
  args: {
    date: Date | string | null;
    format: string;
    locale?: string | null;
  } = { date: null, format: '', locale: null }
) => {
  if (args.date) {
    const dateVal =
      args.date instanceof Date ? args.date.toISOString() : args.date;
    if (!args.locale || args.locale === 'ar') {
      return format(parseISO(dateVal), args.format, { locale: arLocale });
    }
    if (args.locale === 'en') {
      return format(parseISO(dateVal), args.format, { locale: enLocale });
    }
  }
};

export const dateUi = (date: string | Date | null) => {
  if (!date) return '';

  return fns_format({ date, format: appDateFormat.default });
};

export const formatContentDate = (value: string | null) => {
  if (!value) return null;
  return dateUi(value);
};

export const timeUiTypeA = (date) => {
  if (!date) return '';

  return format(date, appDateFormat.time.mm_ss);
};

export const timeUi = (date) => {
  if (!date) return '';

  return format(date, appDateFormat.time.hh_mm_ss);
};

export const DateHelper = () => {
  const convertSecondsToLabel_mm_ss = (val) => {
    if (!val || isNaN(val)) return '00:00';
    let date = startOfDay(new Date());
    date = addSeconds(date, val);
    return timeUiTypeA(date);
  };
  const convertSecondTo_hh_mm_ss = (val) => {
    if (!val) return '0';
    const { hours } = intervalToDuration({
      start: 0,
      end: val * 1000,
    });

    let date = startOfDay(new Date());
    date = addSeconds(date, val);
    return hours ? timeUi(date) : timeUiTypeA(date);
  };

  const convertSecondToSecondMinuteFormat = (val) => {
    if (!val) return '0';
    const { minutes, seconds } = intervalToDuration({
      start: 0,
      end: val * 1000,
    });

    const minuteLabel = minutes ? `${minutes} دقيقة ` : '';
    const secondLabel = seconds ? `${seconds} ثانية ` : '';
    const labelListFiltered = [minuteLabel, secondLabel].filter((val) => !!val);
    return labelListFiltered.join(' ');
  };

  return {
    convertSecondToSecondMinuteFormat,
    convertSecondsToLabel_mm_ss,
    convertSecondTo_hh_mm_ss,
  };
};

export const minutesToHHMM = (totalMin) => {
  const hours = Math.floor(totalMin / 60);
  const minutes = Math.floor(totalMin - hours * 60);

  // Padding the values to ensure they are two digits
  let parsedHours = '';
  let parsedMinutes = '';
  if (hours < 10) {
    parsedHours = '0' + hours;
  }

  if (minutes < 10) {
    parsedMinutes = '0' + minutes;
  }

  return parsedHours + ':' + parsedMinutes + ' ساعة';
};
