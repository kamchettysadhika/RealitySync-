# RealitySync

## Getting Started

### Prerequisites

- Node.js v16 or higher
- Redis server running locally or accessible remotely
- Slack workspace with webhook URLs configured

---

## Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/kamchettysadhika/RealitySync-.git
cd RealitySync-
```bash
Step 2: Install dependencies
bash
Copy
Edit
npm install
Step 3: Setup environment
Create a .env file with your Slack webhook URLs and any other necessary environment variables.

Step 4: Start the backend service
bash
Copy
Edit
npm run start
This will start event listeners for outage and inventory streams and connect to Slack for notifications.

Slack Integration
Once running, RealitySync listens for anomalies and outages.

When an anomaly is detected, an AI-generated action recommendation is sent automatically to the relevant Slack channel.

You can use Slack commands such as /checkin <location> to interact with RealitySync and track crew check-ins.

Testing
You can simulate events by publishing test messages to Redis streams or using provided test scripts.

Notes
The frontend is under development and not included in this repository.

Backend and Slack integration are fully functional and can be tested independently.

Contact
For questions or support, contact: ksadhika10@gmail.com

yaml
Copy
Edit

---
