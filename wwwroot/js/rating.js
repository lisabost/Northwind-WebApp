$(document).ready(() => {
    init();
    let mouse = { x: 0, y: 0 }

    let intervalId, hoveredRatingStars, hoveredRating, savedRating;
    $('.review-stars').hover(function () {
        let delay = 10;
        hoveredRatingStars = $(this);
        if (isInteractive(hoveredRatingStars)) {
            savedRating = hoveredRatingStars.data('rating');
            intervalId = setInterval(interactive, delay);
        }
    }, function () {
        if (isInteractive(hoveredRatingStars)) {
            hoveredRatingStars.data('rating', savedRating);
            setStars(hoveredRatingStars, savedRating);
            clearInterval(intervalId);
        }
    });

    $('.review-stars').click(function () {
        if (isInteractive(hoveredRatingStars)) {
            savedRating = hoveredRating;
            updateInputValue('rating-input', savedRating);
        }
    });

    let hoverPadding = 1;
    function interactive() {
        hoveredRatingStars.children().each(function () {
            if (this.matches(':hover')) {
                let $star = $(this);
                let rect = this.getBoundingClientRect();
                let starI = $star.data('value');

                let starWidth = rect.right - rect.left;
                let isHalf = false;
                if (rect.left - hoverPadding < mouse.x && mouse.x <= rect.left + starWidth / 2 - hoverPadding) isHalf = true;

                let final = isHalf ? (starI - 1) : (starI);
                hoveredRating = final;
                setStars(hoveredRatingStars, final);
            }
        });
    }

    function updateInputValue(id, val) {
        document.getElementById(id).value = val;
    }

    function isInteractive(el) {
        return el.data('interactive') ? true : false;
    }

    function init() {
        getReviews();
        $('.review-stars').each(function () {
            let rating = $(this).data('rating');
            setStars($(this), rating);
        });
    }

    addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function getReviews() {
        let review_container = $('#reviews');
        review_container.html("");
        let productId = $('#product-id').data('id');
        $.getJSON({
            url: `../../api/product/${productId}/reviews`,
            success: function (res, status, jqXhr) {
                let output = "Error processing reviews...";


                if (res.length == 0) {
                    output = `
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title">
                                    No reviews yet...
                                </div>
                                <p class="card-text">
                                    Logon and purchase this item to leave a review!
                                </div>
                            </div>
                        </div>
                    `;
                    review_container.html(output);
                } else {
                    for (let i = 0; i < res.length; i++) {
                        let review = res[i];
                        output = `
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="card-title">
                                        <span>${(review.rating / 2).toFixed(1)}&nbsp;</span>
                                        <span class="review-stars" id="review-${review.ratingId}" data-rating="${review.rating}" data-interactive="false">
                                            <i class="far fa-star rate-popover" data-value="2"></i>
                                            <i class="far fa-star rate-popover" data-value="4"></i>
                                            <i class="far fa-star rate-popover" data-value="6"></i>
                                            <i class="far fa-star rate-popover" data-value="8"></i>
                                            <i class="far fa-star rate-popover" data-value="10"></i>
                                        </span>
                                        <span>&nbsp;|&nbsp;${review.name}</span>
                                    </div>
                                    <p class="card-text">
                                        ${review.comment}
                                    </div>
                                </div>
                            </div>
                        `;
                        review_container.prepend(output);
                        setStars($(`#review-${review.ratingId}`), review.rating);
                    }
                }
            },
            error: function (jqXHR, status, err) {
                console.log("Error while getting reviews: " + status, err);
            }
        });
    }

    $('#addReview').on('click', function (e) {
        e.preventDefault();
        $('#add-review-modal').modal('hide');
        $.ajax({
            headers: { "Content-Type": "application/json" },
            url: "../../api/addReview",
            type: 'post',
            data: JSON.stringify({
                "ProductId": Number($('#addReviewButton').data('id')),
                "Name": $('#addReviewButton').data('name'),
                "Rating": Number($('#rating-input').val()),
                "Comment": $("#comment").val()
            }),
            success: function (response, textStatus, jqXhr) {
                // success
                toast("Review Added", "Thank you for your review of " + document.getElementById('product-id').innerText + "!");
                getReviews();
                resetAddReviewModal();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                toast("Error", "Please try again later.", 'red');
            }
        });
    });

});

// Global Functions

