import { FormRow, FormRowSelect, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddJob = () => {
	const {
		isLoading,
		isEditing,
		showAlert,
		displayAlert,
		company,
		position,
		jobLocation,
		jobType,
		jobTypeOptions,
		status,
		statusOptions,
		handleChange,
		clearJobInput,
		createJob,
		editJob,
	} = useAppContext();

	function handleSubmit(e) {
		e.preventDefault();

		if (!position || !company || !jobLocation) {
			displayAlert('danger', 'Please provide all values');
			return;
		}

		// since add a new job and edit an existing job are all done in the same page -- add-job page
		// so we should check whether we are create a new job or edit an existing job
		if (isEditing) {
			editJob();
			return;
		}

		createJob();
	}

	function handleJobInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		handleChange(name, value);
	}

	return (
		<Wrapper>
			<form className="form">
				<h3>{isEditing ? 'edit a job' : 'add a job'}</h3>
				{showAlert ? <Alert /> : null}

				<div className="form-center">
					{/* company */}
					<FormRow type="text" name="company" value={company} handleChange={handleJobInput} />
					{/* position */}
					<FormRow type="text" name="position" value={position} handleChange={handleJobInput} />
					{/* location */}
					<FormRow type="text" name="jobLocation" value={jobLocation} handleChange={handleJobInput} labelText="job location" />
					{/* job type */}
					<FormRowSelect
						name="jobType"
						value={jobType}
						handleChange={handleJobInput}
						labelText="job type"
						options={jobTypeOptions}
					/>
					{/* status */}
					<FormRowSelect name="status" value={status} handleChange={handleJobInput} options={statusOptions} />

					{/* submit and clear button */}
					<div className="btn-container">
						<button type="submit" className="btn btn-block submit-btn" onClick={handleSubmit} disabled={isLoading}>
							submit
						</button>

						<button
							className="btn btn-block clear-btn"
							onClick={(e) => {
								e.preventDefault();
								clearJobInput();
							}}
						>
							clear
						</button>
					</div>
				</div>
			</form>
		</Wrapper>
	);
};

export default AddJob;
