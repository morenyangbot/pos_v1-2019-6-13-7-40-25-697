'use strict';

describe('pos', () => {

  const LEGAL_BARCODE = 'ITEM000001'
  const ILLEGAL_BARCODE = 'AITEM'
  const LEGAL_ITEM_DETAIL = {
    barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3.00
  }
  const LEGAL_BARCODE_2 = 'ITEM000002'
  const LEGAL_ITEM_DETAIL_2 = {
    barcode: 'ITEM000002',
    name: '苹果',
    unit: '斤',
    price: 5.50
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

  describe('Barcode split check', () => {
    it('should return {barcode: ITEM000001, count: 1} in splitBarcode when call ITEM000001', () => {
      expect(splitOriginBarcode(LEGAL_BARCODE)).toEqual({
        barcode: LEGAL_BARCODE,
        count: 1
      })
    })

    it('should return {barcode: ITEM000001, count: 2} in splitBarcode when call ITEM000001-2', () => {
      expect(splitOriginBarcode(`${LEGAL_BARCODE}-2`)).toEqual({
        barcode: LEGAL_BARCODE,
        count: 2
      })
    })

    it('should return {barcode: ITEM000001, count: 2.5} in splitBarcode when call ITEM000001-2.5', () => {
      expect(splitOriginBarcode(`${LEGAL_BARCODE}-2.5`)).toEqual({
        barcode: LEGAL_BARCODE,
        count: 2.5
      })
    })
  })

  describe('Item counts & amount calculating check', () => {
    it('should return settlement item info in setAndCountItemInSettlementItems when call [], ITEM000001, 1', () => {
      const settlementItems = []
      setAndCountItemInSettlementItems(settlementItems, LEGAL_BARCODE, 1)
      expect(settlementItems).toEqual([{
        barcode: LEGAL_BARCODE,
        detail: LEGAL_ITEM_DETAIL,
        count: 1,
        originAmount: undefined,
        promotion: undefined,
        discount: undefined,
        amount: undefined
      }])
    })

    it('should add count in settlement item info in setAndCountItemInSettlementItems when enter an existing item', () => {
      const settlementItems = []
      setAndCountItemInSettlementItems(settlementItems, LEGAL_BARCODE, 1)
      setAndCountItemInSettlementItems(settlementItems, LEGAL_BARCODE, 2.5)
      expect(settlementItems).toEqual([{
        barcode: LEGAL_BARCODE,
        detail: LEGAL_ITEM_DETAIL,
        count: 3.5,
        originAmount: undefined,
        promotion: undefined,
        discount: undefined,
        amount: undefined
      }])
    })

    it('should push a new settled item in setAndCountItemInSettlementItems when enter a new item', () => {
      const settlementItems = []
      setAndCountItemInSettlementItems(settlementItems, LEGAL_BARCODE, 1)
      setAndCountItemInSettlementItems(settlementItems, LEGAL_BARCODE_2, 1.5)
      expect(settlementItems).toEqual([{
        barcode: LEGAL_BARCODE,
        detail: LEGAL_ITEM_DETAIL,
        count: 1,
        originAmount: undefined,
        promotion: undefined,
        discount: undefined,
        amount: undefined
      }, {
        barcode: LEGAL_BARCODE_2,
        detail: LEGAL_ITEM_DETAIL_2,
        count: 1.5,
        originAmount: undefined,
        promotion: undefined,
        discount: undefined,
        amount: undefined
      }])
    })

    it('should push null in detail of settled item in setAndCountItemInSettlementItems when enter a illegal barcode', () => {
      const settlementItems = []
      setAndCountItemInSettlementItems(settlementItems, ILLEGAL_BARCODE, 1)
      expect(settlementItems).toEqual([{
        barcode: ILLEGAL_BARCODE,
        detail: null,
        count: undefined,
        originAmount: undefined,
        promotion: undefined,
        discount: undefined,
        amount: undefined
      }])
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
