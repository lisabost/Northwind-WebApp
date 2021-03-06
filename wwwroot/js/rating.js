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
        getProducts();
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
                    $('#review-count').html(`(${res.length})`);
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
                    // Start parsing data
                    for (let i = 0; i < res.length; i++) {
                        let review = res[i];
                        output = formatReviewCard(review)
                        review_container.prepend(output);
                        setStars($(`#review-${review.ratingId}`), review.rating);
                    }
                }
                // Set Averages and Amounts in Accordian header
                getAverageRating(productId, function (avg) {
                    let accordianHeader = $('#reviews-avg');
                    accordianHeader.data('rating', avg);
                    setStars(accordianHeader, avg);
                });
                $('#review-count').html(`(${res.length})`);
            },
            error: function (jqXHR, status, err) {
                toast("Reviews Error", "There was a problem while loading this products reviews! | Status: " + status, 'red', true);
                console.error(err);
            }
        });
    }

    $('#addReview').on('click', function (e) {
        e.preventDefault();
        $('#add-review-modal').modal('hide');
        if ($("#comment").val() != "")
        {
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
                    toast("Add Review Error", "There was a problem creating your review! Please try again later. | Status: " + textStatus, 'red', true);
                    console.error(errorThrown);
                }
            });
        }
        else
        {
                toast("Add Review Error", "You must leave a comment", 'red', true)
        }

    });

    $('#reviews').on("click", "button", function() {
        // API Call to delete review
        let id = $(this).data('id');
        $.ajax({
            headers: { "Content-Type": "application/json" },
            url: `../../api/deleteReview/${id}`,
            type: 'delete',
            success: function (response, textStatus, jqXhr) {
                // success
                toast("Review Deleted", "Your review has been deleted!");
                getReviews();
                resetAddReviewModal();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                toast("Delete Review Error", "There was a problem deleted your review! Please try again later. | Status: " + textStatus, 'red', true);
                console.error(errorThrown);
            }
        });
    })

});

// Global Functions

function formatReviewCard(review) {
    let trashButton = (review.isAuthor) ? `<button data-id="${review.ratingId}" class="btn trash-btn"><i class="fas fa-trash-alt"></i></button>` : '';
    let accountLink = ($('#addReviewButton').data('name') === review.name) ? "<a href='/Customer/Account'><i>(You)</i></a>" : "";
    let output = `
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
                    <span>&nbsp;|&nbsp;${review.name} ${accountLink}</span>
                    <div id="review-details" class="float-right" style="position: relative; top: -5px; right: -5px;">
                        <small >${formatDate(new Date(Date.parse(review.uploadDate)))}</small>
                        ${trashButton}                                        
                    </div>
                    
                </div>
                <p class="card-text">
                    ${review.comment}
                </div>
            </div>
        </div>
    `;
    return output;
}

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
    if (rating === 0) {
        el.children('i').each(function(index) {
            let i = $(this);
            i.css('color', 'black');
            i.removeClass();
            i.addClass('far fa-star');
            i.addClass('rate-popover');
        });
    } else {
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
}

$('#addReviewButton').on('click', function () {
    if ($('#hasPurchased').data('haspurchased').toUpperCase() === 'TRUE') {
        $('#add-review-modal').modal();
    } else {
        toast("Review Error", "Purchase this Item to leave review!", 'red', true);
    }
});

// ADD TO CART MODAL

//on click to bring up cart modal
$('#products').on('click', 'button', function () {
    if ($(this).attr('id') === "add-to-cart") {
        // make sure a customer is logged in
        if ($('#User').data('customer') == "True") {
            $('#ProductId').html($(this).data('productid'));
            $('#ProductName').html($(this).data('productname'));
            $('#UnitPrice').html($(this).data('unitprice'));
            // calculate and display total in modal
            $('#Quantity').change();
            $('#cartModal').modal();
        } else {
            toast("Access Denied", "You must be <span style='color: blue; text-decoration: underline;'>signed in</span> as a customer to access the cart.", 'red', true, '/Account/Login');
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
            toast("Thanks, " + response.customer.companyName + "!", response.product.productName + " was successfully added to your cart. | Cart QTY: " + response.quantity);
            resetCartModal();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // log the error to the console
            toast("Cart Error", "There was a problem adding the item to your cart. Please try again later. | Status: " + textStatus, 'red', true);
        }
    });
});

function formatDate(dateObj) {
    let hrs24 = dateObj.getHours();
    let isPM = (hrs24 > 12);
    let hrs12 = (isPM) ? (hrs24 - 12) : (hrs24 === 0) ? 1 : hrs24;
    let mins = dateObj.getMinutes();
    let minsAdj = (mins < 10) ? `0${mins}` : `${mins}`;
    let time = `${hrs12}:${minsAdj}` + ((isPM) ? ` PM` : ` AM`);
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()} - ${time}`;
}

function getAverageRating(ProductId, callback) {
    $.getJSON({
        url: `../../api/product/${ProductId}/AvgRating`,
        success: function (res, status, jqXhr) {
            callback(res);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // log the error to the console
            console.error(errorThrown);
        }
    });
}

