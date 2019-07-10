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

const createReceiptText = ({ settlementItems, amount, discount }) => {
    let errorMsg = '';
    let receiptText = '***<没钱赚商店>收据***\n';
    settlementItems.forEach(item => {
        if (item.detail) {
            receiptText += `名称：${item.detail.name}，数量：${item.count}${item.detail.unit}，单价：${item.detail.price.toFixed(2)}(元)，小计：${item.amount.toFixed(2)}(元)\n`
        } else {
            errorMsg += `[Error]: Barcode ${item.barcode} is illeagal.\n`
        }
    })
    receiptText += `----------------------\n总计：${amount.toFixed(2)}(元)\n节省：${discount.toFixed(2)}(元)\n**********************`
    return errorMsg + receiptText
}

const printReceipt = (items) => {
    const settlementItems = [];
    items.forEach(originBarcode => {
        const {barcode, count} = splitOriginBarcode(originBarcode)
        setAndCountItemInSettlementItems(settlementItems, barcode, count)
    });
    calculateAmountInSettlementItems(settlementItems)
    calculatePromotions(settlementItems)
    console.log(createReceiptText(
        { settlementItems, ...calculateTotalAmountAndDiscount(settlementItems) }
    ))
}
