(function ($) {
    "use strict";

    var Password = function (options) {
        this.init('password', options, Password.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Password, $.fn.editabletypes.abstractinput);
    $.extend(Password.prototype, {
        /** Renders input from tpl
        @method render() **/
        render: function() {
           this.$input = this.$tpl.find('input');
        },

        /**
        Default method to show value in element. Can be overwritten by display option.
        @method value2html(value, element)
        **/
        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return;
            }
//            var html = $('<div>').text(value.pass).html() + ', ' + $('<div>').text(value.street).html() + ' st., bld. ' + $('<div>').text(value.building).html();
            var html="Change Password";
            $(element).html(html);
        },

        /**
        Gets value from element's html
        @method html2value(html)
        **/
        html2value: function(html) {
          /*
            you may write parsing method to get value by element's html
            e.g. "Moscow, st. Lenina, bld. 15" => {city: "Moscow", street: "Lenina", building: "15"}
            but for complex structures it's not recommended.
            Better set value directly via javascript, e.g.
            editable({
                value: {
                    city: "Moscow",
                    street: "Lenina",
                    building: "15"
                }
            });
          */

          return null;
        },

       /**
        Converts value to string.
        It is used in internal comparing (not for sending to server).

        @method value2str(value)
       **/
       value2str: function(value) {
           var str = '';
           if(value) {
               for(var k in value) {
                   str = str + k + ':' + value[k] + ';';
               }
           }
           return str;
       },
       /*
        Converts string to value. Used for reading value from 'data-value' attribute.

        @method str2value(str)
       */
       str2value: function(str) {
           /*
           this is mainly for parsing value defined in data-value attribute.
           If you will always set value by javascript, no need to overwrite it
           */
           return str;
       },
       /**
        Sets value of input.
        @method value2input(value)
        @param {mixed} value
       **/
       value2input: function(value) {
           if(!value) {
             return;
           }
           //this.$input.filter('[name="password"]').val(value.password);
           this.$input.filter('[name="password"]').val('');
           this.$input.filter('[name="confirmpwd"]').val('');
       },
       /**
        Returns value of input.

        @method input2value()
       **/
       input2value: function() {
           return {
              password: this.$input.filter('[name="password"]').val(),
              confirmpwd: this.$input.filter('[name="confirmpwd"]').val()
           };
       },
        /**
        Activates input: sets focus on the first field.
        @method activate()
       **/
       activate: function() {
            this.$input.filter('[name="password"]').focus();
       },
       /**
        Attaches handler to submit form in case of 'showbuttons=false' mode
        @method autosubmit()
       **/
       autosubmit: function() {
           this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
           });
       }
    });

    Password.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div class="editable-address remove_form_control required"><label><span>New Password&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><input placeholder="" type="password" name="password" id="password" class="form-control input-small" autocomplete="off"/></label></div>'+
             '<div class="editable-address remove_form_control required m-b-5"><label><span>Confirm Password </span><input type="password" name="confirmpwd" id="confirmpwd" class="form-control input-small m-t-5" autocomplete="off"></label></div>',
        inputclass: ''
    });

    $.fn.editabletypes.password = Password;

}(window.jQuery));