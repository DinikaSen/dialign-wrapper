'use strict';

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _downloadFile = require('download-file');

var _downloadFile2 = _interopRequireDefault(_downloadFile);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _targz = require('targz');

var _targz2 = _interopRequireDefault(_targz);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var address = 'https://bibiserv.cebitec.uni-bielefeld.de/';
var platform = _os2.default.platform();

function getDialignTool() {
    if (platform == 'darwin') {
        address += 'resources/download/dialign/dialign-2.2.1-universal-osx.dmg.zip';
        downloadDaln(address, platform);
    } else if (platform === 'linux') {
        address += 'applications/dialign/resources/downloads/dialign-2.2.1-src.tar.gz';
        downloadDaln(address, platform);
    } else {
        console.log('Sorry, jsBioTools cannot download Dialign for your operating system');
    }
}

function downloadDaln(url, platform) {
    var src = './bin/';
    if (platform === 'linux') {
        src += 'dialign-2.2.1-src.tar.gz';
    } else if (platform === 'darwin') {
        src += 'dialign-2.2.1-universal-osx.dmg.zip';
    }
    console.log('Downloading Dialign from ', url);
    (0, _downloadFile2.default)(url, { directory: './bin' }, function (err) {
        if (err) {
            console.log('Download failed');
            console.log(err);
        } else {
            console.log('Download complete');
            _targz2.default.decompress({ src: src, dest: './bin/' }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Archive unzipped");
                    if (platform === 'linux') {
                        var execPath = _path2.default.resolve('./bin/dialign_package/src/');
                        makeExecutable(execPath);
                    } else if (platform === 'darwin') {
                        // TODO : install dmg
                    }
                }
            });
        }
    });
}

function makeExecutable(location) {
    _child_process2.default.exec('make', { cwd: location }, function (err) {
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            _child_process2.default.exec('rm *.o', { cwd: location }, function (err) {
                if (err) {
                    console.log('ERROR: ' + err);
                } else {
                    console.log('binary executable created');
                }
            });
        }
    });
}

getDialignTool();