import { readFileSync } from 'fs';
import path from 'path';

const CHUNK_SIZE = 1024 * 1024; // bytes

/**
 * TODO: assign a hash, sequence and filename to the chunk
 */
function chunkBuffer(buffer: Buffer) {
	const bufferSize = buffer.byteLength;
	let offset = 0;

	while (offset < bufferSize) {
		const chunk = buffer.subarray(offset, offset + CHUNK_SIZE);
		console.log(chunk, offset);
		offset += chunk.byteLength;
	}
	console.log('done reading file');
}

function readBuffer(fileName: string) {
	const buffer = readFileSync(path.join(process.cwd(), '../../../', 'Downloads/VID_20231129_172444_00_002.mp4'));

	return buffer;
}

function main() {
	const buffer = readBuffer('foo');
	chunkBuffer(buffer);
}

main();
