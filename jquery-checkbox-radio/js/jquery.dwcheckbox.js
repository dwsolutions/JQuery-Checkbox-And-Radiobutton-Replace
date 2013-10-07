/**************************************************
The MIT License (MIT)

Copyright (c) 2013 DWSolutions

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**************************************************/
(function ($) {
    var addCheckbox = function (e) {
        if (!e) {
            e = window.event;
        }
    };

    $.fn.dwcheckbox = function (options) {
        document.execCommand('BackgroundImageCache', false, true);
        var settings = { style_name: 'jquery-checkbox', placeholder: 'image/placeholder.png' },
            addEvents = function (obj) {
                var boolChecked = obj.checked, boolDisabled = obj.disabled, $obj = $(obj);

                if (obj.stateInterval) {
                    clearInterval(obj.stateInterval);
                }

                obj.stateInterval = setInterval(
                    function () {
                        if (obj.disabled !== boolDisabled) {
                            $obj.trigger(boolDisabled = (!!obj.disabled ? 'disable' : 'enable'));
                        }

                        if (obj.checked !== boolChecked) {
                            $obj.trigger(boolChecked = (!!obj.checked ? 'check' : 'uncheck'));
                        }
                    }, 10);
                return $obj;
            };

        settings = $.extend(settings, options || {});

        return this.each(function () {
            var chkbx = this, $chkbx_element = addEvents(chkbx);

            // Removing wrapper if applied
            if (chkbx.wrapper) {
                chkbx.wrapper.remove();
            }                

            // Creating wrapper for element
            chkbx.wrapper = $('<span class="' + settings.style_name + '"><span class="mark"><img src="' + settings.placeholder + '" /></span></span>');
            chkbx.wrapperInner = chkbx.wrapper.children('span:eq(0)');
            chkbx.wrapper.hover(
                function (e) {
                    chkbx.wrapperInner.addClass(settings.style_name + '-hover');
                    addCheckbox(e);
                },
                function (e) {
                    chkbx.wrapperInner.removeClass(settings.style_name + '-hover');
                    addCheckbox(e);
                }
            );

            $chkbx_element.css({position: 'absolute', zIndex: -1, visibility: 'hidden'}).after(chkbx.wrapper);

            // Find the label for the element
            var label = false;
            if ($chkbx_element.attr('id')) {
                label = $('label[for=' + $chkbx_element.attr('id') + ']');
                if (!label.length) {
                    label = false;
                }                    
            }

            // If label not found, check if a label element in the environment
            // of the checkable element
            if (!label) {
                label = $chkbx_element.closest ? $chkbx_element.closest('label') : $chkbx_element.parents('label:eq(0)');
                if (!label.length) {
                    label = false;
                }
            }

            // If label found, applying event handlers for it
            if (label) {
                label.hover(
                    function (e) {
                        chkbx.wrapper.trigger('mouseover', [e]);
                    },
                    function (e) {
                        chkbx.wrapper.trigger('mouseout', [e]);
                    }
                );
                label.live("click", function (e) {
                    $chkbx_element.trigger('click', [e]);
                    addCheckbox(e);
                    return false;
                });
            }

            chkbx.wrapper.live("click", function (e) {
                $chkbx_element.trigger('click', [e]);
                addCheckbox(e);
                return false;
            });

            $chkbx_element.live("click", function (e) {
                addCheckbox(e);
            });

            $chkbx_element.bind('disable', function () {
                chkbx.wrapperInner.addClass(settings.style_name + '-disabled');
            }).bind('enable', function () {
                chkbx.wrapperInner.removeClass(settings.style_name + '-disabled');
            });

            $chkbx_element.bind('check', function () {
                chkbx.wrapper.addClass(settings.style_name + '-checked');
            }).bind('uncheck', function () {
                chkbx.wrapper.removeClass(settings.style_name + '-checked');
            });

            // Disable image drag-n-drop for IE
            $('img', chkbx.wrapper).bind('dragstart', function () {
                return false;
            }).bind('mousedown', function () {
                return false;
            });

            //  Anti-select hack for Mozilla FF
            if (window.getSelection) {
                chkbx.wrapper.css('MozUserSelect', 'none');
            }

            if (chkbx.checked) {
                chkbx.wrapper.addClass(settings.style_name + '-checked');
            }

            if (chkbx.disabled) {
                chkbx.wrapperInner.addClass(settings.style_name + '-disabled');
            }
        });
    };
})(jQuery);
