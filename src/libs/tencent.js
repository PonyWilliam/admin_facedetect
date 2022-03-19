import config from './config.js'
const $ = require('jquery')
const COS = require('cos-js-sdk-v5');
var getAuthorization = function (options, callback) {
    let url = config.url + config.work;
    let xhr = new XMLHttpRequest();
    let data,credentials
    xhr.open('GET', url, true);
    xhr.onload = function (e) {
        try {
            data = JSON.parse(e.target.responseText);
            data = data.Response
            credentials = data.Credentials;
            console.log(data)
        } catch (e) {
        }
        if (!data || !credentials) return console.error('credentials invalid');
        let authorization = COS.getAuthorization({
            SecretId: credentials.TmpSecretId, // 可传固定密钥或者临时密钥
            SecretKey: credentials.TmpSecretKey, // 可传固定密钥或者临时密钥
            Expires: 900,
        });
        callback({
            Authorization: authorization,
            XCosSecurityToken: credentials.Token,
        });
    };
    xhr.send();
}
var cos = new COS({
    getAuthorization: getAuthorization,
    UploadCheckContentMd5: true,
});
export default cos;
