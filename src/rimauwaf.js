$(function() {

check_httpd();
check_modsec();
view_log();
//refresh();

$("input[name = 'tukar']").click(function(){
	

	if ($(this).val() == 1){
		var checkmodsec = cockpit.spawn(["cli-rimau-checkms","-o"]);
		checkmodsec.catch(masalah_modsec);
		checkmodsec.then(paparmodsec);
		check_modsec();
		reload_apache();
	}
	else if ($(this).val() == 2){
		var checkmodsec = cockpit.spawn(["cli-rimau-checkms","-f"]);
		checkmodsec.catch(masalah_modsec);
		checkmodsec.then(paparmodsec);
		check_modsec();
		reload_apache();
	}
	else if ($(this).val() == 3){
		var checkmodsec = cockpit.spawn(["cli-rimau-checkms","-p"]);
		checkmodsec.catch(masalah_modsec);
		checkmodsec.then(paparmodsec);
		check_modsec();
		reload_apache();
	}

	
	
});

$("#restart").on("click", function(data){

	
	reload_apache();
	
	
});

});

function reload_apache(){
	var runa = cockpit.spawn(["systemctl", "reload", "httpd"]);
	runa.catch(status_a);
	runa.then(status_a);
}

function view_log(){
	var runa = cockpit.spawn(["tail", "-n30", "/var/log/httpd/modsec_audit.log"]);
	runa.catch(status_log);
	runa.then(status_log);
}

function status_a(data){

	$("#appstat").text(data);
	view_log();

}
function status_log(data){

	
	data.split("msg").forEach(function(entry) {
		if (entry)
			$("#appstat").append('<li class="list-group-item">'+entry+'</li>');
	});
	
}
          
function check_httpd(){

	var semak = cockpit.spawn(["systemctl", "status", "httpd"]);
	semak.catch(masalah);
	semak.then(papar);

}
function check_modsec(){
	var checkmodsec = cockpit.spawn(["cli-rimau-checkms","-s"]);
	checkmodsec.catch(masalah_modsec);
	checkmodsec.then(paparmodsec);
}
function papar(data){

	var dp = 'Apache Server Runing';
	$("#apachestat").html(dp);
	$("#display").addClass('alert-success');

}
function masalah(data){

	if (data == 'systemctl exited with code 3'){
		dp = '<div class="alert alert-info"> Apache Server Is Stop </div>';
	}
	else if (data == 'systemctl exited with code 4'){
		dp = '<div class="alert alert-danger"> Apache Web Server Not Install</div>';
	}
	else{
		dp = '<div class="alert alert-danger"> '+data+'</div>';
	}
	
	$("#display").html(dp);
}
function paparmodsec(data){

	var cstat = $.trim(data);

	if(cstat == 'SecRuleEngine On'){
		psec = '<img src="onwaf.jpg"/>';
		$('input[name="tukar"][value="1"]').prop('checked', true);
	}
	else if(cstat == 'SecRuleEngine Off'){
		psec = '<img src="offwaf.jpg"/>';
		$('input[name="tukar"][value="2"]').prop('checked', true);	
	}
	else{
		psec = '<img src="logwaf.jpg"/>';
		$('input[name="tukar"][value="3"]').prop('checked', true);	
	}
	
	$("#modsecstat").html(psec);

	
}
function masalah_modsec(data){
	$("#modsec").text(data);
}
function refresh(){
	setTimeout(function(){
		view_log();
		refresh()
		
	},200);
}

