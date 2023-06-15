// print your dirty secrets on the box
$('.box .version').html("Unknown");


// high end monitor software
var text = ['Error', 'Sign in'];
var counter = 0;
var elem = $('.monitor');

function scanning() {
    elem.html('Forbidden');
    var inst = setInterval(change, 1000);
}

function change() {
    elem.html(text[counter]);
    elem.toggleClass('text');
    counter++;
    if (counter >= text.length) {
        counter = 0;
    }
}

// high end conveyor belt functionality
var box = '.box';
var tl = new TimelineMax();

tl.to(box, 4, {
    right: '0',
    ease: Power0.easeNone
});

tl.call(function () {
    $(box).addClass('scanned');
    $('.scan-window').addClass('scanning');
    scanning();
}, null, null, 2.5);
