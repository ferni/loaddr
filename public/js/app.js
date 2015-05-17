/**
 * Created by Fer on 11/05/2015.
 */

(function() {
    //QR CODES
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

    //SOCKET.IO
    socket.on('log', function (data) {
        console.log('received data:' + data);
        var html = '<li>' + data.message + '</li>';
        var loaddr = $('#' + data.address);
        loaddr.find('.log ul').append(html);
        loaddr.find('.last-log').html(html);
    });

    socket.on('update balance', function(data) {
        $('#' + data.address).find('.balance').html(data.balance);
    });

    //INTERACTION
    $('.last-log').click(function() {
        $(this).parent().find('.log').show();
    });
    $('.close-log').click(function() {
        $(this).parent().hide();
    })
}());