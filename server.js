// note, io(<port>) will create a http server for you
var io = require('socket.io')(5000);

io.on('connection', function (socket) {
    io.emit('this', { will: 'be received by everyone'});

    socket.on('private message', function (from, msg) {
        console.log('I received a private message by ', from, ' saying ', msg);
    });

    /**
     * 创建房间
     * 返回值: 房间序号
     * 如有人数限制,则在达到人数限制时,自动群发当前房间所有人的序列号
     */
    socket.on('create room', function(cb) {
        //generate an uuid for room name
        //callback with room name
    });


    /**
     * 加入房间
     * 参数: 房间名称 消息对象 人数限制
     * 返回值: 房间人数 所在房间人中的第几人
     * 群发包含加入者个人信息的加入事件
     * 如有人数限制,则在达到人数限制时,自动群发当前房间所有人的序列号
     */
    socket.on('join room', function(roomName, msgObj, size, cb) {
        //check if arg size set
            //if size is set check if clients in room is smaller than size
                //if smaller than join the room of roomName
                //else reject the client with a msg
            //if clients length is equal to size
                //join the room of roomName
                //emit an event with each index of all clients in roomName
            //else join the room of roomName

        //if there is no size
            //join the room of roomName

        //emit an event with current client's msgObj

    });


    /**
     * 群发一个消息到指定房间的所有人
     * 参数: 房间名称 消息对象
     */
    socket.on('broadcast room', function(roomName, msgObj) {
        //broadcast to everyone who is in roomName with msgObj
    });


    /**
     * 发送指定房间内所有人的序号
     * 参数: 房间名称
     */
    socket.on('broadcast num', function(roomName) {
        //broadcast to everyone who is in roomName with client index

    });


    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
});