var should = require('chai').should()
    ,io = require('socket.io-client')
    ,server_url = 'http://localhost:5000';

describe('conn', function () {
    it('user can connect to server and receive msg from server', function(done) {
       var client = io.connect(server_url);
        client.on('this', function(msg) {
            should.exist(msg);
            msg.should.have.property('will').equal('be received by everyone');
            msg.should.be.an('object');
            msg.will.should.equal('be received by everyone');
            done();
        })
    });
});