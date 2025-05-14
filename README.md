RealitySync
RealitySync is an AI-powered field coordination platform that detects retail and utility anomalies, generates action plans, and automatically dispatches crews via Slack.

Getting Started
Prerequisites
Node.js v16 or higher

Redis server running locally or remotely

Slack workspace with configured webhook URLs

Installation
Step 1: Clone the repository
bash
Copy
Edit
git clone https://github.com/kamchettysadhika/RealitySync-.git
cd RealitySync-
Step 2: Install dependencies
bash
Copy
Edit
npm install
Step 3: Set up environment
Create a .env file in the root directory and define the following environment variables:

ini
Copy
Edit
SLACK_WEBHOOK_URL=your_webhook_here
# Add any additional variables needed for your setup
Step 4: Start the backend service
bash
Copy
Edit
npm run start
This will start the event listeners for outage and inventory streams, and connect to Slack for automated anomaly notifications.

Slack Integration
RealitySync listens for anomalies and outages in real-time.

When an event is detected, it sends an AI-generated action plan directly to the relevant Slack channel.

You can interact with RealitySync using Slack commands such as:

bash
Copy
Edit
/checkin <location>
This will register a field technician's presence in that zone.

Testing
You can simulate anomaly and inventory events by publishing test messages to the Redis streams, or using the provided scripts (if available):

bash
Copy
Edit
redis-cli XADD outage-stream "*" event '{"type":"outage","zone":"zone1"}'
Notes
Frontend dashboard is under development and not included in this repository.

Backend logic, Redis streaming, and Slack alert system are fully functional and can be tested independently.

Contact
For questions, suggestions, or support:
📧 ksadhika10@gmail.com

