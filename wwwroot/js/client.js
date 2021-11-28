$(function(){
    // preload audio
    // var toastsound = new Audio('../media/toast.wav');

    $('.code').on('click', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        // first pause the audio (in case it is still playing)
        // toastsound.pause();
        // // reset the audio
        // toastsound.currentTime = 0;
        // // play audio
        // toastsound.play();

        //get data-product and data-discount elements
        var name = $(this).data("product");
        var discount = $(this).data("code");

        //update spans with product name and discount code information
        toast(name, "Discount Code: " + discount, 'blue', true);
    });
});



$(document).on('keydown', function(e) {
    if (e.keyCode == 27) {
        // Clear Toasts on Esc.
    }
})