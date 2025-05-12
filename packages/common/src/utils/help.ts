/**
 * 处理弹出层滑动穿透问题
 */
export const ModalHelper = (function (bodyCls) {
  var scrollTop
  return {
    afterOpen: function () {
      scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      document.body.classList.add(bodyCls)
      // document.body.style.top = -scrollTop + 'px';
    },
    beforeClose: function () {
      document.body.classList.remove(bodyCls)
      // scrollTop lost after set position:fixed, restore it back.
      window.scrollTo(0, scrollTop)
    },
  }
})("modal-open")

export const setCookie = function (key, value, defaultOptions={} as any) {
  const options = defaultOptions || {}
  const path = options.path || "/"
  // Note! 貌似一些手机端（例如iphone）不支持设置中文Cookie值，必须要encode
  let str = key + "=" + encodeURIComponent(value) + "; path=" + path + "; "
  if (options.domain) {
    str += "domain=" + options.domain + "; "
  }
  if (options.expires) {
    str += "expires=" + options.expires.toGMTString() + "; "
  }
  document.cookie = str
}

export const getCookie = function (name) {
  const arr = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]*)(;|$)"),
  ) // new RegExp('(^|\\W)' + name + '=([^;]*)(;|$)')
  if (arr !== null) {
    return decodeURIComponent(arr[2]) || ""
  }
  return ""
}

export function deleteCookie(name) {
  // 设置 cookie 的过期时间为过去的时间
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * 查找与给定选择器匹配的最近的祖先元素
 * @param {*} el 
 * @param {*} selector 
 * @returns 
 */
export const  findClosestDom = function (el, selector) {
  const matchesSelector =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el
    }
    // eslint-disable-next-line no-param-reassign
    el = el.parentElement
  }
  return null
}
/**
 * 处理触摸事件，如果触摸的目标元素不在 .hz-modal 元素内，则阻止默认的触摸行为。
 * @param {*} e 
 * @returns 
 */
export const onWrapTouchStart = (e) => {
  if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    return
  }
  const pNode = findClosestDom(e.target, ".hz-modal")
  if (!pNode) {
    e.preventDefault()
  }
}

/**
 * 把参数对象转为url query parameter
 * @param params 参数对象
 * @returns 
 */
export function formatQueryString(params: Record<string, any>): string {
  const queryParams = new URLSearchParams();

  for (const key in params) {
      if (params.hasOwnProperty(key)) {
          const value = params[key];
          if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
          }
      }
  }
  return queryParams.toString();
}

/**
 *  取地址栏参数
 * @param {string} url 地址字符串,如果不传入则为浏览器地址从问号 (?) 开始的 URL
 */
export const  getUrlParams = function (url) {
  let _url = url ? url : window.location.search,
    data = {}
  if (_url.indexOf("?") != -1) {
    let u = _url.split("?")[1]
    let _urlArr = u.split("&")
    for (let i = 0; i < _urlArr.length; i++) {
      let _d = _urlArr[i].split("=")
      data[_d[0]] = decodeURIComponent(_d[1])
    }
  }
  return data
}

/**
 * 取地址栏参数,如果不存在返回空字符串
 *
 * @param {string} paramName 参数名称
 * @param {string} url 地址字符串,如果不传入则为浏览器地址从问号 (?) 开始的 URL
 *
 */
export const  getUrlParam = function (paramName, url) {
  let _url = url ? url : window.location.search
  let svalue = _url.match(new RegExp("[?&]" + paramName + "=([^&]*)(&?)", "i"))
  return svalue ? svalue[1] : ""
}

export const  scrollTo = (x, y) => {
  if (!window.scrollTo) {
    window.pageXOffset = x
    window.pageYOffset = y
  } else {
    window.scrollTo(x, y)
  }
}

//获取页面滚动条滚动的距离
export const  getPageScroll = () => {
  let xScroll, yScroll
  // console.log('self.pageXOffset:', window.pageYOffset);
  // console.log('self.scrollTop:', document.documentElement.scrollTop);
  if (window.pageYOffset) {
    yScroll = self.pageYOffset
    xScroll = self.pageXOffset
  } else if (document.documentElement && document.documentElement.scrollTop) {
    // Explorer 6 Strict
    yScroll = document.documentElement.scrollTop
    xScroll = document.documentElement.scrollLeft
  } else if (document.body) {
    // all other Explorers
    yScroll = document.body.scrollTop
    xScroll = document.body.scrollLeft
  }
  return {
    x: xScroll,
    y: yScroll,
  }
}

//解决ios系统date兼容问题
export const fixIosDate = (timeStr) => {
  return timeStr.replace(/-/g, "/")
}

/**
 * 防抖
 * @param {*} fn
 * @param {*} delay
 */
export const debounce = function (fn, delay) {
  var timer // 定时器
  delay || (delay = 250) // 默认空闲时间250ms
  return function () {
    // @ts-ignore
    var context = this
    var args = arguments
    clearTimeout(timer) // 清除定时器
    timer = setTimeout(function () {
      fn.apply(context, args) // delay时间后，执行函数
    }, delay)
  }
}
/**
 * 节流
 * @param {*} fn
 * @param {*} delay
 */
export const throttle = function (fn, delay) {
  let valid = true
  return function (...args) {
    if (!valid) {
      return false
    }
    valid = false
    setTimeout(() => {
      args?.length === 1 ? fn(args[0]) : fn(...args)
      valid = true
    }, delay)
  }
}

export function numberWithCommas(number) {
  if (!number && number !== 0) {
    return ""
  }
  const numberString = number.toString()
  const parts = numberString.split(".")
  // Add commas to the integer part
  const integerWithCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  // If there's a decimal part, include it with the commas
  const result =
    parts.length === 2 ? `${integerWithCommas}.${parts[1]}` : integerWithCommas

  return result
}

/**
 * https://blog.csdn.net/qq27229639/article/details/105531459
 * 更新react引用类型state
 * @param {*} newState
 * @param {*} changeStateFn: useState 返回第二个参数
 * @param {*} callback
 */
export const setObjectState = (
  newState,
  changeStateFn,
  callback = (state: any) => false,
) => {
  changeStateFn((state) => {
    if (state.constructor === Object) {
      state = Object.assign({}, state, newState)
    }
    if (state.construct === Array) {
      state = newState.slice()
    }
    callback(state)
    return state
  })
}

/**
 * 把传入的每个classes拼接成css类名
 * @param  {...any} classes 
 * @returns 
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
