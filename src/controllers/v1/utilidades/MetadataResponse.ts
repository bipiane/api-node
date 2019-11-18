export class MetadataResponse {
  offset: number;
  limit: number;
  count: number;

  constructor(offset: number, limit: number, count: number) {
    this.offset = offset;
    this.limit = limit;
    this.count = count;
  }
}
