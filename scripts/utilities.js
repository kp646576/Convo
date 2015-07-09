/*------------------------------------------------------------------------------
 Utility Functions & Controls
------------------------------------------------------------------------------*/
var timeStamp = function() {
    var now = new Date();
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    var suffix = ( time[0] < 12 ) ? 'AM' : 'PM';
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
            time[i] = '0' + time[i];
        }
      }
    return date.join('/') + ' ' + time.join(':') + ' ' + suffix;
}

var clearError = function() {
  $('div.error').text('');
}

var scrollUp = function() {
  $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
};

// Pressing enter submits text
$('#btn-input').keypress(function (e) {
      var code = e.keyCode || e.which;
      if (code === 13) {
          $('#send-msg-btn').click();
          $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
      };
});
