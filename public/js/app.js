/**
 * Created by Fer on 11/05/2015.
 */

(function() {
    var qrcodes = document.getElementsByClassName('qrcode');
    for(var i = 0; i < qrcodes.length; i++) {
        var address = qrcodes[i].textContent;
        qrcodes[i].innerHTML = '';
        new QRCode(qrcodes[i], {
            text: address,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.M
        });
    }
}());