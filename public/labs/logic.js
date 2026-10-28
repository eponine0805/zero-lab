// These functions execute inside the isolated browser target. They are not a remote API.
function createTrainingStore() {
  return {
    invoices: {
      '1001': {id:'1001', owner:'learner', title:'あなたの月額プラン', amount:1200, memo:'ZERO training / self'},
      '1002': {id:'1002', owner:'demo-aya', title:'架空のデザイン制作費', amount:8600, memo:'ZERO{object_authorization}'},
      '1003': {id:'1003', owner:'demo-ren', title:'架空のサポート費', amount:4800, memo:'ZERO{another_object}'}
    },
    catalog: { notebook: {name:'ZERO ノート（架空商品）', price:3200} }, orders:[]
  };
}
function invoiceRequest(store, id, fixed) {
  const invoice = Object.hasOwn(store.invoices,id) ? store.invoices[id] : null;
  if (!invoice) return {status:404,body:{error:'Not found'}};
  if (fixed && invoice.owner !== 'learner') return {status:403,body:{error:'Forbidden: この請求書の所有者ではありません'}};
  return {status:200,body:{...invoice}};
}
function checkoutRequest(store, body, fixed) {
  const product = Object.hasOwn(store.catalog,body.product) ? store.catalog[body.product] : null;
  if (!product || !Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > 10 || !Number.isInteger(body.unitPrice) || body.unitPrice < 0 || body.unitPrice > 1000000) return {status:400,body:{error:'product, quantity (1–10), unitPrice (0–1000000) を確認してください'}};
  const unitPrice = fixed ? product.price : body.unitPrice;
  const order={id:'ORDER-'+(store.orders.length+1),product:body.product,quantity:body.quantity,unitPrice,total:unitPrice*body.quantity};
  store.orders.push(order);
  return {status:201,body:{...order}};
}
if (typeof module !== 'undefined') module.exports={createTrainingStore,invoiceRequest,checkoutRequest};
