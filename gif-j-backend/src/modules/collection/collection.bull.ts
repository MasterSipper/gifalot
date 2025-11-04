import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { InjectAws } from 'aws-sdk-v3-nest';
import { Job, Queue } from 'bull';

@Processor('collection')
export class CollectionConsumer {
  constructor(
    @InjectAws(S3Client) private readonly s3: S3Client,
    @InjectQueue('collection')
    private readonly collectionQueue: Queue,
  ) {}

  @Process('deleteCollection')
  public async deleteCollection(job: Job<DeleteCollectionData>) {
    const { userId, collectionId, nextToken } = job.data;

    const files = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: `files/${userId}/${collectionId}/`,
        StartAfter: nextToken,
        MaxKeys: 25,
      }),
    );

    await Promise.all(
      (files.Contents ?? []).map((file) =>
        this.s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file.Key,
          }),
        ),
      ),
    );

    if (files.NextContinuationToken?.length) {
      await this.collectionQueue.add(
        'deleteCollection',
        { ...job.data, nextToken: files.NextContinuationToken },
        { delay: 250 },
      );
      return;
    }
  }
}

type DeleteCollectionData = {
  userId: string;
  collectionId: string;
  nextToken?: string;
};
