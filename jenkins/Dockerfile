FROM eclipse-temurin:17-jdk-jammy

ARG JENKINS_VERSION=2.504.1

RUN groupadd -g 1000 jenkins \
    && useradd -u 1000 -g jenkins -d /var/jenkins_home -m -s /bin/bash jenkins

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl tini ca-certificates gnupg git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN install -m 0755 -d /etc/apt/keyrings \
    && curl -fSL https://download.docker.com/linux/ubuntu/gpg \
       | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo \
       "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
       https://download.docker.com/linux/ubuntu jammy stable" \
       > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends docker-ce-cli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/libexec/docker/cli-plugins \
    && curl -fSL \
       "https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64" \
       -o /usr/libexec/docker/cli-plugins/docker-compose \
    && chmod +x /usr/libexec/docker/cli-plugins/docker-compose \
    && echo "docker-compose installed:" \
    && /usr/libexec/docker/cli-plugins/docker-compose version

RUN mkdir -p /usr/share/jenkins \
    && curl -fSL \
       "https://get.jenkins.io/war-stable/${JENKINS_VERSION}/jenkins.war" \
       -o /usr/share/jenkins/jenkins.war \
    && ls -lh /usr/share/jenkins/jenkins.war

ENV JENKINS_HOME=/var/jenkins_home
VOLUME /var/jenkins_home
EXPOSE 8080 50000
USER jenkins
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["java", "-jar", "/usr/share/jenkins/jenkins.war"]
