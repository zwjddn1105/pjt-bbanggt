FROM openjdk:17-jdk

WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g @web3-storage/w3

COPY build/libs/breadbread-0.0.1-SNAPSHOT.jar backend.jar

ENV TZ=Asia/Seoul
ENV SERVER_PORT=8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:${SERVER_PORT}/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "-Xmx1024m", \
           "-Dserver.port=${SERVER_PORT}", "backend.jar"]

EXPOSE ${SERVER_PORT}