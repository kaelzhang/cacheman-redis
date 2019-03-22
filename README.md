[![Build Status](https://travis-ci.org/kaelzhang/cacheman-redis.svg?branch=master)](https://travis-ci.org/kaelzhang/cacheman-redis)

<!-- [![Coverage](https://codecov.io/gh/BiJie/binance-scripts/branch/master/graph/badge.svg)](https://codecov.io/gh/BiJie/binance-scripts) -->

# @ostai/cacheman-redis

Redis standalone caching library for Node.JS and also cache engine for [cacheman](https://github.com/cayasso/cacheman).

This fork removes peer dependencies `redis` and only supports to create a `CachemanRedis` with a redis client

## Install

``` bash
$ npm i @ostai/cacheman-redis
```

## Usage

```js
const CachemanRedis = require('@ostai/cacheman-redis')
const Redis = require('ioredis')
const cache = new CachemanRedis(new Redis())

// set the value
cache.set('key', {foo: 'bar'}, err => {
  if (err) {
    throw err
  }

  console.log('succeeded')
})

// But for most cases,
// CachemanRedis is used as an engine of Cacheman
const Cacheman = require('cacheman')
const man = new Cacheman('prefix', {
  engine: cache
})

const value = await man.get('key')
```

## API

### CachemanRedis(client, options?)

- **client** `RedisClient` redis `client` instance
- **options** `?Object`
  - **prefix** `?string=''` key prefix

Create a `CachemanRedis` instance.

```js
const Redis = require('ioredis')
const cache = new CachemanRedis(new Redis())
```

### cache.set(key, value, ttl?, callback?)

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
cache.set('foo', {a: 'bar'}, 60, (err, value) => {
  if (err) throw err
  console.log(value) //-> {a:'bar'}
})
```

### cache.get(key, callback?)

Retrieves a value for a given key, if there is no value for the given key a null value will be returned.

```js
cache.get(key, (err, value) => {
  if (err) throw err
  console.log(value)
})
```

### cache.del(key, callback?)

Deletes a key out of the cache.

```javascript
cache.del('foo', err => {
  if (err) throw err
  // foo was deleted
})
```

### cache.clear(callback?)

Clear the cache entirely, throwing away all values.

```javascript
cache.clear(err => {
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
