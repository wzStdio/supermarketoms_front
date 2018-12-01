// var host = "http://47.106.14.214:9033/api"
var host = "https://www.zzh1019.cn/supermarket/api"
//时间戳转时间
function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}
//订单操作
function operateOrder(disable,btn){
    var mydata = {
        "orderId": btn.value
        // "token": sessionStorage.getItem('token')
    }
    var reqdata = JSON.stringify(mydata)
    if (disable=='0') {
        $.ajax({
            method: "POST",
            url: host + "/order/finishOrder",
            contentType: "application/json;charset=utf-8",
            data: reqdata,
            async: false,
            success: function(res){
                if (res.code == "0000") {
                	alert(res.msg)
                } else if (res.code == "1001"){
                	console.log('token error')
                	alert(res.msg)
                	window.location.href='./login.html'
            	}else {
                	console.log(res)
                	alert(res.msg)
            	}          
            }
        })
        console.log('禁用')
        window.location.reload()
    } else {
        // console.log('启用')
    }
}

$(document).ready(function () {
    // $('#dataTables-example').dataTable({
    //     bFilter: false,    //去掉搜索框方法三：这种方法可以
    //     bLengthChange: false,   //去掉每页显示多少条数据方法
    // });
});

document.getElementById('username').innerHTML = sessionStorage.getItem('username')
var mydata = {"token": sessionStorage.getItem('token')}
//console.log(sessionStorage.getItem('token'))
var reqdata = JSON.stringify(mydata)
$.ajax({
    type: "POST",
    url: host + "/order/getOrderList",
    contentType: "application/json;charset=utf-8",
    data: reqdata,
    success: function(res){
        if (res.code == "0000") {
            //添加订单记录
            for (var i = 0; i < res.data.length; i++) {
                var disable,btnText,btn_style;
                var date = timestampToTime(res.data[i].createTime)
                //console.log(date)
                if (res.data[i].orderStatus == '0') {
                    disable = "未完成"
                    btnText = "标记为完成"
                    btn_style = "btn-primary"
                } else {
                    disable = "已完成"
                    btnText = "无法操作"
                    btn_style = "disabled"
                }

                var tr = "<tr class='odd gradeX'>";
                    tr += "<td>" + res.data[i].orderId + "</td>";
                    tr += "<td>" + res.data[i].commodityName + "</td>";
                    tr += "<td>" + res.data[i].orderNum + "</td>";   
                    tr += "<td>" + res.data[i].orderPrice + "</td>";
                    tr += "<td>" + res.data[i].userName + "</td>";
                    tr += "<td>" + res.data[i].telephone + "</td>";
                    tr += "<td>" + res.data[i].fullAddress + "</td>";
                    tr += "<td>" + date + "</td>";
                    tr += "<td>" + disable + "</td>";
                    tr += "<td><button onclick='operateOrder("+res.data[i].orderStatus+",this)' class='btn "+btn_style+"' value='"+res.data[i].orderId+"'>"+btnText+"</button></td>";
                    tr += "</tr>";
                    $("#table-body").append(tr);
            }
            $('#dataTables-example').dataTable({
                //bFilter: false,    //去掉搜索框方法三：这种方法可以
                bLengthChange: false,   //去掉每页显示多少条数据方法
                striped: true,  //隔行变色的效果

            });
        } else if (res.code == "1001"){
            console.log('token error')
            alert(res.msg)
            window.location.href='./login.html'
        } else {
            alert(res.msg)
        }
    }
})

            // function searchfun(){
            //     var orderId = document.getElementById('orderId').value
            //     var telephone = document.getElementById('telephone').value
            //     var table = $('dataTables-example').dataTable().fnFilter(telephone)
            //     // table.column(0).search(orderId).column(5).search(telephone).draw()
            // }