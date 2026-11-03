pipeline {
    agent { label 'windows' }

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    parameters {
        string(name: 'BASE_URL', defaultValue: 'http://localhost:3000', description: 'Endereço do Hub de Leitura com interface e API acessíveis pelo agente Jenkins.')
    }

    stages {
        stage('Preparação do ambiente') {
            steps {
                checkout scm
                bat 'node --version && npm --version && git --version'
                dir('cypress/results') { deleteDir() }
                dir('cypress/screenshots') { deleteDir() }
                powershell '''
                    $ErrorActionPreference = 'Stop'
                    $response = Invoke-WebRequest -UseBasicParsing -Uri "$env:BASE_URL/catalog.html" -TimeoutSec 30
                    if ($response.StatusCode -ne 200 -or $response.Content -notmatch 'id="search-input"') {
                        throw 'O Hub de Leitura precisa estar iniciado com interface e API.'
                    }
                '''
            }
        }

        stage('Instalação das dependências') {
            steps {
                bat 'npm ci'
                bat 'set "ELECTRON_RUN_AS_NODE=" && npx cypress verify'
            }
        }

        stage('Execução dos testes automatizados') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'hub-leitura-usuario', usernameVariable: 'CYPRESS_USER_EMAIL', passwordVariable: 'CYPRESS_USER_SENHA'),
                    usernamePassword(credentialsId: 'hub-leitura-admin', usernameVariable: 'CYPRESS_ADMIN_EMAIL', passwordVariable: 'CYPRESS_ADMIN_SENHA')
                ]) {
                    bat 'set "ELECTRON_RUN_AS_NODE=" && npm run test:ci'
                }
            }
        }
    }

    post {
        always {
            junit testResults: 'cypress/results/*.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'cypress/results/*.xml,cypress/screenshots/**/*.png', allowEmptyArchive: true
        }
    }
}
