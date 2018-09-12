//Array that stores currently open tabs.
var openTabs = [];

//Name of groups of tabs saved.
var keys = [];

//Pages.
var values = [];

//Callback.
//Stores open tabs into openTabs.
 function loadCurrentTabs(data){
	 var tabs = [];
	 var tabsLength = data.tabs.length;
	 
	 for(var i = 0; i < tabsLength; ++i){
		 tabs.push(data.tabs[i].url);
	 }
	 openTabs = tabs;
 }
 //Get tabs using chrome extension API.
chrome.windows.getLastFocused({populate:true}, loadCurrentTabs);

//Action for delete buttons.
function deleteFunction(event){
	if (confirm("Really want to delete?")){
			
			//a div which contains tab group button and delete button.
			var parent = event.target.parentElement;
			
			//Get rid of those buttons from HTML.
			while(parent.firstChild)
				parent.removeChild(parent.firstChild);
			
			//Delete buttons id is same as index of keys and values that have.
			//key and value what need to be deleted.
			keys.splice(event.target.id,1);
			values.splice(event.target.id,1);
			
			//Save renewed keys and values in chrome storage.
			chrome.storage.sync.set({
				userTab_keys:keys,
				userTab_values:values
			});
			updateUI();	 
	}
}

//Action function for tab group buttons.
function createWindow(event){
	
	//Creates tabs based on selected value.
	chrome.windows.create({url:values[event.target.id]});
}

//Creates elements in the page if there is any groups in keys and values.
 function updateUI(){
	 var contentsDiv = document.getElementById("contents");
	 while(contentsDiv.firstChild){
		 contentsDiv.removeChild(contentsDiv.firstChild);
	 }
	 
	 for(var i = 0; i < keys.length; ++i){
		var div = document.createElement("div");
		var nameButton = document.createElement("button");
		var deleteButton = document.createElement("button");
		
		nameButton.className = "linkButton";
		nameButton.id = i;
		nameButton.innerHTML = keys[i];
		nameButton.addEventListener("click", createWindow);
		nameButton.style.fontSize = "large";
		
		deleteButton.className = "delete_button";
		deleteButton.innerHTML = "x";
		deleteButton.style.fontSize = "small";
		deleteButton.id = i;
		
		
		deleteButton.addEventListener("click", deleteFunction);
		 
		div.appendChild(nameButton);
		div.appendChild(deleteButton);
		contentsDiv.appendChild(div);	 
	 }
 }

 //Get saved tab groups from chrome storage.
 //Print them on the page.
chrome.storage.sync.get(function(data){
	
	if (data.userTab_keys != null && data.userTab_values != null){
		keys = data.userTab_keys;
		values = data.userTab_values;
	}
	updateUI();
});

//Turns open tabs URL into a string.
function tabsToString(){
	var string = '';
	for(var i = 0; i < openTabs.length; ++i){
		var temp = (i+1) + ": " + openTabs[i] + "\n";
		string += temp;
	}
	return string;
}

function isExisted(name){
	for(var i = 0; i < keys.length; ++i)
		if(name == keys[i])
			return true;
	
	return false;
}


//Action for Create button.
//If there is nothing entered or a same group name, nothing will be happened.
//It confirms tabs what user tries to save.
//Saves group name and array of tabs separately into keys and values.
//Save keys and values into chrome storage.
document.querySelector('#group_name_button').addEventListener('click', function(){
	if (openTabs.length <= 0)
		return;
	
	var name = document.querySelector('#group_name').value;
	var divValidate = document.getElementById('name_validate');
	divValidate.style.display = 'none';
		
	if (name == '' || isExisted(name)){
		divValidate.style.display = 'block';
		return;
	}
	
	if(confirm(tabsToString())){
		keys.push(name);
		values.push(openTabs);
		chrome.storage.sync.set({
			userTab_keys:keys,
			userTab_values:values
		});
		updateUI();
		name = "";
	}
})


