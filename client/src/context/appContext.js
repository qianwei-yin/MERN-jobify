import React, { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import reducer from './reducer';
import {
	DISPLAY_ALERT,
	CLEAR_ALERT,
	SETUP_USER_BEGIN,
	SETUP_USER_SUCCESS,
	SETUP_USER_ERROR,
	TOGGLE_SIDEBAR,
	LOGOUT_USER,
	UPDATE_USER_BEGIN,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_ERROR,
	HANDLE_CHANGE,
	CLEAR_JOB_INPUT,
	CREATE_JOB_BEGIN,
	CREATE_JOB_SUCCESS,
	CREATE_JOB_ERROR,
	GET_JOBS_BEGIN,
	GET_JOBS_SUCCESS,
	SET_EDIT_JOB,
	DELETE_JOB_BEGIN,
	DELETE_JOB_ERROR,
	EDIT_JOB_BEGIN,
	EDIT_JOB_SUCCESS,
	EDIT_JOB_ERROR,
	SHOW_STATS_BEGIN,
	SHOW_STATS_SUCCESS,
	CLEAR_FILTERS,
	CHANGE_PAGE,
	GET_CURRENT_USER_BEGIN,
	GET_CURRENT_USER_SUCCESS,
} from './actions';

const initialState = {
	userLoading: true,

	isLoading: false,
	showAlert: false,
	alertType: '',
	alertText: '',
	user: null,
	userLocation: '',
	showSidebar: false,

	isEditing: false,
	editJobId: '',
	company: '',
	position: '',
	jobLocation: '',
	jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
	jobType: 'full-time',
	statusOptions: ['interview', 'declined', 'pending', 'accepted'],
	status: 'pending',

	jobs: [],
	totalJobs: 0,
	numOfPages: 1,
	page: 1,

	stats: {},
	monthlyApplications: [],

	search: '',
	searchStatus: 'all',
	searchType: 'all',
	sort: 'latest',
	sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// How do we distinguish 400 and 401 error? Typically 400 is when some fields missing, but 401 is when authorization failed.
	// axios setup an interceptor
	const authFetch = axios.create({
		baseURL: '/api/v1',
	});

	// request

	// response
	authFetch.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response.status === 401) {
				// in most cases, token expires will bring 401
				displayAlert('danger', 'Your login has expired... Please login again.');
				setTimeout(() => logoutUser(), 3000);
			}
			return Promise.reject(error);
		}
	);

	function displayAlert(type, text) {
		dispatch({ type: DISPLAY_ALERT, payload: { type, text } });
		clearAlert();
	}

	function clearAlert() {
		setTimeout(() => {
			dispatch({ type: CLEAR_ALERT });
		}, 3000);
	}

	// loginUser and registerUser
	async function setupUser({ currentUser, endPoint, alertText }) {
		dispatch({ type: SETUP_USER_BEGIN });
		try {
			const response = await axios.post(`/api/v1/auth/${endPoint}`, currentUser);
			const { user, location } = response.data;
			dispatch({ type: SETUP_USER_SUCCESS, payload: { user, location, alertText } });
		} catch (error) {
			dispatch({ type: SETUP_USER_ERROR, payload: { msg: error.response.data.msg } });
		}
		clearAlert();
	}

	async function logoutUser() {
		await authFetch.get('/auth/logout');
		dispatch({ type: LOGOUT_USER });
	}

	async function updateUser(currentUser) {
		dispatch({ type: UPDATE_USER_BEGIN });
		try {
			const { data } = await authFetch.patch('/auth/updateUser', currentUser);

			const { user, location } = data;
			dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, location } });
		} catch (error) {
			if (error.response.status !== 401) dispatch({ type: UPDATE_USER_ERROR, payload: { msg: error.response.data.msg } });
		}
		clearAlert();
	}

	function toggleSidebar() {
		dispatch({ type: TOGGLE_SIDEBAR });
	}

	function handleChange(name, value) {
		dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
	}

	function clearJobInput() {
		dispatch({ type: CLEAR_JOB_INPUT });
	}

	async function createJob() {
		dispatch({ type: CREATE_JOB_BEGIN });
		try {
			const { company, position, jobLocation, jobType, status } = state;

			await authFetch.post('/jobs', { company, position, jobLocation, jobType, status });

			dispatch({ type: CREATE_JOB_SUCCESS });

			dispatch({ type: CLEAR_JOB_INPUT });
		} catch (error) {
			if (error.response.status === 401) return;
			dispatch({ type: CREATE_JOB_ERROR, payload: { msg: error.response.data.msg } });
		}
		clearAlert();
	}

	async function getJobs() {
		const { page, search, searchStatus, searchType, sort } = state;
		let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}&search=${search}`;

		dispatch({ type: GET_JOBS_BEGIN });

		try {
			const { data } = await authFetch(url);

			const { jobs, totalJobs, numOfPages } = data;
			dispatch({ type: GET_JOBS_SUCCESS, payload: { jobs, totalJobs, numOfPages } });
		} catch (error) {
			logoutUser();
		}
		clearAlert();
	}

	function setEditJob(id) {
		dispatch({ type: SET_EDIT_JOB, payload: { id } });
	}

	async function editJob() {
		dispatch({ type: EDIT_JOB_BEGIN });
		try {
			const { company, position, jobLocation, jobType, status } = state;

			await authFetch.patch(`/jobs/${state.editJobId}`, { company, position, jobLocation, jobType, status });

			dispatch({ type: EDIT_JOB_SUCCESS });
			dispatch({ type: CLEAR_JOB_INPUT });
		} catch (error) {
			if (error.response.status === 401) return;
			dispatch({ type: EDIT_JOB_ERROR, payload: { msg: error.response.data.msg } });
		}
		clearAlert();
	}

	async function deleteJob(jobId) {
		dispatch({ type: DELETE_JOB_BEGIN });
		try {
			await authFetch.delete(`/jobs/${jobId}`);
			getJobs();
		} catch (error) {
			if (error.response.status === 401) return;
			dispatch({
				type: DELETE_JOB_ERROR,
				payload: { msg: error.response.data.msg },
			});
		}
		clearAlert();
	}

	async function showStats() {
		dispatch({ type: SHOW_STATS_BEGIN });
		try {
			const { data } = await authFetch.get('/jobs/stats');

			dispatch({
				type: SHOW_STATS_SUCCESS,
				payload: {
					stats: data.stats,
					monthlyApplications: data.monthlyApplications,
				},
			});
		} catch (error) {
			logoutUser();
		}
		clearAlert();
	}

	function clearFilters() {
		dispatch({ type: CLEAR_FILTERS });
	}

	function changePage(page) {
		dispatch({ type: CHANGE_PAGE, payload: page });
	}

	async function getCurrentUser() {
		dispatch({ type: GET_CURRENT_USER_BEGIN });
		try {
			const { data } = await authFetch('/auth/getCurrentUser');
			const { user, location } = data;

			dispatch({
				type: GET_CURRENT_USER_SUCCESS,
				payload: { user, location },
			});
		} catch (error) {
			if (error.response.status === 401) return;
			logoutUser();
		}
	}

	useEffect(() => {
		getCurrentUser();
		// eslint-disable-next-line
	}, []);

	return (
		<AppContext.Provider
			value={{
				...state,
				displayAlert,
				setupUser,
				logoutUser,
				toggleSidebar,
				updateUser,
				handleChange,
				clearJobInput,
				createJob,
				getJobs,
				setEditJob,
				editJob,
				deleteJob,
				showStats,
				clearFilters,
				changePage,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => {
	return useContext(AppContext);
};

export { initialState, AppProvider, useAppContext };
