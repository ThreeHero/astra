import webpack from 'webpack'

export function integrationConfig(invalidConfig, env) {
  const config = {};
  config.resolve = { alias: invalidConfig.alias || {} };
  config.plugins = [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(env),
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV || "development"),
    }),
  ]
  return config
}