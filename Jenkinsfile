pipeline {
  agent any

  environment {
    NODE_ENV = "production"
    REMOTE_HOST = 'usuario@IP_SERVIDOR_PRODUCCION'
    APP_DIR = '/home/usuario/app' // ruta en servidor de producción
  }

  tools {
    nodejs "Node18"
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        git 'https://github.com/Yessica-chavez/gestion-cursos-node.git'
      }
    }

    stage('SAST - Análisis de código (ESLint)') {
      steps {
        sh 'npm install eslint --save-dev'
        sh './node_modules/.bin/eslint src || true'
      }
    }

    stage('SCA - Análisis de dependencias') {
      steps {
        sh 'curl -L https://github.com/jeremylong/DependencyCheck/releases/download/v8.4.0/dependency-check-8.4.0-release.zip -o dc.zip'
        sh 'unzip dc.zip'
        sh './dependency-check/bin/dependency-check.sh --project gestion-cursos-node --scan . || true'
      }
    }

    stage('SBOM - Inventario de componentes') {
      steps {
        sh 'curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin'
        sh 'syft dir:. > sbom.json || true'
      }
    }

    stage('Construcción de imagen Docker') {
      steps {
        sh 'docker build -t gestion-cursos-node .'
      }
    }

    stage('Despliegue remoto por SSH') {
      steps {
        sshagent(credentials: ['clave-ssh-produccion']) {
          sh """
            ssh -o StrictHostKeyChecking=no \$REMOTE_HOST '
              mkdir -p \$APP_DIR &&
              docker stop gestion-cursos-node || true &&
              docker rm gestion-cursos-node || true
            '
            scp docker-compose.yml \$REMOTE_HOST:\$APP_DIR/
            scp -r . \$REMOTE_HOST:\$APP_DIR/
            ssh \$REMOTE_HOST 'cd \$APP_DIR && docker compose up -d --build'
          """
        }
      }
    }
  }
}
