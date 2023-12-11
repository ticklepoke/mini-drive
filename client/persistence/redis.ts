import { RedisClientType, createClient } from 'redis';

export class ChunkOperations {
	private client: RedisClientType;

	constructor(client: RedisClientType) {
		this.client = client;
		client.on('error', (err) => console.error('Redis Client Error', err));
	}

	static async of() {
		try {
			const client: RedisClientType = createClient();
			client.configSet('appendonly', 'yes');
			await client.connect();
			return new ChunkOperations(client);
		} catch (e) {
			console.error('Unable to create redis client');
			return null;
		}
	}

	async hasOp(opId: string) {
		const hasOp = await this.client.exists(opId);
		return hasOp === 1;
	}

	async addOp(opId: string) {
		return this.client.set(opId, 1);
	}

	async dropOp(opId: string) {
		return this.client.del(opId);
	}
}
