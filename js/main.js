function OnResize() {

}


function ImgGradientShifter(
    div, div_w, div_h,
    pos_x, pos_y, pos_w, pos_h,
    img, img_src_x, img_src_y, img_src_w, img_src_h,
    mix_color_r, mix_color_g, mix_color_b,
    anim_delay, anim_step,
    complete_fn) {
    var cvs = document.createElement('canvas');
    cvs.width = div_w;
    cvs.height = div_h;
    var ctx = cvs.getContext("2d");
    var is_run = false;
    var dirn = 0;
    var anim;
    var shift = 0;
    var stop_alpha = 0;
    var ds = 1.0 / (anim_delay / anim_step);
    div.appendChild(cvs);

    function animation() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.drawImage(img, 0, 0);
        var grad = ctx.createLinearGradient(0, 0, cvs.width, 0);
        grad.addColorStop(0, 'rgba(' + mix_color_r + ',' + mix_color_g + ',' + mix_color_b + ',' + (1 - shift) + ')'); //',0)');
        ctx.drawImage(img, img_src_x, img_src_y, img_src_w, img_src_h, pos_x, pos_y, pos_w, pos_h);
        if (dirn) {
            if (0 < stop_alpha - (3 * ds)) {
                stop_alpha -= (3 * ds);
            } else if (0 < shift - ds) {
                stop_alpha = 0;
                shift -= ds;
            } else {
                is_run = false;
                shift = 0;
                clearInterval(anim);
                if (complete_fn) {
                    complete_fn()
                }
            }
        } else {
            if (shift + ds < 1) {
                shift += ds;
            } else if (stop_alpha + (3 * ds) < 1) {
                stop_alpha += (3 * ds);
            } else {
                stop_alpha = 1;
                is_run = false;
                shift = 1;
                clearInterval(anim);
                if (complete_fn) {
                    complete_fn()
                }
            }
        }
        var stop_grad_str = 'rgba(' + mix_color_r + ',' + mix_color_g + ',' + mix_color_b + ',' + (1 - stop_alpha) + ')';
        grad.addColorStop(shift, stop_grad_str);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cvs.width, cvs.height);
    }

    this.forward = function() {
        if (!is_run) {
            is_run = true;
            dirn = 0;
            anim = setInterval(animation, anim_step);
        } else {
            dirn = 0;
        }
    }

    this.backward = function() {
        if (!is_run) {
            is_run = true;
            dirn = 1;
            anim = setInterval(animation, anim_step);
        } else {
            dirn = 1;
        }
    }

    this.resize = function(w, h) {
        cvs.width = w;
        cvs.height = h;
    }
}


