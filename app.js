const express = require("express");
const app = express();
const port = 5000;
const geoip = require('geoip-lite');
const whois = require('whois-json');
const dns = require('dns');

app.get("/WhoIs", (req, res, next) => res.send("No WhoIs data yet"))

app.post("/WhoIs", (req, res, next) => {
    if(req.method == 'POST') {
        let body = '';
        req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
        });

        req.on('end', () => {
            (async function(){
                var results = await whois(body, {follow: 3, verbose: true});
                var whoIs_data = JSON.stringify(results);
                res.send(whoIs_data);
            })()
            
        });
    }
})

app.get("/GeoIP", (req, res, next) => res.send("No geographical data yet"));

app.post("/GeoIP", (req, res, next) => {
    if(req.method == 'POST') {
        let body = '';
        req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
        });
        

        req.on('end', () => {
            let domain = dns.lookup(body, function(err, addresses, family){
            var geo = geoip.lookup(addresses);
            console.log(geo);
            res.send(geo);
            })
        })
             
        
    }
    
})

app.listen(port, () => console.log(`example app listening on port ${port}!`));