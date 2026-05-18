import {
  DynamoDB,
  DynamoDBClientConfig,
  ScanCommandInput,
  QueryCommandInput,
  GetItemInput,
  PutItemInput,
  DeleteItemInput
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

interface Config {
  region: string;
  credentials: DynamoDBClientConfig['credentials'];
  tableName: string;
  pk: string;
  sk?: string;
}

export class DynamoDBRepository {
  private pk: string;
  private sk?: string;
  private tableName: string;
  private client: DynamoDB;

  constructor(config?: Config) {
    const { pk, sk, tableName, ...options } = config;
    this.client = new DynamoDB({
      apiVersion: '2012-08-10',
      ...options
    });

    this.tableName = tableName;
    this.pk = pk;
    this.sk = sk;
  }

  private getItemKeys(pk: string | number, sk?: string | number) {
    return {
      [this.pk]: pk,
      ...(this.sk && { [this.sk]: sk })
    };
  }

  async all<T>(): Promise<T[]> {
    const scanParams: ScanCommandInput = {
      TableName: this.tableName
    };

    const items: T[] = [];
    const { Items } = await this.client.scan(scanParams);

    items.push(...(Items ?? []).map((item) => <T>unmarshall(item)));

    return items;
  }

  async query<T>(params: QueryCommandInput): Promise<T[] | null> {
    const items = [];
    const { Items } = await this.client.query(params);

    items.push(...(Items ?? []).map((item) => <T>unmarshall(item)));

    return items;
  }

  async get<T>(pk: string | number, sk?: string | number): Promise<T | null> {
    const getParams: GetItemInput = {
      TableName: this.tableName,
      Key: marshall(this.getItemKeys(pk, sk))
    };

    const { Item } = await this.client.getItem(getParams);

    if (!Item) return null;
    return <T>unmarshall(Item);
  }

  async put<T>(item: T): Promise<T> {
    const putParams: PutItemInput = {
      TableName: this.tableName,
      Item: marshall(item, { removeUndefinedValues: true })
    };

    await this.client.putItem(putParams);

    return item;
  }

  async delete(pk: string | number, sk: string | number): Promise<void> {
    const deleteParams: DeleteItemInput = {
      TableName: this.tableName,
      Key: marshall(this.getItemKeys(pk, sk))
    };

    await this.client.deleteItem(deleteParams);
  }
}
