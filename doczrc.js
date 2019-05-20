export default {
  title: 'React Easy CRUD',
  description: 'Library for create easy CRUDs',
  themeConfig: {
    colors: {
      primary: 'salmon',
    },
  },
  modifyBundlerConfig: config => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    return config;
  },
};
