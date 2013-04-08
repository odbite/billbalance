
// Lazy initialize our namespace context: bbl.model.index
if (typeof(bbl) == 'undefined') bbl = { }
if (typeof(bbl.model) == 'undefined') bbl.model = { }
if (typeof(bbl.model.index) == 'undefined') bbl.model.index = { }


// DEFINED SUBCLASSES
function Persons(data) {
	this.forename = ko.observable(data.forename);
	this.surname = ko.observable(data.surname);
}

function Category(data) {
	this.categoryName = ko.observable(data.category);
};

function Bill(data) {
	this.money = ko.observable(data.money);
	this.person = ko.observable(data.person);
}

function BillHistory(data) {
	this.money = ko.observable(data.money);
	this.person = ko.observable(data.person);
	this.date = ko.observable(data.date);
}


bbl.model.index.initializeViewModel = function (pageSettings) {
	// We can use properties of the pageSettings as default values for any of our ValueModels
	// If pageSettings are not provided we'll initialize an empty object
	if (typeof(pageSettings) == 'undefined') var pageSettings = { }
	
	var self = this; 
	
	var viewModel = {
		// Messages
		showNewPersonField: ko.observable(false),
				
		// Categorys
		availableCategorys: ko.observableArray([]),
		selectedCategory: ko.observable(),
		
		// Bills
		bills: ko.observableArray([]),
		money: ko.observable().extend({numeric : 2}),
		
		date: ko.observable(),
		description: ko.observable(),
		billHistory: ko.observableArray([]),
	
		// Persons
		newPerson: ko.observable(),
		persons: ko.observableArray([]),
		selectedPayPerson: ko.observable("Linus"),
		selectedSharePersons: ko.observableArray(["Linus"]),
	}
	
	// Operations
	viewModel.addBill = function() {
		var money = parseFloat(this.money());
		var selectedSharePersons = this.selectedSharePersons();
		var selectedPayPerson = this.selectedPayPerson();
		var bills = this.bills();
		
		// Validate
		console.log(bills);

		// Add to the one you should have money
		for (i in bills) {

			if(selectedSharePersons.length <= 1 && selectedSharePersons.indexOf(selectedPayPerson) >= 0 ) break;
			
			// Add the money for who payd
			if (bills[i].person == selectedPayPerson ) {
				bills[i].money = parseFloat(bills[i].money) + money;
				
				date = new Date();
				
				this.billHistory.push({
					person : bills[i].person,
					money : parseFloat(this.money()),
					date : date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay(), 
				});
			} 
			
			if (selectedSharePersons.indexOf(bills[i].person) >= 0) {
				bills[i].money = parseFloat(bills[i].money) - (money/selectedSharePersons.length);
				bills[i].money = bills[i].money.toFixed(2);
			}

		}
	
		// Reset the array
		this.bills([]);
		this.bills(bills);
	};
	
	viewModel.addPerson = function() {
		this.bills.push( {
			person : this.newPerson(),
			money : 0
		} );
	}

	viewModel.changeSharePersons = function(data) {
		if (viewModel.selectedSharePersons.indexOf(data.person) < 0)
			viewModel.selectedSharePersons.push(data.person);
		else if (viewModel.selectedSharePersons().length > 1)
			viewModel.selectedSharePersons.remove(data.person);
	}
	
	viewModel.showHideField = function(data, field) {
		var show = field.showNewPersonField();
		if (show) field.showNewPersonField(false);
		else field.showNewPersonField(true);
	}
	
	viewModel.loadData = function() {
		// TODO: Use to get data from model
	}

	return viewModel;
}