# Business Communications Anomaly Detection System

This project is a simple system to detect anomalies in business communications, such as emails or internal messages, by using vector embeddings to analyze the semantic similarity of messages. The system flags potential phishing attempts, spear-phishing, or internal threats by comparing new messages to a predefined list of malicious ones.

## Features

- **Message Submission**: Allows users to submit business communications (emails or messages) for anomaly detection.
- **Embedding Creation**: Each message is transformed into vector embeddings using a pre-trained language model.
- **Anomaly Detection**: The message embeddings are compared with a list of known malicious communications stored in a MongoDB Atlas Vector database. If a new message is semantically similar, it is flagged as a potential anomaly.
- **Anomalies Logging**: Anomalous messages are logged with their risk score for monitoring.
- **Dashboard Visualization**: The frontend provides a simple dashboard for administrators to monitor suspicious messages, similarity details, and risk scores.

## Prerequisites

Before starting, ensure that you have installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```plaintext
anomaly_detection_system/
│
├── backend/            # Node.js backend with Express
│   ├── app.js          # Main server file
│   ├── embeddings.js   # Embedding generation logic
│   ├── mongodb.js      # MongoDB Atlas connection and logic
│   ├── package.json    # Backend dependencies
│   ├── Dockerfile      # Docker configuration for the backend
│   ├── .env            # Environment file for MongoDB URL
│   └── data/           # Sample data folder
│       └── sample_data.json
│
├── frontend/           # Frontend served by NGINX
│   ├── index.html      # Main HTML page
│   ├── main.js         # Frontend logic
│   ├── style.css       # Custom styles
│   └── Dockerfile      # Docker configuration for the frontend
│
├── docker-compose.yml  # Docker Compose configuration
└── README.md           # Project instructions
```

## How to Run

To run the system, follow these steps:

### 1. Clone the repository

Clone this repository to your local machine:

```bash
git clone https://github.com/yourusername/anomaly_detection_system.git
cd anomaly_detection_system
```

### 2. Set Up the Environment File

Create a `.env` file inside the `backend/` directory with the following content:

```plaintext
MONGO_URL=your-mongodb-atlas-url
```

Replace `your-mongodb-atlas-url` with the actual URL of your MongoDB Atlas cluster.

### 3. Build and Start the Application

Use Docker Compose to build and start the services. This will set up the frontend, backend, and MongoDB Atlas Vector database.

```bash
docker-compose up --build
```

This command will:

- Build the backend Node.js service (running on port `3000`)
- Build the frontend served by NGINX (accessible on port `8080`)
- Set up the MongoDB Atlas Vector database (no local ports exposed)

### 4. Access the Application

- **Frontend Dashboard**: Open a browser and go to `http://localhost:8080`. You will see the anomaly detection dashboard.
- **Backend API**: The backend API is running on `http://localhost:3000`.

### 5. Submitting Messages

On the dashboard, you can enter messages to submit for anomaly detection:

1. Enter a message in the provided text area.
2. Click "Submit Message" to send it to the backend.
3. The system will analyze the message, and if it's flagged as an anomaly, it will be added to the anomaly log with a risk score.

### 6. Populating the Database with Sample Data

To populate the MongoDB Atlas database with predefined messages, click the "Populate Database with Sample Data" button on the dashboard. The sample data consists of typical phishing or scam messages, such as:

```json
[
  "Phishing attempt: Click here to reset your password.",
  "Urgent: Your account has been compromised. Log in immediately.",
  "Please pay the attached invoice to avoid account suspension.",
  ...
]
```

These messages are used as the basis for anomaly detection.

### 7. Viewing Anomalies

Anomalies are logged and displayed in the table on the dashboard. Each entry shows the message content, its associated risk score, and the timestamp of detection.

## Stopping the Application

To stop the application, press `CTRL+C` in the terminal where Docker Compose is running. If you want to remove the containers, run:

```bash
docker-compose down
```

This command will stop and remove the containers but preserve the volume data.

## Data Persistence

The system uses Docker volumes to ensure that data is persisted even if the containers are stopped or restarted. The following volumes are used:

- `backend-data`: Stores backend-related data.
- `mongo-data`: Stores MongoDB data.

## Troubleshooting

### Common Issues

1. **MongoDB connection issues**: Ensure that the `MONGO_URL` environment variable is correctly set in the `.env` file.
2. **Port conflicts**: If another application is using port `8080` or `3000`, modify the ports in the `docker-compose.yml` file.
3. **Docker not starting**: Ensure Docker is installed and running on your machine.

### Logs

You can view the logs for each service by running:

```bash
docker-compose logs <service-name>
```

For example, to view the backend logs:

```bash
docker-compose logs backend
```

## Future Enhancements

- Add user authentication and role-based access control.
- Implement advanced NLP models for more precise anomaly detection.
- Enhance the anomaly scoring algorithm for better threat assessment.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

--- 