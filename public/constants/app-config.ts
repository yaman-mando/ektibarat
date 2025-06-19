export const APP_CONFIG = {
  allowedAnswerRemoveTryPerQuestion: 1,
  allowedAnswerHelpTry: Infinity,
  analyticsMinQuestion: 20,
  maxAllowedAnswerCountUnderMinimumTime: Infinity,
};

export const AppTheme = {
  light: 'app-light',
  dark: 'app-dark',
};

export const AppThemeNames = Object.keys(AppTheme).map((key) => {
  return AppTheme[key];
});

export const settingKeys = {
  isSchool: 'isSchool',
};
