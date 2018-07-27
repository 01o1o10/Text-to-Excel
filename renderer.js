const $ = require('jquery')
const ex = require('xlsx')

var file = undefined
var splitter = undefined

document.getElementById('file-submit-button').onclick = function(){
    if(readForm()){
        readTextFile(file, function(res){
            var dataArray = splitDataToJson('split-progress', res)
            writeExcelFile(file, dataArray)
        })
    }
}

readForm = function(){
    file = document.getElementById('source-file').files[0]
    splitter = document.getElementById('splitter').value
    if(!file || !splitter){
        alertInfo('Any field can not be empty!', false)
    }
    else {
        return true
    }
}

readTextFile = function(file, cb){
    const fs = require('fs')
    fs.readFile(file.path, 'utf-8', function(err, data){
        if(err){
            alertInfo('There is a problem dyuring read source file!', false)
        }
        else{
            cb(data)
        }
    })
}

splitDataToJson = function(pgsId, data){
    var dataArray = []
    data = data.split('\n')
    document.getElementById(pgsId).style.width = '0'
    for(var i in data){
        if(data[i] != ''){
            var row = data[i].split(splitter)
            var json = {}
            for(var j in row){
                json['col' + j] = ($.isNumeric(row[j])) ? parseFloat(row[j]) : row[j]
            }
            dataArray.push(json)
        }
        document.getElementById(pgsId).style.width = ((i * 100)/data.length) + '%'
    }
    document.getElementById(pgsId).style.width = '100%'
    return dataArray
}

writeExcelFile = function(file, data){
    //console.log(data)
    var ws = ex.utils.json_to_sheet(data)

    /* add to workbook */
    var wb = ex.utils.book_new()
    ex.utils.book_append_sheet(wb, ws, "Sheet1")
    
    /* generate an XLSX file */
    ex.writeFile(wb, file.path.substr(0, file.path.length - 3) + 'xlsx')
    alertInfo('Data exported succesfully!', true)
}

alertInfo = function(message, succes){
    var alrt = undefined
    if(succes){
        alrt = $('#succes-alert')
    }
    else {
        alrt = $('#failed-alert')
    }

    alrt.html('<strong>Info! </strong> ' + message)
    
    alrt.slideToggle('slow');
    setTimeout(function(){
        alrt.slideToggle('slow');
    }, 3000);
}
