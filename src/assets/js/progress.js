
document.addEventListener('scroll', _ => {
    var docElem = document.documentElement;
    var docBody = document.body;
    var docScrollTop = (docBody.scrollTop || docElem.scrollTop);
  
    readPercent = docScrollTop / (docElem.scrollHeight - docElem.clientHeight) * 100;
  
    if (readPercent > 0) {
      progressBar = document.querySelector('#progress-bar');
      progressBar.style.setProperty('--scroll', readPercent + '%');
    } else {
      progressBar.style.setProperty('--scroll', '0%');
    }
  })

  /*
  document.addEventListener('scroll', _ => {
  var docElem = document.documentElement;
  var docBody = document.body;
  var scrollTop = (docBody.scrollTop || docElem.scrollTop);
  var height = docElem.scrollHeight - docElem.clientHeight;

  progress = scrollTop / height * 100;

  if (progress > 0) {
    progressBar = document.querySelector('#progress-bar');
    var bgVal = '';
    bgVal = 'linear-gradient(to right, red ' + progress + '%, transparent 0)';
    progressBar.style.background = bgVal;
  } else {
    var bgVal = 'linear-gradient(to right, red 0%, transparent 0)';
    progressBar.style.background = bgVal;
  }
})
*/