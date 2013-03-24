jQuery(document).ready(function($) {
	$(".collapse-alt").collapse();

	/*$('#demo').mobiscroll().date({
	 theme : 'jqm',
	 display : 'bubble',
	 mode : 'scroller',
	 dateOrder : 'ddMyyyy',
	 dateFormat : 'yyyy-mm-dd',
	 });

	 $('#show_history_info').click(function() {
	 if ($(this).hasClass('hide_history_info')) {
	 $('.history .hiddeninfo').removeClass('hide');
	 $(this).removeClass('hide_history_info');
	 } else {
	 $('.history .hiddeninfo').addClass('hide');
	 $(this).addClass('hide_history_info');
	 }
	 });

	 //$('#demo').scroller('setDate', now, true);*/

});

//SAMPLE

function sampleCategorys() {
	return [{
		"categoryName" : "Bostad"
	}, {
		"categoryName" : "Mat"
	}, {
		"categoryName" : "Presenter"
	}]
}

function sampleBills() {
	return [{
		"money" : 0,
		"person" : "Linus"
	}, {
		"money" : 0,
		"person" : "Tina"
	}, {
		"money" : 0,
		"person" : "Niels"
	}]
}

function samplePersons() {
	return [{
		"forename" : "Linus",
		"surname" : "Wallin"
	}, {
		"forename" : "Niels",
		"surname" : "Lemmens"
	}, {
		"forename" : "Tina",
		"surname" : "Wallin"
	}]
}

function sampleSelectedPerson() {
	return "Linus"
}

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


// MAIN VIEW

function billbalanceViewModel() {
	var self = this;
	
	// Messages
	self.showNewPersonField = ko.observable(false);
	
	// Categorys
	self.availableCategorys = ko.observableArray([]);
	self.selectedCategory = ko.observable();

	// Bills
	self.bills = ko.observableArray([]);
	self.money = ko.observable().extend({
		numeric : 2
	});
	self.date = ko.observable();
	self.description = ko.observable();
	self.billHistory = ko.observableArray([]);

	// Persons
	self.newPerson = ko.observable();
	self.persons = ko.observableArray([]);
	self.selectedPayPerson = ko.observable(sampleSelectedPerson());
	self.selectedSharePersons = ko.observableArray([sampleSelectedPerson()]);

	// Operations
	self.addBill = function() {
		var money = parseFloat(self.money());
		var selectedSharePersons = self.selectedSharePersons();
		var selectedPayPerson = self.selectedPayPerson();
		var bills = self.bills();
		
		// Validate
		console.log(bills);

		// Add to the one you should have money
		for (i in bills) {

			if(selectedSharePersons.length <= 1 && selectedSharePersons.indexOf(selectedPayPerson) >= 0 ) break;
			
			// Add the money for who payd
			if (bills[i].person == selectedPayPerson ) {
				bills[i].money = parseFloat(bills[i].money) + money;
				
				date = new Date();
				
				self.billHistory.push({
					person : bills[i].person,
					money : parseFloat(self.money()),
					date : date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay(), 
				});
			} 
			
			if (selectedSharePersons.indexOf(bills[i].person) >= 0) {
				bills[i].money = parseFloat(bills[i].money) - (money/selectedSharePersons.length);
				bills[i].money = bills[i].money.toFixed(2);
			}

		}
		
		
			
		// Reset the array
		self.bills([]);
		self.bills(bills);
	}
	
	self.addPerson = function() {
		self.bills.push( {
			person : self.newPerson(),
			money : 0
		} );
	}

	self.changeSharePersons = function(data) {
		if (self.selectedSharePersons.indexOf(data.person) < 0)
			self.selectedSharePersons.push(data.person);
		else if (self.selectedSharePersons().length > 1)
			self.selectedSharePersons.remove(data.person);
	}
	
	self.showHideField = function(data, field) {
		var show = field.showNewPersonField();
		if (show) field.showNewPersonField(false);
		else field.showNewPersonField(true);
	}
	
	// LOAD DATA
	self.bills(sampleBills());
	self.availableCategorys(sampleCategorys());
	self.persons(samplePersons());
}


jQuery(document).ready(function($) {
	ko.extenders.numeric = function(target, precision) {
		//create a writeable computed observable to intercept writes to our observable
		var result = ko.computed({
			read : target, //always return the original observables value
			write : function(newValue) {
				var current = target(), roundingMultiplier = Math.pow(10, precision), newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue), valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

				//only write if it changed
				if (valueToWrite !== current) {
					target(valueToWrite);
				} else {
					//if the rounded value is the same, but a different value was written, force a notification for the current field
					if (newValue !== current) {
						target.notifySubscribers(valueToWrite);
					}
				}
			}
		});

		//return the new computed observable
		return result;
	};

	ko.applyBindings(new billbalanceViewModel());
});
