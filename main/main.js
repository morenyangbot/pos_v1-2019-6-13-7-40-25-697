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
            promotions: undefined,
            discount: undefined,
            amount: undefined,
        })
    } else {
        itemSettled.count += count
    }
}

const calculateAmountInSettlementItems = (settlementItems) => {
    settlementItems.forEach(item => item.detail && (item.originAmount = item.count * item.detail.price))
}

const findPromotionsByBarcode = (barcode) => loadPromotions()
    .filter(promotion => promotion.barcodes.includes(barcode))
    .map(promotion => promotion.type)

const calculatePromotions = (settlementItems) => {
    settlementItems.forEach(item => {
        item.detail && (item.promotions = findPromotionsByBarcode(item.barcode))
    })
    settlementItems.forEach(item => {
        if (item.promotions && item.promotions[0] === 'BUY_TWO_GET_ONE_FREE') {
            const discountAmount = parseInt(item.count / 2);
            item.discount = discountAmount * item.detail.price
            item.amount = item.originAmount - item.discount
        } else {
            item.amount = item.originAmount
        }
    })
}

const calculateTotalAmountAndDiscount = (settlementItems) => {
    let amount = 0;
    let discount = 0;
    settlementItems.forEach(item => {
        if (!item.detail) return
        amount += item.amount;
        item.discount && (discount += item.discount)
    })
    return { amount, discount }
}
