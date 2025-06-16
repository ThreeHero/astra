import webpack from 'webpack'

export function integrationConfig(invalidConfig, env) {
  const config = {};
  config.resolve = { alias: invalidConfig.alias || {} };
  config.plugins = [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(env),
    }),
  ]
  return config
}