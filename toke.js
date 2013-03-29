//Base fomatting tokens are those of Moment.js (www.momentjs.com)
//Therefore this module uses the Regex's and Regex functionality from Moment.js
;(function tokeModule(module, window, undefined) {
    "use strict";
    
    //from Moment.js
    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g;

    module.tokenLookup = {
        sugar: {
            noTranslation: "{}",
            tokens: {
                //Month
                M:    "{M}",         //1 2 ... 11 12
                Mo:   null,          //1st 2nd ... 11th 12th
                MM:   "{MM}",        //01 02 ... 11 12
                MMM:  "{Mon}",       //Jan Feb ... Nov Dec
                MMMM: "{Month}",     //January February ... November December
                //Day of Month
                D:    "{d}",         //1 2 ... 30 30
                Do:   "{ord}",       //1st 2nd ... 30th 31st
                DD:   "{dd}",        //01 02 ... 30 31
                //Day of Year
                DDD:  null,          //1 2 ... 364 365
                DDDo: null,          //1st 2nd ... 364th 365th
                DDDD: null,          //001 002 ... 364 365
                //Day of Week
                d:    null,          //0 1 ... 5 6
                do:   null,          //0th 1st ... 5th 6th
                ddd:  "{Dow}",       //Sun Mon ... Fri Sat
                dddd: "{Weekday}",   //Sunday Monday ... Friday Saturday
                //Week of Year
                w:    null,          //1 2 ... 52 53
                wo:   null,          //1st 2nd ... 52nd 53rd
                ww:   null,          //01 02 ... 52 53
                //ISO Week of Year
                W:    null,          //1 2 ... 52 53
                Wo:   null,          //1st 2nd ... 52nd 53rd
                WW:   null,          //01 02 ... 52 53
                //Year           
                YY:   "{yy}",        //70 71 ... 29 30
                YYYY: "{yyyy}",      //1970 1971 ... 2029 2030
                //AM/PM
                A:    "{tt}",        //AM PM
                a:    "{Tt}",        //am pm
                //Hour           
                H:    "{H}",         //0 1 ... 22 23
                HH:   "{HH}",        //00 01 ... 22 23
                h:    "{h}",         //1 2 ... 11 12
                hh:   "{hh}",        //01 02 ... 11 12
                //Minute
                m:    "{m}",         //0 1 ... 58 59
                mm:   "{mm}",        //00 01 ... 58 59
                //Second
                s:    "{s}",         //0 1 ... 58 59
                ss:   "{ss}",        //00 01 ... 58 59
                //Fractional Second
                S:    null,          //0 1 ... 8 9
                SS:   "{ff}",        //0 1 ... 98 99
                SSS:  "{f}",         //0 1 ... 998 999
                //Timezone
                z:    null,          //EST CST ... MST PST 
                zz:   null,          //Same as "z"
                Z:    "{isotz}",     //-07:00 -06:00 ... +06:00 +07:00
                ZZ:   "{tz}",        //-0700 -0600 ... +0600 +0700
                //Unix Timestamp
                X:    null           //1360013296
            }
        },
        jqueryui: {
            noTranslation: "[]",
            tokens: {
                //Month
                M:    "m",          //1 2 ... 11 12
                Mo:   null,         //1st 2nd ... 11th 12th
                MM:   "mm",         //01 02 ... 11 12
                MMM:  "M",          //Jan Feb ... Nov Dec
                MMMM: "MM",         //January February ... November December
                //Day of Month
                D:    "d",          //1 2 ... 30 30
                Do:   null,         //1st 2nd ... 30th 31st
                DD:   "dd",         //01 02 ... 30 31
                //Day of Year
                DDD:  "o",          //1 2 ... 364 365
                DDDo: null,         //1st 2nd ... 364th 365th
                DDDD: "oo",         //001 002 ... 364 365
                //Day of Week
                d:    null,         //0 1 ... 5 6
                do:   null,         //0th 1st ... 5th 6th
                ddd:  "D",          //Sun Mon ... Fri Sat
                dddd: "DD",         //Sunday Monday ... Friday Saturday
                //Week of Year
                w:    null,         //1 2 ... 52 53
                wo:   null,         //1st 2nd ... 52nd 53rd
                ww:   null,         //01 02 ... 52 53
                //ISO Week of Year
                W:    null,         //1 2 ... 52 53
                Wo:   null,         //1st 2nd ... 52nd 53rd
                WW:   null,         //01 02 ... 52 53
                //Year           
                YY:   "y",          //70 71 ... 29 30
                YYYY: "yy",         //1970 1971 ... 2029 2030
                //AM/PM
                A:    null,         //AM PM
                a:    null,         //am pm
                //Hour           
                H:    null,         //0 1 ... 22 23
                HH:   null,         //00 01 ... 22 23
                h:    null,         //1 2 ... 11 12
                hh:   null,         //01 02 ... 11 12
                //Minute
                m:    null,         //0 1 ... 58 59
                mm:   null,         //00 01 ... 58 59
                //Second
                s:    null,         //0 1 ... 58 59
                ss:   null,         //00 01 ... 58 59
                //Fractional Second
                S:    null,         //0 1 ... 8 9
                SS:   null,         //0 1 ... 98 99
                SSS:  null,         //0 1 ... 998 999
                //Timezone
                z:    null,         //EST CST ... MST PST 
                zz:   null,         //Same as "z"
                Z:    null,         //-07:00 -06:00 ... +06:00 +07:00
                ZZ:   null,         //-0700 -0600 ... +0600 +0700
                //Unix Timestamp
                X:    "@"           //1360013296
            }

        }
    };

    //from Moment.js
    function removeFormattingTokens(input) {
        if (input.match(/\[.*\]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function doConversion(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters) {
        var array = originalFormatString.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            var lookedUpToken = module.tokenLookup[libraryName].tokens[array[i]];
            if (lookedUpToken) {
                array[i] = lookedUpToken;
            } else if ((lookedUpToken === null) && replaceUntranslatableTokens) {
                array[i] = module.tokenLookup[libraryName].noTranslation||"";
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }
        return array.join("");
    }

    module.convert = function convert(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters) {
        var libraryName =               libraryName.toLowerCase(),
            replaceUnregonisedTokens =  (typeof replaceUntranslatableTokens !== "boolean")?false:replaceUntranslatableTokens,
            translateEscapeCharacters = (typeof translateEscapeCharacters !== "boolean")?false:translateEscapeCharacters;

        if (libraryName in module.tokenLookup) {
            return doConversion(originalFormatString, libraryName, replaceUntranslatableTokens, translateEscapeCharacters);
        } else if (libraryName === "moment") {
            return originalFormatString
        } else {
            throw new TokeError("library name not recognised");
        }
    };

    function TokeError(message) {
        this.message = message + " (Toke error)";
    }
    TokeError.prototype = new Error();
    TokeError.prototype.constructor = TokeError;

}(window.Toke = window.Toke||{}, window));
