const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
function _utf8_encode(string) {
  string = string.replace(/\r\n/g, '\n')
  var utftext = ''
  for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n)
    if (c < 128) {
      utftext += String.fromCharCode(c)
    } else if (c > 127 && c < 2048) {
      utftext += String.fromCharCode((c >> 6) | 192)
      utftext += String.fromCharCode((c & 63) | 128)
    } else {
      utftext += String.fromCharCode((c >> 12) | 224)
      utftext += String.fromCharCode(((c >> 6) & 63) | 128)
      utftext += String.fromCharCode((c & 63) | 128)
    }
  }
  return utftext
}
function _utf8_decode(utftext) {
  var string = ''
  var i = 0
  var c
  var c3
  var c2 = 0
  while (i < utftext.length) {
    c = utftext.charCodeAt(i)
    if (c < 128) {
      string += String.fromCharCode(c)
      i++
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1)
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
      i += 2
    } else {
      c2 = utftext.charCodeAt(i + 1)
      c3 = utftext.charCodeAt(i + 2)
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
      i += 3
    }
  }
  return string
}
export function encode(e) {
  var t = ''
  var n, r, i, s, o, u, a
  var f = 0
  e = _utf8_encode(e)
  while (f < e.length) {
    n = e.charCodeAt(f++)
    r = e.charCodeAt(f++)
    i = e.charCodeAt(f++)
    s = n >> 2
    o = ((n & 3) << 4) | (r >> 4)
    u = ((r & 15) << 2) | (i >> 6)
    a = i & 63
    if (isNaN(r)) {
      u = a = 64
    } else if (isNaN(i)) {
      a = 64
    }
    t = t + _keyStr.charAt(s) + _keyStr.charAt(o) + _keyStr.charAt(u) + _keyStr.charAt(a)
  }
  return t
}
export function decode(e) {
  var t = ''
  var n, r, i
  var s, o, u, a
  var f = 0
  e = e.replace(/[^A-Za-z0-9+/=]/g, '')
  while (f < e.length) {
    s = _keyStr.indexOf(e.charAt(f++))
    o = _keyStr.indexOf(e.charAt(f++))
    u = _keyStr.indexOf(e.charAt(f++))
    a = _keyStr.indexOf(e.charAt(f++))
    n = (s << 2) | (o >> 4)
    r = ((o & 15) << 4) | (u >> 2)
    i = ((u & 3) << 6) | a
    t = t + String.fromCharCode(n)
    if (u !== 64) {
      t = t + String.fromCharCode(r)
    }
    if (a !== 64) {
      t = t + String.fromCharCode(i)
    }
  }
  t = _utf8_decode(t)
  return t
}
