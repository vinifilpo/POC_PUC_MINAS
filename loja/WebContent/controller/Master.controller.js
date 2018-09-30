sap.ui.define([
          "jquery.sap.global",
        "./Formatter",
                "sap/ui/core/mvc/Controller",
            "sap/ui/model/json/JSONModel",
            "sap/ui/model/Filter",
            "sap/ui/model/FilterOperator",
            "sap/m/MessageToast"],
    function(jQuery, Formatter, Controller, JSONModel, Filter, FilterOperator, MessageToast) {
      "use restrict";
      return Controller.extend("opensap.relatorio.controller.Master", {

        onInit : function() {


          // set explored app's demo model on this sample
            var oModel = new sap.ui.model.json.JSONModel();

              var sURL;

              sURL = "/sap/opu/odata/SAP/ZBR_PRODUTOS_SRV/produtosSet?$format=json";

              oModel.loadData(sURL);

          this.getView().setModel(oModel);


          // // add smart filter bar sub view to page
          this._oSmartFilterBar = this.byId("smartFilterBar");
          this._oCustomFilter = this.byId("averageRatingComboBox");
          if (!sap.ushell.Container) {

          }
        },
        onPress : function(oEvent) {
          var sIndex = oEvent.getSource().getBindingContext().getProperty("Index");
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("second",{Index: sIndex});
        },
        onFilterInvoices : function(oEvent) {

          // build filter array
          var aFilter = [];
          var sQuery = oEvent.getParameter("query");
          if (sQuery) {
            aFilter.push(new Filter("Produto",
                FilterOperator.Contains, sQuery));
          }

          // filter binding
          var oList = this.getView().byId("invoiceList");
          var oBinding = oList.getBinding("items");
          oBinding.filter(aFilter);
        },

        onChange : function(oEvent) {
          var oValue = oEvent.getParameter("selectedItem").getText();

          var aFilters = [];
          if (oValue && oValue.length > 0) {
            var filter = new sap.ui.model.Filter("Categoria",
                sap.ui.model.FilterOperator.EQ, oValue);
            aFilters.push(filter);
          }
          // update list binding
          var list = this.getView().byId("invoiceList");
          var binding = list.getBinding("items");
          binding.filter(aFilters, "Application");
        },
        onCartPress : function(oEvent) {
               var oModel;
               var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
               var msg     = "Seu carrinho est� vazio";


          oModel=sap.ui.getCore().getModel("Model");

          var oData = oModel.getData().d.results;

          if ( oModel == null || oData.length == "0" ) {
           MessageToast.show(msg);
          }else{
              oRouter.navTo("carrinho");
          }
        },
        onAddToCartPressed : function(oEvent) {

             var IdProduto       = oEvent.getSource().getBindingContext().getProperty("IdProduto");
             var Index           = oEvent.getSource().getBindingContext().getProperty("Index");
             var Produto         = oEvent.getSource().getBindingContext().getProperty("Produto");
             var Fabricante      = oEvent.getSource().getBindingContext().getProperty("Fabricante");
             var Categoria       = oEvent.getSource().getBindingContext().getProperty("Categoria");
             var IdFornecedor    = oEvent.getSource().getBindingContext().getProperty("IdFornecedor");
             var Fornecedor      = oEvent.getSource().getBindingContext().getProperty("Fornecedor");
             var ValorFornecedor = oEvent.getSource().getBindingContext().getProperty("ValorFornecedor");
             var Status          = oEvent.getSource().getBindingContext().getProperty("Status");
             var Descricao       = oEvent.getSource().getBindingContext().getProperty("Descricao");
             var Avaliacao       = oEvent.getSource().getBindingContext().getProperty("Avaliacao");
             var Preco           = oEvent.getSource().getBindingContext().getProperty("Preco");
             var imagem1         = oEvent.getSource().getBindingContext().getProperty("imagem1");
             var imagem2         = oEvent.getSource().getBindingContext().getProperty("imagem2");
             var imagem3         = oEvent.getSource().getBindingContext().getProperty("imagem3");
             var imagem4         = oEvent.getSource().getBindingContext().getProperty("imagem4");
             var Detalhe         = oEvent.getSource().getBindingContext().getProperty("Detalhe");
             var Garantia        = oEvent.getSource().getBindingContext().getProperty("Garantia");
             var Peso            = oEvent.getSource().getBindingContext().getProperty("Peso");
             var quantidade      = 1;
             var total           = Preco;

             var msg = msg = Produto + " " + "adicionado ao carrinho";

            var aData={"d" :{
    "results" : [
      {
        "__metadata" : {
          "id" : "http://vhcala4hci.wdf.sap.corp:50000/sap/opu/odata/SAP/ZBR_PRODUTOS_SRV/produtosSet('1')",
          "uri" : "http://vhcala4hci.wdf.sap.corp:50000/sap/opu/odata/SAP/ZBR_PRODUTOS_SRV/produtosSet('1')",
          "type" : "ZBR_PRODUTOS_SRV.produtos"
        },
        "IdProduto" : IdProduto,
        "Garantia" : Garantia,
        "Index" : Index,
        "Produto" : Fabricante,
        "Fabricante" : Fabricante,
        "Categoria" : Categoria,
        "IdFornecedor" : IdFornecedor,
        "Fornecedor" : Fornecedor,
        "ValorFornecedor" : ValorFornecedor,
        "Status" : Status,
        "Descricao" : Descricao,
        "Avaliacao" : Avaliacao,
        "Preco" : Preco,
        "imagem1" : imagem1,
        "imagem2" : imagem2,
        "imagem3" : imagem3,
        "imagem4" : imagem4,
        "Detalhe" : Detalhe,
        "quantidade" : quantidade,
        "total" : total,
        "Peso"  : Peso
       }
    ]
  }};
          var oModel;

          oModel=sap.ui.getCore().getModel("Model");


          if ( oModel == null ) {
              oModel=new sap.ui.model.json.JSONModel();

              oModel.setData(aData);

              sap.ui.getCore().setModel(oModel,"Model");
              MessageToast.show(msg);
              return;
          };

              var data = oModel.getData().d.results;

                      if (data.length >= 1) {


                      for (var i = 0; i < data.length; i++) {
                        if (data[i].IdProduto === IdProduto ) {
                         data[i].quantidade = data[i].quantidade + 1;
                         data[i].total  = data[i].Preco * data[i].quantidade;

                          oModel.updateBindings();

                          sap.ui.getCore().setModel(oModel,"Model");
                          MessageToast.show(msg);
                          return;
                          break;

                        }
                      }
                     }else{
                      oModel.setData(aData);

                      sap.ui.getCore().setModel(oModel,"Model");
                      MessageToast.show(msg);
                      return;
                     }

             var oData = oModel.getData();
              oData.d.results.unshift({
                          "IdProduto": IdProduto,
                          "Garantia": Garantia,
                          "Index": Index,
                          "Produto": Produto,
                          "Fabricante": Fabricante,
                          "Categoria": Categoria,
                          "IdFornecedor": IdFornecedor,
                          "Fornecedor": Fornecedor,
                          "ValorFornecedor": ValorFornecedor,
                          "Status": Status,
                          "Descricao": Descricao,
                          "Avaliacao": Avaliacao,
                          "Preco": Preco,
                          "imagem1": imagem1,
                          "imagem2": imagem2,
                          "imagem3": imagem3,
                          "imagem4": imagem4,
                          "Detalhe": Detalhe,
                          "quantidade" : quantidade,
                          "total" : total,
                          "Peso"  : Peso
              });

              sap.ui.getCore().setModel(oModel,"Model");


          MessageToast.show(msg);

        }
      });
    });