# SENSORO SDK ROOM API


---



轻量级实时交互前端js接口。
提供创建房间，加入房间，房间内群发消息等类似聊天室的功能。
可基于此基本接口开发多屏互动，实时消息等应用。


## 安装：


---
1. 引入SENSORO.js到所要使用的H5页面中。
2. 引入Room.js到所要使用的H5页面中。




## 例子：


---
```
<!DOCTYPE html>
<html>
<head>
    <title>so-front</title>
    <!-- room.js -->
    <script src="/javascripts/room.js"></script>
    <!-- style -->
    <link rel='stylesheet' href='/stylesheets/style.css'/>
</head>
<body>
<h1>so-front</h1>
<p>this socket.io front</p>
<p>
    room name: <span id="roomName"></span>
</p>

<script src="/jquery/dist/jquery.min.js"></script>
<script>
    $(document).ready(function() {
        var room = new SENSORO.room('http://localhost:5000');
        console.log(room);
//        room.create(function(roomName) {
//            $('#roomName').text(roomName);
//        });
        room.onError(function(data) {
            console.log(data);
        });

//      test no callback
        room.create();
    });




</script>
</body>
</html>

```


## 接口：


---

### Room
使用Room api 必须首先实例化一个window.SENSORO.Room对象，以初始化Room的配置，及使用各接口方法。
```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);
```





### Room.create([callback])
创建聊天或互动的房间.

* callback function 创建成功后的回调函数，可选，会返回所创建的房间名。房间名格式为‘6c84fb90-12c4-11e1-840d-7b25c5ee775a’。



```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);

room.create(function(roomName) {
  console.log(roomName);
  //会输出‘6c84fb90-12c4-11e1-840d-7b25c5ee775a’格式的房间名称
});
```

### Room.join(options[, callback])
加入指定房间。
* options 必填参数。格式为{roomName:'6c84fb90-12c4-11e1-840d-7b25c5ee775a', joinMsg:'blabla'} key roomName 为必填key，joinMsg可选。填写joinMsg后，当加入成功会发送一条加入消息到房间内的所有人。消息为joinMsg的字符串值。
* callback function 回调，可选填。加入成功后会返回本客户所在房间的序列号。

```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);

var rName = '6c84fb90-12c4-11e1-840d-7b25c5ee775a';
var myName = 'Susan';

var opts = {
  roomName:rName, 
  joinMsg: 'hello everyone i am ' + myName
}

room.join(opts, function(index) {
  console.log(index);
  //会输出一个数值，类似 33 或 12，代表所在房间的第几人
});


```


### Room.onJoin(callback)
当room.join调用成功，且当room.join 的options 配置中有joinMsg key时，会群发一条消息到所在room的所有人。此时，所有调用room.onJoin方法的页面会收到一条消息。

* callback function回调方法。

```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);

var rName = '6c84fb90-12c4-11e1-840d-7b25c5ee775a';
var myName = 'Susan';

var opts = {
  roomName:rName, 
  joinMsg: 'hello everyone i am ' + myName
}

room.join(opts, function(index) {
  console.log(index);
  //会输出一个数值，类似 33 或 12，代表所在房间的第几人
});

room.onJoin(function(msg) {
  console.log(msg);
  //会输出 hello everyone i am Susan
});

```

### Room.broadcast(roomName, msgObj)
广播一条消息到指定房间。

* roomName string 必填。字符串类型，房间名称，格式为'6c84fb90-12c4-11e1-840d-7b25c5ee775a'。
* msgObj obj 必填。{}类型。

```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);

var rName = '6c84fb90-12c4-11e1-840d-7b25c5ee775a';

var msgObj = {
  openid: '6c84fb90-12c4-11e1',
  headimageurl: 'http://baidu.com/logo.png',
  message: 'hello everyone!'
}
room.broadcast(rName, msgObj);

```

### Room.onBroadcast(callback)
监听当前所加入房间的broadcast事件。

* callback function 回调方法。必填。

```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);

var rName = '6c84fb90-12c4-11e1-840d-7b25c5ee775a';
room.onBroadcast(function(msgObj) {
  console.log(msgObj);
  //会输出 room.broadcast()所发送的内容
});

```


### Room.broadcastNum(roomName)
向指定房间内的所有客户端发送一条只包含该客户端在指定房间所在位置的序列号。

* roomName string 必填。字符串类型，房间名称，格式为'6c84fb90-12c4-11e1-840d-7b25c5ee775a'。

```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);

var rName = '6c84fb90-12c4-11e1-840d-7b25c5ee775a';

room.broadcast(rName);

```

### Room.onBroadcastNum(callback)
监听当前所加入房间的broadcastNum事件。

* callback function 回调方法。必填。

```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);

room.onBroadcastNum(function(index) {
  console.log(index);
  //会输出 当前客户端所在房间中的序列号
  //譬如加入是第一个加入的人， 会返回0， 第二个加入的人会返回1。

});

```

### Room.onError(callback)
监听当前所加入房间的error事件。

* callback function 回调方法。必填。

```
var url = 'http://localhost:5000';//接口服务器url
var room = new SENSORO.room(url);

room.onError(function(msgObj) {
  console.log(msgObj);
  //会输出 错误信息 格式为
  //{code: 0001, msg: 'blablabla'}
});

```


# SENSORO ROOM API SERVER ERROR CODE
Server端返回的错误信息码。


---

## 错误码表格

错误码 | 错误信息 | 备注说明
--------- | ------------- | ------------- 
0001 | 无回调函数或回调函数格式错误 | 创建房间时必须传入回调函数作为参数
0101 | room.join,参数类型不匹配,options,应为Object类型. | 加入房间时的配置参数必须是object类
0102 | room.join参数类型不匹配,options,应有roomName字段. | 
0103 | room.join参数类型不匹配,options,roomName字段应为 6c84fb90-12c4-11e1-840d-7b25c5ee775a 格式. | 
0104 | room.join,不存在roomName所指定的房间,请换其他房间名. | 
0201 | room.broadcast,roomName,应为 6c84fb90-12c4-11e1-840d-7b25c5ee775a 格式. | 
0202 | room.broadcast,不存在roomName所指定的房间,请换其他房间名. | 
0301 | room.broadcastNum,roomName,应为 6c84fb90-12c4-11e1-840d-7b25c5ee775a 格式. | 
0302 | room.broadcastNum,不存在roomName所指定的房间,请换其他房间名. | 






