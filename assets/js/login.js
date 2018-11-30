var host = "http://47.106.14.214:9033/api"
window.onload = function(){
    var username = document.getElementById('username')
    var psw = document.getElementById('psw')
    var remember = document.getElementById('remember')
    if (getCookie('username') && getCookie('psw')) {
        if (getCookie('username')[1] == 'null') {
            username.value = ''
            psw.value = ''
            remember.checked = false
        } else{
            username.value = getCookie('username')[1]
            psw.value = getCookie('psw')[1]
            remember.checked = true
        }
    }

    remember.onchange = function(){
        if (!this.checked) {
            delCookie('username')
            delCookie('psw')
        }
    }
}
function login() {
    //如果勾选了记住密码则保存cookie
    var remember = document.getElementById('remember')
    if (remember.checked == true) {
        setCookie('username', document.getElementById('username').value, 7)
        setCookie('psw', document.getElementById('psw').value, 7)
    }
    var mydata = {
        "password": document.getElementById('psw').value,
        "username": document.getElementById('username').value
    }
    if (mydata.password=="" || mydata.username=="") {
        alert('用户名或密码不能为空！')
    } else {
        var reqdata = JSON.stringify(mydata);
        $.ajax({
            type: "POST",
            url: host + "/user/omsLogin",
            contentType: "application/json;charset=utf-8",
            data: reqdata,
            success: function(res){
                if (res.code == "0000") {
                    console.log('login success')
                    sessionStorage.setItem('token', res.data.token)
                    sessionStorage.setItem('username', res.data.userName)
                    window.location.href='./order.html'
                } else {
                    alert(res.msg)
                    console.log('login fail')
                }
            }
        })
    }
}

function setCookie(name, value, day){
    var date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = name + '=' + value + ';expires=' + date
}

function getCookie(name){
    var reg = RegExp(name+'=([^;]+)')
    var arr = document.cookie.match(reg)
            // console.log(arr[1])
            if (arr) {
                return arr
            } else {
                return '';
            }
        }
        function delCookie(name) {
            setCookie(name, null, -1)
        }