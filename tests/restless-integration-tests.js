/**
 * Don't forget to run `node server.js`
 */

var util = require('util');
var should = require('should');
var assert = require('assert');
var restless = require('../src/restless');


/////////////////// Remote Service /////////////////////

function TestServiceRemote(responder) {
    restless.ServiceFilterAdapter.call(this, responder);
}

util.inherits(TestServiceRemote, restless.ServiceFilterAdapter);

TestServiceRemote.prototype.getItem = function (someId) {
    console.log(restless.ServiceFilterAdapter.prototype.invoke);
    return restless.ServiceFilterAdapter.prototype.invoke.call(this, 'http://localhost:3000/getItem', 'GET', someId);
}

/////////////////// Command /////////////////////


function GetItemCommand(someId) {
    restless.CommandAdapter.call(this);
    this.someId = someId;
}

util.inherits(GetItemCommand, restless.CommandAdapter);

GetItemCommand.prototype.execute = function () {
    return new TestServiceRemote(this).getItem(this.someId);
};



/////////////////// Begin Test Stuff /////////////////////

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