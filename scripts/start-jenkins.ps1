param([int]$Port = 8080)

$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
$jenkinsPath = Join-Path $projectPath '.jenkins-local'
$warPath = Join-Path $jenkinsPath 'jenkins.war'

if (-not (Test-Path -LiteralPath $warPath)) {
    throw 'Baixe o jenkins.war LTS oficial para .jenkins-local/jenkins.war. Consulte o README.'
}

$env:JENKINS_HOME = Join-Path $jenkinsPath 'home'
& java -jar $warPath "--httpPort=$Port" '--httpListenAddress=127.0.0.1'
exit $LASTEXITCODE
