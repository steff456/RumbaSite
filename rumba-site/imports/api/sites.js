import { Mongo } from 'meteor/mongo';

export const Sites = new Mongo.Collection('sites');

if (Meteor.isServer) {
    Meteor.publish('sites', () => Sites.find({}));
}

Meteor.methods({
    
});
