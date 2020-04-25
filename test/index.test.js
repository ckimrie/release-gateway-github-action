const createEventPayload = require("../src/create-event-payload");
const runAction = require("../src/run-action");
const { RG_EVENTS_API_URL } = require("../src/constants");
const nock = require("nock");

const envKeys = [
  "GITHUB_WORKFLOW",
  "GITHUB_RUN_ID",
  "GITHUB_RUN_NUMBER",
  "GITHUB_ACTION",
  "GITHUB_ACTIONS",
  "GITHUB_ACTOR",
  "GITHUB_REPOSITORY",
  "GITHUB_EVENT_NAME",
  "GITHUB_EVENT_PATH",
  "GITHUB_WORKSPACE",
  "GITHUB_SHA",
  "GITHUB_REF",
  "GITHUB_HEAD_REF",
  "GITHUB_BASE_REF",
  "GITHUB_JOB",
  "GITHUB_REPOSITORY_OWNER",
];

describe("Github action", () => {
  beforeAll(() => {
    nock.disableNetConnect();
    envKeys.forEach((key, index) => {
      process.env[key] = key + "_" + index;
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
    envKeys.forEach((key) => {
      delete process.env[key];
    });
  });

  describe("#runAction", () => {
    it("should send request to event API", async () => {
      const scope = nock(RG_EVENTS_API_URL)
        .post(
          "/events",
          await createEventPayload({ payload: {} }, { environmentName: "", codeVersion: "" })
        )
        .reply(201, "OK");

      expect.assertions(1);
      await runAction();
      expect(scope.isDone()).toEqual(true);
    });
  });

  describe("#createEventPayload", () => {
    it("should include all github environment variables", async () => {
      const result = await createEventPayload(
        { foo: "bar", biz: { baz: "foo" } },
        { environmentName: "production" }
      );
      expect(result).toMatchObject({
        inputs: {
          environmentName: "production",
        },
        processEnv: {
          GITHUB_WORKFLOW: "GITHUB_WORKFLOW_0",
          GITHUB_RUN_ID: "GITHUB_RUN_ID_1",
          GITHUB_RUN_NUMBER: "GITHUB_RUN_NUMBER_2",
          GITHUB_ACTION: "GITHUB_ACTION_3",
          GITHUB_ACTIONS: "GITHUB_ACTIONS_4",
          GITHUB_ACTOR: "GITHUB_ACTOR_5",
          GITHUB_REPOSITORY: "GITHUB_REPOSITORY_6",
          GITHUB_EVENT_NAME: "GITHUB_EVENT_NAME_7",
          GITHUB_EVENT_PATH: "GITHUB_EVENT_PATH_8",
          GITHUB_WORKSPACE: "GITHUB_WORKSPACE_9",
          GITHUB_SHA: "GITHUB_SHA_10",
          GITHUB_REF: "GITHUB_REF_11",
          GITHUB_HEAD_REF: "GITHUB_HEAD_REF_12",
          GITHUB_BASE_REF: "GITHUB_BASE_REF_13",
        },
        context: {
          foo: "bar",
          biz: {
            baz: "foo",
          },
        },
      });
    });
  });
});
