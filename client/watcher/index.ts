import * as drivelist from 'drivelist';
import schedule from 'node-schedule';
import { JobLock } from './JobLock';

async function findSDCard() {
	const drives = await drivelist.list();
	const sdCard = drives.find((drive) => drive.busType === 'Secure Digital');

	if (sdCard === undefined) return null;

	return sdCard;
}

export function addJob(jobFn: () => Promise<void>) {
	const pollSDCardJob = schedule.scheduleJob('*/10 * * * * *', async () => {
		const card = await findSDCard();
		if (card === null) return;
		const jobLock = JobLock.getInstance(async () => {
			await jobFn();
		});
		jobLock.run();
	});
}
