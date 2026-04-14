#!/bin/bash
# MiniStack init script — creates SNS topics, SQS queues for Execution & Notification Service
set -e

ENDPOINT="http://localhost:4566"
REGION="us-east-2"
ACCOUNT="000000000000"

echo "Creating SNS topics..."
aws --endpoint-url=$ENDPOINT --region=$REGION sns create-topic --name work-order-events
aws --endpoint-url=$ENDPOINT --region=$REGION sns create-topic --name payment-events
aws --endpoint-url=$ENDPOINT --region=$REGION sns create-topic --name execution-events

echo "Creating SQS queues..."
# DLQs
aws --endpoint-url=$ENDPOINT --region=$REGION sqs create-queue --queue-name execution-work-order-queue-dlq
aws --endpoint-url=$ENDPOINT --region=$REGION sqs create-queue --queue-name notification-queue-dlq

# Main queues
aws --endpoint-url=$ENDPOINT --region=$REGION sqs create-queue --queue-name execution-work-order-queue \
  --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-2:000000000000:execution-work-order-queue-dlq\",\"maxReceiveCount\":\"3\"}"}'

aws --endpoint-url=$ENDPOINT --region=$REGION sqs create-queue --queue-name notification-queue \
  --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-2:000000000000:notification-queue-dlq\",\"maxReceiveCount\":\"3\"}"}'

echo "Creating SNS→SQS subscriptions..."
# Execution queue subscribes to work-order-events (for execution tracking)
aws --endpoint-url=$ENDPOINT --region=$REGION sns subscribe \
  --topic-arn arn:aws:sns:$REGION:$ACCOUNT:work-order-events \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:$REGION:$ACCOUNT:execution-work-order-queue

# Notification queue subscribes to all event topics for email dispatch
aws --endpoint-url=$ENDPOINT --region=$REGION sns subscribe \
  --topic-arn arn:aws:sns:$REGION:$ACCOUNT:work-order-events \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:$REGION:$ACCOUNT:notification-queue

aws --endpoint-url=$ENDPOINT --region=$REGION sns subscribe \
  --topic-arn arn:aws:sns:$REGION:$ACCOUNT:payment-events \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:$REGION:$ACCOUNT:notification-queue

aws --endpoint-url=$ENDPOINT --region=$REGION sns subscribe \
  --topic-arn arn:aws:sns:$REGION:$ACCOUNT:execution-events \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:$REGION:$ACCOUNT:notification-queue

echo "Execution & Notification Service AWS resources created."
