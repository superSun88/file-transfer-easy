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
    // $.ajax({
    //     type: "POST",
    //     url: config_info.online_url,
    //     data: {
    //         'ip': config_info.localhost
    //     },
    //     dataType: "json",
    //     success: function (data) {
    //         console.log(data)
    //     },
    //     error:function (data) {
    //         console.log(data)
    //     }
    // });


    /**获取当前在线ip
     *
     */
    // $.ajax({
    //     type: "GET",
    //     url: config_info.get_online_users_url,
    //     success: function (data) {
    //         var ipList = data.data;
    //         ipList.forEach((item,index,array)=>{
    //             if(item.ip !=  config_info.localhost){
    //                 var a = '<a class="panel-block" title="双击" ondblclick="mixInput(this)" nick-name="'+item.nickName+'"data="' + item.ip +
    //                     '"><span class="panel-icon">' +
    //                     '<i class="fa fa-desktop"></i></span><span style="color: dodgerblue">' +
    //                     item.nickName+" : "+item.ip + '</span></a>';
    //                 $("#onlineIpList").append(a);
    //             }
    //             //执行代码
    //         })
    //         // for(var i in ipList){

    //         //     if(ipList[i].ip !=  config_info.localhost){
    //         //         var a = '<a class="panel-block" title="双击" ondblclick="mixInput(this)" nick-name="'+ipList[i].nickName+'"data="' + ipList[i].ip +
    //         //             '"><span class="panel-icon">' +
    //         //             '<i class="fa fa-desktop"></i></span><span style="color: dodgerblue">' +
    //         //             ipList[i].nickName+" : "+ipList[i].ip + '</span></a>';
    //         //         $("#onlineIpList").append(a);
    //         //     }
    //         // }
    //         console.log(data)
    //     }
    // });

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
        console.log(data)
    }
});
});

