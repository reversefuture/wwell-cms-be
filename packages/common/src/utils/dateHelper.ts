/***
 * 日期格式化
 * @param {Date} date
 * @param {string} fmt
 * @returns {string}
 */
export const formatDate = function (date, fmt) {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'S+': date.getMilliseconds(),
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? o[k]
          : ('00' + o[k]).substr(String(o[k]).length),
      );
    }
  }
  return fmt;
};
/**
 *
 * @param dateStr eg: 31 January 2025
 * @returns
 */
export function convertDateToIsoUtc(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(date.getTime())) {
    throw new Error('日期转换失败');
  }
  // 将日期设置为UTC午夜
  return date.toISOString();
}

/**
 *
 * @param dateStr eg: January 31, 2025 5:06 PM GMT+8
 * @returns
 */
export function convertToIsoUtc(dateStr: string): string {
  // 定义正则表达式匹配输入的日期时间字符串
  const regex =
    /^(\w+)\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)\s+GMT([+-]\d{1,2})$/i;
  const match = dateStr.match(regex);

  if (!match) {
    throw new Error('Invalid date format');
  }

  // 解析匹配到的部分
  const monthName = match[1];
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  let hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);
  const ampm = match[6].toUpperCase();
  const gmtOffsetHours = parseInt(match[7], 10);

  // 处理12小时制转24小时制
  if (ampm === 'PM' && hour !== 12) {
    hour += 12;
  } else if (ampm === 'AM' && hour === 12) {
    hour = 0;
  }

  // 创建月份映射
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames.indexOf(monthName) + 1; // 获取月份数字

  // 创建日期对象，考虑时区偏移
  const localDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // 调整时区偏移
  const adjustedDate = new Date(
    localDate.getTime() - (gmtOffsetHours * 60 + 0) * 60000,
  );

  // 返回ISO格式的UTC时间字符串
  return adjustedDate.toISOString();
}