function TextGradientShifter(
    div,
    font, txt, txt_x, txt_y, txt_w, txt_h,
    txt_col_r1, txt_col_g1, txt_col_b1,
    txt_col_r2, txt_col_g2, txt_col_b2,
    anim_delay, anim_step,
    complete_fn) {

    var cvs = document.createElement('canvas');
    cvs.width = txt_x + txt_w - 1;
    cvs.height = txt_y + txt_h - 1;
    var ctx = cvs.getContext("2d");
    ctx.font = font;
    var is_run = false;
    var dirn = 0;
    var anim;
    var shift = 0;
    var ds = 1.0 / (anim_delay / anim_step);
    div.appendChild(cvs);

    var sub_r = txt_col_r1 - txt_col_r2;
    var sub_g = txt_col_g1 - txt_col_g2;
    var sub_b = txt_col_b1 - txt_col_b2;
    var stop_mix = 0;


   (function () {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        var grad = ctx.createLinearGradient(0, 0, cvs.width, 0);
        grad.addColorStop("0", 'rgba(' + txt_col_r1 + ',' + txt_col_g1 + ',' + txt_col_b1 + ')');
        grad.addColorStop("1", 'rgba(' + txt_col_r1 + ',' + txt_col_g1 + ',' + txt_col_b1 + ')');
        ctx.fillStyle = grad;
        ctx.fillText(txt, 0, cvs.height);
    })();


    function animation() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        var grad = ctx.createLinearGradient(0, 0, cvs.width, 0);
        if (dirn) {
            if (0 < (stop_mix - (ds * 3))) {
                stop_mix -= (ds * 3);
                grad.addColorStop("0", 'rgb(' + txt_col_r2 + ',' + txt_col_g2 + ',' + txt_col_b2 + ')');
                grad.addColorStop("1", 'rgb(' + (txt_col_r1 - (sub_r * stop_mix)) + ',' + (txt_col_g1 - (sub_g * stop_mix)) + ',' + (txt_col_b1 - (sub_b * stop_mix)) + ')');
            } else if (0 < (shift - ds)) {
                shift -= ds;
                grad.addColorStop("0", 'rgb(' + txt_col_r2 + ',' + txt_col_g2 + ',' + txt_col_b2 + ')');
                grad.addColorStop(shift, 'rgb(' + txt_col_r1 + ',' + txt_col_g1 + ',' + txt_col_b1 + ')');
            } else {
                shift = 0;
                stop_mix = 0;
                grad.addColorStop("0", 'rgb(' + txt_col_r1 + ',' + txt_col_g1 + ',' + txt_col_b1 + ')');
                grad.addColorStop("1", 'rgb(' + txt_col_r1 + ',' + txt_col_g1 + ',' + txt_col_b1 + ')');
                is_run = false;
                clearInterval(anim);
                if (complete_fn) {
                    complete_fn()
                }
            }
        } else {
            if ((shift + ds) < 1) {
                shift += ds;
                grad.addColorStop("0", 'rgb(' + txt_col_r2 + ',' + txt_col_g2 + ',' + txt_col_b2 + ')');
                grad.addColorStop(shift, 'rgb(' + txt_col_r1 + ',' + txt_col_g1 + ',' + txt_col_b1 + ')');
            } else if ((stop_mix + (ds * 3)) < 1) {
                stop_mix += (ds * 3);
                grad.addColorStop("0", 'rgb(' + txt_col_r2 + ',' + txt_col_g2 + ',' + txt_col_b2 + ')');
                grad.addColorStop("1", 'rgb(' + (txt_col_r1 - (sub_r * stop_mix)) + ',' + (txt_col_g1 - (sub_g * stop_mix)) + ',' + (txt_col_b1 - (sub_b * stop_mix)) + ')');
            } else {
                shift = 1;
                stop_mix = 1
                grad.addColorStop("0", 'rgba(' + txt_col_r2 + ',' + txt_col_g2 + ',' + txt_col_b2 + ')');
                grad.addColorStop("1", 'rgba(' + txt_col_r2 + ',' + txt_col_g2 + ',' + txt_col_b2 + ')');
                is_run = false;
                clearInterval(anim);
                if (complete_fn) {
                    complete_fn()
                }
            }
        }
        ctx.fillStyle = grad;
        ctx.fillText(txt, 0, cvs.height);
    }


    this.forward = function() {
        if (!is_run) {
            is_run = true;
            dirn = 0;
            anim = setInterval(animation, anim_step);
        } else {
            dirn = 0;
        }
    }

    this.backward = function() {
        if (!is_run) {
            is_run = true;
            dirn = 1;
            anim = setInterval(animation, anim_step);
        } else {
            dirn = 1;
        }
    }

    this.resize = function(w, h) {
        cvs.width = txt_x + w;
        cvs.height = txt_y + h;
    }
}


document.addEventListener("DOMContentLoaded", function() {
    // Пример встраивания эффекта картинки.
    var img_src = "images/img0.jpg";
    var img = new Image();
    img.onload = function() {
        var div = document.getElementById('test_div');
        var igs = new ImgGradientShifter(
            div, img.width, img.height,
            0, 0, img.width, img.height,
            img, 0, 0, img.width, img.height,
            250, 250, 250,
            4000, 10, function() {
                console.log('IMAGE COMPLETE.');
            });

        div.onmouseover = function() {
            console.log('IMAGE OPEN.');
            igs.forward();
        };

        div.onmouseout = function() {
            console.log('IMAGE CLOSE.');
            igs.backward();
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

    var tgs = new TextGradientShifter(
        btn,
        font, txt, 0, 0, txt_w, txt_h,
        220, 220, 220, 10, 10, 100,
        2000, 10, function() {
            console.log('TEXT COMPLETE.');
        });

    btn.onmouseover = function() {
        console.log('TEXT OPEN.');
        tgs.forward();
    };

    btn.onmouseout = function() {
        console.log('TEXT CLOSE.');
        tgs.backward();
    };

    // window.addEventListener('resize', OnWindowResize, false);
}, false);
