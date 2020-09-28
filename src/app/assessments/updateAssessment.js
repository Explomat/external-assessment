import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Card, Input, Button, Select, DatePicker } from 'antd';
import UploadFile from  '../components/uploadFile';
import { createBaseUrl } from '../../utils/request';
import toBoolean from '../../utils/toBoolean';
import IconText from '../components/iconText';
import { getAssessmentSelections, saveAssessment, onChange, onResetEdit } from './assessmentActions';
import './index.css';


class UpdateAssessment extends Component {

	constructor(props){
		super(props);

		this.handleChangeStatus = this.handleChangeStatus.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleRemoveFile = this.handleRemoveFile.bind(this);
		this.handleUploadFile = this.handleUploadFile.bind(this);
		this.handleCancelEdit = this.handleCancelEdit.bind(this);
	}

	componentDidMount(){
		const { getAssessmentSelections } = this.props;
		getAssessmentSelections();
	}

	handleCancelEdit() {
		const { onResetEdit } = this.props;
		onResetEdit();

		this.handleToggleEdit();
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

	handleChangeComment(e) {
		const { onChange } = this.props;

		onChange({
			comment: e.target.value
		});
	}

	handleChangeState(e) {
		const { onChange } = this.props;

		onChange({
			state_id: e.target.value
		});
	}

	handleChangeDate(e) {
		const { onChange } = this.props;

		onChange({
			date: e.target.value
		});
	}

	handleChangeProject(e) {
		const { onChange } = this.props;

		onChange({
			project_id: e.target.value
		});
	}

	handleChangeCategory(e) {
		const { onChange } = this.props;

		onChange({
			proc_category_id: e.target.value
		});
	}

	handleChangeCollaborator(e) {
		const { onChange } = this.props;

		onChange({
			collaborator_id: e.target.value
		});
	}

	handleChangeStatus(e) {
		const { onChange } = this.props;

		onChange({
			state_id: e.target.value
		});
	}

	handleSave() {
		const { assessment, saveAssessment } = this.props;
		saveAssessment(assessment.id);

		this.handleToggleEdit();
	}

	render() {
		const { assessment, selections, isNew, ui, history } = this.props;

		if (ui.isLoading) {
			return null;
		}

		return (
			<div className='assessment-update'>
				<div className='assessment-update__body'>
					<Card title={isNew ? 'Создание' : 'Редактирование'}>
						<Input.Search
							placeholder='Выберите сотрудника'
							className='assessment-update__fullname'
							enterButton='...'
							value={assessment.collaborator_fullname}
							onChange={this.handleChangeTitle}
						/>
						<Select
							className='assessment-update__project'
							placeholder='Выберите категорию'
							value={assessment.proc_category_id}
							onSelect={this.handleChangeSort}
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
							onSelect={this.handleChangeSort}
						>
							{selections.projects.map(s => {
								return (
									<Select.Option key={s.id} value={s.id}>{s.title}</Select.Option>
								);
							})}
						</Select>
						<DatePicker className='assessment-update__date' placeholder='Выберите дату' value={assessment.date} onChange={onChange} />
						<Select
							className='assessment-update__state'
							placeholder='Статус'
							value={assessment.state_id}
							onSelect={this.handleChangeSort}
						>
							{selections.states.map(s => {
								return (
									<Select.Option key={s.id} value={s.id}>{s.title}</Select.Option>
								);
							})}
						</Select>
						<Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} className='assessment-update__comment' value={assessment.comment} onChange={this.handleChangeDescription} />
						<UploadFile
							className='assessment-update__file'
							url={createBaseUrl('File')}
							accept='image/x-png,image/gif,image/jpeg'
							disabled={!!assessment.file}
							fileList={ !!assessment.file ? [{id: assessment.file}] : null}
							onSuccess={this.handleUploadFile}
							onRemove={this.handleRemoveFile}
						/>

						<div className='assessment__header_buttons'>
							<Button size='small' className='assessment__header_cancel-button' onClick={this.handleCancelEdit}>Отмена</Button>
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
						<div className='clearfix' />
					</Card>
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

export default connect(mapStateToProps, { getAssessmentSelections, saveAssessment, onChange, onResetEdit })(UpdateAssessment);