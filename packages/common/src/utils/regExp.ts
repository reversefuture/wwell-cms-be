// https://blog.csdn.net/ZYC88888/article/details/98479629
export const regNumber = /^(\-|\+)?\d+(\.\d+)?$/gi;
export const regInteger = /^\d+$/gi; // ^[1-9]\d*|0$
export const regFloat = /^(-?\d+)(\.\d+)?/gi;
export const regEnName = /^\w+$/gi; //  或 ^\w{3,20}$， 数字、26个英文字母或者下划线
export const regChinese = /[\u4E00-\u9FA5]/gi;
export const regEn = /^[A-Za-z]+$/g;
export const regEnUpper = /^[A-Z]+$/g;
export const regEnLower = /^[a-z]+$/g;
export const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi;
export const regDomain =
  /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/gi;
export const regUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
export const regMobile =
  /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/gi;
export const regTel = /^(\(\d{3,4}-)|\d{3.4}-\)?\d{7,8}$/gi;
export const regTelCn = /\d{3}-\d{8}|\d{4}-\d{7}/gi;
export const regIdCard = /^\d{15}|\d{18}$/gi;
export const regDate = /^\d{4}-\d{1,2}-\d{1,2}/gi;
export const regDateTime = /^\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{2}:\d{2}/gi;
export const regBr = /\n\s*\r/gi;
export const regMoney = /^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/gi;
export const regHTML = /<(\S*?)[^>]*>.*?<\/\S*?>|<.*? \/>/gi;
export const regExternalLink = /^(https?:|mailto:|tel:)/gi;
export const regIP = /\d+\.\d+\.\d+\.\d+/gi;
export const regFilExt =
  /^([a-zA-Z]\\:|\\\\)\\\\([^\\\\]+\\\\)*[^\\/:*?"<>|]+\\.txt(l)?$/gi;
