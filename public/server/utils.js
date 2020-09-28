function toJSON(data){
	return tools.object_to_text(data, 'json');
}

function log(message){
	EnableLog('external-assessment');
	LogEvent('external-assessment', message);
}

function setMessage(type, message){
	return {
		type: type,
		message: String(message)
	}
}

function setSuccess(data){
	var m = setMessage('success');
	m.data = data;
	return toJSON(m);
}

function setError(message){
	log(message);
	return toJSON(setMessage('error', message));
}

function notificate(templateCode, primaryId, text, secondaryId){
	tools.create_notification(templateCode, primaryId, text, secondaryId);
}

function toJSObject(xmlElem) {
	var returnObj = {};
	for (el in xmlElem){
		try {
			returnObj.SetProperty(el.Name, String(el.Value));
		} catch(e) {}
	}
	return returnObj;
}

function toJSArray(xmlArray) {
	var returnArr = [];

	for (el in xmlArray) {
		returnArr.push(toJSObject(el));
	}

	return returnArr;
}

function toBoolean(val) {
	if (val == 'true') {
		return true;
	}

	if (val == true) {
		return true;
	}

	return false;
}

function createResourseWithImage(userId, userFullname, fileName, imageBinary) {
	fileName = String(fileName);
	var fileTypeIndex = fileName.indexOf('.');
	var fileType = fileName.substr(fileTypeIndex, fileName.length);

	var docResource = tools.new_doc_by_name('resource'); 
	docResource.TopElem.code = 'external-assessment';
	docResource.TopElem.person_id = userId; 
	docResource.TopElem.allow_unauthorized_download = true;
	docResource.TopElem.allow_download = true;
	docResource.TopElem.file_name = fileName;
	docResource.TopElem.name = fileName;
	docResource.TopElem.type = fileType;
	docResource.TopElem.person_fullname = userFullname;
	docResource.BindToDb();
	docResource.TopElem.put_str(imageBinary, fileName); 
	docResource.Save();

	return docResource;
}