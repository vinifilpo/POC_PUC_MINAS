sap.ui
    .define(
        [ "jquery.sap.global", "sap/ui/core/mvc/Controller",
            "sap/ui/model/json/JSONModel",
            "sap/ui/core/routing/History", "sap/m/Popover",
            "sap/m/Button", "sap/m/MessageToast",
            "sap/m/MessageBox" ],
        function(jQuery, Controller, History, Popover, Button,
            JSONModel, MessageToast, MessageBox) {
          "use restrict";
          var history = {
            prevPaymentSelect : null,
            prevDiffDeliverySelect : null
          };
          return Controller
              .extend(
                  "opensap.relatorio.controller.Carrinho",
                  {
                    onInit : function() {
                    this.model=sap.ui.getCore().getModel("Model");
                      this._wizard = this
                          .byId("ShoppingCartWizard");
                      this._oNavContainer = this
                          .byId("wizardNavContainer");
                      this._oWizardContentPage = this
                          .byId("wizardContentPage");
                      this._oWizardReviewPage = sap.ui
                          .xmlfragment(
                              "opensap.relatorio.view.ReviewPage",
                              this);
                      
                      this._oNavContainer
                          .addPage(this._oWizardReviewPage);
                      this.model
                          .attachRequestCompleted(
                              null,
                              function() {
                                this.model
                                    .getData().d.results
                                    .splice(
                                        5,
                                        this.model
                                            .getData().d.results.length);
                                this.model
                                    .setProperty(
                                        "/selectedPayment",
                                        "Cartão de Crédito");
                                this.model
                                    .setProperty(
                                        "/selectedDeliveryMethod",
                                        "Entrega Normal");
                               this.model
                                    .setProperty(
                                        "/standardDeliveryPrice",
                                        "");
                               this.model
                                    .setProperty(
                                        "/expressDeliveryPrice",
                                        "");
                                this.model
                                    .setProperty(
                                        "/differentDeliveryAddress",
                                        false);
                                this.model
                                    .setProperty(
                                        "/CashOnDelivery",
                                        {});
                                this.model
                                    .setProperty(
                                        "/BillingAddress",
                                        {});
                                this.model
                                    .setProperty(
                                        "/CreditCard",
                                        {});
                                this
                                    .calcTotal();
                                this.model
                                    .updateBindings();
                              }.bind(this));
                      var aData = this.model.getData();
                      this.model.loadData(aData);
                      this.getView().setModel(this.model);
                    },
                    calcTotal : function() {
                      var data = this.model.getData().d.results;
                      if (data.length > 0) {
                        var total = data
                            .reduce(function(prev,
                                current) {
                              prev = parseFloat(prev.total)
                                  || prev;
                              return prev
                                  + parseFloat(current.total);
                            });

                        this.model.setProperty(
                            "/ProductsTotalPrice",
                            total.Preco || total);
                      } else {
                        this.model.setProperty(
                            "/ProductsTotalPrice",
                            0);
                      }
                    },

 sleep : function(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
  },

                    handleDelete : function(listItemBase) {

               var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
               var msg     = "Seu carrinho está vazio";
      var path = listItemBase.getParameter('listItem').getBindingContext().getPath();
      var idx = parseInt(path.substring(path.lastIndexOf('/') +1));

      var d = this.model.getData().d.results;
      d.splice(idx, 1);
                          this.calcTotal();
                          this.model.updateBindings();
          if ( d.length == "0" ) {
              MessageToast.show(msg);

              oRouter.navTo("master");
          }
                    },
                    goToPaymentStep : function() {
                      var selectedKey = this.model
                          .getProperty("/selectedPayment");
                      switch (selectedKey) {
                      case "Cartão de Crédito":
                        this
                            .byId("PaymentTypeStep")
                            .setNextStep(
                                this
                                    .getView()
                                    .byId(
                                        "CreditCardStep"));
                        break;
                      case "Boleto Banc�rio":
                        this
                            .byId("PaymentTypeStep")
                            .setNextStep(
                                this
                                    .getView()
                                    .byId(
                                        "BankAccountStep"));
                        break;
                      case "Cash on Delivery":
                      default:
                        this
                            .byId("PaymentTypeStep")
                            .setNextStep(
                                this
                                    .getView()
                                    .byId(
                                        "CashOnDeliveryStep"));
                        break;
                      }
                    },
                    setPaymentMethod : function() {
                      this
                          .setDiscardableProperty({
                            message : "Deseja alterar a forma de pagamento?",
                            discardStep : this
                                .byId("PaymentTypeStep"),
                            modelPath : "/selectedPayment",
                            historyPath : "prevPaymentSelect"
                          });
                    },
                    setDifferentDeliveryAddress : function() {
                      this
                          .setDiscardableProperty({
                            message : "Deseja alterar endere�o de entrega?",
                            discardStep : this
                                .byId("BillingStep"),
                            modelPath : "/differentDeliveryAddress",
                            historyPath : "prevDiffDeliverySelect"
                          });
                    },
                    setDiscardableProperty : function(
                        params) {
                      if (this._wizard.getProgressStep() !== params.discardStep) {
                        MessageBox
                            .warning(
                                params.message,
                                {
                                  actions : [
                                      MessageBox.Action.YES,
                                      MessageBox.Action.NO ],
                                  onClose : function(
                                      oAction) {
                                    if (oAction === MessageBox.Action.YES) {
                                      this._wizard
                                          .discardProgress(params.discardStep);
                                      history[params.historyPath] = this.model
                                          .getProperty(params.modelPath);
                                    } else {
                                      this.model
                                          .setProperty(
                                              params.modelPath,
                                              history[params.historyPath]);
                                    }
                                  }
                                      .bind(this)
                                });
                      } else {
                        history[params.historyPath] = this.model
                            .getProperty(params.modelPath);
                      }
                    },
                    billingAddressComplete : function() {
                      if (this.model
                          .getProperty("/differentDeliveryAddress")) {
                        this
                            .byId("BillingStep")
                            .setNextStep(
                                this
                                    .getView()
                                    .byId(
                                        "DeliveryAddressStep"));
                      } else {
                        this
                            .byId("BillingStep")
                            .setNextStep(
                                this
                                    .getView()
                                    .byId(
                                        "DeliveryTypeStep"));
                      }
                    },
                    handleWizardCancel : function() {
                      this
                          ._handleMessageBoxOpen(
                              "Deseja cancelar sua compra?",
                              "warning");
                    },
                    handleWizardSubmit : function() {

                        this._handleMessageBoxOk(
                              "Pedido criado com sucesso. Detalhes ser�o enviados para e-mail cadastrado.",
                              "success");
                      var selectedPayment = this.model.getProperty("/selectedPayment");
                      var cardName       = this.model.getProperty("/CreditCard/Name") || "";
                      var cardNumber     = this.model.getProperty("/CardNumber") || "";
                      var SecurityCode   = this.model.getProperty("/CreditCard/SecurityCode") || "";
                      var Expire         = this.model.getProperty("/CreditCard/Expire") || "";
                      var address        = this.model.getProperty("/BillingAddress/Address") || "";
                      var number         = this.model.getProperty("/BillingAddress/Number") || "";
                      var district       = this.model.getProperty("/BillingAddress/District") || "";
                      var city           = this.model.getProperty("/BillingAddress/City") || "";
                      var Region         = this.model.getProperty("/BillingAddress/Region") || "";
                      var zipCode        = this.model.getProperty("/BillingAddress/ZipCode")  || "";
                      var notes          = this.model.getProperty("/BillingAddress/Note") || "";
                      var differentAddress = this.model.getProperty("/differentDeliveryAddress")  || "";
                      var frete            = this.model.getProperty("/ProductsDeliveryFloat")  || "";
                      var installments  = this.model.getProperty("/installments")  || "";


                      var Produtos = "";
                      var data = this.model.getData().d.results;
                 for (var i = 0; i < data.length; i++) {
                  Produtos = Produtos + data[i].IdProduto + "-" + data[i].quantidade + ";";
                      }
var contactEntry2 = {
        Produtos : Produtos,
        Pagamento : selectedPayment,
        Nomecartao : cardName,
        Numerocartao : cardNumber,
        Codigoseguranca: SecurityCode,
        Validadecartao: "\/Date(1640995200000)\/",
        EnderecoFat: address,
        Cidade: city,
        Estado: Region,
        CepFat: zipCode,
        PaisFat: "BR",
        NotasFat: notes,
        BairroFat: district,
        NumeroFat: number,
        Frete: frete,
        Parcelas: installments
      };
      var sServiceUrl = "/sap/opu/odata/sap/zbr_compras_srv_01/"; // ODATA URL
    var oDModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
    //create an array of batch changes and save
    var batchChanges = [];
    batchChanges.push( oDModel.createBatchOperation("comprasSet", "POST", contactEntry2) );
    oDModel.addBatchChangeOperations(batchChanges);
    //submit changes and refresh the table and display message
    oDModel.submitBatch(function(data) {
        oDModel.refresh();
        sap.ui.commons.MessageBox.show(data.__batchResponses[0].__changeResponses.length +
            " contacts created", sap.ui.commons.MessageBox.Icon.SUCCESS,
            "Batch Save", sap.ui.commons.MessageBox.Action.OK);
    }, function(err) {
        alert("Error occurred ");
    });
                    },
                    backToWizardContent : function() {
                      this._oNavContainer
                          .backToPage(this._oWizardContentPage
                              .getId());
                    },
                    checkCreditCardStep : function() {
                      var cardName = this.model
                          .getProperty("/CreditCard/Name")
                          || "";
                      if (cardName.length < 3) {
                        this._wizard
                            .invalidateStep(this
                                .byId("CreditCardStep"));
                      } else {
                        this._wizard
                            .validateStep(this
                                .byId("CreditCardStep"));
                      }
                    },
                    checkCashOnDeliveryStep : function() {
                      var firstName = this.model
                          .getProperty("/CashOnDelivery/FirstName")
                          || "";
                      if (firstName.length < 3) {
                        this._wizard
                            .invalidateStep(this
                                .byId("CashOnDeliveryStep"));
                      } else {
                        this._wizard
                            .validateStep(this
                                .byId("CashOnDeliveryStep"));
                      }
                    },
                    checkBillingStep : function() {
                      var address = this.model
                          .getProperty("/BillingAddress/Address")
                          || "";
                      var city = this.model
                          .getProperty("/BillingAddress/City")
                          || "";
                      var zipCode = this.model
                          .getProperty("/BillingAddress/ZipCode")
                          || "";
                      var region = this.model
                          .getProperty("/BillingAddress/Region")
                          || "";
                      var number = this.model
                          .getProperty("/BillingAddress/Number")
                          || "";
                      var district = this.model
                          .getProperty("/BillingAddress/District")
                          || "";
                      if (address.length < 3
                          || city.length < 3
                          || zipCode.length < 8
                          || region.length < 2
                          || number.length < 1
                          || district.length < 3 ) {
                        this._wizard
                            .invalidateStep(this
                                .byId("BillingStep"));
                      } else {
                        this._wizard.validateStep(this
                            .byId("BillingStep"));
                      }
                    },
                    completedHandler : function() {

                    var standard   = this.model.getData().standardDeliveryFloat;
                    var express    = this.model.getData().expressDeliveryFloat;
                    var totalPrice = this.model.getData().ProductsTotalPrice;
                    var CardNumber = this.model.getData().CardNumber;

                    var selectedDeliveryMethod = this.model.getData().selectedDeliveryMethod;

                    var delivery = "";
                    var deliveryFloat = express;
                    var totalPriceCheck = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                    if (selectedDeliveryMethod == "Entrega Normal"){
                      delivery = standard.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                      deliveryFloat = standard;
                    }else{
                      delivery = express.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                      deliveryFloat = express;
                    }

                    var deliveryString = deliveryFloat.toString();

                    var totalPriceDelivery =  totalPrice + deliveryFloat;

                    if ( CardNumber != null ){

                    CardNumberCript = CardNumber.substring(11, 15);
                    }
                        this.model.setProperty(
                            "/ProductsTotalPriceDelivery",
                            totalPriceDelivery);


                           this.model.setProperty(
                            "/ProductsDelivery",
                            delivery);

                           this.model.setProperty(
                            "/ProductsDeliveryFloat",
                            deliveryString);

                          this.model.setProperty(
                            "/ProductsTotalPriceCheck",
                            totalPriceCheck);

                      if ( CardNumber != null ){
                          this.model.setProperty(
                            "/CardNumberCript",
                            CardNumberCript);
                       }

                      this._oNavContainer
                          .to(this._oWizardReviewPage);
                    },
                    _handleMessageBoxOpen : function(
                        sMessage, sMessageBoxType) {
                      MessageBox[sMessageBoxType]
                          (
                              sMessage,
                              {
                                actions : [
                                    MessageBox.Action.YES,
                                    MessageBox.Action.NO ],
                                onClose : function(
                                    oAction) {
                                  if (oAction === MessageBox.Action.YES) {
                                    this._wizard
                                        .discardProgress(this._wizard
                                            .getSteps()[0]);
                                    this
                                        ._navBackToList();
                                  }
                                }.bind(this)
                              });
                    },
_handleMessageBoxOk : function(
                        sMessage, sMessageBoxType) {
                      MessageBox[sMessageBoxType]
                          (
                              sMessage,
                              {
                                actions : [
                                    MessageBox.Action.OK ],
                                onClose : function(
                                    oAction) {
                                  if (oAction === MessageBox.Action.OK) {
                                    this._wizard
                                        .discardProgress(this._wizard
                                            .getSteps()[0]);
                                    this
                                        ._navBackToList();
                                  }
                                }.bind(this)
                              });
                    },
                    _navBackToList : function() {
                      this._navBackToStep(this
                          .byId("ContentsStep"));
                    },
                    _navBackToPaymentType : function() {
                      this._navBackToStep(this
                          .byId("PaymentTypeStep"));
                    },
                    _navBackToCreditCard : function() {
                      this._navBackToStep(this
                          .byId("CreditCardStep"));
                    },
                    _navBackToCashOnDelivery : function() {
                      this
                          ._navBackToStep(this
                              .byId("CashOnDeliveryStep"));
                    },
                    _navBackToBillingAddress : function() {
                      this._navBackToStep(this
                          .byId("BillingStep"));
                    },
                    _navBackToDeliveryType : function() {
                      this._navBackToStep(this
                          .byId("DeliveryTypeStep"));
                    },
                    _navBackToStep : function(step) {
                      var fnAfterNavigate = function() {
                        this._wizard.goToStep(step);
                        this._oNavContainer
                            .detachAfterNavigate(fnAfterNavigate);
                      }.bind(this);
                      this._oNavContainer
                          .attachAfterNavigate(fnAfterNavigate);
                      this._oNavContainer
                          .to(this._oWizardContentPage);
                    },
        onSelectedInstallments : function(oEvent) {
          var oText = oEvent.getParameter("selectedItem").getText();
          var key   = oEvent.getParameter("selectedItem").getKey();

           this.model.setProperty(
               "/installments",
               key );

           this.model.setProperty(
               "/installmentsText",
               oText );

        },
                    onExit : function() {
                      this._oMockServer.stop();
                    },
                    onCalculateDelivery : function(oEvent) {

                    var oModel = new sap.ui.model.json.JSONModel();


                  var cep = this.model.getData().BillingAddress.ZipCode;

                      var data = this.model.getData().d.results;
                      var Peso = "";
                      var pesoAux = "";
                      if (data.length > 0) {
                      for (var i = 0; i < data.length; i++) {

                       if ( i == 0 ){
                        Peso = parseFloat(data[i].Peso);
                       }else{
                        Peso = parseFloat(Peso) + parseFloat(data[i].Peso);
                       }





                      }

                      }



                   var sURL = "/sap/opu/odata/SAP/ZBR_FRETES_SRV/freteSet(Cep='"+cep+"',Peso="+Peso+"m)?$format=json";

                    oModel.loadData(sURL,null,false,null,null,null,null);

                      var freteRapida = parseFloat(oModel.getData().d.FreteRapida);
                      var freteNormal = parseFloat(oModel.getData().d.FreteNormal);

                      var rapido = freteRapida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                      var normal = freteNormal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                      var address  = oModel.getData().d.Rua;
                      var district = oModel.getData().d.Bairro;
                      var city     = oModel.getData().d.Cidade;
                      var region   = oModel.getData().d.Estado;

                      this.model.setProperty(
                               "/BillingAddress/Address",
                                address );

                      this.model.setProperty(
                              "/BillingAddress/District",
                              district );

                      this.model.setProperty(
                              "/BillingAddress/City",
                              city );

                      this.model.setProperty(
                              "/BillingAddress/Region",
                              region );

                               this.model.setProperty(
                                        "/standardDeliveryFloat",
                                        freteNormal );

                                   this.model.setProperty(
                                        "/expressDeliveryFloat",
                                        freteRapida );

                               this.model.setProperty(
                                        "/standardDeliveryPrice",
                                        normal );

                                   this.model.setProperty(
                                        "/expressDeliveryPrice",
                                        rapido );

                               this.model.setProperty(
                                        "/typeStandard",
                                        "Entrega Normal( Até 15 dias úteis )");

                                   this.model.setProperty(
                                        "/typeExpress",
                                        "Entrega Rápida( At� 3 dias úteis )");



                    },

           onQuantityChanged : function(oEvent) {
             var oInputField = oEvent.getSource();
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
             var quantidade      = oEvent.getSource().getBindingContext().getProperty("quantidade");
             var Peso            = oEvent.getSource().getBindingContext().getProperty("Peso");

             var total           = Preco * quantidade;
      if (isNaN(quantidade) || quantidade % 1 !== 0 || quantidade < 0) {
        oInputField.setValueState("Error");
        return;
      }
      oInputField.setValueState();
var aData={
        "__metadata" : {
          "id" : "http://vhcala4hci.wdf.sap.corp:50000/sap/opu/odata/SAP/ZBR_PRODUTOS_SRV/produtosSet('1')",
          "uri" : "http://vhcala4hci.wdf.sap.corp:50000/sap/opu/odata/SAP/ZBR_PRODUTOS_SRV/produtosSet('1')",
          "type" : "ZBR_PRODUTOS_SRV.produtos"
        },
        "IdProduto" : IdProduto,
        "Index" : Index,
        "Produto" : Produto,
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
    ;
    var path = oEvent.getSource().getBindingContext().getPath();
      var idx = parseInt(path.substring(path.lastIndexOf('/') +1));
   //   var m = this.getModel();
      var d = this.model.getData().d.results;
      d.splice(idx, 1,aData);
     // this.model.setData(d);
                          this.calcTotal();
                          this.model.updateBindings();
                    },
                    onAddToCartPressed : function() {
                      this.model=sap.ui.getCore().getModel("Model");
                      var aData = this.model.getData();
              aData.d.results.unshift({
                          "IdProduto": IdProduto,
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
                          "Peso"   : Peso
              });
                      this.model.loadData(aData);
                      this.getView().setModel(this.model);
                    }
                  });
        });