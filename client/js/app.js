function getConfigList(success, error) {
  var soql = "SELECT Id, Name, Simpli__Class_Name__c, Simpli__Description__c, Simpli__Allow_Multiples__c, Simpli__Parent_Object__c, Simpli__SFDC_Object_API_Name__c FROM Simpli__Simpli_Object__c WHERE Simpli__Is_Active__c = true ORDER BY Name";
  force.query(soql, success, error);
}

function getConfigDetails(configId, success, error) {
    var soql = "SELECT Id, Name, Simpli__Allow_Overrides__c, Simpli__Allow_Multiples__c, Simpli__External_Name__c, Simpli__Is_Required__c, Simpli__Type__c, Simpli__Value__c, Simpli__External_Index__c, Simpli__Is_Formula__c, Simpli__Formula__c, Simpli__Is_Lookup__c, Simpli__Lookup_Field__c, Simpli__Lookup_Id_Value__c, Simpli__Lookup_Return_Field__c FROM Simpli__Simpli_Attribute__c WHERE Simpli__Parent_Object__c = '" + configId + "'";
  force.query(soql, success, error);
}

function showConfigList() {
    getConfigList(
        function (data) {
            var configs = data.records,
                html = '';
            for (var i=0; i<configs.length; i++) {
                html += '<li class="table-view-cell"><a href="#configs/'+ configs[i].Id +'">' + configs[i].Name + '</a></li>';
            }
            html =
                '<div class="page">' +
                '<header class="bar bar-nav">' +
                    '<h1 class="title">Configurations</h1>' +
                '</header>' +
                '<div class="content">' +
                    '<ul class="table-view config-list">' + html + '</ul>' +
                '</div>' +
                '</div>';
            slider.slidePage($(html));
        },
        function (error) {
            alert("Error: " + JSON.stringify(error));
        });
    return false;
}

function showConfigDetails(configId) {

    getConfigDetails(configId,
        function (data) {
            var attribs = data.records,
            html =
                '<div class="page">' +
                '<header class="bar bar-nav">' +
                '<a class="btn btn-link btn-nav pull-left" href="#"><span class="icon icon-left-nav"></span>Back</a>' +
            '<h1 class="title">Configuration Attributes</h1>' +
                '</header>' +
                '<div class="content">' +
                    '<div class="card">';
                        '<ul class="table-view">' +
                            '<li class="table-view-cell">' +
                                '<table cellpadding="10">' +
                                    '<th>' +
                                        '<td>Name</td>' +
                                        '<td>Allow Overrides</td>' +
                                        '<td>Allow Multiples</td>' +
                                        '<td>External Name</td>' +
                                        '<td>Is Required</td>' +
                                        '<td>Type</td>' +
                                        '<td>Value</td>' +
                                        '<td>External Index</td>' +
                                        '<td>Is Formula</td>' +
                                        '<td>Formula</td>' +
                                        '<td>Is Lookup</td>' +
                                        '<td>Lookup Field</td>' +
                                        '<td>Lookup Id Value</td>' +
                                        '<td>Lookup Return Field</td>' +
                                    '</th>' +
                                '</table>' +
                            '</li>' +
                        '</ul>';

                    for (var i=0; i<attribs.length; i++) {
                        var attrib = data.records[i];
                        html += '<ul class="table-view">' +
                                    '<li class="table-view-cell">' +
                                        '<table cellpadding="10">' +
                                            '<tr>' +
                                                '<td>' + attrib.Name + '</td>' +
                                                '<td>' + attrib.Simpli__Allow_Overrides__c + '</td>' +
                                                '<td>' + attrib.Simpli__Allow_Multiples__c + '</td>' +
                                                '<td>' + attrib.Simpli__External_Name__c + '</td>' +
                                                '<td>' + attrib.Simpli__Is_Required__c + '</td>' +
                                                '<td>' + attrib.Simpli__Type__c + '</td>' +
                                                '<td>' + attrib.Simpli__Value__c + '</td>' +
                                                '<td>' + attrib.Simpli__External_Index__c + '</td>' +
                                                '<td>' + attrib.Simpli__Is_Formula__c + '</td>' +
                                                '<td>' + attrib.Simpli__Formula__c + '</td>' +
                                                '<td>' + attrib.Simpli__Is_Lookup__c + '</td>' +
                                                '<td>' + attrib.Simpli__Lookup_Field__c + '</td>' +
                                                '<td>' + attrib.Simpli__Lookup_Id_Value__c + '</td>' +
                                                '<td>' + attrib.Simpli__Lookup_Return_Field__c + '</td>' +
                                            '</tr>' +
                                        '</table>' +
                                    '</li>' +
                                '</ul>';
                    }
                    '</div>' +
                '</div>' +
                '</div>';
            slider.slidePage($(html));
        },
        function (error) {
            alert("Error: " + JSON.stringify(error));
        });
    return false;
}

var slider = new PageSlider($('body')); // Initialize PageSlider micro-library for nice and hardware-accelerated page transitions
router.addRoute('', showConfigList);
router.addRoute('configs/:id', showConfigDetails);
