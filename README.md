JS Cache library that allows to to store data and setup TTL.

Usage:

    const { CacheService } = require('cachelib');

    const cacheService = new CacheService;

    // subscribe to service events (SET, GET, REMOVE)
    cacheService.addListener(CacheService.events.SET, (event) => { /* response on SET event */ });

    // set value to cache which will be non-actual after 10 sec
    cacheService.set('key', { value: 'any value' }, { ttl: 10000 });

    // get value
    const result = cacheService.get('key');

    // remove value
    cacheService.remove('key');

    // extract full data
    const fullCacheData = cacheService.extract();

    // preload data to service
    cacheService.load(fullCacheData);


