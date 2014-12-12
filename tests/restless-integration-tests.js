/**
 * Don't forget to run `node server.js`
 */

var should = require('should');
var assert = require('assert');

before(function() {
    
});


describe('Invoke services', function () {

    it('invokes a service successfully without filters', function (done) {
        setTimeout(function () {
            new GetItemCommand('myIdString').then(function (data) {
                                    should.exist(data);
                                    done();
                                }, function (data) {
                                }).execute();
        });
    });
});