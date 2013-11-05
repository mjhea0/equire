// Generated by CoffeeScript 1.6.3
(function() {
  $(function() {
    var clock, socket, timer, waitTimer;
    socket = io.connect('http://localhost');
    socket.on('connect', function() {
      return console.log('hello sockets connected');
    });
    $.get('/found', function(data) {
      var eachIssue, _i, _len;
      console.log(data);
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        eachIssue = data[_i];
        console.log('i', eachIssue['_id']);
        $('#helptable tbody').append('<tr class="issueRow animated flash"><td>' + '<input class="issueComplete" type="checkbox" data-id=' + eachIssue['_id'] + '></td>' + '<td>' + eachIssue['displayName'] + '</td><td class="issueTime" data-time=' + eachIssue['timeStamp'] + '>' + eachIssue['time'] + '</td><td class="waitTime"></td><td>' + eachIssue['issue'] + '</td></tr>');
      }
    });
    $('#now-btn').on('click', 'button', function() {
      var asapObj, displayName, username;
      console.log('click');
      username = $(this).closest('body').find('#user-dropdown a').attr('data-id');
      displayName = $(this).closest('body').find('#user-dropdown a').attr('data-user');
      asapObj = {
        username: username,
        displayName: displayName
      };
      console.log(asapObj);
      socket.emit('asapObj', asapObj);
    });
    $('#help-form').on('submit', function(e) {
      var displayName, issueObj, newIssue, username;
      e.preventDefault();
      newIssue = $('#issue').val();
      username = $(this).closest('body').find('#user-dropdown a').attr('data-id');
      displayName = $(this).closest('body').find('#user-dropdown a').attr('data-user');
      issueObj = {
        newIssue: newIssue,
        username: username,
        displayName: displayName
      };
      socket.emit('issueObj', issueObj);
      $('#issue').val('');
    });
    $('#teacherinput').on('submit', $('#lesson-plan'), function(e) {
      var lessonplan;
      e.preventDefault();
      lessonplan = $(this).find('#lessonplan').val();
      if (lessonplan) {
        $(this).closest('#teacherinput').slideUp();
      } else {
        alert('Please enter a lesson plan');
      }
    });
    socket.on('issue', function(issue) {
      $('#helptable tbody').append('<tr class="issueRow animated flash"><td>' + '<input class="issueComplete" type="checkbox" data-id=' + issue._id + '></td>' + '<td>' + issue.displayName + '</td><td class="issueTime" data-time=' + issue.timeStamp + '>' + issue.time + '</td><td class="waitTime"></td><td>' + issue.issue + '</td></tr>');
    });
    socket.on('asapIssue', function(issue) {
      $('#helptable tbody').append('<tr class="issueRow animated flash"><td>' + '<input class="issueComplete" type="checkbox" data-id=' + issue._id + '></td>' + '<td>' + issue.displayName + '</td><td class="issueTime" data-time=' + issue.timeStamp + '>' + issue.time + '</td><td class="waitTime"></td><td>' + issue.issue + '</td></tr>');
    });
    clock = setInterval(function() {
      return timer();
    }, 1000);
    timer = function() {
      var curr_time;
      curr_time = moment().format('h:mm:ss a');
      $('#teacherclock').text(curr_time);
      $('#studentclock').text(curr_time);
    };
    setInterval(function() {
      return waitTimer();
    }, 1000);
    waitTimer = function() {
      $('.waitTime').each(function() {
        var curr_time, issue_time, issue_time_int, iti;
        curr_time = moment().format('X');
        issue_time = $(this).prev().attr('data-time');
        issue_time_int = parseInt(issue_time);
        iti = +moment(issue_time_int);
        console.log(parseInt(issue_time));
        console.log(moment(issue_time).fromNow());
        $(this).text(moment(issue_time).fromNow());
      });
    };
    $('#helptable').on('click', '.issueComplete', function() {
      var completeObj, curr_time, issueId, issue_time, totalWait;
      console.log('checked');
      curr_time = moment().format('X');
      console.log('ct', curr_time);
      issueId = $(this).attr('data-id');
      issue_time = $(this).closest('.issueRow').find('.issueTime').attr('data-time');
      console.log('it', issue_time);
      totalWait = curr_time - issue_time;
      console.log('tw', totalWait);
      completeObj = {
        issueId: issueId,
        totalWait: totalWait,
        isComplete: true
      };
      console.log('co', completeObj);
      socket.emit('completeObj', completeObj);
      $(this).closest('.issueRow').fadeOut('slow');
    });
  });

}).call(this);
