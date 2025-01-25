network:
	docker-compose -f docker-compose.network.yml up
	
network-server: ./Dockerfile
	docker-compose -f docker-compose.network.yml up server

network-proxy: ./proxy
	docker-compose -f docker-compose.network.yml up proxy --build --force-recreate
	
publish-types-version:
	echo "Publishing new version ${v}"
	
	npm version $(v) --workspace @ufosc/jukebox-types
	npm publish --workspace @ufosc/jukebox-types --access public