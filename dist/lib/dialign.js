'use strict';

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dialign = {
    //TODO : These are for linux.... check for macOS
    execLocation: _path2.default.resolve(_path2.default.join(__dirname, '../util/bin/dialign_package/src/')),
    envVariablePath: _path2.default.resolve(_path2.default.join(__dirname, '../util/bin/dialign_package/dialign2_dir/')),
    customExecLocation: null,
    customEnvVarPath: null
};

/*
set a custom location where dialign2-2 executable binary file is located
 */
dialign.setCustomLocation = function (location) {
    var binPath = location + '/dialign2-2';
    if (_fs2.default.existsSync(binPath)) {
        dialign.customExecLocation = _path2.default.resolve(location);
        console.log('Custom execution path is set to ' + _path2.default.resolve(location));
    } else {
        console.log(binPath + ' does not exist. \nPlease check whether the dialign2-2 executable is located in the given path with the name \'dialign2-2\'.');
    }
};

/*
set environment varible `DIALIGN2_DIR' pointing to the directory `dialign2_dir' in a custom location
The pointed directory should include tp400_dna,tp400_prot, tp400_trans, BLOSUM
 */
dialign.setEnvironmentVar = function (location) {
    var blosum = location + '/BLOSUM';
    var dna = location + '/tp400_dna';
    var prot = location + '/tp400_prot';
    var trans = location + '/tp400_trans';
    if (_fs2.default.existsSync(blosum) && _fs2.default.existsSync(dna) && _fs2.default.existsSync(prot) && _fs2.default.existsSync(trans)) {
        dialign.customEnvVarPath = _path2.default.resolve(location);
        console.log('Environment variable is set pointing to ' + _path2.default.resolve(location));
    } else {
        console.log(location + ' does not contain one or more of the following files -\ntp400_dna,tp400_prot, tp400_trans, BLOSUM\nPlease check and reset path');
    }
};

/*
Align an unaligned sequence file and get output in FASTA format or ClustalW
 */
dialign.alignSeqFile = function (inputFile, outFormat, callback) {
    if (outFormat === 'fasta' || outFormat === 'Fasta' || outFormat === 'FASTA') {
        alignSequence('file', inputFile, '-fa ', callback);
    } else if (outFormat === 'clustalW' || outFormat === 'clustalw' || outFormat === 'CLUSTALW' || outFormat === 'Clustalw' || outFormat === 'ClustalW') {
        alignSequence('file', inputFile, '-cw ', callback);
    } else {
        console.log('Please specify a correct output format (either \'fasta\' or \'clustalW\'');
    }
};

/*
Align an unaligned input string (in FASTA format) and get output in FASTA format or ClustalW format
 */
dialign.alignSeqString = function (input, outFormat, callback) {
    var tempInputFile = __dirname + '/' + (0, _v2.default)() + '.fasta';
    _fs2.default.writeFileSync(tempInputFile, input);
    if (outFormat === 'fasta' || outFormat === 'Fasta' || outFormat === 'FASTA') {
        alignSequence('string', tempInputFile, '-fa ', callback);
    } else if (outFormat === 'clustalW' || outFormat === 'clustalw' || outFormat === 'CLUSTALW' || outFormat === 'Clustalw' || outFormat === 'ClustalW') {
        alignSequence('string', tempInputFile, '-cw ', callback);
    } else {
        console.log('Please specify a correct output format (either \'fasta\' or \'clustalW\'');
    }
};

function alignSequence(type, inputFile, outFormat, callback) {
    if (_fs2.default.existsSync(inputFile)) {
        var tempOutputFile = __dirname + '/' + (0, _v2.default)();
        var dialignCommand = './dialign2-2 ' + outFormat + '-fn ' + tempOutputFile + ' ' + _path2.default.resolve(inputFile);
        run(dialignCommand, function (err) {
            if (err) {
                return callback(err);
            } else {
                var data = '';
                if (outFormat === '-fa ') {
                    data = _fs2.default.readFileSync(tempOutputFile + '.fa', 'utf8');
                    _fs2.default.unlinkSync(tempOutputFile);
                    _fs2.default.unlinkSync(tempOutputFile + '.fa');
                    if (type === 'string') {
                        _fs2.default.unlinkSync(_path2.default.resolve(inputFile));
                    }
                } else if (outFormat === '-cw ') {
                    data = _fs2.default.readFileSync(tempOutputFile + '.cw', 'utf8');
                    _fs2.default.unlinkSync(tempOutputFile);
                    _fs2.default.unlinkSync(tempOutputFile + '.cw');
                    if (type === 'string') {
                        _fs2.default.unlinkSync(_path2.default.resolve(inputFile));
                    }
                }
                return callback(err, data);
            }
        });
    } else {
        var err = 'Input file does not exist';
        return callback(err, null);
    }
}

function run(command, callback) {
    var execPath = dialign.execLocation;
    var envPath = dialign.envVariablePath;
    if (dialign.customExecLocation != null) {
        execPath = dialign.customExecLocation;
    }
    if (dialign.customEnvVarPath != null) {
        envPath = dialign.customEnvVarPath;
    }
    console.log('RUNNING', command);
    _child_process2.default.exec(command, { cwd: execPath, env: { 'DIALIGN2_DIR': envPath }, maxBuffer: 1024 * 1000 }, callback);
}

module.exports = dialign;