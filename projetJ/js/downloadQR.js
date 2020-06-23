setTimeout(function(){    
    var element = $("#aff"); // global variable
    var getCanvas; // global variable

    //  
    jQuery(document).ready(function($){
        html2canvas(element, {
            onrendered: function (canvas) {
                getCanvas = canvas;
            }
        });
    });

    $("#btn-Convert-Html2Image").on('click', function () {
        var imgageData = getCanvas.toDataURL("image/png");
        // Now browser starts downloading it instead of just showing it
        var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
        $("#btn-Convert-Html2Image").attr("download", "payload.png").attr("href", newData);
    });


    var element2 = $("#aff2"); // global variable
    var getCanvas2; // global variable

    //  
    jQuery(document).ready(function($){
        html2canvas(element2, {
            onrendered: function (canvas2) {
                getCanvas2 = canvas2;
            }
        });
    });

    $("#btn-Convert-Html2Image2").on('click', function () {
        var imgageData2 = getCanvas2.toDataURL("image/png");
        // Now browser starts downloading it instead of just showing it
        var newData2 = imgageData2.replace(/^data:image\/png/, "data:application/octet-stream");
        $("#btn-Convert-Html2Image2").attr("download", "entete.png").attr("href", newData2);
    });

}, 1000);