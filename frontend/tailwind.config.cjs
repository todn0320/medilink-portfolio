/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "noto-sans-KR-black": "var(--noto-sans-KR-black-font-family)",
        "noto-sans-KR-bold": "var(--noto-sans-KR-bold-font-family)",
        "noto-sans-KR-medium": "var(--noto-sans-KR-medium-font-family)",
        "noto-sans-KR-regular": "var(--noto-sans-KR-regular-font-family)",
        "plus-jakarta-sans-bold": "var(--plus-jakarta-sans-bold-font-family)",
        "plus-jakarta-sans-extrabold": "var(--plus-jakarta-sans-extrabold-font-family)",
        "plus-jakarta-sans-medium": "var(--plus-jakarta-sans-medium-font-family)",
        "plus-jakarta-sans-regular": "var(--plus-jakarta-sans-regular-font-family)",
      },
    },
  },
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};