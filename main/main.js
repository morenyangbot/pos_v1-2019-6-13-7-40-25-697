'use strict';

const isBarcodeValid = (barcode) => !!loadAllItems().find(item => item.barcode === barcode);

const findItemInDB = (barcode) => {
    return isBarcodeValid(barcode) ? loadAllItems().find(item => item.barcode === barcode) : null
}

const splitOriginBarcode = (originBarcode) => {
    const SPLITTER = '-'
    if (originBarcode.includes(SPLITTER)) {
        const [barcode, countString] = originBarcode.split(SPLITTER);
        return { barcode, count: parseFloat(countString) }
    } else {
        return { barcode: originBarcode, count: 1 }
    }
}

const setAndCountItemInSettlementItems = (settlementItems, barcode, count = 1) => {
    const itemSettled = settlementItems.find(item => item.barcode === barcode);
    if (!itemSettled) {
        const itemInDB = findItemInDB(barcode);
        settlementItems.push({
            barcode,
            detail: itemInDB,
            count: itemInDB ? count : undefined,
            originAmount: undefined,
            promotion: undefined,
            discount: undefined,
            amount: undefined,
        })
    } else {
        itemSettled.count += count
    }
}
