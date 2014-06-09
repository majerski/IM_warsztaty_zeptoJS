(function($) {
	$.fn.paginate = function(options) {
		var opts = $.extend({}, $.fn.paginate.defaults, options);
		return this.each(function() {
			$this = $(this);
			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
			var selectedpage = o.start;
			$.fn.draw(o,$this,selectedpage);	
		});
	};
	var outsidewidth_tmp = 0;
	var insidewidth 	 = 0;
	var bName = navigator.appName;
	var bVer = navigator.appVersion;
	if(bVer.indexOf('MSIE 7.0') > 0)
		var ver = "ie7";
	$.fn.paginate.defaults = {
		count 		: 5,
		start 		: 12,
		display  	: 5,
		border					: true,
		border_color			: '#fff',
		text_color  			: '#8cc59d',
		background_color    	: 'black',	
		border_hover_color		: '#fff',
		text_hover_color  		: '#fff',
		background_hover_color	: '#fff', 
		rotate      			: true,
		images					: true,
		mouse					: 'slide',
		onChange				: function(){return false;}
	};
	$.fn.draw = function(o,obj,selectedpage){
		if(o.display > o.count)
			o.display = o.count;
		$this.empty();
		if(o.images){
			var spreviousclass 	= 'jPag-sprevious-img';
			var previousclass 	= 'jPag-previous-img';
			var snextclass 		= 'jPag-snext-img';
			var nextclass 		= 'jPag-next-img';
		}
		else{
			var spreviousclass 	= 'jPag-sprevious';
			var previousclass 	= 'jPag-previous';
			var snextclass 		= 'jPag-snext';
			var nextclass 		= 'jPag-next';
		}
		var _first		= $(document.createElement('a')).addClass('jPag-first').html('First');
		
		if(o.rotate){
			if(o.images) var _rotleft	= $(document.createElement('span')).addClass(spreviousclass);
			else var _rotleft	= $(document.createElement('span')).addClass(spreviousclass).html('&laquo;');		
		}
		
		var _divwrapleft	= $(document.createElement('div')).addClass('jPag-control-back');
		_divwrapleft.append(_first).append(_rotleft);
		
		var _ulwrapdiv	= $(document.createElement('div')).css('overflow','hidden');
		var _ul			= $(document.createElement('ul')).addClass('jPag-pages')
		var c = (o.display - 1) / 2;
		var first = selectedpage - c;
		var selobj;
		for(var i = 0; i < o.count; i++){
			var val = i+1;
			if(val == selectedpage){
				var _obj = $(document.createElement('li')).html('<span class="jPag-current">'+val+'</span>');
				selobj = _obj;
				_ul.append(_obj);
			}	
			else{
				var _obj = $(document.createElement('li')).html('<a>'+ val +'</a>');
				_ul.append(_obj);
				}				
		}		
		_ulwrapdiv.append(_ul);
		
		if(o.rotate){
			if(o.images) var _rotright	= $(document.createElement('span')).addClass(snextclass);
			else var _rotright	= $(document.createElement('span')).addClass(snextclass).html('&raquo;');
		}
		
		var _last		= $(document.createElement('a')).addClass('jPag-last').html('Last');
		var _divwrapright	= $(document.createElement('div')).addClass('jPag-control-front');
		_divwrapright.append(_rotright).append(_last);
		
		//append all:
		$this.addClass('jPaginate').append(_divwrapleft).append(_ulwrapdiv).append(_divwrapright);
			
		if(!o.border){
			if(o.background_color == 'none') var a_css 				= {'color':o.text_color};
			else var a_css 											= {'color':o.text_color,'background-color':o.background_color};
			if(o.background_hover_color == 'none')	var hover_css 	= {'color':o.text_hover_color};
			else var hover_css 										= {'color':o.text_hover_color,'background-color':o.background_hover_color};	
		}	
		else{
			if(o.background_color == 'none') var a_css 				= {'color':o.text_color,'border':'1px solid '+o.border_color};
			else var a_css 											= {'color':o.text_color,'background-color':o.background_color,'border':'1px solid '+o.border_color};
			if(o.background_hover_color == 'none')	var hover_css 	= {'color':o.text_hover_color,'border':'1px solid '+o.border_hover_color};
			else var hover_css 										= {'color':o.text_hover_color,'background-color':o.background_hover_color,'border':'1px solid '+o.border_hover_color};
		}
		
		$.fn.applystyle(o,$this,a_css,hover_css,_first,_ul,_ulwrapdiv,_divwrapright);
		//calculate width of the ones displayed:
		var outsidewidth = outsidewidth_tmp - _first.parent().width() -3;
		if(ver == 'ie7'){
			_ulwrapdiv.css('width',outsidewidth+72+'px');
			_divwrapright.css('left',outsidewidth_tmp+6+72+'px');
		}
		else{
			_ulwrapdiv.css('width',outsidewidth+'px');
			_divwrapright.css('left',outsidewidth_tmp+6+'px');
		}
		
		if(o.rotate){
			_rotright.hover(
				function() {
				  thumbs_scroll_interval = setInterval(
					function() {
					  var left = _ulwrapdiv.scrollLeft() + 1;
					  _ulwrapdiv.scrollLeft(left);
					},
					20
				  );
				},
				function() {
				  clearInterval(thumbs_scroll_interval);
				}
			);
			_rotleft.hover(
				function() {
				  thumbs_scroll_interval = setInterval(
					function() {
					  var left = _ulwrapdiv.scrollLeft() - 1;
					  _ulwrapdiv.scrollLeft(left);
					},
					20
				  );
				},
				function() {
				  clearInterval(thumbs_scroll_interval);
				}
			);
			if(o.mouse == 'press'){
				_rotright.mousedown(
					function() {
					  thumbs_mouse_interval = setInterval(
						function() {
						  var left = _ulwrapdiv.scrollLeft() + 5;
						  _ulwrapdiv.scrollLeft(left);
						},
						20
					  );
					}
				).mouseup(
					function() {
					  clearInterval(thumbs_mouse_interval);
					}
				);
				_rotleft.mousedown(
					function() {
					  thumbs_mouse_interval = setInterval(
						function() {
						  var left = _ulwrapdiv.scrollLeft() - 5;
						  _ulwrapdiv.scrollLeft(left);
						},
						20
					  );
					}
				).mouseup(
					function() {
					  clearInterval(thumbs_mouse_interval);
					}
				);
			}
			else{
				_rotleft.click(function(e){
					var width = outsidewidth - 10;
					var left = _ulwrapdiv.scrollLeft() - width;
					_ulwrapdiv.animate({scrollLeft: left +'px'});
				});	
				
				_rotright.click(function(e){
					var width = outsidewidth - 10;
					var left = _ulwrapdiv.scrollLeft() + width;
					_ulwrapdiv.animate({scrollLeft: left +'px'});
				});
			}
		}
		
		//first and last:
		_first.click(function(e){
				_ulwrapdiv.animate({scrollLeft: '0px'});
				_ulwrapdiv.find('li').eq(0).click();
		});
		_last.click(function(e){
				_ulwrapdiv.animate({scrollLeft: insidewidth +'px'});
				_ulwrapdiv.find('li').eq(o.count - 1).click();
		});
		
		//click a page
		_ulwrapdiv.find('li').click(function(e){
			selobj.html('<a>'+selobj.find('.jPag-current').html()+'</a>'); 
			var currval = $(this).find('a').html();
			$(this).html('<span class="jPag-current">'+currval+'</span>');
			selobj = $(this);
			$.fn.applystyle(o,$(this).parent().parent().parent(),a_css,hover_css,_first,_ul,_ulwrapdiv,_divwrapright);	
			var left = (this.offsetLeft) / 2;
			var left2 = _ulwrapdiv.scrollLeft() + left;
			var tmp = left - (outsidewidth / 2);
			if(ver == 'ie7')
				_ulwrapdiv.animate({scrollLeft: left + tmp - _first.parent().width() + 52 + 'px'});	
			else
				_ulwrapdiv.animate({scrollLeft: left + tmp - _first.parent().width() + 'px'});	
			o.onChange(currval);	
		});
		
		var last = _ulwrapdiv.find('li').eq(o.start-1);
		last.attr('id','tmp');
		var left = document.getElementById('tmp').offsetLeft / 2;
		last.removeAttr('id');
		var tmp = left - (outsidewidth / 2);
		if(ver == 'ie7') _ulwrapdiv.animate({scrollLeft: left + tmp - _first.parent().width() + 52 + 'px'});	
		else _ulwrapdiv.animate({scrollLeft: left + tmp - _first.parent().width() + 'px'});	
	}
	
	$.fn.applystyle = function(o,obj,a_css,hover_css,_first,_ul,_ulwrapdiv,_divwrapright){
					obj.find('a').css(a_css);
					obj.find('span.jPag-current').css(hover_css);
					obj.find('a').hover(
					function(){
						$(this).css(hover_css);
					},
					function(){
						$(this).css(a_css);
					}
					);
					obj.css('padding-left',_first.parent().width() + 5 +'px');
					insidewidth = 0;
					
					obj.find('li').each(function(i,n){
						if(i == (o.display-1)){
							outsidewidth_tmp = this.offsetLeft + this.offsetWidth ;
						}
						insidewidth += this.offsetWidth;
					})
					_ul.css('width',insidewidth+'px');
	}
})(Zepto);


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
				artykulyDiv.innerHTML = '<ul>'+list.innerHTML+'</ul>';
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
			warsztatyDiv.innerHTML = '<div class="warsztaty_pagination"></div>';
		}
		function warsztatyLoadError(){
			if(gotConnection()) {
				warsztatyDiv.innerHTML = '<div class="panel text-center">Nie udało się wgrać listy warsztatów.</div>';
			} else {
				warsztatyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać listę warsztatów. <a onclick="location.reload();"><i class="fa fa-refresh"></i> odśwież</a></div>';
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
					artykulyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać najnowsze aktualności. <a onclick="location.reload();"><i class="fa fa-refresh"></i> odśwież</a></div>';
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
		
		$("#demo1").paginate({
				count 		: 100,
				start 		: 1,
				display     : 8,
				border					: true,
				border_color			: '#fff',
				text_color  			: '#fff',
				background_color    	: 'black',	
				border_hover_color		: '#ccc',
				text_hover_color  		: '#000',
				background_hover_color	: '#fff', 
				images					: false,
				mouse					: 'press'
			});
		
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