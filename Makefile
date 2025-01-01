network-server: ./Dockerfile
	docker-compose -f docker-compose.network.yml up server

network-proxy: ./proxy
	docker-compose -f docker-compose.network.yml up proxy --build --force-recreate
	