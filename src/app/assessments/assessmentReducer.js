import { constants } from './assessmentActions';

const listReducer = (state = [], action) => {
	switch(action.type) {
		case constants.ASSESSMENTS_ADD_SUCCESS: {
			return state.concat(action.payload);
		}

		case constants.ASSESSMENTS_REMOVE_SUCCESS: {
			const id = action.payload.id;
			return state.filter(t => t.id !== id);
		}

		case constants.ASSESSMENTS_EDIT_SUCCESS: {
			const id = action.payload.id;
			return state.map(t => {
				if (t.id === id){
					return action.payload;
				}
				return t;
			});
		}
		default: return state;
	}
}

const assessmentReducer = (state = {
	list: [],
	currentAssessment: {
		id: null,
		collaborator_id: null,
		collaborator_fullname: '',
		collaborator_position_name: '',
		collaborator_subdivision_name: '',
		proc_category_id: null,
		project_id: null,
		date: null,
		state_id: null,
		comment: '',
		file: null
	},
	defaultCurrentAssessment: {},
	ui: {
		isLoading: false
	},
	meta: {
		canAdd: false,
		sort: 'date',
		sortDirection: 'desc',
		page: 1,
		pageSize: 1,
		total: 1,
		searchText: '',
		statusText: 'active'
	},
	selections: {
		categories: [],
		projects: [],
		states: []
	}
}, action) => {
	switch(action.type) {
		case constants.ASSESSMENTS_FETCH_SUCCESS: {
			return {
				...state,
				list: action.payload.assessments,
				meta: {
					...state.meta,
					...action.payload.meta
				}
			}
		}

		case constants.ASSESSMENT_FETCH_SUCCESS: {
			return {
				...state,
				currentAssessment: action.payload.assessment,
				defaultCurrentAssessment: action.payload.assessment,
				selections: action.payload.selections
			}
		}

		case constants.ASSESSMENT_SELECTIONS_FETCH_SUCCESS: {
			return {
				...state,
				selections: action.payload
			}
		}

		case constants.ASSESSMENTS_CHANGE: {
			const { data } = action.payload;

			return {
				...state,
				currentAssessment: {
					...state.currentAssessment,
					...data
				}
			}
		}

		case constants.ASSESSMENTS_SAVE_SUCCESS: {
			return {
				...state,
				currentAssessment: {
					...state.currentAssessment,
					...action.payload
				},
				defaultCurrentAssessment: {
					...state.defaultCurrentAssessment,
					...action.payload
				}
			}
		}

		case constants.ASSESSMENTS_RESET_EDIT: {
			return {
				...state,
				currentAssessment: {
					...state.defaultCurrentAssessment
				}
			}
		}

		case constants.ASSESSMENTS_CHANGE_META: {
			const { data } = action.payload;

			return {
				...state,
				meta: {
					...state.meta,
					...data
				}
			}
		}

		case constants.ASSESSMENTS_ADD_SUCCESS:
		case constants.ASSESSMENTS_REMOVE_SUCCESS:
		case constants.ASSESSMENTS_EDIT_SUCCESS: {
			return {
				...state,
				list: listReducer(state.list, action)
			}
		}

		case constants.ASSESSMENTS_LOADING: {
			return {
				...state,
				ui: {
					...state.ui,
					isLoading: action.payload
				}
			}
		}

		default: return state;
	}
}

export default assessmentReducer;