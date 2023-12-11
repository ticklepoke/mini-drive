import path from 'path';
import { consumeFile } from './chunker';
import { Publisher } from './publisher';
import { addJob } from './watcher';
import { ChunkOperations } from './persistence/redis';

async function main() {
	addJob(async () => {
		const sender = await Publisher.of();
		if (sender === null) return;

		const chunkOperationsStore = await ChunkOperations.of();
		if (chunkOperationsStore === null) return;

		const filePath = path.join(process.cwd(), '../../../', 'Downloads/', 'VID_20231129_172444_00_002.mp4');

		await consumeFile(filePath, async (chunk) => {
			if (await chunkOperationsStore.hasOp(chunk.valueOf())) {
				return;
			}

			await chunkOperationsStore.addOp(chunk.valueOf());

			sender.send(chunk);
		});

		sender.flush();
	});

	// TODO: use notifier to send errors
}

main();
