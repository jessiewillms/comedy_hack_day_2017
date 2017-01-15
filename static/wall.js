// Set up the canvas for the entire wall.
var canvas = document.getElementById('wall');
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext('2d');

// Width of each image attached to the wall.
var imageWidth = 100;

var imageUrls = ['images/DJT_Headshot_V2.jpg', 'images/Patrick-Bateman-Axe.jpg'];
var imageCenters = [];

imageUrls.forEach(function (imageUrl, i) {
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
