import { constants } from './collaboratorsActions';

const collaboratorReducer = (state = {
	collaborators: [],
	selectedCollaborators: [],
	meta: {
		search: '',
		total: 0,
		page: 1,
		pageSize: 10
	},
	ui: {
		isLoadingCollaborators: false
	}
}, action) => {
	switch(action.type) {

		case constants.FETCH_COLLABORATORS_SUCCESS: {
			return {
				...state,
				collaborators: action.payload.data.collaborators,
				meta: {
					...state.meta,
					...action.payload.data.meta,
					page: action.payload.page
				}  
			}
		}

		case constants.SELECT_COLLABORATOR_ITEM: {
			const { checked, item, multiple } = action.payload;

			const items = state.collaborators.map(s => {
				if (s.id === item.id){
					return {
						...s,
						checked: checked
					}
				} 

				if (!multiple) {
					return {
						...s,
						checked: false
					}
				}

				return s;
			});

			let sc = state.selectedCollaborators;

			if (checked){
				if (multiple) {
					sc = state.selectedCollaborators.concat(item);
				} else {
					sc = [item];
				}

				return {
					...state,
					collaborators: items,
					selectedCollaborators: sc
				}
			} else {
				return {
					...state,
					collaborators: items,
					selectedCollaborators: state.selectedCollaborators.filter(s => s.id !== item.id)
				}
			}
		}

		case constants.RESET_SELECTED_COLLABORATORS: {
			return {
				...state,
				collaborators: state.collaborators.map(s => {
					return {
						...s,
						checked: false
					}
				}),
				selectedCollaborators: []
			}
		}

		case constants.SET_COLLABORATORS_SEARCH: {
			return {
				...state,
				meta: {
					...state.meta,
					search: action.payload
				}
			}
		}

		case constants.LOADING_COLLABORATORS: {
			return {
				...state,
				ui: {
					...state.ui,
					isLoadingCollaborators: action.payload
				}
			};
		}

		default: return state;
	}
}

export default collaboratorReducer;