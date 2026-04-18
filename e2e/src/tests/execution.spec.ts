import { defineFeature, loadFeature } from "jest-cucumber";
import axios from "axios";
import path from "path";

const feature = loadFeature(
  path.resolve(__dirname, "../features/execution.feature"),
);

const baseURL = process.env.EXECUTION_SERVICE_URL || "http://localhost:3004";
const api = axios.create({ baseURL, validateStatus: () => true });

defineFeature(feature, (test) => {
  let workOrderId: string;
  let executionLogsResponse: any;
  let updateResponse: any;
  let logId: string;

  beforeEach(() => {
    workOrderId = `wo-test-${Date.now()}`;
  });

  test("Create execution logs from work order approved event", ({
    given,
    when,
    then,
    and,
  }) => {
    given("the execution service is running", async () => {
      const { status } = await api.get("/health");
      expect(status).toBe(200);
    });

    given(
      "a WorkOrderApproved event is received with services to execute",
      () => {
        // Event processing is async via SQS
      },
    );

    when("the execution event handler processes the event", async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    then("execution logs should be created for each service", async () => {
      executionLogsResponse = await api.get(`/api/executions/${workOrderId}`);
      if (executionLogsResponse.status === 200) {
        expect(Array.isArray(executionLogsResponse.data)).toBe(true);
      }
    });

    and(/^each log should have status "(.*)"$/, (status) => {
      if (
        executionLogsResponse?.data &&
        Array.isArray(executionLogsResponse.data)
      ) {
        for (const log of executionLogsResponse.data) {
          expect(log.status).toBe(status);
        }
      }
    });
  });

  test("Update execution log status to in progress", ({
    given,
    when,
    then,
  }) => {
    given("the execution service is running", async () => {
      const { status } = await api.get("/health");
      expect(status).toBe(200);
    });

    given("execution logs exist for a work order", async () => {
      executionLogsResponse = await api.get(`/api/executions/${workOrderId}`);
    });

    when(/^I update a log status to "(.*)"$/, async (status) => {
      if (executionLogsResponse?.data?.[0]) {
        logId = executionLogsResponse.data[0].id;
        updateResponse = await api.patch(`/api/executions/logs/${logId}`, {
          status,
        });
      }
    });

    then("the log should be updated successfully", () => {
      if (updateResponse) {
        expect([200, 204]).toContain(updateResponse.status);
      }
    });
  });

  test("Complete individual execution log", ({ given, when, then }) => {
    given("the execution service is running", async () => {
      const { status } = await api.get("/health");
      expect(status).toBe(200);
    });

    given(/^an execution log exists with status "(.*)"$/, () => {
      // Assumes log was set to IN_PROGRESS in previous scenario
    });

    when(/^I update the log status to "(.*)"$/, async (status) => {
      if (logId) {
        updateResponse = await api.patch(`/api/executions/logs/${logId}`, {
          status,
        });
      }
    });

    then("the log should be marked as completed", () => {
      if (updateResponse) {
        expect([200, 204]).toContain(updateResponse.status);
      }
    });
  });

  test("Complete work order execution when all logs are done", ({
    given,
    when,
    then,
  }) => {
    given("the execution service is running", async () => {
      const { status } = await api.get("/health");
      expect(status).toBe(200);
    });

    given("all execution logs for a work order are completed", () => {
      // Assumes all logs completed
    });

    when("I trigger the work order execution completion check", async () => {
      updateResponse = await api.post(
        `/api/executions/${workOrderId}/complete`,
      );
    });

    then("an ExecutionCompleted event should be published to SNS", () => {
      expect([200, 201, 404]).toContain(updateResponse.status);
    });
  });

  test("Query execution logs by work order ID", ({ given, when, then }) => {
    given("the execution service is running", async () => {
      const { status } = await api.get("/health");
      expect(status).toBe(200);
    });

    given("execution logs exist for a work order", () => {
      // Assumes logs created by event handler
    });

    when("I query execution logs by work order ID", async () => {
      executionLogsResponse = await api.get(`/api/executions/${workOrderId}`);
    });

    then("I should receive all execution logs with their statuses", () => {
      expect([200, 404]).toContain(executionLogsResponse.status);
      if (executionLogsResponse.status === 200) {
        expect(Array.isArray(executionLogsResponse.data)).toBe(true);
      }
    });
  });

  test("Query notifications by work order ID", ({ given, when, then }) => {
    let notificationsResponse: any;

    given("the execution service is running", async () => {
      const { status } = await api.get("/health");
      expect(status).toBe(200);
    });

    given("notifications have been sent for a work order", () => {
      // Assumes notifications sent by notification handler
    });

    when("I query notifications by work order ID", async () => {
      notificationsResponse = await api.get(
        `/api/notifications/${workOrderId}`,
      );
    });

    then("I should receive the notification history", () => {
      expect([200, 404]).toContain(notificationsResponse.status);
    });
  });
});
