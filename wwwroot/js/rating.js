$(document).ready(function() {
    init();
    //Handle selection of rating (Caught when user clicks anywhere in the review-stars)
    // $(".review-stars").click(function(e) {
    //     let targetStarIndex = $(e.target).data('index');
    //     applyClass(this, 'i', 'active-star', targetStarIndex);
    // });
});

function init() {
    $('.review-stars').each(function(index) {
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
function applyClass(parent, el, c, index) {
    $(parent).children(el).each(function() {
        let star = $(this);
        star.removeClass(c);
        let starI = star.attr('data-index');
        if(starI <= index || starI === 0) {
            star.addClass(c);
        }
    })
}