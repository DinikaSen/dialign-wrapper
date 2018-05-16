import os from 'os';
import download from 'download-file';
import path from 'path';
import child_process from 'child_process';
import targz from 'targz';

let address = 'https://bibiserv.cebitec.uni-bielefeld.de/';
const platform = os.platform();


function getDialignTool () {
    if (platform == 'darwin') {
        address += 'resources/download/dialign/dialign-2.2.1-universal-osx.dmg.zip';
        downloadDaln(address,platform);
    } else if (platform === 'linux') {
        address += 'applications/dialign/resources/downloads/dialign-2.2.1-src.tar.gz';
        downloadDaln(address,platform);
    } else{
        console.log('Sorry, jsBioTools cannot download Dialign for your operating system');
    }
}


function downloadDaln  (url, platform) {
    let src = './bin/';
    if (platform === 'linux'){
        src += 'dialign-2.2.1-src.tar.gz';
    }else if (platform === 'darwin'){
        src += 'dialign-2.2.1-universal-osx.dmg.zip';
    }
    console.log('Downloading Dialign from ', url);
    download(url, {directory: './bin'}, err => {
        if (err) {
            console.log('Download failed');
            console.log(err);
        }
        else {
            console.log('Download complete');
            targz.decompress({src, dest: './bin/'}, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Archive unzipped");
                    if(platform === 'linux'){
                        const execPath = path.resolve('./bin/dialign_package/src/');
                        makeExecutable(execPath);
                    } else if (platform === 'darwin'){
                        // TODO : install dmg
                    }
                }
            });
        }
    });
}

function makeExecutable ( location ) {
    child_process.exec('make', {cwd: location}, err => {
        if (err) {
            console.log(`ERROR: ${err}`);
        } else {
            child_process.exec('rm *.o', {cwd: location}, err => {
                if (err) {
                    console.log(`ERROR: ${err}`);
                } else {
                    console.log('binary executable created');
                }
            });
        }
    });
}


getDialignTool();