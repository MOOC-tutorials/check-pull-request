const handlePullRequestChange = require('../lib/handle-pull-request-change')
const nock = require('nock')
const github = require('@octokit/rest')()

// prevent all network activity to ensure mocks are used
nock.disableNetConnect()

// TODO: Reimplement tests

function unsemanticCommits () {
  return [
    { commit: { message: 'fix something' } },
    { commit: { message: 'fix something else' } }
  ]
}

function semanticCommits () {
  return [
    { commit: { message: 'build(scope1): something' } },
    { commit: { message: 'build(scope2): something else' } }
  ]
}

function buildContext (overrides) {
  const defaults = {
    log: () => { /* no-op */ },

    // an instantiated GitHub client like the one probot provides
    github: github,

    // context.repo() is a probot convenience function
    repo: (obj = {}) => {
      return Object.assign({ owner: 'sally', repo: 'project-x' }, obj)
    },

    payload: {
      pull_request: {
        number: 123,
        title: 'do a thing',
        head: {
          sha: 'abcdefg'
        }
      }
    }
  }

  return Object.assign({}, defaults, overrides)
}

function getConfigResponse (content = '') {
  return { content: Buffer.from(content).toString('base64') }
}
