;(function(e){"use strict";e.jqPagination=function(t,n){var r=this;r.$el=e(t);r.el=t;r.$input=r.$el.find("input");r.$el.data("jqPagination",r);r.init=function(){r.options=e.extend({},e.jqPagination.defaultOptions,n);r.options.max_page===null&&(r.$input.data("max-page")!==undefined?r.options.max_page=r.$input.data("max-page"):r.options.max_page=1);r.$input.data("current-page")!==undefined&&r.isNumber(r.$input.data("current-page"))&&(r.options.current_page=r.$input.data("current-page"));r.$input.removeAttr("readonly");r.updateInput(!0);r.$input.on("focus.jqPagination mouseup.jqPagination",function(t){if(t.type==="focus"){var n=parseInt(r.options.current_page,10);e(this).val(n).select()}if(t.type==="mouseup")return!1});r.$input.on("blur.jqPagination keydown.jqPagination",function(t){var n=e(this),i=parseInt(r.options.current_page,10);if(t.keyCode===27){n.val(i);n.blur()}t.keyCode===13&&n.blur();t.type==="blur"&&r.setPage(n.val())});r.$el.on("click.jqPagination","a",function(t){var n=e(this);if(n.hasClass("disabled"))return!1;if(!t.metaKey&&!t.ctrlKey){t.preventDefault();r.setPage(n.data("action"))}})};r.setPage=function(e,t){if(e===undefined)return r.options.current_page;var n=parseInt(r.options.current_page,10),i=parseInt(r.options.max_page,10);if(isNaN(parseInt(e,10)))switch(e){case"first":e=1;break;case"prev":case"previous":e=n-1;break;case"next":e=n+1;break;case"last":e=i}e=parseInt(e,10);if(isNaN(e)||e<1||e>i){r.setInputValue(n);return!1}r.options.current_page=e;r.$input.data("current-page",e);r.updateInput(t)};r.setMaxPage=function(e,t){if(e===undefined)return r.options.max_page;if(!r.isNumber(e)){console.error("jqPagination: max_page is not a number");return!1}if(e<r.options.current_page){console.error("jqPagination: max_page lower than current_page");return!1}r.options.max_page=e;r.$input.data("max-page",e);r.updateInput(t)};r.updateInput=function(e){var t=parseInt(r.options.current_page,10);r.setInputValue(t);r.setLinks(t);e!==!0&&r.options.paged(t)};r.setInputValue=function(e){var t=r.options.page_string,n=r.options.max_page;t=t.replace("{current_page}",e).replace("{max_page}",n);r.$input.val(t)};r.isNumber=function(e){return!isNaN(parseFloat(e))&&isFinite(e)};r.setLinks=function(e){var t=r.options.link_string,n=parseInt(r.options.current_page,10),i=parseInt(r.options.max_page,10);if(t!==""){var s=n-1;s<1&&(s=1);var o=n+1;o>i&&(o=i);r.$el.find("a.first").attr("href",t.replace("{page_number}","1"));r.$el.find("a.prev, a.previous").attr("href",t.replace("{page_number}",s));r.$el.find("a.next").attr("href",t.replace("{page_number}",o));r.$el.find("a.last").attr("href",t.replace("{page_number}",i))}r.$el.find("a").removeClass("disabled");n===i&&r.$el.find(".next, .last").addClass("disabled");n===1&&r.$el.find(".previous, .first").addClass("disabled")};r.callMethod=function(t,n,i){switch(t.toLowerCase()){case"option":if(i===undefined&&typeof n!="object")return r.options[n];var s={trigger:!0},o=!1;e.isPlainObject(n)&&!i?e.extend(s,n):s[n]=i;var u=s.trigger===!1;s.current_page!==undefined&&(o=r.setPage(s.current_page,u));s.max_page!==undefined&&(o=r.setMaxPage(s.max_page,u));o===!1&&console.error("jqPagination: cannot get / set option "+n);return o;case"destroy":r.$el.off(".jqPagination").find("*").off(".jqPagination");break;default:console.error('jqPagination: method "'+t+'" does not exist');return!1}};r.init()};e.jqPagination.defaultOptions={current_page:1,link_string:"",max_page:null,page_string:"Strona {current_page} z {max_page}",paged:function(){}};e.fn.jqPagination=function(){var t=this,n=e(t),r=Array.prototype.slice.call(arguments),i=!1;if(typeof r[0]=="string"){r[2]===undefined?i=n.first().data("jqPagination").callMethod(r[0],r[1]):n.each(function(){i=e(this).data("jqPagination").callMethod(r[0],r[1],r[2])});return i}t.each(function(){new e.jqPagination(this,r[0])})}})(Zepto);if(!console){var console={},func=function(){return!1};console.log=func;console.info=func;console.warn=func;console.error=func};

