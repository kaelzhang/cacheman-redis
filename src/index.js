const NOOP = () => {}

module.exports = class CachemanRedis {
  /**
   * RedisStore constructor.
   *
   * @param {String|Object} options
   * @api public
   */

  constructor(client, {
    prefix = ''
  } = {}) {
    this.client = client
    this.prefix = prefix
  }

  /**
   * Get an entry.
   *
   * @param {String} key
   * @param {Function} fn
   * @api public
   */

  get(key, fn = NOOP) {
    const k = `${this.prefix}${key}`
    this.client.get(k, (err, data) => {
      if (err) return fn(err)
      if (!data) return fn(null, null)
      data = data.toString()
      try {
        fn(null, JSON.parse(data))
      } catch (e) {
        fn(e)
      }
    })
  }

  /**
   * Set an entry.
   *
   * @param {String} key
   * @param {Mixed} val
   * @param {Number} ttl
   * @param {Function} fn
   * @api public
   */

  set(key, val, ttl, fn = NOOP) {
    const k = `${this.prefix}${key}`

    if ('function' === typeof ttl) {
      fn = ttl
      ttl = null
    }

    try {
      val = JSON.stringify(val)
    } catch (e) {
      return fn(e)
    }

    const cb = (err) => {
      if (err) return fn(err)
      fn(null, val)
    }

    if (-1 === ttl) {
      this.client.set(k, val, cb)
    } else {
      this.client.setex(k, ttl || 60, val, cb)
    }
  }

  /**
   * Delete an entry (Supported glob-style patterns).
   *
   * @param {String} key
   * @param {Function} fn
   * @api public
   */

  del(key, fn = NOOP) {
    this.client.del(`${this.prefix}${key}`, fn)
  }

  /**
   * Clear all entries in cache.
   *
   * @param {Function} fn
   * @api public
   */

  clear(fn = NOOP) {
    this.client.keys(`${this.prefix}*`, (err, data) => {
      if (err) return fn(err)
      let count = data.length
      if (count === 0) return fn(null, null)
      data.forEach((key) => {
        this.client.del(key, (err) => {
          if (err) {
            count = 0
            return fn(err)
          }
          if (--count == 0) {
            fn(null, null)
          }
        })
      })
    })
  }
}
