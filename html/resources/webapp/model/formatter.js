sap.ui.define([], function() {
	"use strict";
	var isNumeric = function(oValue) {
		var tmp = oValue && oValue.toString();
		return !jQuery.isArray(oValue) && (tmp - parseFloat(tmp) + 1) >= 0;
	};
	return {
		formatNumberOrDate: function(value) {
			if (value) {
				if (!isNumeric(value)) {
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd hh:mm:ss"
					});
					return oDateFormat.format(new Date(value));
				} else {
					return value;
				}
			} else {
				return value;
			}
		},
		formatNumber: function(value) {
			var result = "";
			if (value !== "undefined" && isNumeric(value)) {
				result = Number(value).toFixed(2);
			}
			return result;
		},
		formatPercent: function(value) {
			var result = "";
			if (value !== "undefined" && isNumeric(value)) {
				result = Number(value * 100).toFixed(2) + "%";
			}
			return result;
		},
		isNumeric: isNumeric
	};
});
