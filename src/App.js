import React, { Component } from 'react';
//import { withRouter } from 'react-router';
import { connect } from 'react-redux';
//import { error, info } from './appActions';
import { Route, Redirect, Switch } from 'react-router-dom';
import Assessments from './app/assessments';
import Assessment from './app/assessments/assessment';
import UpdateAssessment from './app/assessments/updateAssessment';
import './App.css';

class App extends Component {
	render() {
		const { ui } = this.props;

		return (
			<div className='external-assessments'>
				{ui.isLoading && <div>Загрузка данных</div>}
				{!!ui.error && <div>{ui.error}</div>}
				{!!ui.info && <div>{ui.info}</div>}
				<Switch>
					<Route exact path='/' render={() => <Redirect to='/assessments' />} />
					<Route exact path='/assessments' component={Assessments}/>
					<Route exact path='/assessments/new'>
						<UpdateAssessment isNew />
					</Route>
					<Route exact path='/assessments/:id' component={Assessment}/>
					<Route exact path='/assessments/:id/edit' component={UpdateAssessment}/>
				</Switch>
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		ui: state.app.ui
	}
}

export default connect(mapStateToProps)(App);