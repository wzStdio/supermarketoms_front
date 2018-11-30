
var imageSrc
var host = "http://47.106.14.214:9033/api"
//广告操作
function operateAd(disable,btn){
    var mydata = {
        "advertisingId": btn.value,
        "token": sessionStorage.getItem('token')
    }
    var reqdata = JSON.stringify(mydata)
    if (disable=='0') {
        $.ajax({
            method: "POST",
            url: host + "/advertising/deleteAdvertising",
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
    } else {
        // console.log('启用')
    }
    window.location.reload()
}
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

//添加广告
function addAd(){
    //拿返回来的图片链接进行广告添加
    var mydata = {
        "advertisingTitle": document.getElementById('adTittle').value,
        "advertisingContent": document.getElementById('adContent').value,
        "advertisingImage": imageSrc,
        "token": sessionStorage.getItem('token')
    }
    var reqdata = JSON.stringify(mydata)
    $.ajax({
        type: 'POST',
        url: host + "/advertising/addAdvertising",
        contentType: "application/json;charset=utf-8",
        data: reqdata,
        async: false,
        success: function(res){
            if (res.code = "0000") {
                alert('添加成功')
            }
            else if (res.code == "1001"){
                console.log('token error')
                alert(res.msg)
                window.location.href='./login.html'
            } else {
                alert(res.msg)
            }
            $('#myModal').modal('hide')
            window.location.reload()
        }
    })
}


$(document).ready(function () {
    document.getElementById('username').innerHTML = sessionStorage.getItem('username')
    reFresh()

    $('#multipartFile').fileinput({
        'language': 'zh',
        'uploadUrl': host + "/uploadImage/uploadImg",
        'allowedFileExtensions': ['jpg','jpeg','png'],
        'showUpload': true,
        'showCancel':false,
        'showCaption':false,
        'showRemove': false,
        'previewFileType': 'any',
        'showPreview': false,
        'dropZoneEnabled': false,
        'maxFileCount': 1,
        'enctype': 'multipart/form-data',
    }).on("fileuploaded", function(event, data){
    	// console.log('图片上传成功')
    	imageSrc = data.response.data
    })
    
});

function reFresh()
{
    var mydata = {"token": sessionStorage.getItem('token')}
    var reqdata = JSON.stringify(mydata)
    $.ajax({
        type: "POST",
        url: host + "/advertising/getAllAdvertising",
        contentType: "application/json;charset=utf-8",
        data: reqdata,
        success: function(res){
            if (res.code == "0000") {
            //添加订单记录
            for (var i = 0; i < res.data.length; i++) {
                var disable,btnText;
                var date = timestampToTime(res.data[i].createTime)
                //console.log(date)
                if (res.data[i].disable == '0') {
                    disable = "否"
                    btnText = "禁用"
                } else {
                    disable = "是"
                    btnText = "无法操作"
                }

                //添加到表格中
                var tr = "<tr class='odd gradeX'>";
                                            tr += "<td>" + res.data[i].advertisingTitle + "</td>";
                                            tr += "<td>" + res.data[i].advertisingImage + "</td>";
                                            tr += "<td>" + res.data[i].advertisingContent + "</td>";   
                                            tr += "<td>" + date + "</td>";
                                            tr += "<td>" + disable + "</td>";
                tr += "<td><button onclick='operateAd("+res.data[i].disable+",this)' class='btn btn-primary' value='"+res.data[i].advertisingId+"'>"+btnText+"</button></td>";
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
}