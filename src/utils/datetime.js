/**
 * 时间日期相关操作
 */

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format(datetime) {
  return formatWithSeperator(datetime, "-", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator(datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    let month = dateMat.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }

    let day = dateMat.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let hh = dateMat.getHours();
    if (hh < 10) {
      hh = "0" + hh;
    }
    let mm = dateMat.getMinutes();
    if (mm < 10) {
      mm = "0" + mm;
    }

    let ss = dateMat.getSeconds();
    if (ss < 10) {
      ss = "0" + ss;
    }
    const timeFormat =
      year +
      dateSeprator +
      month +
      dateSeprator +
      day +
      " " +
      hh +
      timeSeprator +
      mm +
      timeSeprator +
      ss;
    return timeFormat;
  }
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23
 * 带斜杠的年月日
 * @param datetime 国际化日期格式
 */
export function format2(datetime) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    const month = dateMat.getMonth() + 1;
    const day = dateMat.getDate();
    const timeFormat = year + "/" + month + "/" + day;
    return timeFormat;
  }
}
// 带横杠的年月日
export function format3(timestamp) {
  if (timestamp != null) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    let strDate = Y + "-" + M + "-" + D;

    return strDate;
  }
}
// 不带横杠的年月日


export function format4(timestamp) {
  if (timestamp != null) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '';
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1 + '');
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

    let strDate = Y + M + D;

    return strDate;
  }
}

// 时间戳转化为正常年月
export function timestampToTime(timestamp) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "/";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "/";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  let strDate = Y + M + D + h + m + s;

  return strDate;
}
//带横杠的年月日时分秒毫秒
export function format5(timestamp) {
  if (timestamp != null) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    var ms = date.getMilliseconds();//毫秒

    if(ms < 10){
      ms = "00" + ms;
    }else if(ms < 100){
      ms = "0" + ms;
    }
    let strDate = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s + "." + ms;

    return strDate;
  }
}

export function formatNoSecond(timestamp) {
  if (timestamp != null) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '';
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1 + '');
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    let strDate = Y + '-' + M + '-' + D + ' ' + h + ':' + m;

    return strDate;
  }
}


export function formatNoSecondNoRow(timestamp) {
  if (timestamp != null) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '';
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1 + '');
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    let strDate = Y + '' + M + '' + D + '' + h + '' + m;

    return strDate;
  }
}



export function formatNoSecondAndMinutes(timestamp) {
  if (timestamp != null) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '';
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1 + '');
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    let strDate = Y + M + D + h;

    return strDate;
  }
}

export function formatYearMonth(timestamp) {
  if (timestamp != null) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '';
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1 + '')

    let strDate = Y + M;

    return strDate;
  }
}