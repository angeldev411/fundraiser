'use strict';
const request = require('supertest');
const assert = require('assert');

var app = require("../../app/routes.js");



describe('GET /api/v1/session.json', function(){
  it('respond with json', function(done){
    request(app)
      .get('/api/v1/session.json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  })
})
