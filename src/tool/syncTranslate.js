/**
 *  USAGE :
 *  Must execute under tool folder
 *   node .\syncTranslate.js zh
 *   Using Translation API v3 translate between 1–500,000 characters is FREE
 *
 * */

// Imports the Google Cloud client library
const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1,
  PROJECT_ID = 'vaganda-2',
  KEY_FILENAME = '/www/key.json';

let fs = require('fs'),
  path = require('path'),
  namespaces = ['seller'], //['global', 'home', 'permission', 'seller'],
  languages = ['en', 'zh'],
  client = new TranslationServiceClient({
    projectId: PROJECT_ID,
    keyFilename: KEY_FILENAME
  }),
  getFilepathByTarget = (target, namespace) => {
    let fileSuffix = '.json',
      folderpath = '../lang',
      filename = namespace + fileSuffix,
      filepath;

    switch (target) {
      case 'en':
        filepath = folderpath + '/en/' + filename;
        break;
      case 'zh':
        filepath = folderpath + '/zh/' + filename;
        break;
    }
    return filepath;
  },
  readFileByTarget = (target, namespace) => {
    return fs.readFileSync(getFilepathByTarget(target, namespace), {
      encoding: 'utf8'
    });
  },
  writeFileByTarget = (target, namespace, content) => {
    fs.writeFileSync(getFilepathByTarget(target, namespace), content, {
      encoding: 'utf8'
    });
  },
  getTranslationPrefix = fileContent => {
    // Remove parenthesis
    fileContent = fileContent.substring(1);
    fileContent = fileContent.replace(/.$/, '');

    let translationArray = fileContent.split(/\r\n|\n|\r/).filter(Boolean);
    if (translationArray.length) {
      return (
        (translationArray[0].substr(0, translationArray[0].indexOf('"')) ===
        '\t'
          ? '\t'
          : new Array(translationArray[0].search(/\S|$/) + 1).join(' ')) + '"'
      );
    } else {
      return '  "';
    }
  },
  getTranslationKeysArray = fileContent => {
    let objectDepth = 0;
    let translationPrefix = getTranslationPrefix(fileContent);
    // Remove parenthesis
    fileContent = fileContent.substring(1);
    fileContent = fileContent.replace(/.$/, '');

    let translationArray = fileContent.split(/\r\n|\n|\r/).filter(Boolean);
    return translationArray.map((translationLine, index) => {
      let translationString = translationLine;
      let prefix =
        new Array(objectDepth * 2).fill(' ').join('') + translationPrefix;

      // console.log('translationString', translationString)
      if (
        translationString.trim() === '}' ||
        translationString.trim() === '},'
      ) {
        objectDepth--;
        return {
          isObjectClose: true,
          objectDepth: objectDepth
        };
      } else if (translationString.trim().substr(-1) === '{') {
        let splitArray = translationString.split('": ');
        let tempObjectDepth = objectDepth;
        objectDepth++;
        return {
          key: splitArray[0].replace(prefix, ''),
          isObjectOpen: true,
          objectDepth: tempObjectDepth
        };
      } else {
        if (translationArray.length !== index + 1) {
          translationString = translationString.replace(/.$/, '');
        }
        let splitArray = translationString.split('": "');
        let value = splitArray[1];

        if (value[value.length - 1] === ',') {
          value = value.replace(/.$/, '');
        }

        if (value[value.length - 1] === '"') {
          value = value.replace(/.$/, '');
        }
        return {
          key: splitArray[0].replace(prefix, '').replace(/^\s+/, ''),
          value: value,
          objectDepth: objectDepth
        };
      }
    });
  },
  insertTranslationToFileContent = (
    fileContent,
    prefix,
    key,
    translatedText,
    prependCommaString
  ) => {
    if (fileContent === '') {
      let translationContent = prefix + key + '": "' + translatedText + '"';
      fileContent = fileContent + translationContent;
    } else {
      let translationContent =
        '\n' + prefix + key + '": "' + translatedText + '"';
      fileContent = fileContent + prependCommaString + translationContent;
    }

    return fileContent;
  },
  syncTranslation = async target => {
    for (const namespace of namespaces) {
      let sourceFileContent = readFileByTarget('en', namespace);
      let targetFileContent = readFileByTarget(target, namespace);
      let translationPrefix = getTranslationPrefix(sourceFileContent);
      let targetFileTranslationKeysArray = getTranslationKeysArray(
        targetFileContent
      );
      let newFileContent = '';
      // console.log('targetFileTranslationKeysArray', targetFileTranslationKeysArray)
      let translationKeysArray = getTranslationKeysArray(sourceFileContent);
      // console.log('translationKeysArray', translationKeysArray)
      let index = 0;
      for (const translationObj of translationKeysArray) {
        let {
          key,
          value,
          isObjectOpen,
          isObjectClose,
          objectDepth
        } = translationObj;
        let prependCommaString = ',';
        let prefix =
          new Array(objectDepth * 2).fill(' ').join('') + translationPrefix;

        // Dont prepend comma if last item is object open
        if (index !== 0 && translationKeysArray[index - 1].isObjectOpen) {
          prependCommaString = '';
        }

        if (isObjectClose) {
          newFileContent = newFileContent + '\n' + '  }';
        } else if (key && isObjectOpen) {
          if (newFileContent === '') {
            newFileContent = prefix + key + '": {';
          } else {
            let translationContent = '\n' + prefix + key + '": {';
            newFileContent =
              newFileContent + prependCommaString + translationContent;
          }
        } else if (key && value) {
          let existingTranslation = targetFileTranslationKeysArray.find(
            obj => obj.key === key && !obj.isObjectClose && !obj.isObjectOpen
          );

          if (existingTranslation) {
            newFileContent = insertTranslationToFileContent(
              newFileContent,
              prefix,
              existingTranslation.key,
              existingTranslation.value,
              prependCommaString
            );
            console.log(
              `${key} IN [${target}] already exists, skip translation`
            );
          } else {
            await client
              .translateText({
                parent: client.locationPath(PROJECT_ID, 'global'),
                contents: [value],
                mimeType: 'text/plain',
                targetLanguageCode: target
              })
              .then(responses => {
                const translatedText =
                  responses[0].translations[0].translatedText;
                newFileContent = insertTranslationToFileContent(
                  newFileContent,
                  prefix,
                  key,
                  translatedText,
                  prependCommaString,
                  prefix,
                  key,
                  translatedText,
                  prependCommaString
                );
                console.log(`${key} IN [${target}] : ${translatedText}`);
              })
              .catch(err => {
                console.error(err);
              });
          }
        }

        index++;
      }

      // Add back parenthesis
      newFileContent = '{\n' + newFileContent + '\n}';

      writeFileByTarget(target, namespace, newFileContent);
    }
  };

if (!process.argv[2]) {
  console.error('Please enter target language');
} else {
  let target = process.argv[2];

  if (!languages.includes(target)) {
    console.error('Invalid target language');
  } else {
    syncTranslation(target);
  }
}
