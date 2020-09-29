<%

//curUserID = 6711785032659205612; // me test
//curUserID = 6719948502038810952; // volkov test

var _Assessments = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/assessment.js');
DropFormsCache('x-local://wt/web/vsk/portal/external-assessment/server/assessment.js');

var _Utils = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/utils.js');
DropFormsCache('x-local://wt/web/vsk/portal/external-assessment/server/utils.js');

function get_Assessments(queryObjects) {

	var assessmentId = queryObjects.GetOptProperty('id');
	var assessmentsObj = {};

	try {
		if (assessmentId != undefined) {
			assessmentsObj = _Assessments.getObject(assessmentId, curUserID);
		} else {
			var search = queryObjects.HasProperty('search') ? queryObjects.search : '';
			var status = queryObjects.HasProperty('status') ? queryObjects.status : 'active';
			var page = queryObjects.HasProperty('page') ? OptInt(queryObjects.page) : 1;
			var sort = queryObjects.HasProperty('sort') ? String(queryObjects.sort) : 'date';
			var sortDirection = queryObjects.HasProperty('sort_direction') ? String(queryObjects.sort_direction) : 'desc';
			var pageSize = queryObjects.HasProperty('page_size') ? OptInt(queryObjects.page_size) : 6;

			var min = (page - 1) * pageSize;
			var max = min + pageSize;

			assessmentsObj = _Assessments.list(curUserID, search, status, min, max, pageSize, sort, sortDirection);
		}		
	} catch(e) {
		return _Utils.setError(e);
	}

	return _Utils.setSuccess(assessmentsObj);
}

function get_AssessmentSelections() {
	return _Utils.setSuccess(_Assessments.getSelections());
}

function post_Assessments(queryObjects) {
	var assessmentId = queryObjects.GetOptProperty('id');

	//var data = queryObjects.Request.Form;
	//alert(tools.object_to_text(data, 'json'));
	var data = tools.read_object(queryObjects.Body);
	var collaboratorId = data.GetOptProperty('collaborator_id');
	var procCategoryId = data.GetOptProperty('proc_category_id');
	var projectId = data.GetOptProperty('project_id');
	var date = data.GetOptProperty('date');
	var stateId = data.GetOptProperty('state_id');
	var comment = data.GetOptProperty('comment');
	var file = data.GetOptProperty('file');
	var resId = null;

	if (collaboratorId == undefined) {
		return _Utils.setError('Не выбран сотрудник');
	}

	// create new
	if (assessmentId == undefined || assessmentId == 'undefined') {
		try {
			if (!_Assessments.isAccessToAdd(curUserID)) {
				return _Utils.setError('У вас нет прав на создание');
			}

			var userDoc = OpenDoc(UrlFromDocID(curUserID));
			resId = file != undefined ? file : null;

			var aDoc = _Assessments.create(collaboratorId, procCategoryId, projectId, date, stateId, comment, resId, curUserID);
			return _Utils.setSuccess(aDoc);
		} catch(e) {
			return _Utils.setError(e);
		}
	}

	//update
	try {
		if (!_Assessments.isAccessToUpdate(assessmentId, curUserID)) {
			return _Utils.setError('У вас нет прав на редактирование');
		}

		var aDoc = _Assessments.update(assessmentId, data, curUserID);
		//alert('update topic: 2');
		return _Utils.setSuccess(aDoc);
	} catch(e) {
		return _Utils.setError(e);
	}
}

function delete_Assessments(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var assessmentId = data.GetOptProperty('id');

	if (assessmentId != undefined) {
		try {
			if (!_Assessments.isAccessToRemove(assessmentId, curUserID)) {
				return _Utils.setError('У вас нет прав на удаление');
			}

			_Assessments.remove(assessmentId);
			return _Utils.setSuccess();
		} catch(e) {
			return _Utils.setError(e);
		}
	}
	return _Utils.setError('Unknown parameters');
}

function post_File(queryObjects) {
	var data = queryObjects.Request.Form;
	var file = data.GetOptProperty('file');

	if (file == undefined) {
		return _Utils.setError('Файл не выбран');
	}

	var userDoc = OpenDoc(UrlFromDocID(curUserID));
	var resDoc = _Utils.createResourseWithImage(curUserID, userDoc.TopElem.fullname, file.FileName, file);

	return _Utils.setSuccess(_Utils.toJSObject(resDoc.TopElem));
}

function delete_File(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var resId = data.GetOptProperty('id');

	if (resId != undefined) {
		try {
			DeleteDoc(UrlFromDocID(Int(resId)));
			return _Utils.setSuccess();
		} catch(e) {
			return _Utils.setError(e);
		}
	}

	return _Utils.setError('Неизвестные параметры');	
}

function get_Collaborators(queryObjects){
	var search = queryObjects.HasProperty('search') ? queryObjects.search : '';
	var page = queryObjects.HasProperty('page') ? OptInt(queryObjects.page) : 1;
	var pageSize = queryObjects.HasProperty('page_size') ? OptInt(queryObjects.page_size) : 10;


	var min = (page - 1) * pageSize;
	var max = min + pageSize;

	var q = XQuery("sql: \n\
		declare @s varchar(max) = '" + search + "'; \n\
		select \n\
			d.* \n\
		from ( \n\
			select \n\
				count(cs.id) over() total, \n\
				ROW_NUMBER() OVER (ORDER BY cs.fullname) AS [row_number], \n\
				cs.id, \n\
				cs.code, \n\
				cs.fullname title, \n\
				cs.pict_url, \n\
				cs.position_name, \n\
				cs.position_parent_name \n\
			from collaborators cs \n\
			where \n\
				cs.fullname like '%'+@s+'%' \n\
				and cs.is_dismiss = 0 \n\
		) d \n\
		where \n\
			d.[row_number] > " + min + " and d.[row_number] <= " + max + " \n\
	");

	var total = 0;
	var fobj = ArrayOptFirstElem(q);
	if (fobj != undefined) {
		total = fobj.total;
	}

	var obj = {
		meta: {
			total: Int(total),
			pageSize: pageSize
		},
		collaborators: q
	}

	return _Utils.setSuccess(obj);
}

%>