$(function() {

check_httpd();

});


function check_httpd() {

	var semak = cockpit.spawn("systemctl status httpd");
	semak.done(papar);

}
function papar(data){

	$("#display").text(data);

}
