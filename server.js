// note, io(<port>) will create a http server for you
var io = require('socket.io')(5000);

io.on('connection', function (socket) {
    io.emit('this', { will: 'be received by everyone'});

    socket.on('private message', function (from, msg) {
        console.log('I received a private message by ', from, ' saying ', msg);
    });

    /**
     * 创建房间
     * 参数: 人数限制(可选)
     * 返回值: 房间序号
     * 如有人数限制,则在达到人数限制时,自动群发当前房间所有人的序列号
     */


    /**
     * 加入房间
     * 参数: 房间名称 消息对象
     * 返回值: 房间人数 所在房间人中的第几人
     * 群发包含加入者个人信息的加入事件
     */


    /**
     * 群发一个消息到指定房间的所有人
     *
     */


    /**
     * 请求发送指定房间内所有人的序号
     */


    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
});