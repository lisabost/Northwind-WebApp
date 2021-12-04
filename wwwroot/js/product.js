const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

function hideSpinner() {
    let spinner = $('#loading');
    spinner.removeClass('d-flex');
    spinner.addClass('d-none');
}

$('#filter').on('change', function() {
    getProducts();
});

function getProducts() {
    const ITEMS_PER_PAGE = 12;

    let categoryId = $('#category-filter').val();
    let discontinued = $('#discontinued').is(':checked');
    let isPurchased = $('#purchased').is(':checked');

    $.getJSON({
        url: `../../api/category/${categoryId}/product/discontinued/${discontinued}`,
        success: function (res, status, jqXhr) {
            let output = "Error grabbing products...";
            let products_container = $('#products');
            let currentPage = 1;
            products_container.html("");

            initPagegination();

            if (res.length == 0) {
                checkIfEmpty();
            } else {
                for (let i = 0; i < res.length; i++) {
                    let product = res[i];

                    if(isPurchased && !product.hasPurchased) continue;

                    if((i % ITEMS_PER_PAGE) === 0 && i > 1) {
                        currentPage = (i / ITEMS_PER_PAGE) + 1;
                        newPageButton(currentPage);
                        newPageContent(currentPage);
                    }

                    output = `
                        <div class="col py-2">
                            <div class="card mx-auto product-card" style="width: 18rem; height: 155px;">
                                <div class="card-body">
                                    <button style="z-index: 2; position: relative" id="add-to-cart" class="add-to-cart-button btn btn-primary float-right" data-productid="${product.productId}" data-productname="${product.productName}" data-unitprice="${product.unitPrice}"><i class="fas fa-cart-plus"></i></button>
                                    
                                    <p style="max-width: 175px; border-bottom: rgba(0, 0, 0, 0.2) solid 2px;" class="d-block pb-1 h5 ${(product.discontinued) ? 'disc' : ''}">${product.productName}</p>
                                    <div style="position: absolute; left: 22px; bottom: 19px;">
                                        <h6 class="">${formatter.format(product.unitPrice)}</h6>
                                        <span style="" class="review-stars" id="review-${product.productId}" data-rating="${product.averageRating}" data-interactive="false">
                                            <i class="far fa-star rate-popover" data-value="2"></i>
                                            <i class="far fa-star rate-popover" data-value="4"></i>
                                            <i class="far fa-star rate-popover" data-value="6"></i>
                                            <i class="far fa-star rate-popover" data-value="8"></i>
                                            <i class="far fa-star rate-popover" data-value="10"></i>
                                        </span>
                                        <span>
                                            (${product.ratingCount})
                                        </span>
                                    </div>
                                    <a href="/Product/ProductDetail/${product.productId}" class="stretched-link"></a>
                                </div>
                            </div>
                        </div>
                    `;
                    //Append to proper page
                    appendToPage(currentPage, output);

                    // products_container.append(output);

                    setStars($(`#review-${product.productId}`), product.averageRating);

                }
                hideSpinner();
                checkIfEmpty();
            }
        },
        error: function (jqXHR, status, err) {
            toast("Products Error", "There was a problem loading product information. Please try again later. | Status: " + status, 'red');
            console.error(error);
            hideSpinner();
        }
    });
}

function initPagegination() {
    $('#pagination').html("");
    let pageButtons = `
    <ul id="page-list" class="nav nav-pills">
        <li class="nav-item">
            <a class="nav-link active" id="page-1-button" data-toggle="tab" href="#page-1">1</a>
        </li>
    </ul>
    `;
    $('#pagination').append(pageButtons);
    let pageContents = `
        <div class="tab-content" id="products-page-content">
            <div class="tab-pane fade show active" id="page-1" role="tabpanel" aria-labelledby="page-1">
                <div class="row" id="page-1-contents"></div>
            </div>
        </div>
    `;
    $('#products').append(pageContents);
}

function newPageButton(pageNum) {
    let output = `
        <li class="nav-item">
            <a class="nav-link" id="page-${pageNum}-button" data-toggle="tab" href="#page-${pageNum}">${pageNum}</a>
        </li>
    `;
    $('#page-list').append(output);
}

function newPageContent(pageNum) {
    let output = `
    <div class="tab-pane fade" id="page-${pageNum}" role="tabpanel" aria-labelledby="page-${pageNum}">
        <div class="row" id="page-${pageNum}-contents"></div>
    </div>
    `;
    $('#products-page-content').append(output);
}

function appendToPage(pageNum, card) {
    let pages = $('#products-page-content');
    pages.children().each(function(index) {
        index++; // Adjust Index 
        if(index === pageNum) {
            $(this).find('.row:first').append(card);
        }
    });
}

function checkIfEmpty() {
    if($('#page-1-contents').children().length < 1) {
        // there are no cards.
        let noCards = `
        <div class="col py-2">
            <div class="card mx-auto" style="width: 18rem;">
                <div class="card-body">
                    There are no Products that match the provided filters...
                </div>
            </div>
        </div>
        `;
        appendToPage(1, noCards);
    }
}