//-------------------------------------------------------------------------------------
// (c) 2009-2010 by DBJ.ORG
//     Please mail to: dbjdbj@gmail.com
//     for the usage of this code to be granted 
//
// DBJ*Q is a micro-engine for simpler AND faster, page queries
// Q.T = Q Text methods
//-------------------------------------------------------------------------------------
(function() {
    if ("undefined" === typeof Q) {
        return alert("ERROR!\nQ.T requires to be included after dbj.q.js!");
    };
    Q.T = {
        F: function(rootnode, regex) {
            ///<summary>
            /// on the whole text found inside a node given, and anywhere inside its tree
            /// return the result of match with regexp given
            /// white space is filtered out, by the standard reg.exp. for that: /\S+/g
            /// if no regex given, the whole text is returned
            /// on error return null
            ///</summary>
            try {
                var paratext = rootnode.innerText.match(/\S+/g); // filter out white spaces
                if (!paratext) return null; // there is no meaningfull text left
                paratext = paratext.join(" ");
                return regex ? paratext.match(regex) : paratext;
            } catch (x) {
                Q.LOG("Q.T.F(), " + x);
                return null;
            }
        },
        M: function(rx_, selector_, container_) {
            ///<summary>
            /// for every  element found by selector
            /// create { "node": object , "match": "..."}
            /// if it contains text found by regexp given
            /// where 'node' is element , and 'match' is the result of
            /// matching the whole of the text found inside the element, using the regexp given
            /// on no result return empty array
            /// on error return null
            ///</summary>
            try {
                var retval = [], rv;
                Q.EACH(function(E) {
                    rv = Q.T.F(E, rx_);
                    if (rv) retval.push({ "node": E, "match": rv });
                }, selector_, container_);
                return retval;
            } catch (x) {
                Q.T.M("Q.T.M()" + " : " + x); return null;
            }
        }
    }; // eof Q.T
})();
//-------------------------------------------------------------------------------------
