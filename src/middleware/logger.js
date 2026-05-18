const Log = async (
  stack,
  level,
  packageName,
  message
) => {

  console.log(
    `[${level.toUpperCase()}] ${packageName}: ${message}`
  );

  return;
};

module.exports = Log;