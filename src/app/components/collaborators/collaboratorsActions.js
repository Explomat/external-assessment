import createRemoteActions from '../../../utils/createRemoteActions';
import request from '../../../utils/request';
import { error, info } from '../../../appActions';

export const constants = {
	...createRemoteActions([
		'FETCH_COLLABORATORS',
		'POST_COLLABORATORS'
	]),
	'LOADING_COLLABORATORS': 'LOADING_COLLABORATORS',
	'SELECT_COLLABORATOR_ITEM': 'SELECT_COLLABORATOR_ITEM',
	'RESET_SELECTED_COLLABORATORS': 'RESET_SELECTED_COLLABORATORS',
	'SET_COLLABORATORS_SEARCH': 'SET_COLLABORATORS_SEARCH'
};

export function loadingCollaborators(isLoading){
	return {
		type: constants.LOADING_COLLABORATORS,
		payload: isLoading
	}
};

export function resetSelectedCollaborators(){
	return {
		type: constants.RESET_SELECTED_COLLABORATORS
	}
}

export function selectItem(checked, item, multiple) {
	return {
		type: constants.SELECT_COLLABORATOR_ITEM,
		payload: {
			checked,
			item,
			multiple
		}
	}
}

function setSearch(s){
	return {
		type: constants.SET_COLLABORATORS_SEARCH,
		payload: s
	}
}

function assigning(isAssigning){
	return {
		type: constants.ASSIGN_COLLABORATORS,
		payload: isAssigning
	}
}

export function getCollaborators(page, pageSize, search){
	return (dispatch, getState) => {

		dispatch(loadingCollaborators(true));
		const state = getState();
		const p = page || state.collaborators.meta.page;
		const s = (search === undefined || search === null) ? state.collaborators.meta.search : search;
		dispatch(setSearch(s));

		request('Collaborators')
		.get({
			search: s,
			page: p,
			page_size: pageSize || state.collaborators.meta.pageSize
		})
		.then(r => r.json())
		.then(d => {
			if (d.type === 'error'){
				throw d;
			}
			dispatch({
				type: constants.FETCH_COLLABORATORS_SUCCESS,
				payload: {
					data: d.data,
					page: p
				}
			});
			dispatch(loadingCollaborators(false));
		})
		.catch(e => {
			dispatch(loadingCollaborators(false));
			console.error(e);
			dispatch(error(e.message));
		});
	}
};
