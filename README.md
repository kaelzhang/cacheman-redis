[![Build Status](https://travis-ci.org/kaelzhang/cacheman-redis.svg?branch=master)](https://travis-ci.org/kaelzhang/cacheman-redis)

<!-- [![Coverage](https://codecov.io/gh/BiJie/binance-scripts/branch/master/graph/badge.svg)](https://codecov.io/gh/BiJie/binance-scripts) -->

# @ostai/cacheman-redis

Redis standalone caching library for Node.JS and also cache engine for [cacheman](https://github.com/cayasso/cacheman).



## Install

``` bash
$ npm i @ostai/cacheman-redis
```

## Usage

```js
const CachemanRedis = require('@ostai/cacheman-redis')
var cache = new CachemanRedis()

// set the value
cache.set('my key', { foo: 'bar' }, function (error) {

  if (error) throw error

  // get the value
  cache.get('my key', function (error, value) {

    if (error) throw error

    console.log(value) //-> {foo:"bar"}

    // delete entry
    cache.del('my key', function (error){

      if (error) throw error

      console.log('value deleted')
    })

  })
})
```

## API

### CachemanRedis(client)

- **client** `RedisClient` redis `client` instance

Create a `CachemanRedis` instance.

```js
const Redis = require('ioredis')
const cache = new CachemanRedis(new Redis())
```

### cache.set(key, value, [ttl, [fn]])

Stores or updates a value.

```javascript
cache.set('foo', { a: 'bar' }, function (err, value) {
  if (err) throw err
  console.log(value) //-> {a:'bar'}
})
```

Or add a TTL(Time To Live) in seconds like this:

```javascript
// key will expire in 60 seconds
cache.set('foo', { a: 'bar' }, 60, function (err, value) {
  if (err) throw err
  console.log(value) //-> {a:'bar'}
})
```

### cache.get(key, fn)

Retrieves a value for a given key, if there is no value for the given key a null value will be returned.

```javascript
cache.get(function (err, value) {
  if (err) throw err
  console.log(value)
})
```

### cache.del(key, [fn])

Deletes a key out of the cache.

```javascript
cache.del('foo', function (err) {
  if (err) throw err
  // foo was deleted
})
```

### cache.clear([fn])

Clear the cache entirely, throwing away all values.

```javascript
cache.clear(function (err) {
  if (err) throw err
  // cache is now clear
})
```

## Run tests

``` bash
$ make test
```

## License

[MIT](LICENSE)
