$(function() {

    load_rules();

   

    $("body").delegate("#aktif", "click", function(){
        var rules = $(this).val();
        var addrule = cockpit.spawn(["ln","-s",rules ,"/etc/httpd/modsecurity.d/activated_rules/"]);
        addrule.catch(masalah_load);
        addrule.then(papar_rules);
    });

});



    function load_rules(){
        var listrules = cockpit.spawn(["cli-rimau-checkms","-r"]);
        listrules.catch(masalah_load);
        listrules.then(papar_rules);
    
    }
    
    function masalah_load(data){
        $("#info").html(data);
    }
    function papar_rules(data){
    
        data.split("\n").forEach(function(entry){
            if (entry)
                   prx = entry.replace('/etc/httpd/owasp-modsecurity-crs/rules/','');
                   $("#listrules").append('<tr><td>'+prx.replace('.conf','')+'</td><td><button id="aktif" value="'+entry+'">Active</button></td></tr>'); 
            
        });
    }