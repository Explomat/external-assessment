function getActions(user_id, object_type) {
	var actions = [];

	var actionsq = XQuery("sql: \n\
		select ccia.action \n\
		from cc_ex_assessment_roles ccir \n\
		inner join cc_ex_assessment_moderators ccim on ccim.role_id = ccir.id \n\
		inner join cc_ex_assessment_actions ccia on ccia.role_id = ccim.role_id \n\
		where \n\
			ccim.user_id = " + user_id + " \n\
			and ccia.object_type = '" + object_type + "'");

	for (el in actionsq) {
		actions.push(String(el.action));
	}

	return actions;
}

function isModerator(user_id) {
	var q = ArrayOptFirstElem(XQuery("sql: \n\
		select ccir.id \n\
		from cc_ex_assessment_roles ccir \n\
		inner join cc_ex_assessment_moderators ccim on ccim.role_id = ccir.id \n\
		where \n\
			ccim.user_id = " + user_id + " \n\
			and ccir.code = 'moderator'"));

	return (q != undefined); 
}

function getBoss(collaboratorId) {

	var q = XQuery("sql: \n\
		select fm.person_id \n\
		from func_managers fm \n\
		where \n\
			fm.[object_id] = " + collaboratorId + " \n\
			and fm.catalog = 'collaborator' \n\
			and fm.is_native = 1 \n\
	");

	return q == undefined ? q : q.person_id;
}