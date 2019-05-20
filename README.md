# Cloudflare Dynamic DNS Updater
A script to automatically update Cloudflare DNS records with your public IP. Suitable for home web servers, etc.

## config.json
Rename ``config-sample.json`` and fill out the fields as described below

**email** - Provide the email used to manage your Cloudflare account

**apiKey** - Under "My Profile", find your Global API key and provide it here

**zoneId** - Found at the bottom of zone dashboard

**listZoneIds** - Useful for logging the IDs of your Cloudflare DNS records for the config.
	``"listZoneIds": true/false``
	
**updateRecords** - Boolean to turn off updating records. Useful if you don't want to change any schedules running this script
	``"updateRecords": true/false``

**dnsRecords** - An array of DNS records that you wish to change. Provide the ID of the record (see above). 

    {
        "id": "ID_OF_DNS_RECORD",
        "updatePublicIp": true,
        "enableProxy":true
    }

 - **enableProxy** - Allows you update the record, ensuring if the DNS proxy is enabled or disabled.
 - **updatePublicIP** - If true, will update the record with the public IP of the device it's running on

## Automation
In Linux, run ``crontab -e`` and provide one of the following lines to make this script run regularly. Please check the path of the script first.

**Hourly (on the hour)** 
``0 * * * * node /home/{USER}/cloudflare-ddns-updater/index.js > /dev/null 2>&1``

**Daily at 00:00**
``0 0 * * * node /home/{USER}/cloudflare-ddns-updater/index.js > /dev/null 2>&1``
