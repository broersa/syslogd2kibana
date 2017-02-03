/* eslint-env node, mocha */
var chai = require('chai');
// var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
//var app = require('../src/app.js');

describe('app', function () {
  var sandbox;

  beforeEach(function () {
    // Create a sandbox for the test
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    // Restore all the things made through the sandbox
    sandbox.restore();
  });

  it('should run', function () {
    expect(1).to.be.equal(1);
  });
});
