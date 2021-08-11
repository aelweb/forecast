sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"forecast/html/model/formatter"
], function(Controller, History, Filter, FilterOperator, MessageBox, formatter) {
	"use strict";
	return Controller.extend("forecast.html.base.controller", {
		formatter: formatter,
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onPressNext: function() {
			var config = this.getView().getModel("config").getData();
			var to = config.selectedAlgorithmKey;
			if (to) {
				this.getRouter().navTo(to);
			}
		},
		onNavHome: function() {
			this.getRouter().navTo("home");
		},
		disableDatasetSelectItems: function(library) {
			var defaultConfig = this.getView().getModel("default").getData();
			var datasets = defaultConfig.datasets.list;
			var items = [];
			for (var i = 0; i < datasets.length; i++) {
				if (datasets[i].libraries) {
					for (var j = 0; j < datasets[i].libraries.length; j++) {
						if (datasets[i].libraries[j].key === library) {
							items.push(datasets[i]);
						}
					}
				}
			}
			this.getView().getModel("default").setProperty("/datasets/items", items);
		},
		setVizParams: function(idODataService, filterNullValue) {
			var oTable = this.getView().byId("table");
			if (oTable) {
				var oTableSettings = oTable.getRowSettingsTemplate();
				var oSorter = new sap.ui.model.Sorter({
					path: "signal_time",
					descending: true
				});
				var filters = [];
				if (filterNullValue) {
					filters.push(new Filter("signal_value", FilterOperator.NE, null));
				}
				oTable.bindAggregation("rows", {
					path: "odata>/" + idODataService,
					sorter: oSorter,
					filters: filters
				});
				oTable.setRowSettingsTemplate(oTableSettings);
			}
			var oVizFlattenDataSet = this.getView().byId("viz_ds");
			if (oVizFlattenDataSet) {
				oVizFlattenDataSet.bindData("odata>/" + idODataService);
			}
			this.setVizProperties("viz_frame", "popover");
		},
		setVizProperties: function(idVizFrame, idPopover) {
			var defaultConfig = this.getView().getModel("default").getData();
			var oVizFrame = this.getView().byId(idVizFrame);
			if (oVizFrame) {
				var oPopOver = this.getView().byId(idPopover);
				oPopOver.connect(oVizFrame.getVizUid());
				var vizProperties = defaultConfig.vizProperties;
				oVizFrame.setVizProperties(vizProperties);
			}
		}
	});
});
