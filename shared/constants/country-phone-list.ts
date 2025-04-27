export const CountryPhoneList = [
  { id: 1, name: 'السعودية (966+)', code: '966', img: 'sa-flag.png' },
  { id: 2, name: 'الإمارات (971+)', code: '971', img: 'uae-flag.png' },
  { id: 3, name: 'قطر (974+)', code: '974', img: 'qa-flag.png' },
  { id: 4, name: 'مصر (20+)', code: '20', img: 'eg-flag.png' },
  { id: 5, name: 'تركيا (90+)', code: '90', img: 'qa-flag.png' },
];

export const CountryPhoneCodes: Record<
  'SA' | 'QA' | 'AE' | 'EG' | 'TR',
  string
> = {
  SA: '966',
  QA: '974',
  AE: '971',
  EG: '20',
  TR: '90',
};
