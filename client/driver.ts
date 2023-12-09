import path from 'path';
import { consumeFile } from './chunker';
import { Publisher } from './publisher';

async function main() {
	const sender = await Publisher.of();

	if (sender === null) return;

	const filePath = path.join(process.cwd(), '../../../', 'Downloads/', 'VID_20231129_172444_00_002.mp4');

	consumeFile(filePath, (chunk) => {
		sender.send(chunk);
	});

	sender.flush();

	// TODO: use notifier to send errors
}

main();
