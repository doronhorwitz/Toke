/*!
 * Toke v0.1.0
 * Doron Horwitz
 * https://github.com/doronhorwitz/Toke
 * Date: 2013-04-05
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

    var VERSION          = "0.1.0",
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
                    ZZ:   "tz",
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

    module.convert = function convert(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters) {
        var libraryName               = libraryName.toLowerCase(),
            replaceUnregonisedTokens  = (typeof replaceUntranslatableTokens !== "boolean")?false:replaceUntranslatableTokens,
            translateEscapeCharacters = (typeof translateEscapeCharacters !== "boolean")?true:translateEscapeCharacters;

        if (libraryName in tokenLookup) {
            return doConversion(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters);
        } else if (libraryName === "momentjs") {
            return originalFormatString
        } else {
            throw new TokeError("library name not recognised");
        }
    };

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

    function doConversion(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters) {
        var array = originalFormatString.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            var lookedUpToken = tokenLookup[libraryName].tokens[array[i]];
            if (lookedUpToken) {
                array[i] =  tokenLookup[libraryName].tokenPrefix +
                            lookedUpToken +
                            tokenLookup[libraryName].tokenSuffix;
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

    //insert custom token lookups
    if (typeof module.customTokenLookup === "object") {
        for (var libraryName in module.customTokenLookup) {
            if (Object.prototype.hasOwnProperty.call(module.customTokenLookup, libraryName) &&
                (typeof module.customTokenLookup[libraryName] === "object")) {
                tokenLookup[libraryName] = module.customTokenLookup[libraryName];
            }
        }
    }

    //resiliency for externally added library token lookups
    for (var libraryName in tokenLookup) {
        if (Object.prototype.hasOwnProperty.call(tokenLookup, libraryName)) {

            //ensure lookup is an object
            if (typeof tokenLookup[libraryName] !== "object") {
                tokenLookup[libraryName] = {};
            }

            var i;

            //ensure the lookup has all the required fields
            for (i = 0; i < lookupRequiredFields.length; i++) {
                var lookupFieldName = lookupRequiredFields[i][0],
                    lookupFieldType = lookupRequiredFields[i][1],
                    libraryLookup   = tokenLookup[libraryName];

                if (typeof libraryLookup[lookupFieldName] !== lookupFieldType) {
                    libraryLookup[lookupFieldName] = lookupDefaultValues[lookupFieldType]
                }
            }

            //ensure that all the lookup tokens that aren't strings, become null
            for (i = 0; i < momentjsTokens.length; i++) {
                if (typeof tokenLookup[libraryName].tokens[momentjsTokens[i]] !== "string") {
                    tokenLookup[libraryName].tokens[momentjsTokens[i]] = null;
                }
            }
        }
    }

}(window.Toke = window.Toke||{}, window));
