const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server);
const axios = require('axios');

io.on('connection', (socket) => {
    socket.on('controlSOS', (data) => {
        axios.get(`http://192.168.185.39/controlSOS?command=${data.command}`)
             .then(response => console.log('SOS command forwarded to ESP32:', response.status))
             .catch(error => console.error('Error forwarding SOS command:', error));
    });
    socket.on('controlBuzzer', (data) => {
        console.log('Received controlBuzzer command:', data.command);
        axios.get(`http://192.168.185.39/controlBuzzer?command=${data.command}`)
             .then(response => console.log('Command forwarded to ESP32:', response.status))
             .catch(error => console.error('Error forwarding command to ESP32', error));
    });
    socket.on('controlLED', (data) => {
        console.log('Received controlLED command:', data.command);
        axios.get(`http://192.168.185.39/controlLED?command=${data.command}`)
             .then(response => console.log('Command forwarded to ESP32:', response.status))
             .catch(error => console.error('Error forwarding command to ESP32', error));
    });
    
});

// Function to fetch sensor data from the ESP32 server
// Function to fetch accelerometer and gyroscope data from the ESP32 server
const fetchSensorData = () => {
    const command = 'curl http://192.168.185.39/getSensorData';
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${command}`, error.message);
            return;
        }

        try {
            const data = JSON.parse(stdout);
            console.log('Fetched sensor data:', data);
            // Emit the fetched data to all connected clients
            io.emit('sensorData', data);
            io.emit('accelerometerData', { x: data.accelX, y: data.accelY, z: data.accelZ });
            io.emit('gyroscopeData', { x: data.gyroX, y: data.gyroY, z: data.gyroZ });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError.message);
        }
    });
};
setInterval(fetchSensorData, 500);

// Endpoint to manually fetch sensor data
app.get('/getSensorData', (req, res) => {
    fetchSensorData();
    res.status(200).send('Fetching sensor data...');
});

// Periodically fetch sensor data every 5 seconds
setInterval(fetchSensorData, 500);

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A client connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });

    // Placeholder listener for controlBuzzer command from client
    socket.on('controlBuzzer', (data) => {
        const command = data.command;
        console.log('Received controlBuzzer command:', command);
        // You can add logic here to handle the controlBuzzer command if needed
    });
    socket.on('controlLED', (data) => {
        const command = data.command;
        console.log('Received controlLED command:', command);
        // You can add logic here to handle the controlBuzzer command if needed
    });
    socket.on('controlSOS', (data) => {
        const command = data.command;
        console.log('Received controlLED command:', command);
        // You can add logic here to handle the controlBuzzer command if needed
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
