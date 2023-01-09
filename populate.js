// This file is for populating our mock data (from https://www.mockaroo.com/) into the MongoDB
// run 'node populate'

import { readFile } from 'fs/promises';

import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/connect.js';
import Job from './models/Job.js';

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		await Job.deleteMany();

		const jsonProducts = JSON.parse(await readFile(new URL('./mock-data.json', import.meta.url)));
		await Job.create(jsonProducts);
		console.log('Success!!!!');
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

start();
