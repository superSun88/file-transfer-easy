const url_prefix = 'http://10.13.14.45:8080/';
var config = { 
    'online_url':url_prefix+'onlineUser',
    'offline_url':url_prefix+'offlineUser',
    'get_online_users_url':url_prefix+'get_online_users',
    'localhost':getLocalIP()
}

function getLocalIP() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }

}
module.exports = config;