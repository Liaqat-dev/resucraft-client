const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ addComponents }) {
  addComponents({
    ".main-footer": {
      "@apply h-14 px-4 border-t left-0 border-gray-200 dark:border-dark-800  absolute inset-x-0 bottom-0 flex items-center container mx-auto ":
        {},
      //modern layout
      "@apply ltr:group-data-[layout=modern]:lg:left-sidebar rtl:group-data-[layout=modern]:lg:right-sidebar":
        {},
      //print
      "@apply print:hidden": {},
      //sidebar-medium
      "@apply ltr:group-data-[sidebar=medium]:lg:left-sidebar-medium rtl:group-data-[sidebar=medium]:lg:right-sidebar-medium":
        {},
      //sidebar-small
      "@apply ltr:group-data-[sidebar=small]:lg:left-sidebar-small rtl:group-data-[sidebar=small]:lg:right-sidebar-small":
        {},
    },
  });
});
