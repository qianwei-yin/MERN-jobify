import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';

const createJob = async (req, res) => {
	const { company, position } = req.body;

	if (!company || !position) {
		throw new BadRequestError('Please provide all values');
	}

	// req.user.userId comes from middleware/auth.js
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body);
	res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
	const { search, status, jobType, sort } = req.query;

	const queryObject = { $and: [] };
	queryObject.$and.push({
		createdBy: req.user.userId,
	});

	if (status !== 'all') queryObject.$and.push({ status: status });
	if (jobType !== 'all') queryObject.$and.push({ jobType: jobType });

	if (search) {
		queryObject.$and.push({ $or: [{ company: { $regex: search, $options: 'i' } }, { position: { $regex: search, $options: 'i' } }] });
	}

	// no await, otherwise you will get the final data
	let result = Job.find(queryObject);

	// sort
	if (sort === 'latest') result = result.sort('-createdAt');
	if (sort === 'oldest') result = result.sort('createdAt');
	if (sort === 'a-z') result = result.sort('position');
	if (sort === 'z-a') result = result.sort('-position');

	// setup pagination
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = page * limit - limit;
	result = result.skip(skip).limit(limit);

	const jobs = await result;
	const totalJobs = await Job.countDocuments(queryObject);
	const numOfPages = Math.ceil(totalJobs / limit);

	res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const updateJob = async (req, res) => {
	const { id: jobId } = req.params;
	const { company, position } = req.body;

	if (!company || !position) {
		throw new BadRequestError('Please provide all values');
	}

	const job = await Job.findOne({ _id: jobId });
	if (!job) {
		throw new NotFoundError(`No job with id: ${jobId}`);
	}

	// check permissions
	checkPermissions(req.user, job.createdBy);

	const updateJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(StatusCodes.OK).json({ updateJob });
};

const deleteJob = async (req, res) => {
	const { id: jobId } = req.params;

	const job = await Job.findOne({ _id: jobId });
	if (!job) {
		throw new NotFoundError(`No job with id: ${jobId}`);
	}

	// check permissions
	checkPermissions(req.user, job.createdBy);

	await job.remove();
	res.status(StatusCodes.OK).json({ msg: 'Job removed successfully' });
};

// The $ sign means operator
const showStats = async (req, res) => {
	let stats = await Job.aggregate([
		{ $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{ $group: { _id: '$status', count: { $sum: 1 } } },
	]);

	stats = stats.reduce(
		(acc, curr) => {
			const { _id: title, count } = curr;
			acc[title] = count;
			return acc;
		},
		{
			accepted: 0,
			pending: 0,
			interview: 0,
			declined: 0,
		}
	);

	let monthlyApplications = await Job.aggregate([
		{ $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
		{
			$group: {
				_id: {
					year: {
						$year: '$createdAt',
					},
					month: {
						$month: '$createdAt',
					},
				},
				count: { $sum: 1 },
			},
		},
		{
			$sort: {
				'_id.year': -1,
				'_id.month': -1,
			},
		},
		{ $limit: 6 },
	]);

	monthlyApplications = monthlyApplications
		.map((item) => {
			const {
				_id: { year, month },
				count,
			} = item;

			const date = moment()
				.year(year)
				.month(month - 1)
				.format('MMM Y');

			return { date, count };
		})
		.reverse();

	res.status(StatusCodes.OK).json({ stats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
