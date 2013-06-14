//
//  script.js
//  ملف التحكم العام بالبرنامج
//
//  youtube-dl-ui
//  
//  Created by Ali Mohammed Al-brrak on 2013-06-13.
//  Copyright 2013 Ali Mohammed Al-brrak. All rights reserved.
// 



"use strict";

var gui   = require('nw.gui'),
    fs    = require('fs'),
    spawn = require('child_process').spawn,
    home  = process.env.HOME,
    dl, lastbar, url, path;

$(document).ready(function (){
	

	$('#parm').submit(function(e) {
		e.preventDefault();
		
		$('#start').prop('disabled', true);
		$('#stop').prop('disabled', false);
		
		url  = $('#url').val();
		path = $('#path-text').val() || home;
		dl   = spawn('youtube-dl', ['-t', url], { cwd : path }); 

		dl.stdout.on('data', function(data) {
			data = data.toString();
			if ( /PL / .test(data) ) {
				
				$('.tmpalert').clone()
					.removeClass('tmpalert')
					.append('<b>بدأ تحميل قائمة التشغيل:</b> ' + data.replace(/.*PL (.*):.*/, '$1') )
					.appendTo($('#log'))
					.slideDown();
					
					consoleLog(data);
					
			} else if ( /has already been downloaded/ .test(data) ) {
				
				$('.tmpalert').clone()
					.removeClass('tmpalert').addClass('alert-success')
					.append('<b>مقطع الفيديو:</b> ' + data.replace(/has already been downloaded| |\[download\]/gi, '') + 'محمل بالفعل')
					.appendTo($('#log'))
					.slideDown();
					
					consoleLog(data);
					
			} else if ( /Destination: / .test(data) ) {
				
				if (typeof lastbar !== 'undefined'){
					if (!lastbar.hasClass('bar-danger')){
						lastbar.addClass('bar-success').
						parent('.progress').removeClass('active progress-striped work');
					}
				}
				
				lastbar = $('.tmpprogress').clone()
					.removeClass('tmpprogress')
					.appendTo($('#log'))
					.slideDown()
					.children('.bar')
					.append('<b>' + data.substr(25) + '</b>');
					
			} else if ( /\d+\.\d%/ .test(data) ) {
				
				lastbar.width(data.match(/\d+\.\d%/)[0]);
				
				var log = 'السرعة: ' + data.replace(/\n|.*at([^s]+\/s).*/g, '$1');
				log    += ' ، الزمن المتبقي: ' + data.match(/\d\d:\d\d|--:--/)[0];
				
				consoleLog(log, 'rtl');
				
			} else {
				consoleLog(data);
			}
			
		});

		dl.stderr.on('data', function(err) {
			if (typeof dl === 'undefined') {
				return true;
			}
			dl.kill('SIGSTOP');
			var ans = confirm('حدث الخطأ التالي:\n' + err + '\nهل تريد الاستمرار');
			
			if (typeof dl === 'undefined') {
				return true;
			}
			
			if (ans){
				dl.kill('SIGCONT');
			} else {
				dl.kill();
			}
			
		});

		dl.on('close', function(code) {
			
			$('#start').prop('disabled', false);
			$('#stop').prop('disabled', true);
			
			if (typeof lastbar === 'undefined'){
				alert('قطع التنزيل');
				consoleLog( 'قطع التنزيل', 'rtl' );
				return true;
			}
			if (code === 0) {
				//alert('تم التحميل بنجاح');
				lastbar.addClass('bar-success');
				consoleLog( 'تم التحميل بنجاح', 'rtl' );
			} else {
				lastbar.addClass('bar-danger');
				alert('التحميل توقف بشكل مفاجئ، قد يكون فشل الرجاء التأكد من سلامة الملفات');
				consoleLog( 'التحميل توقف بشكل مفاجئ، قد يكون فشل الرجاء التأكد من سلامة الملفات', 'rtl' );
			}
			lastbar.parent('.progress').removeClass('active progress-striped work');
		});
	}); 
	
	$('#stop').click(function() {
		$('#start').prop('disabled', false);
		$('#stop').prop('disabled', true);
		
		if (typeof dl !== 'undefined'){
			dl.kill();
		}
	});
	
	
	$(document.body).on( 'click', '.close', function() {
		$(this).parent('.alert').slideUp();
	});
	
	
	$('#path').change(function() {
		$('#path-text').val($(this).val() || $('#path-text').val() || home);
		
	}).prop('nwworkingdir', home);
	
	$('#path-text').val(home);
	
	$('#path-btn').click(function() {
		$('#path').click();
	});
	
	
	function consoleLog(data, dir) {
		dir = (typeof dir === 'undefined')? 'ltr' : dir;
		
		var p  = '<p' + ((dir === 'rtl')? ' class="rtl"':"") + '>',
		    ep = '</p>';
		    
		$('#console').append( p + data + ep ).scrollTop($('#console')[0].scrollHeight);
	}
	
	
});

