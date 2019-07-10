'use strict';

describe('pos', () => {

  const LEGAL_BARCODE = 'ITEM000001';
  const ILLEGAL_BARCODE = 'AITEM'
  const LEGAL_ITEM_DETAIL = {
    barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3.00
  }

  describe('Barcode verify check', () => {
    it('should return true in isBarcodeValid when call ITEM000001', () => {
      expect(isBarcodeValid(LEGAL_BARCODE)).toBe(true)
    })

    it('should return false in isBarcodeValid when call AITEM', () => {
      expect(isBarcodeValid(ILLEGAL_BARCODE)).toBe(false)
    })
  })

  describe('Find item in database check', () => {
    it('should return item detail in findItemInDataBase when call ITEM000001', () => {
      expect(findItemInDB(LEGAL_BARCODE)).toEqual(LEGAL_ITEM_DETAIL)
    })

    it('should return item detail in findItemInDataBase when call AITEM', () => {
      expect(findItemInDB(ILLEGAL_BARCODE)).toEqual(null)
    })
  })

  // it('should print text', () => {

  //   const tags = [
  //     'ITEM000001',
  //     'ITEM000001',
  //     'ITEM000001',
  //     'ITEM000001',
  //     'ITEM000001',
  //     'ITEM000003-2.5',
  //     'ITEM000005',
  //     'ITEM000005-2',
  //   ];

  //   spyOn(console, 'log');

  //   printReceipt(tags);

  //   const expectText = `***<没钱赚商店>收据***` +
  //     `名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)` +
  //     `名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)` +
  //     `名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)` +
  //     `----------------------` +
  //     `总计：58.50(元)` +
  //     `节省：7.50(元)` +
  //     `**********************`;

  //   expect(console.log).toHaveBeenCalledWith(expectText);
  // });
});
