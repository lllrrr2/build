

function updateDisplay(editor, sizeOutput, lineColumnOutput) {
    var content = $.trim(editor.getValue());
    if (!content) return;
    var size = content.length;
    sizeOutput.html("Size: " + (size < 1024 ? size + " Bytes" : (size / 1024).toFixed(2) + " KB"));

    var lineNumber = editor.session.getLength(),
        columnNumber = editor.selection.getCursor().column + 1,
        maxColumnCount = 0;
    for (var i = 0; i < lineNumber; i++) {
        maxColumnCount = Math.max(maxColumnCount, editor.session.getLine(i).length);
    }
    lineColumnOutput.html("Ln: " + lineNumber + "; Col: " + columnNumber + "; Max Col: " + maxColumnCount);
}

function addFullScreen(id) {
    $(`#ace${id}.aceEditorBorder`).addClass('fullScreen');
    $(`#${id}FullScreen`).hide();
    $(`#${id}CloseScreen`).show();
    $('.ace_editor').css('height', 'calc(100% - 65px)');
    $('body').css({
        overflow: 'hidden',
        position: 'fixed'
    });
}

function removeFullScreen(id) {
    $(`#ace${id}.aceEditorBorder`).removeClass('fullScreen');
    $(`#${id}FullScreen`).show();
    $(`#${id}CloseScreen`).hide();
    $('.ace_editor').css('height', '60vh');
    $('body').css({
        overflow: '',
        position: ''
    });
}

function setupClipboard(id, buttonId) {
    return new ClipboardJS('#' + buttonId, {
        text: function () {
            var value = id.getValue().trim();
            if (value) return value;
        }
    }).on('success', function (e) {
        if (id) id.execCommand('selectAll');
        showSuccessMessage("已复制");
        e.clearSelection();
    }).on('error', function (e) {
        e.clearSelection();
        if (id.getValue().trim() === '') {
            showErrorMessage('内容为空', true)
        } else showErrorMessage('复制出错' + e.action);
    });
}

function clearValue(id) {
    event.preventDefault();
    if (id) {
        return id.setValue('');
    }
}

function showSuccessMessage(message, a) {
    var backgroundColor = "style='background:" + (a ? 'red' : '#3488ce') + ";'";
    $(".field.success").html('<div class="notification alert-message"' + backgroundColor + '>' + message + '</div>').show().delay(3000).fadeOut();
}

function state(time) {
    $(".field.state").html('<div class="button is-fullwidth alert-message" style="color:black;">用时: ' + timeEnd(time) + 'ms</div>').show().delay(3000).fadeOut();
}

function showErrorMessage(message, a) {
    if (a === undefined) {
        clearTimeout(window.hideTimer);
        $(".columns.is-centered").html('<div class="notification alert-message" style="color:black; border:0px; background:#f8d7da;"><p class="subtitle" style="color:red;">语法错误：</p><p>' + message + '</p><button class="is-medium delete"></button></div>').fadeIn();
        $(".delete").on("click", function (event) {
            event.preventDefault();
            $(".columns.is-centered").fadeOut();
        });
        var mouseEntered = false;
        $(".columns.is-centered").on({
            mouseenter: function () {
                mouseEntered = true;
                if (window.hideTimer) clearTimeout(window.hideTimer);
            },
            mouseleave: function () {
                window.hideTimer = setTimeout(function () {
                    if (!mouseEntered) $(".columns.is-centered").fadeOut();
                }, 5000);
            }
        }).trigger('mouseleave');
    } else {
        showSuccessMessage(message, true);
    }
}
