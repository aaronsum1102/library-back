import { DynamoDBRepository } from '../repository/DynamoDBRepository';
import { QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { RemoveResourceInput, LoanResource } from '../generated/graphql';

interface Record extends ResourceData {
  pk: string;
  sk: number;
  'title#createdDate': string;
}

interface ResourceData {
  title: string;
  createdDate: number;
  ebook: boolean;
  available: boolean;
  borrowerId?: string;
  borrower?: Borrower;
  dateBorrowed?: string;
}

interface Borrower {
  name: string;
  phoneNumber: string;
}

interface CreateResourceParams extends Omit<ResourceData, 'createdDate' | 'available'> {
  createdDate?: number;
  available?: boolean;
}

const defaultConfig = {
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_SECRET_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
  },
  tableName: 'library-back-dev-resources',
  pk: 'pk',
  sk: 'sk'
};

class ResourceService {
  private static instance: ResourceService;
  private repository: DynamoDBRepository;

  private constructor() {
    this.repository = new DynamoDBRepository(defaultConfig);
  }

  static getInstance(): ResourceService {
    if (!ResourceService.instance) {
      ResourceService.instance = new ResourceService();
    }

    return ResourceService.instance;
  }

  private getRecordFields(
    title: string,
    createdDate: number
  ): Pick<Record, 'pk' | 'sk' | 'title' | 'createdDate' | 'title#createdDate'> {
    return {
      pk: title,
      sk: createdDate,
      title,
      createdDate,
      'title#createdDate': `${title}#${createdDate}`
    };
  }

  private mapRecordToModel({
    title,
    createdDate,
    ebook,
    available,
    borrowerId,
    borrower,
    dateBorrowed
  }: Record) {
    return {
      title,
      createdDate,
      ebook,
      available,
      borrowerId,
      borrower: {
        ...borrower
      },
      dateBorrowed
    };
  }

  async addResource({
    available = true,
    title,
    createdDate = new Date().getTime(),
    ...data
  }: CreateResourceParams): Promise<ResourceData> {
    const record: Record = {
      ...this.getRecordFields(title, createdDate),
      available,
      ...data
    };

    const result = await this.repository.put(record);
    return this.mapRecordToModel(result);
  }

  async updateResourceDetails({
    title,
    createdDate,
    ...data
  }: ResourceData): Promise<ResourceData> {
    const record: Record = {
      ...this.getRecordFields(title, createdDate),
      ...data
    };

    const result = await this.repository.put(record);
    return this.mapRecordToModel(result);
  }

  async deleteResource({ title, createdDate }: RemoveResourceInput): Promise<boolean> {
    await this.repository.delete(title, createdDate);

    return true;
  }

  async getAllResources(): Promise<ResourceData[]> {
    const resources = await this.repository.all<Record>();

    return resources.map((resource) => this.mapRecordToModel(resource));
  }

  async getResourcesByBorrowerId(borrowerId: string): Promise<LoanResource[]> {
    const params: QueryCommandInput = {
      TableName: defaultConfig.tableName,
      IndexName: 'borrowerId',
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'borrowerId'
      },
      ExpressionAttributeValues: {
        ':id': { S: borrowerId }
      }
    };

    const resources = await this.repository.query<Record>(params);

    return resources.map((resource) => this.mapRecordToModel(resource) as LoanResource);
  }

  async getResource(title: string, createDate: number): Promise<ResourceData> {
    const resource = await this.repository.get<Record>(title, createDate);

    return this.mapRecordToModel(resource);
  }
}

export default ResourceService;
