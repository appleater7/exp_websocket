var GridObj = function(id){
    var obj = document.querySelector(id);
    var headers = obj.getAttribute('data-headers').split(',');
    var lables = obj.getAttribute('data-lables').split(',');
    var types = obj.getAttribute('data-types').split(',');

    this.addRow = function(){
        var html = '<tr>';
        for(var tIdx in types){
            if(types[tIdx]==='ro'){
                html += '<td>&nbsp;</td>';
            }else if(types[tIdx]==='ed'){
                html += '<td><input type="text"></td>';
            }
        }
        html += '</tr>';
        document.querySelector('#tBody').innerHTML += html;
    }
    this.init = function(){
        var html = '<table border="1">';
        html += '<tr>';
        for(var idx in lables){
            html += '<th>' + lables[idx] + '</th>';
        }
        html += '</tr>';
        html += '<tbody id="tBody"></tbody>';
        html += '</table>';
        obj.innerHTML = html;
    }
    
    this.select = function(url){
        get(url,callback);
        function callback(res){
            res = JSON.parse(res);
            var html = '';
            for(var i in res){
                html += '<tr>';
                var row = res[i];
                for(var hIdx in headers){
                    var header = headers[hIdx];
                    var td = '<td>';
                    if(types[hIdx]==='ed'){
                        td += '<input type="text" value="' + row[header] + '">';
                    }else if(types[hIdx]==='ro'){
                        td += row[header];
                    }
                    td += '</td>';
                    html += td;
                }
                html += '</tr>';
            }
            document.querySelector('#tBody').innerHTML = html;
            console.log(res);
        }
    }

    var get = function(url, func){
        var xhr = new XMLHttpRequest();
        xhr.open('GET',url);
        xhr.onreadystatechange = function(){
            if(xhr.readyState==4){
                if(xhr.status==200){
                    func(xhr.response);
                }
            }
        }
        xhr.send();
    }

}