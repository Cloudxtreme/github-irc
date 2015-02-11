var express    = require('express');
var bodyParser = require('body-parser');
var crypto     = require('crypto');

function smartTrim(str, length, delim, appendix) {
    if (str.length <= length) {
        return str;
    }

    var trimmedStr     = str.substr(0, length+delim.length);
    var lastDelimIndex = trimmedStr.lastIndexOf(delim);

    if (lastDelimIndex >= 0) {
        trimmedStr = trimmedStr.substr(0, lastDelimIndex);
    }

    if (trimmedStr) {
        trimmedStr += appendix;
    }

    return trimmedStr;
}

var app = express();

app.use(bodyParser.json());

app.post('/', function (req, res) {
    var body      = JSON.stringify(req.body);

    var hmac      = crypto.createHmac('sha1', process.env.GITHUBTOKEN);
    var payload   = hmac.update(body);
    var signature = new Buffer(hmac.digest('hex')).toString();

    // Signatures are matching..
    if (req.headers['x-hub-signature'] === 'sha1=' + signature) {
        // Any time a Commit is commented on.
        if (req.headers['x-github-event'] === 'commit_comment') {
            console.log('[' + req.body['repository']['full_name'] + '] ' + req.body['comment']['user']['login'] + ' commented on commit #' + req.body['comment']['commit_id'].substring(0, 7) + ': ' + smartTrim(req.body['comment']['body'], 50, ' ', '...') + ' - ' + req.body['comment']['html_url']);
        }
        // Any time a Branch or Tag is created.
        else if (req.headers['x-github-event'] === 'create') {

        }
        // Any time a Branch or Tag is deleted.
        else if (req.headers['x-github-event'] === 'delete') {

        }
        // Any time a Repository has a new deployment created from the API.
        else if (req.headers['x-github-event'] === 'deployment') {
            console.log('[' + req.body['repository']['full_name'] + '] ' + req.body['sender']['login'] + ' updated the wiki page \'' + req.body['pages'][0]['page_name'] + '\' - ' + req.body['pages'][0]['html_url']);
        }
        // Any time a deployment for a Repository has a status update from the API.
        else if (req.headers['x-github-event'] === 'deployment_status') {
            console.log('[' + req.body['repository']['full_name'] + '] ' + req.body['comment']['user']['login'] + ' commented on issue #' + req.body['issue']['number'] + ': ' + smartTrim(req.body['comment']['body'], 50, ' ', '...') + ' - ' + req.body['comment']['html_url']);
        }
        // Any time a Repository is forked.
        else if (req.headers['x-github-event'] === 'fork') {
            console.log('[' + req.body['repository']['full_name'] + '] ' + req.body['issue']['user']['login'] + ' ' + req.body['action'] + ' issue #' + req.body['issue']['number'] + ': ' + req.body['issue']['title'] + ' - ' + req.body['issue']['html_url']);
        }
        // Any time a Wiki page is updated.
        else if (req.headers['x-github-event'] === 'gollum') {

        }
        // Any time an Issue is commented on.
        else if (req.headers['x-github-event'] === 'issue_comment') {

        }
        // Any time an Issue is assigned, unassigned, labeled, unlabeled, opened, closed, or reopened.
        else if (req.headers['x-github-event'] === 'issues') {

        }
        // Any time a User is added as a collaborator to a non-Organization Repository.
        else if (req.headers['x-github-event'] === 'member') {

        }
        // Any time a User is added or removed from a team. Organization hooks only.
        else if (req.headers['x-github-event'] === 'membership') {

        }
        // Any time a Pages site is built or results in a failed build.
        else if (req.headers['x-github-event'] === 'page_build') {

        }
        // Any time a Repository changes from private to public.
        else if (req.headers['x-github-event'] === 'public') {

        }
        // Any time a Commit is commented on while inside a Pull Request review (the Files Changed tab).
        else if (req.headers['x-github-event'] === 'pull_request_review_comment') {
            console.log('[' + req.body['repository']['full_name'] + '] ' + req.body['comment']['user']['login'] + ' commented on pull request #' + req.body['pull_request']['number'] + ': ' + smartTrim(req.body['comment']['body'], 50, ' ', '...') + ' (' + req.body['pull_request']['base']['sha'].substring(0, 7) + ') - ' + req.body['comment']['html_url']);
        }
        // Any time a Pull Request is assigned, unassigned, labeled, unlabeled, opened, closed,
        // reopened, or synchronized (updated due to a new push in the branch that the pull request is tracking).
        else if (req.headers['x-github-event'] === 'pull_request') {
            console.log('[' + req.body['repository']['full_name'] + '] ' + req.body['pull_request']['user']['login'] + ' ' + req.body['action'] + ' pull request #' + req.body['pull_request']['number'] + ': ' + req.body['pull_request']['title'] + ' [' + req.body['pull_request']['base']['ref'] + '/' + req.body['pull_request']['head']['ref'] + '] - ' + req.body['pull_request']['html_url']);
        }
        // Any Git push to a Repository, including editing tags or branches. Commits via API actions that
        // update references are also counted. This is the default event.
        else if (req.headers['x-github-event'] === 'push') {
            var message = [];

            message.push('[' + req.body['repository']['full_name'] + '] ' + req.body['pusher']['name']);

            if (req.body['created']) {
                if (req.body['ref'].indexOf('refs/tags') >= 0) {
                    message.push('tagged ' + req.body['ref'].split('/')[2] + ' at ' + req.body['after'].substring(0, 7) + ' - ' + req.body['repository']['html_url'] + '/tags');
                }
                else {
                    message.push('created ' + req.body['ref'].split('/')[2]);

                    if (req.body['base_ref']) {
                        message.push('from ' + req.body['base_ref'].split('/')[2]);
                    }
                    else if (req.body['head_commit']['distinct']) {
                        message.push('at ' + req.body['after'].substring(0, 7));
                    }

                    if (req.body['commits'].length >= 1) {
                        message.push(req.body['commits'].length + ' new commit(s) - ' + req.body['head_commit']['url']);
                    }
                }
            }
            else if (req.body['deleted']) {
                message.push('deleted ' + req.body['ref'].split('/')[2] + ' at ' + req.body['before'].substring(0, 7));
            }
            else if (req.body['forced']) {
                message.push('deleted ' + req.body['ref'].split('/')[2] + ' from ' + req.body['before'].substring(0, 7) + ' to ' + req.body['after'].substring(0, 7));
            }
            else if (req.body['commits'].length >= 1 && !req.body['head_commit']['distinct']) {
                if (req.body['base_ref']) {
                    message.push('merged ' + req.body['base_ref'].split('/')[2] + ' into ' + req.body['ref'].split('/')[2]);
                }
                else {
                    message.push('fast-forwarded ' + req.body['ref'].split('/')[2] + ' from ' + req.body['before'].substring(0, 7) + ' to ' + req.body['after'].substring(0, 7));
                }
            }
            else {
                message.push('pushed ' + req.body['commits'].length + ' new commit(s) to ' + req.body['ref'].split('/')[2] + ' - ' + req.body['head_commit']['url']);
            }

            console.log(message.join(' '));
        }
        // Any time a Repository is created. Organization hooks only.
        else if (req.headers['x-github-event'] === 'repository') {

        }
        // Any time a Release is published in a Repository.
        else if (req.headers['x-github-event'] === 'release') {

        }
        // Any time a Repository has a status update from the API
        else if (req.headers['x-github-event'] === 'status') {

        }
        // Any time a team is added or modified on a Repository.
        else if (req.headers['x-github-event'] === 'team_add') {

        }
        // Any time a User watches a Repository.
        else if (req.headers['x-github-event'] === 'watch') {

        }
    }

    res.send({});
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port)

});