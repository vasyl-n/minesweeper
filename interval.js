export function AdjustingInterval(workFunc, interval, errorFunc) {
  var that = this;
  var expected, timeout;
  this.interval = interval;

  this.start = function() {
      expected = Date.now() + this.interval;
      timeout = setTimeout(step, this.interval);
  }

  this.stop = function() {
      clearTimeout(timeout);
  }

  function step() {
      var drift = Date.now() - expected;
      if (drift > that.interval) {
          if (errorFunc) errorFunc();
      }
      workFunc();
      expected += that.interval;
      timeout = setTimeout(step, Math.max(0, that.interval-drift));
  }
}

export default AdjustingInterval;