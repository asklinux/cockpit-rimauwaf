$(function() {

	
check_httpd();
check_modsec();

});

          
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

	dp = '<div class="alert alert-success h-30"><strong>Apache Server Runing</strong><button class="btn btn-sm btn-warning float-right">Restart</button></div>';
	$("#display").html(dp);

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
	}else{
		psec = '<img src="offwaf.jpg"/>';	
	}
	
	$("#modsecstat").html(psec);
	//$("#modsec").text(cstat);

	
}
function masalah_modsec(data){
	$("#modsec").text(data);
}

function change(){
	alert('test');
	$("#modsecstat").html('ubah');
}
