﻿/*
 *hichat v0.4.2
 *Wayou Mar 28,2014
 *MIT license
 *view on GitHub:https://github.com/wayou/HiChat
 *see it in action:http://hichat.herokuapp.com/
 */
window.onload = function () {
    var hichat = new HiChat();
    hichat.init();
};
var HiChat = function () {
    this.socket = null;
};
HiChat.prototype = {
    init: function () {
        var that = this;
        this.socket = io.connect('192.168.0.156:3000');
        this.socket.on('connect', function () {
            document.getElementById('info').textContent = '请输入您想使用的昵称 :)';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });
        this.socket.on('nickExisted', function () {
            document.getElementById('info').textContent = '!昵称已存在，请更换昵称名';
        });
        this.socket.on('loginSuccess', function () {
            var tempurl = "http://localhost:58988/ajax/Ajax_AppLFSEvalCon.ashx?Action=getuserlist";
            var tempyyid = "585E965D-92E7-43E5-82FC-00217A2DD788";
            $.ajax({
                type: "get",
                url: tempurl,
                data: {
                    doctorid: tempyyid
                },
                //           data: {"password":"McLaughlin","email":"aaaa"},
                dataType: "JSONP",
                success: function (data) {
                    if (data) {
                        // var a = $.parseJSON(data);
                        // console.log(new Date());
                        // console.log(data.type);
                        // alert(data.Type + tempyyid);
                         alert('1');

                    } else {
                        alert('失败');
                        console.log("error");
                    }
                }
            });

            document.title = 'hichat | ' + document.getElementById('nicknameInput').value;
            document.getElementById('loginWrapper').style.display = 'none';
            document.getElementById('messageInput').focus();
        });
        this.socket.on('error', function (err) {
            if (document.getElementById('loginWrapper').style.display == 'none') {
                document.getElementById('status').textContent = '!连接失败 :(';
            } else {
                document.getElementById('info').textContent = '!连接失败:(';
            }
        });
        this.socket.on('system', function (nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' 加入' : ' 离开');
            that._displayNewMsg('系统公告 ', msg, 'red');
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' 用户' : ' 用户') + ' 在线';
        });
        this.socket.on('newMsg', function (user, msg, color) {
            that._displayNewMsg(user, msg, color);
        });
        this.socket.on('newImg', function (user, img, color) {
            that._displayImage(user, img, color);
        });
        document.getElementById('loginBtn').addEventListener('click', function () {
            var nickName = document.getElementById('nicknameInput').value;
            if (nickName.trim().length != 0) {
                that.socket.emit('login', nickName);
            } else {
                document.getElementById('nicknameInput').focus();
            };
        }, false);
        document.getElementById('nicknameInput').addEventListener('keyup', function (e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('sendBtn').addEventListener('click', function () {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {             
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('我', msg, color);
                return;
            };
        }, false);
        document.getElementById('messageInput').addEventListener('keyup', function (e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('我', msg, color);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function () {
            document.getElementById('historyMsg').innerHTML = '';
        }, false);
        document.getElementById('sendImage').addEventListener('change', function () {
            if (this.files.length != 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    color = document.getElementById('colorStyle').value;
                if (!reader) {
                    that._displayNewMsg('system', '!您的文件夹不\'t 提供文件读取', 'red');
                    this.value = '';
                    return;
                };
                reader.onload = function (e) {
                    this.value = '';
                    that.socket.emit('img', e.target.result, color);
                    that._displayImage('me', e.target.result, color);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        this._initialEmoji();
        document.getElementById('emoji').addEventListener('click', function (e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            emojiwrapper.style.display = 'block';
            e.stopPropagation();
        }, false);
        document.body.addEventListener('click', function (e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            if (e.target != emojiwrapper) {
                emojiwrapper.style.display = 'none';
            };
        });
        document.getElementById('emojiWrapper').addEventListener('click', function (e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },
    _initialEmoji: function () {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = 'http://192.168.0.156:3000/content/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    _displayNewMsg: function (user, msg, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8),
            //determine whether the msg contains emoji
            msg = this._showEmoji(msg);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _displayImage: function (user, imgData, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _showEmoji: function (msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="http://192.168.0.156:3000/content/emoji/' + emojiIndex + '.gif" />'); //todo:fix this in chrome it will cause a new request for the image
            };
        };
        return result;
    }
};