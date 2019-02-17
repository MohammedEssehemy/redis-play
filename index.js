const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient();


client.on("error", function (err) {
    console.log("Error " + err);
});


Array.from({length: 10}, (e,i)=>i)
.forEach((e)=>{
client.set(`animals:toFeed:${e}`, e);
});

let promisifiedScan = function(){
	return new Promise((resolve,reject)=>{
		client.scan.call(client, ...arguments, (err,res)=>{
			if(err) return reject(err);
			return resolve(res);
		});
	})
}

async function scanAsync(cursor, pattern, results) {
    return promisifiedScan(cursor, 'MATCH', pattern, 'COUNT', '10')
        .then(function(reply) {
        	debugger;
            let keys = reply[1]
            keys.forEach(function(key, cursor) {
                    results.push(key)
                });
            cursor = reply[0]
            if(cursor === '0') {
                console.log('Scan complete')
            	return results;
            } else {
                console.log('Match #', cursor)
                return scanAsync(cursor, pattern, results)
            }
        }).catch(err=>{
        	debugger;
        })
}

let keys = []
let prefix = 'animals:toFeed:*'
client.once('connect', ()=>{
	scanAsync('0', prefix, keys)
	.then(console.log.bind(null,'kjrgjhehrjkeghjrghk'))
})