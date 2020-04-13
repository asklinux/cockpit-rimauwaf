$(function() {

	
check_httpd();
check_modsec();
view_log();

$("input[name = 'tukar']").change(function(){
	

	if ($(this).val() == 1){
		var checkmodsec = cockpit.spawn(["cli-rimau-checkms","-o"]);
		checkmodsec.catch(masalah_modsec);
		checkmodsec.then(paparmodsec);
		check_modsec();
	}
	else if ($(this).val() == 2){
		var checkmodsec = cockpit.spawn(["cli-rimau-checkms","-f"]);
		checkmodsec.catch(masalah_modsec);
		checkmodsec.then(paparmodsec);
		check_modsec();
	}
	else if ($(this).val() == 3){
		var checkmodsec = cockpit.spawn(["cli-rimau-checkms","-p"]);
		checkmodsec.catch(masalah_modsec);
		checkmodsec.then(paparmodsec);
		check_modsec();
	}

	
	
});

$("#restart").on("click", function(data){

	var runa = cockpit.spawn(["systemctl", "reload", "httpd"]);
	runa.catch(status_a);
	runa.then(status_a);

	
});

});

function view_log(){
	var runa = cockpit.spawn(["tail", "-n10", "/var/log/httpd/modsec_audit.log"]);
	runa.catch(status_a);
	runa.then(status_a);
}

function status_a(data){

	$("#appstat").text(data);
	console.log("test")

}
          
function check_httpd() {

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

	dp = 'Apache Server Runing';
	$("#apachestat").html(dp);
	$("#display").addClass('alert-success');

}
function masalah(data){

	if (data == 'systemctl exited with code 3'){
		dp = '<div class="alert alert-info"> Apache Server Is Stop </div>';
	}
	else if (data ='systemctl exited with code 4'){
		dp = '<div class="alert alert-danger"> Apache Web Server Not Install</div>';
	}
	else{
		dp = '<div class="alert alert-danger"> '+data+'</div>';
	}
	
	$("#display").html(dp);
}
function paparmodsec(data){

	cstat = $.trim(data);

	if(cstat == 'SecRuleEngine On'){
		psec = '<img src="onwaf.jpg"/>';
	}
	else if(cstat == 'SecRuleEngine Off'){
		psec = '<img src="offwaf.jpg"/>';	
	}
	else{
		psec = '<img src="logwaf.jpg"/>';	
	}
	
	$("#modsecstat").html(psec);

	
}
function masalah_modsec(data){
	$("#modsec").text(data);
}


