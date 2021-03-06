# Meteor-ReactiveVariable
***

A simple wrapper class for easy creation/access to Meteor reactive variables (using session or not)

now wrapped up as a meteorite package. 

## install: 
***

`mrt add reactive-variable`

## usage: 
***

### examples 
***
1) Vanilla example using memory as store

```javascript
 
       var showEditingPanel = new ReactiveVariable({
           name: "showEditingPanel"
           ,defaultValue: false
       });
 
       showEditingPanel.get();   // returns false!
``` 

2) modifying the return value elegantly with a hook

```javascript
 
       var showEditingPanel = new ReactiveVariable({
           name: "showEditingPanel"
           ,defaultValue: false
           ,afterGet: function(value){
                return (value) ? 'show' : 'hidden';
           }
       });
 
       showEditingPanel.get();   // returns hidden - makes {{showEditingPanel}} like simple!
       showEditPanel.set(true);  // using the saner true/false to switch values
       showEditingPanel.get();   // now it returns 'show'! magic!
```

3) or maybe you wanna munge the value a bit before setting it, or perhaps run some other supporting functions before it gets set.

```javascript
 
       var showEditingPanel = new ReactiveVariable({
           name: "showEditingPanel"
           ,defaultValue: "ruzz"
           ,beforeSet: function(value){
                return value + 'is awesome!'
           }
       });
 
       showEditingPanel.get();   // returns 'ruzz is awesome'
       showEditPanel.set('bill');
       showEditingPanel.get();   // returns 'bill is awesome'
```
4) Vanilla example using Meteor Session as store

```javascript
       var showEditingPanel = new ReactiveVariable({
           name: "showEditingPanel"
           ,defaultValue: false
           ,dictionary: Session
       });
```

works the exact same as example 1 but now uses the Session
to store the value 

`Session.get('showEditingPanel');  // returns 'false';`
