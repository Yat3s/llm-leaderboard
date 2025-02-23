ifeq ($(OS),Windows_NT)
	copyCommand := powershell.exe -NoProfile -Command Copy-Item -Recurse -Force
	shell := powershell.exe
    imageTag := $(shell powershell -NoProfile -Command "Get-Date -Format 'yyyyMMdd_HH-mm-ss'")
else # Linux or Mac
	copyCommand := cp -r
	shell := sh
    imageTag := $(shell /bin/date "+%Y%m%d_%H-%M-%S")
endif

# Docker image name and tag
IMAGE_NAME := iyat3s/geek4fun
IMAGE_TAG := $(imageTag)

docker-build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) -t $(IMAGE_NAME):latest .

docker-push: docker-build
	docker push $(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(IMAGE_NAME):latest

app-deploy: docker-push
	az containerapp update \
		--resource-group Composal \
		--name composal-app-prod \
		--image $(IMAGE_NAME):$(IMAGE_TAG)

