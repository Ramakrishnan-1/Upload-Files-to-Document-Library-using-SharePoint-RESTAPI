function uploadDocument() {
    var files = $("#attachment")[0].files;
    if (files.length > 0) {
        fileName = files[0].name;
        var webUrl = _spPageContextInfo.webAbsoluteUrl;
        var documentLibrary = "DemoLibrary";
        var targetUrl = _spPageContextInfo.webServerRelativeUrl + "/" + documentLibrary;
        // Construct the Endpoint
        var url = webUrl + "/_api/Web/GetFolderByServerRelativeUrl(@target)/Files/add(overwrite=true, url='" + fileName + "')?@target='" + targetUrl + "'&$expand=ListItemAllFields";
        uploadFileToFolder(files[0], url, function(data) {
            var file = data.d;
            DocFileName = file.Name;
            var updateObject = {
                __metadata: {
                    type: file.ListItemAllFields.__metadata.type
                },
                FileLeafRef: DocFileName //FileLeafRef --> Internal Name for Name Column
            };
            alert("File uploaded successfully!");
        }, function(data) {
            alert("File uploading failed");
        });
    } else {
        alert("Kindly select a file to upload.!")
    }
}

function uploadFileToFolder(fileObj, url, success, failure) {
    var apiUrl = url;
    // Initiate method calls using jQuery promises.
    // Get the local file as an array buffer.
    var getFile = getFileBuffer(fileObj);
    // Add the file to the SharePoint folder.
    getFile.done(function(arrayBuffer) {
        $.ajax({
            url: apiUrl,//File Collection Endpoint
            type: "POST",
            data: arrayBuffer,
            processData: false,
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
            },
            success: function(data) {
                success(data);
            },
            error: function(data) {
                success(data);
            }
        });
    });
}

// Get the local file as an array buffer.
function getFileBuffer(uploadFile) {
    var deferred = jQuery.Deferred();
    var reader = new FileReader();
    reader.onloadend = function(e) {
        deferred.resolve(e.target.result);
    }
    reader.onerror = function(e) {
        deferred.reject(e.target.error);
    }
    reader.readAsArrayBuffer(uploadFile);
    return deferred.promise();
}