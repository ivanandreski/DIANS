FROM openjdk:11
EXPOSE 8080
ADD target/sipnsnack-backend.jar sipnsnack-backend.jar
COPY ./database ./database
ENTRYPOINT ["java","-jar", "sipnsnack-backend.jar"]