﻿$(document).ready(() => {
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
        review_container.html();
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
        console.log("Add to Card");
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
                toast("review_toast", "Review Added", "Thank you for your review of " + document.getElementById('product-id').innerText + "!");
                getReviews();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // log the error to the console
                toast("review_toast", "Error", "Please try again later.");
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
        toast("review_toast", "Error", "Purchase Item to leave review!");
    }
});

function toast(id, header, message) {
    $('#toast_header').html(header);
    $('#toast_body').html(message);
    $(`#${id}`).toast({ delay: 2500 }).toast('show');
}