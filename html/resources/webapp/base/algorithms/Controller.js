sap.ui.define([
	"forecast/html/base/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";
	return Controller.extend("forecast.html.base.algorithms.controller", {
		onInit: function() {
			this.getRouter().getRoute(this.forcedSelectedAlgorithm).attachPatternMatched(this.handleRouteMatched, this);
		},
		handleRouteMatched: function(oEvent) {
			this.getView().setModel(new sap.ui.model.json.JSONModel(), "algorithm");
			this.getView().setModel(new sap.ui.model.json.JSONModel(), "payload");
			this.getView().setModel(new sap.ui.model.json.JSONModel(), "results");

			var defaultConfig = this.getView().getModel("default").getData();
			var config = this.getView().getModel("config").getData();

			var forcedSelectedAlgorithm = this.forcedSelectedAlgorithm;

			this.getView().getModel("config").setProperty("/enableSelectAlgorithm", false);
			this.getView().getModel("config").setProperty("/selectedAlgorithmKey", forcedSelectedAlgorithm);

			var algorithm = defaultConfig.algorithms.items.filter(function(e) {
				return e.key === forcedSelectedAlgorithm;
			})[0];
			this.getView().getModel("config").setProperty("/algorithm", algorithm);

			this.disableDatasetSelectItems(algorithm.library);

			if (config.selectedDatasetKey) {
				var dataset = defaultConfig.datasets.items.filter(function(e) {
					return e.key === config.selectedDatasetKey;
				})[0];
				this.getView().getModel("config").setProperty("/dataset", dataset);

				var vizODataKey = algorithm.library + "_" + dataset.key;
				this.setVizParams(vizODataKey, true);

				var payloadKey = algorithm.library + "_" + algorithm.key;
				var algorithmConfig = this.getView().getModel(payloadKey).getData();

				this.getView().getModel("algorithm").setData(algorithmConfig);
				this.getView().getModel("payload").setData(algorithmConfig.default_payload);
			}
		},
		ajaxCallCompleted: function(status, message) {
			MessageBox.show(message, {
				title: status
			});
			this.oBusyIndicator.close();
		},
		onPressExecute: function(oEvent) {
			var oController = this;
			var results = oController.getView().getModel("results");

			oController.oBusyIndicator = new sap.m.BusyDialog();
			oController.oBusyIndicator.open();

			var payload = this.getView().getModel("payload").getData();
			var service = this.getView().getModel("algorithm").getData().service;

			payload.DATASETNAME = this.getView().getModel("config").getProperty("/selectedDatasetKey");

			var ajaxSuccess = function(response, status) {
				oController.ajaxCallCompleted(status, response.message);
				results.setProperty("/hasResult", true);
				results.setProperty("/tables", response.results);

				oController.getView().byId("tab").setSelectedKey("result");
				oController.setVizProperties("result_viz_frame", "result_popover");
			};
			var ajaxError = function(xhr, status, error) {
				var msg = error;
				if (error.message) {
					msg = error.message;
				}
				oController.getView().setModel(new sap.ui.model.json.JSONModel(), "results");
				oController.ajaxCallCompleted(status, msg);
			};
			$.ajax({
				method: service.method,
				url: service.url,
				async: true,
				timeout: 3000000,
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				},
				data: JSON.stringify(payload),
				success: ajaxSuccess,
				error: ajaxError
			});
		}
	});
});
