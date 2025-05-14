# RealitySync

## Overview

RealitySync is an AI-powered coordination system for retail field operations.  
It processes real-time outage and inventory events, generates AI-driven action recommendations, and automatically routes notifications to the appropriate Slack channels and field crews.

## Getting Started

### Prerequisites

- Node.js v16+
- Redis server running locally or accessible remotely
- Slack workspace with webhook URLs configured

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kamchettysadhika/RealitySync-.git
   cd RealitySync-
2.Install dependencies:

```bash
Copy
npm install
3.Create a .env file with your Slack webhook URLs and other necessary environment variables.
Start the backend service:

```bash
Copy
npm run start
This will start event listeners for outage and inventory streams and connect to Slack for notifications.

Slack Integration
Once running, RealitySync listens for anomalies and outages.

When an anomaly is detected, an AI-generated action recommendation is sent to the relevant Slack channel automatically.

You can use Slack commands such as /checkin <location> to interact with RealitySync and track crew check-ins.
Testing
You can simulate events by publishing test messages to Redis streams or using provided test scripts.

Notes:
Frontend is under development and not included in this repository.

Backend and Slack integration are fully functional and can be tested independently.

For questions or support, contact: ksadhika10@gmail.com


