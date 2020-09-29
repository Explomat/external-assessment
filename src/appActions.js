
export const constants = {
	'LOADING': 'LOADING',
	'ERROR': 'ERROR',
	'INFO': 'INFO'
};

export function loading(isLoading){
	return {
		type: constants.LOADING,
		payload: isLoading
	}
};

export function error(msg){
	return {
		type: constants.ERROR,
		payload: msg
	}
};

export function info(msg){
	return {
		type: constants.INFO,
		payload: msg
	}
};
