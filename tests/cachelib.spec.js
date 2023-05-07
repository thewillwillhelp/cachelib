const CacheService = require('../src/cachelib.js').CacheService;

function setTime(time) {
    const originalGetTime = Date.prototype.getTime;

    Date.prototype.getTime = () => time;

    return () => {
        Date.prototype.getTime = originalGetTime;
    }
}

describe('Cache Service tests', () => {
    test('Simple set-get', () => {
        const cacheService = new CacheService();

        cacheService.set('key1', 'value1');

        expect(cacheService.get('key1')).toBe('value1');
    });

    test('Set get with expired ttl', () => {
        const cacheService = new CacheService();

        cacheService.set('key1', 'value1', { ttl: 1000 });

        expect(cacheService.get('key1')).toBe('value1');

        const resetTime = setTime(new Date().getTime() + 2000);

        expect(cacheService.get('key1')).toBe(undefined);

        resetTime();
    });
    
    test('Update value', () => {
        const cacheService = new CacheService();

        cacheService.set('key1', 'value1');
        cacheService.set('key1', 'value2');

        expect(cacheService.get('key1')).toBe('value2');
    });
    
    test('Remove value', () => {
        const cacheService = new CacheService();

        cacheService.set('key1', 'value1');
        cacheService.remove('key1');

        expect(cacheService.get('key1')).toBe(undefined);
    });
    
    test('"Set" event', () => {
        const cacheService = new CacheService();

        let testEvent = null; 

        cacheService.addListener(CacheService.events.SET, (event) => {
            testEvent = event;
        });

        cacheService.set('key1', 'value1');

        expect(testEvent).toMatchObject({
            eventName: CacheService.events.SET,
            data: {
                key: 'key1',
                value: 'value1'
            }
        });
    });
    
    test('"Get" event', () => {
        const cacheService = new CacheService();

        let testEvent = null; 

        cacheService.addListener(CacheService.events.GET, (event) => {
            testEvent = event;
        });

        cacheService.set('key1', 'value1');
        const testResult = cacheService.get('key1');

        expect(testResult).toBe('value1');
        expect(testEvent).toMatchObject({
            eventName: CacheService.events.GET,
            data: {
                key: 'key1',
                value: 'value1'
            }
        });
    });
    
    test('"Remove" event', () => {
        const cacheService = new CacheService();

        let testEvent = null; 

        cacheService.addListener(CacheService.events.REMOVE, (event) => {
            testEvent = event;
        });

        cacheService.set('key1', 'value1');
        cacheService.remove('key1');

        expect(testEvent).toMatchObject({
            eventName: CacheService.events.REMOVE,
            data: {
                key: 'key1',
                value: 'value1'
            }
        });
    });
    
    test('Extract state', () => {
        const cacheService = new CacheService();
        cacheService.set('key1', 'value1');

        const testStore = cacheService.extract();

        expect(testStore).toMatchObject({
            'key1': {
                value: 'value1',
                ttl: null
            }
        });
    });
    
    test('Load state', () => {
        const cacheService = new CacheService();

        cacheService.load({
            'key1': {
                value: 'value1',
                ttl: null,
                stored: new Date().getTime()
            }
        });

        expect(cacheService.get('key1')).toBe('value1');
    });
});
