//Base fomatting tokens are those of Moment.js (www.momentjs.com)
//Therefore this module uses the Regex's and Regex functionality from Moment.js
;(function tokeModule(module, window, undefined) {
    "use strict";
    
    var VERSION          = "0.1.0",
        //regex from Moment.js
        formattingTokens     = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
        momentjsTokens       = ["M","Mo","MM","MMM","MMMM","D","Do","DD","DDD","DDDo","DDDD","d","do","ddd","dddd","w","wo","ww","W","Wo","WW","YY","YYYY","A","a","H","HH","h","hh","m","mm","s","ss","S","SS","SSS","z","zz","Z","ZZ","X"],
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
        };

    module.tokenLookup = {
        sugar: {
            noTranslationMarker: "{}",
            tokenPrefix:         "{",
            tokenSuffix:         "}",
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
        testlibrary: "string"
    };

    module.convert = function convert(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters) {
        var libraryName               = libraryName.toLowerCase(),
            replaceUnregonisedTokens  = (typeof replaceUntranslatableTokens !== "boolean")?false:replaceUntranslatableTokens,
            translateEscapeCharacters = (typeof translateEscapeCharacters !== "boolean")?true:translateEscapeCharacters;

        if (libraryName in module.tokenLookup) {
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
                .replace(/^\[/g,module.tokenLookup[libraryName].escapePrefix)
                .replace(/\]$/g,module.tokenLookup[libraryName].escapeSuffix);
        }
        return input.replace(/\\/g, "");
    }

    function doConversion(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters) {
        var array = originalFormatString.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            var lookedUpToken = module.tokenLookup[libraryName].tokens[array[i]];
            if (lookedUpToken) {
                array[i] =  module.tokenLookup[libraryName].tokenPrefix +
                            lookedUpToken +
                            module.tokenLookup[libraryName].tokenSuffix;
            } else if ((lookedUpToken === null) && replaceUntranslatableTokens) {
                array[i] = module.tokenLookup[libraryName].noTranslationMarker||"";
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


    //resiliency for externally added library token lookups
    for (var libraryName in module.tokenLookup) {
        if (Object.prototype.hasOwnProperty.call(module.tokenLookup, libraryName)) {

            //ensure lookup is an object
            if (typeof module.tokenLookup[libraryName] !== "object") {
                module.tokenLookup[libraryName] = {};
            }

            var i;

            //ensure the lookup has all the required fields
            for (i = 0; i < lookupRequiredFields.length; i++) {
                var lookupFieldName = lookupRequiredFields[i][0],
                    lookupFieldType = lookupRequiredFields[i][1],
                    libraryLookup   = module.tokenLookup[libraryName];

                if (typeof libraryLookup[lookupFieldName] !== lookupFieldType) {
                    libraryLookup[lookupFieldName] = lookupDefaultValues[lookupFieldType]
                }
            }

            //ensure that all the lookup tokens that aren't strings, become null
            for (i = 0; i < momentjsTokens.length; i++) {
                if (typeof module.tokenLookup[libraryName].tokens[momentjsTokens[i]] !== "string") {
                    module.tokenLookup[libraryName].tokens[momentjsTokens[i]] = null;
                }
            }
        }   
    }

}(window.Toke = window.Toke||{}, window));
