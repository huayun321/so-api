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

* Room.create()
* Room.join()
* Room.broadcast()
* Room.broadcastNum()
* Room.onJoin()
* Room.onError()


