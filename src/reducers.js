import { combineReducers } from 'redux';
import appReducer from './appReducer';
import assessmentReducer from './app/assessments/assessmentReducer';
import collaboratorReducer from './app/components/collaborators/collaboratorReducer';

//import appReducer from './assessment/reducer';

const reducer = combineReducers({
	app: appReducer,
	assessments: assessmentReducer,
	collaborators: collaboratorReducer,
	wt: (state = {}) => state
});

export default reducer;
