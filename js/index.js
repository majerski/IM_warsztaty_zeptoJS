function FastClick(a){var b,c=this;this.trackingClick=!1;this.trackingClickStart=0;this.targetElement=null;this.lastTouchIdentifier=this.touchStartY=this.touchStartX=0;this.touchBoundary=10;this.layer=a;if(!a||!a.nodeType)throw new TypeError("Layer must be a document node");this.onClick=function(){return FastClick.prototype.onClick.apply(c,arguments)};this.onMouse=function(){return FastClick.prototype.onMouse.apply(c,arguments)};this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(c,
arguments)};this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(c,arguments)};this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(c,arguments)};FastClick.notNeeded(a)||(this.deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchend",
this.onTouchEnd,!1),a.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,e){var f=Node.prototype.removeEventListener;"click"===b?f.call(a,b,c.hijacked||c,e):f.call(a,b,c,e)},a.addEventListener=function(b,c,e){var f=Node.prototype.addEventListener;"click"===b?f.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),e):f.call(a,b,c,e)}),"function"===typeof a.onclick&&(b=a.onclick,a.addEventListener("click",
function(a){b(a)},!1),a.onclick=null))}FastClick.prototype.deviceIsAndroid=0<navigator.userAgent.indexOf("Android");FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent);FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent);FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);
FastClick.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case "button":case "select":case "textarea":if(a.disabled)return!0;break;case "input":if(this.deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case "label":case "video":return!0}return/\bneedsclick\b/.test(a.className)};
FastClick.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case "textarea":case "select":return!0;case "input":switch(a.type){case "button":case "checkbox":case "file":case "image":case "radio":case "submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}};
FastClick.prototype.sendClick=function(a,b){var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur();d=b.changedTouches[0];c=document.createEvent("MouseEvents");c.initMouseEvent("click",!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);c.forwardedTouchEvent=!0;a.dispatchEvent(c)};FastClick.prototype.focus=function(a){var b;this.deviceIsIOS&&a.setSelectionRange?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()};
FastClick.prototype.updateScrollParent=function(a){var b,c;b=a.fastClickScrollParent;if(!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c;a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)};FastClick.prototype.getTargetElementFromEventTarget=function(a){return a.nodeType===Node.TEXT_NODE?a.parentNode:a};
FastClick.prototype.onTouchStart=function(a){var b,c,d;if(1<a.targetTouches.length)return!0;b=this.getTargetElementFromEventTarget(a.target);c=a.targetTouches[0];if(this.deviceIsIOS){d=window.getSelection();if(d.rangeCount&&!d.isCollapsed)return!0;if(!this.deviceIsIOS4){if(c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier;this.updateScrollParent(b)}}this.trackingClick=!0;this.trackingClickStart=a.timeStamp;this.targetElement=b;this.touchStartX=
c.pageX;this.touchStartY=c.pageY;200>a.timeStamp-this.lastClickTime&&a.preventDefault();return!0};FastClick.prototype.touchHasMoved=function(a){a=a.changedTouches[0];var b=this.touchBoundary;return Math.abs(a.pageX-this.touchStartX)>b||Math.abs(a.pageY-this.touchStartY)>b?!0:!1};FastClick.prototype.findControl=function(a){return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};
FastClick.prototype.onTouchEnd=function(a){var b,c,d=this.targetElement;this.touchHasMoved(a)&&(this.trackingClick=!1,this.targetElement=null);if(!this.trackingClick)return!0;if(200>a.timeStamp-this.lastClickTime)return this.cancelNextClick=!0;this.lastClickTime=a.timeStamp;b=this.trackingClickStart;this.trackingClick=!1;this.trackingClickStart=0;this.deviceIsIOSWithBadTarget&&(c=a.changedTouches[0],d=document.elementFromPoint(c.pageX-window.pageXOffset,c.pageY-window.pageYOffset)||d,d.fastClickScrollParent=
this.targetElement.fastClickScrollParent);c=d.tagName.toLowerCase();if("label"===c){if(b=this.findControl(d)){this.focus(d);if(this.deviceIsAndroid)return!1;d=b}}else if(this.needsFocus(d)){if(100<a.timeStamp-b||this.deviceIsIOS&&window.top!==window&&"input"===c)return this.targetElement=null,!1;this.focus(d);this.deviceIsIOS4&&"select"===c||(this.targetElement=null,a.preventDefault());return!1}if(this.deviceIsIOS&&!this.deviceIsIOS4&&(b=d.fastClickScrollParent)&&b.fastClickLastScrollTop!==b.scrollTop)return!0;
this.needsClick(d)||(a.preventDefault(),this.sendClick(d,a));return!1};FastClick.prototype.onTouchCancel=function(){this.trackingClick=!1;this.targetElement=null};FastClick.prototype.onMouse=function(a){return this.targetElement&&!a.forwardedTouchEvent&&a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0};
FastClick.prototype.onClick=function(a){if(this.trackingClick)return this.targetElement=null,this.trackingClick=!1,!0;if("submit"===a.target.type&&0===a.detail)return!0;a=this.onMouse(a);a||(this.targetElement=null);return a};
FastClick.prototype.destroy=function(){var a=this.layer;this.deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0));a.removeEventListener("click",this.onClick,!0);a.removeEventListener("touchstart",this.onTouchStart,!1);a.removeEventListener("touchend",this.onTouchEnd,!1);a.removeEventListener("touchcancel",this.onTouchCancel,!1)};
FastClick.notNeeded=function(a){var b;if("undefined"===typeof window.ontouchstart)return!0;if(/Chrome\/[0-9]+/.test(navigator.userAgent))if(FastClick.prototype.deviceIsAndroid){if((b=document.querySelector("meta[name=viewport]"))&&-1!==b.content.indexOf("user-scalable=no"))return!0}else return!0;return"none"===a.style.msTouchAction?!0:!1};FastClick.attach=function(a){return new FastClick(a)};
"undefined"!==typeof define&&define.amd?define(function(){return FastClick}):"undefined"!==typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick;

