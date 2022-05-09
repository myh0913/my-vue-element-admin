// 含对象的数组的去重
// new Set()无法去重 '含对象的数组'，应手写去重方法。
// unique(目标数组，要去重的目标key值)
export function unique(arr, key) {
  var result = []
  var obj = {}
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i][key]]) {
      result.push(arr[i])
      obj[arr[i][key]] = true
    }
  }
  return result
}
