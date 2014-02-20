/**
 *    ReactiveVariable
 *
 *    Easy to use wrapper for reactive variables
 *    can use Session or not
 *    hooks for before setting the value or
 *    after getting the value
 *
 *    EXAMPLES==========================
 *
 *      1) Vanilla example using memory as store
 *
 *      var showEditingPanel = new ReactiveVariable({
 *          name: "showEditingPanel"
 *          ,defaultValue: false
 *      });
 *
 *      showEditingPanel.get();   // returns false!
 *
 *      2) modifying the return value elegantly with a hook
 *
 *      var showEditingPanel = new ReactiveVariable({
 *          name: "showEditingPanel"
 *          ,defaultValue: false
 *          ,afterGet: function(value){
 *               return (value) ? 'show' : 'hidden';
 *          }
 *      });
 *
 *      showEditingPanel.get();   // returns hidden - makes {{showEditingPanel}} like simple!
 *      showEditPanel.set(true);  // using the saner true/false to switch values
 *      showEditingPanel.get();   // now it returns 'show'! magic!
 *
 *
 *      3) or maybe you wanna munge the value a bit before setting it, or perhaps run some
 *         other supporting functions before it gets set.
 *
 *      var showEditingPanel = new ReactiveVariable({
 *          name: "showEditingPanel"
 *          ,defaultValue: 'http://ruzz.org"
 *          ,beforeSet: function(value){
 *               return value + 'is awesome!'
 *          }
 *      });
 *
 *      showEditingPanel.get();   // returns 'ruzz is awesome'
 *      showEditPanel.set('bill);
 *      showEditingPanel.get();   // returns 'bill is awesome'
 *
 *      4) Vanilla example using Meteor Session as store
 *
 *      var showEditingPanel = new ReactiveVariable({
 *          name: "showEditingPanel"
 *          ,defaultValue: false
 *          ,dictionary: Session
 *      });
 *
 *      works the exact same as example 1 but now uses the Session to store the value
 *      Session.get('showEditingPanel');  // returns 'false';
 *
 *
 *
 *      @version 0.3
 *      @author imruzz@gmail.com
 *      @param {object} config
 *      @todo: flesh out the equals function
 *
 */

ReactiveVariable = function(config){
    var self = this,
        originalConfig = config,
        _defaultValue = null,
        _dictionary = { get: function(){} ,set: function(){}, type: 'memory'},
        _deps = new Deps.Dependency,
        _beforeSet = function(value){ return value;},
        _afterGet = function(value){ return value;},
        _transport;

    var setup = function (config){

        if (!typeof(config) === "object" ) return;
        _defaultValue = (typeof( config.defaultValue ) === 'undefined') ? '' : config.defaultValue;
        if (typeof( config.beforeSet ) === 'function') _beforeSet = config.beforeSet;
        if (typeof( config.afterGet ) === 'function') _afterGet = config.afterGet;
        if (typeof( config.dictionary ) === 'object') {
            _dictionary = config.dictionary;
            _transport = 'ReactiveDict';
        }



    }
    setup(config);

    var _set = function( value ) {
        var newValue = _beforeSet( value );
        if (_transport){
            _dictionary.set(originalConfig.name, value);
            return;
        }
        _defaultValue = newValue;
        _deps.changed();


    }

    var _get = function(){
        var value;

        if (_transport) {
          value  = _afterGet( _dictionary.get(originalConfig.name));
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
