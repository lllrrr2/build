
function getExampleCsv() {
    return 'id,name,amount,Remark\n1,"Johnson, Smith, and Jones Co.",345.33,Pays on time\n2,"Sam ""Mad Dog"" Smith",993.44,\n3,"Barney & Company",0,"Great to work with\nand always pays with cash."\n4,Johnson\'s Automotive,2344,\n'
}

function getExampleXml(e) {
    e = (e || 1) - 1;
    return '<?xml version="1.0"?>\n<ROWSET>\n<ROW>\n<id>1</id>\n<name>Johnson, Smith, and Jones Co.</name>\n<amount>345.33</amount>\n<Remark>Pays on time</Remark>\n</ROW>\n<ROW>\n<id>2</id>\n<name>Sam &quot;Mad Dog&quot; Smith</name>\n<amount>993.44</amount>\n<Remark></Remark>\n</ROW>\n<ROW>\n<id>3</id>\n<name>Barney &amp; Company</name>\n<amount>0</amount>\n<Remark>Great to work with\nand always pays with cash.</Remark>\n</ROW>\n<ROW>\n<id>4</id>\n<name>Johnson&apos;s Automotive</name>\n<amount>2344</amount>\n<Remark></Remark>\n</ROW>\n</ROWSET>'
}

function getExampleYaml() {
    var output = '-\n  id: 1\n  name: John Doe\n  age: 30\n  email: johndoe@example.com\n  hobbies:\n    -\n      name: Reading\n      duration: 5\n    -\n      name: Cooking\n      duration: 3\n-\n  id: 2\n  name: Jane Smith\n  age: 25\n  email: janesmith@example.com\n  hobbies:\n    -\n      name: Painting\n      duration: 7\n    -\n      name: Hiking\n      duration: 4\n-\n  id: 3\n  name: Bob Johnson\n  age: 40\n  email: bobjohnson@example.com\n  hobbies:\n    -\n      name: Photography\n      duration: 6\n    -\n      name: Dancing\n      duration: 2\n';
    $.getScript("https://cdn.bootcdn.net/ajax/libs/ace/1.24.2/mode-yaml.js", function () {
        editor1.getSession().setMode("ace/mode/yaml");
        editor1.setValue(output);
    });
}

function getExampleJavaScript() {
    var output = 'var name = "John";\nconsole.log("Hello, " + name + "!");\n\nvar numbers = [1, 2, 3, 4, 5];\nfor (var i = 0; i < numbers.length; i++) {\n    console.log(numbers[i]);\n}\n\nvar person = {\n    name: "John",\n    age: 30,\n    city: "New York"\n};\nconsole.log(person.name);\n';
    $.getScript("https://cdn.bootcdn.net/ajax/libs/ace/1.24.2/mode-javascript.js", function () {
        editor1.getSession().setMode("ace/mode/javascript");
        editor1.setValue(output);
    });
}

function getExampleCSS() {
    var output = 'body {background-color: #e9ecef;font-family: Arial, sans-serif;}h1 {color: #333;font-size: 24px;}.container {width: 800px;margin: 0 auto;padding: 20px;}@media(min-width: 768px) {.container-md,.container-sm, .container {max-width: 720px;}}';
    $.getScript("https://cdn.bootcdn.net/ajax/libs/ace/1.24.2/mode-css.js", function () {
        editor1.getSession().setMode("ace/mode/css");
        editor1.setValue(output);
    });
}

function getExampleHTML() {
    var output = '<!DOCTYPE html>\n<html><head>\n    <title>Sample Page</title>\n    <link rel="stylesheet" type="text/css" href="styles.css">\n</head>\n<body>\n    <header>\n        <h1>Welcome to My Website</h1>\n    </header>\n    <div class="container">\n        <p>This is a sample paragraph.</p>\n   <a href="#">Click here</a>\n    </div>\n    <script src="scripts.js"></script></body>\n</html>\n';
    $.getScript("https://cdn.bootcdn.net/ajax/libs/ace/1.24.2/mode-html.js", function () {
        editor1.getSession().setMode("ace/mode/html");
        editor1.setValue(output);
    });
}

