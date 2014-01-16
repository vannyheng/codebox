/**
 * @license RequireJS text 2.0.10 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

define("collections/addons",[],function(){var e=codebox.require("q"),t=codebox.require("hr/hr"),n=codebox.require("underscore"),r=codebox.require("core/user"),i=codebox.require("models/addon"),s=codebox.require("core/addons"),o=codebox.require("collections/addons"),u=codebox.require("core/box"),o=o.extend({model:i,defaults:n.defaults({loader:"allIndex",loaderArgs:[],startIndex:0,limit:10},t.Collection.prototype.defaults),getIndex:function(){var i=this;return this._index=t.Cache.get("addons","index"),this._index?e(this._index):t.Requests.getJSON(u.proxyUrl(r.settings("manager").get("registry")+"/api/addons?limit=1000")).then(function(s){return i._index=s,i._index.addons=n.map(i._index.addons,function(e){return n.extend(e["package"],{git:e.git})}),t.Cache.set("addons",r.settings("manager").get("registry"),i._index,3600),e(i._index)})},getFromIndex:function(t,r){var i=this;return t=n.defaults({},t||{},this.options),this.getIndex().then(function(s){var o=r(s.addons);return i.add({list:o.slice(t.startIndex,t.startIndex+t.limit),n:n.size(o)}),e(o)})},allIndex:function(e){return this.getFromIndex(e,n.identity)},searchIndex:function(e,t){return e=e.toLowerCase(),this.getFromIndex(t,function(t){return n.filter(t,function(t){var n=[t.name,t.description,t.author,t.title].join(" ").toLowerCase();return n.search(e)>=0})})},allInstalled:function(e){return this.getFromIndex(e,function(e){return n.filter(e,function(e){return s.isInstalled(e.name)})})},allDefaults:function(e){this.reset(s.filter(function(e){return s.isDefault(e.get("name"))}))},allAvailable:function(e){return this.getFromIndex(e,function(e){return n.filter(e,function(e){return!s.isInstalled(e.name)})})}});return o}),define("require-tools/text/text",["module"],function(e){var t,n,r,i,s,o=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],u=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,a=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,f=typeof location!="undefined"&&location.href,l=f&&location.protocol&&location.protocol.replace(/\:/,""),c=f&&location.hostname,h=f&&(location.port||undefined),p={},d=e.config&&e.config()||{};t={version:"2.0.10",strip:function(e){if(e){e=e.replace(u,"");var t=e.match(a);t&&(e=t[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")},createXhr:d.createXhr||function(){var e,t,n;if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;if(typeof ActiveXObject!="undefined")for(t=0;t<3;t+=1){n=o[t];try{e=new ActiveXObject(n)}catch(r){}if(e){o=[n];break}}return e},parseName:function(e){var t,n,r,i=!1,s=e.indexOf("."),o=e.indexOf("./")===0||e.indexOf("../")===0;return s!==-1&&(!o||s>1)?(t=e.substring(0,s),n=e.substring(s+1,e.length)):t=e,r=n||t,s=r.indexOf("!"),s!==-1&&(i=r.substring(s+1)==="strip",r=r.substring(0,s),n?n=r:t=r),{moduleName:t,ext:n,strip:i}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,n,r,i){var s,o,u,a=t.xdRegExp.exec(e);return a?(s=a[2],o=a[3],o=o.split(":"),u=o[1],o=o[0],(!s||s===n)&&(!o||o.toLowerCase()===r.toLowerCase())&&(!u&&!o||u===i)):!0},finishLoad:function(e,n,r,i){r=n?t.strip(r):r,d.isBuild&&(p[e]=r),i(r)},load:function(e,n,r,i){if(i.isBuild&&!i.inlineText){r();return}d.isBuild=i.isBuild;var s=t.parseName(e),o=s.moduleName+(s.ext?"."+s.ext:""),u=n.toUrl(o),a=d.useXhr||t.useXhr;if(u.indexOf("empty:")===0){r();return}!f||a(u,l,c,h)?t.get(u,function(n){t.finishLoad(e,s.strip,n,r)},function(e){r.error&&r.error(e)}):n([o],function(e){t.finishLoad(s.moduleName+"."+s.ext,s.strip,e,r)})},write:function(e,n,r,i){if(p.hasOwnProperty(n)){var s=t.jsEscape(p[n]);r.asModule(e+"!"+n,"define(function () { return '"+s+"';});\n")}},writeFile:function(e,n,r,i,s){var o=t.parseName(n),u=o.ext?"."+o.ext:"",a=o.moduleName+u,f=r.toUrl(o.moduleName+u)+".js";t.load(a,r,function(n){var r=function(e){return i(f,e)};r.asModule=function(e,t){return i.asModule(e,f,t)},t.write(e,a,r,s)},s)}};if(d.env==="node"||!d.env&&typeof process!="undefined"&&process.versions&&!!process.versions.node&&!process.versions["node-webkit"])n=require.nodeRequire("fs"),t.get=function(e,t,r){try{var i=n.readFileSync(e,"utf8");i.indexOf("﻿")===0&&(i=i.substring(1)),t(i)}catch(s){r(s)}};else if(d.env==="xhr"||!d.env&&t.createXhr())t.get=function(e,n,r,i){var s=t.createXhr(),o;s.open("GET",e,!0);if(i)for(o in i)i.hasOwnProperty(o)&&s.setRequestHeader(o.toLowerCase(),i[o]);d.onXhr&&d.onXhr(s,e),s.onreadystatechange=function(t){var i,o;s.readyState===4&&(i=s.status,i>399&&i<600?(o=new Error(e+" HTTP status: "+i),o.xhr=s,r(o)):n(s.responseText),d.onXhrComplete&&d.onXhrComplete(s,e))},s.send(null)};else if(d.env==="rhino"||!d.env&&typeof Packages!="undefined"&&typeof java!="undefined")t.get=function(e,t){var n,r,i="utf-8",s=new java.io.File(e),o=java.lang.System.getProperty("line.separator"),u=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(s),i)),a="";try{n=new java.lang.StringBuffer,r=u.readLine(),r&&r.length()&&r.charAt(0)===65279&&(r=r.substring(1)),r!==null&&n.append(r);while((r=u.readLine())!==null)n.append(o),n.append(r);a=String(n.toString())}finally{u.close()}t(a)};else if(d.env==="xpconnect"||!d.env&&typeof Components!="undefined"&&Components.classes&&Components.interfaces)r=Components.classes,i=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),s="@mozilla.org/windows-registry-key;1"in r,t.get=function(e,t){var n,o,u,a={};s&&(e=e.replace(/\//g,"\\")),u=new FileUtils.File(e);try{n=r["@mozilla.org/network/file-input-stream;1"].createInstance(i.nsIFileInputStream),n.init(u,1,0,!1),o=r["@mozilla.org/intl/converter-input-stream;1"].createInstance(i.nsIConverterInputStream),o.init(n,"utf-8",n.available(),i.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),o.readString(n.available(),a),o.close(),n.close(),t(a.value)}catch(f){throw new Error((u&&u.path||"")+": "+f)}};return t}),define("require-tools/text/text!templates/addon.html",[],function(){return'<div class="actions">\n    <% if (!isDefault) { %>\n        <% if (addonStatus == "error") { %>\n        <button class="btn btn-warning disabled"><i class="fa fa-warning"></i></button>\n        <% } %>\n        <% if (isInstalled && !isUpdated) { %>\n        <button class="btn action-install btn-warning" data-loading-text="Updating...">Update</button>\n        <% } else { %>\n            <% if (!isInstalled) { %>\n            <a href="#" class="btn action-install btn-default" data-loading-text="Installation...">Install</a>\n            <% } else { %>\n            <a href="#" class="btn action-uninstall btn-danger btn-default" data-loading-text="Uninstallation...">Uninstall</a>\n            <% } %>\n        <% } %>\n    <% } else { %>\n        <button class="btn btn-default disabled">Default</button>\n    <% } %>\n</div>\n\n<div class="base">\n    <p class="name"><%- model.get("title") %></p>\n    <p class="version"><%- model.get("version") %></p>\n</div>\n<div class="more">\n    <p class="description"><%- model.get("description") %></p>\n    <p class="homepage"><a href="<%- model.get("homepage") %>" target="_blank">More info.</a> - <a href="<%- model.get("author.url") %>" target="_blank"><%- model.get("author.name") %></a></p>\n</div>'}),define("require-tools/less/normalize",[],function(){function r(e,r,i){if(e.indexOf("data:")===0)return e;e=t(e);var u=i.match(n),a=r.match(n);return a&&(!u||u[1]!=a[1]||u[2]!=a[2])?s(e,r):o(s(e,r),i)}function s(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));if(e.match(/^\//)||e.match(n))return e;var r=t.split("/"),i=e.split("/");r.pop();while(curPart=i.shift())curPart==".."?r.pop():r.push(curPart);return r.join("/")}function o(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var e=/([^:])\/+/g,t=function(t){return t.replace(e,"$1/")},n=/[^\:\/]*:\/\/([^\/])*/,u=function(e,n,i){n=t(n),i=t(i);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,o,u,e;while(o=s.exec(e)){u=o[3]||o[2]||o[5]||o[6]||o[4];var a;a=r(u,n,i);var f=o[5]||o[6]?1:0;e=e.substr(0,s.lastIndex-u.length-f-1)+a+e.substr(s.lastIndex-f-1),s.lastIndex=s.lastIndex+(a.length-u.length)}return e};return u.convertURIBase=r,u.absoluteURI=s,u.relativeURI=o,u}),define("require-tools/less/less",["require"],function(e){var t={};t.pluginBuilder="./less-builder";if(typeof window=="undefined")return t.load=function(e,t,n){n()},less;t.normalize=function(e,t){return e.substr(e.length-5,5)==".less"&&(e=e.substr(0,e.length-5)),e=t(e),e};var n=document.getElementsByTagName("head")[0],r=window.location.href.split("/");r[r.length-1]="",r=r.join("/");var i;window.less=window.less||{env:"development"};var s=0,o;t.inject=function(e){s<31&&(o=document.createElement("style"),o.type="text/css",n.appendChild(o),s++),o.styleSheet?o.styleSheet.cssText+=e:o.appendChild(document.createTextNode(e))};var u;return t.load=function(n,s,o,a){e(["./lessc","./normalize"],function(a,f){if(!i){var l=e.toUrl("base_url").split("/");l[l.length-1]="",i=f.absoluteURI(l.join("/"),r)+"/"}var c=s.toUrl(n+".less");c=f.absoluteURI(c,i),u=u||new a.Parser(window.less),u.parse('@import "'+c+'";',function(e,n){if(e)return o.error(e);t.inject(f(n.toCSS(),c,r)),setTimeout(o,7)})})},t}),define("require-tools/less/less!stylesheets/addons",[],function(){}),define("views/addons",["collections/addons","text!templates/addon.html","less!stylesheets/addons"],function(e,t){var n=codebox.require("hr/hr"),r=codebox.require("underscore"),i=codebox.require("core/addons"),s=new e;s.getIndex();var o=n.List.Item.extend({className:"addon-item",templateLoader:"text",template:t,events:{"click .action-install":"install","click .action-uninstall":"uninstall"},templateContext:function(){return{model:this.model,addonStatus:i.getState(this.model.get("name")),isInstalled:i.isInstalled(this.model.get("name")),isDefault:i.isDefault(this.model.get("name")),isUpdated:i.isUpdated(this.model)}},install:function(e){e&&e.preventDefault();var t=this,n=this.$(".action-install");n.button("loading"),i.install(this.model.get("git")).then(r.bind(this.render,this)).fin(function(){n.button("reset"),t.update()})},uninstall:function(e){e&&e.preventDefault();var t=this,n=this.$(".action-install");n.button("loading"),i.uninstall(this.model.get("name")).then(r.bind(this.render,this)).fin(function(){n.button("reset"),t.update()})}}),u=n.List.extend({className:"addons-list",Collection:e,Item:o,defaults:r.defaults({collection:s},n.List.prototype.defaults)});return u}),define("require-tools/text/text!templates/dialog.html",[],function(){return'<div class="modal-dialog">\n    <div class="modal-content">\n        <div class="modal-body">\n            <nav class="navbar navbar-default navbar-static-top" role="navigation">\n                    <div class="navbar-header">\n                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-8">\n                            <span class="sr-only">Toggle navigation</span>\n                            <span class="icon-bar"></span>\n                            <span class="icon-bar"></span>\n                            <span class="icon-bar"></span>\n                        </button>\n                        <span class="navbar-brand">Add-ons</span>\n                    </div>\n\n                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-8">\n                        <ul class="nav navbar-nav">\n                            <li><a href="#" data-addons="all">All</a></li>\n                            <li><a href="#" data-addons="installed">Installed</a></li>\n                            <li><a href="#" data-addons="available">Available</a></li>\n                            <li><a href="#" data-addons="defaults">Defaults</a></li>\n                        </ul>\n                    </div>\n                </nav>\n            <div class="list"></div>\n        </div>\n        <div class="modal-footer">\n             <button class="btn btn-default action-fromurl">Install from url...</button> <button class="btn btn-default action-close">Close</button>\n        </div>\n    </div>\n</div>'}),define("views/dialog",["views/addons","text!templates/dialog.html"],function(e,t){var n=codebox.require("jQuery"),r=codebox.require("views/dialogs/base"),i=codebox.require("utils/dialogs"),s=codebox.require("core/addons"),o=r.extend({className:"addon-manager-dialog modal fade",templateLoader:"text",template:t,events:_.extend({},r.prototype.events,{"click .action-fromurl":"installFromUrl","click a[data-addons]":"filterAddons"}),initialize:function(t){return o.__super__.initialize.apply(this,arguments),this.list=new e,this},finish:function(){return this.list.$el.appendTo(this.$(".list")),o.__super__.finish.apply(this,arguments)},installFromUrl:function(e){e&&e.preventDefault(),i.prompt("Install a new addon","GIT url for the addon:","").then(function(e){s.install(e).then(function(){i.alert("Installation","Add-on installed with success!")},function(){i.alert("Installation","Sorry, installation failed, please check that the url you entered is correct and the GIT repository a correct CodeBox add-on.")})})},filterAddons:function(e){e.preventDefault();var t=n(e.currentTarget).data("addons"),r={all:"allIndex",installed:"allInstalled",defaults:"allDefaults",available:"allAvailable"};this.list.collection.reset([]),this.list.collection[r[t]]()}});return o}),define("client",["views/dialog"],function(e){var t=codebox.require("core/commands/toolbar"),n=codebox.require("core/app"),r=codebox.require("utils/dialogs"),i=codebox.require("core/settings"),s=codebox.require("core/commands/menu");i.add({namespace:"manager",title:"Addons",defaults:{registry:"https://api.codebox.io"},fields:{registry:{label:"Registry",type:"text"}}});var o=t.register("addons.manager.open",{title:"Add-ons",icon:"puzzle-piece",visible:!1,offline:!1},function(){r.open(e)});s.getById("file").menu.add(o)}),function(e){var t=document,n="appendChild",r="styleSheet",i=t.createElement("style");i.type="text/css",t.getElementsByTagName("head")[0][n](i),i[r]?i[r].cssText=e:i[n](t.createTextNode(e))}("@media screen and (min-width:768px){.addon-manager-dialog .modal-dialog{width:760px}}.addon-manager-dialog .modal-body{padding:0}.addon-manager-dialog .search-input{float:right;width:200px;border:1px solid #ddd;padding:5px;margin-top:-5px}.addon-manager-dialog .search-input:hover,.addon-manager-dialog .search-input:focus{outline:0}.addon-manager-dialog .addons-list{list-style:none;margin:0;padding:0 20px}.addon-manager-dialog .addons-list .hr-list-message-more{text-align:center;background:#eee;margin:0}.addon-manager-dialog .addons-list .addon-item{min-height:60px;margin:10px 0}.addon-manager-dialog .addons-list .addon-item p{margin:0}.addon-manager-dialog .addons-list .addon-item p.name{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.addon-manager-dialog .addons-list .addon-item .base{float:left;width:100px;margin-right:10px}.addon-manager-dialog .addons-list .addon-item .base .version{color:#666}.addon-manager-dialog .addons-list .addon-item .more{margin-left:110px}.addon-manager-dialog .addons-list .addon-item .actions{float:right;margin-left:20px}")