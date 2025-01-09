import time
import paho.mqtt.client as mqtt
import json
import random

# MQTT broker details
broker_address = "localhost"  # Replace with your MQTT broker address
broker_port = 1883  # Default MQTT port (change if needed)
topic = "telemetry/1/"
username = "admin"
password = "admin"

# Create an MQTT client instance
client = mqtt.Client()

# Set username and password
client.username_pw_set(username, password)

# Flag to track connection status
connected = False

# Callback function for connection success
def on_connect(client, userdata, flags, rc):
    global connected
    if rc == 0:
        connected = True
        print("Connected to MQTT broker.")
    else:
        print(f"Failed to connect, return code {rc}")

# Set the on_connect callback
client.on_connect = on_connect

# Try connecting to the broker
try:
    client.connect(broker_address, broker_port)
    client.loop_start()  # Start the network loop
except Exception as e:
    print(f"Error connecting to MQTT broker: {e}")

# Function to publish a message with a random temperature value between 1270 and 1290
def publish_message():
    if connected:
        id_value = 1  # Increment this value for each message
        temp_value = 1270 + int(10 * random.random())  # Generate a random temperature value
        message = json.dumps({"id": id_value, "temp": temp_value})
        client.publish(topic, message)
        print(f"Published message: {message}")
    else:
        print("Cannot publish message: Not connected to MQTT broker.")

# Publish messages every second for one minute
end_time = time.time() + 240
while time.time() < end_time:
    publish_message()
    time.sleep(1)

# Disconnect from the broker if connected
if connected:
    client.disconnect()
    client.loop_stop()