DRUPAL_MAPPING = [
  'dev': 'vagovdev',
  'staging': 'vagovstaging',
  'prod': 'vagovprod',
]

DRUPAL_ADDRESSES = [
  'vagovdev'    : 'http://internal-dsva-vagov-dev-cms-812329399.us-gov-west-1.elb.amazonaws.com',
  'vagovstaging': 'http://internal-dsva-vagov-staging-cms-1188006.us-gov-west-1.elb.amazonaws.com',
  'vagovprod'   : 'http://internal-dsva-vagov-prod-cms-2000800896.us-gov-west-1.elb.amazonaws.com',
]

DRUPAL_CREDENTIALS = [
  'vagovdev'    : 'drupal-dev',
  'vagovstaging': 'drupal-staging',
  'vagovprod'   : 'drupal-prod',
]

ALL_VAGOV_BUILDTYPES = [
  'vagovdev',
  'vagovstaging',
  'vagovprod'
]

BUILD_TYPE_OVERRIDE = DRUPAL_MAPPING.get(params.cmsEnvBuildOverride, null)

VAGOV_BUILDTYPES = BUILD_TYPE_OVERRIDE ? [BUILD_TYPE_OVERRIDE] : ALL_VAGOV_BUILDTYPES

DEV_BRANCH = 'master'
STAGING_BRANCH = 'master'
PROD_BRANCH = 'master'

IS_DEV_BRANCH = env.BRANCH_NAME == DEV_BRANCH
IS_STAGING_BRANCH = env.BRANCH_NAME == STAGING_BRANCH
IS_PROD_BRANCH = env.BRANCH_NAME == PROD_BRANCH

DOCKER_ARGS = "-v ${WORKSPACE}/vets-website:/application -v ${WORKSPACE}/vagov-content:/vagov-content"
IMAGE_TAG = java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")
DOCKER_TAG = "vets-website:" + IMAGE_TAG

def isReviewable() {
  return !IS_DEV_BRANCH && !IS_STAGING_BRANCH && !IS_PROD_BRANCH
}

def isDeployable() {
  return (IS_DEV_BRANCH ||
          IS_STAGING_BRANCH) &&
    !env.CHANGE_TARGET &&
    !currentBuild.nextBuild // if there's a later build on this job (branch), don't deploy
}

def shouldBail() {
  // abort the job if we're not on deployable branch (usually master) and there's a newer build going now
  return !IS_DEV_BRANCH &&
    !IS_STAGING_BRANCH &&
    !IS_PROD_BRANCH &&
    !env.CHANGE_TARGET &&
    currentBuild.nextBuild
}

def runDeploy(String jobName, String ref, boolean waitForDeploy) {
  build job: jobName, parameters: [
    booleanParam(name: 'notify_slack', value: true),
    stringParam(name: 'ref', value: ref),
  ], wait: waitForDeploy
}

def buildDetails(String buildtype, String ref) {
  return """\
BUILDTYPE=${buildtype}
NODE_ENV=production
BRANCH_NAME=${env.BRANCH_NAME}
CHANGE_TARGET=${env.CHANGE_TARGET}
BUILD_ID=${env.BUILD_ID}
BUILD_NUMBER=${env.BUILD_NUMBER}
REF=${ref}
"""
}

def slackNotify() {
  if (IS_DEV_BRANCH || IS_STAGING_BRANCH || IS_PROD_BRANCH) {
    message = "vets-website ${env.BRANCH_NAME} branch CI failed. |${env.RUN_DISPLAY_URL}".stripMargin()
    slackSend message: message,
      color: 'danger',
      failOnError: true
  }
}

def puppeteerNotification() {
  message = "(Testing) @chris.valarida: `${env.BRANCH_NAME}` failed the puppeteer tests. |${env.RUN_DISPLAY_URL}".stripMargin()
  slackSend message: message,
    color: 'danger',
    failOnError: true
}

def slackIntegrationNotify() {
  message = "(Testing) @jbalboni: integration tests failed. |${env.RUN_DISPLAY_URL}".stripMargin()
  slackSend message: message,
    color: 'danger',
    failOnError: true
}

def slackCachedContent(envName) {
  message = "vets-website built with cached Drupal data for ${envName}. |${env.RUN_DISPLAY_URL}".stripMargin()
  slackSend message: message,
    color: 'warning',
    failOnError: true
}

