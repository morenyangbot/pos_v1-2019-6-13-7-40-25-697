'use strict';

const isBarcodeValid = (barcode) => !!loadAllItems().find(item => item.barcode === barcode);

const findItemInDB = (barcode) => {
    return isBarcodeValid(barcode) ? loadAllItems().find(item => item.barcode === barcode) : null
}
