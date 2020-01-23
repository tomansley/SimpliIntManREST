function getConfigList(success, error) {
  var soql = "SELECT Id, Name, Simpli__Class_Name__c, Simpli__Description__c, Simpli__Allow_Multiples__c, Simpli__Parent_Object__c, Simpli__SFDC_Object_API_Name__c FROM Simpli__Simpli_Object__c WHERE Simpli__Is_Active__c = true ORDER BY Name";
  force.query(soql, success, error);
}

function getConfigDetails(configId, success, error) {
    var soql = "SELECT Id, Name, Simpli__Allow_Overrides__c, Simpli__Allow_Multiples__c, Simpli__External_Name__c, Simpli__Is_Required__c, Simpli__Type__c, Simpli__Value__c, Simpli__External_Index__c, Simpli__Is_Formula__c, Simpli__Formula__c, Simpli__Is_Lookup__c, Simpli__Lookup_Field__c, Simpli__Lookup_Id_Value__c, Simpli__Lookup_Return_Field__c FROM Simpli__Simpli_Attribute__c WHERE Simpli__External_Name__c != null AND Simpli__Type__c = 'Input' AND Simpli__Parent_Object__c = '" + configId + "'";
  force.query(soql, success, error);
}

function updateValue(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.requestDataMap.set(name, value);
    console.log('Value updated - ' + event.target.name + ' - ' + event.target.value);
}

function processConfig(event) {
    console.log('Button was pressed');
    var valuesMap = new Map();
    var success;
    var error;
    var jsonStr = "{\"requestData\":{\"processName\":\"Example - Account Insert\",\"fields\":[";

    for (let [k, v] of this.requestDataMap) {
        jsonStr += "{\"fieldName\":\"" + k + "\",\"fieldValue\":\"" + v + "\"},";
        console.log('Adding key/value pair - (' + k + ',' + v + ')');
    }

    jsonStr = jsonStr.slice(0, -1); //remove last comma

    jsonStr += "]}}";

    console.log('JSON - ' + jsonStr);



    force.request({path: "/services/apexrest/Simpli/Simpli/", method: "POST", contentType: "application/json", data: jsonStr}, 
    function (result) {
        console.log("Success: " + JSON.stringify(result));
        html =
        '<div class="page">' +
            '<header class="bar bar-nav">' +
                '<a class="btn btn-link btn-nav pull-left" href="#"><span class="icon icon-left-nav"></span>Back</a>' +
                '<h1 class="title">Processing Response</h1>' +
            '</header>' +
            '<div class="content">' +
                '<div class="card">' +
                    '<table width="800px">' +
                        '<tr>' +
                            '<th padding="5px" width="190px">Field Name</th>' +
                            '<th style="text-align: center; padding-bottom: 15px;" padding="5px" width="190px">Value</th>' +
                        '</tr>' +
                    '</table>';

                    for (var i=0; i<result.fields.length; i++) {
                        var attrib = result.fields[i];
                        html += '<table width="800px">' +
                                    '<tr>' +
                                        '<td padding="5px" width="190px">' + attrib.fieldName + '</td>' +
                                        '<td style="text-align: center; padding-bottom: 15px;" padding="5px" width="190px">' + attrib.fieldValue + '</td>' +
                                    '</tr>' +
                                '</table>';
                    }
        html += '</div>' +
        '</div>' +
        '</div>';
        slider.slidePage($(html));
    }, 
    function (error) {
        alert("Error: " + JSON.stringify(error));
    });
}

function showConfigList() {
    requestDataMap = new Map();
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
                    '<div class="card">' +
                        '<table>' +
                            '<tr>' +
                                '<th padding="5px" width="190px">Name</th>' +
                                '<th padding="5px" width="90px">Allow Overrides</th>' +
                                '<th padding="5px" width="90px">Allow Multiples</th>' +
                                '<th padding="5px" width="90px">External Name</th>' +
                                '<th padding="5px" width="90px">Is Required</th>' +
                                '<th padding="5px" width="90px">Type</th>' +
                                '<th padding="5px" width="90px">Value</th>' +
                                '<th padding="5px" width="90px">External Index</th>' +
                                '<th padding="5px" width="90px">Is Formula</th>' +
                                '<th padding="5px" width="90px">Formula</th>' +
                                '<th padding="5px" width="90px">Is Lookup</th>' +
                                '<th padding="5px" width="90px">Lookup Field</th>' +
                                '<th padding="5px" width="90px">Lookup Id Value</th>' +
                                '<th padding="5px" width="90px">Lookup Return Field</th>' +
                            '</tr>' +
                        '</table>';

                    for (var i=0; i<attribs.length; i++) {
                        var attrib = data.records[i];
                        html += '<table>' +
                                    '<tr>' +
                                        '<td padding="5px" width="190px">' + attrib.Name + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Allow_Overrides__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Allow_Multiples__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__External_Name__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Is_Required__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Type__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Value__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__External_Index__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Is_Formula__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Formula__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Is_Lookup__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Lookup_Field__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Lookup_Id_Value__c + '</td>' +
                                        '<td padding="5px" width="90px">' + attrib.Simpli__Lookup_Return_Field__c + '</td>' +
                                        '<td padding="5px" width="90px"><input type="text" onchange="updateValue(event)" name="' + attrib.Simpli__External_Name__c + '"></input>' +
                                    '</tr>' +
                                '</table>';
                    }
                    html += '<div display: grid;><button type="button" onclick="processConfig(event)">Process Config</button></div>'
                    html += '</div>' +
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

var requestDataMap = new Map();