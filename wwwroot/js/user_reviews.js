$(document).ready(function() {
    getUserReviews();
});

function getUserReviews() {
    let review_container = $('#user-reviews');
    review_container.html("");
    $.getJSON({
        url: `../../api/account/reviews`,
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
                                    Purchase an item to leave a honest review!
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
            
        },
        error: function(res, status, jqXHR) {
            toast("Error", "Error loading your reviews.", 'red', true);
            console.error(res);
        }
    });

}