$(document.body).transition('options', {defaultPageTransition : 'fade', domCache : true});

var	warsztaty = [],
	warsztatyDiv = document.getElementById("warsztaty"),
	warsztaty_filtered = warsztaty,
	artykuly = [],
	new_version = false,
	warsztaty_file_exists = false,
	warsztaty_loaded = false,
	artykuly_loaded = false,
	fi_path = 'installed.dat',
	warsztaty_path = 'warsztaty.txt',
	warsztaty_from_file = false,
	//artykulyUrl = 'http://www.q-service.com.pl/rss/',
	artykulyUrl = 'http://arcontact.pl/warsztaty_inter_cars/rss.php',
	warsztatyUrl = 'http://arcontact.pl/warsztaty_inter_cars/feed.php',
	form_email = 'mifdetal@intercars.eu',
	map,
	startingLatitude = 52.069347,
	startingLongitude = 19.480204;

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
				window.plugins.toast.showLongCenter('Brak połączenia z internetem.',function(a){},function(b){});
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
				artykulyDiv.innerHTML = '<div class=""<ul>'+list.innerHTML+'</ul>';
				
				$('.pagination').jqPagination({
					paged: function(page) {
						// do something with the page variable
					}
				});
				
			} else {
				artykulyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać najnowsze aktualności.<br /><br /><a onclick="location.reload();"><i class="fa fa-refresh"></i> odśwież</a></div>';
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
			warsztatyDiv.innerHTML = '<div class="warsztaty_pagination"></div>';
		}
		function warsztatyLoadError(){
			if(gotConnection()) {
				warsztatyDiv.innerHTML = '<div class="panel text-center">Nie udało się wgrać listy warsztatów.</div>';
			} else {
				warsztatyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać listę warsztatów.<br /><br /><a onclick="location.reload();"><i class="fa fa-refresh"></i> odśwież</a></div>';
			}
		}
		function fileExists(fe){
			fe.file(function(file){
				var reader = new FileReader();
				reader.onloadend = function(e){
					warsztaty = JSON.parse(this.result);
					warsztaty_loaded = true;
					renderWarsztaty();
				};
				reader.readAsText(file);
			},warsztatyFailFS);
		}
		function fileNotExists(){
			feedWarsztaty();
			if(warsztaty_loaded){
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
					fs.root.getFile(warsztaty_path,{create:true,exclusive:true},function(fe){
						fe.createWriter(function(fw){
							fw.onerror = function(e){
								warsztaty_loaded = false;
							};
							var inputData = JSON.stringify(warsztaty);
							fw.write(inputData);
							renderWarsztaty();
						},warsztatyFailFS);
					},warsztatyFailFS);
				},warsztatyFailFS);
			} else {
				warsztatyLoadError();
			}
		}
		function warsztatyFailFS(e){
			warsztaty_loaded = false;
			warsztatyLoadError();
		}
		//$(document).ready(function() {
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
			
			if(artykuly_loaded){
				renderArtykuly();
			} else {
				var artykulyDiv = document.getElementById("artykuly");
				if(gotConnection()) {
					artykulyDiv.innerHTML = '<div class="panel text-center">Nie udało się wgrać aktualności.</div>';
				} else {
					artykulyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać najnowsze aktualności.<br /><br /><a onclick="location.reload();"><i class="fa fa-refresh"></i> odśwież</a></div>';
				}
			}
			
			if(warsztaty_from_file){
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
					fs.root.getFile(warsztaty_path, {create:false}, fileExists, fileNotExists);
				}, warsztatyFailFS);
			} else if(warsztaty_loaded){
				renderWarsztaty();
			} else {
				warsztatyLoadError();
			}
		//});
    },
	onLoad: function() {
		
    },
	onOffline: function() {
		window.plugins.toast.showLongCenter('Brak połączenia z internetem.',function(a){},function(b){});
	},
	onOnline: function() {
		window.plugins.toast.showLongCenter('Nawiązano połączenie z internetem.',function(a){},function(b){});
		if(!artykuly_loaded){
			feedArtykuly();
		}
    }
};