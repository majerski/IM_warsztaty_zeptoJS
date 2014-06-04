$(document.body).transition('options', {defaultPageTransition : 'fade', domCache : true});

var	warsztaty = [],
	artykuly = [],
	warsztaty_loaded = false,
	artykuly_loaded = false,
	fi_path = 'installed.dat',
	artykulyUrl = 'http://www.q-service.com.pl/rss/',
	//artykulyUrl = 'http://arcontact.pl/warsztaty_inter_cars/rss.php',
	warsztatyUrl = 'http://arcontact.pl/warsztaty_inter_cars/feed.php',
	form_email = 'mifdetal@intercars.eu',
	map,
	startingLatitude = 52.069347,
	startingLongitude = 19.480204;

function checkConnection() {
	//
	return 'ok';
	//
	if(typeof navigator.connection == 'undefined' || typeof navigator.connection.type == 'undefined') {
		return 'fail';
	}
	var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'fail';
    return states[networkState];
}
function gotConnection(){
	var a = checkConnection();
	if(a == 'fail'){return false;}
	return true;
}
function feedArtykuly(){
	if(gotConnection()){
		$.ajax({
			url: artykulyUrl,
			type: 'GET',
			async: false,
			cache: false,
			dataType: 'xml',
			success: function(response){
				if(typeof response != 'undefined'){
					artykuly = response;
					artykuly_loaded = true;
				} else {
					artykuly_loaded = false;
				}
			},
			error: function(){
				artykuly_loaded = false;
			}
		});
	} else {
		if(typeof window.plugins != 'undefined' && typeof window.plugins.toast != 'undefined'){
			window.plugins.toast.showLongCenter('Brak połączenia z internetem.',function(a){},function(b){});
		}
		artykuly_loaded = false;
	}
}
function renderArtykuly(){
	var list = document.createElement('ul');
	var	xmlDoc = $(artykuly).children();
	var c = $(xmlDoc).find('item');
	var months = Array("Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia");
	for(var i=0;i<c.length;i++){
		var title = $($(c[i])[0]).find('title').html();
		var link = $($(c[i])[0]).find('link').html();
		var pubDate = $($(c[i])[0]).find('pubDate').html();
		var _date = new Date(Date.parse(pubDate));
		var date_string = _date.getDate() + " " + months[_date.getMonth()] + " " + _date.getFullYear();
		var li = document.createElement('li');
		li.innerHTML = '<a onclick="window.open(\''+link+'\',\'_system\',\'location=no\')"><i class="fa fa-chevron-circle-right pull-right"></i><h6>'+title+'</h6><span>'+date_string+'</span></a>';
		list.appendChild(li);
	}
	$("#artykuly").html(list);
}
$(document).ready(function() {
	$("header .logo").on("click",function(){
		$("header ul li a").removeClass("active");
	});
	$(document).on("pagebeforechange",function(e,eventData){
		$("header ul li a").removeClass("active");
		var targetID = eventData.toPage;
		$('header ul li a[href="'+targetID+'"]').addClass("active");
	});
	$(".loader").animate({"opacity":0},500,function(){this.remove();});
	$("footer").animate({"bottom":0},500);
	
	if(gotConnection()){
		feedArtykuly();
	} else {
		artykuly_loaded = false;
	}
	
	if(artykuly_loaded){
		renderArtykuly();
	} else {
		var artykulyDiv = document.getElementById("artykuly");
		if(gotConnection()) {
			artykulyDiv.innerHTML = '<div class="panel text-center">Nie udało się wgrać aktualności.</div>';
		} else {
			artykulyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać najnowsze aktualności. <a onclick="location.reload();"><i class="fa fa-refresh"></i> odśwież</a></div>';
		}
	}
});	

var app = {
    initialize: function() {
        this.bindEvents();
        this.initFastClick();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("load", this.onLoad, false);
		document.addEventListener("offline", this.onOffline, false);
		document.addEventListener("online", this.onOnline, false);
    },
    initFastClick: function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        },false);
    },
    onDeviceReady: function() {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
			fs.root.getFile(fi_path, {create: false}, function(fe){}, function(ee){
				//wstaw ikone
				if(typeof window.plugins != 'undefined' && typeof window.plugins.Shortcut != 'undefined'){
					window.plugins.Shortcut.CreateShortcut("Inter Cars", function(a){
						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
							fs.root.getFile(fi_path, {create: true, exclusive: false}, function(fe){
								fe.createWriter(function(fw){
									fw.write(new Date().getTime());
								}, failFS);
							}, failFS);
						}, failFS);
					}, function(b){
					});
				}
			});
		}, failFS); 
		function failFS(){
			window.plugins.Shortcut.CreateShortcut("Inter Cars",function(a){},function(b){});
		}
		// tutaj skrypt
    },
	onLoad: function() {
		
    },
	onOffline: function() {
		if(typeof window.plugins != 'undefined' && typeof window.plugins.toast != 'undefined'){
			window.plugins.toast.showLongCenter('Brak połączenia z internetem.',function(a){},function(b){});
		}
	},
	onOnline: function() {
		if(typeof window.plugins != 'undefined' && typeof window.plugins.toast != 'undefined'){
			window.plugins.toast.showShortBottom('Nawiązano połączenie z internetem.',function(a){},function(b){});
		}
		if(!artykuly_loaded){
			feedArtykuly();
		}
    }
};