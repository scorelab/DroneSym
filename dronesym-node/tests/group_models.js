var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');
var Todo = require('../Models/group');

/*-----GET ALL GROUPS-------------*/
describe("Get all Groups", function(){
       it("should return all groups field", function(done){
           var TodoMock = sinon.mock(Todo);
           var expectedResult = {status: true, todo: []};
           TodoMock.expects('find').yields(null, expectedResult);
           Todo.find(function (err, result) {
               TodoMock.verify();
               TodoMock.restore();
               expect(result.status).to.be.true;
               done();
           });
       });

       it("should return error", function(done){
           var TodoMock = sinon.mock(Todo);
           var expectedResult = {status: false, error: "Something went wrong"};
           TodoMock.expects('find').yields(expectedResult, null);
           Todo.find(function (err, result) {
               TodoMock.verify();
               TodoMock.restore();
               expect(err.status).to.not.be.true;
               done();
           });
       });
   });

/*----POSTING NEW GROUP------------*/
describe("Post a new group of drones", function(){
       it("should create new post", function(done){
           var TodoMock = sinon.mock(new Todo({ todo: 'Save new group from mock'}));
           var todo = TodoMock.object;
           var expectedResult = { status: true };
           TodoMock.expects('save').yields(null, expectedResult);
           todo.save(function (err, result) {
               TodoMock.verify();
               TodoMock.restore();
               expect(result.status).to.be.true;
               done();
           });
       });
       // Test will pass if the todo is not saved
       it("should return error, if post not saved", function(done){
           var TodoMock = sinon.mock(new Todo({ todo: 'Save new group from mock'}));
           var todo = TodoMock.object;
           var expectedResult = { status: false };
           TodoMock.expects('save').yields(expectedResult, null);
           todo.save(function (err, result) {
               TodoMock.verify();
               TodoMock.restore();
               expect(err.status).to.not.be.true;
               done();
           });
       });
   });
