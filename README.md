
# check-pull-request-app

A simple Github App to check pull request and merge them automatically

# Setup

* Add a .pem file for Github API usage

* Add an .env file or the env variables for:

```bash
WEBHOOK_SECRET=<GIthub App Webhook secret>
APP_ID=<Github App ID>
NODE_ENV=production
PRIVATE_KEY_PATH=<path to .pem file for Github Api authentication>
```

# Based on *Semantic Pull Requests*

> GitHub status check that ensures your pull requests follow the Conventional Commits spec

Using [semantic-release](https://github.com/semantic-release/semantic-release)
and [conventional commit messages](https://conventionalcommits.org)? Install this
[Probot](https://probot.github.io/) app
on your repos to ensure your pull requests are semantic before you merge them.

* [Semantic Pull Requests](https://github.com/probot/semantic-pull-requests)

# Based on *automerge*

* [Automerge](https://github.com/dropseed/automerge)

## License

[Apache 2.0](LICENSE)

[conventional commit type]: https://github.com/commitizen/conventional-commit-types/blob/master/index.json
