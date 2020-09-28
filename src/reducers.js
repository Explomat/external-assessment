import { combineReducers } from 'redux';
import appReducer from './appReducer';
import assessmentReducer from './app/assessments/assessmentReducer';

//import appReducer from './assessment/reducer';

const reducer = combineReducers({
	app: appReducer,
	assessments: assessmentReducer,
	wt: (state = {}) => state
});

export default reducer;
