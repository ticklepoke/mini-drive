type Thunk = () => Promise<void>;

export class JobLock {
	private static _instance: JobLock;

	private isRunning: boolean;
	private job: Thunk;

	private constructor(job: Thunk) {
		this.isRunning = false;
		this.job = job;
	}

	public static getInstance(job: Thunk): JobLock {
		if (!JobLock._instance) {
			JobLock._instance = new JobLock(job);
		}
		return JobLock._instance;
	}

	run() {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;
		return this.job();
	}

	free() {
		this.isRunning = false;
	}
}
