import createRemoteActions from '../../utils/createRemoteActions';
import { error } from '../../appActions';
import request from '../../utils/request';

export const constants = {
	...createRemoteActions([
		'ASSESSMENTS_FETCH',
		'ASSESSMENT_SELECTIONS_FETCH',
		'ASSESSMENT_FETCH',
		'ASSESSMENTS_EDIT',
		'ASSESSMENTS_REMOVE',
		'ASSESSMENTS_ADD',
		'ASSESSMENTS_SAVE'
	]),
	'ASSESSMENTS_LOADING': 'ASSESSMENTS_LOADING',
	'ASSESSMENTS_CHANGE': 'ASSESSMENTS_CHANGE',
	'ASSESSMENTS_CHANGE_META': 'ASSESSMENTS_CHANGE_META',
	'ASSESSMENTS_RESET_EDIT': 'ASSESSMENTS_RESET_EDIT'
};

export function loading(isLoading){
	return {
		type: constants.ASSESSMENTS_LOADING,
		payload: isLoading
	}
};

export function onChange(data) {
	return {
		type: constants.ASSESSMENTS_CHANGE,
		payload: {
			data
		}
	}
}

export function onChangeMeta(data) {
	return {
		type: constants.ASSESSMENTS_CHANGE_META,
		payload: {
			data
		}
	}
}

export function onResetEdit() {
	return {
		type: constants.ASSESSMENTS_RESET_EDIT
	}
}

export function removeAssessment(id){
	return dispatch => {
		request('Assessments')
			.delete({ id })
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.ASSESSMENTS_REMOVE_SUCCESS,
					payload: {
						id
					}
				});
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};

export function newAssessment(title, description, file){
	return dispatch => {
		const obj = {
			title,
			description
		}

		if (file) {
			obj.file = file;
		}

		request('Assessments')
			.post(obj)
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.ASSESSMENTS_ADD_SUCCESS,
					payload: d.data
				});
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};

export function saveAssessment(id, history){
	return (dispatch, getState) => {
		const st = getState();
		const at = st.assessments.currentAssessment;

		const reqObj = id ? { id } : {};

		request('Assessments', reqObj)
			.post(at)
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.ASSESSMENTS_SAVE_SUCCESS,
					payload: d.data
				});

				history.goBack();
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};

export function getAssessmentSelections() {
	return (dispatch, getState) => {
		dispatch(loading(true));

		request('AssessmentSelections')
			.get()
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					dispatch(loading(false));
					throw d;
				}
				dispatch({
					type: constants.ASSESSMENT_SELECTIONS_FETCH_SUCCESS,
					payload: d.data
				});

				dispatch(loading(false));
			})
			.catch(e => {
				console.error(e);
				dispatch(loading(false));
				dispatch(error(e.message));
			});
	}
}

export function getAssessment(id) {
	return (dispatch, getState) => {
		dispatch(loading(true));

		request('Assessments')
			.get({ id })
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					dispatch(loading(false));
					throw d;
				}
				dispatch({
					type: constants.ASSESSMENT_FETCH_SUCCESS,
					payload: d.data
				});

				dispatch(loading(false));
			})
			.catch(e => {
				console.error(e);
				dispatch(loading(false));
				dispatch(error(e.message));
			});
	}
}

export function getAssessments(){
	return (dispatch, getState) => {

		const meta = getState().assessments.meta;

		request('Assessments')
			.get({
				search: meta.searchText,
				status: meta.statusText,
				page: meta.page,
				sort: meta.sort,
				sort_direction: meta.sortDirection
			})
			.then(r => r.json())
			.then(d => {
				if (d.type === 'error'){
					throw d;
				}
				dispatch({
					type: constants.ASSESSMENTS_FETCH_SUCCESS,
					payload: d.data
				});
			})
			.catch(e => {
				console.error(e);
				dispatch(error(e.message));
			});
	}
};