var Zepto=function(){function L(t){return null==t?String(t):j[T.call(t)]||"object"}function Z(t){return"function"==L(t)}function $(t){return null!=t&&t==t.window}function _(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function D(t){return"object"==L(t)}function R(t){return D(t)&&!$(t)&&Object.getPrototypeOf(t)==Object.prototype}function M(t){return"number"==typeof t.length}function k(t){return s.call(t,function(t){return null!=t})}function z(t){return t.length>0?n.fn.concat.apply([],t):t}function F(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function q(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function H(t,e){return"number"!=typeof e||c[F(t)]?e:e+"px"}function I(t){var e,n;return u[t]||(e=a.createElement(t),a.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function V(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function U(n,i,r){for(e in i)r&&(R(i[e])||A(i[e]))?(R(i[e])&&!R(n[e])&&(n[e]={}),A(i[e])&&!A(n[e])&&(n[e]=[]),U(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function B(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return Z(e)?e.call(t,n,i):e}function X(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function W(e,n){var i=e.className,r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?n.parseJSON(t):t:e):t}catch(i){return t}}function G(t,e){e(t);for(var n in t.childNodes)G(t.childNodes[n],e)}var t,e,n,i,C,N,r=[],o=r.slice,s=r.filter,a=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=a.createElement("table"),x=a.createElement("tr"),b={tr:a.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:x,th:x,"*":a.createElement("div")},w=/complete|loaded|interactive/,E=/^[\w-]*$/,j={},T=j.toString,S={},O=a.createElement("div"),P={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},A=Array.isArray||function(t){return t instanceof Array};return S.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~S.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},N=function(t){return s.call(t,function(e,n){return t.indexOf(e)==n})},S.fragment=function(e,i,r){var s,u,f;return h.test(e)&&(s=n(a.createElement(RegExp.$1))),s||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in b||(i="*"),f=b[i],f.innerHTML=""+e,s=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),R(r)&&(u=n(s),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),s},S.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},S.isZ=function(t){return t instanceof S.Z},S.init=function(e,i){var r;if(!e)return S.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=S.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=S.qsa(a,e)}else{if(Z(e))return n(a).ready(e);if(S.isZ(e))return e;if(A(e))r=k(e);else if(D(e))r=[e],e=null;else if(l.test(e))r=S.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=S.qsa(a,e)}}return S.Z(r,e)},n=function(t,e){return S.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){U(t,n,e)}),t},S.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],s=i||r?e.slice(1):e,a=E.test(s);return _(t)&&a&&i?(n=t.getElementById(s))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(a&&!i?r?t.getElementsByClassName(s):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=function(t,e){return t!==e&&t.contains(e)},n.type=L,n.isFunction=Z,n.isWindow=$,n.isArray=A,n.isPlainObject=R,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=C,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if(M(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return z(i)},n.each=function(t,e){var n,i;if(M(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return s.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){j["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return w.test(a.readyState)&&a.body?t(n):a.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return Z(t)?this.not(this.not(t)):n(s.call(this,function(e){return S.matches(e,t)}))},add:function(t,e){return n(N(this.concat(n(t,e))))},is:function(t){return this.length>0&&S.matches(this[0],t)},not:function(e){var i=[];if(Z(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):M(e)&&Z(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return D(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!D(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!D(t)?t:n(t)},find:function(t){var e,i=this;return e="object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(S.qsa(this[0],t)):this.map(function(){return S.qsa(this,t)})},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:S.matches(i,t));)i=i!==e&&!_(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!_(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return B(e,t)},parent:function(t){return B(N(this.pluck("parentNode")),t)},children:function(t){return B(this.map(function(){return V(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return B(this.map(function(t,e){return s.call(V(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=I(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=Z(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=Z(t);return this.each(function(i){var r=n(this),o=r.contents(),s=e?t.call(this,i):t;o.length?o.wrapAll(s):r.append(s)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0===arguments.length?this.length>0?this[0].innerHTML:null:this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))})},text:function(e){return 0===arguments.length?this.length>0?this[0].textContent:null:this.each(function(){this.textContent=e===t?"":""+e})},attr:function(n,i){var r;return"string"==typeof n&&i===t?0==this.length||1!==this[0].nodeType?t:"value"==n&&"INPUT"==this[0].nodeName?this.val():!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:this.each(function(t){if(1===this.nodeType)if(D(n))for(e in n)X(this,e,n[e]);else X(this,n,J(this,i,t,this.getAttribute(n)))})},removeAttr:function(t){return this.each(function(){1===this.nodeType&&X(this,t)})},prop:function(e,n){return e=P[e]||e,n===t?this[0]&&this[0][e]:this.each(function(t){this[e]=J(this,n,t,this[e])})},data:function(e,n){var i=this.attr("data-"+e.replace(m,"-$1").toLowerCase(),n);return null!==i?Y(i):t},val:function(t){return 0===arguments.length?this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value):this.each(function(e){this.value=J(this,t,e,this.value)})},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),o=i.offsetParent().offset(),s={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(s.position="relative"),i.css(s)});if(0==this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r=this[0],o=getComputedStyle(r,"");if(!r)return;if("string"==typeof t)return r.style[C(t)]||o.getPropertyValue(t);if(A(t)){var s={};return n.each(A(t)?t:[t],function(t,e){s[e]=r.style[C(e)]||o.getPropertyValue(e)}),s}}var a="";if("string"==L(t))i||0===i?a=F(t)+":"+H(t,i):this.each(function(){this.style.removeProperty(F(t))});else for(e in t)t[e]||0===t[e]?a+=F(e)+":"+H(e,t[e])+";":this.each(function(){this.style.removeProperty(F(e))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(W(t))},q(t)):!1},addClass:function(t){return t?this.each(function(e){i=[];var r=W(this),o=J(this,t,e,r);o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&W(this,r+(r?" ":"")+i.join(" "))}):this},removeClass:function(e){return this.each(function(n){return e===t?W(this,""):(i=W(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(q(t)," ")}),void W(this,i.trim()))})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),s=J(this,e,r,W(this));s.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||a.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,s=this[0];return r===t?$(s)?s["inner"+i]:_(s)?s.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){s=n(this),s.css(e,J(this,r,t,s[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=L(e),"object"==t||"array"==t||null==e?e:S.fragment(e)}),s=this.length>1;return r.length<1?this:this.each(function(t,a){o=i?a:a.parentNode,a=0==e?a.nextSibling:1==e?a.firstChild:2==e?a:null,r.forEach(function(t){if(s)t=t.cloneNode(!0);else if(!o)return n(t).remove();G(o.insertBefore(t,a),function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),S.Z.prototype=n.fn,S.uniq=N,S.deserializeValue=Y,n.zepto=S,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(s[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,a,u,f){var h=l(e),d=s[h]||(s[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var s=p(i);s.fn=r,s.sel=a,s.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?s.fn.apply(this,arguments):void 0}),s.del=u;var l=u||r;s.proxy=function(t){if(t=j(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},s.i=d.length,d.push(s),"addEventListener"in e&&e.addEventListener(g(s.e),s.proxy,m(s,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete s[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function j(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(E,function(t,n){var r=i[t];e[t]=function(){return this[n]=x,r&&r.apply(i,arguments)},e[n]=b}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=x)),e}function T(t){var e,i={originalEvent:t};for(e in t)w.test(e)||t[e]===n||(i[e]=t[e]);return j(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},s={},a={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};a.click=a.mousedown=a.mouseup=a.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){if(r(e)){var i=function(){return e.apply(n,arguments)};return i._zid=l(e),i}if(o(n))return t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var x=function(){return!0},b=function(){return!1},w=/^([A-Z]|returnValue$|layer[XY]$)/,E={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,s,a,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,s,a,e,f)}),h):(o(s)||r(u)||u===!1||(u=a,a=s,s=n),(r(a)||a===!1)&&(u=a,a=n),u===!1&&(u=b),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),s&&(l=function(e){var n,o=t(e.target).closest(s,r).get(0);return o&&o!==r?(n=t.extend(T(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,a,s,l||c)}))},t.fn.off=function(e,i,s){var a=this;return e&&!o(e)?(t.each(e,function(t,e){a.off(t,i,e)}),a):(o(i)||r(s)||s===!1||(s=i,i=n),s===!1&&(s=b),a.each(function(){y(this,e,s,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):j(e),e._args=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(s,a){i=T(o(e)?t.Event(e):e),i._args=n,i.target=a,t.each(h(a,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(a[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(Zepto),function(t){function l(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function h(t,e,i,r){return t.global?l(e||n,i,r):void 0}function p(e){e.global&&0===t.active++&&h(e,null,"ajaxStart")}function d(e){e.global&&!--t.active&&h(e,null,"ajaxStop")}function m(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||h(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void h(e,n,"ajaxSend",[t,e])}function g(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),h(n,r,"ajaxSuccess",[e,n,t]),y(o,e,n)}function v(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),h(i,o,"ajaxError",[n,i,t||e]),y(e,n,i)}function y(t,e,n){var i=n.context;n.complete.call(i,e,t),h(n,i,"ajaxComplete",[e,n]),d(n)}function x(){}function b(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":s.test(t)?"script":a.test(t)&&"xml")||"text"}function w(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function E(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=w(e.url,e.data),e.data=void 0)}function j(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function S(e,n,i,r){var o,s=t.isArray(n),a=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(a||"object"==o||"array"==o?n:"")+"]"),!r&&s?e.add(u.name,u.value):"array"==o||!i&&"object"==o?S(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,s=/^(?:text|application)\/javascript/i,a=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/;t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,s=(t.isFunction(o)?o():o)||"jsonp"+ ++e,a=n.createElement("script"),u=window[s],c=function(e){t(a).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(a).on("load error",function(e,n){clearTimeout(h),t(a).off().remove(),"error"!=e.type&&f?g(f[0],l,i,r):v(null,n||"error",l,i,r),window[s]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),m(l,i)===!1?(c("abort"),l):(window[s]=function(){f=arguments},a.src=i.url.replace(/\?(.+)=\?/,"?$1="+s),n.head.appendChild(a),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:x,success:x,error:x,complete:x,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.extend({},e||{}),o=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===n[i]&&(n[i]=t.ajaxSettings[i]);p(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!=window.location.host),n.url||(n.url=window.location.toString()),E(n),n.cache===!1&&(n.url=w(n.url,"_="+Date.now()));var s=n.dataType,a=/\?.+=\?/.test(n.url);if("jsonp"==s||a)return a||(n.url=w(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,o);var j,u=n.accepts[s],f={},l=function(t,e){f[t.toLowerCase()]=[t,e]},h=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,d=n.xhr(),y=d.setRequestHeader;if(o&&o.promise(d),n.crossDomain||l("X-Requested-With","XMLHttpRequest"),l("Accept",u||"*/*"),(u=n.mimeType||u)&&(u.indexOf(",")>-1&&(u=u.split(",",2)[0]),d.overrideMimeType&&d.overrideMimeType(u)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!=n.type.toUpperCase())&&l("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(r in n.headers)l(r,n.headers[r]);if(d.setRequestHeader=l,d.onreadystatechange=function(){if(4==d.readyState){d.onreadystatechange=x,clearTimeout(j);var e,i=!1;if(d.status>=200&&d.status<300||304==d.status||0==d.status&&"file:"==h){s=s||b(n.mimeType||d.getResponseHeader("content-type")),e=d.responseText;try{"script"==s?(1,eval)(e):"xml"==s?e=d.responseXML:"json"==s&&(e=c.test(e)?null:t.parseJSON(e))}catch(r){i=r}i?v(i,"parsererror",d,n,o):g(e,d,n,o)}else v(d.statusText||null,d.status?"error":"abort",d,n,o)}},m(d,n)===!1)return d.abort(),v(null,"abort",d,n,o),d;if(n.xhrFields)for(r in n.xhrFields)d[r]=n.xhrFields[r];var T="async"in n?n.async:!0;d.open(n.type,n.url,T,n.username,n.password);for(r in f)y.apply(d,f[r]);return n.timeout>0&&(j=setTimeout(function(){d.onreadystatechange=x,d.abort(),v(null,"timeout",d,n,o)},n.timeout)),d.send(n.data?n.data:null),d},t.get=function(){return t.ajax(j.apply(null,arguments))},t.post=function(){var e=j.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=j.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var a,r=this,s=e.split(/\s/),u=j(e,n,i),f=u.success;return s.length>1&&(u.url=s[0],a=s[1]),u.success=function(e){r.html(a?t("<div>").html(e.replace(o,"")).find(a):e),f&&f.apply(r,arguments)},t.ajax(u),this};var T=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(T(t)+"="+T(e))},S(n,t,e),n.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var n,e=[];return t([].slice.call(this.get(0).elements)).each(function(){n=t(this);var i=n.attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=i&&"reset"!=i&&"button"!=i&&("radio"!=i&&"checkbox"!=i||this.checked)&&e.push({name:n.attr("name"),value:n.val()})}),e},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(e)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto);

;(function(e,t){function w(e){return e.replace(/([a-z])([A-Z])/,"$1-$2").toLowerCase()}function E(e){return r?r+e:e.toLowerCase()}var n="",r,i,s,o={Webkit:"webkit",Moz:"",O:"o"},u=window.document,a=u.createElement("div"),f=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,l,c,h,p,d,v,m,g,y,b={};e.each(o,function(e,i){if(a.style[e+"TransitionProperty"]!==t){n="-"+e.toLowerCase()+"-";r=i;return false}});l=n+"transform";b[c=n+"transition-property"]=b[h=n+"transition-duration"]=b[d=n+"transition-delay"]=b[p=n+"transition-timing-function"]=b[v=n+"animation-name"]=b[m=n+"animation-duration"]=b[y=n+"animation-delay"]=b[g=n+"animation-timing-function"]="";e.fx={off:r===t&&a.style.transitionProperty===t,speeds:{_default:400,fast:200,slow:600},cssPrefix:n,transitionEnd:E("TransitionEnd"),animationEnd:E("AnimationEnd")};e.fn.animate=function(n,r,i,s,o){if(e.isFunction(r))s=r,i=t,r=t;if(e.isFunction(i))s=i,i=t;if(e.isPlainObject(r))i=r.easing,s=r.complete,o=r.delay,r=r.duration;if(r)r=(typeof r=="number"?r:e.fx.speeds[r]||e.fx.speeds._default)/1e3;if(o)o=parseFloat(o)/1e3;return this.anim(n,r,i,s,o)};e.fn.anim=function(n,r,i,s,o){var u,a={},E,S="",x=this,T,N=e.fx.transitionEnd,C=false;if(r===t)r=e.fx.speeds._default/1e3;if(o===t)o=0;if(e.fx.off)r=0;if(typeof n=="string"){a[v]=n;a[m]=r+"s";a[y]=o+"s";a[g]=i||"linear";N=e.fx.animationEnd}else{E=[];for(u in n)if(f.test(u))S+=u+"("+n[u]+") ";else a[u]=n[u],E.push(w(u));if(S)a[l]=S,E.push(l);if(r>0&&typeof n==="object"){a[c]=E.join(", ");a[h]=r+"s";a[d]=o+"s";a[p]=i||"linear"}}T=function(t){if(typeof t!=="undefined"){if(t.target!==t.currentTarget)return;e(t.target).unbind(N,T)}else e(this).unbind(N,T);C=true;e(this).css(b);s&&s.call(this)};if(r>0){this.bind(N,T);setTimeout(function(){if(C)return;T.call(x)},r*1e3+25)}this.size()&&this.get(0).clientLeft;this.css(a);if(r<=0)setTimeout(function(){x.each(function(){T.call(this)})},0);return this};a=null})(Zepto);(function(e,t){function u(n,r,i,s,o){if(typeof r=="function"&&!o)o=r,r=t;var u={opacity:i};if(s){u.scale=s;n.css(e.fx.cssPrefix+"transform-origin","0 0")}return n.animate(u,r,null,o)}function a(t,n,r,i){return u(t,n,0,r,function(){s.call(e(this));i&&i.call(this)})}var n=window.document,r=n.documentElement,i=e.fn.show,s=e.fn.hide,o=e.fn.toggle;e.fn.show=function(e,n){i.call(this);if(e===t)e=0;else this.css("opacity",0);return u(this,e,1,"1,1",n)};e.fn.hide=function(e,n){if(e===t)return s.call(this);else return a(this,e,"0,0",n)};e.fn.toggle=function(n,r){if(n===t||typeof n=="boolean")return o.call(this,n);else return this.each(function(){var t=e(this);t[t.css("display")=="none"?"show":"hide"](n,r)})};e.fn.fadeTo=function(e,t,n){return u(this,e,t,null,n)};e.fn.fadeIn=function(e,t){var n=this.css("opacity");if(n>0)this.css("opacity",0);else n=1;return i.call(this).fadeTo(e,n,t)};e.fn.fadeOut=function(e,t){return a(this,e,null,t)};e.fn.fadeToggle=function(t,n){return this.each(function(){var r=e(this);r[r.css("opacity")==0||r.css("display")=="none"?"fadeIn":"fadeOut"](t,n)})}})(Zepto);

$(document).ready(function(){$(document.body).transition("init").show()}),function(a){function l(a){var b=a.indexOf("?");return b>0&&(a=a.slice(0,b)),a.replace(/[:\.\+\/]/g,"_")}function m(a){if(window.location.hash){var b=n(window.location.pathname,window.location.hash.slice(1));b.length&&(a=a.replace(/(\b(src|href|action))="([^"#:]+)"/gi,'$1="'+b+'$3"'),a=a.replace(/(\b(src|href|action))="(.+\/)?[^\/]+\/\.\.\//gi,'$1="$3'))}return a}function n(a,b){var c="",d=b.lastIndexOf("/");if(-1!=d&&(c=b.slice(0,d+1),"/"==c.charAt(0))){"/"==!a.charAt(0)&&(a="/"+a);var e=1;d=e;do d=c.indexOf("/",d)+1,d>e&&c.slice(0,d)==a.slice(0,d)&&(e=d);while(d>0&&d==e);var f="";d=e;do d=a.indexOf("/",d+1),-1!=d&&(f+="../");while(-1!=d);c=f+c.slice(e)}return c}var b=0,c=!1,d=null,e={},f=window.location.href,g={},h=null,i=[],j=0,k={options:function(b){d=a.extend({defaultPageTransition:"fade",domCache:!1},b)},init:function(k,m,n){c||(c=!0,a(document.body).transition("options",{}),a(window).on("hashchange",function(){var c=h&&h.element||a(document.body);if(!g[window.location.hash]){var e=window.location.hash,f=a("div.ui-page-active").attr("id");f&&(f="#"+f),h&&h.element&&h.element.is("form")&&(e={type:h.element.attr("method")||"get",url:window.location.hash.slice(1),data:h.element.serialize(),dataType:"html",global:!1});var k=null,l=null==h,m=0;if(l)i.length>j&&i[j].to==e?(h=i[j++],l=!1):j>0&&(h=i[--j],l=h?!h.reverse:!0),k=h?h.transition:d.defaultPageTransition,h&&(m=h.top||0,!e&&a(h.from).length&&(e=h.from));else if(h.transition)k=h.transition,i[j++]={to:e,from:f,transition:k,top:a(window).scrollTop()},l=h.reverse;else{k=h.element.attr("transition")||h.element.data("transition")||d.defaultPageTransition;var n=h.element.attr("direction")||h.element.data("direction");"reverse"===n&&(l=!0),i[j++]={to:e,from:f,transition:k,reverse:l,top:a(window).scrollTop()}}c.transition("changePage",e,k,l,m)}h=null}));var o=a('div[data-role="page"]',this);o.length||(this.is("div")?(this.attr("data-role","page"),this.attr("id","_trans_div"+b),o=this):(o=a('<div data-role="page" id="_trans_div'+b+'" />'),this.children().wrapAll(o))),k&&o.trigger("pageload",k);var p=o.first();if(window.location.hash&&(p=a(l(window.location.hash)),!p.length)){p=o.first();var q=p.attr("id"),r=l(e[window.location.hash]||window.location.hash.slice(1));p.attr("id",r),q&&(a('[data-href="#'+q+'"]',o).attr("data-href","#"+r),a('[href="#'+q+'"]',o).attr("href","#"+r))}o.addClass("ui-page"),o.each(function(){a(this).attr("id")||a(this).attr("id","_trans_div"+b),e["#"+a(this).attr("id")]=f,a(this).css("zIndex",b++)}),a("a[href]",o).not("[target]").not('[rel="external"]').not('[data-ajax="false"]').not("[data-href]").transition("hijackLinks"),a("[data-href]",o).transition("hijackLinks"),a("form").not("[target]").not('[data-ajax="false"]').transition("hijackLinks"),n||(n=document.title),o.not("[data-title]").data("title",n),n=p.data("title"),n&&(document.title=n),o.hide();var s=m?a(m):null;return s=s||p,s.addClass("ui-page-active"),o.each(function(){a(this).trigger("pageinit",a(this))}),s},to:function(a,b,c){b=b||d.defaultPageTransition,c||(c=!1),h={transition:b,reverse:c},window.location.hash="#"+a},hijackLinks:function(){return this.each(function(){var b=a(this);if("back"==b.data("rel")){var c=function(a){window.history.back(),a.preventDefault()};return b.on("click",c),b.on("tap",c),void 0}var d=b.attr("data-href")||b.attr("href")||b.attr("action")||"#";if("#"===d.charAt(0)){if(a('a[name="'+d.slice(1)+'"]').length)return g[d]=!0,void 0}else d="#"+d,b.is("a")?b.attr("href",d):b.attr("action")&&b.attr("action",d),b.attr("data-href")&&b.attr("data-href",d);var c;b.is("a")?c=function(){h={element:b}}:b.is("form")?(c=function(a){h={element:b},window.location.href=d,a.preventDefault()},b.on("submit",c)):c=function(){h={element:b},window.location.href=d},b.is("form")||(b.on("click",c),b.on("tap",c))})},changePage:function(b,c,f,g){var h={toPage:b,back:f},i=a.Event("pagebeforechange");if(a(this).trigger(i,h),!i.defaultPrevented){b=h.toPage,f=h.back;var j="string"==typeof b?b:b.url,k=null,m=a("div.ui-page-active"),n=!1;if("string"==typeof b&&"#"===b.charAt(0)){var o=a(l(b));o.length?(a(this).transition("perform",m,o,c,f,g,h),n=!0):!d.domCache&&e[b]?(k=b,b=e[b]):b=b.slice(1)}if(!n){var p={href:j,element:a(this),back:f},i=a.Event("pagebeforeload");a(this).trigger(i,p);var q=a(this);i.defaultPrevented||(a(this).transition("load",b,p,function(b,d,e){var i=a('<div data-role="page-container" />');i.html(b),a(document.body).append(i);var j=a(i).transition("init",p,k,e);a(q).transition("perform",m,j,c,f,g,h)}),n=!0)}n||a(this).trigger("pagechangefailed",h)}},load:function(b,c,e){b="string"==typeof b?{url:b,dataType:"html",global:!1}:b,b.url||(b.url=window.location.href),b.success=function(g,h,i){c.xhr=i,c.textStatus=h,f=b.url,d.domCache||a('div[data-role="page"]').not('[data-dom-cache="true"]').addClass("transition-recyclable");var n,j=g.search(/<body/i),k=g,l=g;-1!=j&&(k=g.slice(0,j),j=g.indexOf(">",j),bodyEnd=g.search(/<\/body>/i),l=g.slice(j+1,bodyEnd));var o=k.match(/<title>(.+)<\/title>/im);o&&(n=o[1]),l=m(l),e(l,g,n)},b.error=function(d,e,f){c.xhr=d,c.textStatus=e,c.errorThrown=f,a(this).trigger("pageloadfailed",c),a(this).trigger("pagechangefailed",{toPage:b.url})},a.ajax(b)},perform:function(b,c,e,f,g,h){h.from=b,h.to=c,b.trigger("pagebeforehide",b),c.trigger("pagebeforeshow",c),window.setTimeout(function(){b.addClass(e+" out"),b.removeClass("ui-page-active");var a=c.position();c.css({top:a.top-g}),c.show(),c.addClass(e+" in"),c.addClass("ui-page-active"),f&&(b.addClass("reverse"),c.addClass("reverse"))},1),window.setTimeout(function(){b.removeClass(e+" out"),c.removeClass(e+" in"),b.removeClass("reverse"),c.removeClass("reverse"),c.css({top:0}),window.scrollTo(0,g);var f=c.data("title");f&&(document.title=f),b.trigger("pagehide",b),c.trigger("pageshow",c),a(document).trigger("pagechange",h),a('div[data-role="page"]').hide(),c.show(),d.domCache||(a("div.transition-recyclable").each(function(){var b=a.Event("pageremove");a(this).trigger(b,a(this)),b.defaultPrevented||a(this).remove()}),a('div[data-role="page-container"]').not(function(){return a(this).children().length}).remove())},107)}};a.fn.transition=function(a){if(k[a])return k[a].apply(this,Array.prototype.slice.call(arguments,1));if("object"!=typeof a&&a)throw"Method "+a+" does not exist";return k.to.apply(this,arguments)}}(Zepto);

;(function happyJS($){function trim(el){return(''.trim)?el.val().trim():$.trim(el.val())}$.fn.isHappy=function isHappy(config){var fields=[],item;var pauseMessages=false;function isFunction(obj){return!!(obj&&obj.constructor&&obj.call&&obj.apply)}function defaultError(error){var msgErrorClass=config.classes&&config.classes.message||'unhappyMessage';return $('<span id="'+error.id+'" class="'+msgErrorClass+'" role="alert">'+error.message+'</span>')}function getError(error){if(isFunction(config.errorTemplate)){return config.errorTemplate(error)}return defaultError(error)}function handleSubmit(){var i,l;var errors=false;for(i=0,l=fields.length;i<l;i+=1){if(!fields[i].testValid(true)){errors=true}}if(errors){if(isFunction(config.unHappy))config.unHappy();return false}else if(config.testMode){if(isFunction(config.happy))config.happy();if(window.console)console.warn('would have submitted');return false}if(isFunction(config.happy))config.happy()}function handleMouseUp(){pauseMessages=false}function handleMouseDown(){pauseMessages=true;$(window).bind('mouseup',handleMouseUp)}function processField(opts,selector){var field=$(selector);var error={message:opts.message||'',id:selector.slice(1)+'_unhappy'};var errorEl=$(error.id).length>0?$(error.id):getError(error);var handleBlur=function handleBlur(){if(!pauseMessages){field.testValid()}else{$(window).bind('mouseup',field.testValid.bind(this))}};fields.push(field);field.testValid=function testValid(submit){var val,gotFunc,temp;var el=$(this);var error=false;var required=!!el.get(0).attributes.getNamedItem('required')||opts.required;var password=(field.attr('type')==='password');var arg=isFunction(opts.arg)?opts.arg():opts.arg;var fieldErrorClass=config.classes&&config.classes.field||'unhappy';if(isFunction(opts.clean)){val=opts.clean(el.val())}else if(!password&&typeof opts.trim==='undefined'||opts.trim){val=trim(el)}else{val=el.val()}el.val(val);gotFunc=((val.length>0||required==='sometimes')&&isFunction(opts.test));if(submit===true&&required===true&&val.length===0){error=true}else if(gotFunc){error=!opts.test(val,arg)}if(error){el.addClass(fieldErrorClass).after(errorEl);return false}else{temp=errorEl.get(0);if(temp.parentNode){temp.parentNode.removeChild(temp)}el.removeClass(fieldErrorClass);return true}};field.bind(opts.when||config.when||'blur',handleBlur)}for(item in config.fields){processField(config.fields[item],item)}$(config.submitButton||this).bind('mousedown',handleMouseDown);if(config.submitButton){$(config.submitButton).click(handleSubmit)}else{this.bind('submit',handleSubmit)}return this}})(this.Zepto);

;(function(e){"use strict";e.jqPagination=function(t,n){var r=this;r.$el=e(t);r.el=t;r.$input=r.$el.find("input");r.$el.data("jqPagination",r);r.init=function(){r.options=e.extend({},e.jqPagination.defaultOptions,n);r.options.max_page===null&&(r.$input.data("max-page")!==undefined?r.options.max_page=r.$input.data("max-page"):r.options.max_page=1);r.$input.data("current-page")!==undefined&&r.isNumber(r.$input.data("current-page"))&&(r.options.current_page=r.$input.data("current-page"));r.$input.removeAttr("readonly");r.updateInput(!0);r.$input.on("focus.jqPagination mouseup.jqPagination",function(t){if(t.type==="focus"){var n=parseInt(r.options.current_page,10);e(this).val(n).select()}if(t.type==="mouseup")return!1});r.$input.on("blur.jqPagination keydown.jqPagination",function(t){var n=e(this),i=parseInt(r.options.current_page,10);if(t.keyCode===27){n.val(i);n.blur()}t.keyCode===13&&n.blur();t.type==="blur"&&r.setPage(n.val())});r.$el.on("click.jqPagination","a",function(t){var n=e(this);if(n.hasClass("disabled"))return!1;if(!t.metaKey&&!t.ctrlKey){t.preventDefault();r.setPage(n.data("action"))}})};r.setPage=function(e,t){if(e===undefined)return r.options.current_page;var n=parseInt(r.options.current_page,10),i=parseInt(r.options.max_page,10);if(isNaN(parseInt(e,10)))switch(e){case"first":e=1;break;case"prev":case"previous":e=n-1;break;case"next":e=n+1;break;case"last":e=i}e=parseInt(e,10);if(isNaN(e)||e<1||e>i){r.setInputValue(n);return!1}r.options.current_page=e;r.$input.data("current-page",e);r.updateInput(t)};r.setMaxPage=function(e,t){if(e===undefined)return r.options.max_page;if(!r.isNumber(e)){console.error("jqPagination: max_page is not a number");return!1}if(e<r.options.current_page){console.error("jqPagination: max_page lower than current_page");return!1}r.options.max_page=e;r.$input.data("max-page",e);r.updateInput(t)};r.updateInput=function(e){var t=parseInt(r.options.current_page,10);r.setInputValue(t);r.setLinks(t);e!==!0&&r.options.paged(t)};r.setInputValue=function(e){var t=r.options.page_string,n=r.options.max_page;t=t.replace("{current_page}",e).replace("{max_page}",n);r.$input.val(t)};r.isNumber=function(e){return!isNaN(parseFloat(e))&&isFinite(e)};r.setLinks=function(e){var t=r.options.link_string,n=parseInt(r.options.current_page,10),i=parseInt(r.options.max_page,10);if(t!==""){var s=n-1;s<1&&(s=1);var o=n+1;o>i&&(o=i);r.$el.find("a.first").attr("href",t.replace("{page_number}","1"));r.$el.find("a.prev, a.previous").attr("href",t.replace("{page_number}",s));r.$el.find("a.next").attr("href",t.replace("{page_number}",o));r.$el.find("a.last").attr("href",t.replace("{page_number}",i))}r.$el.find("a").removeClass("disabled");n===i&&r.$el.find(".next, .last").addClass("disabled");n===1&&r.$el.find(".previous, .first").addClass("disabled")};r.callMethod=function(t,n,i){switch(t.toLowerCase()){case"option":if(i===undefined&&typeof n!="object")return r.options[n];var s={trigger:!0},o=!1;e.isPlainObject(n)&&!i?e.extend(s,n):s[n]=i;var u=s.trigger===!1;s.current_page!==undefined&&(o=r.setPage(s.current_page,u));s.max_page!==undefined&&(o=r.setMaxPage(s.max_page,u));o===!1&&console.error("jqPagination: cannot get / set option "+n);return o;case"destroy":r.$el.off(".jqPagination").find("*").off(".jqPagination");break;default:console.error('jqPagination: method "'+t+'" does not exist');return!1}};r.init()};e.jqPagination.defaultOptions={current_page:1,link_string:"",max_page:null,page_string:"Strona {current_page} z {max_page}",paged:function(){}};e.fn.jqPagination=function(){var t=this,n=e(t),r=Array.prototype.slice.call(arguments),i=!1;if(typeof r[0]=="string"){r[2]===undefined?i=n.first().data("jqPagination").callMethod(r[0],r[1]):n.each(function(){i=e(this).data("jqPagination").callMethod(r[0],r[1],r[2])});return i}t.each(function(){new e.jqPagination(this,r[0])})}})(Zepto);if(!console){var console={},func=function(){return!1};console.log=func;console.info=func;console.warn=func;console.error=func};
$(document.body).transition('options', {defaultPageTransition : 'fade', domCache : false});

var	warsztaty = [],
	_warsztaty = [],
	use_warsztaty = [],
	_order = 1,
	_search = false,
	warsztaty_first_load = true,
	warsztaty_pagination_loaded = false,
	warsztatyDiv = document.getElementById("warsztaty"),
	artykulyDiv = document.getElementById("artykuly"),
	warsztaty_filtered = warsztaty,
	artykuly = [],
	articles_first_load = true,
	articles_pagination_loaded = false,
	new_version = false,
	warsztaty_file_exists = false,
	warsztaty_loaded = false,
	artykuly_loaded = false,
	fi_path = 'installed.dat',
	warsztaty_path = 'warsztaty.txt',
	warsztaty_from_file = false,
	artykulyUrl = 'http://www.q-service.com.pl/rss/',
	//artykulyUrl = 'http://arcontact.pl/warsztaty_inter_cars/rss.php',
	warsztatyUrl = 'http://arcontact.pl/warsztaty_inter_cars/feed.php',
	form_email = 'mifdetal@intercars.eu',
	map,
	startingLatitude = 52.069347,
	startingLongitude = 19.480204,
	map_first_load = false,
	markers = [],
	currentPosition = false,
	warsztatShowPointId = false,
	mapRenderWarsztaty = false,
	icons = {
		qservicepremium:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAlCAYAAAAjt+tHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABMpJREFUeNq0V11MHFUU/u7M/gy7UH5Dm6hpaykbrAawSlIVUywgxERtQ20wvtRorZE+WCImktRItUitCBIN0tRof3zQ2KTGBg3GpCpIQxT7AhZtCprYAq3FdlmW2d0Z753OwOzOzO6MwkkON8zcvd93z/nuuXOILMtgVlVV5aIDR92jji4srUWpS9RFNvb19bH/QRgBFZwBC6p7VALcEoFLKgEGHlZdZCRIZWWlBu6jvkIdhWWKAAMOUb+ujqK2S0EFz6esfsQyGo32Jn1UOF3ofcsNzkzF0KLs4XTCE6x+1NbaikBBAe4oDCx4YF0BDra3/1cems44l5prl1XOR0dGcPiDHrzY2IjikhLEYlHwPI+hoSF0dnfj8ZxcFPBuRECU+SQnG3xgPfjb19LlLTW8gKmBWs58vWU/iouL8cKehrjnD5SX48zAAHq72vH8VAizundEEMAXBeCtfwLeHXVWRDikOmZf9fbi7OAg9rW8Zvr+laYmHItKOJ8pwCMvPpfDYUSHz2G2qRnBXQ2Qg7OWGJYEYrEYWt9sQ3VNjRIBMysrK0PJfeU4wsl0k8R0jvh1H0Kv7ndOgBCC2ocqMDI6imAwaDpn5to1/DI8jKLt9SDVlSAWa82fPIXY2G/OCHA0b7u9Albd+BvdPYdN53R2dEAU57HzpUakdb0Nf3fXTfEZSlAUke/6nRGQLo7D/+EJPCcTHP/kOCYmJuLej50fw7GPj2JfczM8VHRIS4PnkRr4D74BekyM6/3xp+VxMLXw0ROYD81hk8hhc56A6rrtWJebsxDmy5cuo6S0FNu2bo1f8O4S8GvXIPb7hbjncihkn4A88w/EU6dBN49IJIY9tGBW1Ndh3O+DS9ZSRPBwba2Sqjhzu8GtzDcQIFlZ9glEBs9Cmp6+qWIKlH8liEez80B2PZ26xkUikGZmDI/51bfZ10C0f3CROVuT/glPTdu7dyenIF24mKho8Hfd6YDA6K/GUG3ZbIuA+MVppRDF7X7NavCF6+0TkK9eNdYFvy/17v+6hPCRjwzP2ekgvjQHx1CSjVEZ+jk5ONVMsGEvpIRUkcxMeJ/cgWS3ktGokhNt7tA7ICsy6G5q43bD6nzkm28x19GFWGLu2b27+xlwt97ijAAfKESMFpq4tFCg2b0vI/zu+1RQG0CysyFTwTG9WBUZkpUJ4an6pJEzJeDd9hgV05fml9T4hOJ2TL5+A/OfnYTw7E5nl5G74kF4aquX4FtYwlx7p2lqkouQnlv/WwcU9f5fY6lTrmNJSkrA8JapN53ebuk978FTtQVcXq7uA0q5r0G8XnCrVsJdWQH/gRakdx4yL45nvlfuFpNeQdFAVOfGM0xTwZzdD9LkJD1mV2i1ESnBFUrNZ0IjGRmL+vlhAJF+48e1+OnncN97D/gNRdBjunTtUjhZKBkQz5yekGTmb2+zk5mw1qJxOvCQrmlY7sYkpJGw05pxakPR7xDo/gR9mbZmdprThW94SuInm+AbE7Rl3ZymaM+1Ud++DacAL9WHOIGAeXueYkGXCp6uOiNxzmJusQoeVD2sATn+LNc1k1rutEVD6i6tdm4b3BaBJCQ2JuTcMbitFFikw6e6R6szKoGQE3DHBHQkPAlHNapXtpP1/hVgAJwl9s0/kQ9hAAAAAElFTkSuQmCC",
		qservice:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAlCAYAAAAjt+tHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABnVJREFUeNq0V21sU2UUfu5H29t26+Y6Id0GGwMckw1k0wBiIMhGYqIJmmjEmPhD5AcxQX+J//iJaDRE9I8hSnRR/EjEkBhhYIghEHBsYwFB3ZjbYB+wFdqt7dr74Xnf3tve1rZrE3yTk/fe9t57nnPOc857jmAYBtjq7OyUaRNJnOYu48EulUQnibP91KlT7B4CA2AqZ4oVU5wmAPEBKddNAEx5zJQ4AyF0dHRYyj0kPnNX/icPMMURkpC5xy0rFVP5ou5e//miPicImfdmKBdaHeumN9q9Yne9hytvaKArcoKiPFj7Y2R8JILuXpwnEK1WGOzES2pkyl10aRmk6ni4wo19L2+AR3GAcUYg6+P0+6HvL2Ho9j3AISc9wLwisD0HAFeGQRbPRIvtcirm2ZZH4zjw+hY8v+kRyLoBRZYgaQa2tNbh8N4OeJ0qfGUaKnw6ATQgMhDzEomYNiKlNvXtlE6LaLnZTsrXP7YUOztW48k9R9HXP0KWOICEirol1ej/Yhe63gNuB3vglBXMJ4DZqIyRcS8uXKlCz7WKZKjlnPwQUZDp9I4kSfhozzZ8+csA+v64DfjLLH9ibDyIg19fxv43XsBPl38nrxvcnwFyQHPDfXSunyAAfhw+tgzBEKmRdeRFkc/6V7a3oGmpH+8eOQu4HZn/e5348Ltz+Hu4Fs2124gTMXKMSF4QMUdeiFEINqydwluvDpJ3TM6XBEAScOtOBJouY/FDXtBFVmkxUO1TUEFAvjpei1jcgTKPSjw0LAciNOtA26ppPN4SJL5LJQIQXbg+0YeQdgbv797Os4Ez3ZJoAgd2b8XwxF0cPPonDnWtwckLAZ4JFgirPLQsD/+XkAUB8EwS8NqzU7gxeRTb1nuxYzOl7lwcIlmOSAKb2xrw4tZV2PtJNyWUjoHrPnx8ZCVOnK2D4tRtjhJQXRHLa2puEmoiVjTMoa15FtOhMPpHu/D5vjfxzs52yJIIlbyxevkifHa8F70DY0A5Sy+NI++7UYkdT4/yUmAZrWlCXkfnASBg45ogZVyClHkxGvwNP56uxOhINRUdjed6PKHh556bVLic9voMj0ul/w1Y1Yhd3w25yRVC8QAEp4FHl4WgcuQCJJGqn/sMurqbMisdVUb6M+PMWxqY48/bQz46oSTfKxaAz61isT9K1oumXQKckgJRcUHPk89co8NAy8pQKmEYGaPzMgbHKIsko3gSlns0eD0JTiD+EFn0z4QXeqJAe0D/1dfE0FQf4vWALQeBHZv0YoR5QCqhECkePcOzbDkdOudGPs5AlYh843QeqNDNeDvJIxevViEREfNmQc6fdS0zbeMJCe3N06ivpx4iQlGLSjaR4RIFvPTcGLa0TZLLkwVHEnXM3Ffw6yU/D01JWRAOS4jHRToLdCokAiejvzKG/XuuYuCvSkxOs4NHgttFp2D5PFYsmSP3hzFP71h9iZOIfOxkDaaY+91qaQCmQ06KWxmaGu5RTU9axOLqdVMBap9MHuJIphpTmFCF1HP2ClhZHs/L/gVD8EN3LWe/w8Z6jWLLXDwXlfiBw/ZITEqRzr6YN555ahxrW6j9i0mlAQAR7tKVCnz67YrUIaOQuxkYidLJEplCxMjpUTS4SWTJfgZQ/RB0KucjcHnyE1hqbGx0m52we2jCswuBgBkcA4NDZTg/4KdTzUVfZO6mGOuMlCISJOGIC1NBN64NVuB49xK43DoaArPsoOTFSKN3ahdF6V7CFdacMDKOj6MxED3CDnwkKZ3qUHPko4bxuw58c6KGXq6hdlGjlixNqLgm8ZBo8wJvwW7ecaGOFFJScBDM5mDYwBOtMzh9sZo6J0f2rMBJqNok2b3aG0jWTskav4zEBEQMh+3IZE2ozhokEg1Dt9x4+4MWyGK6R1VZSovJnX87PSOoVluu2yYW3jrnbE55wIwc9dd+iBiYSwgF23LrzhrRZJvyCBsaWN+e8wNsXqiqKm4GmJkBhocLDSYR+1ygmzch84HWrNGMZwoBO8fvFgJhKqfvbMriV/Zoxq71YobTVA9Pk1NPQU+klbdncSv/cLrAeG7t9vGtNyeItPJ1dhdnAcg9nhdaJjCmvMwUBqI/A0Ra+VpT+awpMUtR3hnXKGKqzQGiLOUJttKWz5aivGgAOUD4TBA9JnHbTaWhUpSXBCALhMcUqyONm66PlKK8ZAA2EM6sVFXtzC7le/8KMABTg/HInmfpOAAAAABJRU5ErkJggg==",
		perfectservice:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAlCAYAAAAjt+tHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABM9JREFUeNq8V0tsG1UUPfNzxhP/4nwMcZofKAWiBkIQSoAUqSRQVUJIUKEK8VmwY1MqFkAXXXTNAkQ3bCqkqgt2iB1k0QqRZAGhpSqBps2vTRPbcRx/x+PxZ7gzHkdT4yR2G/tKV89jP79z3rn33XmX0TQNuk1OTvI0sOQ2c+RxsJYjL5Cr+jg1NaU/g9EJmOA6sGi6zSTAHhB4wSSggyumqzoJZmJiogQukbvMUayTAjqwTB43R7W0S9EE7yBWs6ijkdpjVlVYi/RSvcF1MzFKKttYS+KJaJyV8owtZTtfh5jvZTuYpSxn0XhjDwRYuXL1kaV4aNOyWaRTCiKbSTA8B5EEnb8bhb2Jx5OdLrgkoT4E5OlZxC5dhpBRoHzwMT789hp66RD/vhDGSiBpzPG12HFyvBdfnBqCx2HbOw7Vmrq0jMDpz7DxyWmkrvyKfEo2sujU+CH8dCOCm5s5JDkRWVFCDAJ+/HMTN1aitSuQW1mFpqT1Sm0cFJbnodGobWzAPXkMzrfeLH4v8MgsLuHYYSe+6t+Gt80FT7sHUqsHbo8Er6sJNi6N7J1FI1yM0wmhy78/gSTFNZuQwXIsUskM7m/JCKeyiOYFjPa0oaelKGmeE1CIRNCtJfH+uy9SUmjQ8lTg8nmqcylo0QS0QgGqnAZrtxNntjoFmL5+LK/Fkc3lsa4q8A6I8PAMcnEViQ4Jtv4WY16cyDHLq1CDYThGRyuHjRTaPnceXZe/rz4EAdpxb0cz/r0XxfzSFl4b7sQrz3Q8MGf+Xhxnv5vFxVEO2YVbD776YnHkQiEUZLn4HNkuhkAQqiMQjivG2OtzEjiDVoplua0GElgPxEhaH/LxBLa+uQD11m1kKX8KJDnTJIBrbUX7ubPwX7pYEbwigZm/Qzj+5S9gKP+Gn2jFQJcb7R4RPMfARmddN4edx8mjfTjxUh8KmSjywSCBL0AcOgLHieNoemoAgt8Pxi4aeWEsVu0pOHzIjfMfPY/Zf0JYDSbx280gcpRYHBGQqMA87pXQ7WvG3J0IPn/vOWgz05AufA2aUBlhD/CKBHS5z7wziDMYLGZ6QUOBdsHSQhxbYbFXx3cHP4hSrINy2GMXjwBesRLOUTn94eoyri9Gdr6Ly1n8/Md9RJNqsVDlNUQSGSO815ejxm+xlLozP6vXArK7oSTSat5QsWoFwvEM1sIpI/76MdT/nKFFUkoO4ZgCd7MNzZSEcwtb+PTtQUTpxMyvRo0kDUTSRvHkqeDo9V8n3izy9HLisE5Hu90t4vUR/94KCFTcx57uwNEhHxyiYIRgjGoAR1XRSW+34HbaWKjH5zCSc6DLhW6qGTPzIXS2SYTP4I0X/NggQK/ThttrMXiIdIwq6WP0gvpfjtKt2EtjG7m3EXdCy8VUj3GYtdxQG22FUghyFm+U7WCylnZJaSABpdSisRZw2dI01Dv+cokEbyqgmO2SPuFIWWvGmg3FdI1AL5flV3lrpn8uVNOc7tzhicRcleAjZbm1e3O6T3teGq3t27V9wIetEpcRqNye77Mgb4I7TNdJ/LXL3GdN8KTpSgnooW/F5gKKZVHZ3OVuO68avOpr+S4kRspiXjN4VSHYJRyS6aWOQzUJyLWA10zAQsJWdlRz1syuZb3/BBgAsgop9FmfDRMAAAAASUVORK5CYII="
	};

	function supports_html5_storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
	String.prototype.replaceArray = function(find, replace) {
		var replaceString = this;
		var regex; 
		for (var i = 0; i < find.length; i++) {
			regex = new RegExp(find[i], "g");
			replaceString = replaceString.replace(regex, replace[i]);
		}
		return replaceString;
	};
	function filterValuePart(arr,part) {
		var find = ["ą","ś","ż","ź","ć","ń","ł","ó","ę",'"',"'","`"];
		var replace = ["a","s","z","z","c","n","l","o","e","","",""];
		part = part.toLowerCase().trim();
		partReplaced = part.replaceArray(find,replace);
		var emptyArr = new Array();
		$.each(arr,function(i,item){
			if( (String(item.konto).toLowerCase().indexOf(part) > -1) || (String(item.miasto).toLowerCase().indexOf(part) > -1) || (String(item.ulica).toLowerCase().indexOf(part) > -1) || (String(item.konto).toLowerCase().replaceArray(find,replace).indexOf(partReplaced) > -1) || (String(item.miasto).toLowerCase().replaceArray(find,replace).indexOf(partReplaced) > -1) || (String(item.ulica).toLowerCase().replaceArray(find,replace).indexOf(partReplaced) > -1) ) {
				emptyArr.push(item);
			}
		});
		return emptyArr;
	};
	function sortByKey(array, key) {
		return array.sort(function(a, b) {
			var x = a[key]; var y = b[key];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	};
	function warsztaty_filter(value){
		_warsztaty = filterValuePart(warsztaty,value);
		_search = true;
		renderWarsztaty(true);
	}
	function warsztaty_order(type){
		_order = type;
		var render = true;
		$("#address2").remove();
		if(type == 2){
			if(gotConnection()){
				$('#order').append('<input type="text" id="address2" placeholder="Wprowadź adres (autouzupełnianie)" style="margin:0px" />');
				var input2 = $("#address2").get(0);
				var autocomplete2 = new google.maps.places.Autocomplete(input2);
				google.maps.event.addListener(autocomplete2, 'place_changed', function() {
					var place2 = autocomplete2.getPlace();
					if (!place2.geometry) {
						use_warsztaty = sortByKey(use_warsztaty,'miasto');
					} else {
						var rLat = place2.geometry.location.lat();
						var rLng = place2.geometry.location.lng();
						var point = new google.maps.LatLng(rLat,rLng);
						currentPosition = point;
						return renderWarsztaty();
					}
				});
				if(navigator.geolocation){
					navigator.geolocation.getCurrentPosition(setcurrentPosition,function(a){});
				}
			} else {
				render = false;
				window.plugins.toast.showLongCenter('Brak połączenia z internetem.',function(a){},function(b){});
			}
			if(currentPosition){
				if(typeof currentPosition.coords != 'undefined') {
					var mylat = currentPosition.coords.latitude;
					var mylong = currentPosition.coords.longitude;
				} else {
					var mylat = currentPosition.lat();
					var mylong = currentPosition.lng();
				}
				var point = new google.maps.LatLng(mylat,mylong);
				currentPosition = point;
				window.plugins.toast.showShortBottom('Zapamiętano lokalizację.',function(a){},function(b){});
				render = true;
			}
		}
		if(render){
			renderWarsztaty();
		}
	}
	function setcurrentPosition(pos){
		currentPosition = pos;
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
		if(artykuly_loaded) {
			var per_page = 10;
			var list = document.createElement('ul');
			var	xmlDoc = $(artykuly).children();
			var c = $(xmlDoc).find('item');
			var months = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"];
			var page_count = 0;
			var page_data = 0;
			for(var i=0;i<c.length;i++){
				var d = $(c[i]);
				var title = $(d[0]).find('title').text();
				var link = $(d[0]).find('link').text();
				var pubDate = $(d[0]).find('pubDate').text();
				var _date = new Date(Date.parse(pubDate));
				var date_string = _date.getDate() + " " + months[_date.getMonth()] + " " + _date.getFullYear();
				var li = document.createElement('li');
				li.innerHTML = '<a onclick="window.open(\''+link+'\',\'_system\',\'location=no\')"><i class="fa fa-chevron-circle-right pull-right"></i><h6>'+title+'</h6><span>'+date_string+'</span></a>';
				if(page_count<per_page){
					li.style.display = 'block';
				}
				if(page_count%per_page==0){
					page_data++;
				}
				li.setAttribute("data-page",page_data);
				list.appendChild(li);
				page_count++;
			}
			artykulyDiv.innerHTML = '<ul>'+list.innerHTML+'</ul>';
			if(!articles_pagination_loaded){
				$("body").prepend('<div class="text-center pagination_outer articles_pagination_outer"><div class="articles_pagination pagination"><a href="#" class="first" data-action="first">&laquo;</a><a href="#" class="previous" data-action="previous">&lsaquo;</a><input type="text" readonly="readonly" data-max-page="'+Math.round((c.length/per_page))+'" /><a href="#" class="next" data-action="next">&rsaquo;</a><a href="#" class="last" data-action="last">&raquo;</a></div></div>');
				articles_pagination_loaded = true;
				$('.articles_pagination').jqPagination({
					paged:function(page) {
						$('#artykuly ul li').hide();
						$('#artykuly ul li[data-page="'+page+'"]').show();
					}
				});
			}
		} else {
			artykulyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać najnowsze aktualności.<br /><br /><a onclick="locationreload(\'page2\');"><i class="fa fa-refresh"></i> odśwież</a></div>';
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
		if(!warsztaty_pagination_loaded){
			$("body").prepend('<div class="text-center pagination_outer warsztaty_pagination_outer"><div class="relative"><a class="toggleForm" data-state="0">&#x25B2;</a><div class="warsztaty_pagination pagination"><a href="#" class="first" data-action="first">&laquo;</a><a href="#" class="previous" data-action="previous">&lsaquo;</a><input type="text" readonly="readonly" /><a href="#" class="next" data-action="next">&rsaquo;</a><a href="#" class="last" data-action="last">&raquo;</a></div><input type="search" placeholder="nazwa, miasto lub ulica" id="warsztat_search" onchange="return warsztaty_filter(this.value);" /><div id="order"><select onchange="return warsztaty_order(this.value);"><option value="1">alfabetycznie wg miast</option><option value="2">najmniejsza odległość</option></select></div></div></div>');
			if(!mapRenderWarsztaty){
				$(".warsztaty_pagination_outer").fadeIn(200);
			}
			$(".toggleForm").on("click",function(){
				var state = $(this).attr("data-state");
				if(state == 0){
					$(this).attr("data-state",1).html("&#x25BC;");
					$(".warsztaty_pagination_outer").animate({
						"bottom":0
					},200,"easeInExpo");
					$("#warsztaty ul").animate({
						"margin-bottom":(_order==1 ? 130 : 167)
					},200,"easeInExpo");
				} else {
					$(this).attr("data-state",0).html("&#x25B2;");
					$(".warsztaty_pagination_outer").animate({
						"bottom":(_order==1 ? -95 : -132)
					},200,"easeOutExpo");
					$("#warsztaty ul").animate({
						"margin-bottom":35
					},200,"easeOutExpo");
				}
			});
			warsztaty_pagination_loaded = true;
		}
		if(_warsztaty.length <= 0 && !_search){
			_warsztaty = warsztaty;
		}
		if(!_search){
			_warsztaty = filterValuePart(_warsztaty,'');
		}
		var len = Object.keys(_warsztaty).length;
		if( len > 0 ) {
			if(_order == 1) {
				use_warsztaty = sortByKey(_warsztaty,'miasto');
			} else if(_order == 2) {
				if(currentPosition) {
					if(typeof currentPosition.coords != 'undefined') {
						var mylat = currentPosition.coords.latitude;
						var mylong = currentPosition.coords.longitude;
					} else {
						var mylat = currentPosition.lat();
						var mylong = currentPosition.lng();
					}
					var latlng = new google.maps.LatLng(mylat,mylong);
					$.each(_warsztaty,function(i,item){
						var itemPos = new google.maps.LatLng(item.lat,item.lng);
						var dist = google.maps.geometry.spherical.computeDistanceBetween(latlng, itemPos);
						item.odleglosc = dist;
					});
					use_warsztaty = sortByKey(_warsztaty,'odleglosc');
				}
			}
			var per_page = 10;
			var page_count = 0;
			var page_data = 0;
			var list = document.createElement('ul');
			$.each(use_warsztaty,function(i,item){
				var li = document.createElement('li');
				li.innerHTML = '<a href="#warsztat" onclick="renderWarsztat('+i+')"><h6>'+item.miasto.toLowerCase()+', '+item.ulica.toLowerCase()+'</h6><span>'+item.konto.toUpperCase()+'</span></a>';
				if(page_count<per_page){
					li.style.display = 'block';
				}
				if(page_count%per_page==0){
					page_data++;
				}
				li.setAttribute("data-page",page_data);
				list.appendChild(li);
				page_count++;
			});
			warsztatyDiv.innerHTML = '<ul>'+list.innerHTML+'</ul>';
			$('.warsztaty_pagination').jqPagination({
				paged:function(page) {
					$('#warsztaty ul li').hide();
					$('#warsztaty ul li[data-page="'+page+'"]').show();
				},
				max_page:Math.round((len/per_page))
			});
		} else {
			$("#warsztaty").html('<div class="panel text-center">Brak warsztatów.</div>');
		}
	}
	function renderWarsztat(id){
		var item = use_warsztaty[id];
		$("#warsztat .content").empty();
		$("#warsztat .content").append('<h2>'+item.konto+'</h2><p>'+item.ulica+'<br />'+item.kod.substr(0,2)+'-'+item.kod.substr(2)+' '+item.miasto+'</p><table><tr><td>otwarte </td><td>'+item.open+'</td></tr><tr><td>w soboty </td><td>'+item.opensob+'</td></tr></table>');
		if(item.mechanika==1 || item.przeglad==1 || item.wulkanizacja==1 || item.klimatyzacja==1 || item.geometria==1 || item.diagnostyka==1 || item.elektryka==1 || item.spaliny==1 || item.blacharstwo==1 || item.lakiernictwo==1 || item.szyby==1) {
			var list = document.createElement('ul');
			list.style.marginTop = "15px";
			list.style.marginLeft = "0px";
			list.style.paddingLeft = "17px";
			list.style.listStyleType = "square";
			if(item.mechanika==1){
				var li=document.createElement('li');li.innerHTML='mechanika';list.appendChild(li);
			}
			if(item.blacharstwo==1){
				var li=document.createElement('li');li.innerHTML='blacharstwo';list.appendChild(li);
			}
			if(item.lakiernictwo==1){
				var li=document.createElement('li');li.innerHTML='lakiernictwo';list.appendChild(li);
			}
			if(item.przeglad==1){
				var li=document.createElement('li');li.innerHTML='przeglądy';list.appendChild(li);
			}
			if(item.diagnostyka==1){
				var li=document.createElement('li');li.innerHTML='diagnostyka';list.appendChild(li);
			}
			if(item.wulkanizacja==1){
				var li=document.createElement('li');li.innerHTML='wulkanizacja';list.appendChild(li);
			}
			if(item.geometria==1){
				var li=document.createElement('li');li.innerHTML='geometria kół';list.appendChild(li);
			}
			if(item.spaliny==1){
				var li=document.createElement('li');li.innerHTML='układy wydechowe';list.appendChild(li);
			}
			if(item.elektryka==1){
				var li=document.createElement('li');li.innerHTML='elektryka';list.appendChild(li);
			}
			if(item.klimatyzacja==1){
				var li=document.createElement('li');li.innerHTML='klimatyzacje';list.appendChild(li);
			}
			if(item.szyby==1){
				var li=document.createElement('li');li.innerHTML='szyby';list.appendChild(li);
			}
			$("#warsztat .content").append(list);
		}
		$(".footer_phone .telnumber").html(''+item.kom.substr(0,3)+' '+item.kom.substr(3,3)+' '+item.kom.substr(6,3)+'');
		$(".footer_phone").click(function(){dial(item.kom);});
		$(".footer_paper_plane").attr("href","geo:0,0?q="+encodeURI(item.miasto+', '+item.ulica));
		$(".footer_map").attr("href","#page4").click(function(){showPoint(id);});
	}
	function dial(number){
		window.open('tel:+48'+number,'_system','location=no');
		window.history.back();
	}
	function warsztatMail(id){
		var	item = use_warsztaty[id],
			mailbody = '<p>Warsztat:<br />'+item.konto+'<br />'+item.ulica+'<br />'+item.kod.substr(0,2)+'-'+item.kod.substr(2)+' '+item.miasto+'</p>';
		window.plugin.email.isServiceAvailable(
			function(isAvailable){
				window.plugin.email.open({
					to:[form_email],
					subject:'Zapytanie z aplikacji mobilnej Inter Cars sieć warsztatów.',
					body:mailbody,
					isHtml:true
				});
			}
		);
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
	function clearOverlays(){
		for(var i=0;i<markers.length;i++){
			markers[i].setMap(null);
		}
		markers.length = 0;
	}
	function createMarker(location) {
		var mapicon = $.trim(location.umowa).toLowerCase().replace(/ /g,'').replace(/-/g,'');
		var latlng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));
		var marker = new google.maps.Marker({
			map: map,
			position: latlng,
			icon:icons[mapicon]
		});
		var infoWindowContent = '<div class="noscrollbar">' + location.konto + '<br /><br /><span class="capitalize">'+location.ulica.toLowerCase()+'<br />'+location.kod.substr(0,2)+'-'+location.kod.substr(2)+' '+location.miasto.toLowerCase()+'</span><div><a onclick="dial(\''+location.kom+'\')"><img src="img/phone.png" alt="" />'+location.kom+'</a><a href="geo:0,0?q='+encodeURI(location.miasto+', '+location.ulica)+'"><img src="img/paper_plane.png" alt="" />nawiguj</a></div></div>';
		var infowindow = new google.maps.InfoWindow({
			content: infoWindowContent
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, this);
		});
		markers.push(marker);
	}
	function closestMarker(position,warsztatyArray){
		var closestMarker = -1;
		var closestDistance = Number.MAX_VALUE;
		var len1 = Object.keys(warsztatyArray).length;
		for(var i=0; i<len1; i++){
			var locationLatLng = new google.maps.LatLng(parseFloat(warsztatyArray[i].lat), parseFloat(warsztatyArray[i].lng));
			var dist = google.maps.geometry.spherical.computeDistanceBetween(position, locationLatLng);
			if(dist < closestDistance){
				closestMarker = i;
				closestDistance = dist;
			}
		}
		return closestMarker;
	}
	function displayPosition(pos){
		currentPosition = pos;
		var mylat = pos.coords.latitude;
		var mylong = pos.coords.longitude;
		var latlng = new google.maps.LatLng(mylat,mylong);
		var myOptions = {
			zoom: 12,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			panControl: false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.BOTTOM_RIGHT
			},
			scaleControl: true,
			streetViewControl: false
		};
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		clearOverlays();
		if(use_warsztaty.length <= 0){
			if(_warsztaty.length <= 0){
				_warsztaty = warsztaty;
			}
			_warsztaty = filterValuePart(_warsztaty,'');
			use_warsztaty = sortByKey(_warsztaty,'miasto');
		}
		var l = Object.keys(use_warsztaty).length;
		for(var i=0; i<l; i++){
			createMarker(use_warsztaty[i]);
		}
		var markerCluster = new MarkerClusterer(map, markers);
		if(typeof warsztatShowPointId !== 'undefined' && ((warsztatShowPointId && warsztatShowPointId > -1) || (parseInt(warsztatShowPointId)==0))) {
			var closestMarker1 = warsztatShowPointId;
		} else {
			var closestMarker1 = closestMarker(latlng, use_warsztaty);
		}
		warsztatShowPointId = false;
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: 'Twoja lokalizacja'
		});
		var path = new google.maps.MVCArray();
		var service = new google.maps.DirectionsService();
		var poly = new google.maps.Polyline({ map: map, strokeColor: '#FF8200' });
		var src = latlng;
		var des = new google.maps.LatLng(use_warsztaty[closestMarker1].lat,use_warsztaty[closestMarker1].lng);
		path.push(src);
		poly.setPath(path);
		service.route({
			origin: src,
			destination: des,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		}, function (result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
					path.push(result.routes[0].overview_path[i]);
				}
			}
		});
		var LatLngList = new Array(src,des);
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
			bounds.extend(LatLngList[i]);
		}
		map.fitBounds(bounds);
		google.maps.event.addListenerOnce(map, 'idle', function(){
			$('.input-outer').show();
			var input = $("#address").get(0);
			var autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.bindTo('bounds', map);
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				clearOverlays();
				var marker = new google.maps.Marker({
					map: map
				});
				var pos = {
					coords: {
						latitude: startingLatitude,
						longitude: startingLongitude,
					}
				};
				marker.setVisible(false);
				var place = autocomplete.getPlace();
				if (!place.geometry) {
					return;
				}
				if (place.geometry.viewport) {
					map.fitBounds(place.geometry.viewport);
				} else {
					map.setCenter(place.geometry.location);
				}
				marker.setPosition(place.geometry.location);
				marker.setVisible(true);
				pos.coords.latitude = place.geometry.location.lat();
				pos.coords.longitude = place.geometry.location.lng();
				warsztatShowPointId = warsztatShowPointIdCopy;
				displayPosition(pos);
			});
		});
		$("#map_canvas").addClass("loaded");
	}
	function geolocationError() {
			clearOverlays();
			if(typeof window.plugins != 'undefined' && typeof window.plugins.toast != 'undefined'){
				window.plugins.toast.showLongCenter('Nie można ustalić pozycji.',function(a){},function(b){});
			}
			if(currentPosition){
				if(typeof currentPosition.coords != 'undefined'){
					var mylat = currentPosition.coords.latitude;
					var mylong = currentPosition.coords.longitude;
				} else {
					var mylat = currentPosition.lat();
					var mylong = currentPosition.lng();
				}
			} else {
				var mylat = startingLatitude;
				var mylong = startingLongitude;
			}
			var latlng = new google.maps.LatLng(mylat, mylong);
			var myOptions = {
				zoom: 12,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				panControl: false,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.BOTTOM_RIGHT
				},
				scaleControl: true,
				streetViewControl: false
			};
			map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
			
			var l = Object.keys(warsztaty).length;
			for(var i=1; i<=l; i++){
				createMarker(warsztaty[i]);
			}
			var markerCluster = new MarkerClusterer(map, markers);
			if(typeof warsztatShowPointId !== 'undefined' && ((warsztatShowPointId && warsztatShowPointId > -1) || (parseInt(warsztatShowPointId)==0))) {
				map.setCenter(new google.maps.LatLng(use_warsztaty[warsztatShowPointId].lat,use_warsztaty[warsztatShowPointId].lng));
				if(currentPosition){
					var path = new google.maps.MVCArray();
					var service = new google.maps.DirectionsService();
					var poly = new google.maps.Polyline({ map: map, strokeColor: '#FF8200' });
					var src = latlng;
					var des = new google.maps.LatLng(use_warsztaty[warsztatShowPointId].lat,use_warsztaty[warsztatShowPointId].lng);
					path.push(src);
					poly.setPath(path);
					service.route({
						origin: src,
						destination: des,
						travelMode: google.maps.DirectionsTravelMode.DRIVING
					}, function (result, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
								path.push(result.routes[0].overview_path[i]);
							}
						}
					});
					var LatLngList = new Array(src,des);
					var bounds = new google.maps.LatLngBounds();
					for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
						bounds.extend(LatLngList[i]);
					}
					map.fitBounds(bounds);
				}
			}
			warsztatShowPointIdCopy = warsztatShowPointId;
			warsztatShowPointId = false;
			
			google.maps.event.addListenerOnce(map, 'idle', function(){
				$('.input-outer').show();
				var input = $("#address").get(0);
				var autocomplete = new google.maps.places.Autocomplete(input);
				autocomplete.bindTo('bounds', map);
				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					clearOverlays();
					var marker = new google.maps.Marker({
						map: map
					});
					var pos = {
						coords: {
							latitude: startingLatitude,
							longitude: startingLongitude,
						}
					};
					marker.setVisible(false);
					var place = autocomplete.getPlace();
					if (!place.geometry) {
						return;
					}
					if (place.geometry.viewport) {
						map.fitBounds(place.geometry.viewport);
					} else {
						map.setCenter(place.geometry.location);
					}
					marker.setPosition(place.geometry.location);
					marker.setVisible(true);
					pos.coords.latitude = place.geometry.location.lat();
					pos.coords.longitude = place.geometry.location.lng();
					warsztatShowPointId = warsztatShowPointIdCopy;
					displayPosition(pos);
				});
			});
			$("#map_canvas").addClass("loaded");
	}
	function showPoint(id){
		clearOverlays();
		markers = [];
		$("#map_canvas").empty();
		$("#map_canvas").removeClass("loaded");
		document.getElementById("map_canvas").innerHTML="";
		warsztatShowPointId = id;
	}
	function locationreload(page){
			var currentPage = $(".ui-page-active").attr('id');
			switch(currentPage){
				case "page2":
					if(gotConnection()){
						feedArtykuly();
						if(artykuly_loaded){
							renderArtykuly();
						} else {
							artykulyDiv.innerHTML = '<div class="panel text-center">Nie udało się wgrać aktualności.</div>';
						}
					} else {
						artykulyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać najnowsze aktualności.<br /><br /><a onclick="locationreload(\'page2\');"><i class="fa fa-refresh"></i> odśwież</a></div>';
					}
					break;
				case "page3":
					if(gotConnection()){
						checkVersion();
						if(new_version) {
							feedWarsztaty();
						} else {
							warsztaty_from_file = true;
						}
					} else {
						if(!warsztaty_loaded){
							warsztaty_from_file = true;
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
					break;
				case "page4":
					if(gotConnection()){
						if(warsztaty_first_load){
							warsztaty_first_load = false;
							if(warsztaty_from_file){
								window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
									fs.root.getFile(warsztaty_path, {create:false}, fileExists, fileNotExists);
								}, warsztatyFailFS);
							}
						}
						if(!map_first_load){
							map_first_load = true;
							var loadComplete = false;
							var timeStart = 0;
							var timeEnd = 1000;
							var everythingLoaded = setInterval(function(){
								if(warsztaty_loaded && !loadComplete){
									loadComplete = true;
									clearInterval(everythingLoaded);
									if(navigator.geolocation){
										navigator.geolocation.getCurrentPosition(displayPosition,geolocationError);
									} else {
										geolocationError();
									}
								} else {
									timeStart++;
								}
								if(timeStart == timeEnd){
									clearInterval(everythingLoaded);
									mapNotLoaded();
								}
							},100);
						} else {
							if(navigator.geolocation){
								navigator.geolocation.getCurrentPosition(displayPosition,geolocationError);
							} else {
								geolocationError();
							}
						}
					} else {
						mapNotLoaded();
					}
					break;
			}
			return false;
	}
	function mapNotLoaded(){
		$("#map_canvas").addClass("loaded").html('<div class="panel text-center">Włącz internet aby załadować mapę.<br /><br /><a onclick="locationreload(\'page4\');"><i class="fa fa-refresh"></i> odśwież</a></div>');
		$(".input-outer").hide();
	}
	function reloadScripts(){
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
			$(".loader").animate({"opacity":0},500,"easeOutExpo",function(){this.remove();});
			$("#page1 footer").animate({"bottom":0},500,"easeOutExpo");
			$(".clearAddress").on("click",function(){
				$("#address").val('');
			});
			$('#wycena').isHappy({
				fields: {
					'#formtyp': {
						required: true,
						message: 'pole wymagane'
					},
					'#vin': {
						required: true,
						message: 'pole wymagane'
					},
					'#marka': {
						required: true,
						message: 'pole wymagane'
					},
					'#rok': {
						required: true,
						message: 'pole wymagane'
					},
					'#paliwo': {
						required: true,
						message: 'pole wymagane'
					},
					'#rejestr': {
						required: true,
						message: 'pole wymagane'
					},
					'#usluga': {
						required: true,
						message: 'pole wymagane'
					},
					'#email': {
						required: true,
						message: 'pole wymagane'
					},
					'#tel': {
						required: true,
						message: 'pole wymagane'
					},
					'#miasto': {
						required: true,
						message: 'pole wymagane'
					}
				},
				submitButton:'.happybutton',
				happy:function(){
					var mailbody1 = '<p>Dane z formularza:</p><p>typ auta: '+$("#formtyp").val()+'<br />numer VIN: '+$("#vin").val()+'<br />marka, model, silnik: '+$("#marka").val()+'<br />rok produkcji: '+$("#rok").val()+'<br />rodzaj paliwa: '+$("#paliwo").val()+'<br />numer rejestracyjny: '+$("#rejestr").val()+'<br />usługa do wyceny: '+$("#usluga").val()+'<br />e-mail: '+$("#email").val()+'<br />numer telefonu: '+$("#tel").val()+'<br />miasto: '+$("#miasto").val()+'</p>';
					window.plugin.email.isServiceAvailable(
						function(isAvailable){
							window.plugin.email.open({
								to:[form_email],
								subject:'Zapytanie z aplikacji mobilnej Inter Cars sieć warsztatów.',
								body:mailbody1,
								isHtml:true
							});
						}
					);
				}
			});
			if(gotConnection()){
				feedArtykuly();
				checkVersion();
				if(new_version) {
					feedWarsztaty();
				} else {
					warsztaty_from_file = true;
				}
			} else {
				if(!warsztaty_loaded){
					warsztaty_from_file = true;
				}
			}
			$(document).on("pagebeforeshow","#page2",function(){
				if(articles_first_load){
					articles_first_load = false;
					if(artykuly_loaded){
						renderArtykuly();
					} else {
						if(gotConnection()) {
							artykulyDiv.innerHTML = '<div class="panel text-center">Nie udało się wgrać aktualności.</div>';
						} else {
							artykulyDiv.innerHTML = '<div class="panel text-center">Włącz internet aby pobrać najnowsze aktualności.<br /><br /><a onclick="locationreload(\'page2\');"><i class="fa fa-refresh"></i> odśwież</a></div>';
						}
					}
				}
			});
			$(document).on("pageshow","#page2",function(){
				$(".articles_pagination_outer").fadeIn(200);
			});
			$(document).on("pagebeforehide","#page2",function(){
				$(".articles_pagination_outer").fadeOut(100);
			});
			$(document).on("pagebeforeshow","#page3",function(){
				if(warsztaty_first_load){
					warsztaty_first_load = false;
					if(warsztaty_from_file){
						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
							fs.root.getFile(warsztaty_path, {create:false}, fileExists, fileNotExists);
						}, warsztatyFailFS);
					} else if(warsztaty_loaded){
						renderWarsztaty();
					} else {
						warsztatyLoadError();
					}
				}
			});
			$(document).on("pageshow","#page3",function(){
				if(warsztaty_pagination_loaded){
					$(".warsztaty_pagination_outer").fadeIn(200);
				}
			});
			$(document).on("pagebeforehide","#page3",function(){
				$(".warsztaty_pagination_outer").fadeOut(100);
			});
			$(document).on("pageshow","#page4",function(){
				var h = $(window).height() - 109;
				$("#map_canvas").css({"height":h+"px"});
				if(gotConnection()){
					if(warsztaty_first_load){
						mapRenderWarsztaty = true;
						warsztaty_first_load = false;
						if(warsztaty_from_file){
							window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
								fs.root.getFile(warsztaty_path, {create:false}, fileExists, fileNotExists);
							}, warsztatyFailFS);
						} else if(warsztaty_loaded){
							renderWarsztaty();
						} else {
							warsztatyLoadError();
						}
					}
					if(!map_first_load){
						map_first_load = true;
						var loadComplete = false;
						var timeStart = 0;
						var timeEnd = 1000;
						var everythingLoaded = setInterval(function(){
							if(warsztaty_loaded && !loadComplete){
								loadComplete = true;
								clearInterval(everythingLoaded);
								if(navigator.geolocation){
									navigator.geolocation.getCurrentPosition(displayPosition,geolocationError);
								} else {
									geolocationError();
								}
							} else {
								timeStart++;
							}
							if(timeStart == timeEnd){
								clearInterval(everythingLoaded);
								mapNotLoaded();
							}
						},100);
					} else {
						if(navigator.geolocation){
							navigator.geolocation.getCurrentPosition(displayPosition,geolocationError);
						} else {
							geolocationError();
						}
					}
				} else {
					mapNotLoaded();
				}
			});
			$(document).on("pageshow","#warsztat",function(){
				$("#warsztat footer").animate({"bottom":0},500,"easeOutExpo");
			});
	}

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
		reloadScripts();
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
		if(!warsztaty_loaded){
			checkVersion();
			if(new_version) {
				feedWarsztaty();
			} else {
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
					fs.root.getFile(warsztaty_path, {create:false}, fileExists, fileNotExists);
				}, warsztatyFailFS);
			}
		}
    }
};