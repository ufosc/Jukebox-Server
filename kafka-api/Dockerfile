# the base image
FROM amazoncorretto:22-alpine-jdk

COPY ./mvnw /app/mvnw
COPY ./mvnw.cmd /app/mvnw.cmd
COPY ./.mvn /app/.mvn
COPY ./pom.xml /app/pom.xml
COPY ./src /app/src

WORKDIR /app

RUN chmod +x ./mvnw && ./mvnw package

RUN mv target/*.jar ./application.jar


ENTRYPOINT ["java", "-Xmx2048M", "-jar", "/app/application.jar"]