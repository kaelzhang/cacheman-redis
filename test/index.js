const assert = require('assert')
const Redis = require('ioredis')
const Cache = require('../src')

const connection = {
  host: '127.0.0.1',
  port: 6379,
  db: 6
}

describe('cacheman-redis', () => {
  let cache = null

  beforeEach((done) => {
    cache = new Cache(new Redis(connection))
    done()
  })

  afterEach((done) => {
    cache.clear(done)
  })

  it('should have main methods', () => {
    assert.ok(cache.set)
    assert.ok(cache.get)
    assert.ok(cache.del)
    assert.ok(cache.clear)
  })

  it('should store items', (done) => {
    cache.set('test1', { a: 1 }, (err) => {
      if (err) return done(err)
      cache.get('test1', (err, data) => {
        if (err) return done(err)
        assert.equal(data.a, 1)
        done()
      })
    })
  })

  it('should store zero', (done) => {
    cache.set('test2', 0, (err) => {
      if (err) return done(err)
      cache.get('test2', (err, data) => {
        if (err) return done(err)
        assert.strictEqual(data, 0)
        done()
      })
    })
  })

  it('should store false', (done) => {
    cache.set('test3', false, (err) => {
      if (err) return done(err)
      cache.get('test3', (err, data) => {
        if (err) return done(err)
        assert.strictEqual(data, false)
        done()
      })
    })
  })

  it('should store null', (done) => {
    cache.set('test4', null, (err) => {
      if (err) return done(err)
      cache.get('test4', (err, data) => {
        if (err) return done(err)
        assert.strictEqual(data, null)
        done()
      })
    })
  })

  it('should delete items', (done) => {
    let value = Date.now()
    cache.set('test5', value, (err) => {
      if (err) return done(err)
      cache.get('test5', (err, data) => {
        if (err) return done(err)
        assert.equal(data, value)
        cache.del('test5', (err) => {
          if (err) return done(err)
          cache.get('test5', (err, data) => {
            if (err) return done(err)
            assert.equal(data, null)
            done()
          })
        })
      })
    })
  })

  it('should clear items', (done) => {
    let value = Date.now()
    cache.set('test6', value, (err) => {
      if (err) return done(err)
      cache.get('test6', (err, data) => {
        if (err) return done(err)
        assert.equal(data, value)
        cache.clear((err) => {
          if (err) return done(err)
          cache.get('test6', (err, data) => {
            if (err) return done(err)
            assert.equal(data, null)
            done()
          })
        })
      })
    })
  })

  it('should expire key', function(done) {
    this.timeout(0)
    cache.set('test7', { a: 1 }, 1, (err) => {
      if (err) return done(err)
      setTimeout(() => {
        cache.get('test7', (err, data) => {
          if (err) return done(err)
          assert.equal(data, null)
          done()
        })
      }, 1100)
    })
  })

  it('should not expire key', function(done) {
    this.timeout(0)
    cache.set('test8', { a: 1 }, -1, (err) => {
      if (err) return done(err)
      setTimeout(() => {
        cache.get('test8', (err, data) => {
          if (err) return done(err)
          assert.deepEqual(data, { a: 1 })
          done()
        })
      }, 1000)
    })
  })

  it('should get the same value subsequently', (done) => {
    let val = 'Test Value'
    cache.set('test', 'Test Value', () => {
      cache.get('test', (err, data) => {
        if (err) return done(err)
        assert.strictEqual(data, val)
        cache.get('test', (err, data) => {
          if (err) return done(err)
          assert.strictEqual(data, val)
          cache.get('test', (err, data) => {
            if (err) return done(err)
            assert.strictEqual(data, val)
            done()
          })
        })
      })
    })
  })

  it('should clear an empty cache', (done) => {
    cache.clear((err) => {
      done(err)
    })
  })
})
