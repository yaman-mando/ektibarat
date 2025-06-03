/** @type {import('tailwindcss').Config} */
module.exports = {
  watcher: {
    usePolling: false, // أو true على حسب النظام
  },
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.{vue,js,html}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    screens: {
      sm: '640px',

      md: '768px',

      lg: '992px',

      xl: '960px', //desktop start

      '2xl': '1400px',
    },
    extend: {
      colors: {
        'purple-8d': 'var(--purple-8d)',
        'purple-af': 'var(--purple-af)',
        'green-8c': 'var(--green-8c)',
        'dark-63': 'var(--dark-63)',
        'gray-be': 'var(--gray-be)',
        'gray-d1': 'var(--gray-d1)',
        'gray-fa': 'var(--gray-fa)',
        'gray-8b': 'var(--gray-8b)',
        'orange-39': 'var(--orange-39)',
        'gray-f2': 'var(--gray-f2)',
        'red-63': 'var(--red-63)',
        'yellow-42': 'var(--yellow-42)',
        'blue-f7': 'var(--blue-f7)',
      },
    },
  },
};
