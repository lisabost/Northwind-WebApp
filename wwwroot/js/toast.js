// Creates toast on page. Requires a header, message. 
let initToast = false;
let index = 0;
let toastIds = [];
const Toast_Delay = 10000;
function toast(header, message, color = '#1B6EC2', persitant=false, url=undefined) {
    switch (color.toUpperCase()) {
        case "RED":
            const error = new Audio('../../media/error.wav');
            error.play();
            break;
        default:
            const toast = new Audio('../../media/default.wav');
            toast.play();
    }
    if (!initToast) {
        $('body').append(`<div id="toast-component" style="position: fixed;top: 10px;right: 10px; z-index: 5; width: 300px;"></div>`)
        initToast = true;
    }
    let animationClass = "progress-bar-countdown";
    if(persitant) {
        animationClass = "progress-bar-persistant";
    }
    let linkHtml = (url) ? `<a href="${url}" class="stretched-link"></a>` : '';
    let output = `
    <div id="toast-${index}" class="toast unselectable" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong class="h5 mr-auto" style="color: black;">${header}</strong>
            <button type="button" style="z-index: 2; position: relative" class="close float-right" data-dismiss="toast" aria-label="Close">
                &times;
            </button>
        </div>

        <div class="progress" style="height: 4px;">
            <div  class="progress-bar ${animationClass}" style="background-color: ${color}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>

        <div class="toast-body h6" id="toast_body">
            ${message}
            ${linkHtml}
        </div>
    </div>
    `
    $('#toast-component').prepend(output);
    // Post prepend changes.
    if(persitant) {
        $(`#toast-${index}`).toast({ autohide: false }).toast('show');
    } else {
        toastIds.push(index);
        let timeoutId = setTimeout(() => {
            let id = `toast-${toastIds[0]}`;
            document.getElementById(id).remove();
            toastIds.shift();
        }, Toast_Delay);
        $(`#toast-${index}`).toast({ delay: 9000 }).toast('show');
    }
    index++;
}

