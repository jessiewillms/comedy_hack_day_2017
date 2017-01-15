'use strict';

const express = require('express');
const fbgraph = require('fbgraph');
const request = require('request');

const app = express();

const appId = 1545532078810189;
const appSecret = 'f14e0f17f4f47861bd1cb55a6b5cd3b6';
const redirectUri = 'https://crazywall.herokuapp.com/auth/fb/callback/' + new Date().valueOf();

let accessToken = null;
let userId = null;

fbgraph.setVersion('2.8');

app.get('/auth/fb', (req, res) => {
    const authUrl = fbgraph.getOauthUrl({
        client_id: appId,
        redirect_uri: redirectUri,
        scope: 'user_status, user_photos, user_tagged_places, friend_status, friend_photos'
    });

    res.redirect(authUrl);

    // res.redirect(`https://www.facebook.com/v2.8/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}`);
});

app.get('/auth/fb/callback/:id', (req, res, next) => {
    fbgraph.authorize(
        {
            client_id: appId,
            redirect_uri: redirectUri,
            client_secret: appSecret,
            code: req.query.code
        },
        (err, resp) => {
            if (err) {
                return next(err);
            }

            console.log(resp);
            accessToken = resp.access_token;
            fbgraph.setAccessToken(resp.access_token);

            fbgraph.get('me', (err, resp) => {
                if (err) {
                    return next(err);
                }

                console.log(resp);
                userId = resp.id;

                res.redirect('/user/fb');
            });
        });

    // request.get(
    //     {
    //         uri: 'https://graph.facebook.com/v2.8/oauth/access_token',
    //         qs: {
    //             client_id: appId,
    //             redirect_uri: redirectUri,
    //             client_secret: appSecret,
    //             code: req.query.code
    //         },
    //         json: true
    //     },
    //     (err, resp, body) => {
    //         if (err || resp.statusCode !== 200) {
    //             return next(err || new Error('Status code ' + resp.statusCode));
    //         }
    //
    //         accessToken = body.access_token;
    //         fbgraph.setAccessToken(body.access_token);
    //
    //         res.redirect('/');
    //     });
});

app.get('/logout/fb', (req, res, next) => {

});

app.get('/user/fb', (req, res, next) => {
    fbgraph.setAccessToken(accessToken);
    fbgraph.get(req.query.user || 'me' + (req.query.item ? `/${req.query.item}` : ''), (err, resp) => {
        if (err) {
            return next(err);
        }
        res.jsonp(resp);
    });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Error');
});

app.use(express.static('static'));


const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port', port);