function getExampleJson(e) {
    var output = ['[\n  {\n    "id":1,    "name":"Johnson, Smith, and Jones Co.",\n    "amount":345.33,    "Remark":"Pays on time"\n  },\n  {\n    "id":2,    "name":"Sam \\"Mad Dog\\" Smith",\n    "amount":993.44,    "Remark":""\n  },\n  {\n    "id":3,    "name":"Barney & Company",\n    "amount":0,    "Remark":"Great to work with\\nand always pays with cash."\n  },\n  {\n    "id":4,    "name":"Johnson\'s Automotive",\n    "amount":2344,    "Remark":""\n  }\n]\n', '{ "data" : [\n  {    "id":1,    "name":"Johnson, Smith, and Jones Co."  },\n  {    "id":2,    "name":"Sam \\"Mad Dog\\" Smith"  },\n  {    "id":3,    "name":"Barney & Company"  },\n  {    "id":4,    "name":"Johnson\'s Automotive"  }\n] }\n', '{ "race" : \n { "entries" : [\n  {    "id":11,    "name":"Johnson, Smith, and Jones Co."  },\n  {    "id":22,    "name":"Sam \\"Mad Dog\\" Smith"  },\n  {    "id":33,    "name":"Barney & Company"  },\n  {    "id":44,    "name":"Johnson\'s Automotive"  }\n] }\n}\n', '{\n    "id":1,    "name":"Johnson, Smith, and Jones Co.",    "amount":345.33,    "Remark":"Pays on time"\n}\n', '[\n    [      1,      "Johnson, Smith, and Jones Co.",      345.33    ],\n    [      99,      "Acme Food Inc.",      2993.55    ]\n]'][e = (e || 1) - 1];
    $.getScript("https://cdn.bootcdn.net/ajax/libs/ace/1.24.2/mode-hjson.js", function () {
        editor1.getSession().setMode("ace/mode/json");
        editor1.setValue(output);
    });
}

function showSuccessMessage(message) {
    $("#warning").html('<div class="alert alert-success">' + message + '</div>').show().delay(3000).fadeOut();
}

function showErrorMessage(message) {
    clearTimeout(window.hideTimer);
    $("#warning").html('<div class="alert alert-danger" style="position: relative;"><button id="customButton" type="button" style="position: absolute; top: 5px; right: 5px; font-size: 24px;">&#x2716</button>' + message + '</div>').fadeIn();
    $("#customButton").on("click", function () {
        $("#warning").fadeOut();
    });
    var mouseEntered = false;
    $("#warning").on({
        mouseenter: function () {
            mouseEntered = true;
            if (window.hideTimer) {
                clearTimeout(window.hideTimer);
            }
        },
        mouseleave: function () {
            window.hideTimer = setTimeout(function () {
                if (!mouseEntered) {
                    $("#warning").fadeOut();
                }
            }, 5000);
        }
    }).trigger('mouseleave');
}

var loadedScripts = [];
function loadScripts(scripts) {
    var promises = scripts.map(function (script) {
        if (loadedScripts.indexOf(script) === -1) {
            return new Promise(function (resolve, reject) {
                $.getScript(script)
                    .done(function () {
                        loadedScripts.push(script);
                        resolve();
                    })
                    .fail(reject);
            });
        } else {
            return Promise.resolve();
        }
    });
    return Promise.all(promises);
}

function clearAll() {
    if (editor1 && editor2) {
        editor1.setValue('');
        editor2.setValue('');
    }
}

function cleanInputEditor() {
    return editor1.setValue('');
}

function cleanOutputEditor() {
    return editor2.setValue('');
}

function calculateTabSize() {
    var parsedValue = parseInt($('#tabsize').val(), 10);
    if (parsedValue === 1) parsedValue = '\t';
    return parsedValue;
}

function changeToFileContent(input) {
    var file = input.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (event) {
            if (editor1) editor1.setValue(event.target.result);
        };
        input.value = "";
    }
}

