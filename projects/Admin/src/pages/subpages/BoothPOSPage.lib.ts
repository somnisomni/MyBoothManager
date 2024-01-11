import type { IGoods, IGoodsCombination } from "@myboothmanager/common";
import { reactive } from "vue";
import deepClone from "clone-deep";

/* *** ===== INTERNAL ===== *** */
interface IGoodsOrderInternal {
  id: number;
  quantity: number;
  price?: number;
}

type POSOrderListWhat = "goods" | "combination";
class POSOrderList {
  constructor(private readonly list: Record<string, IGoodsOrderInternal & { what: POSOrderListWhat }> = reactive({})) { }

  private buildKey(what: POSOrderListWhat, id: number) { return `${what}-${id}`; }

  /* Basic list methods */
  get(what: POSOrderListWhat, id: number) { return this.list[this.buildKey(what, id)]; }
  set(what: POSOrderListWhat, id: number, value: IGoodsOrderInternal) { this.list[this.buildKey(what, id)] = { ...value, what }; }
  delete(what: POSOrderListWhat, id: number) { delete this.list[this.buildKey(what, id)]; }
  has(what: POSOrderListWhat, id: number) { return this.buildKey(what, id) in this.list; }
  keys(what?: POSOrderListWhat) {
    return what ? Object.keys(this.list).filter(key => key.startsWith(what)) : Object.keys(this.list);
  }
  entries(what?: POSOrderListWhat) {
    return Object.entries(this.list).filter(([key]) => this.keys(what).includes(key));
  }
  values(what?: POSOrderListWhat) {
    return this.entries(what).map(([, value]) => value);
  }
  length(what?: POSOrderListWhat) { return this.keys(what).length; }
  clear() { Object.keys(this.list).forEach(key => delete this.list[key]); }

  /* POS specific methods */
  /***
   * Update (create if not found in order list) quantity of goods or combination in order list
   *
   * @returns updated quantity (0 if deleted)
   * @throws (string) `"UpperLimitExceeded"` - upper limit is exceeded
   * @throws (string) `"NoOp"` - nothing manipulated
   */
  updateQuantity(what: POSOrderListWhat, id: number, quantityDelta: number, upperLimit: number = Infinity): number {
    const order = this.get(what, id);

    if(order) {
      // UPDATE
      if(order.quantity + quantityDelta > upperLimit) throw "UpperLimitExceeded";
      order.quantity += quantityDelta;

      // Remove if updated quantity is 0 or less
      if(order.quantity <= 0) {
        this.delete(what, id);
      }
    } else {
      // CREATE
      if(quantityDelta <= 0) throw "NoOp";
      if(quantityDelta > upperLimit) throw "UpperLimitExceeded";

      this.set(what, id, { id, quantity: quantityDelta });
    }

    return (this.get(what, id)?.quantity) ?? 0;
  }
}


/* *** ===== EXPORTED ===== *** */
export class POSOrderSimulationLayer {
  private readonly _orderList: POSOrderList = new POSOrderList();

  private _goodsListOriginal: Record<number, IGoods> = {};
  private _goodsListSimulated: Record<number, IGoods> = {};

  private _combinationListOriginal: Record<number, IGoodsCombination> = {};
  private _combinationListSimulated: Record<number, IGoodsCombination> = {};

  constructor(
    goodsList: Record<number, IGoods>,
    combinationList: Record<number, IGoodsCombination>,
  ) {
    this.reset(goodsList, combinationList);
  }

  get orderList() { return this._orderList; }
  get simulatedGoodsList() { return this._goodsListSimulated; }
  get simulatedCombinationList() { return this._combinationListSimulated; }

  reset(goodsList: Record<number, IGoods>, combinationList: Record<number, IGoodsCombination>) {
    this._orderList.clear();

    this._goodsListOriginal = deepClone(goodsList);
    this._goodsListSimulated = deepClone(goodsList);

    this._combinationListOriginal = deepClone(combinationList);
    this._combinationListSimulated = deepClone(combinationList);
  }

  getMaxAvailableQuantity(what: POSOrderListWhat, id: number) {
    const simulatedStockRemainig = what === "combination" ? this._combinationListSimulated[id].stockRemaining : this._goodsListSimulated[id].stockRemaining;
    const order = this._orderList.get(what, id);
    return simulatedStockRemainig + (order?.quantity ?? 0);
  }

  deleteSingleTarget(what: POSOrderListWhat, id: number) {
    const quantity = this._orderList.get(what, id)?.quantity ?? 0;
    this.handleQuantityUpdate(what, id, -quantity);
  }

  /**
   * Update (create if not found in order list) quantity of goods or combination in order list.
   *
   * Supports goods combination as well.
   *
   * Always wrap this method in `try-catch` block.
   *
   * @throws (string) `"UpperLimitExceeded"` - upper limit is exceeded *(~= can't add quantity delta)*
   * @throws (string) `"NoOp"` - nothing manipulated
   */
  handleQuantityUpdate(what: POSOrderListWhat, id: number, quantityDelta: number) {
    if(what === "combination") {
      if(this._combinationListSimulated[id].stockRemaining - quantityDelta < 0) throw "UpperLimitExceeded";

      const combinedGoods = Object.values(this._goodsListSimulated).filter((goods) => goods.combinationId && goods.combinationId === id);
      for(const goods of combinedGoods) {
        if(goods.stockRemaining - quantityDelta < 0) throw "UpperLimitExceeded";
      }

      for(const goods of combinedGoods) {
        goods.stockRemaining -= quantityDelta;
      }
      this._combinationListSimulated[id].stockRemaining -= quantityDelta;
    } else if(what === "goods") {
      const goods = this._goodsListSimulated[id];

      if(goods.stockRemaining - quantityDelta < 0) throw "UpperLimitExceeded";
      goods.stockRemaining -= quantityDelta;

      if(goods.combinationId) {
        const combination = this._combinationListSimulated[goods.combinationId];
        const combinedGoods = Object.values(this._goodsListSimulated).filter((goods) => goods.combinationId && goods.combinationId === combination.id);
        combination.stockRemaining = Math.min(...combinedGoods.map(goods => goods.stockRemaining));
      }
    }

    const upperLimit = what === "combination" ? this._combinationListOriginal[id].stockRemaining : this._goodsListOriginal[id].stockRemaining;
    this._orderList.updateQuantity(what, id, quantityDelta, upperLimit);
  }
}

export type { IGoodsOrderInternal };
