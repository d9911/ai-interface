#инит проекта
init:
	@if [ ! -d "node_modules" ] || [ ! -f "yarn.lock" ]; then \
		yarn; \
	else \
		echo "Dependencies are already installed."; \
	fi




dev:init
	$(MAKE) check_ip
	$(MAKE) kill-port PORT=3001
	$(MAKE) stop-pm2
	$(MAKE) start-pm2
	$(MAKE) logs-pm2