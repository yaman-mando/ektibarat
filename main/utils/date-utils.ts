import {
  addSeconds,
  format,
  intervalToDuration,
  min,
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

export const dateDayName = (date) => {
  if (!date) return '';

  return format(parseISO(date), appDateFormat.dayNameOnly, {
    locale: arLocale,
  });
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

export const dateTimeUi = (date) => {
  if (!date) return '';

  return fns_format({ date, format: appDateFormat.defaultWithTime });
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

export const minutesToHHMM = (totalMin,withText=true) => {
  if(totalMin <=0) return '--'
  const hours = Math.floor(totalMin / 60);
  const minutes = Math.floor(totalMin - hours * 60);

  // Padding the values to ensure they are two digits
  let parsedHours:any = hours;
  let parsedMinutes:any = minutes;
  if (hours < 10) {
    parsedHours = '0' + hours;
  }

  if (minutes < 10) {
    parsedMinutes = '0' + minutes;
  }

  const text = hours>0?'ساعة':'دقيقة'

  return parsedHours + ':' + parsedMinutes + (withText?text:'');
};

export const secondsToMMSS = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parsedMinutes = String(minutes).padStart(2, '0');
  const parsedSeconds = String(seconds).padStart(2, '0');

  return `${parsedMinutes}:${parsedSeconds}`;
};


export const secondsToHHMMSS = (totalSeconds) => {
  totalSeconds = Number(totalSeconds);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  const parts: string[] = [];

  const getArabicUnit = (value, singular, dual, plural) => {
    if (value === 1) return `${singular}`;
    if (value === 2) return `${dual}`;
    if (value < 11) return `${value} ${plural}`;
    return `${value} ${singular}`;
  };

  if (h > 0) {
    parts.push(getArabicUnit(h, 'ساعة', 'ساعتين', 'ساعات'));
  }

  if (m > 0) {
    parts.push(getArabicUnit(m, 'دقيقة', 'دقيقتين', 'دقائق'));
  }

  if (s > 0) {
    parts.push(getArabicUnit(s, 'ثانية', 'ثانيتين', 'ثوان'));
  }

  if (parts.length === 0) {
    return 0;
  }

  return parts.join(' و ');
};

export const dateDayUi = (date) => {
  if (!date) return '';

  return (
    format(parseISO(date), appDateFormat.dayNameOnly, { locale: arLocale }) +
    ' - ' +
    fns_format({ date, format: appDateFormat.default })
  );
};

export const formatStoSSMM_MMHH = (seconds?: number) => {
  if (seconds == null || seconds <= 0) return '--';

  const totalSeconds = Math.floor(seconds);

  if (totalSeconds < 60) {
    // MM:SS
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor(totalSeconds / 60); 
    const secs = totalSeconds % 60;
    return `${String(secs).padStart(2, '0')} ثانية`;
  } else {
    // HH:MM
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }
};

export const formatStoSSMM_MMHHWithText = (
  seconds?: number,
  showText = true,
  alter = '--'
) => {
  if (seconds == null || seconds <= 0) {
    return alter;
  }

  const totalSeconds = Math.floor(seconds);

  
  if (totalSeconds < 60) {
    const secs = totalSeconds % 60;
    return `${String(secs).padStart(2, '0')}${showText ? ' ثانية' : ''}`;
  }

  
  if (totalSeconds < 3600) {
    const mins = Math.floor(totalSeconds / 60);
    return `${String(mins).padStart(2, '0')}${showText ? ' دقيقة' : ''}`;
  }

  
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}${
    showText ? ' ساعة' : ''
  }`;
};



export const formatStoMMHH = (seconds?: number) => {
  if (!seconds || seconds < 60) {
    return '--'; 
  }

  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const formatStoMMHHWithText = (seconds?: number, showText = true,alter='--') => {
  if (!seconds || seconds < 60) {
    return alter; 
  }

  const totalSeconds = Math.floor(seconds); 
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  if (hrs < 1) {
    return `${String(mins).padStart(2, '0')}${showText ? ' دقيقة' : ''}`;
  }

  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}${showText ? ' ساعة' : ''}`;
};


export function formatNumberFloatWithComma(num,comma=2) {
  if (Number.isInteger(num)) {
    return num.toString();
  } else {
    return num.toFixed(comma).replace(/\.?0+$/, '');
  }
}

export function formatNoData(data: any,alter='--') {
  if (!data || data <= 0) {
    return alter
  }
  return data
}