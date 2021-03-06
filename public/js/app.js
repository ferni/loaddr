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
            colorDark : "#1D6B73",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.M
        });
    }

    //SOCKET.IO
    socket.on('log', function (data) {
        console.log('received data:' + data);
        var loaddr = $('#' + data.address);
        loaddr.find('.log ul').append('<li>' + data.message + '</li>');
        loaddr.find('.last-log').html(data.message);
    });

    socket.on('update balance', function(data) {
        $('#' + data.address).find('.balance').html(data.balance);
    });

    //INTERACTION
    $('.last-log-container').click(function() {
        $(this).parent().find('.log').show();
    });
    $('.close-button').click(function() {
        $(this).parent().hide();
    });
    $('#new-button').click(function() {
        $('#new-panel').toggle();
    });
    $('.view-settings').click(function () {
        $(this).parent().find('.description').toggle();
    });
    new SimpleTabs(document.getElementById('loaddr-types'));
}());