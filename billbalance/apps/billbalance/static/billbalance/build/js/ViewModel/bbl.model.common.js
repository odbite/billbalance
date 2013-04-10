/*
 * ViewModel will include our ViewModel-specific Javascript code
 * For reusable logic across all types of ViewModels
 */

// Lazy initialize our namespace context: bbl.model.common
if (typeof(bbl) == 'undefined') bbl = { }
if (typeof(bbl.model) == 'undefined') bbl.model = { }
if (typeof(bbl.model.common) == 'undefined') bbl.model.common = { }

bbl.model.common.initializeViewModel = function (pageSettings) {
	// We can use properties of the pageSettings as default values for any of our ValueModels
	// If pageSettings are not provided we'll initialize an empty object
	if (typeof(pageSettings) == 'undefined') var pageSettings = { }
	
	var viewModel = {};
	
	viewModel.loadData = function() {
		// TODO: Use to get data from model
	}
	
	viewModel.namespace = function(namespaceString) {
	    var parts = namespaceString.split('.'),
	        parent = window,
	        currentPart = '';    
	        
	    for(var i = 0, length = parts.length; i < length; i++) {
	        currentPart = parts[i];
	        parent[currentPart] = parent[currentPart] || {};
	        parent = parent[currentPart];
	    }
	    
	    return parent;
	}

	return viewModel;
}