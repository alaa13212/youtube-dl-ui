$(document).ready ->
  $showMore = $ '#show-more'
  $more     = $ '.more'
  $showMore.on 'click', (e) ->
    $this = $ @
    $this.toggleClass 'active'    
    $more.slideToggle 700

$format = $ '#format'
$size   = $ '#size'

numbers = 
  'webm':
    '1080p': [46]
    '720p': [45]
    '480p': [44]
    '360p': [43]
  'mp4':
    '3072p': [38]
    '1080p': [37]
    '720p': [22]
    '360p': [18]
    '240p': [18] # 270p
  'flv':
    '720p': [120]
    '480p': [35]
    '360p': [34]
    '240p': [6, 5] # 270p, 240p
  '3gp':
    '240p': [36]
    '144p': [17, 13]

@getFormats = ->
  formats = for f in $format.children('.active')
    $(f).data 'format'
  sizes  = for s in $size.children('.active')
    $(s).data 'size'
  
  result = []
  
  for f in formats
    for s in sizes
      if numbers[f]?
        if numbers[f][s]?
          result = result.concat numbers[f][s]
      
    
  result.filter (e, i, s) -> e if s.indexOf(e) is i
  
  
