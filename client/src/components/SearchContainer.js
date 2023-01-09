import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useState, useMemo } from 'react';

const SearchContainer = () => {
	const [localSearch, setLocalSearch] = useState('');
	const { isLoading, searchStatus, searchType, sort, sortOptions, statusOptions, jobTypeOptions, handleChange, clearFilters } =
		useAppContext();

	function handleSearch(e) {
		handleChange(e.target.name, e.target.value);
	}

	const debounce = () => {
		let timeoutID;
		return (e) => {
			setLocalSearch(e.target.value);
			clearTimeout(timeoutID);
			timeoutID = setTimeout(() => {
				handleChange(e.target.name, e.target.value);
			}, 800);
		};
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLocalSearch('');
		clearFilters();
	};

	// eslint-disable-next-line
	const optimizedDebounce = useMemo(() => debounce(), []);

	return (
		<Wrapper>
			<form className="form">
				<h4>search form</h4>

				<div className="form-center">
					<FormRow type="text" name="search" value={localSearch} handleChange={optimizedDebounce} />

					<FormRowSelect
						name="searchStatus"
						value={searchStatus}
						handleChange={handleSearch}
						labelText="status"
						options={['all', ...statusOptions]}
					/>

					<FormRowSelect
						name="searchType"
						value={searchType}
						handleChange={handleSearch}
						labelText="type"
						options={['all', ...jobTypeOptions]}
					/>

					<FormRowSelect name="sort" value={sort} handleChange={handleSearch} options={sortOptions} />

					<button className="btn btn-block btn-danger" disabled={isLoading} onClick={handleSubmit}>
						clear filters
					</button>
				</div>
			</form>
		</Wrapper>
	);
};

export default SearchContainer;
