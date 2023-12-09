export class Chunk {
	private data: Buffer;
	private fileName: string;
	private sequence: number;

	constructor(data: Buffer, fileName: string, sequence: number) {
		this.data = data;
		this.fileName = fileName;
		this.sequence = sequence;
	}

	valueOf(): string {
		return JSON.stringify({
			fileName: this.fileName,
			sequence: this.sequence,
			data: this.data.toString(),
		});
	}
}
