sap.ui.define([
               "sap/ui/core/mvc/Controller"
               ], function (Controller, JSONModel) {
  "use restrict";
  return Controller.extend("opensap.relatorio.controller.Master",{
  onInit: function () {
      var oModel, oView;
      jQuery.sap.require("sap.ui.core.util.MockServer");
      var oMockServer = new sap.ui.core.util.MockServer({
        rootUri: "sapuicompsmarttable2/"
      });

      var sURL;

      sURL = "/sap/opu/odata/sap/zbrr_relatorio_vendas_srv";

      oModel = new sap.ui.model.odata.v2.ODataModel(sURL, {
        json: true
      });

      oView = this.getView();

      oView.setModel(oModel);
  },
  onPress: function(oEvent)
  {
  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
  oRouter.navTo("second");
  }
  });
});