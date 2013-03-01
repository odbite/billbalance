LESS = ./less/billbalance.less
BOOTSTRAP = ./less/bootstrap.min.css
BOOTSTRAP_RESPONSIVE = ./less/bootstrap-responsive.min.css

MAIN = ./css/main.css

all: 
	lessc --compress $(LESS) > billbalance.tmp.css
	cat billbalance.tmp.css $(BOOTSTRAP) $(BOOTSTRAP_RESPONSIVE) > $(MAIN)
	rm billbalance.tmp.css
    
