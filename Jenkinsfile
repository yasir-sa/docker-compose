pipeline {
    agent any

    environment {
        COMPOSE_FILE         = 'docker-compose.yml'
        COMPOSE_PROJECT_NAME = 'docker-todo-app'
        // Enables BuildKit for faster, more reliable image builds.
        // BuildKit parallelises independent build steps and caches layers more efficiently.
        DOCKER_BUILDKIT      = '1'
        COMPOSE_DOCKER_CLI_BUILD = '1'
    }

    options {
        // Abort the entire pipeline if it runs longer than 15 minutes.
        // Prevents a hung docker build from blocking the executor indefinitely.
        timeout(time: 15, unit: 'MINUTES')
        // Keep only the last 10 build logs to save disk space on jenkins_data volume.
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                // Exclude the jenkins service from the build — Jenkins should not
                // rebuild its own container from within a pipeline run.
                sh 'docker compose -f ${COMPOSE_FILE} build --no-cache db server client'
            }
        }

        stage('Deploy') {
            steps {
                // Bring up only the app services, not Jenkins itself.
                // --remove-orphans cleans up containers from previous runs whose
                // service definitions were removed from docker-compose.yml.
                sh 'docker compose -f ${COMPOSE_FILE} up -d --remove-orphans db server client'
            }
        }

        stage('Verify') {
            steps {
                // Give the server a few seconds to initialise the database,
                // then confirm it is responding before marking the build green.
                sh 'sleep 5'
                sh 'docker compose -f ${COMPOSE_FILE} ps'
            }
        }

    }

    post {
        success {
            echo '✅ Build and deployment succeeded. All services are running.'
        }
        failure {
            // Print container logs on failure so you can diagnose without
            // opening a separate terminal.
            sh 'docker compose -f ${COMPOSE_FILE} logs --tail=50 || true'
            echo '❌ Pipeline failed. Logs printed above.'
        }
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}
