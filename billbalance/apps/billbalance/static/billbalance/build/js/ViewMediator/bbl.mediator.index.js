/*
 * ViewMediator will include Javascript code mediating interactions between Views and ViewModels 
 * 
 * The createViewMediator function will have 3 responsibilities:
 * 	
 *	Instantiate a view model
 *	Declare the data-binding between the HTML elements of the view and their corresponding value models in the view model
 *	Ask KnockoutJS to make the bindings effective (they will be live right after that)
 *	Save off the view model so we can access it from other parts of the app
 */

// Lazy initialize our namespace context: bbl.mediator.index
if (typeof(bbl) == 'undefined') bbl = { }
if (typeof(bbl.mediator) == 'undefined') bbl.mediator = { }
if (typeof(bbl.mediator.index) == 'undefined') bbl.mediator.index = { }

if (typeof(console) != 'undefined' && console) console.info("bbl.mediator.index loading!");

bbl.mediator.index.createViewMediator = function (pageSettings) {
	// Create the view Savings Goal view-specific view model
	var viewModel = bbl.model.index.initializeViewModel(pageSettings);
	
	if (typeof(console) != 'undefined' && console) console.info("bbl.mediator.index get data from model!");
	
	// Load data to viewModel
	
	// TODO: Use function loadData in bbl.model.index.js
	viewModel.bills([{
		"money" : 0,
		"person" : "Linus"
	}, {
		"money" : 0,
		"person" : "Tina"
	}, {
		"money" : 0,
		"person" : "Niels"
	}]);
	
	// TODO: Use function loadData in bbl.model.index.js
	viewModel.availableCategorys([{
		"categoryName" : "Bostad"
	}, {
		"categoryName" : "Mat"
	}, {
		"categoryName" : "Presenter"
	}]);
	
	// TODO: Use function loadData in bbl.model.index.js
	viewModel.persons([{
		"forename" : "Linus",
		"surname" : "Wallin"
	}, {
		"forename" : "Niels",
		"surname" : "Lemmens"
	}, {
		"forename" : "Tina",
		"surname" : "Wallin"
	}]);
	
	
	viewModel.selectedPayPerson(viewModel.persons()[0].forename);
	viewModel.selectedSharePersons([viewModel.persons()[0].forename]);
	
	if (typeof(console) != 'undefined' && console) console.info("bbl.mediator.index data loaded and reday!");
	
	// Declare the HTML element-level data bindings
	$(".summary-persons").attr("data-bind","foreach: bills");
	$(".summary-persons-name").attr("data-bind","text: person");
	$(".summary-persons-money").attr("data-bind","text: money, css: { 'badge-important': money < 0, 'badge-success': money > 0 }");
	
	$(".bill-add").attr("data-bind","value: money");
	$(".bill-category").attr("data-bind","options: availableCategorys, optionsText: 'categoryName', value: selectedCategory, optionsCaption: 'Select a category'");
	
	$(".bill-share").attr("data-bind","foreach: bills"); 
	$(".bill-share-persons-selected").attr("data-bind","css: { 'active': $root.selectedSharePersons.indexOf(person) != -1 }"); 
	$(".bill-share-person").attr("data-bind","text: person, click: $root.changeSharePersons"); 
	
	$(".bill-pay-person").attr("data-bind","options: persons, optionsText: 'forename', optionsValue: 'forename', value: selectedPayPerson"); 
	$(".bill-description").attr("data-bind","value: description"); 
	$(".bill-date").attr("data-bind","value: date"); 
	$(".bill-add").attr("data-bind","click: addBill");
	
	$(".bill-history-show").attr("data-bind","visible: billHistory().length > 0");
	$(".bill-history").attr("data-bind","foreach: billHistory");
	$(".bill-history").attr("data-bind","foreach: billHistory");
	$(".bill-history-person").attr("data-bind","text: person");
	$(".bill-history-money").attr("data-bind","text: money");
	$(".bill-history-date").attr("data-bind","text: date");
	
	$(".bill-display-data").attr("data-bind","text: ko.toJSON($root)");
	
	// Ask KnockoutJS to data-bind the view model to the view
	var viewNode = $('#main-view')[0];
	ko.applyBindings(viewModel, viewNode);
	
	bbl.mediator.index.setViewModel(viewModel);
	
	if (typeof(console) != 'undefined' && console) console.info("bbl.mediator.index ready!");
}

bbl.mediator.index.getViewModel = function() {
	return $(document).data("bbl.model.index.viewmodel");
}

bbl.mediator.index.setViewModel = function(viewModel) {
	$(document).data("sgs.model.index.viewmodel", viewModel);
}