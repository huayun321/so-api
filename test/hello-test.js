var io = require('socket.io-client');

var server_url = 'http://localhost:5000';

describe('conn', function () {
    it('user can connect to server and receive msg from server', function(done) {
       var client = io.connect(server_url);
        client.on('this', function(msg) {
            console.log(msg);
            done();
        })
    });
});