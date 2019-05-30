const config_info = require('./config.js');
const {
    ipcRenderer
} = require('electron')

window.$ = window.jQuery = require('jquery');
$(function () {

    /**查看该ip是否已经记录到db
     * 如果已经存在则修改online为1
     * 否则进行记录
     *
     */
    $.ajax({

        type: "POST",

        url: config_info.online_url,

        data: {
            'ip': config_info.localhost
        },

        dataType: "json",

        success: function (data) {
            data = JSON.parse(data);
            console.log(data)

        }

    });


    /**获取当前在线ip
     *
     */
    $.ajax({

        type: "GET",

        url: config_info.get_online_users_url,
        success: function (data) {
            data = JSON.parse(data);
            console.log(data)

        }

    });

});

ipcRenderer.on('offline', (event, data) => {

$.ajax({

    type: "POST",

    url: config_info.offline_url,

    data: {
        'ip': config_info.localhost
    },

    dataType: "json",

    success: function (data) {
        data = JSON.parse(data);
        console.log(data)

    }

});
});

