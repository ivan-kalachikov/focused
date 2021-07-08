module.exports = {
  css: {
    sourceMap: true,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            'layout-body-background': '#191921',
            'layout-footer-background': '#23232C',
            'component-background': '#23242B',
            'primary-color': '#313DA9',
            'secondary-color': '#313DA9',
            'select-dropdown-bg': '#23242B',
            'select-background': '#23242B',
            'select-border-color': '#45444B',
            'text-color': '#dadada',
            'text-color-secondary': '#bbb',
            'select-item-active-bg': '#191921',
            'select-item-selected-bg': '#191921',
            'icon-color': '#45444B',
            'border-width-base': '1.5px',
            'slider-track-background-color': '#3949D3',
            'slider-track-background-color-hover': '#313DA9',
            'slider-handle-background-color': '#3949D3',
            'slider-handle-color': '#313DA9',
            'slider-handle-color-focus': '#313DA9',
            'slider-rail-background-color': '#393744',
            'slider-rail-background-color-hover': '#393744',
            'slider-disabled-color': '#2a36a0',
            'link-hover-color': '#eee',
            'link-active-color': '#eee',
            'alert-error-bg-color': '#191921',
            'alert-error-border-color': '#5E2551',
            'alert-text-color': '#dadada',
            'alert-message-color': '#dadada',
          },
        },
      },
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('vue-loader')
      .loader('vue-loader-v16')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
};
