import { format, parseISO } from 'date-fns';
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

export const dateUi = (date: string | null) => {
  if (!date) return '';

  return fns_format({ date, format: appDateFormat.default });
};

export const formatContentDate = (value: string | null) => {
  if (!value) return null;
  return dateUi(value);
};
