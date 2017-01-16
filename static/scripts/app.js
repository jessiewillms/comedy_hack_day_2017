/*
----------------------------------------------------------------------
1. get data from spreadsheet
-----------------------------------------------------------------------
*/

var app = {

};

const urls = {
    'conor holler': 'https://spreadsheets.google.com/feeds/list/1I1S0xuCvQbETfpfHFJQC7UGBqYpLv-RJFfLDKEr5L_w/1/public/values?alt=json-in-script&callback=?',
    'marcus kamps': 'https://spreadsheets.google.com/feeds/list/1I1S0xuCvQbETfpfHFJQC7UGBqYpLv-RJFfLDKEr5L_w/2/public/values?alt=json-in-script&callback=?'
};

/*
----------------------------------------------------------------------
2. helper functions
-----------------------------------------------------------------------
*/

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/*
----------------------------------------------------------------------
2. collect all information
-----------------------------------------------------------------------
*/


app.userData = {
    facebook: [],
    twitter: [],
    headline: [],
    image: [],
    personalimage: [],
    symbols: [],
    date: [],
    relatedcrime: [],
    map: [],
    post_it_note: [],
    length: 0
}


function getRandomElement(arr) {
    return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
}

app.analyseData = function(data) {

    app.userData = {
        facebook: [],
        twitter: [],
        headline: [],
        image: [],
        personalimage: [],
        symbols: [],
        date: [],
        relatedcrime: [],
        map: [],
        post_it_note: [],
        length: 0
    }

        const entry = data.feed.entry;

        for (var i = 0; i < entry.length; i++) { // loop data

            if (entry[i].gsx$facebook.$t !== "" ) {
                app.userData.facebook.push(entry[i].gsx$facebook.$t);
            }

            if (entry[i].gsx$personalimage.$t !== "") {
                app.userData.personalimage.push(entry[i].gsx$personalimage.$t);
            }

            if (entry[i].gsx$symbols.$t !== "") {
                app.userData.symbols.push(entry[i].gsx$symbols.$t);
            }

            if (entry[i].gsx$twitter.$t !== "") {
                app.userData.twitter.push(entry[i].gsx$twitterimages.$t);
            }

            if (entry[i].gsx$headline.$t !== "") {
                app.userData.headline.push(entry[i].gsx$headline.$t);
            }

            if (entry[i].gsx$image.$t !== "") {
                app.userData.image.push(entry[i].gsx$image.$t);
            }

            if (entry[i].gsx$date.$t !== "") {
                app.userData.date.push(entry[i].gsx$date.$t);
            }

            if (entry[i].gsx$relatedcrime.$t !== "") {
                app.userData.relatedcrime.push(entry[i].gsx$relatedcrime.$t);
            }

            if ( entry[i].gsx$map.$t  !== "") {
                app.userData.map.push(entry[i].gsx$map.$t);
            }

            if (entry[i].gsx$postit.$t !== "") {
                app.userData.post_it_note.push(entry[i].gsx$postit.$t);
            }

            app.userData.length += 1;

        } // end loop

    } // end analyseData

/*
----------------------------------------------------------------------
3. canvas
-----------------------------------------------------------------------
*/

