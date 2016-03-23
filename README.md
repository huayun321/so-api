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

* Room.broadcast()
* Room.broadcastNum()
* Room.onJoin()
* Room.onError()





