/*
 * ViewMediator will include Javascript code mediating interactions between Views and ViewModels 
 * For reusable logic across all view mediators
 */

// Lazy initialize our namespace context: bbl.mediator.common
if (typeof(bbl) == 'undefined') bbl = { }
if (typeof(bbl.mediator) == 'undefined') bbl.mediator = { }
if (typeof(bbl.mediator.common) == 'undefined') bbl.mediator.common = { }

if (typeof(console) != 'undefined' && console) console.info("bbl.mediator.common loading!");

bbl.mediator.common.createViewMediator = function (pageSettings) {
	// Create the view Savings Goal view-specific view model
	var viewModel = bbl.model.common.initializeViewModel(pageSettings);
	
	if (typeof(console) != 'undefined' && console) console.info("bbl.mediator.common ready!");
}

