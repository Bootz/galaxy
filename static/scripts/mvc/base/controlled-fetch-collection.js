"use strict";define(["libs/underscore","libs/backbone","mvc/base-mvc"],function(t,e,i){var r=e.Collection.extend({initialize:function(t,i){e.Collection.prototype.initialize.call(this,t,i),this.setOrder(i.order||this.order,{silent:!0})},_setUpListeners:function(){return this.on({"changed-order":this.sort})},fetch:function(t){return t=this._buildFetchOptions(t),Galaxy.debug("fetch options:",t),e.Collection.prototype.fetch.call(this,t)},_buildFetchOptions:function(e){var i=this;(e=t.clone(e)||{}).traditional=!0,e.data=e.data||i._buildFetchData(e),Galaxy.debug("data:",e.data);var r=this._buildFetchFilters(e);return Galaxy.debug("filters:",r),t.isEmpty(r)||t.extend(e.data,this._fetchFiltersToAjaxData(r)),Galaxy.debug("data:",e.data),e},_buildFetchData:function(e){var i={};return this.order&&(i.order=this.order),t.defaults(t.pick(e,this._fetchParams),i)},_fetchParams:["order","limit","offset","view","keys"],_buildFetchFilters:function(e){return t.clone(e.filters||{})},_fetchFiltersToAjaxData:function(e){var i={q:[],qv:[]};return t.each(e,function(t,e){void 0!==t&&""!==t&&(!0===t&&(t="True"),!1===t&&(t="False"),null===t&&(t="None"),i.q.push(e),i.qv.push(t))}),i},reset:function(t,i){return this.allFetched=!1,e.Collection.prototype.reset.call(this,t,i)},order:null,comparators:{update_time:i.buildComparator("update_time",{ascending:!1}),"update_time-asc":i.buildComparator("update_time",{ascending:!0}),create_time:i.buildComparator("create_time",{ascending:!1}),"create_time-asc":i.buildComparator("create_time",{ascending:!0})},setOrder:function(e,i){i=i||{};var r=this,n=r.comparators[e];if(t.isUndefined(n))throw new Error("unknown order: "+e);if(n!==r.comparator)return r.order=e,r.comparator=n,i.silent||r.trigger("changed-order",i),r}}),n=r.extend({limitPerPage:500,initialize:function(t,e){r.prototype.initialize.call(this,t,e),this.currentPage=e.currentPage||0},getTotalItemCount:function(){return this.length},shouldPaginate:function(){return this.getTotalItemCount()>=this.limitPerPage},getLastPage:function(){return Math.floor(this.getTotalItemCount()/this.limitPerPage)},getPageCount:function(){return this.getLastPage()+1},getPageLimitOffset:function(t){return t=this.constrainPageNum(t),{limit:this.limitPerPage,offset:t*this.limitPerPage}},constrainPageNum:function(t){return Math.max(0,Math.min(t,this.getLastPage()))},fetchPage:function(e,i){var r=this;return e=r.constrainPageNum(e),r.currentPage=e,i=t.defaults(i||{},r.getPageLimitOffset(e)),r.trigger("fetching-more"),r.fetch(i).always(function(){r.trigger("fetching-more-done")})},fetchCurrentPage:function(t){return this.fetchPage(this.currentPage,t)},fetchPrevPage:function(t){return this.fetchPage(this.currentPage-1,t)},fetchNextPage:function(t){return this.fetchPage(this.currentPage+1,t)}}),a=r.extend({limitOnFirstFetch:null,limitPerFetch:100,initialize:function(t,e){r.prototype.initialize.call(this,t,e),this.limitOnFirstFetch=e.limitOnFirstFetch||this.limitOnFirstFetch,this.limitPerFetch=e.limitPerFetch||this.limitPerFetch,this.allFetched=!1,this.lastFetched=e.lastFetched||0},_buildFetchOptions:function(t){return t.remove=t.remove||!1,r.prototype._buildFetchOptions.call(this,t)},fetchFirst:function(e){return Galaxy.debug("ControlledFetchCollection.fetchFirst:",e),e=e?t.clone(e):{},this.allFetched=!1,this.lastFetched=0,this.fetchMore(t.defaults(e,{reset:!0,limit:this.limitOnFirstFetch}))},fetchMore:function(e){Galaxy.debug("ControlledFetchCollection.fetchMore:",e),e=t.clone(e||{});var i=this;if(Galaxy.debug("fetchMore, options.reset:",e.reset),!e.reset&&i.allFetched)return jQuery.when();e.reset?e.offset=0:void 0===e.offset&&(e.offset=i.lastFetched);var r=e.limit=e.limit||i.limitPerFetch||null;return Galaxy.debug("fetchMore, limit:",r,"offset:",e.offset),i.trigger("fetching-more"),i.fetch(e).always(function(){i.trigger("fetching-more-done")}).done(function(e){var n=t.isArray(e)?e.length:0;i.lastFetched+=n,Galaxy.debug("fetchMore, lastFetched:",i.lastFetched),(!r||n<r)&&(i.allFetched=!0,i.trigger("all-fetched",this))})},fetchAll:function(e){e=e||{};var i=this;return e=t.pick(e,"silent"),e.filters={},i.fetch(e).done(function(){i.allFetched=!0,i.trigger("all-fetched",i)})}});return{ControlledFetchCollection:r,PaginatedCollection:n,InfinitelyScrollingCollection:a}});
//# sourceMappingURL=../../../maps/mvc/base/controlled-fetch-collection.js.map
