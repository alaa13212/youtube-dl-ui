// Generated by CoffeeScript 1.6.3
(function() {
  var $format, $size, numbers;

  $(document).ready(function() {
    var $more, $showMore;
    $showMore = $('#show-more');
    $more = $('.more');
    return $showMore.on('click', function(e) {
      var $this;
      $this = $(this);
      $this.toggleClass('active');
      return $more.slideToggle(700);
    });
  });

  $format = $('#format');

  $size = $('#size');

  numbers = {
    'webm': {
      '1080p': [46],
      '720p': [45],
      '480p': [44],
      '360p': [43]
    },
    'mp4': {
      '3072p': [38],
      '1080p': [37],
      '720p': [22],
      '360p': [18],
      '240p': [18]
    },
    'flv': {
      '720p': [120],
      '480p': [35],
      '360p': [34],
      '240p': [6, 5]
    },
    '3gp': {
      '240p': [36],
      '144p': [17, 13]
    }
  };

  this.getFormats = function() {
    var f, formats, result, s, sizes, _i, _j, _len, _len1;
    formats = (function() {
      var _i, _len, _ref, _results;
      _ref = $format.children('.active');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push($(f).data('format'));
      }
      return _results;
    })();
    sizes = (function() {
      var _i, _len, _ref, _results;
      _ref = $size.children('.active');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push($(s).data('size'));
      }
      return _results;
    })();
    result = [];
    for (_i = 0, _len = formats.length; _i < _len; _i++) {
      f = formats[_i];
      for (_j = 0, _len1 = sizes.length; _j < _len1; _j++) {
        s = sizes[_j];
        if (numbers[f] != null) {
          if (numbers[f][s] != null) {
            result = result.concat(numbers[f][s]);
          }
        }
      }
    }
    return result.filter(function(e, i, s) {
      if (s.indexOf(e) === i) {
        return e;
      }
    });
  };

}).call(this);
