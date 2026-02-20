const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ addComponents }) {
  addComponents({
    ".page-wrapper": {
      '@apply pb-14 ltr:ml-0 rtl:mr-0 px-5 xl:px-28 pt-[calc(theme("spacing.topbar")_*_1.2)]':
        {},
      //print
      "@apply ltr:print:ml-0 rtl:print:mr-0 print:p-0": {},
    },
  });
});
