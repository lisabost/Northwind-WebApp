$(document).ready(function() {
    init();
    //Handle selection of rating (Caught when user clicks anywhere in the review-stars)
    // $(".review-stars").click(function(e) {
    //     let targetStarIndex = $(e.target).data('index');
    //     applyClass(this, 'i', 'active-star', targetStarIndex);
    // });
    $('#reviews-header-btn').click(function() {
        let up = $('#arrow-up');
        let down = $('#arrow-down');
        if(up.hasClass('d-none')) {
            up.removeClass('d-none');
            down.addClass('d-none');
        } else {
            up.addClass('d-none');
            down.removeClass('d-none');
        }
    });
});

function init() {
    $('.review-stars').each(function() {
        let avgRating = $(this).attr('data-avg');
        applyClass(this, 'i', 'active-star', avgRating);
    });
}

function setStars(id) {
    let review_stars = $(`#review-${id}`);
    let i = review_stars.data('avg');
    applyClass(review_stars, 'i', 'active-star', i);
}

// Finds all 'el' elements in the 'parent' selector and applys the 'c' class to each up to the 'index'
// - All 'el' elements must have a data-index attribute
// - Subtracted 1 from index because the star data-index starts at 0 and reviews are 1 - 5;
function applyClass(parent, el, c, index) {
    $(parent).children(el).each(function() {
        let adjustedIndex = index - 1;
        let star = $(this);
        star.removeClass(c);
        let starI = star.attr('data-index');
        if(starI <= adjustedIndex || starI === 0) {
            star.addClass(c);
        }
    })
}