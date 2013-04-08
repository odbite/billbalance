
$(document).ready(function(){
	if (typeof(console) != 'undefined' && console) console.info("InitializeApplication starting ...");
	
	// Initialize our page-wide settings
	var pageSettings = { }
	
	// Create / launch our view mediator(s)
	bbl.mediator.index.createViewMediator(pageSettings);

	if (typeof(console) != 'undefined' && console) console.info("InitializeApplication done ...");
});