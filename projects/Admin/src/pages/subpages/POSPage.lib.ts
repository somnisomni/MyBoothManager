import type { GoodsAdmin, GoodsCombinationAdmin } from "@/lib/classes";
import type { IGoodsAdmin, IGoodsCombinationAdmin } from "@myboothmanager/common";
import deepClone from "clone-deep";
import { reactive } from "vue";

/* *** ===== INTERNAL ===== *** */
interface IGoodsOrderInternal {
  id: number;
  quantity: number;
  price?: number;
}

type POSOrderListWhat = "goods" | "combination";
type POSOrderListItem = IGoodsOrderInternal & { what: POSOrderListWhat };
class POSOrderList {
  constructor(private readonly list: Record<string, POSOrderListItem> = reactive({})) { }

  private buildKey(what: POSOrderListWhat, id: number): `${POSOrderListWhat}-${number}` { return `${what}-${id}`; }

  /* Basic list methods */
  get(what: POSOrderListWhat, id: number): POSOrderListItem {
    return this.list[this.buildKey(what, id)];
  }

  set(what: POSOrderListWhat, id: number, value: IGoodsOrderInternal): void {
    this.list[this.buildKey(what, id)] = { ...value, what };
  }

  delete(what: POSOrderListWhat, id: number): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.list[this.buildKey(what, id)];
  }

  has(what: POSOrderListWhat, id: number): boolean {
    return this.buildKey(what, id) in this.list;
  }

  keys(what?: POSOrderListWhat): string[] {
    return what ? Object.keys(this.list).filter(key => key.startsWith(what)) : Object.keys(this.list);
  }

  entries(what?: POSOrderListWhat): Array<[string, POSOrderListItem]> {
    return Object.entries(this.list).filter(([ key ]) => this.keys(what).includes(key));
  }

  values(what?: POSOrderListWhat): POSOrderListItem[] {
    return this.entries(what).map(([ , value ]) => value);
  }

  length(what?: POSOrderListWhat): number {
    return this.keys(what).length;
  }

  clear(): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.keys(this.list).forEach(key => delete this.list[key]);
  }

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
      if(order.quantity + quantityDelta > upperLimit) {
        throw "UpperLimitExceeded";
      }

      order.quantity += quantityDelta;

      // Remove if updated quantity is 0 or less
      if(order.quantity <= 0) {
        this.delete(what, id);
      }
    } else {
      // CREATE
      if(quantityDelta <= 0) {
        throw "NoOp";
      } else if(quantityDelta > upperLimit) {
        throw "UpperLimitExceeded";
      }

      this.set(what, id, { id, quantity: quantityDelta });
    }

    return (this.get(what, id)?.quantity) ?? 0;
  }
}

/* *** ===== EXPORTED ===== *** */
export class POSOrderSimulationLayer {
  private readonly _orderList: POSOrderList = new POSOrderList();

  private _goodsListOriginal: Readonly<Record<number, IGoodsAdmin>> = {};
  private _goodsListSimulated: Record<number, IGoodsAdmin> = {};

  private _combinationListOriginal: Readonly<Record<number, IGoodsCombinationAdmin>> = {};
  private _combinationListSimulated: Record<number, IGoodsCombinationAdmin> = {};

  constructor(
    goodsList: Record<number, GoodsAdmin>,
    combinationList: Record<number, GoodsCombinationAdmin>,
  ) {
    this.reset(goodsList, combinationList);
  }

  get orderList(): typeof this._orderList {
    return this._orderList;
  }

  get simulatedGoodsList(): typeof this._goodsListSimulated {
    return this._goodsListSimulated;
  }

  get simulatedCombinationList(): typeof this._combinationListSimulated {
    return this._combinationListSimulated;
  }

  reset(goodsList: Record<number, GoodsAdmin>, combinationList: Record<number, GoodsCombinationAdmin>): void {
    this._orderList.clear();

    const plainGoodsList = Object.fromEntries(Object.entries(goodsList).map(([ id, goods ]) => [ id, goods.toPlainObject() ]));
    const plainCombinationList = Object.fromEntries(Object.entries(combinationList).map(([ id, combination ]) => [ id, combination.toPlainObject() ]));

    this._goodsListOriginal = Object.seal(Object.freeze(deepClone(plainGoodsList)));
    this._goodsListSimulated = deepClone(plainGoodsList);

    this._combinationListOriginal = Object.seal(Object.freeze(deepClone(plainCombinationList)));
    this._combinationListSimulated = deepClone(plainCombinationList);
  }

  getMaxAvailableQuantity(what: POSOrderListWhat, id: number): number {
    const simulatedStockRemainig = what === "combination" ? this._combinationListSimulated[id].stock.remaining : this._goodsListSimulated[id].stock.remaining;
    const order = this._orderList.get(what, id);
    return simulatedStockRemainig + (order?.quantity ?? 0);
  }

  deleteSingleTarget(what: POSOrderListWhat, id: number): void {
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
  handleQuantityUpdate(what: POSOrderListWhat, id: number, quantityDelta: number): void {
    if(what === "combination") {
      if(this._combinationListSimulated[id].stock.remaining - quantityDelta < 0) {
        throw "UpperLimitExceeded";
      }

      const combinedGoods = Object.values(this._goodsListSimulated).filter(goods => goods.combinationId && goods.combinationId === id);
      for(const goods of combinedGoods) {
        if(goods.stock.remaining - quantityDelta < 0) {
          throw "UpperLimitExceeded";
        }
      }

      for(const goods of combinedGoods) {
        goods.stock.remaining -= quantityDelta;
      }
      this._combinationListSimulated[id].stock.remaining -= quantityDelta;
    } else if(what === "goods") {
      const goods = this._goodsListSimulated[id];

      if(goods.stock.remaining - quantityDelta < 0) {
        throw "UpperLimitExceeded";
      }
      goods.stock.remaining -= quantityDelta;

      if(goods.combinationId) {
        const combination = this._combinationListSimulated[goods.combinationId];
        const combinedGoods = Object.values(this._goodsListSimulated).filter(goods => goods.combinationId && goods.combinationId === combination.id);
        combination.stock.remaining = Math.min(...combinedGoods.map(goods => goods.stock.remaining));
      }
    }

    const upperLimit = what === "combination" ? this._combinationListOriginal[id].stock.remaining : this._goodsListOriginal[id].stock.remaining;
    this._orderList.updateQuantity(what, id, quantityDelta, upperLimit);
  }
}

export type { POSOrderList, IGoodsOrderInternal };
