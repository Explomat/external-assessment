import React from 'react';
import { Icon} from 'antd';
import './index.css';

const IconText = ({ type, text, children, ...props }) => (
	<span className='my-icon-text'>
		<Icon type={type} style={{ marginRight: 4, color: '#0066a0' }} {...props} />
		{text}
		{children}
	</span>
);

export default IconText;