"use strict";define(["mvc/list/list-item","mvc/dataset/states","ui/fa-icon-button","mvc/base-mvc","utils/localization"],function(e,t,a,s,i){var d=e.ListItemView,l=d.extend({_logNamespace:"dataset",className:d.prototype.className+" dataset",id:function(){return["dataset",this.model.get("id")].join("-")},initialize:function(e){e.logger&&(this.logger=this.model.logger=e.logger),this.log(this+".initialize:",e),d.prototype.initialize.call(this,e),this.linkTarget=e.linkTarget||"_blank"},_setUpListeners:function(){d.prototype._setUpListeners.call(this);var e=this;return e.listenTo(e.model,{change:function(t){e.model.changedAttributes().state&&e.model.inReadyState()&&e.expanded&&!e.model.hasDetails()?e.model.fetch({silent:!0}).done(function(){e.render()}):_.has(t.changed,"tags")&&1===_.keys(t.changed).length?e.$(".nametags").html(e._renderNametags()):e.render()}})},_fetchModelDetails:function(){var e=this;return e.model.inReadyState()&&!e.model.hasDetails()?e.model.fetch({silent:!0}):jQuery.when()},remove:function(e,t){var a=this;e=e||this.fxSpeed,this.$el.fadeOut(e,function(){Backbone.View.prototype.remove.call(a),t&&t.call(a)})},_swapNewRender:function(e){return d.prototype._swapNewRender.call(this,e),this.model.has("state")&&this.$el.addClass("state-"+this.model.get("state")),this.$el},_renderPrimaryActions:function(){return[this._renderDisplayButton()]},_renderDisplayButton:function(){var e=this.model.get("state");if(e===t.NOT_VIEWABLE||e===t.DISCARDED||!this.model.get("accessible"))return null;var s={target:this.linkTarget,classes:"display-btn"};if(this.model.get("purged"))s.disabled=!0,s.title=i("Cannot display datasets removed from disk");else if(e===t.UPLOAD)s.disabled=!0,s.title=i("This dataset must finish uploading before it can be viewed");else if(e===t.NEW)s.disabled=!0,s.title=i("This dataset is not yet viewable");else{s.title=i("View data"),s.href=this.model.urls.display;var d=this;s.onclick=function(e){Galaxy.frame&&Galaxy.frame.active&&(Galaxy.frame.addDataset(d.model.get("id")),e.preventDefault())}}return s.faIcon="fa-eye",a(s)},_renderDetails:function(){if(this.model.get("state")===t.NOT_VIEWABLE)return $(this.templates.noAccess(this.model.toJSON(),this));var e=d.prototype._renderDetails.call(this);return e.find(".actions .left").empty().append(this._renderSecondaryActions()),e.find(".summary").html(this._renderSummary()).prepend(this._renderDetailMessages()),e.find(".display-applications").html(this._renderDisplayApplications()),this._setUpBehaviors(e),e},_renderSummary:function(){var e=this.model.toJSON(),t=this.templates.summaries[e.state];return(t=t||this.templates.summaries.unknown)(e,this)},_renderDetailMessages:function(){var e=this,t=$('<div class="detail-messages"></div>'),a=e.model.toJSON();return _.each(e.templates.detailMessages,function(s){t.append($(s(a,e)))}),t},_renderDisplayApplications:function(){return this.model.isDeletedOrPurged()?"":[this.templates.displayApplications(this.model.get("display_apps"),this),this.templates.displayApplications(this.model.get("display_types"),this)].join("")},_renderSecondaryActions:function(){switch(this.debug("_renderSecondaryActions"),this.model.get("state")){case t.NOT_VIEWABLE:return[];case t.OK:case t.FAILED_METADATA:case t.ERROR:return[this._renderDownloadButton(),this._renderShowParamsButton()]}return[this._renderShowParamsButton()]},_renderShowParamsButton:function(){return a({title:i("View details"),classes:"params-btn",href:this.model.urls.show_params,target:this.linkTarget,faIcon:"fa-info-circle",onclick:function(e){Galaxy.frame&&Galaxy.frame.active&&(Galaxy.frame.add({title:"Dataset details",url:this.href}),e.preventDefault(),e.stopPropagation())}})},_renderDownloadButton:function(){return this.model.get("purged")||!this.model.hasData()?null:_.isEmpty(this.model.get("meta_files"))?$(['<a class="download-btn icon-btn" ','href="',this.model.urls.download,'" title="'+i("Download")+'" download>','<span class="fa fa-floppy-o"></span>',"</a>"].join("")):this._renderMetaFileDownloadButton()},_renderMetaFileDownloadButton:function(){var e=this.model.urls;return $(['<div class="metafile-dropdown dropdown">','<a class="download-btn icon-btn" href="javascript:void(0)" data-toggle="dropdown"',' title="'+i("Download")+'">','<span class="fa fa-floppy-o"></span>',"</a>",'<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">','<li><a href="'+e.download+'" download>',i("Download dataset"),"</a></li>",_.map(this.model.get("meta_files"),function(t){return['<li><a href="',e.meta_download+t.file_type,'">',i("Download")," ",t.file_type,"</a></li>"].join("")}).join("\n"),"</ul>","</div>"].join("\n"))},_renderNametags:function(){return _.template(["<% _.each(_.sortBy(_.uniq(tags), function(x) { return x }), function(tag){ %>",'<% if (tag.indexOf("name:") == 0){ %>','<span class="label label-info"><%- tag.slice(5) %></span>',"<% } %>","<% }); %>"].join(""))({tags:this.model.get("tags")})},events:_.extend(_.clone(d.prototype.events),{"click .display-btn":function(e){this.trigger("display",this,e)},"click .params-btn":function(e){this.trigger("params",this,e)},"click .download-btn":function(e){this.trigger("download",this,e)}}),toString:function(){return"DatasetListItemView("+(this.model?this.model+"":"(no model)")+")"}});return l.prototype.templates=function(){var e=_.extend({},d.prototype.templates.warnings,{failed_metadata:s.wrapTemplate(['<% if( model.state === "failed_metadata" ){ %>','<div class="warningmessagesmall">',i("An error occurred setting the metadata for this dataset"),"</div>","<% } %>"]),error:s.wrapTemplate(["<% if( model.error ){ %>",'<div class="errormessagesmall">',i("There was an error getting the data for this dataset"),": <%- model.error %>","</div>","<% } %>"]),purged:s.wrapTemplate(["<% if( model.purged ){ %>",'<div class="purged-msg warningmessagesmall">',i("This dataset has been deleted and removed from disk"),"</div>","<% } %>"]),deleted:s.wrapTemplate(["<% if( model.deleted && !model.purged ){ %>",'<div class="deleted-msg warningmessagesmall">',i("This dataset has been deleted"),"</div>","<% } %>"])}),a=s.wrapTemplate(['<div class="details">','<div class="summary"></div>','<div class="actions clear">','<div class="left"></div>','<div class="right"></div>',"</div>","<% if( !dataset.deleted && !dataset.purged ){ %>",'<div class="tags-display"></div>','<div class="annotation-display"></div>','<div class="display-applications"></div>',"<% if( dataset.peek ){ %>",'<pre class="dataset-peek"><%= dataset.peek %></pre>',"<% } %>","<% } %>","</div>"],"dataset"),l=s.wrapTemplate(['<div class="details">','<div class="summary">',i("You do not have permission to view this dataset"),"</div>","</div>"],"dataset"),n={};n[t.OK]=n[t.FAILED_METADATA]=s.wrapTemplate(["<% if( dataset.misc_blurb ){ %>",'<div class="blurb">','<span class="value"><%- dataset.misc_blurb %></span>',"</div>","<% } %>","<% if( dataset.file_ext ){ %>",'<div class="datatype">','<label class="prompt">',i("format"),"</label>",'<span class="value"><%- dataset.file_ext %></span>',"</div>","<% } %>","<% if( dataset.metadata_dbkey ){ %>",'<div class="dbkey">','<label class="prompt">',i("database"),"</label>",'<span class="value">',"<%- dataset.metadata_dbkey %>","</span>","</div>","<% } %>","<% if( dataset.misc_info ){ %>",'<div class="info">','<span class="value"><%- dataset.misc_info %></span>',"</div>","<% } %>"],"dataset"),n[t.NEW]=s.wrapTemplate(["<div>",i("This is a new dataset and not all of its data are available yet"),"</div>"],"dataset"),n[t.NOT_VIEWABLE]=s.wrapTemplate(["<div>",i("You do not have permission to view this dataset"),"</div>"],"dataset"),n[t.DISCARDED]=s.wrapTemplate(["<div>",i("The job creating this dataset was cancelled before completion"),"</div>"],"dataset"),n[t.QUEUED]=s.wrapTemplate(["<div>",i("This job is waiting to run"),"</div>"],"dataset"),n[t.RUNNING]=s.wrapTemplate(["<div>",i("This job is currently running"),"</div>"],"dataset"),n[t.UPLOAD]=s.wrapTemplate(["<div>",i("This dataset is currently uploading"),"</div>"],"dataset"),n[t.SETTING_METADATA]=s.wrapTemplate(["<div>",i("Metadata is being auto-detected"),"</div>"],"dataset"),n[t.PAUSED]=s.wrapTemplate(["<div>",i('This job is paused. Use the "Resume Paused Jobs" in the history menu to resume'),"</div>"],"dataset"),n[t.ERROR]=s.wrapTemplate(["<% if( !dataset.purged ){ %>","<div><%- dataset.misc_blurb %></div>","<% } %>",'<span class="help-text">',i("An error occurred with this dataset"),":</span>",'<div class="job-error-text"><%- dataset.misc_info %></div>'],"dataset"),n[t.EMPTY]=s.wrapTemplate(["<div>",i("No data"),": <i><%- dataset.misc_blurb %></i></div>"],"dataset"),n.unknown=s.wrapTemplate(['<div>Error: unknown dataset state: "<%- dataset.state %>"</div>'],"dataset");var r={resubmitted:s.wrapTemplate(["<% if( model.resubmitted ){ %>",'<div class="resubmitted-msg infomessagesmall">',i("The job creating this dataset has been resubmitted"),"</div>","<% } %>"])},o=s.wrapTemplate(["<% _.each( apps, function( app ){ %>",'<div class="display-application">','<span class="display-application-location"><%- app.label %></span> ','<span class="display-application-links">',"<% _.each( app.links, function( link ){ %>",'<a target="<%- link.target %>" href="<%- link.href %>">',"<% print( _l( link.text ) ); %>","</a> ","<% }); %>","</span>","</div>","<% }); %>"],"apps");return _.extend({},d.prototype.templates,{warnings:e,details:a,noAccess:l,summaries:n,detailMessages:r,displayApplications:o})}(),{DatasetListItemView:l}});
//# sourceMappingURL=../../../maps/mvc/dataset/dataset-li.js.map
