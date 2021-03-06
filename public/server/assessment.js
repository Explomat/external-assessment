function _setComputedFields(obj, user_id) {
	var User = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/user.js');
	DropFormsCache('x-local://wt/web/vsk/portal/external-assessment/server/user.js');

	var actions = User.getActions(user_id, 'cc_ex_assessment_main');
	obj.date = StrXmlDate(DateNewTime(Date(obj.date)));
	obj.meta = {
		canEdit: (ArrayOptFind(actions, "This == 'update'") != undefined),
		canDelete: (ArrayOptFind(actions, "This == 'remove'") != undefined)
	}

	return obj;
}

function create(collaboratorId, procCategoryId, projectId, date, stateId, comment, fileId, userId) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/utils.js');

	var c = ArrayOptFirstElem(XQuery("sql: \n\
		select cs.* \n\
		from collaborators cs \n\
		where cs.id = " + collaboratorId + " \n\
	"));

	if (c != undefined) {
		//alert('111');
		var aDoc = tools.new_doc_by_name('cc_ex_assessment_main');
		//alert('222');
		aDoc.TopElem.collaborator_id = Int(collaboratorId);
		//alert('333');
		aDoc.TopElem.collaborator_fullname = String(c.fullname);
		//alert('444');
		aDoc.TopElem.collaborator_position_name = String(c.position_name);
		//alert('555');
		aDoc.TopElem.collaborator_subdivision_name = String(c.position_parent_name);
		//alert('6');
		aDoc.TopElem.proc_category_id = procCategoryId;
		//alert('7');
		aDoc.TopElem.project_id = projectId;
		//alert('8');
		aDoc.TopElem.date = date;
		//alert('9');
		aDoc.TopElem.state_id = stateId;
		//alert('10');
		aDoc.TopElem.comment = comment;
		//alert('11');
		aDoc.TopElem.file = fileId;
		//alert('12');

		aDoc.BindToDb();
		aDoc.Save();
		return _setComputedFields(Utils.toJSObject(aDoc.TopElem), userId);
	}
	
	return null;
}

function update(id, data, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/utils.js');

	var aDoc = null;

	try {
		aDoc = OpenDoc(UrlFromDocID(Int(id)));
	} catch(e) {
		throw 'Невозможно обновить документ. Ошибка: ' + e;
	}

	for (el in data) {
		try {
			field = aDoc.TopElem.OptChild(el);
			field.Value = data[el];
		} catch(e) {
			Utils.log(e);
		}
	}

	aDoc.Save();
	return _setComputedFields(Utils.toJSObject(aDoc.TopElem), user_id);
}

function remove(id) {
	var aDoc = OpenDoc(UrlFromDocID(Int(id)));
	var resId = aDoc.TopElem.file;
	if (resId != null && resId != undefined && resId != '' && resId != 'undefined') {
		DeleteDoc(UrlFromDocID(Int(resId)));
	}
	DeleteDoc(UrlFromDocID(Int(id)));
}

function getSelections() {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/utils.js');

	var cats = XQuery("sql: \n\
		select c.id, c.title \n\
		from cc_ex_assessment_proc_categorys c \n\
		order by c.title asc \n\
	");

	var ps = XQuery("sql: \n\
		select c.id, c.title \n\
		from cc_ex_assessment_projects c \n\
		order by c.title asc \n\
	");

	var st = XQuery("sql: \n\
		select c.id, c.title \n\
		from cc_ex_assessment_states c \n\
		order by c.title asc \n\
	");

	return {
		categories: Utils.toJSArray(cats),
		projects: Utils.toJSArray(ps),
		states: Utils.toJSArray(st)
	}
}

function getObject(id, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/utils.js');

	var el = ArrayOptFirstElem(
		XQuery("sql: \n\
			select \n\
				cceit.id, \n\
				cceit.collaborator_id, \n\
				cceit.collaborator_fullname, \n\
				cceit.collaborator_position_name, \n\
				cceit.collaborator_subdivision_name, \n\
				cceit.proc_category_id, \n\
				cceapc.title proc_category_title, \n\
				cceit.project_id, \n\
				cceap.title project_title, \n\
				cceit.date, \n\
				cceit.state_id, \n\
				cceas.code state_code, \n\
				cceas.title state_title, \n\
				cceit.comment, \n\
				cceit.[file], \n\
				rs.file_name, \n\
				cceit.is_notificate \n\
			from \n\
				cc_ex_assessment_mains cceit \n\
			left join cc_ex_assessment_proc_categorys cceapc on cceapc.id = cceit.proc_category_id \n\
			left join cc_ex_assessment_projects cceap on cceap.id = cceit.project_id \n\
			left join cc_ex_assessment_states cceas on cceas.id = cceit.state_id \n\
			left join resources rs on rs.id = cceit.[file] \n\
			where \n\
				cceit.id = " + id
		)
	);

	var lobj = {
		assessment: _setComputedFields(Utils.toJSObject(el), user_id),
		selections: getSelections()
	}
	return lobj;
}

