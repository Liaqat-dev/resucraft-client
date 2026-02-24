const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ addComponents }) {
  addComponents({
    ".main-footer": {
      "@apply container mx-auto h-14 px-4 border-t left-0 border-gray-200 dark:border-dark-800  absolute inset-x-0 bottom-0 flex items-center ":
        {},
      //print
      "@apply print:hidden": {},
    },
  });
});
