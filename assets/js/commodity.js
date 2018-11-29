var imageSrc
var index
$(document).ready(function () {
    //设置右上角账号名称
    document.getElementById('username').innerHTML = sessionStorage.getItem('username');
    //刷新table
    reFresh()
    //获取商品类目
    getAllCategory()
    //初始化fileinput
    $('#commodityImage').fileinput({
            'language': 'zh',
            'uploadUrl': "http://47.106.14.214:9033/api/uploadImage/uploadImg",
            'allowedFileExtensions': ['jpg','jpeg','png'],
            'showUpload': true,
            'previewFileType': 'any',
            'showPreview': false,
            'showRemove': false,
            'showCancel': false,
            'showCaption': false,
            'dropZoneEnabled': false,
            'maxFileCount': 1,
            'enctype': 'multipart/form-data',
    }).on("fileuploaded", function(event, data){
        console.log('图片上传成功')
        imageSrc = data.response.data
    })
    });

    //商品操作
    function operateCommodity(disable,btn){
        var status
        if (disable == 0) {
            console.log('点击将上架')
            status = 1
        } else {
            console.log('点击将下架')
            status = 0
        }
        var mydata = {
            "commodityId": btn.value,
            "disable": status,
            "token": sessionStorage.getItem('token')
        }
        var reqdata = JSON.stringify(mydata)
        $.ajax({
            method: "POST",
            url: "http://47.106.14.214:9033/api/commodity/upOrDownCommodity",
            contentType: "application/json;charset=utf-8",
            data: reqdata,
            async: false,
            success: function(res){
                alert(res.msg)
            }
        })
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

    //获取商品列表
    function reFresh()
    {
        var mydata = {
            "pageNo": 1,
            "pageSize": 1000,
            "disable": 1,
            "token": sessionStorage.getItem('token')
        }
        var reqdata = JSON.stringify(mydata)
        $.ajax({
            type: "POST",
            url: "http://47.106.14.214:9033/api/commodity/getCommodityList",
            contentType: "application/json;charset=utf-8",
            data: reqdata,
            success: function(res){
                if (res.code == "0000") {
                    var list = res.data.data
                // console.log(list)

                //添加订单记录
                for (var i = 0; i < list.length; i++) {
                    //数据转化处理
                    var disable,btnText;
                    // var date = timestampToTime(res.data[i].createTime)
                    if (list[i].disable == '0') {
                        disable = "否"
                        btnText = "上架"
                    } else {
                        disable = "是"
                        btnText = "下架"
                    }
                    //添加到table
                    var tr = "<tr class='odd gradeX'>";
                                                tr += "<td>" + list[i].commodityName + "</td>";
                                                tr += "<td>" + list[i].commodityPrice + "</td>";
                                                tr += "<td>" + list[i].commoditySpecification + "</td>";   
                                                tr += "<td>" + list[i].commodityImage + "</td>";
                                                tr += "<td>" + list[i].commodityNum + "</td>";
                                                tr += "<td>" + list[i].commodityCategory + "</td>";
                                                tr += "<td>" + disable + "</td>";
                    tr += "<td><button onclick='operateCommodity("+list[i].disable+",this)' class='btn btn-primary' value='"+list[i].commodityId+"'>"+btnText+"</button></td>";
                                                tr += "</tr>";
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
            }else {
                console.log(res)
                alert(res.msg)
            }
        }
    })
    }

    function getAllCategory(){
        var mydata = {"token": sessionStorage.getItem('token')}
        var reqdata = JSON.stringify(mydata)
        $.ajax({
            type: "POST",
            url: "http://47.106.14.214:9033/api/category/getAllCategory",
            contentType: "application/json;charset=utf-8",
            data: reqdata,
            success: function(res){
                if (res.code == "0000") {
                    sessionStorage.setItem('category', res.data)
                    // $('#dropdown_menu').contents().remove()
                    var h = "";
                    for (var i = 0; i < res.data.length; i++) {
                        // var a = "<li><a onclick=categoryChange("+i+")>"+res.data[i].categoryName+"</a></li>"
                        h += "<option value='" + i + "'>" + res.data[i].categoryName + "</option>";  
                        // $(<li><a href="#" id=res.data[i].categoryType value=res.data[i].categoryId>res.data[i].categoryName</a></li>).appendTo('#moderator-s');
                    }
                    $('#dropdown_menu').append(h)
                    console.log('更新商品类目成功')
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

    function categoryChange(i){
        console.log(i)
        var category = sessionStorage.getItem('category')
        console.log(category)
        index = parseInt(i)
        console.log(category[index].categoryName)
    }

    function addCommodity(){
        // console($('#dropdown_menu'))
        //商品类目处理
        var category = sessionStorage.getItem('category')
        //商品是否为首页处理
        var commodityType_value
        var commodityType = document.getElementByTagName('optionsRadiosInline')
        for (var i = 0; i < commodityType.length; i++) {
            if(commodityType[i].checked){
                commodityType_value = commodityType[i].value
            }
        }
        //商品是否上架处理
        var disable_value
        var disable = document.getElementByTagName('optionsRadiosInline1')
        for (var i = 0; i < disable.length; i++) {
            if (disable[i].checked) {
                disable_value = disable[i].value
            }
        }
        var mydata = {
            "categoryId": category[index].categoryId,
            "commodityCategory": category[index].categoryName,
            "commodityImage": imageSrc,
            "commodityName": document.getElementById('commodityName').value,
            "commodityNum": document.getElementById('commodityNum').value,
            "commodityPrice": document.getElementById('commodityPrice').value,
            "commoditySpecification": document.getElementById('commoditySpecification').value,
            "commodityType": commodityType_value,
            "disable": disable_value,
            "skuCode": document.getElementById('skuCode').value,
            "token": sessionStorage.getItem('token')
        }
        var reqdata = JSON.stringify(mydata)
        $.ajax({
            type: 'POST',
            url: "http://47.106.14.214:9033/api/advertising/addAdvertising",
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