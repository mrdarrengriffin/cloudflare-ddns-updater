var externalip = require('externalip')
const fs = require('fs')

var config = JSON.parse(fs.readFileSync(__dirname+'/config.json').toString())

var cf = require('cloudflare')({
    email: config.email,
    key: config.apiKey
});

async function getPublicIp() {
    return new Promise((resolve, reject) => {
        externalip((error, ip) => {
            if (!error) {
                resolve(ip)
            }
            reject(error)
        })
    })
}

if (config.listDNSRecordIds) {
    cf.dnsRecords.browse(config.zoneId).then(recordsData => {
        var records = recordsData.result
        records.forEach(record => {
            console.log("(%s) %s > %s", record.type, record.name, record.content)
            console.log("Record ID: %s", record.id)
            console.log("Proxied: %s\n", record.proxied)
        })
    })
}


if (config.updateRecords) {
    getPublicIp().then(ip => {
        config.dnsRecords.forEach(dnsRecord => {
            cf.dnsRecords.read(config.zoneId, dnsRecord.id).then(recordData => {
                var record = recordData.result
                if(dnsRecord.updatePublicIp){
                    record.content = ip
                }
                record.proxied = dnsRecord.enableProxy
                cf.dnsRecords.edit('aaad46b3d8335e8519c94a0700deff81', dnsRecord.id, record).then(recordUpdateResult => {
                    var recordUpdate = recordUpdateResult.result
                    console.log("(%s) %s > %s", recordUpdate.type, recordUpdate.name, recordUpdate.content)
                    console.log("Update Status:", (recordUpdateResult.success ? "Success" : "Fail"))
                    console.log("Record ID: %s", recordUpdate.id)
                    console.log("Proxied: %s\n", recordUpdate.proxied)
                })
            })
        })
    })
}