Package.describe({
   summary: "a slightly more flexible way to do reactive variables"
});

Package.on_use(function (api) {
   api.export("ReactiveVariable");	
   api.add_files('lib/ReactiveVariable.js', 'client');
});
