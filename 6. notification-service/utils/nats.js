const config = require("config");
const { connect, StringCodec } = require("nats");
const url = config.get('nats.url');
const topic = config.get('nats.topic');

(async () => {
    try {
        // Establish a connection to the NATS server
        const nc = await connect({ servers: url });
        console.log(`Connected to NATS server at ${url}`);

        // Use StringCodec for string messages
        const sc = StringCodec();

        // Example: Subscribe to a "notifications" topic
        const subscription = nc.subscribe(topic);
        console.log("Subscribed to notifications topic...");

        // Process incoming messages
        for await (const message of subscription) {
            const data = sc.decode(message.data);
            console.log(`Received notification: ${data}`);
        }
    } catch (error) {
        console.error("Error in NATS Notification Service:", error);
    }
})();