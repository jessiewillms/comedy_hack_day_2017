/*
----------------------------------------------------------------------
1. get data from spreadsheet
-----------------------------------------------------------------------
*/

var app = {

};

const url = "https://spreadsheets.google.com/feeds/list/1I1S0xuCvQbETfpfHFJQC7UGBqYpLv-RJFfLDKEr5L_w/1/public/values?alt=json-in-script&callback=?";

var getData = $.getJSON(url, function(data) {

    }).done(function(data) {
        app.analyseData(data);
        // console.log("done", data.feed.entry);
    })
    .fail(function() {
        console.log("error");
    })


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
    date: [],
    relatedcrime: [],
    map: [],
    post_it_note: [],
    length: 0
}

app.analyseData = function(data) {

        const entry = data.feed.entry;

        for (var i = 0; i < entry.length; i++) { // loop data
            app.userData.facebook.push(entry[i].gsx$facebook.$t);
            app.userData.twitter.push(entry[i].gsx$twitter.$t);
            app.userData.headline.push(entry[i].gsx$headline.$t);
            app.userData.image.push(entry[i].gsx$image.$t);
            app.userData.date.push(entry[i].gsx$date.$t);
            app.userData.relatedcrime.push(entry[i].gsx$relatedcrime.$t);
            app.userData.map.push(entry[i].gsx$map.$t);
            app.userData.post_it_note.push(entry[i].gsx$postit.$t);

            app.userData.length += 1;

        } // end loop


    } // end analyseData




/*
----------------------------------------------------------------------
3. canvas 
-----------------------------------------------------------------------
*/
app.makeCanvas = function(){
    // console.log('makeCanvas');
    // Set up the canvas for the entire wall.
    var canvas = document.getElementById('wall');
    canvas.width = 800;
    canvas.height = 600;
    var ctx = canvas.getContext('2d');

    // Width of each image attached to the wall.

    console.log( 'image', app.userData.image );

    var imageUrls = app.userData.image;
    // ['images/DJT_Headshot_V2.jpg', 'images/Patrick-Bateman-Axe.jpg'];
    var imageCenters = [];

    imageUrls.forEach(function (imageUrl, i) {
        
        var imageWidth = randomTime(100, 400);
        // Load the image.
        var img = new Image();
        img.src = imageUrl;
        img.onload = function () {
            var ratio = imageWidth / img.width;

            // Create a new canvas for the image, and draw the image on it to scale.
            var imgCanvas = document.createElement('canvas');
            imgCanvas.width = imageWidth;
            imgCanvas.height = img.height * ratio;
            var imgCtx = imgCanvas.getContext('2d');
            imgCtx.scale(ratio, ratio);
            imgCtx.drawImage(img, 0, 0);

            // Pick a random spot on the wall to attach the image.
            var x = Math.floor(Math.random() * (canvas.width - imageWidth));
            var y = Math.floor(Math.random() * (canvas.height - img.height * ratio));
            ctx.drawImage(imgCanvas, x, y);

            // Save the x, y of a point on the image where we can attach a string.
            imageCenters.push({x: x + imgCanvas.width * .5, y: y + imgCanvas.height * .9});

            drawStrings();
        }
    });

    function drawStrings() {
        // Wait until we have attached all the images before drawing strings.
        if (imageCenters.length < imageUrls.length) {
            return;
        }

        while (imageCenters.length > 1) {
            // Get the coordinates of two images at random.
            var img1 = imageCenters.splice(Math.floor(Math.random() * imageCenters.length), 1)[0];
            var img2 = imageCenters.splice(Math.floor(Math.random() * imageCenters.length), 1)[0];

            var stringColor = '#ff0000';
            var stringWidth = 2;
            var gravity = 30;

            // Draw a curved line between the two images.
            ctx.beginPath();
            ctx.strokeStyle = stringColor;
            ctx.lineWidth = stringWidth;
            ctx.moveTo(img1.x, img1.y);
            ctx.bezierCurveTo(img1.x, img1.y + gravity, img2.x, img2.y + gravity, img2.x, img2.y);
            ctx.stroke();
        }
    }

    function getMapUrl(marker) {
        // https://developers.google.com/maps/documentation/static-maps/intro

        var params = {
            size: '300x300',
            zoom: 13,
            style: ['feature:poi|visibility:off', 'feature:administrative|visibility:off'],
            markers: encodeURIComponent(marker)
        };

        var qs = Object.keys(params).map(function (key) {
            return [].concat(params[key]).map(function (value) {
                return key + '=' + value;
            }).join('&');
        }).join('&');

        return 'https://maps.googleapis.com/maps/api/staticmap?' + qs;
    }

}
/*
----------------------------------------------------------------------
4. a murderer?
-----------------------------------------------------------------------
*/

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

app.isMurdererInteractive = function() {
    const randomNumber = randomTime(100, 600);

    $('.wrapper-answer, .wrapper-again, #murder-interactive').removeClass('js-hide');
    $('.wrapper-answer h2').html('Yes →');

    console.log( app.userData['facebook'][randomNumber] );

    Object.values(app.userData['facebook']).map(function(key){
      return app.userData[randomNumber];
      console.log( app.userData['facebook'][randomNumber] );
  });

  app.makeCanvas();
}

app.isNotMurdererInteractive = function() {
    // console.log('NOPE');
    $('.wrapper-answer').removeClass('js-hide');
    $('.wrapper-answer h2').html('No ... some funny joke →');
    $('#murder-interactive, .wrapper-again  ').addClass('js-hide');
}


$('.person-img').click(function() {
    // console.log('yes');

    if ($(this).data('is-murderer') == 'yes') {
        console.log('yes');
        app.isMurdererInteractive();
    } else {
        console.log('no');
        app.isNotMurdererInteractive();
    }
});


/*
----------------------------------------------------------------------
5. reset
-----------------------------------------------------------------------
*/
$('button.js-reset').on('click',function(){
    app.isMurdererInteractive();
    // location.reload();
});


