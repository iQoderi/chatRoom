/**
 * Created by qoder on 16-2-25.
 */

window.onload = function () {
    var username = $("username"),
        loginBtn = $("loginBtn"),
        errorBox = $("loginError"),
        loading = $("loading"),
        chatRoomWrapper = $("chatRoomWrapper"),
        chatHeader = $("chatHeader"),
        sendMsg = $("sendMsg"),
        chatMsg = $("chatMsg"),
        chatContent = $("chatContent"),
        chatWord = $("chatWord"),
        emoji = $("emoji"),
        emojiBox = $("emojiBox"),
        windowshake = $("windowshake"),
        toolBar = $("toolBar");


    if (window.location.pathname === '/login') {
        loginBtn.onclick = function () {
            var timer = null;
            console.log(username.value);
            if (username.value === "") {
                clearTimeout(timer);
                errorBox.innerHTML = "输入用户名不能为空";
                errorBox.style.display = 'block';
                setTimeout(function () {
                    errorBox.style.display = 'none';
                }, 600)
            } else {
                loading.style.display = 'block';
                var xmlhttp = getXmlhttp();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        loading.style.display = 'none';
                        window.location.href = '/chatRoom';
                    }
                };
                xmlhttp.open('POST', '/login');
                xmlhttp.setRequestHeader("Content-type", "application/json");
                xmlhttp.send(JSON.stringify({username: username.value}));
            }
        };
        Enter(loginBtn.onclick);
    }


    if (window.location.pathname === '/chatRoom') {

        //socket.io
        var socket = io.connect("http://192.168.16.175:3838");
        //用户进入聊天室
        socket.on('joinusers', function (data) {
            systemPrompt('加入群聊', data.username);
            newMsgScroll();
        });

        //发送消息成功后返回
        socket.on('chatMsgRes', function (data) {
            showMsg('self-item', data.msg);
            newMsgScroll();
        });

        //用户离开聊天室
        socket.on('usersleave', function (data) {
            systemPrompt('退出群聊', data.username);
            newMsgScroll();
        });

        socket.on('disconnect', function (data) {
            //window.confirm("确认离开聊天室？");
        });

        //接收其他用户发送的消息
        socket.on('allusersSay', function (data) {
            showMsg('item', data.msg);
            newMsgScroll();
        });


        //发送消息
        sendMsg.onclick = function () {
            if (chatMsg.value == "") {
                alert("发送内容不可以为空");
            } else {
                getFocus();
                socket.emit('chatMsg', {msg: chatMsg.value});
            }
        };
        Enter(sendMsg.onclick);

        //窗口抖动
        var timer = null;
        windowshake.onclick = function () {
            //发送窗口抖动
            socket.emit('shakewindow', {username: "Qoder"});
            shakeWindows();
            systemPrompt('发送了一个窗口抖动', "你");
            newMsgScroll();
        };

        //接收窗口抖动消息
        socket.on('shakewindow', function (data) {
            shakeWindows();
            systemPrompt('发送了一个窗口抖动', data.username);
            newMsgScroll();
        });

        //表情
        var emojiObj = operationEmoji(emojiBox);
        emoji.onclick = function () {
            emojiObj.showEmoji();
            console.log(toolBar.offsetHeight);
        };

        //输入框获取焦点事件
        chatMsg.onfocus = function () {
            getFocus();
        };

        //消息显示区域点击事件
        chatContent.onclick = function () {
            emojiObj.hideEmoji();
        };

        //头部点击事件
        chatHeader.onclick = function () {
            emojiObj.hideEmoji();
            chatContent.scrollTop = 0;  //返回头部
        };

        //发送表情
        var selectEmoji = emojiBox.getElementsByClassName("item");
        console.log(selectEmoji);
        for (var i = 0; i < selectEmoji.length; i++) {
            selectEmoji[i].onclick = function () {
                var imgUrl = this.childNodes[0].getAttribute('src');
                var reg = /.*\/(\d+)\..*/ig;
                var imgID = reg.exec(imgUrl)[1];
                var inputstr = "[emoji:" + imgID + "]";
                chatMsg.value += inputstr;
            }
        }

    }

};


//通过id获取元素
var $ = function (id) {
    if (id === null) {
        console.log('请输入id');
        return false;
    } else {
        return document.getElementById(id);
    }
};


//懒加载获取xmlhttp对象
var getXmlhttp = function () {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
        getXmlhttp = function () {
            return new XMLHttpRequest();
        }
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        getXmlhttp = function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlhttp;
};


//显示系统提示
var systemPrompt = function (keyword, username) {
    var system = document.createElement("div");
    system.className = "userjoin";
    var systemitem = '<p>系统提示:<span class="joinuser">' + username + '</span>' + keyword + '</p>';
    system.innerHTML = systemitem;
    chatWord.appendChild(system);
};


//显示聊天信息
var showMsg = function (className, msg) {
    chatMsg.value = "";
    var chatitem = document.createElement("div");
    chatitem.className = className;
    var inneritem = '<span class="avatar"><img src="../images/empty_head.png">' +
        '</span> <span class="msgWrapper">' + '<span class="triangle"></span>' +
        '<span class="username">' + 'Qoder' + '</span>' + '<span class="msg">' +
        EmojiEngine(msg) + '</span>' + '</span>';
    chatitem.innerHTML = inneritem;
    chatWord.appendChild(chatitem);
};

//按住Enter键发生的事件
var Enter = function (dosth) {
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            dosth();
        }
    };
};

//收到新消息窗口自动滚动到底部
var newMsgScroll = function () {
    var chatContent = $("chatContent");
    chatContent.scrollTop = chatContent.scrollHeight;
};

//窗口抖动
var shakeWindows = function () {
    clearTimeout(timer);
    chatRoomWrapper.setAttribute("class", "chatRoomWrapper shake");
    var timer = setTimeout(function () {
        chatRoomWrapper.classList.remove('shake');
    }, 500);
};


//表情显示隐藏
var operationEmoji = function (dom) {
    dom.showEmoji = function () {
        dom.style.display = 'block';
        chatContent.style.height = 35 + 'vh';
    };
    dom.hideEmoji = function () {
        dom.style.display = 'none';
        chatContent.style.height = 75 + 'vh';
    };
    return dom;
};

//输入框获取焦点
var getFocus = function () {
    var emojiObj = operationEmoji(emojiBox);
    emojiObj.hideEmoji();
    chatMsg.focus();
};

//处理表情
var EmojiEngine = function (tpl) {
    var re = /\[emoji:(\d+)\]/g;
    while (match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], "<img src='../emoji/" + match[1] + ".png' />");
    }
    return tpl;
}
