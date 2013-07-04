# 
#  script.coffee
#  ملف التحكم العام بالبرنامج
#  
#  Created by علي محمد علي آل براك on 2013-06-28.
#  Copyright 2013 علي محمد علي آل براك. All rights reserved.
# 
"use strict"


gui       = require('nw.gui')
fs        = require('fs')
youtubedl = require('./assets/js/youtube-dl.js')
home      = process.env.HOME
lastbar   = dl = null
$console  = $('#console')
$showMore = $('#show-more')


@mainWin   = gui.Window.get()


@mainWin.on 'close', () ->
  window.dragWin?.close()
  
  this.close(true)

      
  
  


consoleLog = (data, dir="ltr") ->
  p  = "<p class=\"#{dir}\">"
  ep = '</p>'
      
  $console.append("#{p}#{data}#{ep}")
  .scrollTop $console[0].scrollHeight


alertBox = (title, text, type) ->
  $('.tmpalert').clone()
  .removeClass("tmpalert")
  .addClass("alert-#{type}")
  .append("<b>#{title}: </b> #{text}")
  .appendTo($ '#log')
  .slideDown()

progressBar = (name) ->
  $('.tmpprogress').clone()
  .removeClass('tmpprogress')
  .appendTo($ '#log')
  .slideDown()
  .children('.bar')
  .append("<b>#{name}</b>")



$(document).ready () ->
  $('#path-text').val home

  $('#path').change () ->
    $('#path-text').val $(@).val()? || $('#path-text').val()? || home
    
  .prop('nwworkingdir', home)
  
  $('#path-btn').click () ->
    $('#path').click()
  
  $(document.body).on 'click', '.close', () ->
    $(@).parent('.alert').slideUp()
  
  
  $('#stop').click () ->
    $('#start').prop 'disabled', false
    $('#stop').prop 'disabled', true
    
    lastbar?.addClass('bar-danger')
    .parent('.progress').removeClass 'active progress-striped work'
    
    dl?.kill()
    if dl? then dl = null
  
  $('#parm').submit (e) ->
    e.preventDefault()
    
    if dl?
      return alert 'هناك عملية تحميل أخرى حاليا'
    
    
    $('#start').prop 'disabled', true
    $('#stop').prop 'disabled', false
    
    
    url  = $('#url').val()
    path = $('#path-text').val() || home
    
    dlFormats = getFormats()
    if $showMore.is('.active') and dlFormats isnt 0
      dl = youtubedl.download(url, path, [
          '-f', dlFormats.join('/')
        ])
    else
      dl = youtubedl.download(url, path)
    
    dl.on 'log',      (d) -> consoleLog d
    dl.on 'palylist', (p) -> alertBox 'بدأ تحميل قائمة التشغيل', "#{p.name}، #{p.length} من الفيديوهات"
    dl.on 'start-vid',(v) -> lastbar = progressBar v.name
    dl.on 'exec-vid', (v) -> alertBox "الفيديو #{v.name} موجود بالفعل", '', 'alert-success'
    dl.on 'download', (v) -> 
      lastbar?.width v.complete
      consoleLog "السرعة: #{v.speed}, الوقت المتبقي: #{v.time}", 'rtl'
    dl.on 'end-vid',  (v) -> 
      lastbar?.width('100%')
      .addClass('bar-success')
      .parent('.progress').removeClass 'active progress-striped work'
    dl.on 'close', (code) ->
      $('#start').prop 'disabled', false
      $('#stop').prop 'disabled', true
      if (!(lastbar?))
        alert 'خطأ مجهول' 
        consoleLog 'حدث خطأ مجهول تواصل معي على <a href="mailto:alaa13212@gmail.com"', 'rtl'
        return true
      
      if (code is 0)
        #alert('تم التحميل بنجاح')
        lastbar.addClass 'bar-success'
        consoleLog 'تم التحميل بنجاح', 'rtl'
      else
        lastbar.addClass 'bar-danger'
        alertBox 'فشل التحميل', 'التحميل توقف بشكل مفاجئ، قد يكون فشل الرجاء التأكد من سلامة الملفات', 'alert-danger'
        consoleLog 'التحميل توقف بشكل مفاجئ، قد يكون فشل الرجاء التأكد من سلامة الملفات', 'rtl'
      
      lastbar.parent('.progress').removeClass 'active progress-striped work'
  
  
  $('#test').click (e) ->
    if window.dragWin?
      window.dragWin.close()
    else
      window.dragWin = gui.Window.open 'drag.html',
        {
          toolbar: false
          width: 60
          height: 50
          frame: false
          "always-on-top": true
          show_in_taskbar: false
          x: 0
          y: 130
        }
      
      window.dragWin.on 'closed', () ->
        window.dragWin = null
      
      window.dragWin.on 'loaded', ->
        dragWin.window.mainWin = window.mainWin
      
      window.mainWin.hide()
  