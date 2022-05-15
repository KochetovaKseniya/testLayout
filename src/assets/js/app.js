$(window).ready(() => {
    setTimeout(() => {
        let overlayEvent = new CustomEvent("overlayLoaded");
        $(".overlay").fadeOut(500, function () {
            document.dispatchEvent(overlayEvent);
        });
        autosize($('textarea'));
    }, 300);

});