app.makeCanvas = function(){
    var doc_canvas_width = 2000;
    var doc_canvas_height = 800;

    // Set up the canvas for the entire wall.
    var canvas = document.getElementById('wall');
    canvas.width = doc_canvas_width;
    canvas.height = doc_canvas_height;
    var ctx = canvas.getContext('2d');

    var imageCenters = [];

    function getImages(imageUrl) {
        if (!imageUrl) {
            return;
        }

        // Width of each image attached to the wall.
        var width = randomTime(150, 350);

        // Load the image.
        var img = new Image();
        img.src = imageUrl;
        img.onload = function () {
            placeImage(img, width);
        }
    }

    function getPersonalImages(imageUrl) {
        if (!imageUrl) {
            return;
        }

        // Width of each image attached to the wall.
        var width = randomTime(250, 380);

        // Load the image.
        var img = new Image();
        img.src = imageUrl;
        img.onload = function () {
            placeImage(img, width);
        }
    }

    function getSymbols(imageUrl) {
        if (!imageUrl) {
            return;
        }

        // Width of each image attached to the wall.
        var width = randomTime(120, 320);

        // Load the image.
        var img = new Image();
        img.src = imageUrl;
        img.onload = function () {
            placeImage(img, width);
        }
    }

    function getFacebook(imageUrl) {
        if (!imageUrl) {
            return;
        }

        // Width of each image attached to the wall.
        var width = 300;

        // Load the image.
        var img = new Image();
        img.src = imageUrl;
        img.onload = function () {
            placeImage(img, width);
        }
    }

    function getTwitter(imageUrl) {
        if (!imageUrl) {
            return;
        }

        // Width of each image attached to the wall.
        var width = 300;

        // Load the image.
        var img = new Image();
        img.src = imageUrl;
        img.onload = function () {
            placeImage(img, width);
        }
    }

    function getMaps(mapMarker) {
        if (!mapMarker) {
            return;
        }

        var params = {
            size: '300x300',
            zoom: 13,
            style: ['feature:administrative|visibility:off'],
            markers: encodeURIComponent(mapMarker)
        };

        var qs = Object.keys(params).map(function (key) {
            return [].concat(params[key]).map(function (value) {
                return key + '=' + value;
            }).join('&');
        }).join('&');

        // Load the image.
        var img = new Image();
        img.src = 'https://maps.googleapis.com/maps/api/staticmap?' + qs;
        img.onload = function () {
            placeImage(img, 300);
        }
    }


    function getPostIt(text) {
        if (!text) {
            return;
        }

        var font_size_string = parseInt( randomTime(50, 300) ) + " serif";

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://fonts.googleapis.com/css?family=Gloria+Hallelujah';
        document.getElementsByTagName('head')[0].appendChild(link);

        // Trick from http://stackoverflow.com/questions/2635814/
        var image = new Image;
        image.src = link.href;
        image.onerror = function() {
            var rot = (Math.random() * 40 - 20) * Math.PI / 180;
            ctx.rotate(rot);
            ctx.font = '44px "Gloria Hallelujah"';
            ctx.fillStyle = '#c00';
            ctx.fillText(text, randomTime(200, doc_canvas_width - 200), randomTime(100, doc_canvas_height - 100));
            ctx.rotate(-rot);
        };
    }


    function getHeadlines(text) {
        if (!text) {
            return;
        }

        var split_text = text.split(" ");

        // console.log(split_text, i);
        var starting_number = Math.floor(Math.random() * split_text.length - 3);

        var final_text = split_text.map(function(word, i){
            if (i === starting_number) {
                return '<span style="color:black; background-color: black">' + word
            } else if (i === starting_number + 3) {
                return word + '</span>'
            } else {
                return word;
            }
        }).join(" ");

        var width = 400;

        var headline_redacted = (
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
                '<foreignObject width="100%" height="100%">' +
                    '<div xmlns="http://www.w3.org/1999/xhtml" style="background: #ffe; font-size: 42px; padding: 20px 10px;">' +
                        final_text +
                    '</div>' +
                '</foreignObject>' +
            '</svg>'
        );

        var DOMURL = window.URL || window.webkitURL || window;
        var img = new Image();

        var svg = new Blob([headline_redacted], {type: 'image/svg+xml'});
        var url = DOMURL.createObjectURL(svg);

        img.src = url;
        img.onload = function () {
            ctx.shadowColor = '#999';
            ctx.shadowBlur = 13;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            DOMURL.revokeObjectURL(url);

            placeImage(img, width);
        }
    }

    function placeImage(img, width) {
        var ratio = width / img.width;

        // Create a new canvas for the image, and draw the image on it to scale.
        var imgCanvas = document.createElement('canvas');
        imgCanvas.width = width;
        imgCanvas.height = img.height * ratio;

        var imgCtx = imgCanvas.getContext('2d');
        imgCtx.scale(ratio, ratio);
        imgCtx.drawImage(img, 0, 0);
        imgCtx.scale(1 / ratio, 1 / ratio);

        // Pick a random spot on the wall to attach the image.
        var x = Math.floor(Math.random() * (doc_canvas_width - imgCanvas.width));
        var y = Math.floor(Math.random() * (doc_canvas_height - imgCanvas.height));

        ctx.drawImage(imgCanvas, x, y);

        // Return the x, y of a point on the image where we can attach a string.
        imageCenters.push({x: x + imgCanvas.width * .5, y: y + imgCanvas.height * .9});
    }


    function drawStrings() {
        console.log(imageCenters.length, (how_paranoid_value * 5))
        // Wait until we have attached all the images before drawing strings.
        // if (imageCenters.length < (how_paranoid_value * 5)) {
        //     return false;
        // }

        var stringColors = ['#c00', '#00c', '#333'];

        while (imageCenters.length > 1) {
            // Get the coordinates of two images at random.
            var img1 = getRandomElement(imageCenters);
            var img2 = getRandomElement(imageCenters);

            var stringColor = stringColors[Math.floor(Math.random() * stringColors.length)];
            var stringWidth = 3;
            var gravity = 30;

            // Draw a curved line between the two images.
            ctx.beginPath();
            ctx.strokeStyle = stringColor;
            ctx.lineWidth = stringWidth;
            ctx.moveTo(img1.x, img1.y);
            ctx.bezierCurveTo(img1.x, img1.y + gravity, img2.x, img2.y + gravity, img2.x, img2.y);
            ctx.stroke();
        }

        return true;
    }

    // functions

    for (var i = 0; i < how_paranoid_value; i++) {
        getMaps(getRandomElement(app.userData.map));
        getFacebook(getRandomElement(app.userData.facebook));
        getTwitter(getRandomElement(app.userData.twitter));
        getSymbols(getRandomElement(app.userData.symbols));
        getImages(getRandomElement(app.userData.image));
        getHeadlines(getRandomElement(app.userData.headline));
        getPersonalImages(getRandomElement(app.userData.personalimage));
    }

    for (var i = 0; i < how_paranoid_value; i++) {
        getPostIt(getRandomElement(app.userData.post_it_note));
    }



    setTimeout(drawStrings, 500);
}
/*
----------------------------------------------------------------------
4. a murderer?
-----------------------------------------------------------------------
*/

