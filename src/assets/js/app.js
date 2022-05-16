$(window).ready(() => {
    setTimeout(() => {
        let overlayEvent = new CustomEvent("overlayLoaded");
        $(".overlay").fadeOut(500, function () {
            document.dispatchEvent(overlayEvent);
        });
    }, 300);

    var mailv = 0;
    var mail = $('[name="mail"]');
    var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    mail.bind("change paste keyup", function () {
        if (mail.val() != '') {
            if (mail.val().search(pattern) == 0) {
                $(mail).removeClass('error');
                return mailv = 1;
            } else {
                $(mail).addClass('error');
                return mailv = 0;
            }
        } else {
            return mailv = 0;
        }
    });
});
