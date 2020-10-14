import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Avatar, Icon, Input, Button, Select, Pagination } from 'antd';
import IconText from '../components/iconText';
import { Link } from 'react-router-dom';
import { getAssessments, removeAssessment, newAssessment, onChangeMeta } from './assessmentActions';
import { createBaseUrl } from '../../utils/request';
import './index.css';

class Assessments extends Component {

	constructor(props){
		super(props);

		this.handleChangeSearchText = this.handleChangeSearchText.bind(this);
		this.handleChangeStatusText = this.handleChangeStatusText.bind(this);
		this.handleChangeProject = this.handleChangeProject.bind(this);
		this.handleChangePagination = this.handleChangePagination.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleChangeSort = this.handleChangeSort.bind(this);

		this.handleToggleNew = this.handleToggleNew.bind(this);

		this.state = {
			isShowNew: false
		}
		//this.formRef = React.createRef();
	}

	componentDidMount(){
		const { meta, getAssessments } = this.props;
		getAssessments(meta.searchText, meta.statusText, meta.project, meta.page, meta.sort, meta.sortDirection);
	}

	handleChangeSort(val) {
		const { onChangeMeta, getAssessments, meta } = this.props;
		const [ sort, sortDirection ] = val.split(':');

		onChangeMeta({
			sort,
			sortDirection
		});

		getAssessments(meta.searchText, meta.statusText, meta.project, 1, sort, sortDirection);
	}

	handleChangeSearchText(e) {
		const { onChangeMeta, meta } = this.props;
		onChangeMeta({
			searchText: e.target.value,
			page: 1
		});
	}

	handleChangeStatusText(statusText) {
		const { onChangeMeta, getAssessments, meta } = this.props;
		onChangeMeta({
			statusText,
			page: 1
		});

		getAssessments(meta.searchText, statusText, meta.project, 1, meta.sort, meta.sortDirection);
	}

	handleChangeProject(project) {
		const { onChangeMeta, getAssessments, meta } = this.props;
		onChangeMeta({
			project,
			page: 1
		});

		getAssessments(meta.searchText, meta.statusText, project, 1, meta.sort, meta.sortDirection);
	}

	handleChangePagination(page, pageSize) {
		const { onChangeMeta, getAssessments, meta } = this.props;
		onChangeMeta({
			page,
			pageSize
		});

		getAssessments(meta.searchText, meta.statusText, meta.project, page, meta.sort, meta.sortDirection);
	}

	handleSearch(val) {
		const { onChangeMeta, getAssessments, meta } = this.props;
		onChangeMeta({
			page: 1
		});

		getAssessments(meta.searchText, meta.statusText, meta.project, 1, meta.sort, meta.sortDirection);
	}

	handleToggleNew() {
		this.setState({
			isShowNew: !this.state.isShowNew
		});
	}

	render() {
		const { meta, selections, assessments, removeAssessment } = this.props;

		return (
			<div className='assessments-container'>
				{/*<div className='assessments-container__title'>Новостная лента</div>*/}
				<div className='assessments'>
					<div className='assessments__filters'>
						<Input
							className='assessments__filters_search'
							placeholder='Поиск по сотрудникам'
							prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
							onPressEnter={this.handleSearch}
							onChange={this.handleChangeSearchText}
							value={meta.searchText}
						/>
						{meta.isModerator && <Select
							className='assessments__filters_status'
							value={meta.statusText}
							onSelect={this.handleChangeStatusText}
						>
							<Select.Option value='0'>Все статусы</Select.Option>
							{selections.states.map(s =>
								<Select.Option key={s.id} value={s.id}>{s.title}</Select.Option>
							)}
						</Select>}
						{meta.isModerator && <Select
							className='assessments__filters_project'
							value={meta.project}
							onSelect={this.handleChangeProject}
						>
							<Select.Option value='0'>Все проекты</Select.Option>
							{selections.projects.map(s =>
								<Select.Option key={s.id} value={s.id}>{s.title}</Select.Option>
							)}
						</Select>}
						<Select
							className='assessments__filters_sort'
							value={`${meta.sort}:${meta.sortDirection}`}
							onSelect={this.handleChangeSort}
						>
							<Select.Option value='collaborator_fullname:asc'>По названию (возрастанию)</Select.Option>
							<Select.Option value='collaborator_fullname:desc'>По названию (убыванию)</Select.Option>
							<Select.Option value='date:asc'>По дате (возрастанию)</Select.Option>
							<Select.Option value='date:desc'>По дате (убыванию)</Select.Option>
						</Select>
						{meta.canAdd && <Button type='link' href={`${window.location.href}/new`} className='assessments__filters_add' type='primary' onClick={this.handleToggleNew}>Добавить +</Button>}
					</div>
					<List
						className='assessments-list'
						itemLayout='horizontal'
						dataSource={assessments}
						renderItem={item => (
							<List.Item
								extra={new Date(item.date).toLocaleDateString()}
								actions={
									[(meta.canDelete && <IconText type='delete' className='assessments__assessment-list_footer_delete' onClick={() => {
										if (window.confirm(`Вы действительно хотите удалить оценку "${item.collaborator_fullname} ?"`)) {
											removeAssessment(item.id);
										}
									}}/>)]
								}
							>
								<List.Item.Meta
									avatar={
										<Avatar src={item.collaborator_pict_url} />
									}
									title={
										<Link to={`/assessments/${item.id}`}>
											<span className={`assessments-list__state assessments-list__state--${item.state_code}`}>{item.state_title}</span>
											{item.collaborator_fullname}
										</Link>
									}
									description={`${item.collaborator_subdivision_name} -> ${item.collaborator_position_name}`}
								/>
								
							</List.Item>
						)}
					/>
				</div>
				<Pagination
					defaultCurrent={1}
					current={meta.page}
					pageSize={meta.pageSize}
					total={meta.total}
					onChange={this.handleChangePagination}
				/>
			</div>	
		);
	}
}

function mapStateToProps(state){
	return {
		assessments: state.assessments.list,
		meta: state.assessments.meta,
		selections: state.assessments.selections
	}
}

export default connect(mapStateToProps, { getAssessments, removeAssessment, newAssessment, onChangeMeta })(Assessments);