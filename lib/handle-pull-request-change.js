const {getConfig, validators} = require('../config/config');
const path = require('path');

const validateExtension = (filename, fileExtensions) => {
  const extension = path.extname(filename);
  const validExtension = fileExtensions.includes(extension);
  return {validExtension, extension};
}

const validateFileContent = (content, validations) => {
  let validFile = true;
  for (let i = 0; i< validations.length; i++) {
    const validation = validations[i];
    const {type, fileExtension, expectedValues} = validation;
    for (let j = 0; j < expectedValues.length; j++) {
      const expectedValue = expectedValues[j];
      // Use validator to check file content
      validFile = validators[type](content, fileExtension, expectedValue);
      if(!validFile){
        break
      }
    }
  }
  return validFile;
};

const validateFile = async (context, data) => {
  const {repo,
         owner,
         ref,
         path,
         invalidMessage,
         invalidExtensionMessage,
         validations,
         validFileExtensions} = data;
  const api = context.github;
  let validFile = false;
  let invalidCause = '';
  const {validExtension,
         extension} = validateExtension(path,
                                        validFileExtensions);
  if(!validExtension){
    // Validate file extension
    validFile = validExtension;
    invalidCause += invalidExtensionMessage + '\n\n'
                    + 'Se encontró un cambio en un archivo con la extensión: ' + extension
                    + '.\n\nLas extensiones válidas son las siguientes: '
                    + validFileExtensions;  
  } else {
    // Get file content and validate
    const fileContent = await api.repos.getContents({
      owner,
      repo,
      path,
      ref
    });
    context.log(fileContent);
    let {content} = fileContent.data;
    content = new Buffer(content, 'base64').toString();
    validFile = validateFileContent(content, validations);
    if (!validFile) invalidCause = invalidMessage + '\n\nArchivo inválido: ' + path;
  }
  return {validFile, invalidCause};
};

exports.handlePullRequestChange = async (robot, context) => {
  const {isBot} = context;
  const api = context.github;
  let result = {};
  if(!isBot){
    const { head, base, number } = context.payload.pull_request
    const headRef = head.ref
    const headRepo = head.repo.name;
    const headOwner = head.repo.owner.login;
    const repoName = base.repo.name;
    const repoOwner = base.repo.owner.login;
    const {
      invalidMessage,
      invalidExtensionMessage,
      mergeMessage,
      validations,
      validFileExtensions,
      supportedOperations,
      invalidOperationMessage
    } = getConfig(repoName);
    
    // TODO:
    // Get files added/deleted/modified from head
    // Validate
    // Merge if approve valid else request changes on PR

    const files = await api.pulls.listFiles({
      owner: repoOwner,
      repo: repoName,
      pull_number: number
    });
    context.log(files.data);
    const exitsFilesInvalidStatus = files.data.some( file => !supportedOperations.includes(file.status));
    if(exitsFilesInvalidStatus){
      // TODO: Validate all file operations are valid (added, deleted, created, etc) 
      result = await api.pulls.createReview({
        owner: repoOwner,
        repo: repoName,
        pull_number: number,
        body: invalidOperationMessage + '\n\nLas operaciones válidas sobre los archivos son: '
              + supportedOperations,
        event: "REQUEST_CHANGES"
      });
    }
    
    let validFile, invalidCause;
    for (let index = 0; index < files.data.length; index++) {
      const file = files.data[index];
      const {filename} = file;
      const data = {
        repo: headRepo,
        owner: headOwner,
        ref: headRef,
        path: filename,
        invalidMessage,
        invalidExtensionMessage,
        validations,
        validFileExtensions
        };
      ({validFile, invalidCause} = await validateFile(context, data));
      if(!validFile){
        break;
      }
    }
    if(validFile){
      // Merge
      await api.pulls.createReview({
        owner: repoOwner,
        repo: repoName,
        pull_number: number,
        body: mergeMessage,
        event: "APPROVE"
      });  
      result = await api.pulls.merge({
        owner: repoOwner,
        repo: repoName,
        pull_number: number
      });
    } else if (invalidCause) {
      // Review explaining invalid cause
      result = await api.pulls.createReview({
        owner: repoOwner,
        repo: repoName,
        pull_number: number,
        body: invalidCause,
        event: "REQUEST_CHANGES"
      });
    }
  }
  return result;
};
