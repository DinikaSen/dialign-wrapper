# dialign-wrapper
A simple node module that wraps the functionalities of Dialign multiple sequence alignment program

Visit following site to learn more about it. [https://bibiserv.cebitec.uni-bielefeld.de/dialign/](https://bibiserv.cebitec.uni-bielefeld.de/dialign/)

## Install

You can install dialign-wrapper by running,

```bash
npm install dialign-wrapper
```

You can download Dialign executable by running, 

```bash
node util/downloader.js
```

It will download the Dialign binary executable to util/bin folder 

## Usage
#### Align an unaligned sequence file and get output in FASTA format or ClustalW
* .alignSeqFile = function (inputFile, outFormat, callback)   
  callback passed (err, data)
  
  ```javascript
  const dialign = require('dialign-wrapper');
  var inputFile = 'samples/example.fasta';
  var outFormat = 'fasta';
  
  dialign.alignSeqFile(inputFile, outFormat, function(err,data){
      if(err){
          console.log(err);
      }else{
          console.log(data);
      }
  });
      

#### Align an unaligned input string (in FASTA format) and get output in FASTA format or ClustalW format
* .alignSeqString (input, outFormat, callback)    
  callback passed (err, data)
  
  ```javascript
    const dialign = require('dialign-wrapper');
    var outFormat = 'fasta';
    var input = '>test1\n' +
              'ACDEFGHIKLMNPQRSTVWY\n' +
              '>test2\n' +
              'XXXXACDEFGHIMNXXXPQR\n' +
              '>test3\n' +
              'ACDEFGHILMNXXXXXPQRS\n' +
              '>test4\n' +
              'XXXACDEFGHIKLMNPQRST';
    dialign.alignSeqString(input,outFormat,function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    });
  
The output can be either the following two formats (set 'outFormat' to one of the following) 
   
      *  fasta
      *  clustalW

#### You can specify a custom execution path where the dialign binary executable is placed

 
  ```javascript
  const dialign = require('dialign-wrapper');
  var customExecPath = 'Downloads/bin';
  
  dialign.setCustomLocation(customExecPath);
  ````
  
  
#### You can set environment varible 'DIALIGN2_DIR' pointing to the directory `dialign2_dir' in a custom location

**NOTE**: The pointed directory should include tp400_dna,tp400_prot, tp400_trans, BLOSUM files


  ```javascript
  const dialign = require('dialign-wrapper');
  var envVariable = 'Downloads/bin/dialign_package/dialign2_dir';
  
  dialign.setEnvironmentVar(envVariable);
  ````
    



