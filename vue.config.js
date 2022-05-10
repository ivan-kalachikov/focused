module.exports = {
  publicPath: '',
  css: {
    sourceMap: true,
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/styles/variables.scss";',
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
