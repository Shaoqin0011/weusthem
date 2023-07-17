const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  accessKeyId: "AKIAXFYRCWW3YFPXYXC5",
  secretAccessKey: "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",
});

const s3 = new AWS.S3();

function uploadFileToS3(filePath, bucketName, key) {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };

  return s3.upload(params).promise();
}

function downloadFileFromS3(bucketName, key, outputPath) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  return s3
    .getObject(params)
    .promise()
    .then((data) => {
      fs.writeFileSync(outputPath, data.Body);
    });
}

exports.uploadFileToS3 = uploadFileToS3;
exports.downloadFileFromS3 = downloadFileFromS3;