function getErrorMessage(code) {
    var errorCode = {
        // JSHint options
        E001: "不好的 {a} 选项: '{b}'。",
        E002: "不好的选项值。",
        // JSHint input
        E003: "预期为 JSON 值。",
        E004: "输入既不是字符串，也不是字符串数组。",
        E005: "输入为空。",
        E006: "意外的程序提前结束。",
        // 严格模式
        E007: "缺少 \"use strict\" 声明。",
        E008: "严格模式违例。",
        E009: "全局范围内不能使用 'validthis' 选项。",
        E010: "在严格模式下不允许使用 'with'。",
        // 常量
        E011: "'{a}' 已经被声明。",
        E012: "常量 '{a}' 缺少初始化器。",
        E013: "试图覆盖常量 '{a}'。",
        // 正则表达式
        E014: "正则表达式文本可能与 '/=' 混淆。",
        E015: "未关闭的正则表达式。",
        E016: "无效的正则表达式。",
        // 标记
        E017: "未闭合的注释。",
        E018: "未开始的注释。",
        E019: "不匹配的 '{a}'。",
        E020: "期望 '{a}' 与行 {c} 的 '{b}' 匹配，但实际看到了 '{d}'。",
        E021: "期望 '{a}'，实际看到了 '{b}'。",
        E022: "换行错误 '{a}'。",
        E023: "缺少 '{a}'。",
        E024: "意外的 '{a}'。",
        E025: "在 case 子句上缺少 ':'。",
        E026: "缺少 '}' 来匹配行 {a} 的 '{'。",
        E027: "缺少 ']' 来匹配行 {a} 的 '['。",
        E028: "非法逗号。",
        E029: "未闭合的字符串。",
        // 其他
        E030: "期望标识符，实际看到了 '{a}'。",
        E031: "错误的赋值。",
        E032: "期望小整数或 'false'，实际看到了 '{a}'。",
        E033: "期望操作符，实际看到了 '{a}'。",
        E034: "get/set 是 ES5 特性。",
        E035: "缺少属性名。",
        E036: "预期看到语句，实际看到了代码块。",
        E037: null,
        E038: null,
        E039: "函数声明不可调用。请用括号包裹整个函数调用。",
        E040: "每个值应该有自己的 case 标签。",
        E041: "不可恢复的语法错误。",
        E042: "停止。",
        E043: "错误太多。",
        E044: null,
        E045: "无效的 for each 循环。",
        E046: "yield 表达式只能出现在生成器函数中。",
        E047: null,
        E048: "{a} 声明不直接在块内部。",
        E049: "不可以将 {a} 命名为 '{b}'。",
        E050: "Mozilla 要求在此处为 yield 表达式加上括号。",
        E051: null,
        E052: "未闭合的模板字面量。",
        E053: "{a} 声明仅允许在模块范围的顶层。",
        E054: "类属性必须是方法。期望 '('，但实际看到 '{a}'。",
        E055: "'{a}' 选项不可在任何可执行代码之后设置。",
        E056: "'{a}' 在声明前被使用，对于 '{b}' 变量是非法的。",
        E057: "无效的元属性: '{a}.{b}'。",
        E058: "缺少分号。",
        E059: "'instanceof' 的第二个操作数不能是不可调用的值。",
        E060: "'yield' 表达式的位置无效（考虑用括号包裹起来）。",
        E061: "Rest 参数不支持默认值。",
        E062: "super 属性只能在方法体内部使用。",
        E063: "super 调用只能在类方法体内部使用。",
        E064: "在非严格模式下定义的具有非简单参数列表的函数可能不启用严格模式。",
        E065: "异步迭代仅适用于 for-of 循环。",
        E066: "格式错误的数字字面量: '{a}'。",
        E067: "小数点前带有前导零在严格模式下不允许。",
        E068: "严格模式下不允许带有前导零的十进制。",
        E069: "重复导出绑定: '{a}'。",
        E070: "import.meta 仅可在模块代码中使用。",
        W001: "'hasOwnProperty' 是一个非常糟糕的名称。",
        W002: "在 IE 8 及更早版本中，'{a}' 的值可能被覆盖。",
        W003: "'{a}' 在定义前被使用。",
        W004: "'{a}' 已经被定义。",
        W005: "数字后面的点可能会被误解为小数点。",
        W006: "令人困惑的负号。",
        W007: "令人困惑的加号。",
        W008: "前导小数点可能会被误解为点号: '{a}'。",
        W009: "首选使用数组文本符号 []。",
        W010: "首选使用对象文本符号 {}。",
        W011: null,
        W012: null,
        W013: null,
        W014: "在 '{a}' 前的误导性换行；读者可能会将其解释为表达式边界。",
        W015: null,
        W016: "意外使用 '{a}'。",
        W017: "错误的操作数。",
        W018: "令人困惑的 '{a}' 使用。",
        W019: "使用 isNaN 函数与 NaN 进行比较。",
        W020: "只读。",
        W021: "重新赋值 '{a}'，它是一个 {b}。使用 'var' 或 'let' 声明可能会变化的绑定。",
        W022: "不要对异常参数进行赋值。",
        W023: null,
        W024: "期望标识符，实际看到了 '{a}'（保留字）。",
        W025: "函数声明缺少名称。",
        W026: "内部函数应该列在外部函数的顶部。",
        W027: "在 '{b}' 之后的 '{a}' 不可达。",
        W028: "{b} 语句上的标签 '{a}'。",
        W030: "期望赋值或函数调用，实际看到的是表达式。",
        W031: "不要为副作用而使用 'new'。",
        W032: "不必要的分号。",
        W033: "缺少分号。",
        W034: "不需要的指示符 \"{a}\"。",
        W035: "空块。",
        W036: "意外的 /*member '{a}'。",
        W037: "'{a}' 是一个语句标签。",
        W038: "'{a}' 超出作用域。",
        W039: null,
        W040: "如果以函数调用的形式执行严格模式函数，其 'this' 值将为 undefined。",
        W041: null,
        W042: "避免 EOL 转义。",
        W043: "EOL 转义错误。如有需要，请使用 multistr 选项。",
        W044: "错误或不必要的转义。",
        W045: "由数字字面量描述的值不能准确表示为数值: '{a}'。",
        W046: "不要使用额外的前导零 '{a}'。",
        W047: "尾随小数点可能会被误解为点号: '{a}'。",
        W048: "正则表达式中出现了意外的控制字符。",
        W049: "正则表达式中出现了意外的转义字符 '{a}'。",
        W050: "JavaScript URL。",
        W051: "不应该删除变量。",
        W052: "意外的 '{a}'。",
        W053: "不要将 {a} 用作构造函数。",
        W054: "Function 构造函数是 eval 的一种形式。",
        W055: "构造函数名称应该以大写字母开头。",
        W056: "错误的构造函数。",
        W057: "奇怪的构造方式。是否必须使用 'new'？",
        W058: "缺少 '()' 调用构造函数。",
        W059: "避免 arguments.{a}。",
        W060: "document.write 可能是一种形式的 eval。",
        W061: "eval 可能具有危害性。",
        W062: "将立即函数调用用括号包裹起来，以帮助读者理解表达式是函数的结果，而不是函数本身。",
        W063: "Math 不是一个函数。",
        W064: "调用构造函数时缺少 'new' 前缀。",
        W065: "缺少基数参数。",
        W066: "隐式的 eval。考虑传递一个函数而不是一个字符串。",
        W067: "不规范的函数调用。",
        W068: "不必要地在非 IIFE 函数文字中使用括号是不必要的。",
        W069: "['{a}'] 最好用点符号表示。",
        W070: "额外的逗号。（这会破坏较旧版本的 IE）",
        W071: "此函数有太多语句。({a})",
        W072: "此函数有太多参数。({a})",
        W073: "嵌套块太深。({a})",
        W074: "此函数的圈复杂度太高。({a})",
        W075: "重复的 {a} '{b}'。",
        W076: "在 get {b} 函数中不应该出现参数 '{a}'。",
        W077: "在 set {a} 函数中期望一个参数。",
        W078: "setter 被定义而没有 getter。",
        W079: "'{a}' 重新定义。",
        W080: "将 '{a}' 初始化为 'undefined' 是不必要的。",
        W081: null,
        W082: "函数声明不应该放在块中。使用函数表达式或将语句移到外部函数的顶部。",
        W083: "在循环中声明的内部函数引用外部作用域的变量可能会导致混乱的语义。({a})",
        W084: "期望条件表达式，实际看到的是赋值。",
        W085: "不要使用 'with'。",
        W086: "在 '{a}' 前期望 'break' 语句。",
        W087: "忘记 'debugger' 语句？",
        W088: "创建全局 'for' 变量。应该是 'for (var {a} ...'。",
        W089: "for in 循环的主体应该被包裹在 if 语句中，以过滤原型链中不需要的属性。",
        W090: "'{a}' 不是一个语句标签。",
        W091: null,
        W093: "你是不是想返回条件表达式，而不是一个赋值？",
        W094: "意外的逗号。",
        W095: "期望字符串，实际看到 {a}。",
        W096: "'{a}' 键可能会产生意外的结果。",
        W097: "使用 \"use strict\" 函数形式。",
        W098: "'{a}' 被定义但从未被使用。",
        W099: null,
        W100: null,
        W101: "行太长。",
        W102: null,
        W103: "'{a}' 属性已废弃。",
        W104: "'{a}' 在 ES{b} 中可用（使用 'esversion: {b}'）或 Mozilla JS 扩展（使用 moz）。",
        W105: null,
        W106: "标识符 '{a}' 不符合驼峰命名规则。",
        W107: "脚本 URL。",
        W108: "字符串必须使用双引号。",
        W109: "字符串必须使用单引号。",
        W110: "混合使用双引号和单引号。",
        W112: "未闭合的字符串。",
        W113: "字符串中包含控制字符: {a}。",
        W114: "避免 {a}。",
        W115: "严格模式下不允许八进制字面量。",
        W116: "期望 '{a}'，实际看到 '{b}'。",
        W117: "'{a}' 未定义。",
        W118: "'{a}' 仅在 Mozilla JavaScript 扩展中可用（使用 moz 选项）。",
        W119: "'{a}' 仅在 ES{b} 中可用（使用 'esversion: {b}'）。",
        W120: "你可能泄露了一个变量 ({a})。",
        W121: null,
        W122: "无效的 typeof 值 '{a}'。",
        W123: "'{a}' 已经在外部作用域中定义。",
        W124: "生成器函数应包含至少一个 yield 表达式。",
        W125: "此行包含不间断空格：http://jshint.com/docs/options/#nonbsp",
        W126: "不必要的分组运算符。",
        W127: "意外使用了逗号操作符。",
        W128: "空数组元素需要 elision=true。",
        W129: "'{a}' 在 JavaScript 将来的版本中被定义。为避免迁移问题，请使用其他变量名。",
        W130: "rest 元素后面的元素无效。",
        W131: "rest 参数后面的参数无效。",
        W132: "禁止使用 'var' 声明。请使用 'let' 或 'const'。",
        W133: "无效的 for-{a} 循环左侧: {b}。",
        W134: "'{a}' 选项仅在检查 ECMAScript {b} 代码时才可用。",
        W135: "{a} 可能不被非浏览器环境支持。",
        W136: "'{a}' 必须在函数范围内。",
        W137: "空解构：这是不必要的，可以删除。",
        W138: "默认参数之后不应该有常规参数。",
        W139: "不应将函数表达式用作 instanceof 的第二个操作数。",
        W140: "缺少逗号。",
        W141: "空 {a}：这是不必要的，可以被移除。",
        W142: "空 {a}：考虑替换为 `import '{b}';`。",
        W143: "对映射的参数对象的属性进行赋值可能导致形式参数的意外更改。",
        W144: "'{a}' 是一个非标准的语言特性。请使用 '{b}' 不稳定选项启用它。",
        W145: "多余的 'case' 子句。",
        W146: "不必要的 `await` 表达式。",
        W147: "正则表达式应包括 'u' 标志。",
        I001: "通过 'laxcomma' 选项可以关闭逗号警告。",
        I002: null,
        I003: "ES5 选项现在默认设置。",
    };
    if (errorCode[code]) {
        return errorCode[code];
    } else if (errorCode[code] === null) {
        return "为'null";
    } else {
        return "未知错误。";
    }
}

function toggleFullScreen(editor) {
    if (screenfull.isEnabled) {
        screenfull.toggle(editor);
    }
}
