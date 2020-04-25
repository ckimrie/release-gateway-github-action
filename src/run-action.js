"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
const createEventPayload = require("./create-event-payload");
const { RG_EVENTS_API_URL } = require("./constants");
const axios = require("axios").create({
  baseURL: RG_EVENTS_API_URL,
});

async function runAction() {
  console.log("Collecting inputs");
  const inputs = {
    environmentName: core.getInput("environment-name"),
    codeVersion: core.getInput("code-version"),
  };
  console.log("Inputs:", JSON.stringify(inputs, null, ""));
  console.log("Creating payload");
  const payload = createEventPayload(github.context, inputs);

  try {
    console.log("Sending data");
    const result = await axios.post("/events", payload).then((response) => response.data);
    console.log("Result", result);
  } catch (e) {
    console.error(e);
    core.setFailed("Failed to send data due to error: " + e.name);
  }
}

module.exports = runAction;
