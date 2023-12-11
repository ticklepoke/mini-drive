import amqplib, { Channel, Connection } from 'amqplib';

const QUEUE = 'completed_chunks';

export class Listener {
	private connection: Connection;
	private channel: Channel;

	private constructor(conn: Connection, channel: Channel) {
		this.connection = conn;
		this.channel = channel;
	}

	static async of() {
		try {
			const conn = await amqplib.connect('amqp://localhost');
			const channel = await conn.createChannel();
			return new Listener(conn, channel);
		} catch (e) {
			console.error('Unable to create mq listener', e);
			return null;
		}
	}

	addListener(cb: (content: Buffer) => void) {
		this.channel.consume(QUEUE, (msg) => {
			if (msg === null) return;
			this.channel.ack(msg);
			cb(msg.content);
		});
	}
}
