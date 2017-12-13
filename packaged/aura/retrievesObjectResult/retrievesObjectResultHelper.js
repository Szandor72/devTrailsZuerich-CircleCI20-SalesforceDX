({
    retrieveSObjectById: function(component) {
        component.set("v.waiting", true);
        var action = component.get("c.retrieveSObject");
        var self = this;
        action.setParam("recordId", component.get("v.recordId"));
        action.setCallback(self, handleActionResponse);
        $A.enqueueAction(action);

        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function(a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

        function handleActionResponse(response) {
            var state = response.getState();
            var result = response.getReturnValue();

            if (component.isValid()) {
                if (state === "SUCCESS") {
                    if (result.isSuccess) {
                        //TODO label
                        try {
                            component.set('v.sObjectName', result.values.sObjectName);
                            component.set('v.lastModifiedBy', result.values.lastModifiedBy);
                            component.set('v.lastModifiedDate', result.values.lastModifiedDate);
                            component.set('v.isUserAdmin', result.values.isUserAdmin);
                            var fieldsObject = JSON.parse(result.values.fields);
                            var fields = [];
                            for (var fieldName in fieldsObject) {
                                var field = {}
                                field.name = fieldName;
                                field.properties = fieldsObject[fieldName];
                                fields.push(field);
                            }
                            fields.sort(dynamicSort("name"));
                            component.set('v.fields', fields);
                            component.message = "Retrieved successfully: " + result.message;
                            component.type = "success";
                        } catch (ex) {
                            component.message = "Script Exception: " + ex.message;
                            component.type = "error"
                        }
                    } else {
                        component.message = result.message;
                        component.type = "error";
                    }
                } else {
                    var errors = response.getError();
                    component.message = "A server-related Error occured. Please try again.\n Technical stuff: " + JSON.stringify(errors);
                    component.type = "error";
                    component.set("v.waiting", false);
                    component.set("v.recordId", "");
                }
                component.set("v.waiting", false);
            }
            
            this.showToast(component);
        }
    },

    doSave : function(component) {
        component.set("v.waiting", true);
        var action = component.get("c.updatesObject");
        var self = this;
        action.setParams({
            "recordId" : component.get("v.recordId"),
            "sObjectName" : component.get("v.sObjectName"),
            "fieldsJSON" : JSON.stringify(component.get("v.fields"))
        });
        action.setCallback(self, handleActionResponse);
        $A.enqueueAction(action);

        function handleActionResponse(response){
            var state = response.getState();
            var result = response.getReturnValue();
            
            if (state === "SUCCESS") {
                if (result.isSuccess) {
                    component.message = "Saved successfully: " + component.get("v.sObjectName");
                    component.type = "success";
                    component.set("v.inEditMode", false);
                    component.set("v.searchTerm","");
                    var refresh = $A.get("e.force:refreshView");
                    if(!$A.util.isEmpty(refresh)) {
                        refresh.fire();
                    }

                } else {
                    component.message = result.message;
                    component.type = "error";
                }
            } else {
                var errors = response.getError();
                component.message = "A server-related Error occured. Please try again.\n Technical stuff: " + JSON.stringify(errors);
                component.type = "error";
                component.set("v.waiting", false);
               // component.set("v.recordId", "");
            }
            component.set("v.waiting", false);
                
            this.showToast(component);
        }
    },
    
    showToast : function(component) {
		       try {
            component.find('notificationService').showToast({
            		"message": component.message,
                    "variant": component.type,
                    "mode": component.type === "error" ? "sticky" : "dismissible"
        	});
            } 
            catch (e) {
                 var toastMessage = component.type + " - " + component.message;
                 component.set("v.messages", toastMessage);
            } 
    },
})