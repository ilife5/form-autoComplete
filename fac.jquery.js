;
(function() {
    $.fn.formAutoComplete = function(options)
    {

        /*
         * Get/Set the settings
         */
        var settings = $.extend(
            {
                'prefix'         : 'formAutoComplete-',
                'erase'          : false,
                'days'           : 3,
                'autosave'       : true,
                'savenow'        : false,
                'recover'        : false,
                'autorecover'    : true,
                'checksaveexists': false,
                'exclude'        : []
            }, options);

        /*
         * Define the form
         */
        var theform = this;

        /*
         * Define the storage_id
         */
        var storage_id = settings.prefix + theform.attr('id');

        /*
         * Erase a storage
         */
        if(settings['erase'] == true)
        {
            store.remove( storage_id);
            return true;
        }

        /*
         * Get the forms save (if it has one of course)
         */
        var savedStorage = getStorage(storage_id);

        /*
         * Check to see if a save exists
         */
        if(settings['checksaveexists'] == true)
        {
            return !!savedStorage;
        }

        /*
         * Perform a manual save
         */
        if(settings['savenow'] == true)
        {
            var form_data = getFormData(theform, settings['exclude']);
            autoSave(form_data);

            return true;
        }


        /*
         * Recover the form info from the storage (if it has one)
         */
        if(settings['autorecover'] == true || settings['recover'] == true)
        {
            if(savedStorage)
            {
                var savedString = savedStorage.split(':::--FORMSPLITTERFORVARS--:::');

                var field_names_array = {};

                $.each(savedString, function(i, field)
                {
                    var fields_arr = field.split(':::--FIELDANDVARSPLITTER--:::');

                    if($.trim(fields_arr[0]) != '')
                    {
                        if($.trim(fields_arr[0]) in field_names_array)
                        {
                            field_names_array[$.trim(fields_arr[0])] = (field_names_array[$.trim(fields_arr[0])] + ':::--MULTISELECTSPLITTER--:::' + fields_arr[1]);
                        }
                        else
                        {
                            field_names_array[$.trim(fields_arr[0])] = fields_arr[1];
                        }
                    }
                });

                $.each(field_names_array, function(key, value)
                {
                    if(strpos(value, ':::--MULTISELECTSPLITTER--:::') > 0)
                    {
                        var tmp_array = value.split(':::--MULTISELECTSPLITTER--:::');

                        $.each(tmp_array, function(tmp_key, tmp_value)
                        {
                            $('input[name="' + key + '"], select[name="' + key + '"], textarea[name="' + key + '"]').find('[value="' + tmp_value + '"]').prop('selected', true);
                            $('input[name="' + key + '"][value="' + tmp_value + '"], select[name="' + key + '"][value="' + tmp_value + '"], textarea[name="' + key + '"][value="' + tmp_value + '"]').prop('checked', true);
                        });
                    }
                    else
                    {
                        $('input[name="' + key + '"], select[name="' + key + '"], textarea[name="' + key + '"]').val([value]);
                    }
                });
            }

            /*
             * if manual recover action, return
             */
            if(settings['recover'] == true)
            {
                return true;
            }
        }


        /*
         * Autosave - on typing and changing
         */
        if(settings['autosave'] == true)
        {
            this.find('input, select, textarea').each(function()
            {
                $(this).change(function()
                {
                    var form_data = getFormData(theform, settings['exclude']);
                    autoSave(form_data);
                });

                $(this).keyup(function()
                {
                    var form_data = getFormData(theform, settings['exclude']);
                    autoSave(form_data);
                });
            });
        }


        /*
         * Save form data to storage
         */
        function autoSave(data)
        {
            var storageString = '';

            jQuery.each(data, function(i, field)
            {
                storageString = storageString + field.name + ':::--FIELDANDVARSPLITTER--:::' + field.value + ':::--FORMSPLITTERFORVARS--:::';
            });

            store.set(storage_id, { val:storageString, exp:settings.days * 24 * 3600 * 1000, time:new Date().getTime() })

        }

        function getStorage(storage_id) {
            var info = store.get(storage_id);
            if (!info) { return null }
            if (new Date().getTime() - info.time > info.exp) {
                store.remove(storage_id);
                return null
            }
            return info.val
        }

        /*
         * strpos - equiv to PHP's strpos
         */
        function strpos(haystack, needle, offset)
        {
            var i = (haystack+'').indexOf(needle, (offset || 0));
            return i === -1 ? false : i;
        }

        /*
         * Serialize the form data, omit excluded fields marked with data-sayt-exclude attribute.
         */
        function getFormData(theform, excludeSelectors)
        {
            //
            // This is here because jQuery's clone method is basically borked.
            //
            // Once they fix that, we'll put it back.
            //
            var workingObject = $.extend({}, theform);

            var elementsToRemove = workingObject.find('[data-sayt-exclude]');
            elementsToRemove.remove();
            for (var i in excludeSelectors) {
                elementsToRemove = workingObject.find(excludeSelectors[i]);
                elementsToRemove.remove();
            }

            return workingObject.serializeArray();
        }
    };

    return $;
})();