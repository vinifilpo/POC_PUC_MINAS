sap.ui.define([
               "sap/ui/core/mvc/Controller"
               ], function (Controller, JSONModel) {
  "use restrict";
  return Controller.extend("opensap.relatorio.controller.Master",{
  onInit: function () {
//      1.Get the id of the VizFrame
    var oVizFrame = this.getView().byId("idcolumn");

      var oModel = new sap.ui.model.json.JSONModel();

      var sURL;

      sURL = "/sap/opu/odata/sap/zbrr_rentab_regio_srv/regiaoSet?$format=json";

      oModel.loadData(sURL);

//      3. Create Viz dataset to feed to the data to the graph
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
      dimensions : [{
        name : 'Regiao',
        value : "{Regiao}"}],
                     
      measures : [{
        name : 'Lucro',
        value : '{Lucro}'} ],
                   
      data : {
        path : "/d/results"
      }
    });
    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);
    oVizFrame.setVizType('column');//Donut 

//      4.Set Viz properties
    oVizFrame.setVizProperties({
            plotArea: {
              colorPalette : d3.scale.category20().range()
                }});

    var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
          'uid': "valueAxis",
          'type': "Measure",
          'values': ["Lucro"]
        }), 
        feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
          'uid': "categoryAxis",
          'type': "Dimension",
          'values': ["Regiao"]
        });
    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);

// Categorias
      var oVizFrame2 = this.getView().byId("idcolumn2");

      var oModel2 = new sap.ui.model.json.JSONModel();

      var sURL2;

      sURL2 = "/sap/opu/odata/sap/zbrr_rentab_categ_srv/categoriaSet?$format=json";

      oModel2.loadData(sURL2);




//      3. Create Viz dataset to feed to the data to the graph
    var oDataset2 = new sap.viz.ui5.data.FlattenedDataset({
      dimensions : [{
        name : 'Categoria',
        value : "{Categoria}"}],
                     
      measures : [{
        name : 'Lucro',
        value : '{Lucro}'} ],
                   
      data : {
        path : "/d/results"
      }
    });
    oVizFrame2.setDataset(oDataset2);
    oVizFrame2.setModel(oModel2);
    oVizFrame2.setVizType('column');//Donut 

//      4.Set Viz properties
    oVizFrame2.setVizProperties({
            plotArea: {
              colorPalette : d3.scale.category20().range()
                }});

    var feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
          'uid': "valueAxis",
          'type': "Measure",
          'values': ["Lucro"]
        }), 
        feedCategoryAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
          'uid': "categoryAxis",
          'type': "Dimension",
          'values': ["Categoria"]
        });
    oVizFrame2.addFeed(feedValueAxis2);
    oVizFrame2.addFeed(feedCategoryAxis2);
  },
  onPress: function(oEvent)
  {
  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
  oRouter.navTo("second");
  }
  });
});