// Generated by CoffeeScript 1.6.3
(function() {"use strict";
	var EventEmitter, Process, getFormats, getInfo, plName, spawn, vidExec, vidInfo, vidNmae;

	spawn = require('child_process').spawn;

	EventEmitter = require('events').EventEmitter;

	plName = /\[youtube:playlist\] playlist '(.*)': Collected (\d*) video ids/i;

	vidNmae = /Destination: (.*)/;

	vidExec = /\[download\] (.*) has already been downloaded/;

	vidInfo = /(\d+\.\d%) of (\d+\.\d+\w+) at\s+([^\s]+) ETA ((\d|-)+:(\d|-)+)/;

	Process = (function() {
		function Process(process, stream) {
			this.process = process;
			this.stream = stream;
			this.process.stdout.stream = this.process.stderr.stream = this.stream;
		}


		Process.prototype.on = function(type, callback) {
			return this.stream.on(type, callback);
		};

		Process.prototype.kill = function() {
			return this.process.kill();
		};

		Process.prototype.stop = function() {
			return this.process.kill('SIGSTOP');
		};

		Process.prototype.cont = function() {
			return this.process.kill('SIGCONT');
		};

		return Process;

	})();

	module.exports.download = function(url, dest, args) {
		var arg, dargs, download, process, _i, _len;
		if (dest == null) {
			dest = process.cwd();
		}
		if (args == null) {
			args = [];
		}
		dargs = ['-t'];
		for ( _i = 0, _len = args.length; _i < _len; _i++) {
			arg = args[_i];
			if (dargs.indexOf(arg) === -1) {
				dargs.push(arg);
			}
		}
		dargs.push(url);
		process = spawn('youtube-dl', dargs, {
			cwd : dest
		});
		download = new Process(process, new EventEmitter());
		download.process.stdout.setEncoding('utf8');
		download.process.stdout.on('data', getInfo);
		download.process.stderr.setEncoding('utf8');
		download.process.stderr.on('data', function(err) {
			return this.stream.emit('stderror', err);
		});
		return download;
	};

	module.exports.formats = function(url) {
		var formats, process;
		process = spawn('youtube-dl', ['-F', url]);
		formats = new Process(process, new EventEmitter());
		formats.process.stdout.setEncoding('utf8');
		formats.process.stdout.on('data', getFormats);
		return formats;
	};

	getInfo = function(data) {
		var pl, vid;
		switch (false) {
			case !plName.test(data):
				pl = plName.exec(data).slice(1, 3);
				this.stream.emit('palylist', {
					name : pl[0],
					length : pl[1]
				});
				break;
			case !vidNmae.test(data):
				vid = vidNmae.exec(data)[1];
				this.stream.emit('start-vid', {
					name : vid
				});
				break;
			case !vidExec.test(data):
				vid = vidExec.exec(data)[1];
				this.stream.emit('exec-vid', {
					name : vid
				});
				break;
			case !vidInfo.test(data):
				vid = vidInfo.exec(data).slice(1, 5);
				if (100 === parseInt(vid[0])) {
					return this.stream.emit('end-vid');
				}
				this.stream.emit('download', {
					complete : vid[0],
					size : vid[1],
					speed : vid[2],
					time : vid[3]
				});
				break;
			default:
				this.stream.emit('log', data);
		}
	};

	getFormats = function(data) {
		var format, formats;
		if (/Available formats:/.test(data)) {
			formats = data.match(/\d+\t:\t[a-z0-9]+\t\[\d+x\d+\]/g);
			formats = (function() {
				var _i, _len, _results;
				_results = [];
				for ( _i = 0, _len = formats.length; _i < _len; _i++) {
					format = formats[_i];
					_results.push(/(\d+)\t:\t([a-z0-9]+)\t\[(\d+x\d+)\]/.exec(format).slice(1, 4));
				}
				return _results;
			})();
			this.stream.emit('formats', formats);
		}
		return this.stream.emit('log', data);
	};

}).call(this);