$('#reviews-header-btn').click(function () {
    let chevron = $('#chevron');
    if (chevron.hasClass('rotate')) {
        chevron.removeClass('rotate');
    } else {
        chevron.addClass('rotate');
    }
});

function resetAddReviewModal() {
    document.getElementById('comment').value = "";
    $('#review-new').data('rating', '10');
    $('#rating-input').val('10');
    setStars($('#review-new'), 10);
}

function resetCartModal() {
    $('#Quantity').val(1);
}

function setStars(el, rating) {
    if (rating === 0) return;
    let adj = rating / 2;
    el.children('i').each(function (index) {
        let i = $(this);
        if (adj > index && (adj - index) > .5) {
            // Full Star
            i.css('color', 'gold');
            i.removeClass();
            i.addClass('fas fa-star');
        } else if ((adj - index) === .5) {
            // Half Star
            i.css('color', 'gold');
            i.removeClass();
            i.addClass('fas fa-star-half-alt');
        } else {
            // Empty Star
            i.css('color', 'black');
            i.removeClass();
            i.addClass('far fa-star');
        }
        i.addClass('rate-popover');
    });
}

$('#addReviewButton').on('click', function () {
    if ($('#hasPurchased').data('haspurchased').toUpperCase() === 'TRUE') {
        $('#add-review-modal').modal();
    } else {
        toast("Error", "Purchase Item to leave review!", 'red');
    }
});

// Can add a toast to any page given a header, a message, and optionally, a color for the progress bar.
let initToast = false;
let index = 0;
let toastIds = [];
const Toast_Delay = 10000;
function toast(header, message, color='#1B6EC2') {
    if(!initToast) { 
        $('body').append(`<div id="toast-component" style="position: absolute;top: 10px;right: 10px; z-index: 5; width: 300px;"></div>`) 
        initToast = true;
    }
    let output = `
    <div id="toast-${index}" class="shadow-lg toast toast-component" role="alert" aria-live="assertive" aria-atomic="true" style="border: #A9A9A9 solid 1px">
        <div class="toast-header">
            <strong class="h5 mr-auto" style="color: black;">${header}</strong>
            <button type="button" class="close float-right" data-dismiss="toast" aria-label="Close">
                &times;
            </button>
        </div>
        <div class="progress" style="height: 4px;">
            <div class="progress-bar" style="background-color: ${color}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="toast-body h6" id="toast_body">
            ${message}
        </div>
    </div>
    `
    $('#toast-component').prepend(output);
    $(`#toast-${index}`).toast({ delay: 9000 }).toast('show');
    toastIds.push(index);
    let timeoutId = setTimeout(() => {
        let id = `toast-${toastIds[0]}`;
        document.getElementById(id).remove();
        toastIds.shift();
    }, Toast_Delay);
    index++;
}

// ADD TO CART MODAL

//on click to bring up cart modal
$('#products').on('click', 'button', function () {
    if($(this).attr('id') === "add-to-cart") {
        // make sure a customer is logged in
        if ($('#User').data('customer') == "True") {
            $('#ProductId').html($(this).data('productid'));
            $('#ProductName').html($(this).data('productname'));
            $('#UnitPrice').html($(this).data('unitprice'));
            // calculate and display total in modal
            $('#Quantity').change();
            $('#cartModal').modal();
        } else {
            toast("Access Denied", "You must be signed in as a customer to access the cart.", 'red');
        }
    }
});

// update total when cart quantity is changed
$('#Quantity').change(function () {
    var total = parseInt($(this).val()) * parseFloat($('#UnitPrice').html());
    $('#Total').html(numberWithCommas(total.toFixed(2)));
});

// function to display commas in number
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Using product id, customer id, and quantity call API method using AJAX
$('#addToCart').on('click', function () {
    $('#cartModal').modal('hide');
    $.ajax({
        headers: { "Content-Type": "application/json" },
        url: "../../api/addtocart",
        type: 'post',
        data: JSON.stringify({
            "id": Number($('#ProductId').html()),
            "email": $('#User').data('email'),
            "qty": Number($('#Quantity').val())
        }),
        success: function (response, textStatus, jqXhr) {
            // success
            toast("Product Added", response.product.productName + " successfully added to cart.");
            resetCartModal();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // log the error to the console
            toast("Error", "Please try again later.", 'red');
        }
    });
});