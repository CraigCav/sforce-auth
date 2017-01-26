##&lt;sforce-auth&gt;
The `sforce-auth` element provides an easy way to initiate authentication with Salesforce. This element provides a lighter-weight alternative to the `force-signin` element in Salesforce's [mobile-ui-elements](https://github.com/forcedotcom/mobile-ui-elements) project, which has dependencies on several third-party libraries including: Polymer, jQuery, Backbone, Underscore and Ratchet.

##Dependencies
This webcomponent is built using [Polymer](http://www.polymer-project.org/). There are no other third-party dependencies.

##Usage
`sforce-auth` is a wrapper around the [Salesforce REST api](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm). It notifies successful authentication, provides an oauth access token, and handles both redirect and popup based OAuth workflows.

Example:
```html
<sforce-auth id="auth"
  consumer-key="CONSUMER_KEY"
  redirect-url="http://localhost:3000/oauth/_callback"></sforce-auth>
```
JavaScript sign-in calls can then be made to the `sforce-auth` object to attempt authentication, e.g.:
```js
this.$.auth.signInWithPopup()
  .then(function(response) {// successful authentication response here});
```
Alternatively, the `auto` attribute can be used to trigger an authentication attempt as soon as the component is ready.
```html
<sforce-auth id="auth" auto use-popup-window
  consumer-key="CONSUMER_KEY"
  redirect-url="http://localhost:3000/oauth/_callback"></sforce-auth>
```
Supported attributes include:
  - `auto`: (Optional) Automatically trigger user authentication as soon as the component is ready. If `oauth` is set via attributes, authentication will not trigger automatically (it is assumed the user is already signed in).
  - `consumer-key`: Consumer key for initiating OAuth based salesforce authentication. 
  - `redirect-url`: Callback URL property for OAuth based authentication [(User-Agent OAuth Authentication Flow)](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_understanding_user_agent_oauth_flow.htm).
  - `login-url`: (Optional) Login Host for salesforce authentication. Default value is https://login.salesforce.com
  - `use-popup-window`: (Optional) Set as true if you want OAuth flow to be started in a new child window. By default, the OAuth flow will be made via a redirect to the salesforce login.
  - `oauth`: The Salesforce OAuth token for making API requests. It is set by the component after successful completion of Salesforce OAuth.

  Methods:
  - `signInWithPopup`: Triggers an authentication attempt in a new child window.
  - `signInWithRedirect`: Triggers an authentication attempt via a redirect to the Salesforce login screen.
  - `signOut`: Terminates the current user's session.

  Events:
  - `success`: when the OAuth flow is successfully completed and the OAuth access_token is obtained from Salesforce.
  - `error`: when OAuth flow ends in an error.