function list(user_id, search, status, project, minRow, maxRow, pageSize, sort, sortDirection) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/utils.js');
	var User = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/user.js');
	DropFormsCache('x-local://wt/web/vsk/portal/external-assessment/server/user.js');

	var lq = "sql: \n\
		declare @s varchar(300) = '" + search + "'; \n\
		declare @status bigint = " + status + "; \n\
		declare @project bigint = " + project + "; \n\
		select d.* \n\
		from ( \n\
			select \n\
				c.*, \n\
				row_number() over (order by c." + sort + " " + sortDirection + ") as [row_number] \n\
			from ( \n\
				select \n\
					count(cceit.id) over() total, \n\
					cceit.id, \n\
					cceit.collaborator_id, \n\
					cceit.collaborator_fullname, \n\
					cceit.collaborator_position_name, \n\
					cceit.collaborator_subdivision_name, \n\
					cs.pict_url collaborator_pict_url, \n\
					cceit.proc_category_id, \n\
					cceapc.title proc_category_title, \n\
					cceit.project_id, \n\
					cceap.title project_title, \n\
					cceit.date, \n\
					cceit.state_id, \n\
					cceas.code state_code, \n\
					cceas.title state_title, \n\
					cceit.comment, \n\
					cceit.[file], \n\
					rs.file_name, \n\
					cceit.is_notificate \n\
				from cc_ex_assessment_mains cceit \n\
				left join cc_ex_assessment_proc_categorys cceapc on cceapc.id = cceit.proc_category_id \n\
				left join cc_ex_assessment_projects cceap on cceap.id = cceit.project_id \n\
				left join cc_ex_assessment_states cceas on cceas.id = cceit.state_id \n\
				left join collaborators cs on cs.id = cceit.collaborator_id \n\
				left join resources rs on rs.id = cceit.[file] \n\
				where \n\
					cceit.collaborator_fullname like '%'+@s+'%' \n\
					and (cceas.id = @status or @status = 0) \n\
					and (cceit.project_id = @project or @project = 0) \n\
			) c \n\
		) d \n\
		where \n\
			d.[row_number] > " + minRow + " and d.[row_number] <= " + maxRow + " \n\
		order by d." + sort + " " + sortDirection
	;

	alert(lq);

	var l = XQuery(lq);
	var larr = Utils.toJSArray(l);
	for (el in larr) {
		_setComputedFields(el, user_id);
	}

	var total = 0;
	var fobj = ArrayOptFirstElem(l);
	if (fobj != undefined) {
		total = fobj.total;
	}

	var actions = User.getActions(user_id, 'cc_ex_assessment_main');
	var isModerator = User.isModerator(user_id);
	var obj = {
		meta: {
			total: Int(total),
			pageSize: pageSize,
			canAdd: (ArrayOptFind(actions, "This == 'add'") != undefined),
			canDelete: (ArrayOptFind(actions, "This == 'remove'") != undefined),
			isModerator: isModerator
		},
		selections: getSelections(),
		assessments: larr
	}
	return obj;
}

function isAccessToUpdate(id, user_id) {
	var User = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/user.js');
	DropFormsCache('x-local://wt/web/vsk/portal/external-assessment/server/user.js');

	var actions = User.getActions(user_id, 'cc_ex_assessment_main');
	var updateAction = ArrayOptFind(actions, "This == 'update'");
	//var topicDoc = OpenDoc(UrlFromDocID(Int(id)));
	return updateAction != undefined;
	//return (updateAction != undefined && !topicDoc.TopElem.is_archive);
}

function isAccessToRemove(id, user_id) {
	var User = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/user.js');
	DropFormsCache('x-local://wt/web/vsk/portal/external-assessment/server/user.js');

	var actions = User.getActions(user_id, 'cc_ex_assessment_main');
	var removeAction = ArrayOptFind(actions, "This == 'remove'");
	//var topicDoc = OpenDoc(UrlFromDocID(Int(id)));
	return removeAction != undefined;
	//return (removeAction != undefined && !topicDoc.TopElem.is_archive);
}

function isAccessToAdd(user_id) {
	var User = OpenCodeLib('x-local://wt/web/vsk/portal/external-assessment/server/user.js');
	DropFormsCache('x-local://wt/web/vsk/portal/external-assessment/server/user.js');

	var actions = User.getActions(user_id, 'cc_ex_assessment_main');
	var addAction = ArrayOptFind(actions, "This == 'add'");
	return (addAction != undefined);
}