const socket = io();

socket.on('sensorData', throttle((data) => {
    document.getElementById('temperature').textContent = `${data.temperature.toFixed(2)} °C`;
    document.getElementById('humidity').textContent = `${data.humidity.toFixed(2)} %`;
    document.getElementById('distance').textContent = `${data.distance_measurement.toFixed(2)} cm`;
    document.getElementById('distance2').textContent = `${data.distance2.toFixed(2)} cm`; 
    document.getElementById('distance3').textContent = `${data.distance3.toFixed(2)} cm`;
    document.getElementById('gyroX').textContent = `${data.gyroX.toFixed(2)} rad/s`;
    document.getElementById('gyroY').textContent = `${data.gyroY.toFixed(2)} rad/s`;
    document.getElementById('gyroZ').textContent = `${data.gyroZ.toFixed(2)} rad/s`;
    document.getElementById('accelX').textContent = `${data.accelX.toFixed(2)} m/s²`;
    document.getElementById('accelY').textContent = `${data.accelY.toFixed(2)} m/s²`;
    document.getElementById('accelZ').textContent = `${data.accelZ.toFixed(2)} m/s²`;
    updateDistanceIndicator(data.distance_measurement);
    updateDistanceIndicator2(data.distance2);
    updateDistanceIndicator3(data.distance3);
    updateThermometer(data.temperature);
    updateHygrometer(data.humidity);
    updateWalkingStickOrientation(data.gyroY,data.gyroX); 
}, 100));

document.getElementById('ledOn').addEventListener('click', function() {
    socket.emit('controlLED', { command: 'on' });
    document.getElementById('lightIndicator').classList.remove('off');
    document.getElementById('lightIndicator').classList.add('on');
});

document.getElementById('ledOff').addEventListener('click', function() {
    socket.emit('controlLED', { command: 'off' });
    document.getElementById('lightIndicator').classList.remove('on');
    document.getElementById('lightIndicator').classList.add('off');
});

document.getElementById('buzzerOn').addEventListener('click', function() {
    socket.emit('controlBuzzer', { command: 'on' });
    document.getElementById('buzzerIndicator').classList.add('on');
});

document.getElementById('buzzerOff').addEventListener('click', function() {
    socket.emit('controlBuzzer', { command: 'off' });
    document.getElementById('buzzerIndicator').classList.remove('on');
});

document.getElementById('buzzerOn').addEventListener('click', function() {
    socket.emit('controlBuzzer', { command: 'on' });
});

document.getElementById('buzzerOff').addEventListener('click', function() {
    socket.emit('controlBuzzer', { command: 'off' });
});

document.getElementById('ledOn').addEventListener('click', function() {
    socket.emit('controlLED', { command: 'on' });
});

document.getElementById('ledOff').addEventListener('click', function() {
    socket.emit('controlLED', { command: 'off' });
});
let sosActive = false; 
document.getElementById('sosOn').addEventListener('click', function() {
    if (!sosActive) {
        socket.emit('controlSOS', { command: 'on' });
        document.getElementById('sosIndicator').classList.remove('off');
        document.getElementById('sosIndicator').classList.add('on');
        sosActive = true; 
    }
});

document.getElementById('sosOff').addEventListener('click', function() {
    if (sosActive) {
        socket.emit('controlSOS', { command: 'off' });
        document.getElementById('sosIndicator').classList.remove('on');
        document.getElementById('sosIndicator').classList.add('off');
        sosActive = false; 
    }
});

socket.on('accelerometerData', (data) => {
    document.getElementById('accelX').textContent = `${data.x.toFixed(2)} m/s²`;
    document.getElementById('accelY').textContent = `${data.y.toFixed(2)} m/s²`;
    document.getElementById('accelZ').textContent = `${data.z.toFixed(2)} m/s²`;
});

socket.on('gyroscopeData', (data) => {
    document.getElementById('gyroX').textContent = `${data.x.toFixed(2)} rad/s`;
    document.getElementById('gyroY').textContent = `${data.y.toFixed(2)} rad/s`;
    document.getElementById('gyroZ').textContent = `${data.z.toFixed(2)} rad/s`;
});
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}
function updateDistanceIndicator(distance) {
    const indicator = document.getElementById('distanceIndicator');
    if (distance < 5 && distance > 0) {
        indicator.className = 'distance-indicator close';
    } else if (distance < 10 && distance > 5) {
        indicator.className = 'distance-indicator medium';
    } else {
        indicator.className = 'distance-indicator far';
    }
}
function updateDistanceIndicator2(distance) {
    const indicator = document.getElementById('distanceIndicator2');
    if (distance < 5 && distance > 0) {
        indicator.className = 'distance-indicator close';
    } else if (distance < 10 && distance > 5) {
        indicator.className = 'distance-indicator medium';
    } else {
        indicator.className = 'distance-indicator far';
    }
}
function updateDistanceIndicator3(distance) {
    const indicator = document.getElementById('distanceIndicator3');
    if (distance < 5 && distance > 0) {
        indicator.className = 'distance-indicator close';
    } else if (distance < 10 && distance > 5) {
        indicator.className = 'distance-indicator medium';
    } else {
        indicator.className = 'distance-indicator far';
    }
}


socket.on('gyroscopeData', (data) => {
    document.getElementById('gyroX').textContent = `${data.x.toFixed(2)} rad/s`;
    document.getElementById('gyroY').textContent = `${data.y.toFixed(2)} rad/s`;
    document.getElementById('gyroZ').textContent = `${data.z.toFixed(2)} rad/s`;

    updateWalkingStickOrientation(data.x, data.y);
});

function updateWalkingStickOrientation(roll, pitch) {
    const stick = document.getElementById('walkingStickRepresentation');
    const rollDeg = roll * (180 / Math.PI); 
    const pitchDeg = pitch * (180 / Math.PI);
    document.getElementById('gyroX').textContent = `${rollDeg.toFixed(2)} °`;
    document.getElementById('gyroY').textContent = `${pitchDeg.toFixed(2)} °`;
    console.log(rollDeg);
    console.log(pitchDeg);
    
    stick.style.transform = `rotateX(${pitchDeg}deg) rotateZ(${rollDeg}deg)`;
}

socket.on('sensorData', throttle((data) => {
    document.getElementById('temperature').textContent = `${data.temperature.toFixed(2)} °C`;
    document.getElementById('humidity').textContent = `${data.humidity.toFixed(2)} %`;
    updateThermometer(data.temperature);
    updateHygrometer(data.humidity);
}, 500));

function updateThermometer(temperature) {
    const maxTemp = 50; 
    const thermometerFill = document.querySelector('.thermometer-fill');
    let height = (temperature / maxTemp) * 100; 
    thermometerFill.style.height = `${height}%`;
}

function updateHygrometer(humidity) {
    const hygrometerFill = document.querySelector('.hygrometer-fill');
    let height = humidity; 
    hygrometerFill.style.height = `${height}%`;
}


