
/*
 MIT,GPL (c) 2009-2010 by DBJ.ORG

 a little javascript set for my development and testing pages

 $Revision: 9 $$Date: 7/03/11 0:12 $
----------------------------------------------------------------------------------------------
if unlucky and debugging inside IE <= 8 include this script once on the top of your html page
as it will provoke inclusion of firebug-lite

    if (!window.console)
        document.write(
    '<!--[if lte IE 8]>' +
    '<script type="text/javascript" src="https://getfirebug.com/firebug-lite.js"><' + '/script>' +
    '<![endif]-->'
    );

*/
if (!this.dbj) { 
alert("This file requires previous inclusion of dbj root object which is in dbj.microlib.js"); 

dbj = {} ;

}

dbj.utl = {} ;
/* 
help summarizing or averaging values saved in this cache 
of key/value pairs where values are always numerical values 
internal obj_ is object where each property is an array
example:
        dbj.summa.add("A",1).add("A",2).add("B",[100,1]) ;
		dbj.summa.sum("A") returns 3
		dbj.summa.sum("B") returns 101
		dbj.summa.sum("C") returns 0
*/
  dbj.utl.summa = (function () {
    "use strict";
            var obj_ = {},
        sum_ = function (arr) { var l = arr.length, sum = 0; while (l--) { sum += arr[l]; }; return sum; },
        avg_ = function (arr) { return sum_(arr) / arr.length; },
        num_ = function (arr) { var l = arr.length, sum = 0; while (l--) { arr[l] = arr[l] - 0; }; return arr; } ;

            return {
                /* interface */
                add: function (k, v) {

                    if (! isArray(v) ) { v = [v - 0]; }
                     else v = num_(v) ;

                    if (!isArray(obj_[k]))
                        obj_[k] = [].concat( v );
                    else
                        obj_[k] = obj_[k].concat( v );
                    return this;
                },
                sum: function (k) { return sum_(obj_[k] || []); },
                avg: function (k) { return avg_(obj_[k] || []); },
                all: function (k) { return (obj_[k] ? [].concat(obj_[k])   : []) },
                rst: function (k) { if (obj_[k]) { var old = obj_[k]; obj_[k] = []; return old; } return [];}
            };
		}());
        /*
        use this function to harvest form values on inputs named in its "defaults" argument
        example call :
        var harvest = harvester("myForm", { "name" : "Default", "age" : 22, "sex" : "male" } );
        look for inputs name, age and sex in the form "myForm". if input value is null use the
        values given in the argument.
        */
        dbj.utl.harvester = function (frm_id, defaults) {
            var $frm = jQuery("#" + frm_id, document.object), $input,
            getval = function (id_) {
                $input = $frm.find("input#" + id_);
                return ($input.val() || defaults[id_]);
            };
            for (name in defaults) { defaults[name] = getval(name); }
            return defaults;
        },

        dbj.utl.table = function (host, id, klass, undefined) {
            /*
            very simple but effective table 'writer'

            all arguments are optional
            var tabla = dbj.table(your_host_dom_element, "your_table_id", "your_css_class_name");

            methods are chainable

            tabla.hdr("ID", "Name", "Average Rating")  // defines table of 3 columns
                 .caption("Waiting for " + query[1])

                 .row(1,"Bob",3.5) // proceed with SAME number of columns
                 .row(2,"DBJ",2.5); // 

            optionaly style the table made, for example:
            tabla.uid( function( id_ ) { $("#"+id_ ).dataTable()  }); // apply 'dataTable' jQuery plugin 

            */
            host || (host = document.body);
            id || (id = "dbjtable_" + (0 + new Date));
            klass || (klass = "dbjtable");
            var
                slice = Array.prototype.slice,
                $table = $("#" + id),
                colcount = 0;

            if ( ! $table[0] ) {
                $table = jQuery("<table id='{0}' class='{1}'><caption></caption><thead></thead><tbody></tbody>".format(id, klass));
                $table.appendTo(host);
            }

            function selfcheck() {
                if (! $table[0]) {
                    console.error("dbj.utl.table() : This is wrong. No table to handle?");
                    return false;
                }
                    return true ;
            }

            /* 
            first row added defines number of columns 
            latter can make row with different number; the table will be jaddged
            */
            function to_row(row_, header) {
                if (jQuery.isArray(row_)) {
                    if (!colcount) colcount = row_.length;
                    var td = header ? "TH" : "TD", wid = Math.round(100 / colcount);
                    td += " width='{0}%' ".format(wid);
                    row_ = row_.join("</{0}><{0}>".format(td));
                    return "<tr><{0}>{1}</{0}></tr>".format(td, row_);
                }
                else {
                    throw "to_row() first argument must be array";
                }
            }
            return {
                hdr: function () {
                    if ( selfcheck() )
                        $table.find("thead").append(to_row(slice.call(arguments), true));
                    return this;
                },
                row: function () {
                    if (selfcheck())
                        $table.find("tbody").append(to_row(slice.call(arguments))); 
                    return this;
                },
                caption: function (caption) {
                    if (selfcheck())
                        $table.find("caption").html(caption || "Caption");
                    return this;
                },
                err: function () {
                    if (selfcheck())
                        $table.find("tbody").append(to_row(
                    "<span style='color:#cc0000;'>{0}</span>".format(slice.call(arguments).join(" ")))
                    );
                    return this;
                },
                uid: function (cb) { dbj.assert("function" == typeof cb);  cb(id); return this ; }
            }
        }
/*-----------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------*/
