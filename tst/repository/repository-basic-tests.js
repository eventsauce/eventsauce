'use strict';

/* global describe */
/* global it */

const Repository = require('../../lib/repository');
const chai = require('chai');
const should = chai.should();

describe('Repository', () => {
  describe('Core Behaviours', () => {
    it('Can be instanciated', () => {
      const instance = new Repository();
      should.exist(instance);
    });
  });
});
