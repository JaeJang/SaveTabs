var closedTabs = [];
var closedWindows = [];

function windowListener(list){
	var div = document.querySelector('#closed_window');
	if(div.style.display =='block'){
		while(div.firstChild)
			div.removeChild(div.firstChild);
		div.style.display = 'none';
	}
	else{
		div.style.display = 'block';
		var newDiv = document.createElement('div');
		newDiv.className = 'closed_div'
		for(var i = 0; i < list.length; i++){
			var buttonDiv = document.createElement('div');
			var tmpButton = document.createElement('button');
			tmpButton.className = 'closed_detail_list';
			tmpButton.innerHTML = '\t-Window ' + (i + 1);
			tmpButton.id = i;
			tmpButton.addEventListener('click', function(){
				var arr = [];
				for(var j = 0; j < closedWindows[event.target.id].window.tabs.length; ++j){
					arr.push(closedWindows[event.target.id].window.tabs[j].url);
				}
				chrome.windows.create({url:arr});
			});
			buttonDiv.appendChild(tmpButton);
			newDiv.appendChild(buttonDiv);
			
		}
		div.appendChild(newDiv);
	}
	
}

function tabListener(list){
	var div = document.querySelector('#closed_tab');
	if(div.style.display != 'none'){
		while(div.firstChild)
			div.removeChild(div.firstChild);
		div.style.display = 'none';
	} 
	else{
		div.style.display = 'block';
		var newDiv = document.createElement('div');
		newDiv.className = 'closed_div';
		for(var i = 0; i < list.length; ++i){
			var itemDiv = document.createElement('div');
			var titleDiv = document.createElement('div');
			titleDiv.className = 'closed_detail title';
			titleDiv.innerHTML = closedTabs[i].title;
			titleDiv.id = i;
			var urlDiv = document.createElement('div');
			urlDiv.className = 'closed_detail url';
			urlDiv.innerHTML = closedTabs[i].url;
			urlDiv.id = i;
			urlDiv.addEventListener('click', function(){
				
			});
			itemDiv.appendChild(titleDiv);
			itemDiv.appendChild(urlDiv);
			itemDiv.addEventListener('click', function(){
				console.log(closedTabs[event.target.id].url);
				chrome.tabs.create({url:closedTabs[event.target.id].url});
			});
			newDiv.appendChild(itemDiv);
		}
		div.appendChild(newDiv);
		
	}
}


function setClosedStuffs(tabORwindow, list, isTab){
	
	var button = document.querySelector('#'+tabORwindow);
	button.innerHTML = tabORwindow + '(' + list.length + ')';
	
	
	if (isTab)
		button.addEventListener('click', function(){
			tabListener(list);
		});
	else
		button.addEventListener('click',function(){
			 windowListener(list);
		});
}


chrome.sessions.getRecentlyClosed(function(data){
	
	for(var i = 0; i < data.length; ++i){
		if("tab" in data[i])
			closedTabs.push({"title":data[i].tab.title, "url":data[i].tab.url})
			//closedTabs.push(data[i]);
		else
			closedWindows.push(data[i]);	
	}
	
	//setClosedWindow();
	//setClosedTab();
	setClosedStuffs('Window', closedWindows, false);
	setClosedStuffs('Tab', closedTabs, true);
});

function createPara(id){
	
}
