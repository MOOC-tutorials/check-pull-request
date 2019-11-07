const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.domValidation = function(htmlText, fileExtension, checkData){
    const {querySelector, exists, attribute} = checkData;
    const {document} = (new JSDOM(htmlText)).window;
    try{
        if(fileExtension !== '.html') return true;
        let selector = document.querySelector(querySelector);
        let actualValue = selector;
        if(selector && attribute) actualValue = selector[attribute];
        console.log(actualValue);
        console.log(exists);
        return actualValue && exists;
    } catch(err) {
      console.error(err);
      return false;
    }
};