import time
import paho.mqtt.client as mqtt
import json
import random
import sys


# Parse command-line arguments
if len(sys.argv) > 1:
    connected = sys.argv[1].lower() == 'true'
    sender_id = sys.argv[2]
    receiver_id = sys.argv[3]
    sender_current_capacity = int(sys.argv[4])
    receiver_current_capacity = int(sys.argv[5])
    energy_amount = int(sys.argv[6])
    rate_of_transfer = float(sys.argv[7])
    total_capacity = int(sys.argv[8])
    trade_id = sys.argv[9]
else:
    # Fallback to default values if no arguments are passed
    connected = True
    sender_id = "1234"
    receiver_id = "4321"
    sender_current_capacity = 120
    receiver_current_capacity = 1
    energy_amount = 40
    rate_of_transfer = 0.1
    total_capacity = 120
    trade_id = "trade_001"


# MQTT broker details
broker_address = "localhost"  # Replace with your MQTT broker address
broker_port = 1883  # Default MQTT port (change if needed)
topic = "telemetry/1/"
username = "admin"
password = "admin"

# Create an MQTT client instance
# client = mqtt.Client()
client = mqtt.Client(protocol=mqtt.MQTTv5)

# Set username and password
client.username_pw_set(username, password)

# Flag to track connection status
mqtt_connected = False

# Callback function for connection success
def on_connect(client, userdata, flags, rc):
    global mqtt_connected
    if rc == 0:
        mqtt_connected = True
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
def publish_telemetry_data(
        connected,
        sender_id,
        receiver_id,
        sender_current_capacity,
        receiver_current_capacity,
        energy_amount,
        rate_of_transfer,
        total_capacity,
        trade_id
):
    print("Energy transfer started")
    sender_current_capacity = int(sender_current_capacity)  # Ensure sender_cur_capacity is an integer
    receiver_current_capacity = int(receiver_current_capacity)  # Ensure receiver_current_capacity is an integer
    energy_amount = int(energy_amount)  # Ensure energy_amount is an integer
    dynamic_topic = f"telemetry/{trade_id}/"  # Dynamic topic with trade ID

    if connected:
        while energy_amount > 0:
            energy_transferred = energy_amount * rate_of_transfer
            energy_amount -= energy_transferred
            # Calculate telemetry data
            sender_energy = max(0, sender_current_capacity - energy_transferred)  # Remaining sender energy
            receiver_energy = min(total_capacity, receiver_current_capacity + energy_transferred)  # Receiver gets transferred energy
            voltage = 230  # Fixed voltage in volts
            current = rate_of_transfer / voltage  # Calculate current in amps
            power = rate_of_transfer  # Calculate power in watts
            sender_battery_temp = 30 + (5 * (rate_of_transfer / 100))  # Simulated sender battery temp
            receiver_battery_temp = 30 + (5 * (rate_of_transfer / 120))  # Simulated receiver battery temp

            # Calculate charge percentages based on total capacity (fixed at 120)
            sender_charge_percentage = max(0, (sender_energy / total_capacity) * 100)
            receiver_charge_percentage = min(100, (receiver_energy / total_capacity) * 100)

            # Prepare combined telemetry message
            telemetry_message = json.dumps({
                "sender": {
                    "id": sender_id,
                    "energy": sender_energy,
                    "voltage": voltage,
                    "current": current,
                    "power": power,
                    "battery_temp": sender_battery_temp,
                    "charge_percentage": sender_charge_percentage,
                    "status": "sending"
                },
                "receiver": {
                    "id": receiver_id,
                    "energy": receiver_energy,
                    "voltage": voltage,
                    "current": current,
                    "power": power,
                    "battery_temp": receiver_battery_temp,
                    "charge_percentage": receiver_charge_percentage,
                    "status": "receiving"
                },
                "status": "inProgress",
                "timestamp": time.time()
            })

            # Publish the combined message to the dynamic topic
            client.publish(dynamic_topic, telemetry_message)
            print(f"Published telemetry message to {dynamic_topic}: {telemetry_message}")

            # Simulate energy transfer by decrementing energy and updating capacities
            energy_amount -= rate_of_transfer
            sender_current_capacity = max(0, sender_current_capacity - rate_of_transfer)
            receiver_current_capacity = min(
                receiver_current_capacity + rate_of_transfer, total_capacity
            )

            # Wait for a fixed time to simulate real-time data
            time.sleep(1)

        print("Energy transfer completed.")
        trigger_transaction_completion(sender_id, receiver_id, dynamic_topic)
    else:
        print(f"Cannot publish message: Not connected to MQTT broker.")

def trigger_transaction_completion(sender_id, receiver_id, topic):
    print(f"Transaction complete between sender: {sender_id} and receiver: {receiver_id}")
    completion_message = json.dumps({
        "status": "completed",
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "timestamp": time.time()
    })
    client.publish(topic, completion_message)
    print(f"Published transaction completion message to {topic}: {completion_message}")


publish_telemetry_data(
    connected,
    sender_id,
    receiver_id,
    sender_current_capacity,
    receiver_current_capacity,
    energy_amount,
    rate_of_transfer,
    total_capacity,
    trade_id
)

# Disconnect from the broker if connected
if mqtt_connected:
    client.disconnect()
    client.loop_stop()