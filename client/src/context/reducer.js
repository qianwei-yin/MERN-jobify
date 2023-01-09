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
import { initialState } from './appContext';

const reducer = (state, action) => {
	switch (action.type) {
		case DISPLAY_ALERT:
			return { ...state, showAlert: true, alertType: action.payload.type, alertText: action.payload.text };
		case CLEAR_ALERT:
			return { ...state, showAlert: false };
		case SETUP_USER_BEGIN:
			return { ...state, isLoading: true };
		case SETUP_USER_SUCCESS:
			return {
				...state,
				isLoading: false,
				user: action.payload.user,
				userLocation: action.payload.location,
				jobLocation: action.payload.location,
				showAlert: true,
				alertType: 'success',
				alertText: action.payload.alertText,
			};
		case SETUP_USER_ERROR:
			return {
				...state,
				isLoading: false,
				showAlert: true,
				alertType: 'danger',
				alertText: action.payload.msg,
			};
		case LOGOUT_USER:
			return {
				...initialState,
				userLoading: false,
			};
		case TOGGLE_SIDEBAR:
			return { ...state, showSidebar: !state.showSidebar };
		case UPDATE_USER_BEGIN:
			return { ...state, isLoading: true };
		case UPDATE_USER_SUCCESS:
			return {
				...state,
				isLoading: false,
				user: action.payload.user,
				userLocation: action.payload.location,
				jobLocation: action.payload.location,
				showAlert: true,
				alertType: 'success',
				alertText: 'User profile updated!',
			};
		case UPDATE_USER_ERROR:
			return {
				...state,
				isLoading: false,
				showAlert: true,
				alertType: 'danger',
				alertText: action.payload.msg,
			};
		case HANDLE_CHANGE:
			// when filters change, set back to the first page
			return { ...state, page: 1, [action.payload.name]: action.payload.value };
		case CLEAR_JOB_INPUT:
			const initial_state = {
				isEditing: false,
				editJobId: '',
				company: '',
				position: '',
				jobLocation: state.userLocation || '',
				jobType: 'full-time',
				status: 'pending',
			};
			return {
				...state,
				...initial_state,
			};
		case CREATE_JOB_BEGIN:
			return { ...state, isLoading: true };
		case CREATE_JOB_SUCCESS:
			return {
				...state,
				isLoading: false,
				showAlert: true,
				alertType: 'success',
				alertText: 'New job created!',
			};
		case CREATE_JOB_ERROR:
			return {
				...state,
				isLoading: false,
				showAlert: true,
				alertType: 'danger',
				alertText: action.payload.msg,
			};
		case GET_JOBS_BEGIN:
			// imagine a scenario: when you create a job successfully, there will be an alert
			// And you quickly go to the all-jobs page to check, at this time the alert hasn't disappear
			// So we make the showAlert to false
			return { ...state, isLoading: true, showAlert: false };
		case GET_JOBS_SUCCESS:
			return {
				...state,
				isLoading: false,
				jobs: action.payload.jobs,
				totalJobs: action.payload.totalJobs,
				numOfPages: action.payload.numOfPages,
			};
		case SET_EDIT_JOB:
			const job = state.jobs.find((job) => job._id === action.payload.id);
			const { _id, company, position, jobLocation, jobType, status } = job;
			return { ...state, isEditing: true, editJobId: _id, company, position, jobLocation, jobType, status };
		case DELETE_JOB_BEGIN:
			return { ...state, isLoading: true };
		case DELETE_JOB_ERROR:
			return {
				...state,
				isLoading: false,
				showAlert: true,
				alertType: 'danger',
				alertText: action.payload.msg,
			};
		case EDIT_JOB_BEGIN:
			return { ...state, isLoading: true };
		case EDIT_JOB_SUCCESS:
			return {
				...state,
				isLoading: false,
				showAlert: true,
				alertType: 'success',
				alertText: 'Job updated!',
			};
		case EDIT_JOB_ERROR:
			return {
				...state,
				isLoading: false,
				showAlert: true,
				alertType: 'danger',
				alertText: action.payload.msg,
			};
		case SHOW_STATS_BEGIN:
			return { ...state, isLoading: true, showAlert: false };
		case SHOW_STATS_SUCCESS:
			return {
				...state,
				isLoading: false,
				stats: action.payload.stats,
				monthlyApplications: action.payload.monthlyApplications,
			};
		case CLEAR_FILTERS:
			return { ...state, search: '', searchStatus: 'all', searchType: 'all', sort: 'latest' };
		case CHANGE_PAGE:
			return { ...state, page: action.payload };
		case GET_CURRENT_USER_BEGIN:
			return { ...state, userLoading: true, showAlert: false };
		case GET_CURRENT_USER_SUCCESS:
			return {
				...state,
				userLoading: false,
				user: action.payload.user,
				userLocation: action.payload.location,
				jobLocation: action.payload.location,
			};
		default:
			throw new Error(`no such action : ${action.type}`);
	}
};

export default reducer;
