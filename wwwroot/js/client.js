$(function(){
    $('.code').on('click', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        //get data-product and data-discount elements
        var name = $(this).data("product");
        var discount = $(this).data("code");

        //update spans with product name and discount code information
        toast(name, "Discount Code: " + discount, undefined, true);
    });
});

$(document).on('keydown', function(e) {
    if (e.keyCode == 27) {
        // Clear Toasts on Esc.
    }
});

$('#filter-content-toggle').on("click", function() {
    let output;
    if($(this).data('istoggled')) {
        $(this).data('istoggled', false);
        output = "Show Filters";
    } else {
        $(this).data('istoggled', true);
        output = "Hide Filters";
    }
    $(this).html(output + '&nbsp;<i class="fas fa-filter"></i>');
});

