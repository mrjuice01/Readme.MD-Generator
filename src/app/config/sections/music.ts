const musicSectionConfig = {
  props: {
    content: {
      type: 'recently',

      recently: {
        user: '',
        count: 5,
      },

      currently: {
        project: 'itstommi',

        itstommi: {
          url: '',
          props: {
            theme: 'dark',
          },
        },

        novatorem: {
          url: '',
        },
      },
    },

    styles: {
      align: 'center',
    },
  },
};

export { musicSectionConfig };
