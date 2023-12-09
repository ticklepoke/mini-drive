import amqplib, { Channel, Connection } from 'amqplib';

const QUEUE = 'chunks';

export class Publisher<T extends WithImplicitCoercion<string>> {
	private connection: Connection;
	private channel: Channel;
	private failedMessages: T[];

	private constructor(conn: Connection, channel: Channel) {
		this.connection = conn;
		this.channel = channel;
		this.failedMessages = [];
	}

	static async of() {
		try {
			const conn = await amqplib.connect('amqp://localhost');
			const channel = await conn.createChannel();
			return new Publisher(conn, channel);
		} catch (e) {
			console.error('Unable to create mq publisher', e);
			return null;
		}
	}

	send(payload: T) {
		const isSent = this.channel.sendToQueue(QUEUE, Buffer.from(payload));
		if (!isSent) {
			this.failedMessages.push(payload);
		}
		console.log(isSent, payload);
	}

	flush() {
		this.failedMessages = [];
	}
}
