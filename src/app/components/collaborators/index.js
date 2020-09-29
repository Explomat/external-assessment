import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCollaborators, resetSelectedCollaborators, selectItem } from './collaboratorsActions';
import { List, Checkbox, Avatar, Icon, Input } from 'antd';
import './collaborators.css';

class CollaboratorsList extends Component {

	componentDidMount() {
		this.props.getCollaborators();
	}

	componentWillUnmount() {
		this.props.resetSelectedCollaborators();
	}

	render() {
		const {
			collaborators,
			selectedCollaborators,
			ui,
			meta,
			selectItem,
			getCollaborators,
			multiple
		} = this.props;

		return (
			<div className='collaborators'>
				<Input
					className='collaborators__search'
					allowClear
					placeholder='Поиск'
					prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
					onPressEnter={(e) => getCollaborators(1, null, e.target.value)}
				/>
				<List
					size='small'
					itemLayout = 'horizontal'
					loading = { (ui.isLoadingCollaborators || ui.isAssignCollaborators) }
					dataSource = { collaborators }
					pagination = {
						{
							onChange: (page, pageSize) => {
								getCollaborators(page, pageSize);
							},
							current: meta.page,
							pageSize: meta.pageSize,
							total: meta.total
						}
					}
					renderItem={item => (
						<List.Item
							key={item.id}
							actions={[<Checkbox key={1} checked={item.checked} onChange={(e) => selectItem(e.target.checked, item)}>Выбрать</Checkbox>]}
						>
							<List.Item.Meta
								avatar={<Avatar src={item.pict_url} />}
								title={item.title}
							/>
						</List.Item>
					)}
				/>
				{selectedCollaborators.length > 0 && (
					<div className='selected-collaborators-container'>
						<h3>Выбранные элементы</h3>
						<div className='selected-collaborators'>
							<List
								itemLayout = 'horizontal'
								dataSource = {selectedCollaborators}
								renderItem={item => (
									<List.Item
										key={item.id}
										actions={[<Icon type='delete' onClick={() => selectItem(false, item, multiple)} style={{ fontSize: '17px' }} />]}
									>
										<List.Item.Meta
											avatar={<Avatar src={item.pict_url} />}
											title={item.title}
										/>
									</List.Item>
								)}
							/>
						</div>
					</div>
				)}
			</div>
		);
	}
}


function mapStateToProps(state){
	return {
		...state.collaborators
	}
}

export default connect(mapStateToProps, { getCollaborators, resetSelectedCollaborators, selectItem })(CollaboratorsList);