def setup() {
  stage("Setup") {

    dir("vagov-content") {
      checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: true, reference: '', shallow: true]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'va-bot', url: 'git@github.com:department-of-veterans-affairs/vagov-content.git']]]
    }

    dir("vets-website") {
      sh "mkdir -p build"
      sh "mkdir -p logs/selenium"
      sh "mkdir -p coverage"
      sh "mkdir -p temp"

      dockerImage = docker.build(DOCKER_TAG)
      retry(5) {
        dockerImage.inside(DOCKER_ARGS) {
          sh "cd /application && yarn install --production=false"
        }
      }
      return dockerImage
    }
  }
}

def build(String ref, dockerContainer, String assetSource, String envName, Boolean useCache) {
  def buildDetails = buildDetails(envName, ref)
  def drupalAddress = DRUPAL_ADDRESSES.get(envName)
  def drupalCred = DRUPAL_CREDENTIALS.get(envName)
  def drupalMode = useCache ? '' : '--pull-drupal'

  withCredentials([usernamePassword(credentialsId:  "${drupalCred}", usernameVariable: 'DRUPAL_USERNAME', passwordVariable: 'DRUPAL_PASSWORD')]) {
    dockerContainer.inside(DOCKER_ARGS) {
      sh "cd /application && npm --no-color run build -- --buildtype=${envName} --asset-source=${assetSource} --drupal-address=${drupalAddress} ${drupalMode}"
      sh "cd /application && echo \"${buildDetails}\" > build/${envName}/BUILD.txt"
    }
  }
}

def buildAll(String ref, dockerContainer, Boolean contentOnlyBuild) {
  stage("Build") {
    if (shouldBail()) { return }

    try {
      def builds = [:]
      def envUsedCache = [:]
      def assetSource = contentOnlyBuild ? ref : 'local'

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)
        builds[envName] = {
          try {
            build(ref, dockerContainer, assetSource, envName, false)
            envUsedCache[envName] = false
          } catch (error) {
            // We're not using the cache for content only builds, because requesting
            // a content only build is an attempt to refresh content from the current set
            if (!contentOnlyBuild) {
              dockerContainer.inside(DOCKER_ARGS) {
                sh "cd /application && node script/drupal-aws-cache.js --fetch --buildtype=${envName}"
              }
              build(ref, dockerContainer, assetSource, envName, true)
              envUsedCache[envName] = true
            } else {
              build(ref, dockerContainer, assetSource, envName, false)
              envUsedCache[envName] = false
            }
          }
        }
      }

      parallel builds
      return envUsedCache
    } catch (error) {
      slackNotify()
      throw error
    }
  }
}

def prearchive(dockerContainer, envName) {
  dockerContainer.inside(DOCKER_ARGS) {
    sh "cd /application && node script/prearchive.js --buildtype=${envName}"
  }
}

def prearchiveAll(dockerContainer) {
  stage("Prearchive Optimizations") {
    if (shouldBail()) { return }

    try {
      def builds = [:]

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)

        builds[envName] = {
          prearchive(dockerContainer, envName)
        }
      }

      parallel builds
    } catch (error) {
      slackNotify()
      throw error
    }
  }
}

def archive(dockerContainer, String ref, String envName) {
  dockerContainer.inside(DOCKER_ARGS) {
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                     usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
      sh "tar -C /application/build/${envName} -cf /application/build/${envName}.tar.bz2 ."
      sh "s3-cli put --acl-public --region us-gov-west-1 /application/build/${envName}.tar.bz2 s3://vetsgov-website-builds-s3-upload/${ref}/${envName}.tar.bz2"
    }
  }
}

def archiveAll(dockerContainer, String ref) {
  stage("Archive") {
    if (shouldBail()) { return }

    try {
      def archives = [:]

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)

        archives[envName] = {
          archive(dockerContainer, ref, envName)
        }
      }

      parallel archives

    } catch (error) {
      slackNotify()
      throw error
    }
  }
}

def cacheDrupalContent(dockerContainer, envUsedCache) {
  stage("Cache Drupal Content") {
    if (!isDeployable()) { return }

    try {
      def archives = [:]

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)

        if (!envUsedCache[envName]) {
          dockerContainer.inside(DOCKER_ARGS) {
            sh "cd /application && node script/drupal-aws-cache.js --buildtype=${envName}"
          }
        } else {
          slackCachedContent(envName)
        }
      }

      dockerContainer.inside(DOCKER_ARGS) {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                         usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
          sh "s3-cli sync --acl-public --region us-gov-west-1 /application/.cache/content s3://vetsgov-website-builds-s3-upload/content/"
        }
      }
    } catch (error) {
      slackNotify()
      throw error
    }
  }
}

return this;
