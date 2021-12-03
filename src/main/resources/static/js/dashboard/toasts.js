function toastLaunch(icon, largeHeader, smallHeader, text, color) {
    let id = "toast" + Date.now()
    document.getElementById("toastContainer").innerHTML += toastBuilder(
        icon, 
        largeHeader, 
        smallHeader, 
        text, 
        id,
        color
    )
    new bootstrap.Toast(document.getElementById(id)).show()
}

function toastBuilder(icon, largeHeader, smallHeader, text, id, color) {

    let toastColors = {
        "primary": "text-white bg-primary",
        "success": "text-white bg-success",
        "danger": "text-white bg-danger"
    }

    let toastIcons = {
        "success" : '<svg class="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>',
        "warning" : '<svg class="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>',
        "none" : ""
    }

    return (
        '<div class="toast mt-2 ' + toastColors[color] +'" role="alert" aria-live="assertive" aria-atomic="true" id="' + id + '">' +
            '<div class="toast-header">' +
                toastIcons[icon]+
                '<strong class="me-auto">' + largeHeader + '</strong>' +
                '<small>' + smallHeader + '</small>' +
                '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>' +
            '</div>' +
            '<div class="toast-body">' +
                text +
            '</div>' +
        '</div>')
}