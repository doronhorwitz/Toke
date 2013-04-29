Toke
====
By [Doron Horwitz](http://milktek.com/ "milktek.com")

Description
-----------
Use a single datetime token syntax throughout your Javascript project, irrespective of any 3rd party date-related library you may use. Toke uses a single token syntax and allows you to output a version which can be understood by the different libraries in your project.

This allows you to set a single datetime format in a settings file and then ensure that any changes you make it to will be reflected across the whole project if you are using different libraries for date formatting.

Toke uses the datetime formatting tokens of the [Moment.js library](http://momentjs.com/ "Moment.js") as its universal token syntax.

For example, say you are using Datejs for outputting a date in a particular format, but you also need your JqueryUI datepicker to display its date with the exact same format.
So if the format you wanted was, in Moment.js syntax, `DD-MMMM-YYYY`, you would set it globally:
```javascript
globalFormat = "DD-MMMM-YYYY";
```
Then to specify your jQueryUI's datepickers format, you would do:
```javascript
$( ".selector" ).datepicker({ dateFormat: Toke.convert(globalFormat,"jqueryui") });
````
And to output a date using Datejs, you would do:
```javascript
var myDate        = Date(),
    formattedDate = myDate.toString(Toke.convert(globalFormat,"datejs"));

alert(formattedDate);
```

Installation
------------
Include the Javascript:
```html
<script src="toke.js" type="text/javascript"></script>
```

Usage
-----
The script makes the following function available

```javascript
Toke.convert(originalFormatString, libraryName, [replaceUntranslatableTokens, [translateEscapeCharacters]])
```
The function takes the following arguments:
* **originalFormatString**
    * Type: string
    * Required: yes
    * Description: the format string using Moment.js syntax. See [here](http://momentjs.com/docs/#/displaying/format/ "Moment.js tokens") for the available tokens.
* **libraryName**
    * Type: string
    * Required: yes
    * Description: the library into whose syntax to convert the `originalFormatString`. See the [Support](#support) section for the available destination library formats. If `libraryName` refers to a library that is not supported, an `Error` will be thrown.
* **replaceUntranslatableTokens**
    * Type: boolean
    * Required: no
    * Default: `false`
    * Description: if `true` the tokens that do not have a direct translation from the Moment.js syntax are replaced with a `noTranslation` marker. If `false` the original Moment.js token appears in the final string.
* **translateEscapeCharacters**
    * Type: boolean
    * Required: no
    * Default: `true`
    * Description: Moment.js uses the `[ ]` escape characters to deliniate that a token should not be processed as a token but rather as a string. If `translateEscapeCharacters` is set to `true` then the escape characters will be removed (or replaced with the escape characters of the destination library) in the output string, if `false` they will appear in the final string.

### Examples
```javascript
Toke.convert('DD MMMM YYYY, HH:mm:ss','sugar')
```
Will output `{dd} {Month} {yyyy}, {HH}:{mm}:{ss}`
```javascript
Toke.convert('DD MMMM YYYY, HH:mm:ss','jqueryui')
```
Will output `dd MM yy, HH:mm:ss`, since jQueryUI does not support time token elements.
```javascript
Toke.convert('DD MMMM YYYY, HH:mm:ss','jqueryui', true)
```
Will output `dd MM yy, ::`, since jQueryUI does not support time token elements, `replaceUntranslatableTokens` is set to `true` and the `noTranslation` token is specified as an empty string.
```javascript
Toke.convert('DD MMMM [YYYY], HH:mm:ss','datejs')
```
Note that `YYYY` should translate to a `yyyy` Datejs token but the above will output `dd MMMM YYYY, HH:mm:ss`, since `[ ]` deliniates escape characters in Moment.js' token syntax and Datejs does not have an `escapePrefix` or `escapeSuffix` and `translateExcapeCharacters` defaults to `true`.

<a id="support"></a>Support
-------
Toke currently supports conversion into the syntax of the following libraries:
* [Sugar](http://sugarjs.com/ "Sugar")
    * See the section on [dates](http://sugarjs.com/dates "Sugar Dates")
    * *libraryName* attribute: `sugar`
* [jQueryUI](http://jqueryui.com "jQuery UI")
    * Support for the [$.datepicker.formatDate()](http://docs.jquery.com/UI/Datepicker/formatDate "$.datepicker.formatDate()") and [$.datepicker.parseDate()](http://docs.jquery.com/UI/Datepicker/parseDate "$.datepicker.parseDate()") functions.
    * *libraryName* attribute: `jqueryui`
* [Datejs](http://www.datejs.com "Datejs")
    * See the section on `toString()` [FormatSpecifiers](http://code.google.com/p/datejs/wiki/FormatSpecifiers "Datejs FormatSpecifiers")
    * *libraryName* attribute: `datejs`
* [Steven Levithan's Date Format](http://blog.stevenlevithan.com/archives/date-time-format "Steven Levithan's Date Format")
    * *libraryName* attribute: `stevenlevithan`
* [PHP](http://php.net "PHP") (though [php.js](http://phpjs.org) is more relevant)
    * Support for [strftime()](http://php.net/manual/en/function.strftime.php) and [strptime()](http://php.net/manual/en/function.strptime.php)
    * *libraryName* attribute: `php`
* [Moment.js](http://momentjs.com "Moment.js")
    * Obviously.
    * Will ignore `replaceUntranslatableTokens` and `translateEscapeCharacters` and output the input format string untouched.
    * *libraryName* attribute: `momentjs`
* *More to come...*

Extending
---------
If you need Toke to support a library it does not currently support, it is possible to add your own custom token dictionary lookup *before* Toke is included.
For an example, see the example [custom_tokens.js](https://raw.github.com/doronhorwitz/Toke/master/custom_tokens.js "custom_tokens.js on GitHub") file for how to specify a custom lookup.
**Note that you have to specify the custom lookup before the Toke script is included, otherwise it will be ignored.**

License
-------
*Toke is covered by the BSD New License*

Copyright (c) 2013, Doron Horwitz
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* The name of Doron Horwitz may not be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.