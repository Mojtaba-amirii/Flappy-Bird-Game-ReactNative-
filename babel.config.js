export default function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
}

// eas update --branch main
