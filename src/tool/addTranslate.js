/**
 *  USAGE :
 *  Must execute under tool folder
 *  node .\addTranslate.js home 'hello world' 'Hello world'
 *  Using Translation API v3 translate between 1–500,000 characters is FREE
 *
 * */

// Imports the Google Cloud client library
const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;

const PROJECT_ID = 'vaganda-2';
const KEY_FILENAME = '/www/key.json';

const fs = require('fs');
const path = require('path');

const targetLanguages = ['en', 'zh'],
  getFilepathByTarget = (target, namespace) => {
    const fileSuffix = '.json';
    const folderpath = '../lang';
    const filename = namespace + fileSuffix;
    let filepath;

    switch (target) {
      case 'en':
        filepath = `${folderpath}/en/${filename}`;
        break;
      case 'zh':
        filepath = `${folderpath}/zh/${filename}`;
        break;
    }
    return filepath;
  };
const readFileByTarget = (target, namespace) =>
  fs.readFileSync(getFilepathByTarget(target, namespace), { encoding: 'utf8' });
const writeFileByTarget = (target, namespace, content) => {
  fs.writeFileSync(getFilepathByTarget(target, namespace), content, {
    encoding: 'utf8'
  });
};
const insertTranslationToFileContent = (
  namespace,
  innerNamespace,
  target,
  fileContent,
  key,
  translatedString
) => {
  // Remove file end line break
  fileContent = fileContent.replace(/\n$/, '');
  // Remove parenthesis
  fileContent = fileContent.substring(1);
  fileContent = fileContent.replace(/.$/, '');

  const translationArray = fileContent.split(/\r\n|\n|\r/).filter(Boolean);
  const translationPrefix = `${
    translationArray[0].substr(0, translationArray[0].indexOf('"')) === '\t'
      ? '\t'
      : new Array(translationArray[0].search(/\S|$/) + 1).join(' ')
  }"`;

  if (innerNamespace) {
    const translationContent = `${translationPrefix +
      key}": "${translatedString}"`;
    const namespaceOpen = `${translationPrefix}${innerNamespace}": {`;
    const namespaceOpenIndex = fileContent.indexOf(namespaceOpen);
    const namespaceClose = '  }';
    let namespaceCloseIndex;
    const partFileContent = fileContent.substr(
      namespaceOpenIndex + namespaceOpen.length
    );

    if (partFileContent.indexOf(namespaceClose) !== -1) {
      namespaceCloseIndex = partFileContent.indexOf(namespaceClose);
    } else {
      namespaceCloseIndex = partFileContent.indexOf(`${namespaceClose},`);
    }

    if (namespaceOpenIndex !== -1 && namespaceCloseIndex !== -1) {
      // namespace already exists
      const insertIndex = namespaceOpen.length + namespaceOpenIndex;

      let newFileContent = fileContent.substr(0, insertIndex);
      newFileContent += fileContent
        .substr(insertIndex, namespaceCloseIndex)
        .replace(/\n$/, '');
      newFileContent += `,\n  ${translationContent}`;
      newFileContent += `\n${partFileContent
        .substr(namespaceCloseIndex)
        .replace(/\n$/, '')}`;

      fileContent = newFileContent;
    } else {
      // namespace no exists
      fileContent = fileContent.replace(/\n$/, '');
      fileContent = `${fileContent},\n${namespaceOpen}`;
      fileContent = `${fileContent}\n  ${translationContent}`;
      fileContent = `${fileContent}\n${namespaceClose}`;
    }
  } else {
    const translationContent = `\n${translationPrefix}${key}": "${translatedString}"`;
    fileContent = `${fileContent.replace(/\n$/, '')},${translationContent}`;
  }
  // Add back parenthesis
  fileContent = `{${fileContent}\n}`;
  writeFileByTarget(target, namespace, fileContent);
};

if (!process.argv[2]) {
  console.error('Please enter namespace');
} else if (!process.argv[3]) {
  console.error('Please enter translation key');
} else if (!process.argv[4]) {
  console.error('Please enter stringInEnglish');
} else {
  const namespace = process.argv[2];
  let translationKey = process.argv[3];
  const stringInEnglish = process.argv[4];
  const client = new TranslationServiceClient({
    projectId: PROJECT_ID,
    keyFilename: KEY_FILENAME
  });
  let innerNamespace = null;
  if (translationKey.includes('$$')) {
    const array = translationKey.split('$$');
    innerNamespace = array[0];
    translationKey = array[1];
  }

  targetLanguages.forEach(target => {
    const fileContent = readFileByTarget(target, namespace);

    const isKeyAlreadyExist = innerNamespace
      ? fileContent.indexOf(`    "${translationKey}":`)
      : fileContent.indexOf(`"${translationKey}":`);

    if (isKeyAlreadyExist !== -1) {
      console.error('translation already exist');
    } else {
      client
        .translateText({
          parent: client.locationPath(PROJECT_ID, 'global'),
          contents: [stringInEnglish],
          mimeType: 'text/plain',
          targetLanguageCode: target
        })
        .then(responses => {
          const { translatedText } = responses[0].translations[0];

          insertTranslationToFileContent(
            namespace,
            innerNamespace,
            target,
            fileContent,
            translationKey,
            translatedText
          );
          console.log(`${stringInEnglish} in ${target} : ${translatedText}`);
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
}
