/*
    DBJ*MICROLIB GPL (c) 2011 by DBJ.ORG
*/
// .net string.format like function
// usage:   "{0} means 'zero'".format("nula") 
// returns: "nula means 'zero'"
// place holders must be in a range 0-99.
// if no argument given for the placeholder, 
// no replacement will be done, so
// "oops {99}".format("!")
// returns the input
// same placeholders will be all replaced 
// with the same argument :
// "oops {0}{0}".format("!","?")
// returns "oops !!"
//
if ("function" !== typeof String.format)
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
            var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
        }
            );
    }
    /*
    */
var dbj = {
	
    dummy: (function () {
        var TOS_ = Object.prototype.toString,
        HOP_ = Object.prototype.hasOwnProperty;
        // global helpers
        if ("function" !== typeof window.roleof) {
            window.roleof = function (o) { return TOS_.call(o).match(/\w+/g)[1]; }
        }
        if ("function" !== typeof window.isArray) {
            window.isArray = function (x) { return roleof(x) === "Array"; }
        }
        if ("function" !== typeof window.isObject) {
            window.isObject = function (x) { return roleof(x) === "Object"; }
        }
    } ()),


    XMLHttpFactories: [
	function () { return new XMLHttpRequest() },
	function () { return new ActiveXObject("Msxml2.XMLHTTP") },
	function () { return new ActiveXObject("Msxml3.XMLHTTP") },
	function () { return new ActiveXObject("Microsoft.XMLHTTP") }
     ],

    createXMLHTTPObject: function () {
        var i = dbj.XMLHttpFactories.length, e;
        while (i--) {
            try {
                return dbj.XMLHttpFactories[i]();
            }
            catch (e) {
                /**/
            }
        }
        alert("dbj.createXMLHTTPObject() failed ?");
        return false;
    },
    $: function (selector, el) {
        return (el || document).querySelector(selector);
    },
    $$: function (selector, el) {
        return (el || document).querySelectorAll(selector);
    },
    later: function (context, func, timeout) {
        /* execute function a bit later, default timeout is 1 micro sec,execution context is global name space
        arguments after 'timeout', are passed to the callback
        */
        var args = timeout ? [].slice.call(arguments, 3) : [].slice.call(arguments, 1);
        context || (context = (this || window));
        var tid = setTimeout(function () {
            clearTimeout(tid); tid = null; delete tid;
            func.apply(context, args);
        }, timeout || 1);
    },

    /* 
	multipuropse logging, aserting etc... 
	always using the console object
	but adding functionality
    */
	console : (function () {
		    var
			console_cmd = { 
				"log" 		: console.log, 
				"assert" 	: console.assert , 
				"info" 		: console.info, 
				"error" 	: console.err,
				"begin"     : group_begin ,
				"end"       : group_end
			},
			group_begin = function ()  { console.group("dbj MICROLIB"); },
			group_end   = function ()  { console.groupEnd(); };
			/*
			 argument format
			 { cmd : "log", obj : object, msg : "message", grp: true | false }
			*/
			return  function ( arg_ )  {
				var cmd = arg_["cmd"], s_ = arg_["msg"], group_ = arg["grp"], obj_ = arg["obj"];
					if ( cmd in console_cmd ) {
						if ( group_ ) group_begin();
							  dbj.console_cmd[cmd](obj_, s_ );
						if ( group_ ) group_end();
					} else {
						group_begin();
							console.err("dbj.console() received a wrong command?");
						group_end();
					}
			} 
	}()),
		assert : function (x) {
			if (!x) {
				dbj.console({ cmd:"error", msg:"dbj.assert failed for: " + x, grp : true }) ; 
				throw "dbj.assert failed for: " + x ;
			}
		},
		print: function ( s_, grouped ) {
			dbj.console({ cmd: "log", obj: s_, grp: grouped } ) ;
		} ,
		
		print_grp_begin : function () {
			dbj.console({ cmd: "begin" } ) ;
		},
		
		print_grp_end   : function () {
			dbj.console({ cmd: "end" } ) ;
		},

        evil : (function (x) {
		// eval in presence of 'use strict'	
            "use strict";
		// spn = secret property name
		    var spn = "evil_" + (+new Date());
            return function (x) {
				(1, eval)("top['" + spn + "'] = (" + x + ")");
				return top[spn];
			}
        }()),
		/*
		    one of those mind bending things for JS begginers
			usefull for assuring value is a number
			of course if it is not a object when it is number NaN
			num ("1.1")  --> number 1.1 
			num ("1")    --> number 1
			num (new Date()) --> number 1457181273435
			num ( new String() ) --> number 0
			num ( new Object() ) --> number NaN
		*/
	    num : function num (a) {
			return a - 0 ;
        } ,
        /* quick number rounder */
        round: function (original_number, decimals) {
            var POW = Math.pow(10, decimals), 
				V1 	= original_number * POW, 
				V2 	= Math.round(V1);
            return V2 / POW;
        }
} /* eof dbj {} */




