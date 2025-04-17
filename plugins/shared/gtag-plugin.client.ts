declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export default defineNuxtPlugin((_nuxtApp) => {
  if (!window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YCEZCCLQVG';
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-YCEZCCLQVG');
    };
    document.head.appendChild(script);
  }
});
