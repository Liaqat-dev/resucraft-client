const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ addComponents }) {
  addComponents({
    ".main-topbar": {
      "@apply fixed top-0 left-0 right-0 h-topbar z-[1003] transition-all duration-200 ease-linear":
        {},
      "@apply print:hidden": {},
      ".navbar-brand": {
        "@apply flex items-center ltr:pl-4 rtl:pr-4 h-topbar md:group-data-[layout=default]:w-sidebar shrink-0":
          {},
        ".logos": {
          "@apply group-data-[layout=semibox]:hidden": {},
        },
      },
      ".main-topbar-wrapper": {
        "@apply bg-white border-b border-gray-200": {},
        //dark mode
        "@apply dark:bg-dark-900 dark:border-dark-800": {},
      },
      "@media (max-width: 575.98px)": {
        ".notification-dropdown": {
          "@apply min-w-72 !inset-x-4": {},
        },
      },
    },
    ".topbar-link": {
      "@apply flex items-center justify-center text-gray-500 border hover:text-gray-800 border-transparent rounded-md size-9 h-topbar dark:hover:text-dark-200 transition-all duration-200 ease-linear group-data-[nav-type=pattern]:text-white/75 group-data-[nav-type=pattern]:hover:text-white":
        {},
    },
    ".sidebar-toggle": {
      "@apply flex items-center justify-center ltr:group-data-[layout=default]:ml-2 rtl:group-data-[layout=default]:mr-2 text-gray-500 dark:text-dark-500 border border-transparent rounded-md size-9":
        {},
    },
  });
});
