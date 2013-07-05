#
#  youtube-dl.coffee
#  ملف سكربت التحميل
#  
#  Created by Ali Mohammed Al-brrak on 2013-06-22.
#  Copyright 2013 Ali Mohammed Al-brrak. All rights reserved.
#

"use strict";

spawn = require('child_process').spawn

EventEmitter = require('events').EventEmitter;

plName  = /\[youtube:playlist\] playlist '(.*)': Collected (\d*) video ids/i
vidNmae = /Destination: (.*)/
vidExec = /\[download\] (.*) has already been downloaded/
vidInfo = /(\d+\.\d%) of (\d+\.\d+\w+) at\s+([^\s]+) ETA ((\d|-)+:(\d|-)+)/

class Process 
  constructor: (@process, @stream) ->
    @process.stream = @process.stdout.stream = @process.stderr.stream = @stream
  
  on: (type, callback) ->
    @stream.on(type, callback)
  
  kill: ->
    @process.kill()
  
  stop: ->
    @process.kill('SIGSTOP')
  
  cont: ->
    @process.kill('SIGCONT')


module.exports.download = (url, dest=process.cwd(), args=[]) ->
  dargs = ['-t'];
  for arg in args
    if dargs.indexOf(arg) is -1 then dargs.push arg
  dargs = dargs.concat(url.split(' '))
  process = spawn( 'youtube-dl', dargs, {cwd: dest} )
  download = new Process(process, new EventEmitter())
  download.process.stdout.setEncoding 'utf8'
  download.process.stdout.on 'data', getInfo
  download.process.stderr.setEncoding 'utf8'
  download.process.stderr.on 'data', (err) -> @stream.emit 'stderror', err
  download.process.on 'exit', (code) -> @stream.emit 'close', code
  
  
  return download

module.exports.formats =  (url) ->
  process = spawn 'youtube-dl', [ '-F', url ]
  
  formats = new Process(process, new EventEmitter())
  
  formats.process.stdout.setEncoding 'utf8'
  formats.process.stdout.on 'data', getFormats
  formats.process.on 'exit', (code) -> @stream.emit 'close', code
  
  
  return formats


getInfo = (data) ->
  switch
    when plName.test data
      pl = plName.exec(data)[1..2]
      @stream.emit 'palylist', {name: pl[0], length: pl[1]}
      
    when vidNmae.test data
      vid = vidNmae.exec(data)[1]
      @stream.emit 'start-vid', {name: vid}
      
    when vidExec.test data
      vid = vidExec.exec(data)[1]
      @stream.emit 'exec-vid', {name: vid}
      
    when vidInfo.test data
      vid = vidInfo.exec(data)[1..4]
      if 100 is parseInt(vid[0])
        return @stream.emit 'end-vid'
      @stream.emit 'download', {complete: vid[0], size: vid[1], speed: vid[2], time: vid[3]}
      
    else
      @stream.emit 'log', data
    
  
  return;

getFormats = (data) ->
  if /Available formats:/ .test data
    formats = data . match /\d+\t:\t[a-z0-9]+\t\[\d+x\d+\]/g
      
    formats = for format in formats
      /(\d+)\t:\t([a-z0-9]+)\t\[(\d+x\d+)\]/ . exec((format))[1..3]
      
    @stream.emit 'formats', formats
  
  @stream.emit 'log', data