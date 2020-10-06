function OnResize() {
    if (window.Igs) {
        window.Igs.resize(window.img_w, window.img_h);
    }
    if (Tgs) {
        window.Tgs.resize(window.txt_w, window.txt_h);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    // Пример встраивания эффекта картинки.
    var img_src = "images/img0.jpg";
    var img = new Image();
    img.onload = function() {
        var div = document.getElementById('test_div');
        window.img_w = img.width;
        window.img_h = img.height;
        window.Igs = new ImgGradientShifter(
            div, img.width, img.height,
            0, 0, img.width, img.height,
            img, 0, 0, img.width, img.height,
            250, 250, 250,
            4000, 10, function() {
                console.log('IMAGE COMPLETE.');
            });

        div.onmouseover = function() {
            console.log('IMAGE OPEN.');
            window.Igs.forward();
        };

        div.onmouseout = function() {
            console.log('IMAGE CLOSE.');
            window.Igs.backward();
        };
    }
    img.src = img_src;

    // Пример встраивания эффекта текста.
    var font = "20px Verdana";
    var txt = "TEST BUTTON TEXT";
    var btn = document.getElementById('test_bt');

    var sz_c = document.createElement('canvas');
    var sz_ctx = sz_c.getContext("2d");
    sz_ctx.font = font;
    var txt_w = sz_ctx.measureText(txt).width;
    var txt_h = 20;
    window.txt_w = txt_w;
    window.txt_h = txt_h;

    window.Tgs = new TextGradientShifter(
        btn,
        font, txt, 0, 0, txt_w, txt_h,
        220, 220, 220, 10, 10, 100,
        2000, 10, function() {
            console.log('TEXT COMPLETE.');
        });

    btn.onmouseover = function() {
        console.log('TEXT OPEN.');
        window.Tgs.forward();
    };

    btn.onmouseout = function() {
        console.log('TEXT CLOSE.');
        window.Tgs.backward();
    };

    window.addEventListener('resize', OnResize, false);
}, false);
