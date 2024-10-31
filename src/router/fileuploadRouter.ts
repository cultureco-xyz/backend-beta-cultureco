// app/api/get-signed-url/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { Request, Response, Router } from "express";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

let router = Router();

const fileupload = async (req: Request, res: Response): Promise<any> => {
  const { fieldName, fileType, profileid } = await req.body;
  const bucketName = process.env.S3_BUCKET;
  const key = `user/${profileid}/${fieldName}/${uuidv4()}`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    }); // URL expires in 1 hour
    return res.status(200).json({ signedUrl, key });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

router.post("/", fileupload);

export default router;
