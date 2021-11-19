$('#reviews-header-btn').click(function() {
    let chevron = $('#chevron');
    if(chevron.hasClass('fa-chevron-up')) {
        chevron.removeClass('fa-chevron-up');
        chevron.addClass('fa-chevron-down');
    } else {
        chevron.removeClass('fa-chevron-down');
        chevron.addClass('fa-chevron-up');
    }
})

$(document).ready(() => {

    init();

    let mouse = { x: 0, y: 0 }

    let intervalId, hoveredRatingStars, hoveredRating, savedRating;
    $('.review-stars').hover(function() {
        let delay = 10;
        hoveredRatingStars = $(this);
        if(hoveredRatingStars.data('interactive')) {
            savedRating = hoveredRatingStars.data('rating');
            intervalId = setInterval(interactive, delay);
        }
    }, function () {
        if(hoveredRatingStars.data('interactive')) {
            hoveredRatingStars.data('rating', savedRating);
            setStars(hoveredRatingStars, savedRating);
            clearInterval(intervalId);
        }
    });

    $('.review-stars').click(function () {
        if(hoveredRatingStars.data('interactive')) savedRating = hoveredRating;
    });

    let hoverPadding = 1;
    function interactive() {
        console.log(hoveredRatingStars.data('rating'));
        hoveredRatingStars.children().each(function() {
            if(this.matches(':hover')) {
                // Get hovered variables
                let $star = $(this);
                let rect = this.getBoundingClientRect();
                let starI = $star.data('value');

                // Mouse is over star, check for full or half
                let starWidth = rect.right - rect.left;
                let isHalf = false;
                if(rect.left - hoverPadding < mouse.x && mouse.x <= rect.left + starWidth/2 - hoverPadding) isHalf = true;

                // Calc final value
                let final = isHalf ? (starI - 1) : (starI);
                hoveredRating = final;
                setStars(hoveredRatingStars, final);
            }
        });
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

// Receives rating 1-10, converts to 1-5 and applys classes to review-stars el
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
        // py-2 px-1 *Removed
        i.addClass('rate-popover');
    });
}

