$(document.body).transition('options', {defaultPageTransition : 'fade', domCache : true});

var	warsztaty = [],
	warsztaty_filtered = warsztaty,
	artykuly = [],
	new_version = false,
	warsztaty_file_exists = false,
	warsztaty_loaded = false,
	artykuly_loaded = false,
	fi_path = 'installed.dat',
	warsztaty_path = 'warsztaty.dat',
	warsztaty_from_file = false,
	//artykulyUrl = 'http://www.q-service.com.pl/rss/',
	artykulyUrl = 'http://arcontact.pl/warsztaty_inter_cars/rss.php',
	warsztatyUrl = 'http://arcontact.pl/warsztaty_inter_cars/feed.php',
	form_email = 'mifdetal@intercars.eu',
	map,
	startingLatitude = 52.069347,
	startingLongitude = 19.480204;

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
function checkConnection() {
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
	var artykulyDiv = document.getElementById("artykuly");
	if(artykuly_loaded) {
		var list = document.createElement('ul');
		var	xmlDoc = $(artykuly).children();
		var c = $(xmlDoc).find('item');
		var months = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"];
		for(var i=0;i<c.length;i++){
			var d = $(c[i]);
			var title = $(d[0]).find('title').text();
			var link = $(d[0]).find('link').text();
			var pubDate = $(d[0]).find('pubDate').text();
			var _date = new Date(Date.parse(pubDate));
			var date_string = _date.getDate() + " " + months[_date.getMonth()] + " " + _date.getFullYear();
			var li = document.createElement('li');
			li.innerHTML = '<a onclick="window.open(\''+link+'\',\'_system\',\'location=no\')"><i class="fa fa-chevron-circle-right pull-right"></i><h6>'+title+'</h6><span>'+date_string+'</span></a>';
			list.appendChild(li);
		}
		artykulyDiv.innerHTML = "<ul>"+list.innerHTML+"</ul>";
	} else {
		artykulyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać najnowsze aktualności. <a onclick="location.reload();"><i class="fa fa-refresh"></i> odśwież</a></div>';
	}
}
function checkVersion(){
	$.ajax({
		url: warsztatyUrl,
		type: 'GET',
		async: false,
		cache: false,
		data: {type:"version"},
		dataType: 'json',
		success: function(response){
			if(supports_html5_storage()){
				if(typeof localStorage["version"] != 'undefined' ){
					var _local_version = JSON.parse(localStorage["version"]);
					if( parseInt(_local_version.version) != parseInt(response.version) ) {
						localStorage["version"] = JSON.stringify(response);
						new_version = true;
					}
				} else {
					localStorage["version"] = JSON.stringify(response);
					new_version = true;
				}
			}
		}
	});
}
function feedWarsztaty(){
	if(gotConnection()){
		$.ajax({
			url: warsztatyUrl,
			type: 'GET',
			async: false,
			cache: false,
			data: {type:"list"},
			dataType: 'json',
			success: function(response){
				if(typeof response != 'undefined'){
					warsztaty = response;
					warsztaty_loaded = true;
				} else {
					warsztaty_loaded = false;
				}
			},
			error: function(){
				warsztaty_loaded = false;
			}
		});
	} else {
		warsztaty_loaded = false;
	}
}
function renderWarsztaty(){
	var warsztatyDiv = document.getElementById("warsztaty");
	warsztatyDiv.innerHTML = '<div class="panel text-center">Wgrano listę warsztatów.</div>';
}
function fileExists(fe){
	window.plugins.toast.showShortBottom('fileExists',function(a){},function(b){});
	fe.file(function(file){
		var reader = new FileReader();
		reader.onloadend = function(e){
			warsztaty = JSON.parse(this.result);
			warsztaty_loaded = true;
		};
		reader.readAsText(file);
	},function(e){
		warsztaty_loaded = false;
		window.plugins.toast.showLongCenter('fileExists error',function(a){},function(b){});
	});
}
function fileNotExists(fs){
	feedWarsztaty();
	if(warsztaty_loaded){
		fs.root.getFile(warsztaty_path,{create:true,exclusive:true},function(fe){
			fe.createWriter(function(fw){
				fw.onerror = function(e){
					warsztaty_loaded = false;
				};
				var inputData = JSON.stringify(warsztaty);
				fw.write(inputData);
			},function(e){
				warsztaty_loaded = false;
			});
		}, function(e){
			warsztaty_loaded = false;
		});
	}
}
function warsztatyFailFS(){
	warsztaty_loaded = false;
}
$(document).ready(function() {
	$("header ul li a").removeClass("active");
	var targetID = $(".ui-page-active").attr('id');
	$('header ul li a[href="'+targetID+'"]').addClass("active");
	$("header .logo").on("click",function(){
		$("header ul li a").removeClass("active");
	});
	$(document).on("pagebeforechange",function(e,eventData){
		$("header ul li a").removeClass("active");
		targetID = eventData.toPage;
		$('header ul li a[href="'+targetID+'"]').addClass("active");
	});
	
	$(".loader").animate({"opacity":0},500,function(){this.remove();});
	$("footer").animate({"bottom":0},500);
	
	if(gotConnection()){
		feedArtykuly();
		checkVersion();
		if(new_version) {
			feedWarsztaty();
		} else {
			warsztaty_from_file = true;
		}
	} else {
		artykuly_loaded = false;
		warsztaty_from_file = true;
	}
	
	if(warsztaty_from_file){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
			fs.root.getFile(warsztaty_path, {create:true,exclusive:true}, fileExists, fileNotExists);
		}, warsztatyFailFS);
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
	if(warsztaty_loaded){
		renderWarsztaty();
	} else {
		var warsztatyDiv = document.getElementById("warsztaty");
		if(gotConnection()) {
			warsztatyDiv.innerHTML = '<div class="panel text-center">Nie udało się wgrać listy warsztatów.</div>';
		} else {
			warsztatyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać listę warsztatów. <a onclick="location.reload();"><i class="fa fa-refresh"></i> odśwież</a></div>';
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
			window.plugins.toast.showLongCenter('Nawiązano połączenie z internetem.',function(a){},function(b){});
		}
		if(!artykuly_loaded){
			feedArtykuly();
		}
    }
};