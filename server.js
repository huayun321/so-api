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
//error code
var errorCode = require('./error-code');
// log.error(errorCode);

//set origin

io.origins('qing.mocha.server.sensoro.com:* 104.250.144.20:3000 qing.sensoro.com:*');

function findRooms() {
    var availableRooms = [];
    var rooms = io.sockets.adapter.rooms;
    if (rooms) {
        for (var room in rooms) {
            if (validator.isUUID(room)) {
                availableRooms.push(room);
            }
        }
    }
    return availableRooms;
}

function findRoomsBySocket(socket) {
    var availableRooms = [];
    var rooms = socket.rooms;
    if (rooms) {
        for (var room in rooms) {
            if (validator.isUUID(room)) {
                availableRooms.push(room);
            }
        }
    }
    return availableRooms;
}



function hasRoom(roomName) {
    var rooms = findRooms();
    return ( rooms.indexOf(roomName) ) > -1;
}

io.on('connection', function (socket) {
    log.info(socket.id);
    io.emit('this', { will: 'be received by everyone'});

    socket.on('private message', function (from, msg) {
        console.log('I received a private message by ', from, ' saying ', msg);
    });

    /**
     * 监听心跳包
     * 返回值: 无
     */
    socket.on('heartbeat', function (from, msg) {
        log.info('heartbeat from: ', socket.id);
    });

    /**
     * 创建房间
     * 返回值: 房间序号
     */
    socket.on('create room', function(cb) {
        log.info('create room on call');
        log.time('create room');

        //generate an uuid for room name
        // Generate a v4 (random) id
        var roomName = uuid.v4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
        log.info('roomName: ', roomName);

        //join the master to room
        socket.join(roomName);

        log.warn(socket.rooms);

        //check if there is a cb
        if( cb && _.isFunction(cb) ) {
            cb(roomName);
        }

        log.timeEnd('create room');
    });

//todo 一个客户端只可加入一个房间
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
            socket.emit('room error', errorCode.join1);
            log.timeEnd('join room');
            return;
        }

        //check roomName
        if( !_.has(opts, 'roomName') ) {
            socket.emit('room error', errorCode.join2);
            log.timeEnd('join room');
            return;
        }

        //check if opts.roomName is uuid
        if( !validator.isUUID(opts.roomName) ) {
            socket.emit('room error', errorCode.join3);
            log.timeEnd('join room');
            return;
        }

        log.warn(findRooms());
        log.warn(hasRoom(opts.roomName));
        log.warn(findRoomsBySocket(socket));

        if( !hasRoom(opts.roomName) ) {
            socket.emit('room error', errorCode.join4);
            log.timeEnd('join room');
            return;
        }

        opts = _.pick(opts, 'roomName', 'joinMsg');

        //join room
        socket.join(opts.roomName);

        //for cb and emit msg
        io.of('/').in(opts.roomName).clients(function (error, clients) {
            if (error) throw error;
            var cid = socket.id;

            if( cb && _.isFunction(cb) ) {
                cb(clients.indexOf(cid));
            }

            if( _.has(opts, 'joinMsg') ){
                io.to(opts.roomName).emit('joined', {joinMsg: opts.joinMsg});
            };

            log.timeEnd('join room');
        });
    });


    /**
     * 群发一个消息到指定房间的所有人
     * 参数: 房间名称 消息对象
     */
    socket.on('broadcast room', function(roomName, msgObj) {
        //broadcast to everyone who is in roomName with msgObj
        log.time('broadcast');

        //check if roomName is uuid
        if( !validator.isUUID(roomName) ) {
            socket.emit('room error', errorCode.broad1);
            log.timeEnd('broadcast');
            return;
        }

        if( !hasRoom(roomName) ) {
            socket.emit('room error', errorCode.broad2);
            log.timeEnd('broadcast');
            return;
        }

        log.info(findRoomsBySocket(socket));

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

        //check if roomName is uuid
        if( !validator.isUUID(roomName) ) {
            socket.emit('room error', errorCode.broadNum1);
            log.timeEnd('broadcast num');
            return;
        }

        if( !hasRoom(roomName) ) {
            socket.emit('room error', errorCode.broadNum2);
            log.timeEnd('broadcast num');
            return;
        }

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

    //todo 是否每个客户端只可以加入一个房间


    socket.on('disconnect', function () {
        var rooms = findRooms();
        log.warn(rooms);
        io.emit('user disconnected');
    });
});