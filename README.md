# github-irc

### This project is still in development

At this time, our focus isn't on the IRC connection but reading the code we are receiving from the web hooks. Once each and every events are done, we will be working on the configuration and the IRC connection.

Our goal is to make it easy to create a bot on IRC that displays events happening in a repository. Everything should be customizable and user-friendly.

If you would like to contribute to this project, here is what you got to do first:

- Create a repository for your tests. (Can be private or public)
- Click Settings and then Webhooks & Services.
- Payload URL should be ``http://255.255.255.255:3000``. (Change to your IP)
- Content type: application/json.
- Choose a secret token.
- For development purpose, choose Send me everything.
- Add webhook.
- Now, depending on your OS, set your secret token in the GITHUBTOKEN environment variable. (Search on Google is you need help with this)
 
### Todo list

- Generate output for each and every events possible.
- Make sure everything is secure by following this [guide](https://developer.github.com/webhooks/securing/).
- Configuration allowing to choose what needs to be sent on IRC.
- Configuration for the IRC client.
- Code optimization.