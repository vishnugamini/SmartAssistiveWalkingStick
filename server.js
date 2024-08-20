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

const server = http.createServer(app);

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
            io.emit('sensorData', data);
            io.emit('accelerometerData', { x: data.accelX, y: data.accelY, z: data.accelZ });
            io.emit('gyroscopeData', { x: data.gyroX, y: data.gyroY, z: data.gyroZ });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError.message);
        }
    });
};
setInterval(fetchSensorData, 500);

app.get('/getSensorData', (req, res) => {
    fetchSensorData();
    res.status(200).send('Fetching sensor data...');
});

setInterval(fetchSensorData, 500);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });

    socket.on('controlBuzzer', (data) => {
        const command = data.command;
        console.log('Received controlBuzzer command:', command);
    });
    socket.on('controlLED', (data) => {
        const command = data.command;
        console.log('Received controlLED command:', command);
    });
    socket.on('controlSOS', (data) => {
        const command = data.command;
        console.log('Received controlLED command:', command);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
