// note, io(<port>) will create a http server for you
var io = require('socket.io')(5000);
//uuid
var uuid = require('uuid');
//underscore
var _ = require('underscore');
//node validator
var validator = require('validator');
//log
var log = require('./log-config').log;

io.on('connection', function (socket) {
    log.info(socket.id);
    io.emit('this', { will: 'be received by everyone'});

    socket.on('private message', function (from, msg) {
        console.log('I received a private message by ', from, ' saying ', msg);
    });

    /**
     * 创建房间
     * 返回值: 房间序号
     */
    socket.on('create room', function(cb) {
        log.info('create room on call');
        log.time('create room');

        //check if there is a cb
        if( !_.isFunction(cb) ) {
            log.warn('create room need function as first arg');
            socket.emit('room error', 'create room need function as first arg');
            log.timeEnd('create room');
            return;
        }

        //generate an uuid for room name
        // Generate a v4 (random) id
        var roomName = uuid.v4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
        log.info('roomName: ', roomName);

        //join the master to room
        socket.join(roomName);

        //callback with room name
        cb(roomName);
        log.timeEnd('create room');
    });


    /**
     * 加入房间
     * 参数: 房间名称人数限制
     * 返回值: 房间人数 所在房间人中的第几人
     * 群发包含加入者个人信息的加入事件
     * 如有人数限制,则在达到人数限制时,自动群发当前房间所有人的序列号
     */
    socket.on('join room', function(opts, cb) {
        log.info('join room on call');
        log.info('join room, ', opts);
        log.time('join room');

        //check if opts is obj
        if( !_.isObject(opts) ) {
            socket.emit('room error', 'join room opts is not Object');
            log.timeEnd('join room');
            return;
        }

        if( !_.has(opts, 'roomName') ) {
            socket.emit('room error', 'join room opts do not have  roomName');
            log.timeEnd('join room');
            return;
        }

        if( !_.has(opts, 'joinMsg') ) {
            socket.emit('room error', 'join room opts do not have joinMsg');
            log.timeEnd('join room');
            return;
        }

        opts = _.pick(opts, 'roomName', 'joinMsg');

        //check if opts.roomName is uuid
        if( !validator.isUUID(opts.roomName) ) {
            socket.emit('room error', 'join room opts.roomName is not validate');
            log.timeEnd('join room');
            return;
        }

        //check cb is function
        if( !_.isFunction(cb) ) {
            socket.emit('room error', 'join room callback is not function');
            log.timeEnd('join room');
            return;
        }

        socket.join(opts.roomName);

        io.of('/').in(opts.roomName).clients(function (error, clients) {
            if (error) throw error;
            //log.info(clients);
            var cid = socket.id;
            cb(clients.indexOf(cid));
            log.timeEnd('join room');
            io.to(opts.roomName).emit('joined', {joinMsg: opts.joinMsg});
        });
    });


    /**
     * 群发一个消息到指定房间的所有人
     * 参数: 房间名称 消息对象
     */
    socket.on('broadcast room', function(roomName, msgObj) {
        //broadcast to everyone who is in roomName with msgObj
        log.time('broadcast');
        log.info('broadcast room roomname', roomName);
        log.info('broadcast room msg', msgObj);
        io.to(roomName).emit('broadcast room', msgObj);
        log.timeEnd('broadcast');
    });


    /**
     * 发送指定房间内所有人的序号
     * 参数: 房间名称
     */
    socket.on('broadcast num', function(roomName) {
        log.time('broadcast num');
        log.info('broadcast num', roomName);
        //broadcast to everyone who is in roomName with client index
        io.of('/').in(roomName).clients(function (error, clients) {
            if (error) throw error;
            console.log(clients);
            for(var i=0; i<clients.length; i++) {
                io.to(clients[i]).emit('broadcast num', i);
            }
            log.timeEnd('broadcast num');
        });
    });


    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
});