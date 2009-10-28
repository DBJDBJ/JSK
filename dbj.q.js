//-------------------------------------------------------------------------------------
// (c) 2009-2010 by DBJ.ORG
//     Please mail to: dbjdbj@gmail.com
//     for the usage of this code to be granted 
//
// micro-engine for simpler AND faster page queries
//
// NOTE! this works in all browser supported by this extension
//       since its using querySelectorAll() method
// NOTE! here error checks are *minimal*, and there are no exceptions whatsoever.
// NOTE! this caches the results and thus works ONLY if you do not 
//       add or remove or change nodes you have been searching for. 
//       if you have done this, then use Q.FLUSH() ... see bellow
//       Which makes it ideal for CHROME extensions
//       2009.JAN.01 dbjdbj@gmail.com  Created
(function() {
    // cache is array indexed by container objects
    var cache = [];
    // each cache element is: {  "_container_" : container , "selector" : staticNodeList, ... }
    function cached_selections(cont) {
        // return saved selections for the cont(ainer) or make it if not in the cache
        return cache[cont] || (cache[cont] = { "_container_": cont });
    }
    // ss is individual cache [] element 
    function cached_result(ss, sel) {
        // take the result or make it and store it if not made
        return ss[sel] = ss[sel] || (ss[sel] = ss._container_.querySelectorAll(sel));
    }
    // the Q method is visible on the level of extension aka "globaly"
    // selector is any valid CSS "like" selector
    // container method is optional
    // returns: always an list of matched elements, with a "length" property
    //          no result will return null
    Q = function(selector, container) {
        var list = [];
        if ("string" !== typeof selector) return list;
        if ("object" !== typeof (container || document)) return list;
        list = cached_result(cached_selections(container || document), selector);
        return list.length > 0 ? list : null;
    }
    // flush the cache
    // the whole 
    // or  for the container if given
    // and for the selector if given
    Q.FLUSH = function(container, selector) {
        if (container) {
            if (!selector) {
                cache[container] = null;
                delete cache[container];
                // above leaves 'holes' in the cache 
            }
            else {
                delete cache[container][selector];
            }
        } else
            cache = [];
    }
    // helper : query by ID only, 
    // return the first element found by id given
    // returns null if no element found
    Q.ID = function(id_string) {
        var list = Q("#" + id_string, document);
        return list.length > 0 ? list[0] : null;
    }
    // use this to replace getElementByClassName
    Q.CLASS = function(class_name) {
        var list = Q("." + id_string, document);
        return list.length > 0 ? list[0] : null;
    }
    // helper: return true if query has result,
    // otherwise null
    Q.NULL = function(selector, container) {
        return Q(selector, container).length > 0;
    }
    // for each element found call the function given
    Q.EACH = function(method, selector, container) {
        if ("function" !== typeof method) return;
        var list = Q(selector, container), j = 0;
        if (list)
            for (; j < list.length; j++) {
            method(list[j]); // element found is passed as first argument
        }

    }
    // methods for browser where TreeWalker exists
    if (document.createTreeWalker) {
        // return the parent node containing the text if matched 
        Q.MATCH = function(rx_, selector_, container_) {
            try {
                function find_text(rootnode, regex) {
                    var walker = document.createTreeWalker(rootnode, NodeFilter.SHOW_TEXT, null, false)
                    walker.firstChild() //Walk to first text child node THAT IS TEXT
                    if (!walker.currentNode) return null;
                    var paratext = walker.currentNode.nodeValue, parent_ = walker.currentNode.parentNode;
                    while (walker.nextSibling()) { //Step through each sibling
                        paratext += walker.currentNode.nodeValue;
                    }
                    // filter out newlines, tabs, etc ...
                    paratext = paratext.match(/\S+/g)
                    // there is no meaningfull text left
                    if (!paratext) return null;
                    paratext = paratext.join(" ");
                    paratext = regex ? paratext.match(regex) : paratext;
                    return paratext ? { "node": parent_, "match": paratext} : null;
                }
                var retval = [];
                Q.EACH(function(E) {
                    var rv = find_text(E, rx_);
                    if (rv) retval.push(rv);
                }, selector_, container_);
                return retval;
            } catch (x) {
                return new Error("Q.MATCH()" + " : " + x);
            }
        }
    } // eof if

})();                     // end of Q closure
//-------------------------------------------------------------------------------------
