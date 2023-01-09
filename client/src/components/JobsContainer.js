import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import { Loading, Job, PageBtnContainer, Alert } from '.';
import Wrapper from '../assets/wrappers/JobsContainer';

const JobsContainer = () => {
	const { showAlert, getJobs, jobs, isLoading, page, numOfPages, totalJobs, search, searchStatus, searchType, sort } = useAppContext();

	useEffect(() => {
		getJobs();
		// eslint-disable-next-line
	}, [search, searchStatus, searchType, sort, page]);

	if (isLoading) {
		return <Loading center />;
	}

	if (jobs.length < 1) {
		return (
			<Wrapper>
				<h2>No jobs to display...</h2>
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			{showAlert ? <Alert /> : null}
			<h5>
				{totalJobs} job{jobs.length > 1 && 's'} found
			</h5>
			<div className="jobs">
				{jobs.map((job) => {
					return <Job key={job._id} {...job} />;
				})}
			</div>
			{/* pagination buttons */}
			{numOfPages > 1 && <PageBtnContainer />}
		</Wrapper>
	);
};

export default JobsContainer;
