const topoUtil = {};

//如果需要手动映射type和组件的关系，请在这里配置
topoUtil.viewRegisterMap = {
    triangle: 'view-triangle',
    rect: 'view-rect',
    circular: 'view-circular',
    line: 'view-line',
    'line-arrow': 'view-line-arrow',
    'chart-line': 'view-chart',
    'chart-line-step': 'view-chart',
    'chart-bar': 'view-chart',
    'chart-pie': 'view-chart-pie',
    'chart-gauge': 'view-chart-gauge',
    'chart-water': 'view-chart-water',
    dashed: 'view-dashed',
    map: 'view-map',
};

//优先匹配map，否则将自动匹配
topoUtil.parseViewName = function (component) {
    var viewName = topoUtil.viewRegisterMap[component.type];
    //console.log("viewName :", viewName, component.type);
    if (viewName == undefined) {
        // console.info(
        //   `没有手动配置组件映射，将根据数据的type自动匹配，当前组件类型=${component.type}`
        // );
        viewName = 'view-' + component.type;
    }
    return viewName;
};

topoUtil.parseEchartType = function (component, option) {
    delete option.series[0]['step'];
    delete option.series[0]['smooth'];
    if (component.type == 'chart-line') {
        option.series[0].type = 'line';
        option.series[0]['smooth'] = true;
    } else if (component.type == 'chart-bar') {
        option.series[0].type = 'bar';
    } else if (component.type == 'chart-line-step') {
        option.series[0].type = 'line';
        option.series[0].step = 'start';
    }
};

// 判断两个值大小
topoUtil.judgeSize = function (formula, value1, value2) {
    let isTrue = false;
    if (formula == '大于') {
        if (value1 > value2) {
            isTrue = true;
        }
    } else if (formula == '大于等于') {
        if (value1 >= value2) {
            isTrue = true;
        }
    } else if (formula == '等于') {
        if (value1 == value2) {
            isTrue = true;
        }
    } else if (formula == '小于等于') {
        if (value1 <= value2) {
            isTrue = true;
        }
    } else if (formula == '小于') {
        if (value1 < value2) {
            isTrue = true;
        }
    } else if (formula == '不等于') {
        if (value1 != value2) {
            isTrue = true;
        }
    }
    return isTrue;
};

function add0(m) {
    return m < 10 ? '0' + m : m;
}

// 获取当前时间
topoUtil.getNowTime = function () {
    //年
    let year = new Date().getFullYear();
    //月份是从0月开始获取的，所以要+1;
    let month = new Date().getMonth() + 1;
    //日
    let day = new Date().getDate();
    //时
    let hour = new Date().getHours();
    //分
    let minute = new Date().getMinutes();
    //秒
    let second = new Date().getSeconds();
    return year + '-' + add0(month) + '-' + add0(day) + ' ' + add0(hour) + ':' + add0(minute) + ':' + add0(second);
};

// 获取当前时间前2小时
topoUtil.getTime = function (val) {
    var frontOneHour = new Date(new Date().getTime() - val * 60 * 60 * 1000);
    //年
    let year = frontOneHour.getFullYear();
    //月份是从0月开始获取的，所以要+1;
    let month = frontOneHour.getMonth() + 1;
    //日
    let day = frontOneHour.getDate();
    //时
    let hour = frontOneHour.getHours();
    //分
    let minute = frontOneHour.getMinutes();
    //秒
    let second = frontOneHour.getSeconds();
    return year + '-' + add0(month) + '-' + add0(day) + ' ' + add0(hour) + ':' + add0(minute) + ':' + add0(second);
};

