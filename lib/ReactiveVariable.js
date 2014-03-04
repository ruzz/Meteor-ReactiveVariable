/**
 *    ReactiveVariable
 *
 *    Easy to use wrapper for reactive variables
 *    can use Session or not
 *    hooks for before setting the value or
 *    after getting the value
 *
 *      @version 0.3.5
 *      @author imruzz@gmail.com
 *      @param {object} config
 *      @todo: flesh out the equals function
 *
 */
(function () {
    
ReactiveVariable = function(config){
    var self = this,
        _originalConfig = config,
        _defaultValue = null,
        _dictionary = { get: function(){} ,set: function(){}, type: 'memory'},
        _deps = new Deps.Dependency,
        _beforeSet = function(value){ return value;},
        _afterGet = function(value){ return value;},
        _transport;

    var setup = function (config){

        if (!typeof(config) === "object" ) return;
        config.defaultValue = (typeof( config.defaultValue ) === 'undefined') ? '' : config.defaultValue;
        if (typeof( config.beforeSet ) === 'function') _beforeSet = config.beforeSet;
        if (typeof( config.afterGet ) === 'function') _afterGet = config.afterGet;
        if (typeof( config.dictionary ) === 'object') {
            _dictionary = config.dictionary;
            _transport = 'ReactiveDict';
            _dictionary.set(config.name, _beforeSet(config.defaultValue));
        } else {

            _defaultValue = _beforeSet(config.defaultValue);
        }
    }
    
    setup(config);

    var _set = function( value ) {
        var newValue = _beforeSet( value );
        if (_transport){
            _dictionary.set(_originalConfig.name, value);
            return;
        }
        _defaultValue = newValue;
        _deps.changed();


    }

    var _get = function(){
        var value;

        if (_transport) {
          value  = _afterGet( _dictionary.get(_originalConfig.name));
        } else {
            value = _afterGet(_defaultValue);
            _deps.depend();
        }
        return value;
    }

    return {
        get: function(){
           return _get();
        }
        ,set: function(value){
            _set(value);
        }
        ,equals: function( compareTo ){

        }
        ,notEquals: function( compareTo ){

        }
        ,baseValue: function(){
            return _defaultValue;
        }
        ,transport: function(){
            return _transport || 'Memory';
        }
    };

};

}());
