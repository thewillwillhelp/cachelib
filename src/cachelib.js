class CacheService {
    constructor() {
        this._store = {};
        this._defaultTTL = null; // infinite        
        
        this._listeners = {
            [CacheService.events.GET]: [],
            [CacheService.events.SET]: [],
            [CacheService.events.REMOVE]: [],
        };        
    }
    
    /**
     * @param {String} key
     * @param {any} value
     * @param {Object} options
     * @param {Number} options.ttl
     * @return {void} 
     */
    set(key, value, options = {}) {
        this._store[key] = {
            value,
            stored: new Date().getTime(),
            ttl: options.ttl || this._defaultTTL
        }
        
        this._triggerEvent(CacheService.events.SET, {
            key,
            value,
            cachedObject: this._store[key],
            store: this.store
        });
    }
    
    /**
     * @param {String} key
     * @return {any}
     */
    get(key) {
        const tmpValue = this._store[key];
        
        if (!tmpValue) {
            return undefined;
        }
        
        if (tmpValue.ttl !== null) {
            const now = new Date().getTime();
            
            if (now > tmpValue.ttl + tmpValue.stored) {
                return undefined;
            }
        }
        
        this._triggerEvent(CacheService.events.GET, {
            key,
            value: tmpValue.value,
            cachedObject: tmpValue,
            store: this._store
        });
        
        return tmpValue.value;
    }
    
    /**
     * @param {String} key
     * @return {void}
     */
    remove(key) {
        const tmpValue = this._store[key];
        
        delete this._store[key];
        
        this._triggerEvent(CacheService.events.REMOVE, {
            key,
            value: tmpValue.value,
            cachedObject: tmpValue,
            store: this._store
        });
    }
    
    /**
     * @return {any}
     */
    extract() {
        return this._store;
    }
    
    /**
     * @return {void}
     */
    load(store) {
        this._store = store;
    }
    
    /**
     * @param {String} eventName
     * @param {Function} listener
     * @return {void}
     */
    addListener(eventName, listener) {
        if (!this._listeners[eventName]) {
            throw new Error('Unknown event');
        }
        
        this._listeners[eventName].push(listener);
        
        return () => {
            this._listeners[eventName] = this._listeners[eventName]
                .filter(storedListener => storedListener !== listener);
        }
    }
    
    /**
     * @private
     */
    _triggerEvent(eventName, data) {
        if (this._listeners[eventName]) {
            this._listeners[eventName].forEach(listener => listener.call(null, { eventName, data }));
        }
    }
}

CacheService.events = {
    SET: 'set',
    GET: 'get',
    REMOVE: 'remove'
}


module.exports.CacheService = CacheService;
