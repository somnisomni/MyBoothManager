import { reactive } from "vue";

export interface IGoodsOrderInternal {
  id: number;
  quantity: number;
  price?: number;
}

export type POSOrderListWhat = "goods" | "combination";
export class POSOrderList {
  constructor(readonly list: Record<string, IGoodsOrderInternal & { what: POSOrderListWhat }> = reactive({})) { }

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
  clear() { Object.keys(this.list).forEach(key => delete this.list[key]); }

  /* POS specific methods */
  /***
   * Update (create if not found in order list) quantity of goods or combination in order list
   *
   * @returns updated quantity (0 if deleted)
   * @throws (string) "NotFound" - target is not found in the list
   * @throws (string) "UpperLimitExceeded" - upper limit is exceeded
   */
  updateQuantity(what: POSOrderListWhat, id: number, quantityDelta: number, upperLimit: number = Infinity): number {
    const order = this.get(what, id);

    if(order) {
      // UPDATE
      if(order.quantity + quantityDelta <= upperLimit) {
        order.quantity += quantityDelta;
      } else {
        throw "UpperLimitExceeded";
      }

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
