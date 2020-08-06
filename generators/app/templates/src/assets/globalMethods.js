// 全局方法
const STORAGE_KEY = 'user'
const STORAGE_CUSTOM_KEY = 'customerInfo'
const STORAGE_CUSTOM_PERM_KEY = 'customerInfo-perm'
export default {
    install: function (Vue) {
        /** 时间格式化
         * @param date 待格式化的 时间字符串 或 Date对象
         * @param fmt {String} 时间格式 如 yyyy-MM-dd
         */
        Object.defineProperty(Vue.prototype, '$date', {
            value: function dateFtt(date, fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz
                if (!date) {
                    return ''
                }
                if (typeof date === 'string') {
                    date = date.replace(/\-/g, '/') //手机端浏览器需将 - 替换为 /
                }
                //兼容字符串模式和时间戳,字符格式如: 2018-08-01
                if (typeof date !== 'object') {
                    date = new Date(date)
                }

                let o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (let k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        });

        Object.defineProperty(Vue.prototype, '$strToDate', {
            value: function (strDate) {
                var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, 
                function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
               return date;
            }
        });

        /**
         * 根据传入日期返回该月第一天和最后一天。
         *
         * @param o 变量 new Date('2020, 3')
         * <ol>
         *    <li>true-是；</li>
         *    <li>false-否。</li>
         * </ol>
         */
        Object.defineProperty(Vue.prototype, '$monthFirstAndLast', {
            value: (now)=>{
                try {
                    let nowMonth = now.getMonth(); //当前月 
                    let nowYear = now.getFullYear(); //当前年 
                    //本月的开始时间
                    let monthStartDate = new Date(nowYear, nowMonth-1, 1); 
                    //本月的结束时间
                    let monthEndDate = new Date(nowYear, nowMonth, 0);
                    let timeStar=Date.parse(monthStartDate);//ms
                    let timeEnd=Date.parse(monthEndDate);//ms
                    return [timeStar, timeEnd]
                } catch (e) {
                    console.error(e.message);
                    return false;
                }
            }
        });

        /**
         * 判断变量是否为数字字符串。
         *
         * @param o 变量
         * @returns {Boolean} 是否为数字字符串：
         * <ol>
         *    <li>true-是；</li>
         *    <li>false-否。</li>
         * </ol>
         */
        Object.defineProperty(Vue.prototype, '$isNumberStr', {
            value: (o) => {
                try {
                    let numReg = /^[0-9]+(\.[0-9]+)?$/;

                    return numReg.test(Vue.prototype.$getString(o));
                } catch (e) {
                    console.error(e.message);

                    return false;
                }
            }
        });

        /**
         * 判断输入的电话号码是否正确。
         *
         * @param o 变量
         * @returns {Boolean} 是否为数字字符串：
         * <ol>
         *    <li>true-是；</li>
         *    <li>false-否。</li>
         * </ol>
         */
        Object.defineProperty(Vue.prototype, '$isPhoneNumStr', {
            value: (o) => {
                try {
                    let numReg = /^1[3-9][0-9]{9}$/;

                    return numReg.test(Vue.prototype.$getString(o));
                } catch (e) {
                    console.error(e.message);

                    return false;
                }
            }
        });

        /**
         * 判断对象是否为空。
         *
         * @param o 对象
         * @returns {Boolean} 是否为空：
         * <ol>
         *    <li>true-为空；</li>
         *    <li>false-不为空。</li>
         * </ol>
         */
        Object.defineProperty(Vue.prototype, '$isNull', {
            value: (o) => {
                try {
                    return ((Object.prototype.toString.call(o) === '[object Undefined]') || (Object.prototype.toString.call(o) === '[object Null]'));
                } catch (e) {
                    console.error(e.message);

                    return true;
                }
            }
        });

        /**
         * 判断对象是否不为空。
         *
         * @param o 对象
         * @returns {Boolean} 是否不为空：
         * <ol>
         *    <li>true-不为空；</li>
         *    <li>false-为空。</li>
         * </ol>
         */
        Object.defineProperty(Vue.prototype, '$isNotNull', {
            value: (o) => {
                return !Vue.prototype.$isNull(o);
            }
        });

        /**
         * 给对象数组排序。
         *
         * @param objArr 对象数组
         * @param sortField 排序字段
         * @param sortBy 排序方式：
         * <ol>
         *    <li>asc-升序；</li>
         *    <li>desc-降序。</li>
         * </ol>
         *
         * @return {Array} 排序后的数组
         */
        Object.defineProperty(Vue.prototype, '$sortObjArray', {
            value: (objArr, sortField, sortBy) => {
                let sortBy1 = Vue.prototype.$getString(sortBy).toLowerCase();

                if (!Vue.prototype.$isArray(objArr)) {
                    return [];
                }

                if (Vue.prototype.$isNull(sortField) || Vue.prototype.$isBlank(sortBy1) || ((sortBy1 !== 'asc') && (sortBy1 !== 'desc'))) {
                    return objArr;
                }

                // 比较器
                let compare = function (o1, o2) {
                    // o1 和 o2 其中一个不为对象，禁止排序
                    if (!Vue.prototype.$isObject(o1) || !Vue.prototype.$isObject(o2)) {
                        return 0;
                    }

                    let v1 = o1[sortField];
                    let v2 = o2[sortField];

                    // v1 和 v2 其中一个为空，禁止排序
                    if (Vue.prototype.$isNull(v1) || Vue.prototype.$isNull(v2)) {
                        return 0;
                    }

                    // 升序
                    if (sortBy === 'asc') {
                        if (v1 > v2) {
                            return 1;
                        } else if (v1 < v2) {
                            return -1;
                        }

                        return 0;

                        // 降序
                    } else if (sortBy === 'desc') {
                        if (v1 > v2) {
                            return -1;
                        } else if (v1 < v2) {
                            return 1;
                        }

                        return 0;
                    }

                    // 什么玩意？
                    return 0;
                };

                return objArr.sort(compare);
            }
        });

        /**
         * 根据 fieldKey 在 field 上从 objArr 中查找对象。
         *
         * @param objArr 对象数组
         * @param field 字段
         * @param fieldValue 字段值，在 objArr 中需要保证它是唯一的才有意义
         * @return {Object} key 对应的对象
         */
        Object.defineProperty(Vue.prototype, '$getObjFromObjArray', {
            value: (objArr, field, fieldValue) => {
                let obj = null;

                if (Vue.prototype.$isArray(objArr) && Vue.prototype.$isNotNull(field)) {
                    for (let i = 0; i < objArr.length; i++) {
                        let e = objArr[i];

                        if (Vue.prototype.$isObject(e) && (e[field] === fieldValue)) {
                            obj = e;

                            // 终止循环
                            break;
                        }
                    }
                }

                return obj;
            }
        });

        /**
         * 根据 value 从 arr 中删除元素。
         *
         * @param arr 基本类型的数组
         * @param value 元素值
         * @return {Array} 被删除的元素
         */
        Object.defineProperty(Vue.prototype, '$deleteInArray', {
            value: (arr, value) => {
                // 被删除的元素
                let delArr = [];

                if (Vue.prototype.$isArray(arr)) {
                    let i = arr.length;

                    // 从后向前遍历，当 i = 0 时为 false
                    while (i) {
                        i--;

                        let e = arr[i];

                        if (e === value) {
                            delArr.push(e);

                            arr.splice(i, 1);
                        }
                    }
                }

                return delArr;
            }
        });

        /**
         * 从 objArr 中删除 field 值为 fieldValue 的对象。
         *
         * @param objArr 对象数组
         * @param field 字段
         * @param fieldValue 字段值
         * @return {Array} 被删除的元素
         */
        Object.defineProperty(Vue.prototype, '$deleteObjInObjArray', {
            value: (objArr, field, fieldValue) => {
                // 被删除的元素
                let delArr = [];

                if (Vue.prototype.$isArray(objArr) && Vue.prototype.$isNotNull(field)) {
                    let i = objArr.length;

                    // 从后向前遍历，当 i = 0 时为 false
                    while (i) {
                        i--;

                        let e = objArr[i];

                        if (Vue.prototype.$isObject(e) && (e[field] === fieldValue)) {
                            delArr.push(e);

                            objArr.splice(i, 1);
                        }
                    }
                }

                return delArr;
            }
        });

        /**
         * 将基本类型的数组转换为 split 拼接的字符串。
         *
         * @param arr 基本类型的数组
         * @param split 分隔符
         * @return {String} split 拼接的字符串
         */
        Object.defineProperty(Vue.prototype, '$parseArrayToStr', {
            value: (arr, split) => {
                let splitStr = '';
                let split1 = Vue.prototype.$getString(split);

                if (Vue.prototype.$isArray(arr)) {
                    splitStr = arr.join(split1);
                }

                return Vue.prototype.$getString(splitStr);
            }
        });

        /**
         * 根据 field 将对象数组转换为 split 拼接的字符串。
         *
         * @param objArr 对象数组
         * @param field 字段
         * @param split 分隔符
         * @return {String} split 拼接的字符串
         */
        Object.defineProperty(Vue.prototype, '$parseObjArrayToStr', {
            value: (objArr, field, split) => {
                let splitStr = '';
                let field1 = Vue.prototype.$getString(field);
                let split1 = Vue.prototype.$getString(split);

                if (Vue.prototype.$isArray(objArr) && Vue.prototype.$isNotBlank(field1)) {
                    for (let i = 0; i < objArr.length; i++) {
                        let e = objArr[i];

                        if (Vue.prototype.$isObject(e)) {
                            let fieldValue = Vue.prototype.$getString(e[field1]);

                            if (Vue.prototype.$isNotBlank(fieldValue)) {
                                splitStr += (fieldValue + split1);
                            }
                        }
                    }

                    if (Vue.prototype.$isNotBlank(splitStr) && Vue.prototype.$isNotBlank(split1)) {
                        splitStr = splitStr.substring(0, (splitStr.length - 1));
                    }
                }

                return Vue.prototype.$getString(splitStr);
            }
        });

        /**
         * JSON 转换为字符串。
         *
         * @param json JSON
         * @return {String} 字符串
         */
        Object.defineProperty(Vue.prototype, '$jsonToStr', {
            value: (json) => {
                let jsonStr = '';

                if (Vue.prototype.$isNotNull(json)) {
                    jsonStr = JSON.stringify(json);
                }

                return jsonStr;
            }
        });

        /**
         * 字符串转换为 JSON。
         * @param str 字符串
         * @return {Object} JSON
         */
        Object.defineProperty(Vue.prototype, '$strToJson', {
            value: (str) => {
                let json = null;

                let str1 = Vue.prototype.$getString(str);

                if (Vue.prototype.$isNotBlank(str1)) {
                    json = JSON.parse(str1);
                }

                return json;
            }
        });

        /**
         * 克隆对象。
         * @param obj 对象
         * @return {Object} 新的对象
         */
        Object.defineProperty(Vue.prototype, '$cloneObj', {
            value: (obj) => {
                let cloneObj = {};

                if (Vue.prototype.$isObject(obj)) {
                    for (let key in obj) {
                        cloneObj[key] = obj[key];
                    }
                }

                return cloneObj;
            }
        });

        /**
         * 将基本类型的数组剔除重复的元素。
         * @param arr 基本类型的数组
         * @return {Array} 剔除重复元素后的数组
         */
        Object.defineProperty(Vue.prototype, '$uniqueArray', {
            value: (arr) => {
                let arr1 = [];

                if (Vue.prototype.$isArray(arr)) {
                    for (let i = 0; i < arr.length; i++) {
                        let e = arr[i];
                        let count = 0;

                        for (let j = 0; j < arr1.length; j++) {
                            if (e !== arr1[j]) {
                                count++;
                            }
                        }

                        if (count === arr1.length) {
                            arr1.push(e);
                        }
                    }
                }

                return arr1;
            }
        });

        /**
         * 根据 field 将对象数组剔除重复的元素。
         * @param objArr 对象数组
         * @param field 字段
         * @return {Array} 剔除重复元素后的数组
         */
        Object.defineProperty(Vue.prototype, '$uniqueObjArray', {
            value: (objArr, field) => {
                let objArr1 = [];
                let field1 = Vue.prototype.$getString(field);

                if (Vue.prototype.$isArray(objArr) && Vue.prototype.$isNotBlank(field1)) {
                    for (let i = 0; i < objArr.length; i++) {
                        let e = objArr[i];
                        let count = 0;

                        for (let j = 0; j < objArr1.length; j++) {
                            if (Vue.prototype.$isNull(Vue.prototype.$getObjFromObjArray(objArr1, field1, e[field1]))) {
                                count++;
                            }
                        }

                        if (count === objArr1.length) {
                            objArr1.push(e);
                        }
                    }
                }

                return objArr1;
            }
        });

        /**
         * 根据 obj 深拷贝对象返回新对象。
         * @param obj 对象
         * @return {obj} 新对象
         */
        Object.defineProperty(Vue.prototype, '$objDeepCopy', {
            value: (obj) => {
                if (obj === null) return null
                if (typeof obj !== 'object') return obj;
                if (obj.constructor === Date) return new Date(obj);
                if (obj.constructor === RegExp) return new RegExp(obj);
                var newObj = new obj.constructor(); //保持继承链
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) { //不遍历其原型链上的属性
                        var val = obj[key];
                        newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; // 使用arguments.callee解除与函数名的耦合
                    }
                }
                return newObj;
            }
        });

        /**
         * 判断变量是否为异常。
         *
         * @param o 变量
         * @returns {Boolean} 是否为异常：
         * <ol>
         *    <li>true-是；</li>
         *    <li>false-否。</li>
         * </ol>
         */
        Object.defineProperty(Vue.prototype, '$title', {
            value: (title) => {
                // 先清空，不能删除，否则后果自负！！！
                document.title = '';
                document.title = Vue.prototype.$getString(title);
            }
        });
        //----------[/增加常用方法]----------//

    }
}