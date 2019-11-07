const {handlePullRequestChange} = require('./lib/handle-pull-request-change');

module.exports = (robot) => {
  robot.on([
    'pull_request.opened',
    'pull_request.reopened',
    'pull_request.edited',
    'pull_request.synchronize'
  ], handlePullRequestChange.bind(null, robot));
}
