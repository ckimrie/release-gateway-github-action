"use strict";

const ENV_GITHUB_PREFIX = "GITHUB_";

async function createEventPayload(context, inputs) {
  return {
    inputs,
    processEnv: getEnvironmentVariables(),
    context,
  };
}

function getEnvironmentVariables() {
  const env = {};
  for (const envKey in process.env) {
    if (envKey.indexOf(ENV_GITHUB_PREFIX) === 0) {
      env[envKey] = process.env[envKey];
    }
  }

  return env;
}

module.exports = createEventPayload;
