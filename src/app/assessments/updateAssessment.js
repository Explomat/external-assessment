import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import CollaboratorsList from '../components/collaborators';
import { Card, Input, Button, Select, DatePicker, Modal, PageHeader, Checkbox } from 'antd';
import UploadFile from  '../components/uploadFile';
import { createBaseUrl } from '../../utils/request';
import toBoolean from '../../utils/toBoolean';
import { getAssessmentSelections, getAssessment, saveAssessment, onChange, onResetEdit } from './assessmentActions';

import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';
import './index.css';
moment.locale('ru');


class UpdateAssessment extends Component {

	constructor(props){
		super(props);

		this.handleSave = this.handleSave.bind(this);
		this.handleRemoveFile = this.handleRemoveFile.bind(this);
		this.handleUploadFile = this.handleUploadFile.bind(this);
		this.handleToggleCollaborators = this.handleToggleCollaborators.bind(this);

		this.state = {
			isShowCollaborators: false
		}
	}

	componentDidMount(){
		const { onResetEdit, getAssessmentSelections, match } = this.props;
		onResetEdit();

		if (match.params.id) {
			this.props.getAssessment(match.params.id);
		} else {
			getAssessmentSelections();
		}
	}

	handleUploadFile(f) {
		const { onChange } = this.props;

		onChange({
			file: f.id
		});
	}

	handleRemoveFile() {
		const { onChange } = this.props;

		onChange({
			file: ''
		});
	}

	handleChangeDate(e) {
		const { onChange } = this.props;

		onChange({
			date: e.target.value
		});
	}


	handleSave() {
		const { saveAssessment, history, match } = this.props;
		saveAssessment(match.params.id, history);
	}

	handleToggleCollaborators() {
		this.setState({
			isShowCollaborators: !this.state.isShowCollaborators
		});
	}

	render() {
		const { assessment, selections, collaboratorsCount, isNew, ui, history, onChange } = this.props;

		if (ui.isLoading) {
			return null;
		}

		const { isShowCollaborators } = this.state;

		return (
			<ConfigProvider locale={ruRU}>
				<div className='assessment-update'>
					<PageHeader onBack={history.goBack} title={isNew ? 'Создание' : 'Редактирование'} className='assessment-update__body'>
						<Card>
							<Input.Search
								placeholder='Выберите сотрудника'
								className='assessment-update__fullname'
								enterButton='...'
								value={assessment.collaborator_fullname}
								onSearch={this.handleToggleCollaborators}
							/>
							<Select
								className='assessment-update__project'
								placeholder='Выберите категорию'
								value={assessment.proc_category_id}
								onSelect={val => onChange({ proc_category_id: val })}
							>
								{selections.categories.map(s => {
									return (
										<Select.Option key={s.id} value={s.id}>{s.title}</Select.Option>
									);
								})}
							</Select>
							<Select
								className='assessment-update__category'
								placeholder='Проект'
								value={assessment.project_id}
								onSelect={val => onChange({ project_id: val })}
							>
								{selections.projects.map(s => {
									return (
										<Select.Option key={s.id} value={s.id}>{s.title}</Select.Option>
									);
								})}
							</Select>
							<DatePicker
								className='assessment-update__date'
								allowClear={false}
								placeholder='Выберите дату'
								value={moment(assessment.date)}
								onChange={val => onChange({ date: val })}
							/>
							<Select
								className='assessment-update__state'
								placeholder='Статус'
								value={assessment.state_id}
								onSelect={val => onChange({ state_id: val })}
							>
								{selections.states.map(s => {
									return (
										<Select.Option key={s.id} value={s.id}>{s.title}</Select.Option>
									);
								})}
							</Select>
							<Input.TextArea
								placeholder='Комментарий'
								autoSize={{ minRows: 2, maxRows: 6 }}
								className='assessment-update__comment'
								value={assessment.comment}
								onChange={e => onChange({ comment: e.target.value })}
							/>
							<UploadFile
								className='assessment-update__file'
								url={createBaseUrl('File')}
								accept='image/x-png,image/gif,image/jpeg'
								disabled={!!assessment.file}
								fileList={ !!assessment.file ? [{id: assessment.file}] : null}
								onSuccess={this.handleUploadFile}
								onRemove={this.handleRemoveFile}
							/>
							<Checkbox
								className='assessment-update__notificate'
								checked={toBoolean(assessment.is_notificate)}
								onChange={e => onChange({ is_notificate: e.target.checked })}
							>
								Отправлять уведомление при создании
							</Checkbox>
							<div className='clearfix' />
							<div className='assessment__header_buttons'>
								<Button size='small' className='assessment__header_cancel-button' onClick={history.goBack}>Отмена</Button>
								<Button
									disabled={assessment.collaborator_fullname.trim() === ''}
									type='primary'
									size='small'
									className='assessment__header_save-button'
									onClick={this.handleSave}
								>
									Сохранить
								</Button>
							</div>
						</Card>
						{isShowCollaborators && <Modal
							width = {820}
							title='Сотрудники'
							okText='Выбрать'
							okButtonProps={{
								disabled: collaboratorsCount === 0
							}}
							cancelText='Отмена'
							visible
							onCancel={this.handleToggleCollaborators}
							onOk={this.handleToggleCollaborators}
						>
							<CollaboratorsList />
						</Modal>}
					</PageHeader>
				</div>
			</ConfigProvider>
		);
	}
}

function mapStateToProps(state){
	return {
		assessment: state.assessments.currentAssessment,
		selections: state.assessments.selections,
		collaboratorsCount: state.collaborators.selectedCollaborators.length,
		ui: state.assessments.ui
	}
}

export default withRouter(connect(mapStateToProps, { getAssessmentSelections, getAssessment, saveAssessment, onChange, onResetEdit })(UpdateAssessment));