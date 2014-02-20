/*!
 * Toke v0.1.1
 * Doron Horwitz
 * https://github.com/doronhorwitz/Toke
 * Date: 2013-02-20
 *
 * Copyright 2013 Doron Horwitz
 * Released under the BSD New License
 * https://raw.github.com/doronhorwitz/Toke/master/LICENSE

 * Makes use of functionality, regexes and formatting tokens from Moment.js
 * by Tim Wood
 * http://momentjs.com/
 * License: https://raw.github.com/timrwood/moment/develop/LICENSE
 *
 */

;(function tokeModule(module, window, undefined) {
    "use strict";

    var VERSION          = "0.1.1",
        //regex from Moment.js
        formattingTokens     = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
        //the "dd" token is included even though it is not mentioned in http://momentjs.com/docs/#/displaying/format/, it does exist
        //it is a two letter day of the week (Mo, Tu etc..)
        momentjsTokens       = ["M","Mo","MM","MMM","MMMM","D","Do","DD","DDD","DDDo","DDDD","d","dd","do","ddd","dddd","w","wo","ww","W","Wo","WW","YY","YYYY","A","a","H","HH","h","hh","m","mm","s","ss","S","SS","SSS","z","zz","Z","ZZ","X"],
        lookupRequiredFields = [
            ["noTranslationMarker","string"],
            ["tokenPrefix","string"],
            ["tokenSuffix","string"],
            ["escapePrefix","string"],
            ["escapeSuffix","string"],
            ["tokens","object"]
        ],
        lookupDefaultValues  = {
            "string": "",
            "object": {}
        },
        tokenLookup = {
            sugar: {
                tokenPrefix: "{",
                tokenSuffix: "}",
                tokens: {
                    M:    "M",
                    MM:   "MM",
                    MMM:  "Mon",
                    MMMM: "Month",
                    D:    "d",
                    Do:   "ord",
                    DD:   "dd",
                    ddd:  "Dow",
                    dddd: "Weekday",
                    YY:   "yy",
                    YYYY: "yyyy",
                    A:    "tt",
                    a:    "Tt",
                    H:    "H",
                    HH:   "HH",
                    h:    "h",
                    hh:   "hh",
                    m:    "m",
                    mm:   "mm",
                    s:    "s",
                    ss:   "ss",
                    SS:   "ff",
                    SSS:  "f",
                    Z:    "isotz",
                    ZZ:   "tz"
                }
            },
            jqueryui: {
                tokens: {
                    M:    "m",
                    MM:   "mm",
                    MMM:  "M",
                    MMMM: "MM",
                    D:    "d",
                    DD:   "dd",
                    DDD:  "o",
                    DDDD: "oo",
                    ddd:  "D",
                    dddd: "DD",
                    YY:   "y",
                    YYYY: "yy",
                    X:    "@"
                }
            },
            datejs: {
                tokens: {
                    M:    "M",
                    MM:   "MM",
                    MMM:  "MMM",
                    MMMM: "MMMM",
                    D:    "d",
                    Do:   "dS",
                    DD:   "dd",
                    ddd:  "ddd",
                    dddd: "dddd",
                    YY:   "yy",
                    YYYY: "yyyy",
                    A:    "tt",
                    H:    "H",
                    HH:   "HH",
                    h:    "h",
                    hh:   "hh",
                    m:    "m",
                    mm:   "mm",
                    s:    "s",
                    ss:   "ss"
                }
            },
            stevenlevithan: {
                escapePrefix: "'",
                escapeSuffix: "'",
                tokens: {
                    M:    "m",
                    MM:   "mm",
                    MMM:  "mmm",
                    MMMM: "mmmm",
                    D:    "d",
                    Do:   "dS",
                    DD:   "dd",
                    ddd:  "ddd",
                    dddd: "dddd",
                    YY:   "yy",
                    YYYY: "yyyy",
                    A:    "TT",
                    a:    "tt",
                    H:    "H",
                    HH:   "HH",
                    h:    "h",
                    hh:   "hh",
                    m:    "M",
                    mm:   "MM",
                    s:    "s",
                    ss:   "ss",
                    SS:   "L",
                    SSS:  "l",
                    z:    "Z",
                    ZZ:   "o"
                }
            },
            php: {
                tokenPrefix: "%",
                tokens: {
                    MM:   "m",
                    MMM:  "b",
                    MMMM: "B",
                    D:    "e",
                    DD:   "d",
                    DDDD: "j",
                    d:    "w",
                    ddd:  "a",
                    dddd: "A",
                    w:    "U",
                    W:    "V",
                    YY:   "y",
                    YYYY: "Y",
                    A:    "p",
                    a:    "P",
                    H:    "k",
                    HH:   "H",
                    h:    "l",
                    hh:   "I",
                    mm:   "M",
                    ss:   "S",
                    z:    "Z",
                    zz:   "Z",
                    X:    "x"
                }
            }
        };

    module.convert = function convert(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters, includeTokenPrefixesAndSuffixes) {
        var libraryName                     = libraryName.toLowerCase(),
            replaceUnregonisedTokens        = (typeof replaceUntranslatableTokens !== "boolean")?false:replaceUntranslatableTokens,
            translateEscapeCharacters       = (typeof translateEscapeCharacters !== "boolean")?true:translateEscapeCharacters;
            includeTokenPrefixesAndSuffixes = (typeof includeTokenPrefixesAndSuffixes !== "boolean")?true:includeTokenPrefixesAndSuffixes;

        if (libraryName in tokenLookup) {
            return doConversion(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters, includeTokenPrefixesAndSuffixes);
        } else if (libraryName === "momentjs") {
            return originalFormatString
        } else {
            throw new TokeError("library name not recognised");
        }
    };

    module.addCustomTokenLookup = function addCustomTokenLookup(customTokenLookup) {
        //insert custom token lookups
        var newLibraryNames = [];
        if (typeof customTokenLookup === "object") {
            for (var libraryName in customTokenLookup) {
                if (Object.prototype.hasOwnProperty.call(customTokenLookup, libraryName) &&
                    (typeof customTokenLookup[libraryName] === "object")) {
                    newLibraryNames.push(libraryName);
                    tokenLookup[libraryName] = customTokenLookup[libraryName];
                }
            }
        }

        fillLookupParams(newLibraryNames);
    };

    function fillLookupParams(newLibraryNames) {
        //resiliency for custom and internal library token lookups
        for (var i = 0; i < newLibraryNames.length; i++) {
            if (Object.prototype.hasOwnProperty.call(tokenLookup, newLibraryNames[i])) {

                //ensure lookup is an object
                if (typeof tokenLookup[newLibraryNames[i]] !== "object") {
                    tokenLookup[newLibraryNames[i]] = {};
                }

                var j;

                //ensure the lookup has all the required fields
                for (j = 0; j < lookupRequiredFields.length; j++) {
                    var lookupFieldName = lookupRequiredFields[j][0],
                        lookupFieldType = lookupRequiredFields[j][1],
                        libraryLookup   = tokenLookup[newLibraryNames[i]];

                    if (typeof libraryLookup[lookupFieldName] !== lookupFieldType) {
                        libraryLookup[lookupFieldName] = lookupDefaultValues[lookupFieldType]
                    }
                }

                //ensure that all the lookup tokens that aren't strings, become null
                for (j = 0; j < momentjsTokens.length; j++) {
                    if (typeof tokenLookup[newLibraryNames[i]].tokens[momentjsTokens[j]] !== "string") {
                        tokenLookup[newLibraryNames[i]].tokens[momentjsTokens[j]] = null;
                    }
                }
            }
        }
    }

    module.version = VERSION;

    //from Moment.js
    function removeFormattingTokens(input, libraryName, translateEscapeCharacters) {
        if (translateEscapeCharacters && input.match(/\[.*\]/)) {
            return input
                .replace(/^\[/g,tokenLookup[libraryName].escapePrefix)
                .replace(/\]$/g,tokenLookup[libraryName].escapeSuffix);
        }
        return input.replace(/\\/g, "");
    }

    function doConversion(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters, includeTokenPrefixesAndSuffixes) {
        var array = originalFormatString.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            var lookedUpToken = tokenLookup[libraryName].tokens[array[i]];
            if (lookedUpToken) {
                array[i] =  ((includeTokenPrefixesAndSuffixes)?tokenLookup[libraryName].tokenPrefix:'') +
                            lookedUpToken +
                            ((includeTokenPrefixesAndSuffixes)?tokenLookup[libraryName].tokenSuffix:'');
            } else if ((lookedUpToken === null) && replaceUntranslatableTokens) {
                array[i] = tokenLookup[libraryName].noTranslationMarker||"";
            } else {
                array[i] = removeFormattingTokens(array[i], libraryName, translateEscapeCharacters);
            }
        }
        return array.join("");
    }


    function TokeError(message) {
        this.message = message + " (Toke error)";
    }
    TokeError.prototype = new Error();
    TokeError.prototype.constructor = TokeError;

    //get all current library names ensure that all relevant params for the lookup are filled in
    var libraryNames = [];
    for (var libraryName in tokenLookup) {
        libraryNames.push(libraryName);
    }
    fillLookupParams(libraryNames);

    //look if a customTokenLookup was specified before Toke was loaded. If so, load it.
    module.addCustomTokenLookup(module.customTokenLookup);

}(window.Toke = window.Toke||{}, window));
