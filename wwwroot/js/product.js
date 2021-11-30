$(function () {
    getProducts()
    function getProducts() {
        var id = $('#product_rows').data('id');
        var discontinued = $('#Discontinued').prop('checked') ? "" : "/discontinued/false";
        $.getJSON({
            url: "../../api/category/" + id + "/product" + discontinued,
            success: function (response, textStatus, jqXhr) {
                $('#product_rows').html("");
                for (var i = 0; i < response.length; i++) {
                    var css = response[i].discontinued ? " class=\"discontinued\"" : "";
                    var row = "<tr" + css + " data-id=\"" + response[i].productId + "\" data-name=\"" + response[i].productName + "\" data-price=\"" + response[i].unitPrice + "\">"
                        + "<td>" + response[i].productName + "</td>"
                        + "<td class=\"text-right\">$" + response[i].unitPrice.toFixed(2) + "</td>"
                        + "<td class=\"text-right\">" + response[i].unitsInStock + "</td>"
                        + "</tr>";
                    $('#product_rows').append(row);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                toast("Products Error", "There was a problem loading product information. Please try again later. | Status: " + textStatus, 'red');
                console.error(errorThrown);
            }
        });
    }

    //display currently selected category's products when new category is chosen in the dropdown menu
    $('#CategoryId').on('change', function () {
        $('#product_rows').data('id', $(this).val());
        getProducts();
    });
    $('#Discontinued').on('change', function () {
        getProducts();
    });

});
