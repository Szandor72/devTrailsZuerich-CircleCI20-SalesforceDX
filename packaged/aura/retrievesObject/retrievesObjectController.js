({
    onRetrieveButtonClick : function(component, event, helper) {
        var recordIdChange = $A.get("e.c:retrievesObjectEvent");
        var recordId = component.get("v.recordId");
        recordIdChange.setParam("recordId", recordId);
        recordIdChange.fire();
        
        if(component.get("v.showResultsOn")==="modal"){
            var modalBody;
            $A.createComponent("c:retrievesObjectResult", {
                											"isUserAdmin" : component.getReference("v.isUserAdmin"),
                                                            "recordId" : component.getReference("v.recordId")
                                                          },
                               function(retrieveResult, status) {
                                   if (status === "SUCCESS") {
                                       component.find('overlayService').showCustomModal({
                                           header: component.get("v.sObjectName"),
                                           body: retrieveResult, 
                                           showCloseButton: true,
                                           cssClass: "slds-modal_large",
                                           closeCallback: function() {
                                               //alert('You closed the alert!');
                                           }
                                       })
                                       
                                   }
                               });
            //var modal = component.find("modal");
            //modal.set("v.size", "large");
            //modal.set("v.active", true);
        } else {
            var evt = $A.get("e.force:navigateToURL");
            var componentName = component.getName();
            //hacky 
            var namespace = componentName.substring(0, componentName.indexOf("R"));
            if($A.util.isEmpty(namespace)){
                namespace = "c";
            }
            evt.setParams({
                url : "../"+namespace+"/lightningWorkbench.app?recordId=" + recordId
            });
            evt.fire();
        }
    },
    
    handleRadioClick : function(component, event, helper) {
        component.set("v.showResultsOn", event.getSource().get("v.value"));
    },
    
})