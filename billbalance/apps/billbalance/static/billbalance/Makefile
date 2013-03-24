LESS = ./build/less/billbalance.less
JS = ./build/js/
VENDOR = ./build/vendor/

MAIN_CSS = ./css/main.css
MAIN_JS = ./js/main.js

all: billbalance-css billbalance-js
	@echo "\n${HR}"
	@echo "The architect looks down on the world"
	@echo "Let there be CSS he said...but its was not enough."
	@echo "Let there be JS..."
	@echo "And the world rejoiced"
	@echo "${HR}\n"
    
billbalance-js:
	#wget http://code.jquery.com/jquery-latest.js -O $(VENDOR)js/jquery.latest.js
	mkdir -p js
	cat $(VENDOR)js/modernize.js $(VENDOR)js/jquery.latest.js $(VENDOR)js/bootstrap.js $(VENDOR)js/mobiscroll-2.3.1.custom.min.js $(VENDOR)js/knockout-2.2.1.js $(VENDOR)js/jstorage.min.js $(JS)* > tmp.js
	uglifyjs -ncv tmp.js > $(MAIN_JS)
	rm tmp.js

billbalance-css:
	mkdir -p css
	lessc --yui-compress $(LESS) > tmp.css
	cat $(VENDOR)css/bootstrap.min.css $(VENDOR)css/bootstrap-responsive.min.css tmp.css > $(MAIN_CSS)
	rm tmp.css