sap.ui.define([
	"forecast/html/base/algorithms/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("forecast.html.controller.algorithms.apl.forecast", {
		forcedSelectedAlgorithm: "forecast",
		onTableSelectionChange: function(oEvent) {
			var rowContext = oEvent.getParameters().rowContext;
			if (!rowContext) {
				rowContext = oEvent.getParameters().rowBindingContext;
			}
			var signalTime = rowContext.getProperty("signal_time");
			this.getView().getModel("payload").setProperty("/LASTTRAININGTIMEPOINT", signalTime);
			this.getView().getModel("payload").setProperty("/hasDate", true);
			this.getView().byId("tab").setSelectedKey("params");
		},
		onPressExecute: function(oEvent) {
			var payload = this.getView().getModel("payload").getData();
			var lastTrainingTimePoint = payload.LASTTRAININGTIMEPOINT;
			if (!lastTrainingTimePoint) {
				this.ajaxCallCompleted("Error", "Please select an entry from the dataset as your last training time point.");
				return;
			}
			Controller.prototype.onPressExecute.apply(this, oEvent);
		}
	});
});
