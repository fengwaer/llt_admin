// 获取当前选中的日期时间
this.getSelectedDateTime = function () {
    if (activeDate) {
        return showTime ? activeDate + ' ' + concatTime(selectedHour, selectedMinute) : activeDate;
    }
    return '';
};; (function (undefined) {
    var _global;
    //工具函数
    //配置合并
    function extend(def, opt, override) {
        for (var k in opt) {
            if (opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) {
                def[k] = opt[k]
            }
        }
        return def;
    }
    //日期格式化
    function concatDate(y, m, d) {
        var symbol = '-';
        if (m) {
            m = (m.toString())[1] ? m : '0' + m;
        }
        if (d) {
            d = (d.toString())[1] ? d : '0' + d;
        }

        return y + (m ? symbol + m : '') + (d ? symbol + d : '');
    }
    //时间格式化
    function concatTime(h, m) {
        h = (h.toString())[1] ? h : '0' + h;
        m = (m.toString())[1] ? m : '0' + m;
        return h + ':' + m;
    }
    //日期时间格式化
    function concatDateTime(y, mo, d, h, mi) {
        return concatDate(y, mo, d) + ' ' + concatTime(h, mi);
    }
    //验证时间格式
    function validateTimeFormat(timeStr) {
        var timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
        return timeRegex.test(timeStr);
    }
    //得到时间戳
    function getTimeStamp(d) {

        var date = new Date(d);

        if (isNaN(date.getTime())) {
            console.error(d + ' is invalid date');
            return '';
        }

        return date.getTime();
    }

    //polyfill
    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
    //过滤非日期，格式化日期
    function filterDate(arr) {

        if (!Array.isArray(arr)) {
            return [];
        }

        arr = arr || [];
        var dateArr = [];

        for (var i = 0; i < arr.length; i++) {

            var item = arr[i];
            var date = new Date(item);

            if (isNaN(date.getTime())) {
                console.error(item + ' is invalid date')
            } else {
                var y = date.getFullYear();
                var m = date.getMonth();
                var d = date.getDate();
                var dateStr = concatDate(y, m + 1, d);
                dateArr.push(dateStr);
            }
        }

        return dateArr;
    }


    function Schedule(opt) {
        var def = {
                showTime: false, // 是否显示时间选择器
                defaultTime: null // 默认时间，为null时使用当前时间
            },
            opt = extend(def, opt, true),
            curDate = opt.date ? new Date(opt.date) : new Date(),
            disabledDate = opt.disabledDate ? filterDate(opt.disabledDate) : [],
            selectedDate = opt.selectedDate ? filterDate(opt.selectedDate) : [],
            disabledBefore = opt.disabledBefore ? getTimeStamp(opt.disabledBefore) : '',
            disabledAfter = opt.disabledAfter ? getTimeStamp(opt.disabledAfter) : '',
            showToday = opt.showToday,
            showTime = opt.showTime,
            year = curDate.getFullYear(),
            month = curDate.getMonth(),
            currentYear = curDate.getFullYear(),
            currentMonth = curDate.getMonth(),
            currentDay = curDate.getDate(),
            currentHour = curDate.getHours(),
            currentMinute = curDate.getMinutes(),
            selectedHour = opt.defaultTime ? parseInt(opt.defaultTime.split(':')[0]) : currentHour,
            selectedMinute = opt.defaultTime ? parseInt(opt.defaultTime.split(':')[1]) : currentMinute,
            activeDate = concatDate(year, month + 1, currentDay),
            el = document.querySelector(opt.el) || document.querySelector('body'),
            _this = this;

        var bindEvent = function () {
            el.addEventListener('click', function (e) {
                switch (e.target.id) {
                    case 'nextMonth':
                        _this.nextMonthFun();
                        break;
                    case 'nextYear':
                        _this.nextYearFun();
                        break;
                    case 'prevMonth':
                        _this.prevMonthFun();
                        break;
                    case 'prevYear':
                        _this.prevYearFun();
                        break;
                    case 'todayBtn':
                        _this.renderToday();
                        break;
                    default:
                        break;
                };
                if (e.target.className.indexOf('currentDate') > -1) {
                    activeDate = e.target.title;
                    var result = showTime ? activeDate + ' ' + concatTime(selectedHour, selectedMinute) : activeDate;
                    opt.clickCb && opt.clickCb(result);
                    render();
                }
            }, false);

            // 添加时间输入框的事件监听
            if (showTime) {
                el.addEventListener('input', function (e) {
                    if (e.target.id === 'timeInput') {
                        var value = e.target.value;
                        if (validateTimeFormat(value)) {
                            var timeParts = value.split(':');
                            selectedHour = parseInt(timeParts[0]);
                            selectedMinute = parseInt(timeParts[1]);
                            e.target.style.borderColor = '#ccc';
                        } else if (value.length >= 5) {
                            // 如果输入长度达到5位且格式不对，恢复原值
                            e.target.value = concatTime(selectedHour, selectedMinute);
                            e.target.style.borderColor = '#ff4444';
                            setTimeout(function () {
                                e.target.style.borderColor = '#ccc';
                            }, 1000);
                        }
                    }
                }, false);

                el.addEventListener('keydown', function (e) {
                    if (e.target.id === 'timeInput') {
                        // 只允许数字和冒号
                        var allowedKeys = [8, 9, 37, 38, 39, 40, 46]; // 退格、Tab、方向键、删除
                        var allowedChars = /[0-9:]/;
                        
                        if (!allowedKeys.includes(e.keyCode) && !allowedChars.test(e.key)) {
                            e.preventDefault();
                        }
                    }
                }, false);
            }
        }

        var renderTimeDisplay = function () {
            if (!showTime) return;
            var timeInput = el.querySelector('#timeInput');
            if (timeInput) {
                timeInput.value = concatTime(selectedHour, selectedMinute);
            }
        }

        var init = function () {
            var timeInputHtml = showTime ? '<div class="time-input-wrapper"><input type="text" id="timeInput" class="time-input-simple" placeholder="HH:MM" value="' + concatTime(selectedHour, selectedMinute) + '"></div>' : '';

            var scheduleHd = '<div class="schedule-hd">' +
                '<div>' +
                '<span class="arrow icon iconfont icon-116leftarrowheads" id="prevYear" ></span>' +
                '<span class="arrow icon iconfont icon-112leftarrowhead" id="prevMonth"></span>' +
                '</div>' +
                '<div class="today">' + // 这个today div现在只用于显示月份和年份
                '</div>' +
                '<div>' +
                '<span class="arrow icon iconfont icon-111arrowheadright" id="nextMonth"></span>' +
                '<span class="arrow icon iconfont icon-115rightarrowheads" id="nextYear"></span>' +
                '</div>' +
                timeInputHtml + // 将时间输入框放在schedule-hd的顶层，方便定位
                '</div>'
            var scheduleWeek = '<ul class="week-ul ul-box">' +
                '<li>日</li>' +
                '<li>一</li>' +
                '<li>二</li>' +
                '<li>三</li>' +
                '<li>四</li>' +
                '<li>五</li>' +
                '<li>六</li>' +
                '</ul>'
            var scheduleBd = '<ul class="schedule-bd ul-box" ></ul>';
            var todayBtn = '<div id="todayBtn" class="today-btn-footer">今天</div>'; // 修改id和class以避免冲突

            el.innerHTML = scheduleHd + scheduleWeek + scheduleBd + (showToday ? todayBtn : '');

            // 添加时间输入框的样式
            if (showTime && !document.getElementById('timeInputStyle')) {
                var style = document.createElement('style');
                style.id = 'timeInputStyle';
                style.innerHTML =
                    '.schedule-hd { position: relative; }' + // 确保父容器是相对定位
                    '.time-input-wrapper {' +
                    'position: absolute;' +
                    'top: 50%;' + // 垂直居中
                    'right: 20%;' + 
                    'transform: translateY(-50%);' + // 垂直居中微调
                    'z-index: 1000;' +
                    '}' +
                    '.time-input-simple {' +
                    'width: 60px;' +
                    'height: 24px;' +
                    'border: 1px solid #ccc;' +
                    'border-radius: 4px;' +
                    'text-align: center;' +
                    'font-size: 12px;' +
                    'padding: 2px;' +
                    'background: #fff;' +
                    'box-shadow: 0 2px 4px rgba(0,0,0,0.1);' +
                    '}' +
                    '.time-input-simple:focus {' +
                    'outline: none;' +
                    'border-color: #4CAF50;' +
                    'box-shadow: 0 2px 6px rgba(76,175,80,0.3);' +
                    '}' +
                    '.time-input-simple::placeholder {' +
                    'color: #999;' +
                    'font-size: 11px;' +
                    '}';
                document.head.appendChild(style);
            }

            bindEvent();
            render();
        }

        var render = function () {
            var fullDay = new Date(year, month + 1, 0).getDate(), //当月总天数
                startWeek = new Date(year, month, 1).getDay(), //当月第一天是周几
                total = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7), //元素总个数
                lastMonthDay = new Date(year, month, 0).getDate(), //上月最后一天
                eleTemp = [];
            for (var i = 0; i < total; i++) {

                var nowDate = concatDate(year, month + 1, (i + 1 - startWeek));
                var nowTimestamp = new Date(nowDate).getTime();
                var isDisbale = disabledDate.indexOf(nowDate) > -1;
                var isSelected = selectedDate.indexOf(nowDate) > -1;

                if (i < startWeek) {

                    eleTemp.push('<li class="other-month"><span class="dayStyle">' + (lastMonthDay - startWeek + 1 + i) + '</span></li>')
                } else if (i < (startWeek + fullDay)) {

                    var addClass = '';
                    if (isDisbale) {
                        addClass = 'disabled'
                    } else {
                        isSelected && (addClass = 'selected-style');
                        activeDate == nowDate && (addClass = 'active-style');
                        concatDate(currentYear, currentMonth + 1, currentDay) == nowDate && (addClass = 'today-flag');
                    }

                    if (disabledBefore && nowTimestamp < disabledBefore) {
                        addClass = 'disabled'
                    }
                    if (disabledAfter && nowTimestamp > disabledAfter) {
                        addClass = 'disabled'
                    }

                    eleTemp.push('<li class="current-month" ><span title=' + nowDate + ' class="currentDate dayStyle ' + addClass + '">' + (i + 1 - startWeek) + '</span></li>')
                } else {

                    eleTemp.push('<li class="other-month"><span class="dayStyle">' + (i + 1 - (startWeek + fullDay)) + '</span></li>')
                }
            }
            el.querySelector('.schedule-bd').innerHTML = eleTemp.join('');
            // 只更新显示月份和年份的 .today 元素
            el.querySelector('.schedule-hd .today').innerHTML = concatDate(year, month + 1);

            // 更新时间显示
            if (showTime) {
                renderTimeDisplay();
            }
        };

        // 时间操作方法（保留用于内部使用）
        this.setTime = function (hour, minute) {
            if (hour >= 0 && hour <= 23) selectedHour = hour;
            if (minute >= 0 && minute <= 59) selectedMinute = minute;
            if (showTime) renderTimeDisplay();
        };

        this.nextMonthFun = function () {
            if (month + 1 > 11) {
                year += 1;
                month = 0;
            } else {
                month += 1;
            }
            render();
            opt.nextMonthCb && opt.nextMonthCb(year, month + 1);
        };
        this.nextYearFun = function () {
            year += 1;
            render();
            opt.nextYeayCb && opt.nextYeayCb(year, month + 1);
        };
        this.prevMonthFun = function () {
            if (month - 1 < 0) {
                year -= 1;
                month = 11;
            } else {
                month -= 1;
            }
            render();
            opt.prevMonthCb && opt.prevMonthCb(year, month + 1);
        };
        this.prevYearFun = function () {
            year -= 1;
            render();
            opt.prevYearCb && opt.prevYearCb(year, month + 1);
        }
        this.renderToday = function () {
            if (year === currentYear && month === currentMonth) {
                return;
            }

            year = currentYear;
            month = currentMonth;
            render();
        }
        init();
    }
    //将插件暴露给全局对象
    _global = (function () { return this || (0, eval)('this') }());
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Schedule;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return Schedule;
        })
    } else {
        !('Schedule' in _global) && (_global.Schedule = Schedule);
    }

}());