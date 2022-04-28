import {expect} from 'chai';
import {MetadataResponse} from '../../../src/controllers/v1/utilidades/MetadataResponse';

describe('MetadataResponse', () => {
  it('Metadata de resultados paginados es correcta', () => {
    const sut = new MetadataResponse(0, 100, 3);
    expect(sut.offset).to.equal(0, '-');
    expect(sut.limit).to.equal(100, '-');
    expect(sut.count).to.equal(3, '-');
  });
});
