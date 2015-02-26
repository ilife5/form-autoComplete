# Form AutoComplete

> Form AutoComplete is a jQuery plugin for save and recover form data.

Based on [jQuery](https://github.com/jquery/jquery), [store.js](https://github.com/marcuswestin/store.js) and [json2](https://github.com/douglascrockford/JSON-js). It`s the pure store.js version of [jquery-save-as-you-type](https://github.com/BenGriffiths/jquery-save-as-you-type).


## Usage

```
Usage:	$(formId).formAutoComplete(options)

Options:

{
    'prefix'         : 'formAutoComplete-',		//prefix for set storage
    'erase'          : false,					//erase current data
    'days'           : 3,						//expire days
    'autosave'       : true,					
    'savenow'        : false,					
    'recover'        : false,					
    'autorecover'    : true,					
    'checksaveexists': false,					//return true if data saved
    'exclude'        : []						//selectors for excluding 
}

```

### default

```
//autosaved, autorecover, 3 days expire
$(formId).formAutoComplete()
```

### remove data

```
$(formId).formAutoComplete({"erase": true})
```

### save or recover manualy

```
$(formId).formAutoComplete({
	'autosave'       : false,
    'autorecover'    : false
})

//save
$(formId).formAutoComplete({
	'savenow'       : true
})

//recover
$(formId).formAutoComplete({
	'recover'       : true
})

```