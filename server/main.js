import { Meteor } from 'meteor/meteor';
import '../imports/api/sites.js';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {
  // code to run on server at startup
});

if(Meteor.isServer){
  Accounts.onCreateUser((options, user) =>{
    console.log(options);
    if(options.roles){
      user.roles = options.roles;
      return user;
    }
    else{
      throw new Meteor.Error("no-role","Missing role in user");
    }
  });
}
