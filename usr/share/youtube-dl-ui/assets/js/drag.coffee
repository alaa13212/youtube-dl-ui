gui       = require('nw.gui')
@dragWin  = gui.Window.get()
  
uriReg    = /https?:\/\/\S+/g

download = (uri) ->
  mw = window.mainWin.window
  window.mainWin.show()
  mw.$('#url').val uri
  mw.$('#parm').submit()
  window.dragWin.close()

getUriFromFile = (files, callback, i=0, result='') ->
  if file = files[i]
    if file.type.match /text.*/
      reader = new FileReader()
      reader.onload = ((files, callback, i, result)->
        (e) -> 
          result += e.target.result.match(uriReg).join ' '
          getUriFromFile files, callback, ++i, result + ' '
      )(files, callback, i, result)
      reader.readAsText file
    else getUriFromFile files, callback, ++i, result
  else
    callback result

drop = (e)->
  e.preventDefault()
  $(document.body).css 'background-color', '#FFA0A0'
  data = e.dataTransfer
  
  if data.files.length isnt 0
    getUriFromFile data.files, download
  else if (uri = data.getData('text/uri-list')) isnt ''
    download uri
  else if (uri = data.getData('text/plain').match(uriReg)).length isnt 0
    window.mainWin.show()
    download uri .join ' '
  else
    alert 'ﻻ أعرف مالذي أفلت تواصل مع المطور لحل  المشكلة'
      

allowDrop = (e) ->
  e.preventDefault()
  # e.dataTransfer.dropEffect = 'all'
  $(document.body).css 'background-color', '#D52626'
  

jQuery.event.props.push "dataTransfer" 


$(document.body).on 
  'dragover': allowDrop
  'drop': drop
  'dragleave': -> $(document.body).css 'background-color', '#D52626'
