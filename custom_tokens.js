;window.Toke = {};
window.Toke.customTokenLookup = {
    customlibrary: {
        //Any of the following keys can be left out, and will simply be replaced with defaults.

        //The character(s) that will appear before and after (prefix and suffix) of each output token.
        //default: ""
        tokenPrefix:  "{",
        tokenSuffix:  "}",

        //If the output library supports it, the prefix and suffix characters that indicate a that a
        //set of characters are not to be processed as formatting tokens.
        //default: ""
        escapePrefix: "[",
        escapeSuffix: "]",

        //The actual token replacement lookup.
        //default: {}
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
    }
};
