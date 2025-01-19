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
def publish_telemetry_data(
        connected=True,
        sender_id="1234",
        receiver_id="4321",
        sender_current_capacity=120,
        receiver_current_capacity=1,
        energy_amount=40,
        rate_of_transfer=0.1,
        total_capacity=120,  # Default total capacity
        trade_id="trade_001",  # Unique trade ID
):
    print("Energy transfer started")
    sender_current_capacity = int(sender_current_capacity)  # Ensure sender_cur_capacity is an integer
    receiver_current_capacity = int(receiver_current_capacity)  # Ensure receiver_current_capacity is an integer
    energy_amount = int(energy_amount)  # Ensure energy_amount is an integer
    dynamic_topic = f"telemetry/{trade_id}"  # Dynamic topic with trade ID

    if connected:
        while energy_amount > 0:
            # Calculate telemetry data
            sender_energy = max(0, sender_current_capacity - energy_amount)  # Remaining sender energy
            receiver_energy = min(receiver_current_capacity, energy_amount)  # Receiver gets transferred energy
            voltage = 230  # Fixed voltage in volts
            current = rate_of_transfer / voltage  # Calculate current in amps
            power = voltage * current  # Calculate power in watts
            sender_battery_temp = 30 + (5 * (rate_of_transfer / 100))  # Simulated sender battery temp
            receiver_battery_temp = 30 + (5 * (rate_of_transfer / 120))  # Simulated receiver battery temp

            # Calculate charge percentages based on total capacity (fixed at 120)
            sender_charge_percentage = max(0, (sender_energy / total_capacity) * 100)
            receiver_charge_percentage = min(100, (receiver_energy / total_capacity) * 100)

            # Prepare sender telemetry message
            sender_message = json.dumps({
                "id": sender_id,
                "energy": sender_energy,
                "voltage": voltage,
                "current": current,
                "power": power,
                "battery_temp": sender_battery_temp,
                "charge_percentage": sender_charge_percentage,
                "status": "sending",
                "timestamp": time.time()
            })

            # Prepare receiver telemetry message
            receiver_message = json.dumps({
                "id": receiver_id,
                "energy": receiver_energy,
                "voltage": voltage,
                "current": current,
                "power": power,
                "battery_temp": receiver_battery_temp,
                "charge_percentage": receiver_charge_percentage,
                "status": "receiving",
                "timestamp": time.time()
            })

            # Publish messages to the dynamic topic
            client.publish(dynamic_topic, sender_message)
            print(f"Published sender message to {dynamic_topic}: {sender_message}")

            client.publish(dynamic_topic, receiver_message)
            print(f"Published receiver message to {dynamic_topic}: {receiver_message}")

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


publish_telemetry_data()

# Disconnect from the broker if connected
if connected:
    client.disconnect()
    client.loop_stop()