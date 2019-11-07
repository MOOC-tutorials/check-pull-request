
const fs = require('fs');
const yaml = require('js-yaml');

// Valid repositories where the bot has actions to do
const VALID_REPOSITORIES = ['pull_web_practice'];
exports.VALID_REPOSITORIES = VALID_REPOSITORIES;

//Get the config of activities for the given repo
exports.getConfig = function(repoName){
    if(VALID_REPOSITORIES.indexOf(repoName) >= 0){
      try{
        const data = fs.readFileSync(__dirname + '/config_' + repoName + '.yml');
        const config = yaml.safeLoad(data);
        return config;
      } catch(err){
        return {}; 
      }
    }
};

// Modifiers and validators by type
const DOM = 'DOM';
const {domValidation, domModification} = require('./logic/dom');


exports.validators = {[DOM]: domValidation};

