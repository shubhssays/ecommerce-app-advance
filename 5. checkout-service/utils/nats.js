const { connect, StringCodec } = require("nats");
const config = require("config");
const url = config.get('nats.url');
class NatsClient {
    static instance; // Singleton instance
    static subject = config.get('nats.topic'); // Default subject
    static stringCodec = StringCodec(); // String codec for encoding/decoding messages

    constructor() {
        if (NatsClient.instance) {
            return NatsClient.instance; // Return the existing instance if already created
        }
        this.nc = null; // Holds the NATS connection
        (async () => {
            await this._connect(); // Automatically connect when the class is instantiated
        })()
        NatsClient.instance = this;
    }

    // Automatically connect to the NATS server
    async _connect(server = url) {
        try {
            if (this.nc) {
                console.log("Already connected to NATS server.");
                return this.nc;
            }
            this.nc = await connect({ servers: server });
            console.log(`Connected to NATS server at ${server}`);
            return this.nc;
        } catch (error) {
            console.error("Failed to connect to NATS server:", error);
            throw error;
        }
    }

    // Publish a message
    async publish(subject, message) {
        if (!this.nc) {
            await this._connect(); // Ensure connection before publishing
        }
        message = typeof message === 'string' ? message : JSON.stringify(message);
        this.nc.publish(subject || NatsClient.subject, NatsClient.stringCodec.encode(message));
        console.log(`Published message to '${subject || NatsClient.subject}': ${ message }`);
    }

    // Subscribe to a subject
    async subscribe(subject, callback) {
        if (!this.nc) {
            await this._connect(); // Ensure connection before subscribing
        }
        const subscription = this.nc.subscribe(subject || NatsClient.subject);
        console.log(`Subscribed to subject: ${subject || NatsClient.subject}`);

        for await (const message of subscription) {
            const decodedMessage = NatsClient.stringCodec.decode(message.data);
            console.log(`Received message on '${subject || NatsClient.subject}': ${decodedMessage}`);
            if (callback) {
                callback(decodedMessage);
            }
        }
    }

    // Close the NATS connection
    async disconnect() {
        if (this.nc) {
            await this.nc.drain();
            console.log("Disconnected from NATS server.");
            this.nc = null;
        }
    }
}

// Instantiate and auto-connect Singleton
const natsClient = new NatsClient();

module.exports = natsClient;
