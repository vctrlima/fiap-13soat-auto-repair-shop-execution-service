Feature: Work Order Execution and Notification

  As an execution management system
  I want to track service execution progress and send notifications
  So that work orders are completed and customers are informed

  Background:
    Given the execution service is running

  Scenario: Create execution logs from work order approved event
    Given a WorkOrderApproved event is received with services to execute
    When the execution event handler processes the event
    Then execution logs should be created for each service
    And each log should have status "PENDING"

  Scenario: Update execution log status to in progress
    Given execution logs exist for a work order
    When I update a log status to "IN_PROGRESS"
    Then the log should be updated successfully

  Scenario: Complete individual execution log
    Given an execution log exists with status "IN_PROGRESS"
    When I update the log status to "COMPLETED"
    Then the log should be marked as completed

  Scenario: Complete work order execution when all logs are done
    Given all execution logs for a work order are completed
    When I trigger the work order execution completion check
    Then an ExecutionCompleted event should be published to SNS

  Scenario: Query execution logs by work order ID
    Given execution logs exist for a work order
    When I query execution logs by work order ID
    Then I should receive all execution logs with their statuses

  Scenario: Query notifications by work order ID
    Given notifications have been sent for a work order
    When I query notifications by work order ID
    Then I should receive the notification history
