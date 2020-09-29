import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PageHeader, Tooltip } from 'antd';
import IconText from '../components/iconText';
import { getAssessment } from './assessmentActions';
import './index.css';


class Assessment extends Component {

	componentDidMount(){
		const { getAssessment, match } = this.props;
		getAssessment(match.params.id);
	}

	render() {
		const { assessment, selections, ui, history, match } = this.props;

		if (ui.isLoading) {
			return null;
		}

		const procCategory = selections.categories.find(c => c.id == assessment.proc_category_id);
		const project = selections.projects.find(c => c.id == assessment.project_id);
		const state = selections.states.find(c => c.id== assessment.state_id);

		return (
			<div className='assessment'>
				<div className='assessment__body'>
					<div>
						<PageHeader
							onBack={history.goBack}
							title={<h3 className='assessment__body_title'>{assessment.collaborator_fullname}</h3>}
							subTitle={
								<span>
									<span className='assessment__header_container'>
										<span className={`assessments-list__state assessments-list__state--${assessment.state_code}`}>{assessment.state_title}</span>
										<span className='assessment__header_publish-date'>{new Date(assessment.date).toLocaleDateString()}</span>
									</span>
								</span>
							}
							extra={
								((assessment.meta && assessment.meta.canEdit) && (
										<Tooltip title='Реактировать'>
											<Link to={`${match.params.id}/edit`}>
												<IconText type='edit' onClick={this.handleToggleEdit} />
											</Link>
										</Tooltip>
									)
								)
							}
						/>
						<ul className='assessment__info'>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									ФИО
								</span>
								<span className='assessment__info-cell'>
									{assessment.collaborator_fullname}
								</span>
							</li>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									Должность
								</span>
								<span className='assessment__info-cell'>
									{assessment.collaborator_position_name}
								</span>
							</li>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									Подразделение
								</span>
								<span className='assessment__info-cell'>
									{assessment.collaborator_subdivision_name}
								</span>
							</li>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									Категория оценочной процедуры:
								</span>
								<span className='assessment__info-cell'>
									{procCategory ? procCategory.title : ''}
								</span>
							</li>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									Проект
								</span>
								<span className='assessment__info-cell'>
									{project ? project.title : ''}
								</span>
							</li>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									Дата
								</span>
								<span className='assessment__info-cell'>
									{new Date(assessment.date).toLocaleDateString()}
								</span>
							</li>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									Статус
								</span>
								<span className='assessment__info-cell'>
									{state ? state.title : ''}
								</span>
							</li>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									Комментарий
								</span>
								<span className='assessment__info-cell'>
									{assessment.comment}
								</span>
							</li>
							<li className='assessment__info-row'>
								<span className='assessment__info-cell'>
									Файл
								</span>
								<span className='assessment__info-cell'>
									{assessment.file_name}
								</span>
							</li>
						</ul>
						{/*assessment.file && <img className='assessment__image' src={`/download_file.html?file_id=${assessment.file}`} />*/}
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		assessment: state.assessments.currentAssessment,
		selections: state.assessments.selections,
		ui: state.assessments.ui
	}
}

export default connect(mapStateToProps, { getAssessment })(Assessment);