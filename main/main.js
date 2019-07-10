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
