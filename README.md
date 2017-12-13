# Introduction to Salesforce DX - DevTrails Zürich

This repo is a clone of https://github.com/Szandor72/LightningWorkbench stripped to bare DX basics. The original packaged source can be found in `./packaged`

## Dev, Build and Test - all in one push
We will be using circle ci 2.0 for the purposes of this demo. All the amazing stuff you can do with DX is somewhat `screencast scripted` in `commands.txt` - you can follow along easily. There's also some best practices shared in there.

In order to get Continuous Integration up and running, create a connected app, a server.crt and server.key following these steps: https://trailhead.salesforce.com/modules/sfdx_travis_ci/units/sfdx_travis_ci_connected_app

Important: Do not use 'all user may self authorize'. Use Profiles or Permission Sets. 

## Circle CI 

We will need to set up a few environment variables in Circle CI in order to securly store our credentials.

- First create a hex version of your server key (bash)
'$ xxd -p server.key >> server.key.hex'

Go to https://circleci.com, sign up with your github account and add your new project.    

Now add the following environment vars at
 https://circleci.com/gh/$GithubUsername$/$RepositoryName$/edit#env-vars 

- DX_USERNAME: your dev-hub username
- DX_CONSUMER_KEY: the connected app's consumer key
- SSL_SERVER_KEY_HEX: the content of `server.key.hex`

CircleCI 2.0 is pretty straigtht forward to read without any prior experience. That's a huge improvement in comparison to 1.0. Have a look at `.circleci/config.yml`

## Resources
https://trailhead.salesforce.com/en/trails/sfdx_get_started
https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_connected_app.htm
- there's a setting you can use to specify oAuth port on `oauthLocalPort`
https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm

##DX Plugins to check out
DX can be extended in various ways, here are my two current favourites

- https://www.npmjs.com/package/sfdx-l18n-plugin
A plugin for the Salesforce CLI built by Mikkel Flindt Heisterberg to allow you to update the localization values on the created users object. This allows you to set the user interface language, the locale of the user (date/time formats) and the timezone of the user from the command line.

- https://www.npmjs.com/package/sfdx-msm-plugin
lots of supercool utilities. E.g. Retrieving a package, unzipping, converting
