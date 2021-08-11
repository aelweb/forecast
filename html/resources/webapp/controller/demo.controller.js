sap.ui.define([
	"forecast/html/base/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("forecast.html.controller.demo", {
		onInit: function() {
			this.getRouter().attachRouteMatched(this.handleRouteMatched, this);
		},
		handleRouteMatched: function(oEvent) {
			this.getView().getModel("config").setProperty("/enableSelectAlgorithm", true);
		},
		onSelectionChangeAlgorithm: function(oEvent) {
			var defaultConfig = this.getView().getModel("default").getData();

			var selectedKey = oEvent.getParameters().selectedItem.getKey();
			var item = defaultConfig.algorithms.items.filter(function(e) {
				return e.key === selectedKey;
			})[0];
			this.disableDatasetSelectItems(item.library);

			this.getView().getModel("config").setProperty("/selectedAlgorithmKey", selectedKey);
			this.getView().getModel("config").setProperty("/enableSelectDataset", true);
			this.getView().getModel("config").setProperty("/algorithm", item);
		},
		onSelectionChangeDataset: function(oEvent) {
			var defaultConfig = this.getView().getModel("default").getData();
			var config = this.getView().getModel("config").getData();

			var selectedKey = oEvent.getParameters().selectedItem.getKey();
			var item = defaultConfig.datasets.items.filter(function(e) {
				return e.key === selectedKey;
			})[0];

			var algorithm = config.algorithm;
			var idODataService = algorithm.library + "_" + item.key;
			this.setVizParams(idODataService, true);
			this.getView().getModel("config").setProperty("/selectedDatasetKey", selectedKey);
			this.getView().getModel("config").setProperty("/dataset", item);
			this.getView().getModel("config").setProperty("/enableNext", true);
		},
		onPressPopover: function(oEvent) {
			var defaultConfig = this.getView().getModel("default").getData();
			var id = oEvent.getSource().data("id");
			var dataset = defaultConfig.selected.dataset.key;
			var library = defaultConfig.selected.algorithm.library;
			if (!this.oPopoverExtraPredictor) {
				this.oPopoverExtraPredictor = sap.ui.xmlfragment("forecast.html.fragment.data." + dataset, this);
				this.getView().addDependent(this.oPopoverExtraPredictor);
			}
			this.oPopoverExtraPredictor.bindElement("odata>/" + library + "_" + dataset + "('" + this.formatter.formatNumberOrDate(id) + "')");
			this.oPopoverExtraPredictor.openBy(oEvent.getSource());
		}
	});
});
