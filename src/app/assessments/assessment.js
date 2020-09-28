import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageHeader, Icon, Card, Input, Button, Tooltip, Tag } from 'antd';
import UploadFile from  '../components/uploadFile';
import { createBaseUrl } from '../../utils/request';
import toBoolean from '../../utils/toBoolean';
import IconText from '../components/iconText';
import { getAssessment, saveAssessment, onChange, onResetEdit } from './assessmentActions';
import './index.css';


class Assessment extends Component {

	constructor(props){
		super(props);

		this.handleToggleEdit = this.handleToggleEdit.bind(this);
		this.handleChangeTitle = this.handleChangeTitle.bind(this);
		this.handleChangeDescription = this.handleChangeDescription.bind(this);
		this.handleChangeStatus = this.handleChangeStatus.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleUploadFile = this.handleUploadFile.bind(this);
		this.handleRemoveFile = this.handleRemoveFile.bind(this);
		this.handleCancelEdit = this.handleCancelEdit.bind(this);

		this.state = {
			isEdit: false
		}
	}

	componentDidMount(){
		const { getAssessment, match } = this.props;
		getAssessment(match.params.id);
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

	handleToggleEdit() {
		this.setState({
			isEdit: !this.state.isEdit
		});
	}

	handleChangeTitle(e) {
		const { onChange } = this.props;

		onChange({
			title: e.target.value
		});
	}

	handleChangeDescription(e) {
		const { onChange } = this.props;

		onChange({
			description: e.target.value
		});
	}

	handleChangeStatus(isArchive) {
		/*const { topic, archiveTopic } = this.props;
		archiveTopic(topic.id, isArchive);*/
	}

	handleSave() {
		const { assessment, saveAssessment } = this.props;
		saveAssessment(assessment.id);

		this.handleToggleEdit();
	}

	render() {
		const { assessment, ui, history } = this.props;
		const { isEdit } = this.state;

		if (ui.isLoading) {
			return null;
		}

		return (
			<div className='assessment'>
				<div className='assessment__header'>
					{/*<span className='assessment__header_author-fullname'>
						{topic.author_fullname}
					</span>
					<span className='assessment__header_publish-date'>{topic.publish_date}</span>
					{!isEdit && (topic.meta && topic.meta.canEdit) && <Icon type='edit' className='assessment__header_edit-icon' onClick={this.handleToggleEdit} />}
					{isEdit && <Button type='primary' size='small' className='assessment__header_save-button' onClick={this.handleSave}>Сохранить</Button>}*/}
				</div>
				<div className='assessment__body'>
					{isEdit ? (
						<div className='assessment__body_edit'>
							<h3>Редактирование</h3>
							<Input className='assessment__body_edit_title' value={assessment.title} onChange={this.handleChangeTitle} />
							<Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} className='assessment__body_edit_description' value={assessment.description} onChange={this.handleChangeDescription} />
							<UploadFile
								className='assessment__body_edit_file'
								url={createBaseUrl('File')}
								accept='image/x-png,image/gif,image/jpeg'
								disabled={!!assessment.image_id}
								fileList={ !!assessment.image_id ? [{id: assessment.image_id}] : null}
								onSuccess={this.handleUploadFile}
								onRemove={this.handleRemoveFile}
							/>

							<div className='assessment__header_buttons'>
								<Button size='small' className='assessment__header_cancel-button' onClick={this.handleCancelEdit}>Отмена</Button>
								<Button disabled={assessment.title.trim() === '' || assessment.description.trim() === ''} type='primary' size='small' className='assessment__header_save-button' onClick={this.handleSave}>Сохранить</Button>
							</div>
							<div className='clearfix' />
						</div>
					) : (
						<div>
							<PageHeader
								onBack={history.goBack}
								title={<h3 className='assessment__body_title'>{assessment.collaborator_fullname}</h3>}
								subTitle={
									<span>
										<span className='assessment__header_container'>
											{/*<span className='assessment__header_author-fullname'>
												{topic.author_fullname}
											</span>*/}
											<span className={`assessments-list__state assessments-list__state--${assessment.state_code}`}>{assessment.state_title}</span>
											<span className='assessment__header_publish-date'>{new Date(assessment.date).toLocaleDateString()}</span>
										</span>
									</span>
								}
								extra={
									(!isEdit && (assessment.meta && assessment.meta.canEdit) && (
											<Tooltip title='Реактировать'>
												<IconText type='edit' onClick={this.handleToggleEdit} />
											</Tooltip>
										)
									)
								}
							/>
							{assessment.file && <img className='assessment__image' src={`/download_file.html?file_id=${assessment.file}`} />}
							<div className='assessment__body_description' dangerouslySetInnerHTML={{ __html: assessment.description}} />
						</div>
					)}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		assessment: state.assessments.currentAssessment,
		ui: state.assessments.ui
	}
}

export default connect(mapStateToProps, { getAssessment, saveAssessment, onChange, onResetEdit })(Assessment);