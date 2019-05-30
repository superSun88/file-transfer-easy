const config_info = require('./config.js.js');

console.log(config_info.online_url);
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

$(function () {
    const ip = getLocalIP();

/**查看该ip是否已经记录到db
     * 如果已经存在则修改online为1
     * 否则进行记录
     * 
     */
    $.ajax({

        type: "POST",

        url: config_info.online_url,

        data: {
            'ip': ip
        },

        dataType: "json",

        success: function (data) {
            data = JSON.parse(data);
            console.log(data)

        }

    });

});
