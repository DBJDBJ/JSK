
/**
    DBJ*MICROLIB GPL (c) 2011 - 2016 by DBJ.ORG
*/
;(function ( GLOBAL, undefined ) {

if ("object" == typeof dbj) {
	var msg = "dbj core object must be defined only once and only in here";
	if (console && console.error) console.error(msg);
	if ("function" == typeof alert) alert(msg);
	return;
};
     
if ("function" !== typeof String.format) {
/**
* .net string.format like function
* usage:   "{0} means 'zero'".format("nula") 
* returns: "nula means 'zero'"
* place holders must be in a range 0-99.
* if no argument given for the placeholder, 
* no replacement will be done, so
* "oops {99}".format("!")
* returns the input
* same placeholders will be all replaced 
* with the same argument :
* "oops {0}{0}".format("!","?")
* returns "oops !!"
*/
String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
            var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
        }
            );
    }
};

var TOS_ = Object.prototype.toString, HOP_ = Object.prototype.hasOwnProperty; /*
 dbj core object must be defined only once and in here
 */
var dbj = {

    "GLOBAL" : (function () {

        // global helpers
        if ("function" !== typeof GLOBAL.roleof) {
            GLOBAL.roleof = function (o) { return TOS_.call(o).match(/\w+/g)[1]; }
        }
        if ("function" !== typeof GLOBAL.isArray) {
            GLOBAL.isArray = function (x) { return roleof(x) === "Array"; }
        }
        if ("function" !== typeof GLOBAL.isObject) {
            GLOBAL.isObject = function (x) { return roleof(x) === "Object"; }
        }
        if ("function" !== typeof GLOBAL.isFunction) {
            GLOBAL.isObject = function (x) { return roleof(x) === "Function"; }
        }
    }()),
	
	keep_inside : (function () {
		
			var boundaries = [0, 1]; // default
			
			return function (val, bounds ) {
				if (bounds) boundaries = bounds.sort();
					val = val - 0;
						if (isNaN(val)) throw new Error(0xFF,"dbj.keep_inside() received NaN value.");
				return val > boundaries[1] ? boundaries[1] : (val < boundaries[0] ? boundaries[0] : val);
			}
	    }()), 
	
	err2str : function (e) {

    if (roleof(e) != "Error") return ""+e;

    return "Error Code: {0} Facility Code: {1}, Error Message: {2}, Error Name: {3}".format(
			e.number & 0xFFFF,
			e.number >> 16 & 0x1FFF,
			e.message,
			e.name
		);
    },

    createXHR: function () {

        var XMLHttpFactories = [
	        function () { return new XMLHttpRequest() },
	        function () { return new ActiveXObject("Msxml2.XMLHTTP") },
	        function () { return new ActiveXObject("Msxml3.XMLHTTP") },
	        function () { return new ActiveXObject("Microsoft.XMLHTTP") }
        ];

        dbj.createXHR = function () {
            var i = XMLHttpFactories.length, e;
            while (i--) {
                try {
                    return XMLHttpFactories[i]();
                }
                catch (e) {
                    /**/
                }
            }
            throw ("dbj.createXMLHTTPObject() failed ?");
        }

        return dbj.createXHR();
    },
    $: function (selector, el) {
        return (el || document).querySelector(selector);
    },
    $$: function (selector, el) {
        return (el || document).querySelectorAll(selector);
    },
        /**
         * execute function a bit later, default timeout is 1 mili sec,execution context is global name space
         * arguments after 'timeout', are passed to the callback
         */
    later: function (context, func, timeout) {
        var args = timeout ? [].slice.call(arguments, 3) : [].slice.call(arguments, 1);
        context || (context = (this || window));
        var tid = setTimeout(function () {
            clearTimeout(tid); tid = null; delete tid;
              try {
                func.apply(context, args);
              } catch (x) {
                  throw x.message ;
              }
        }, timeout || 1);
    },

    /** 
	 * multipuropse logging, aserting etc... 
	 * always using the console object
	 * but adding functionality ... perhaps?
     */
    console: {
        group       : function () { console.group("dbj MICROLIB"); },
        group_end   : function () { console.groupEnd(); }
    },

    assert: function (x) {
        if (!(x)) {
			
            dbj.later(dbj, function () {
                
                var screamer = console ? console.error : alert ;
                screamer("dbj.assert failed for: " + x + ", msg: " + x.message);
            });
            throw new Error(0xFF,"dbj.assert(" + x + "), rendered to false");
        }
    },

    print: function () {
		var ags = [].slice.call(arguments) ;
        dbj.later(dbj, function () {
            this.console.group();
				for ( var j = 0; j < ags.length; j++ ) console.log(ags[j]);
            this.console.group_end();
        });
    },

    evil: (function (x) {
        // eval in presence of 'use strict'	
        "use strict";
        // spn = secret property name
        var spn = "evil_" + (+new Date());
        return function (x) {
            (1, eval)("top['" + spn + "'] = (" + x + ")");
            return top[spn];
        }
    }()),
    /**
      numerical section follows
    */
    /**
     *   one of those mind bending things for JS begginers
     *   usefull for assuring value is a number
     *   of course if it is not a object when it is number NaN
     *   num ("1.1")  --> number 1.1 
     *   num ("1")    --> number 1
     *   num (new Date()) --> number 1457181273435
     *   num ( new String() ) --> number 0
     *   num ( new Object() ) --> number NaN
     *
     *@param {object} any legal javascript value
    */
    num: function num(a) {
        return a - 0;
    },
    /* quick number rounder */
    round: function (original_number, decimals) {
        var POW = Math.pow(10, decimals),
            V1 = original_number * POW,
            V2 = Math.round(V1);
        return V2 / POW;
    },
    /* http://www.2ality.com/2012/02/js-integers.html */
    toUint32: function (x) {
        return x >>> 0;
    },

    toInt32: function (x) {
        return x >> 0;
    },
    /**
     * returns Uint32 seed randomized by time ticks
     * returns unique values even if called in smallest possible intervals
     * eg: [seed(), seed(), seed()]
     */
    seed: function () { return (Math.random() * (new Date() - 0)) >>> 0; }

}; /* eof dbj {} */

        var Guid = {
            empty: "00000000-0000-0000-0000-000000000000",
            make: function () {
                return (Guid.four() +
                        Guid.four() + "-" +
                        Guid.four() + "-" +
                        Guid.four() + "-" +
                        Guid.four() + "-" +
                        Guid.four() +
                        Guid.four() +
                        Guid.four());
            },
            four: function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
            }
        };

        dbj.GUID = function () { return Guid.make(); }

/* the stuff only old magician can produce :) */
/** 
 * following  works only in IE < 11, in WSH's and in HTA's of course
 * thus when in html be sure not to use 
 * <meta http-equiv="X-UA-Compatible" content="IE=edge">
 * if you want bellow to work
 */
/*@cc_on @if ( @_win32 )
dbj.GUID = function () 
{
    try
    {
        var x = new ActiveXObject("Scriptlet.TypeLib");
    return (x.GUID);
    }
    catch (e)
    {
    return ("error creating GUID");
    }
}
@end @*/

}( this, (void 0)));
