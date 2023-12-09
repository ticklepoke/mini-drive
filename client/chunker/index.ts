import { readFileSync } from 'fs';
import path from 'path';
import { Chunk } from './chunk';

export type OnChunkRead = (chunk: Chunk) => void;

const CHUNK_SIZE = 4096 * 1024; // bytes

export function consumeFile(filePath: string, onChunkRead: OnChunkRead) {
	const buffer = readFileSync(filePath);
	const fileName = getFileName(filePath);
	chunkBuffer(buffer, fileName, onChunkRead);
}

function chunkBuffer(buffer: Buffer, fileName: string, onChunkRead: OnChunkRead) {
	const bufferSize = buffer.byteLength;
	let offset = 0;
	let sequence = 1;

	while (offset < bufferSize) {
		const bufferChunk = buffer.subarray(offset, offset + CHUNK_SIZE);
		onChunkRead(new Chunk(bufferChunk, fileName, sequence));
		sequence++;
		offset += bufferChunk.byteLength;
	}
	console.info('Done reading file: ', fileName);
}

function getFileName(filePath: string) {
	const paths = filePath.split('/');
	return paths[paths.length - 1];
}
