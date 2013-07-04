// Generated by CoffeeScript 1.6.3
(function() {
	var allowDrop, drop, gui;

	gui = require('nw.gui');

	this.dragWin = gui.Window.get();

	drop = function(e) {
		var data, mw, uri;
		e.preventDefault();
		$(document.body).css('background-color', '#FFA0A0');
		data = e.dataTransfer;
		mw = window.mainWin.window;
		if (data.files.length !== 0) {
			return alert('دعم الملفات قريبا');
		} else if (( uri = data.getData('text/uri-list')) !== '') {
			window.mainWin.show();
			mw.$('#url').val(uri);
			mw.$('#parm').submit();
			return window.dragWin.close();
		} else {
			return alert('ﻻ أعرف مالذي أفلت تواصل مع المطور لحل  المشكلة');
		}
	};

	allowDrop = function(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		return $(document.body).css('background-color', '#D52626');
	};

	jQuery.event.props.push("dataTransfer");

	$(document.body).on({
		'dragover' : allowDrop,
		'drop' : drop,
		'dragleave' : function() {
			return $(document.body).css('background-color', '#D52626');
		}
	});

}).call(this);
