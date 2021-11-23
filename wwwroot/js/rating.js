$(document).ready(() => {
    init();
    let mouse = { x: 0, y: 0 }

    let intervalId, hoveredRatingStars, hoveredRating, savedRating;
    $('.review-stars').hover(function() {
        let delay = 10;
        hoveredRatingStars = $(this);
        if(isInteractive(hoveredRatingStars)) {
            savedRating = hoveredRatingStars.data('rating');
            intervalId = setInterval(interactive, delay);
        }
    }, function () {
        if(isInteractive(hoveredRatingStars)) {
            hoveredRatingStars.data('rating', savedRating);
            setStars(hoveredRatingStars, savedRating);
            clearInterval(intervalId);
        }
    });

    $('.review-stars').click(function () {
        if(isInteractive(hoveredRatingStars)) savedRating = hoveredRating;
    });

    let hoverPadding = 1;
    function interactive() {
        console.log(hoveredRatingStars.data('rating'));
        hoveredRatingStars.children().each(function() {
            if(this.matches(':hover')) {
                let $star = $(this);
                let rect = this.getBoundingClientRect();
                let starI = $star.data('value');

                let starWidth = rect.right - rect.left;
                let isHalf = false;
                if(rect.left - hoverPadding < mouse.x && mouse.x <= rect.left + starWidth/2 - hoverPadding) isHalf = true;

                let final = isHalf ? (starI - 1) : (starI);
                hoveredRating = final;
                setStars(hoveredRatingStars, final);
            }
        });
    }

    function isInteractive(el) {
        return el.data('interactive') ? true : false;
    }

    function init() {
        $('.review-stars').each(function() {
            let rating = $(this).data('rating');
            setStars($(this), rating);
        });
    }

    addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

});

// Global Functions

$('#reviews-header-btn').click(function() {
    let chevron = $('#chevron');
    if(chevron.hasClass('rotate')) {
        chevron.removeClass('rotate');
    } else {
        chevron.addClass('rotate');
    }
});

function setStars(el, rating) {
    if(rating === 0) return;
    let adj = rating / 2;
    el.children('i').each(function(index) {
        let i = $(this);
        if(adj > index && (adj - index) > .5) {
            // Full Star
            i.css('color', 'gold');
            i.removeClass();
            i.addClass('fas fa-star');
        } else if((adj - index) === .5) {
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

