"use strict";
var pvrBootstrapTable = function () {
    "use strict";
    $('#table').on('expand-row.bs.table', function (e, index, row, $detail) {
        $detail.html(
            '<div class="table-responsive">\n' +
            '<table class="table table-separate table-extended" style="border-bottom: 0">\n' +
            '<tbody>\n' +
            '<tr>\n' +
            '<td class="text-center">\n' +
            '<div class="form-check m-t-8">\n' +
            '<label class="form-check-label">\n' +
            '<input class="form-check-input" type="checkbox">\n' +
            '<span class="form-check-sign"></span>\n' +
            '\n' +
            '</label>\n' +
            '</div>\n' +
            '</td>\n' +
            '<td>\n' +
            '<div class="user_box">\n' +
            '<div class="user-with-avatar">\n' +
            '<img alt="" src="http://via.placeholder.com/128x128">\n' +
            '</div>\n' +
            '<div class="user_email">\n' +
            '<span>\n' +
            'Andrew Heston\n' +
            '</span>\n' +
            '<span class="f-s-11">\n' +
            'andrew.heston@gmail.com\n' +
            '</span>\n' +
            '</div>\n' +
            '</div>\n' +
            '</td>\n' +
            '<td>\n' +
            'Cool Company\n' +
            '</td>\n' +
            '<td>\n' +
            '201\n' +
            '</td>\n' +
            '<td>\n' +
            '022-1254-5215\n' +
            '</td>\n' +
            '<td>\n' +
            '<span class="badge-danger badge">test tag</span>\n' +
            '<span class="badge-purple badge">another tag</span>\n' +
            '<span class="badge-success badge">active</span>\n' +
            '</td>\n' +
            '<td>\n' +
            '22-Oct-2017\n' +
            '</td>\n' +
            '<td class="text-center">\n' +
            '<i class="material-icons align-middle">more_horiz</i>\n' +
            '</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td class="text-center">\n' +
            '<div class="form-check m-t-8">\n' +
            '<label class="form-check-label">\n' +
            '<input class="form-check-input" type="checkbox">\n' +
            '<span class="form-check-sign"></span>\n' +
            '\n' +
            '</label>\n' +
            '</div>\n' +
            '</td>\n' +
            '<td>\n' +
            '<div class="user_box">\n' +
            '<div class="user-with-avatar">\n' +
            '<img alt="" src="http://via.placeholder.com/128x128">\n' +
            '</div>\n' +
            '<div class="user_email">\n' +
            '<span>\n' +
            'Michel Newton\n' +
            '</span>\n' +
            '<span class="f-s-11">\n' +
            'michel.newton@gmail.com\n' +
            '</span>\n' +
            '</div>\n' +
            '</div>\n' +
            '</td>\n' +
            '<td>\n' +
            'Company ABC\n' +
            '</td>\n' +
            '<td>\n' +
            '99\n' +
            '</td>\n' +
            '<td>\n' +
            '1254-022-5215\n' +
            '</td>\n' +
            '<td>\n' +
            '<span class="badge-warning badge">test tag</span>\n' +
            '<span class="badge-danger badge">in-active</span>\n' +
            '</td>\n' +
            '<td>\n' +
            '05-Dec-2017\n' +
            '</td>\n' +
            '<td class="text-center">\n' +
            '<i class="material-icons align-middle">more_horiz</i>\n' +
            '</td>\n' +
            '</tr>\n' +
            '</tbody>\n' +
            '</table>\n' +
            '</div>'
        );
    });

    $($(".detail-icon")[ 0 ]).trigger("click");
    $($(".detail-icon")[ 1 ]).trigger("click");
};
var Table = function () {
    "use strict";
    return {
        init: function () {
            pvrBootstrapTable()
        }
    }
}();
$(function () {
    Table.init();
});