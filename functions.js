function createTable(items){
    var table, row, cell; 
    table = document.createElement("table"); 
    table.id = "table"; 
    for (var p in items){
        row = table.insertRow(); 
        cell = row.insertCell(0); 
        cell.innerText = p; 
        cell.style.fontWeight = "bold";
        cell = row.insertCell(1); 
        cell.innerText = items[p]; 
    }
    return table; 
}

function loadJSON(url, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.onprogress = onProgress; 
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);  
}

function onProgress(event){
  if (!event.lengthComputable) {
      return;
    }
  var loaded = event.loaded;
  var total = event.total;
  var progress = (loaded / total).toFixed(2);
  if (identifier !== undefined){ // Not to be called when all the mini-maps are loading 
    var div = document.getElementById('loadtext_' + String(identifier)); 
    div.innerText = parseInt(progress * 100) + ' %'; 
    var div = document.getElementById('load_div_' + String(identifier));
    div.style.width = parseInt(progress * 100) + '%';   
  }
}

function loadMap(url,identity) {
  var status = document.getElementById('button_' + String(identity)).value; 
  identifier = identity; 
  if (status == false){
    // Creation of a new container child for the progress bar 
    var DivProgressBar = document.createElement("div"); 
    DivProgressBar.id = 'progress_' + String(identity);
    DivProgressBar.className = 'noload'; 
    var parent = document.getElementById('text_'+ String(identity));  
    parent.appendChild(DivProgressBar);

    var loadtext = document.createElement("span"); 
    loadtext.className = "loadtext"; 
    loadtext.id = "loadtext_" + String(identity); 
    var parent = document.getElementById(DivProgressBar.id);
    parent.appendChild(loadtext); 

    var load = document.createElement("div"); 
    load.className = "load"; 
    load.id = "load_div_" + String(identity); 
    var parent = document.getElementById(DivProgressBar.id);
    parent.appendChild(load); 
    // Load file 
    loadJSON(url, function(response){
      var jsonLayer = L.geoJson(response, {
        onEachFeature: function(feature,layer){
          var table = createTable(feature.properties);
          layer.bindPopup(table);                  
          }
      }).addTo(mapBig);   
      layers[identity] = jsonLayer;  
      document.getElementById('button_' + String(identity)).value = true; 
    }); 
  }         
  if (status == true){
    // Remove the layer on the main map 
    mapBig.removeLayer(layers[identity]); 
    // Remove the progression bar 
    var element = document.getElementById('progress_' + String(identity)); 
    element.parentNode.removeChild(element); 
    document.getElementById('button_' + String(identity)).value = false; 
  }
}     