//计算公式计算
topoUtil.checkData = function (formula) {
    // console.log("计算公式",formula);
    let nums = [];
    let input = formula;
    let result = 0;
    const operate1 = ['*', '/'];
    const operate2 = ['+', '-'];
    const operate3 = ['%'];
    const calc1 = (str) => {
        let n = 0;
        for (let i = 0; i < str.length; i++) {
            const element = str[i];
            if (operate1.indexOf(element) != -1 || operate2.indexOf(element) != -1 || operate3.indexOf(element) != -1) {
                if (element == '*') {
                    result = parseFloat(nums[n]) * parseFloat(nums[n + 1]);
                    input = input.replace(nums[n] + '*' + nums[n + 1], '' + result);
                    nums.splice(n, 2, result);
                    n--;
                } else if (element == '/') {
                    result = parseFloat(nums[n]) / parseFloat(nums[n + 1]);
                    input = input.replace(nums[n] + '/' + nums[n + 1], '' + result);
                    nums.splice(n, 2, result);
                    n--;
                }
                n++;
            }
        }
        return result;
    };
    const calc2 = (str) => {
        let n = 0;
        for (let i = 0; i < str.length; i++) {
            const element = str[i];
            if (operate1.indexOf(element) != -1 || operate2.indexOf(element) != -1 || operate3.indexOf(element) != -1) {
                if (element == '+') {
                    result = parseFloat(nums[n]) + parseFloat(nums[n + 1]);
                    input = input.replace(nums[n] + '+' + nums[n + 1], '' + result);
                    nums.splice(n, 2, result);
                    n--;
                } else if (element == '-') {
                    result = parseFloat(nums[n]) - parseFloat(nums[n + 1]);
                    input = input.replace(nums[n] + '-' + nums[n + 1], '' + result);
                    nums.splice(n, 2, result);
                    n--;
                }
                n++;
            }
        }

        return result;
    };
    const calc3 = (str) => {
        let n = 0;
        for (let i = 0; i < str.length; i++) {
            const element = str[i];
            if (operate1.indexOf(element) != -1 || operate2.indexOf(element) != -1 || operate3.indexOf(element) != -1) {
                if (element == '%') {
                    result = parseFloat(nums[n]) % parseFloat(nums[n + 1]);
                    input = input.replace(nums[n] + '%' + nums[n + 1], '' + result);
                    nums.splice(n, 2, result);
                    n--;
                }
                n++;
            }
        }
        return result;
    };

    input.split(/[%*/+-]/).forEach((element) => {
        nums.push(element);
    });
    result = calc3(input);
    result = calc1(input);
    result = calc2(input);

    return result;
};
//计算相隔分钟数
topoUtil.getMinutes = function (date) {
    var date1 = new Date().getTime(); //1637120820767
    var date2 = date.getTime();
    let date3 = Math.floor(date1 - date2);
    let leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000));
    return minutes;
};
//获取样式表
topoUtil.getKeyframes = function (keyframesName) {
    //通过定义的动画函数名来查询函数
    let styleSheet = document.styleSheets; //获取所有样式表
    let animation = {}; //定义一个animation来装获得的值
    for (let i = 0; i < styleSheet.length; i++) {
        //遍历循环获取styleSheet
        try {
            for (let j = 0; j < styleSheet[i].cssRules.length; j++) {
                //遍历循环获取styleSheet[i].cssRules
                //判断样式名字是否为CSSKeyframesRule
                if (styleSheet[i].cssRules[j].constructor.name === 'CSSKeyframesRule') {
                    //再判断此时这个动画函数名是否为传入的值
                    if (styleSheet[i].cssRules[j].name.indexOf(keyframesName) > -1) {
                        //获取此时的cssRules，index，和styleSheet
                        animation.cssRules = styleSheet[i].cssRules[j];
                        animation.index = j;
                        animation.styleSheet = styleSheet[i];
                        return animation; //返回获取的animation
                    }
                }
            }
        } catch (error) {}
    }
};

//数据引擎说明
topoUtil.getEchartExplain = function () {
    return '<p><span style="color: rgb(255, 153, 0);">响应示例</span><span style="color: rgb(0, 102, 204);">-</span><a href="https://www.isqqw.com/" rel="noopener noreferrer" target="_blank" style="background-color: rgb(255, 255, 255); color: rgb(0, 102, 204);">echartData</a></p><p>{</p><p>&nbsp;"msg": "操作成功",</p><p>&nbsp;"code": 200,</p><p>&nbsp;"<span style="color: rgb(0, 102, 204);">data</span>": {</p><p>&nbsp;&nbsp;"<span style="color: rgb(0, 102, 204);">xdata</span>": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],</p><p>&nbsp;&nbsp;"<span style="color: rgb(0, 102, 204);">ydata</span>": [150, 230, 224, 218, 135, 147, 260]</p><p>&nbsp;&nbsp;}</p><p>}</p><p><span style="color: rgb(255, 153, 0);">代码视图</span></p><p>option = {</p><p>&nbsp;xAxis: {</p><p>&nbsp;&nbsp;	type: "category",</p><p>&nbsp;	data: <a href="https://www.isqqw.com/" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 102, 204); background-color: rgb(255, 255, 255);">echartData</a><span style="color: rgb(0, 102, 204);">.data.xdata</span></p><p>&nbsp;},</p><p>&nbsp;yAxis: {</p><p>&nbsp;&nbsp;	type: "value"</p><p>&nbsp;},</p><p>&nbsp;series: [</p><p>&nbsp;&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;	data: <a href="https://www.isqqw.com/" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 102, 204); background-color: rgb(255, 255, 255);">echartData</a><span style="color: rgb(0, 102, 204);">.data.ydata</span>,</p><p>&nbsp;&nbsp;&nbsp;	type: "line"</p><p>&nbsp;&nbsp;}</p><p>&nbsp;]</p><p>};</p>';
};
export default topoUtil;
