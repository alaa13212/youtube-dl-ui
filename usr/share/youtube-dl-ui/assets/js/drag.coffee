gui       = require('nw.gui')
@dragWin  = gui.Window.get()
  


drop = (e)->
  e.preventDefault()
  $(document.body).css 'background-color', '#FFA0A0'
  data = e.dataTransfer
  mw   = window.mainWin.window
  
  if data.files.length isnt 0
    alert 'دعم الملفات قريبا'
  else if (uri = data.getData('text/uri-list')) isnt ''
    window.mainWin.show()
    mw.$('#url').val uri
    mw.$('#parm').submit()
    window.dragWin.close()
  else
    alert 'ﻻ أعرف مالذي أفلت تواصل مع المطور لحل  المشكلة'
      

allowDrop = (e) ->
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  $(document.body).css 'background-color', '#D52626'
  

jQuery.event.props.push "dataTransfer" 


$(document.body).on 
  'dragover': allowDrop
  'drop': drop
  'dragleave': -> $(document.body).css 'background-color', '#D52626'