app.isMurdererInteractive = function(name) {
    const randomNumber = randomTime(100, 600);

    $('.wrapper-answer, .wrapper-again, #murder-interactive').removeClass('js-hide');

    console.log(get_input_name)

    // console.log( app.userData['facebook'][randomNumber] );

    Object.values(app.userData['facebook']).map(function(key){
      return app.userData[randomNumber];
      // console.log( app.userData['facebook'][randomNumber] );
  });

  $.getJSON(urls[name], function(data) {
      }).done(function(data) {
          app.analyseData(data);
          app.makeCanvas();
          // console.log("done", data.feed.entry);
      })
      .fail(function() {
          console.log("error");
      })

}

app.isNotMurdererInteractive = function() {
    // console.log('NOPE');
    $('.wrapper-answer').removeClass('js-hide');
    $('.wrapper-answer h2').html('Nothing suspicious going on here. ');
    $('#murder-interactive, .wrapper-again  ').addClass('js-hide');
}


/*
----------------------------------------------------------------------
5. click event to launch interactive
-----------------------------------------------------------------------
*/
let how_paranoid_value;
let get_input_name;
$('#submit_button').click(function() {

    how_paranoid_value = $('input[name="how_paranoid"]:checked').val();

    get_input_name = $('input[name="friends-name"]').val().toLowerCase();

    if (!how_paranoid_value) {
        console.log('pick something');
    }
    else if (get_input_name in urls) {
        app.isMurdererInteractive(get_input_name);

        $('.wrapper-answer h2').html(get_input_name);
        // console.log('yes');
    } else {
        // console.log('no');
        app.isNotMurdererInteractive();
    }
});

/*
----------------------------------------------------------------------
5. reset
-----------------------------------------------------------------------
*/
$('button.js-reset').on('click',function(){
    app.isMurdererInteractive(get_input_name);
});

// var canvas = document.getElementById("wall");
// var dataURL = canvas.toDataURL();

// var fullQuality = canvas.toDataURL("image/jpeg", 1.0);
// var mediumQuality = canvas.toDataURL("image/jpeg", 0.5);
// var lowQuality = canvas.toDataURL("image/jpeg", 0.1);
// console.log(fullQuality);

// function downloadCanvas(fullQuality, canvas, filename) {
//     fullQuality.href = document.getElementById(canvas).toDataURL();
//     fullQuality.download = filename;
// }

// document.getElementById('download').addEventListener('click', function() {
//     downloadCanvas(this, 'canvas', 'test.png');
// }, false);
