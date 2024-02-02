function jsonToCsv(objArray, delimiter, bIncludeHeaders, bQuotes, noMultiLines) {
    var array, str = "",
        line = "",
        i, j, index, value, columns = [];
    try {
        array = "object" != typeof objArray ? JSON.parse(objArray) : objArray
    } catch (e) {
        array = eval("array=" + objArray)
    }
    var depth = getJsonLevel(array);
    if (2 == depth && _.isArray(array)) {
        for (bIncludeHeaders && (value = "Field1", line += bQuotes ? '"' + value.replace(/"/g, '""') + '"' + delimiter : value.toCsv(delimiter, '"'), str += line + "\n"), i = 0; i < array.length; i++) {
            var line = "";
            value = array[i], null == value ? value = "" : value += "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += (bQuotes ? '"' : "") + ("" + value).toCsv(delimiter, '"') + (bQuotes ? '"' : ""), str += line + "\n"
        }
        return str
    }
    if (3 == depth && _.isArray(array) && _.every(_.values(array), _.isArray)) {
        if (bIncludeHeaders) {
            var head = array[0];
            for (index in array[0]) value = "Field" + (1 * index + 1), columns.push(value), line += bQuotes ? '"' + value.replace(/"/g, '""') + '"' + delimiter : value.toCsv(delimiter, '"') + delimiter;
            line = line.slice(0, -1), str += line + "\n"
        } else
            for (index in array[0]) columns.push(index);
        for (i = 0; i < array.length; i++) {
            var line = "";
            for (j = 0; j < columns.length; j++) value = array[i][j], null == value ? value = "" : value += "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += (bQuotes ? '"' : "") + ("" + value).toCsv(delimiter, '"') + (bQuotes ? '"' : "") + delimiter;
            line = line.slice(0, -1 * delimiter.length), str += line + "\n"
        }
        return str
    }
    for (; _.isObject(array) && !_.isArray(array) && 1 == _.keys(array).length && (_.isObject(_.values(array)[0]) || _.isArray(_.values(array)[0]) && _.isObject(_.values(array)[0][0]));) array = _.values(array)[0];
    for (0 == _.isArray(array) && 1 == _.isObject(array) && (array = JSON.flatten(array), array = JSON.parse("[" + JSON.stringify(array) + "]")), i = 0; i < array.length; i++) value = array[i][columns[j]], 0 == _.isArray(value) && 1 == _.isObject(value) && (array[i][columns[j]] = JSON.flatten(value));
    if (bIncludeHeaders) {
        var head = array[0];
        if (bQuotes)
            for (index in array[0]) value = index + "", columns.push(value), line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
        else
            for (index in array[0]) value = index + "", columns.push(value), line += value.toCsv(delimiter, '"') + delimiter;
        line = line.slice(0, -1), str += line + "\n"
    } else
        for (index in array[0]) columns.push(index);
    for (i = 0; i < array.length; i++) {
        var line = "";
        if (bQuotes)
            for (j = 0; j < columns.length; j++) value = array[i][columns[j]], "[object Object]" == (value + "").substring(0, 15) && (value = JSON.valueArray(array[i][columns[j]]).slice(0, -1)), null == value ? value = "" : value += "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += '"' + value.replace(/"/g, '""') + '"' + delimiter;
        else
            for (j = 0; j < columns.length; j++) value = array[i][columns[j]], "[object Object]" == (value + "").substring(0, 15) && (value = JSON.valueArray(array[i][columns[j]]).slice(0, -1)), null == value ? value = "" : value += "", noMultiLines && (value = value.replace(/\r\n|\r|\n/g, " ")), line += ("" + value).toCsv(delimiter, '"') + delimiter;
        line = line.slice(0, -1 * delimiter.length), str += line + "\n"
    }
    return str
}

function getJsonLevel(e) {
    "string" == typeof e && (e = JSON.parse(e));
    var t, n, r = JSON.stringify(e, null, "\t").split(/\r\n|\n|\r/gm),
        a = 0;
    for (t = 0; t < r.length; t++) "\t" == r[t].charAt(0) && (n = r[t].match(/\t+/gm))[0].length > a && (a = n[0].length);
    return a + 1
}

"object" != typeof JSON && (JSON = {}),
    function () {
        "use strict";

        function f(e) {
            return e < 10 ? "0" + e : e
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;

        function quote(e) {
            return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, (function (e) {
                var t = meta[e];
                return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            })) + '"' : '"' + e + '"'
        }

        function str(e, t) {
            var n, r, a, o, i, l = gap,
                u = t[e];
            switch (u && "object" == typeof u && "function" == typeof u.toJSON && (u = u.toJSON(e)), "function" == typeof rep && (u = rep.call(t, e, u)), typeof u) {
            case "string":
                return quote(u);
            case "number":
                return isFinite(u) ? String(u) : "null";
            case "boolean":
            case "null":
                return String(u);
            case "object":
                if (!u) return "null";
                if (gap += indent, i = [], "[object Array]" === Object.prototype.toString.apply(u)) {
                    for (o = u.length, n = 0; n < o; n += 1) i[n] = str(n, u) || "null";
                    return a = 0 === i.length ? "[]" : gap ? "[\n" + gap + i.join(",\n" + gap) + "\n" + l + "]" : "[" + i.join(",") + "]", gap = l, a
                }
                if (rep && "object" == typeof rep)
                    for (o = rep.length, n = 0; n < o; n += 1) "string" == typeof rep[n] && (a = str(r = rep[n], u)) && i.push(quote(r) + (gap ? ": " : ":") + a);
                else
                    for (r in u) Object.prototype.hasOwnProperty.call(u, r) && (a = str(r, u)) && i.push(quote(r) + (gap ? ": " : ":") + a);
                return a = 0 === i.length ? "{}" : gap ? "{\n" + gap + i.join(",\n" + gap) + "\n" + l + "}" : "{" + i.join(",") + "}", gap = l, a
            }
        }
        "function" != typeof JSON.stringify && (JSON.stringify = function (e, t, n) {
            var r;
            if (gap = "", indent = "", "number" == typeof n)
                for (r = 0; r < n; r += 1) indent += " ";
            else "string" == typeof n && (indent = n);
            if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
            return str("", {
                "": e
            })
        }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) {
            var j;

            function walk(e, t) {
                var n, r, a = e[t];
                if (a && "object" == typeof a)
                    for (n in a) Object.prototype.hasOwnProperty.call(a, n) && (void 0 !== (r = walk(a, n)) ? a[n] = r : delete a[n]);
                return reviver.call(e, t, a)
            }
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, (function (e) {
                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                }))), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }(), JSON.unflatten = function (e) {
        "use strict";
        if (Object(e) !== e || Array.isArray(e)) return e;
        var t, n, r, a, o, i = {};
        for (var l in e) {
            t = i, n = "", a = 0;
            do {
                r = l.indexOf(".", a), o = l.substring(a, -1 !== r ? r : void 0), t = t[n] || (t[n] = isNaN(parseInt(o)) ? {} : []), n = o, a = r + 1
            } while (r >= 0);
            t[n] = e[l]
        }
        return i[""]
    }, JSON.flatten = function (e) {
        var t = {};
        return function e(n, r) {
            if (Object(n) !== n) t[r] = n;
            else if (Array.isArray(n)) {
                for (var a = 0, o = n.length; a < o; a++) e(n[a], r ? r + "." + a : "" + a);
                0 == o && (t[r] = [])
            } else {
                var i = !0;
                for (var l in n) i = !1, e(n[l], r ? r + "." + l : l);
                i && (t[r] = {})
            }
        }(e, ""), t
    }, JSON.valueArray = function (e) {
        var t = "";
        return function e(n, r) {
            if (Object(n) !== n) t += n + "|";
            else if (Array.isArray(n)) {
                for (var a = 0, o = n.length; a < o; a++) e(n[a], r ? r + "." + a : "" + a);
                0 == o && (t += "|")
            } else {
                var i = !0;
                for (var l in n) i = !1, e(n[l], r ? r + "." + l : l);
                i && (t += "|")
            }
        }(e, ""), t
    }, String.prototype.lpad = function (e, t) {
        if (void 0 === t) t = " ";
        for (var n = this; n.length < e;) n = t + n;
        return n
    }, String.prototype.zeroPad = function (e) {
        var t = this,
            n = !1;
        return isNaN(t) ? t : t.length > e ? t.toString() : (0 > t && (n = !0), n ? "0" == (t = t.substring(1).lpad(e, "0")).charAt(0) && (t = "-" + t.substring(1)) : t = t.lpad(e, "0"), t)
    }, String.prototype.rpad = function (e, t) {
        if (void 0 === t) t = " ";
        for (var n = this; n.length < e;) n += t;
        return n
    }, "function" != typeof String.prototype.trim && (String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
    }), String.prototype.ltrim = function () {
        return this.replace(/^\s+/, "")
    }, String.prototype.rtrim = function () {
        return this.replace(/\s+$/g, "")
    }, "function" != typeof String.prototype.repeat && (String.prototype.repeat = function (e) {
        return e = e || 1, Array(e + 1).join(this)
    }), String.prototype.ljust = function (e, t) {
        return t = (t = t || " ").substr(0, 1), this.length < e ? this + t.repeat(e - this.length) : this
    }, String.prototype.rjust = function (e, t) {
        return t = (t = t || " ").substr(0, 1), this.length < e ? t.repeat(e - this.length) + this : this
    }, String.prototype.cjust = function (e, t) {
        if (t = (t = t || " ").substr(0, 1), this.length < e - 1) {
            var n = e - this.length,
                r = n % 2 == 0 ? "" : t,
                a = t.repeat(Math.floor(n / 2));
            return a + this + a + r
        }
        return this.rpad(e)
    }, "function" != typeof String.prototype.left && (String.prototype.left = function (e) {
        return this.substring(0, e)
    }), "function" != typeof String.prototype.right && (String.prototype.right = function (e) {
        return this.substring(this.length - e)
    }), String.prototype.removePunctuation = function () {
        return this.replace(/[@+<>"'?\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]\\\|]/g, "")
    }, "function" != typeof String.prototype.enclose && (String.prototype.enclose = function (e, t) {
        if (void 0 === e && (e = ""), void 0 === t && (t = ""), "" != t) {
            var n = new RegExp(e.regExpEscape(e), "gmi");
            return e + this.replace(n, t + e) + e
        }
        return e + this + e
    }), String.prototype.toHtml = function () {
        return this.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }, String.prototype.toXml = function () {
        return this.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }, String.prototype.toCsv = function (e, t, n, r) {
        void 0 === e && (e = ","), void 0 === t && (t = '"'), void 0 === n && (n = t), void 0 === r && (r = !1);
        var a = this.indexOf(t) >= 0 || this.indexOf(e) >= 0 || this.indexOf("\r") >= 0 || this.indexOf("\n") >= 0;
        return r && (a = !0), a ? this.enclose(t, n) : this
    }, "function" != typeof String.prototype.isNumeric && (String.prototype.isNumeric = function () {
        return !isNaN(parseFloat(this)) && isFinite(this)
    }), String.prototype.toNumber = function () {
        var e = this.replace(/[^\d.\-\+eE]/g, "");
        return e.length > 0 && !isNaN(e) && (e *= 1), e
    }, String.prototype.toInteger = function () {
        return parseInt(this.toNumber().toString(), 10)
    }, String.prototype.toFixed = function (e) {
        var t = this.toNumber().toString();
        return t.length > 0 && !isNaN(t) && (t = (1 * t).toFixed(e)), String(t)
    }, String.prototype.toDollar = function (e, t) {
        var n = this.toNumber().toString();
        if (void 0 === e && (e = 2), void 0 === t && (t = "$"), n.length > 0 && !isNaN(n)) {
            var r, a, o;
            a = (r = (1 * n).toFixed(e).split("."))[0], o = r.length > 1 ? "." + r[1] : "";
            for (var i = /(\d+)(\d{3})/; i.test(a);) a = a.replace(i, "$1,$2");
            n = t + a + o
        }
        return String(n)
    }, String.prototype.toJson = function () {
        return this.replace(/\\/g, "\\\\").replace(/\t/g, "\\t").replace(/\"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r")
    }, String.prototype.toSql = function () {
        return this.replace(/'/g, "''")
    }, String.prototype.toYaml = function () {
        return /[\r\n\f\v\t]/g.test(this) ? '"' + this.replace(/\t/g, "\\t").replace(/\"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\f/g, "\\f").replace(/\v/g, "\\v").replace(/"/g, '\\"') + '"' : this.indexOf("'") >= 0 ? "'" + this.replace(/'/g, "''") + "'" : this
    }, String.prototype.regExpEscape = function (e) {
        return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    }, RegExp.prototype.escape = function (e) {
        return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    },
    function (e, t) {
        var n, r;
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("underscore", t) : (e = e || self, n = e._, (r = e._ = t()).noConflict = function () {
            return e._ = n, r
        })
    }(this, (function () {
        var e = "1.11.0",
            t = "object" == typeof self && self.self === self && self || "object" == typeof global && global.global === global && global || Function("return this")() || {},
            n = Array.prototype,
            r = Object.prototype,
            a = "undefined" != typeof Symbol ? Symbol.prototype : null,
            o = n.push,
            i = n.slice,
            l = r.toString,
            u = r.hasOwnProperty,
            s = "undefined" != typeof ArrayBuffer,
            c = Array.isArray,
            d = Object.keys,
            f = Object.create,
            p = s && ArrayBuffer.isView,
            h = isNaN,
            g = isFinite,
            m = !{
                toString: null
            }.propertyIsEnumerable("toString"),
            y = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"],
            v = Math.pow(2, 53) - 1;

        function C(e, t) {
            return t = null == t ? e.length - 1 : +t,
                function () {
                    for (var n = Math.max(arguments.length - t, 0), r = Array(n), a = 0; a < n; a++) r[a] = arguments[a + t];
                    switch (t) {
                    case 0:
                        return e.call(this, r);
                    case 1:
                        return e.call(this, arguments[0], r);
                    case 2:
                        return e.call(this, arguments[0], arguments[1], r)
                    }
                    var o = Array(t + 1);
                    for (a = 0; a < t; a++) o[a] = arguments[a];
                    return o[t] = r, e.apply(this, o)
                }
        }

        function b(e) {
            var t = typeof e;
            return "function" === t || "object" === t && !!e
        }

        function E(e) {
            return !0 === e || !1 === e || "[object Boolean]" === l.call(e)
        }

        function S(e) {
            return function (t) {
                return l.call(t) === "[object " + e + "]"
            }
        }
        var I = S("String"),
            N = S("Number"),
            R = S("Date"),
            k = S("RegExp"),
            T = S("Error"),
            j = S("Symbol"),
            A = S("Map"),
            B = S("WeakMap"),
            w = S("Set"),
            x = S("WeakSet"),
            O = S("ArrayBuffer"),
            F = S("DataView"),
            L = c || S("Array"),
            H = S("Function"),
            D = t.document && t.document.childNodes;
        "function" != typeof /./ && "object" != typeof Int8Array && "function" != typeof D && (H = function (e) {
            return "function" == typeof e || !1
        });
        var q = H;

        function U(e, t) {
            return null != e && u.call(e, t)
        }
        var M = S("Arguments");
        ! function () {
            M(arguments) || (M = function (e) {
                return U(e, "callee")
            })
        }();
        var V = M;

        function P(e) {
            return N(e) && h(e)
        }

        function _(e) {
            return function () {
                return e
            }
        }

        function J(e) {
            return function (t) {
                var n = e(t);
                return "number" == typeof n && n >= 0 && n <= v
            }
        }

        function Q(e) {
            return function (t) {
                return null == t ? void 0 : t[e]
            }
        }
        var $ = Q("byteLength"),
            Y = J($),
            W = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/,
            G = s ? function (e) {
                return p ? p(e) && !F(e) : Y(e) && W.test(l.call(e))
            } : _(!1),
            X = Q("length"),
            z = J(X);

        function K(e, t) {
            t = function (e) {
                for (var t = {}, n = e.length, r = 0; r < n; ++r) t[e[r]] = !0;
                return {
                    contains: function (e) {
                        return t[e]
                    },
                    push: function (n) {
                        return t[n] = !0, e.push(n)
                    }
                }
            }(t);
            var n = y.length,
                a = e.constructor,
                o = q(a) && a.prototype || r,
                i = "constructor";
            for (U(e, i) && !t.contains(i) && t.push(i); n--;)(i = y[n]) in e && e[i] !== o[i] && !t.contains(i) && t.push(i)
        }

        function Z(e) {
            if (!b(e)) return [];
            if (d) return d(e);
            var t = [];
            for (var n in e) U(e, n) && t.push(n);
            return m && K(e, t), t
        }

        function ee(e, t) {
            var n = Z(t),
                r = n.length;
            if (null == e) return !r;
            for (var a = Object(e), o = 0; o < r; o++) {
                var i = n[o];
                if (t[i] !== a[i] || !(i in a)) return !1
            }
            return !0
        }

        function te(e) {
            return e instanceof te ? e : this instanceof te ? void(this._wrapped = e) : new te(e)
        }

        function ne(e) {
            if (!b(e)) return [];
            var t = [];
            for (var n in e) t.push(n);
            return m && K(e, t), t
        }

        function re(e) {
            for (var t = Z(e), n = t.length, r = Array(n), a = 0; a < n; a++) r[a] = e[t[a]];
            return r
        }

        function ae(e) {
            for (var t = {}, n = Z(e), r = 0, a = n.length; r < a; r++) t[e[n[r]]] = n[r];
            return t
        }

        function oe(e) {
            var t = [];
            for (var n in e) q(e[n]) && t.push(n);
            return t.sort()
        }

        function ie(e, t) {
            return function (n) {
                var r = arguments.length;
                if (t && (n = Object(n)), r < 2 || null == n) return n;
                for (var a = 1; a < r; a++)
                    for (var o = arguments[a], i = e(o), l = i.length, u = 0; u < l; u++) {
                        var s = i[u];
                        t && void 0 !== n[s] || (n[s] = o[s])
                    }
                return n
            }
        }
        te.VERSION = e, te.prototype.value = function () {
            return this._wrapped
        }, te.prototype.valueOf = te.prototype.toJSON = te.prototype.value, te.prototype.toString = function () {
            return String(this._wrapped)
        };
        var le = ie(ne),
            ue = ie(Z),
            se = ie(ne, !0);

        function ce(e) {
            if (!b(e)) return {};
            if (f) return f(e);
            var t = function () {};
            t.prototype = e;
            var n = new t;
            return t.prototype = null, n
        }

        function de(e) {
            return b(e) ? L(e) ? e.slice() : le({}, e) : e
        }

        function fe(e) {
            return e
        }

        function pe(e) {
            return e = ue({}, e),
                function (t) {
                    return ee(t, e)
                }
        }

        function he(e, t) {
            for (var n = t.length, r = 0; r < n; r++) {
                if (null == e) return;
                e = e[t[r]]
            }
            return n ? e : void 0
        }

        function ge(e) {
            return L(e) ? function (t) {
                return he(t, e)
            } : Q(e)
        }

        function me(e, t, n) {
            if (void 0 === t) return e;
            switch (null == n ? 3 : n) {
            case 1:
                return function (n) {
                    return e.call(t, n)
                };
            case 3:
                return function (n, r, a) {
                    return e.call(t, n, r, a)
                };
            case 4:
                return function (n, r, a, o) {
                    return e.call(t, n, r, a, o)
                }
            }
            return function () {
                return e.apply(t, arguments)
            }
        }

        function ye(e, t, n) {
            return null == e ? fe : q(e) ? me(e, t, n) : b(e) && !L(e) ? pe(e) : ge(e)
        }

        function ve(e, t) {
            return ye(e, t, 1 / 0)
        }

        function Ce(e, t, n) {
            return te.iteratee !== ve ? te.iteratee(e, t) : ye(e, t, n)
        }

        function be(e, t) {
            return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
        }
        te.iteratee = ve;
        var Ee = Date.now || function () {
            return (new Date).getTime()
        };

        function Se(e) {
            var t = function (t) {
                    return e[t]
                },
                n = "(?:" + Z(e).join("|") + ")",
                r = RegExp(n),
                a = RegExp(n, "g");
            return function (e) {
                return e = null == e ? "" : "" + e, r.test(e) ? e.replace(a, t) : e
            }
        }
        var Ie = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            },
            Ne = Se(Ie),
            Re = Se(ae(Ie)),
            ke = te.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            },
            Te = /(.)^/,
            je = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\u2028": "u2028",
                "\u2029": "u2029"
            },
            Ae = /\\|'|\r|\n|\u2028|\u2029/g;

        function Be(e) {
            return "\\" + je[e]
        }
        var we = 0;

        function xe(e, t, n, r, a) {
            if (!(r instanceof t)) return e.apply(n, a);
            var o = ce(e.prototype),
                i = e.apply(o, a);
            return b(i) ? i : o
        }
        var Oe = C((function (e, t) {
            var n = Oe.placeholder,
                r = function () {
                    for (var a = 0, o = t.length, i = Array(o), l = 0; l < o; l++) i[l] = t[l] === n ? arguments[a++] : t[l];
                    for (; a < arguments.length;) i.push(arguments[a++]);
                    return xe(e, r, this, this, i)
                };
            return r
        }));
        Oe.placeholder = te;
        var Fe = C((function (e, t, n) {
            if (!q(e)) throw new TypeError("Bind must be called on a function");
            var r = C((function (a) {
                return xe(e, r, t, this, n.concat(a))
            }));
            return r
        }));

        function Le(e, t, n, r) {
            if (r = r || [], t || 0 === t) {
                if (t <= 0) return r.concat(e)
            } else t = 1 / 0;
            for (var a = r.length, o = 0, i = X(e); o < i; o++) {
                var l = e[o];
                if (z(l) && (L(l) || V(l)))
                    if (t > 1) Le(l, t - 1, n, r), a = r.length;
                    else
                        for (var u = 0, s = l.length; u < s;) r[a++] = l[u++];
                else n || (r[a++] = l)
            }
            return r
        }
        var He = C((function (e, t) {
                var n = (t = Le(t, !1, !1)).length;
                if (n < 1) throw new Error("bindAll must be passed function names");
                for (; n--;) {
                    var r = t[n];
                    e[r] = Fe(e[r], e)
                }
                return e
            })),
            De = C((function (e, t, n) {
                return setTimeout((function () {
                    return e.apply(null, n)
                }), t)
            })),
            qe = Oe(De, te, 1);

        function Ue(e) {
            return function () {
                return !e.apply(this, arguments)
            }
        }

        function Me(e, t) {
            var n;
            return function () {
                return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = null), n
            }
        }
        var Ve = Oe(Me, 2);

        function Pe(e, t, n) {
            t = Ce(t, n);
            for (var r, a = Z(e), o = 0, i = a.length; o < i; o++)
                if (t(e[r = a[o]], r, e)) return r
        }

        function _e(e) {
            return function (t, n, r) {
                n = Ce(n, r);
                for (var a = X(t), o = e > 0 ? 0 : a - 1; o >= 0 && o < a; o += e)
                    if (n(t[o], o, t)) return o;
                return -1
            }
        }
        var Je = _e(1),
            Qe = _e(-1);

        function $e(e, t, n, r) {
            for (var a = (n = Ce(n, r, 1))(t), o = 0, i = X(e); o < i;) {
                var l = Math.floor((o + i) / 2);
                n(e[l]) < a ? o = l + 1 : i = l
            }
            return o
        }

        function Ye(e, t, n) {
            return function (r, a, o) {
                var l = 0,
                    u = X(r);
                if ("number" == typeof o) e > 0 ? l = o >= 0 ? o : Math.max(o + u, l) : u = o >= 0 ? Math.min(o + 1, u) : o + u + 1;
                else if (n && o && u) return r[o = n(r, a)] === a ? o : -1;
                if (a != a) return (o = t(i.call(r, l, u), P)) >= 0 ? o + l : -1;
                for (o = e > 0 ? l : u - 1; o >= 0 && o < u; o += e)
                    if (r[o] === a) return o;
                return -1
            }
        }
        var We = Ye(1, Je, $e),
            Ge = Ye(-1, Qe);

        function Xe(e, t, n) {
            var r = (z(e) ? Je : Pe)(e, t, n);
            if (void 0 !== r && -1 !== r) return e[r]
        }

        function ze(e, t, n) {
            var r, a;
            if (t = me(t, n), z(e))
                for (r = 0, a = e.length; r < a; r++) t(e[r], r, e);
            else {
                var o = Z(e);
                for (r = 0, a = o.length; r < a; r++) t(e[o[r]], o[r], e)
            }
            return e
        }

        function Ke(e, t, n) {
            t = Ce(t, n);
            for (var r = !z(e) && Z(e), a = (r || e).length, o = Array(a), i = 0; i < a; i++) {
                var l = r ? r[i] : i;
                o[i] = t(e[l], l, e)
            }
            return o
        }

        function Ze(e) {
            var t = function (t, n, r, a) {
                var o = !z(t) && Z(t),
                    i = (o || t).length,
                    l = e > 0 ? 0 : i - 1;
                for (a || (r = t[o ? o[l] : l], l += e); l >= 0 && l < i; l += e) {
                    var u = o ? o[l] : l;
                    r = n(r, t[u], u, t)
                }
                return r
            };
            return function (e, n, r, a) {
                var o = arguments.length >= 3;
                return t(e, me(n, a, 4), r, o)
            }
        }
        var et = Ze(1),
            tt = Ze(-1);

        function nt(e, t, n) {
            var r = [];
            return t = Ce(t, n), ze(e, (function (e, n, a) {
                t(e, n, a) && r.push(e)
            })), r
        }

        function rt(e, t, n) {
            t = Ce(t, n);
            for (var r = !z(e) && Z(e), a = (r || e).length, o = 0; o < a; o++) {
                var i = r ? r[o] : o;
                if (!t(e[i], i, e)) return !1
            }
            return !0
        }

        function at(e, t, n) {
            t = Ce(t, n);
            for (var r = !z(e) && Z(e), a = (r || e).length, o = 0; o < a; o++) {
                var i = r ? r[o] : o;
                if (t(e[i], i, e)) return !0
            }
            return !1
        }

        function ot(e, t, n, r) {
            return z(e) || (e = re(e)), ("number" != typeof n || r) && (n = 0), We(e, t, n) >= 0
        }
        var it = C((function (e, t, n) {
            var r, a;
            return q(t) ? a = t : L(t) && (r = t.slice(0, -1), t = t[t.length - 1]), Ke(e, (function (e) {
                var o = a;
                if (!o) {
                    if (r && r.length && (e = he(e, r)), null == e) return;
                    o = e[t]
                }
                return null == o ? o : o.apply(e, n)
            }))
        }));

        function lt(e, t) {
            return Ke(e, ge(t))
        }

        function ut(e, t, n) {
            var r, a, o = -1 / 0,
                i = -1 / 0;
            if (null == t || "number" == typeof t && "object" != typeof e[0] && null != e)
                for (var l = 0, u = (e = z(e) ? e : re(e)).length; l < u; l++) null != (r = e[l]) && r > o && (o = r);
            else t = Ce(t, n), ze(e, (function (e, n, r) {
                ((a = t(e, n, r)) > i || a === -1 / 0 && o === -1 / 0) && (o = e, i = a)
            }));
            return o
        }

        function st(e, t, n) {
            if (null == t || n) return z(e) || (e = re(e)), e[be(e.length - 1)];
            var r = z(e) ? de(e) : re(e),
                a = X(r);
            t = Math.max(Math.min(t, a), 0);
            for (var o = a - 1, i = 0; i < t; i++) {
                var l = be(i, o),
                    u = r[i];
                r[i] = r[l], r[l] = u
            }
            return r.slice(0, t)
        }

        function ct(e, t) {
            return function (n, r, a) {
                var o = t ? [
                    [],
                    []
                ] : {};
                return r = Ce(r, a), ze(n, (function (t, a) {
                    var i = r(t, a, n);
                    e(o, t, i)
                })), o
            }
        }
        var dt = ct((function (e, t, n) {
                U(e, n) ? e[n].push(t) : e[n] = [t]
            })),
            ft = ct((function (e, t, n) {
                e[n] = t
            })),
            pt = ct((function (e, t, n) {
                U(e, n) ? e[n]++ : e[n] = 1
            })),
            ht = ct((function (e, t, n) {
                e[n ? 0 : 1].push(t)
            }), !0),
            gt = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

        function mt(e, t, n) {
            return t in n
        }
        var yt = C((function (e, t) {
                var n = {},
                    r = t[0];
                if (null == e) return n;
                q(r) ? (t.length > 1 && (r = me(r, t[1])), t = ne(e)) : (r = mt, t = Le(t, !1, !1), e = Object(e));
                for (var a = 0, o = t.length; a < o; a++) {
                    var i = t[a],
                        l = e[i];
                    r(l, i, e) && (n[i] = l)
                }
                return n
            })),
            vt = C((function (e, t) {
                var n, r = t[0];
                return q(r) ? (r = Ue(r), t.length > 1 && (n = t[1])) : (t = Ke(Le(t, !1, !1), String), r = function (e, n) {
                    return !ot(t, n)
                }), yt(e, r, n)
            }));

        function Ct(e, t, n) {
            return i.call(e, 0, Math.max(0, e.length - (null == t || n ? 1 : t)))
        }

        function bt(e, t, n) {
            return null == e || e.length < 1 ? null == t || n ? void 0 : [] : null == t || n ? e[0] : Ct(e, e.length - t)
        }

        function Et(e, t, n) {
            return i.call(e, null == t || n ? 1 : t)
        }
        var St = C((function (e, t) {
                return t = Le(t, !0, !0), nt(e, (function (e) {
                    return !ot(t, e)
                }))
            })),
            It = C((function (e, t) {
                return St(e, t)
            }));

        function Nt(e, t, n, r) {
            E(t) || (r = n, n = t, t = !1), null != n && (n = Ce(n, r));
            for (var a = [], o = [], i = 0, l = X(e); i < l; i++) {
                var u = e[i],
                    s = n ? n(u, i, e) : u;
                t && !n ? (i && o === s || a.push(u), o = s) : n ? ot(o, s) || (o.push(s), a.push(u)) : ot(a, u) || a.push(u)
            }
            return a
        }
        var Rt = C((function (e) {
            return Nt(Le(e, !0, !0))
        }));

        function kt(e) {
            for (var t = e && ut(e, X).length || 0, n = Array(t), r = 0; r < t; r++) n[r] = lt(e, r);
            return n
        }
        var Tt = C(kt);

        function jt(e, t) {
            return e._chain ? te(t).chain() : t
        }

        function At(e) {
            return ze(oe(e), (function (t) {
                var n = te[t] = e[t];
                te.prototype[t] = function () {
                    var e = [this._wrapped];
                    return o.apply(e, arguments), jt(this, n.apply(te, e))
                }
            })), te
        }
        ze(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], (function (e) {
            var t = n[e];
            te.prototype[e] = function () {
                var n = this._wrapped;
                return null != n && (t.apply(n, arguments), "shift" !== e && "splice" !== e || 0 !== n.length || delete n[0]), jt(this, n)
            }
        })), ze(["concat", "join", "slice"], (function (e) {
            var t = n[e];
            te.prototype[e] = function () {
                var e = this._wrapped;
                return null != e && (e = t.apply(e, arguments)), jt(this, e)
            }
        }));
        var Bt = At({
            __proto__: null,
            VERSION: e,
            restArguments: C,
            isObject: b,
            isNull: function (e) {
                return null === e
            },
            isUndefined: function (e) {
                return void 0 === e
            },
            isBoolean: E,
            isElement: function (e) {
                return !(!e || 1 !== e.nodeType)
            },
            isString: I,
            isNumber: N,
            isDate: R,
            isRegExp: k,
            isError: T,
            isSymbol: j,
            isMap: A,
            isWeakMap: B,
            isSet: w,
            isWeakSet: x,
            isArrayBuffer: O,
            isDataView: F,
            isArray: L,
            isFunction: q,
            isArguments: V,
            isFinite: function (e) {
                return !j(e) && g(e) && !isNaN(parseFloat(e))
            },
            isNaN: P,
            isTypedArray: G,
            isEmpty: function (e) {
                return null == e || (z(e) && (L(e) || I(e) || V(e)) ? 0 === e.length : 0 === Z(e).length)
            },
            isMatch: ee,
            isEqual: function (e, t) {
                return function e(t, n, r, o) {
                    if (t === n) return 0 !== t || 1 / t == 1 / n;
                    if (null == t || null == n) return !1;
                    if (t != t) return n != n;
                    var i = typeof t;
                    return ("function" === i || "object" === i || "object" == typeof n) && function t(n, r, o, i) {
                        n instanceof te && (n = n._wrapped), r instanceof te && (r = r._wrapped);
                        var u = l.call(n);
                        if (u !== l.call(r)) return !1;
                        switch (u) {
                        case "[object RegExp]":
                        case "[object String]":
                            return "" + n == "" + r;
                        case "[object Number]":
                            return +n != +n ? +r != +r : 0 == +n ? 1 / +n == 1 / r : +n == +r;
                        case "[object Date]":
                        case "[object Boolean]":
                            return +n == +r;
                        case "[object Symbol]":
                            return a.valueOf.call(n) === a.valueOf.call(r);
                        case "[object ArrayBuffer]":
                            return t(new DataView(n), new DataView(r), o, i);
                        case "[object DataView]":
                            var s = $(n);
                            if (s !== $(r)) return !1;
                            for (; s--;)
                                if (n.getUint8(s) !== r.getUint8(s)) return !1;
                            return !0
                        }
                        if (G(n)) return t(new DataView(n.buffer), new DataView(r.buffer), o, i);
                        var c = "[object Array]" === u;
                        if (!c) {
                            if ("object" != typeof n || "object" != typeof r) return !1;
                            var d = n.constructor,
                                f = r.constructor;
                            if (d !== f && !(q(d) && d instanceof d && q(f) && f instanceof f) && "constructor" in n && "constructor" in r) return !1
                        }
                        i = i || [];
                        for (var p = (o = o || []).length; p--;)
                            if (o[p] === n) return i[p] === r;
                        if (o.push(n), i.push(r), c) {
                            if ((p = n.length) !== r.length) return !1;
                            for (; p--;)
                                if (!e(n[p], r[p], o, i)) return !1
                        } else {
                            var h, g = Z(n);
                            if (p = g.length, Z(r).length !== p) return !1;
                            for (; p--;)
                                if (!U(r, h = g[p]) || !e(n[h], r[h], o, i)) return !1
                        }
                        return o.pop(), i.pop(), !0
                    }(t, n, r, o)
                }(e, t)
            },
            keys: Z,
            allKeys: ne,
            values: re,
            pairs: function (e) {
                for (var t = Z(e), n = t.length, r = Array(n), a = 0; a < n; a++) r[a] = [t[a], e[t[a]]];
                return r
            },
            invert: ae,
            functions: oe,
            methods: oe,
            extend: le,
            extendOwn: ue,
            assign: ue,
            defaults: se,
            create: function (e, t) {
                var n = ce(e);
                return t && ue(n, t), n
            },
            clone: de,
            tap: function (e, t) {
                return t(e), e
            },
            has: function (e, t) {
                if (!L(t)) return U(e, t);
                for (var n = t.length, r = 0; r < n; r++) {
                    var a = t[r];
                    if (null == e || !u.call(e, a)) return !1;
                    e = e[a]
                }
                return !!n
            },
            mapObject: function (e, t, n) {
                t = Ce(t, n);
                for (var r = Z(e), a = r.length, o = {}, i = 0; i < a; i++) {
                    var l = r[i];
                    o[l] = t(e[l], l, e)
                }
                return o
            },
            identity: fe,
            constant: _,
            noop: function () {},
            property: ge,
            propertyOf: function (e) {
                return null == e ? function () {} : function (t) {
                    return L(t) ? he(e, t) : e[t]
                }
            },
            matcher: pe,
            matches: pe,
            times: function (e, t, n) {
                var r = Array(Math.max(0, e));
                t = me(t, n, 1);
                for (var a = 0; a < e; a++) r[a] = t(a);
                return r
            },
            random: be,
            now: Ee,
            escape: Ne,
            unescape: Re,
            templateSettings: ke,
            template: function (e, t, n) {
                !t && n && (t = n), t = se({}, t, te.templateSettings);
                var r, a = RegExp([(t.escape || Te).source, (t.interpolate || Te).source, (t.evaluate || Te).source].join("|") + "|$", "g"),
                    o = 0,
                    i = "__p+='";
                e.replace(a, (function (t, n, r, a, l) {
                    return i += e.slice(o, l).replace(Ae, Be), o = l + t.length, n ? i += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : r ? i += "'+\n((__t=(" + r + "))==null?'':__t)+\n'" : a && (i += "';\n" + a + "\n__p+='"), t
                })), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
                try {
                    r = new Function(t.variable || "obj", "_", i)
                } catch (e) {
                    throw e.source = i, e
                }
                var l = function (e) {
                        return r.call(this, e, te)
                    },
                    u = t.variable || "obj";
                return l.source = "function(" + u + "){\n" + i + "}", l
            },
            result: function (e, t, n) {
                L(t) || (t = [t]);
                var r = t.length;
                if (!r) return q(n) ? n.call(e) : n;
                for (var a = 0; a < r; a++) {
                    var o = null == e ? void 0 : e[t[a]];
                    void 0 === o && (o = n, a = r), e = q(o) ? o.call(e) : o
                }
                return e
            },
            uniqueId: function (e) {
                var t = ++we + "";
                return e ? e + t : t
            },
            chain: function (e) {
                var t = te(e);
                return t._chain = !0, t
            },
            iteratee: ve,
            partial: Oe,
            bind: Fe,
            bindAll: He,
            memoize: function (e, t) {
                var n = function (r) {
                    var a = n.cache,
                        o = "" + (t ? t.apply(this, arguments) : r);
                    return U(a, o) || (a[o] = e.apply(this, arguments)), a[o]
                };
                return n.cache = {}, n
            },
            delay: De,
            defer: qe,
            throttle: function (e, t, n) {
                var r, a, o, i, l = 0;
                n || (n = {});
                var u = function () {
                        l = !1 === n.leading ? 0 : Ee(), r = null, i = e.apply(a, o), r || (a = o = null)
                    },
                    s = function () {
                        var s = Ee();
                        l || !1 !== n.leading || (l = s);
                        var c = t - (s - l);
                        return a = this, o = arguments, c <= 0 || c > t ? (r && (clearTimeout(r), r = null), l = s, i = e.apply(a, o), r || (a = o = null)) : r || !1 === n.trailing || (r = setTimeout(u, c)), i
                    };
                return s.cancel = function () {
                    clearTimeout(r), l = 0, r = a = o = null
                }, s
            },
            debounce: function (e, t, n) {
                var r, a, o = function (t, n) {
                        r = null, n && (a = e.apply(t, n))
                    },
                    i = C((function (i) {
                        if (r && clearTimeout(r), n) {
                            var l = !r;
                            r = setTimeout(o, t), l && (a = e.apply(this, i))
                        } else r = De(o, t, this, i);
                        return a
                    }));
                return i.cancel = function () {
                    clearTimeout(r), r = null
                }, i
            },
            wrap: function (e, t) {
                return Oe(t, e)
            },
            negate: Ue,
            compose: function () {
                var e = arguments,
                    t = e.length - 1;
                return function () {
                    for (var n = t, r = e[t].apply(this, arguments); n--;) r = e[n].call(this, r);
                    return r
                }
            },
            after: function (e, t) {
                return function () {
                    if (--e < 1) return t.apply(this, arguments)
                }
            },
            before: Me,
            once: Ve,
            findKey: Pe,
            findIndex: Je,
            findLastIndex: Qe,
            sortedIndex: $e,
            indexOf: We,
            lastIndexOf: Ge,
            find: Xe,
            detect: Xe,
            findWhere: function (e, t) {
                return Xe(e, pe(t))
            },
            each: ze,
            forEach: ze,
            map: Ke,
            collect: Ke,
            reduce: et,
            foldl: et,
            inject: et,
            reduceRight: tt,
            foldr: tt,
            filter: nt,
            select: nt,
            reject: function (e, t, n) {
                return nt(e, Ue(Ce(t)), n)
            },
            every: rt,
            all: rt,
            some: at,
            any: at,
            contains: ot,
            includes: ot,
            include: ot,
            invoke: it,
            pluck: lt,
            where: function (e, t) {
                return nt(e, pe(t))
            },
            max: ut,
            min: function (e, t, n) {
                var r, a, o = 1 / 0,
                    i = 1 / 0;
                if (null == t || "number" == typeof t && "object" != typeof e[0] && null != e)
                    for (var l = 0, u = (e = z(e) ? e : re(e)).length; l < u; l++) null != (r = e[l]) && r < o && (o = r);
                else t = Ce(t, n), ze(e, (function (e, n, r) {
                    ((a = t(e, n, r)) < i || a === 1 / 0 && o === 1 / 0) && (o = e, i = a)
                }));
                return o
            },
            shuffle: function (e) {
                return st(e, 1 / 0)
            },
            sample: st,
            sortBy: function (e, t, n) {
                var r = 0;
                return t = Ce(t, n), lt(Ke(e, (function (e, n, a) {
                    return {
                        value: e,
                        index: r++,
                        criteria: t(e, n, a)
                    }
                })).sort((function (e, t) {
                    var n = e.criteria,
                        r = t.criteria;
                    if (n !== r) {
                        if (n > r || void 0 === n) return 1;
                        if (n < r || void 0 === r) return -1
                    }
                    return e.index - t.index
                })), "value")
            },
            groupBy: dt,
            indexBy: ft,
            countBy: pt,
            partition: ht,
            toArray: function (e) {
                return e ? L(e) ? i.call(e) : I(e) ? e.match(gt) : z(e) ? Ke(e, fe) : re(e) : []
            },
            size: function (e) {
                return null == e ? 0 : z(e) ? e.length : Z(e).length
            },
            pick: yt,
            omit: vt,
            first: bt,
            head: bt,
            take: bt,
            initial: Ct,
            last: function (e, t, n) {
                return null == e || e.length < 1 ? null == t || n ? void 0 : [] : null == t || n ? e[e.length - 1] : Et(e, Math.max(0, e.length - t))
            },
            rest: Et,
            tail: Et,
            drop: Et,
            compact: function (e) {
                return nt(e, Boolean)
            },
            flatten: function (e, t) {
                return Le(e, t, !1)
            },
            without: It,
            uniq: Nt,
            unique: Nt,
            union: Rt,
            intersection: function (e) {
                for (var t = [], n = arguments.length, r = 0, a = X(e); r < a; r++) {
                    var o = e[r];
                    if (!ot(t, o)) {
                        var i;
                        for (i = 1; i < n && ot(arguments[i], o); i++);
                        i === n && t.push(o)
                    }
                }
                return t
            },
            difference: St,
            unzip: kt,
            transpose: kt,
            zip: Tt,
            object: function (e, t) {
                for (var n = {}, r = 0, a = X(e); r < a; r++) t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
                return n
            },
            range: function (e, t, n) {
                null == t && (t = e || 0, e = 0), n || (n = t < e ? -1 : 1);
                for (var r = Math.max(Math.ceil((t - e) / n), 0), a = Array(r), o = 0; o < r; o++, e += n) a[o] = e;
                return a
            },
            chunk: function (e, t) {
                if (null == t || t < 1) return [];
                for (var n = [], r = 0, a = e.length; r < a;) n.push(i.call(e, r, r += t));
                return n
            },
            mixin: At,
            default: te
        });
        return Bt._ = Bt, Bt
    }));
