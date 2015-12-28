'use strict';

/* global beforeEach */
/* global describe */
/* global it */

const MemoryRepository = require('../../lib').MemoryRepository;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const should = chai.should();

chai.use(chaiAsPromised);

describe('MemoryRepository', () => {
  const dummyKeyValue = 'dummy-key';

  let instance = null;
  beforeEach(() => {
    instance = new MemoryRepository();
  });

  describe('Construction', () => {
    it('Can be instanciated', () => {
      should.exist(instance);
    });
  });

  describe('operation', () => {
    it('getEvents should return empty array for empty/unstored event streams.', () => {
      return instance.getEvents(dummyKeyValue)
        .then((data) => {
          should.exist(data);
          should.exist(data.length);
          expect(data.length).to.equal(0);
        });
    });
    it('getEvents should return the correct events when doing basic load', () => {
      return instance.putEvents(dummyKeyValue, 0, [
          { eventType: 'fooEvent', eventData: { foo: true } },
          { eventType: 'barEvent', eventData: { bar: 42 } },
      ])
      .then((data) => {
        expect(data).to.equal(2);
        return instance.getEvents(dummyKeyValue, 0, -1);
      })
      .then((data) => {
        should.exist(data);
        should.exist(data.length);
        expect(data.length).to.equal(2);
        expect(data[0].eventData.foo).to.equal(true);
        expect(data[1].eventData.bar).to.equal(42);
      });
    });
    it('getEvents range seek', () => {
      return instance.putEvents(dummyKeyValue, 0, [
          { eventType: 'fooEvent', eventData: { foo: true } },
          { eventType: 'barEvent', eventData: { bar: 42 } },
      ])
      .then((data) => {
        expect(data).to.equal(2);
        return instance.getEvents(dummyKeyValue, 1, 1);
      })
      .then((data) => {
        should.exist(data);
        should.exist(data.length);
        expect(data.length).to.equal(1);
        expect(data[0].eventData.bar).to.equal(42);
      });
    });
  });

  describe('Method Input Validation', () => {
    describe('getEvents', () => {
      it('Should have 3 arguments (key, initial, count)', () => {
        expect(instance.getEvents.length).to.equal(3);
      });
      it('Should throw error when null passed for key', () => {
        expect(() => {
          instance.getEvents(null, 0, 10);
        }).to.throw(Error);
      });
      it('Should return a failure when seeking a range on a non-existent agg.', () => {
        return expect(instance.getEvents(dummyKeyValue, 42, -1))
          .to.eventually.be.rejected;
      });
    });

    describe('putEvents', () => {
      it('Should have 3 arguments (key, initial, events)', () => {
        expect(instance.getEvents.length).to.equal(3);
      });
      it('Should throw error when argument key is null', () => {
        expect(() => instance.putEvents(null, 0, [])).to.throw(Error);
      });
      it('Should throw error when argument key is non-string', () => {
        expect(() => instance.putEvents(42, 0, [])).to.throw(Error);
      });
      it('Should throw error when argument inititial is negative', () => {
        expect(() => instance.putEvents('foo', -1, [])).to.throw(Error);
      });
      it('Should throw error when argument events is null', () => {
        expect(() => instance.putEvents('foo', 0, null)).to.throw(Error);
      });
      it('Should succeed silently with 0 input events', () => {
        return expect(instance.putEvents(dummyKeyValue, 0, []))
          .to.eventually.equal(0);
      });
      it('Should not allow append before end of stream', () => {
        return expect(instance.putEvents(dummyKeyValue, 0, [
            { eventType: 'fooEvent', eventData: { foo: true } },
            { eventType: 'barEvent', eventData: { bar: 42 } },
        ])
        .then(() => instance.putEvents(dummyKeyValue, 1, [
            { eventType: 'seeEvent', eventData: { third: 'time' } },
        ])))
        .to.eventually.be.rejected;
      });
      it('Should not allow append beyond tail of stream', () => {
        return expect(instance.putEvents(dummyKeyValue, 0, [
            { eventType: 'fooEvent', eventData: { foo: true } },
            { eventType: 'barEvent', eventData: { bar: 42 } },
        ])
        .then(() => instance.putEvents(dummyKeyValue, 5, [
          { eventType: 'seeEvent', eventData: { third: 'time' } },
        ])))
        .to.eventually.be.rejected;
      });
      it('Should not allow append beyond 0 for non-existent stream', () => {
        return expect(instance.putEvents(dummyKeyValue, 1, [
            { eventType: 'fooEvent', eventData: { foo: true } },
            { eventType: 'barEvent', eventData: { bar: 42 } },
        ]))
        .to.eventually.be.rejected;
      });
      it('Should concatenate events when appending to same key', () => {
        return expect(instance.putEvents(dummyKeyValue, 0, [
            { eventType: 'fooEvent', eventData: { first: 'chance' } },
        ])
        .then(() => instance.putEvents(dummyKeyValue, 1, [
          { eventType: 'seeEvent', eventData: { second: 'best' } },
        ]))
        .then(() => instance.putEvents(dummyKeyValue, 2, [
          { eventType: 'seeEvent', eventData: { third: 'time' } },
        ]))
        .then(() => {
          instance.getEvents(dummyKeyValue, 0, -1)
            .then((data) => {
              expect(data.length).to.equal(3);
            });
        })).to.eventually.be.fulfilled;
      });
    });
  });
});
