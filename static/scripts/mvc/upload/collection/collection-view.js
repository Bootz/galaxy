"use strict";define(["utils/utils","mvc/upload/upload-model","mvc/upload/collection/collection-row","mvc/upload/upload-ftp","mvc/upload/upload-extension","mvc/ui/ui-popover","mvc/ui/ui-select","mvc/ui/ui-misc","mvc/collection/list-collection-creator","utils/uploadbox"],function(t,e,n,o,i,s,l,a,c){return Backbone.View.extend({upload_size:0,collection:new e.Collection,counter:{announce:0,success:0,error:0,running:0,reset:function(){this.announce=this.success=this.error=this.running=0}},initialize:function(t){var e=this;this.app=t,this.options=t.options,this.list_extensions=t.list_extensions,this.list_genomes=t.list_genomes,this.ui_button=t.ui_button,this.ftp_upload_site=t.currentFtp(),this.setElement(this._template()),this.btnLocal=new a.Button({id:"btn-local",title:"Choose local files",onclick:function(){e.uploadbox.select()},icon:"fa fa-laptop"}),this.btnFtp=new a.Button({id:"btn-ftp",title:"Choose FTP files",onclick:function(){e._eventFtp()},icon:"fa fa-folder-open-o"}),this.btnCreate=new a.Button({id:"btn-new",title:"Paste/Fetch data",onclick:function(){e._eventCreate()},icon:"fa fa-edit"}),this.btnStart=new a.Button({id:"btn-start",title:"Start",onclick:function(){e._eventStart()}}),this.btnBuild=new a.Button({id:"btn-build",title:"Build",onclick:function(){e._eventBuild()}}),this.btnStop=new a.Button({id:"btn-stop",title:"Pause",onclick:function(){e._eventStop()}}),this.btnReset=new a.Button({id:"btn-reset",title:"Reset",onclick:function(){e._eventReset()}}),this.btnClose=new a.Button({id:"btn-close",title:"Close",onclick:function(){e.app.modal.hide()}}),_.each([this.btnLocal,this.btnFtp,this.btnCreate,this.btnStop,this.btnReset,this.btnStart,this.btnBuild,this.btnClose],function(t){e.$(".upload-buttons").prepend(t.$el)}),this.uploadbox=this.$(".upload-box").uploadbox({url:this.app.options.nginx_upload_path,announce:function(t,n){e._eventAnnounce(t,n)},initialize:function(t){return e.app.toData([e.collection.get(t)],e.history_id)},progress:function(t,n){e._eventProgress(t,n)},success:function(t,n){e._eventSuccess(t,n)},error:function(t,n){e._eventError(t,n)},complete:function(){e._eventComplete()},ondragover:function(){e.$(".upload-box").addClass("highlight")},ondragleave:function(){e.$(".upload-box").removeClass("highlight")}}),this.ftp=new s.View({title:"FTP files",container:this.btnFtp.$el}),this.select_extension=new l.View({css:"upload-footer-selection-compressed",container:this.$(".upload-footer-extension"),data:_.filter(this.list_extensions,function(t){return!t.composite_files}),value:this.options.default_extension,onchange:function(t){e.updateExtension(t)}}),this.collectionType="list",this.select_collection=new l.View({css:"upload-footer-selection-compressed",container:this.$(".upload-footer-collection-type"),data:[{id:"list",text:"List"},{id:"paired",text:"Paired"},{id:"list:paired",text:"List of Pairs"}],value:"list",onchange:function(t){e.updateCollectionType(t)}}),this.$(".upload-footer-extension-info").on("click",function(t){new i({$el:$(t.target),title:e.select_extension.text(),extension:e.select_extension.value(),list:e.list_extensions,placement:"top"})}).on("mousedown",function(t){t.preventDefault()}),this.select_genome=new l.View({css:"upload-footer-selection",container:this.$(".upload-footer-genome"),data:this.list_genomes,value:this.options.default_genome,onchange:function(t){e.updateGenome(t)}}),this.collection.on("remove",function(t){e._eventRemove(t)}),this._updateScreen()},_eventAnnounce:function(t,o){this.counter.announce++;var i=new e.Model({id:t,file_name:o.name,file_size:o.size,file_mode:o.mode||"local",file_path:o.path,file_data:o,extension:this.select_extension.value(),genome:this.select_genome.value()});this.collection.add(i);var s=new n(this,{model:i});this.$(".upload-table > tbody:first").append(s.$el),this._updateScreen(),s.render()},_eventProgress:function(t,e){var n=this.collection.get(t);n.set("percentage",e),this.ui_button.model.set("percentage",this._uploadPercentage(e,n.get("file_size")))},_eventSuccess:function(t,e){var n=_.pluck(e.outputs,"hid"),o=this.collection.get(t);o.set({percentage:100,status:"success",hids:n}),this.ui_button.model.set("percentage",this._uploadPercentage(100,o.get("file_size"))),this.upload_completed+=100*o.get("file_size"),this.counter.announce--,this.counter.success++,this._updateScreen(),Galaxy.currHistoryPanel.refreshContents()},_eventError:function(t,e){var n=this.collection.get(t);n.set({percentage:100,status:"error",info:e}),this.ui_button.model.set({percentage:this._uploadPercentage(100,n.get("file_size")),status:"danger"}),this.upload_completed+=100*n.get("file_size"),this.counter.announce--,this.counter.error++,this._updateScreen()},_eventComplete:function(){this.collection.each(function(t){"queued"==t.get("status")&&t.set("status","init")}),this.counter.running=0,this._updateScreen()},_eventBuild:function(){var t=[];_.forEach(this.collection.models,function(e){t.push.apply(t,e.get("hids"))});var e=_.map(t,function(t){return Galaxy.currHistoryPanel.collection.getByHid(t)}),n=new Galaxy.currHistoryPanel.collection.constructor(e);n.historyId=Galaxy.currHistoryPanel.collection.historyId,Galaxy.currHistoryPanel.buildCollection(this.collectionType,n,!0),this.counter.running=0,this._updateScreen(),this._eventReset(),this.app.modal.hide()},_eventRemove:function(t){var e=t.get("status");"success"==e?this.counter.success--:"error"==e?this.counter.error--:this.counter.announce--,this.uploadbox.remove(t.id),this._updateScreen()},_eventFtp:function(){if(this.ftp.visible)this.ftp.hide();else{this.ftp.empty();var t=this;this.ftp.append(new o({collection:this.collection,ftp_upload_site:this.ftp_upload_site,onadd:function(e){return t.uploadbox.add([{mode:"ftp",name:e.path,size:e.size,path:e.path}])},onremove:function(e){t.collection.remove(e)}}).$el),this.ftp.show()}},_eventCreate:function(){this.uploadbox.add([{name:"New File",size:0,mode:"new"}])},_eventStart:function(){if(!(0==this.counter.announce||this.counter.running>0)){var t=this;this.upload_size=0,this.upload_completed=0,this.collection.each(function(e){"init"==e.get("status")&&(e.set("status","queued"),t.upload_size+=e.get("file_size"))}),this.ui_button.model.set({percentage:0,status:"success"}),this.counter.running=this.counter.announce,this.history_id=this.app.currentHistory(),this.uploadbox.start(),this._updateScreen()}},_eventStop:function(){this.counter.running>0&&(this.ui_button.model.set("status","info"),$(".upload-top-info").html("Queue will pause after completing the current file..."),this.uploadbox.stop())},_eventReset:function(){0==this.counter.running&&(this.collection.reset(),this.counter.reset(),this.uploadbox.reset(),this.select_extension.value(this.options.default_extension),this.select_genome.value(this.options.default_genome),this.ui_button.model.set("percentage",0),this._updateScreen())},updateExtension:function(t,e){var n=this;this.collection.each(function(o){"init"!=o.get("status")||o.get("extension")!=n.options.default_extension&&e||o.set("extension",t)})},updateCollectionType:function(t){this.collectionType=t},updateGenome:function(t,e){var n=this;this.collection.each(function(o){"init"!=o.get("status")||o.get("genome")!=n.options.default_genome&&e||o.set("genome",t)})},_updateScreen:function(){var t="";t=0==this.counter.announce?this.uploadbox.compatible()?"&nbsp;":"Browser does not support Drag & Drop. Try Firefox 4+, Chrome 7+, IE 10+, Opera 12+ or Safari 6+.":0==this.counter.running?"You added "+this.counter.announce+" file(s) to the queue. Add more files or click 'Start' to proceed.":"Please wait..."+this.counter.announce+" out of "+this.counter.running+" remaining.",this.$(".upload-top-info").html(t);var e=0==this.counter.running&&this.counter.announce+this.counter.success+this.counter.error>0,n=0==this.counter.running&&this.counter.announce>0,o=0==this.counter.running&&0==this.counter.announce&&this.counter.success>0&&0==this.counter.error,i=0==this.counter.running,s=this.counter.announce+this.counter.success+this.counter.error>0;this.btnReset[e?"enable":"disable"](),this.btnStart[n?"enable":"disable"](),this.btnStart.$el[n?"addClass":"removeClass"]("btn-primary"),this.btnBuild[o?"enable":"disable"](),this.btnBuild.$el[o?"addClass":"removeClass"]("btn-primary"),this.btnStop[this.counter.running>0?"enable":"disable"](),this.btnLocal[i?"enable":"disable"](),this.btnFtp[i?"enable":"disable"](),this.btnCreate[i?"enable":"disable"](),this.btnFtp.$el[this.ftp_upload_site?"show":"hide"](),this.$(".upload-table")[s?"show":"hide"](),this.$(".upload-helper")[s?"hide":"show"]()},_uploadPercentage:function(t,e){return(this.upload_completed+t*e)/this.upload_size},_template:function(){return'<div class="upload-view-default"><div class="upload-top"><h6 class="upload-top-info"/></div><div class="upload-box"><div class="upload-helper"><i class="fa fa-files-o"/>Drop files here</div><table class="upload-table ui-table-striped" style="display: none;"><thead><tr><th>Name</th><th>Size</th><th>Status</th><th/></tr></thead><tbody/></table></div><div class="upload-footer"><span class="upload-footer-title-compressed">Collection Type:</span><span class="upload-footer-collection-type"/><span class="upload-footer-title-compressed">File Type:</span><span class="upload-footer-extension"/><span class="upload-footer-extension-info upload-icon-button fa fa-search"/> <span class="upload-footer-title-compressed">Genome (set all):</span><span class="upload-footer-genome"/></div><div class="upload-buttons"/></div>'}})});
//# sourceMappingURL=../../../../maps/mvc/upload/collection/collection-view.js.map
