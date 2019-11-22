/**
 * Created by 69124 on 2017/3/15.
 */
require(["lib/b"], function(b) {
$('input').on('click',function () {
    $('div').html('123456');
    b.showInfo();
    // console.log(a.name);
})
});