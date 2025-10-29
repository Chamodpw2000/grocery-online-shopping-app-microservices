const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart({ _id }) {


    try {

      const cartItems = await this.repository.Cart(_id)
      return FormateData(cartItems)

    } catch (err) {
      throw err
    }
  }



  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;



    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  // get order details

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(customerId, item, qty, isRemove);
      return FormateData(cartResult);


    } catch (err) {
      throw err
    }
  }


  async SubscribeEvents(payload) {
    try {
      // payload may arrive as a string or already-parsed object
      const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;

      // validate shape
      if (!parsed || typeof parsed !== 'object') {
        console.warn('[ShoppingService] Ignoring non-object payload:', payload);
        return;
      }

      const { event, data } = parsed;

      if (!event || !data || typeof data !== 'object') {
        console.warn('[ShoppingService] Ignoring message without event/data:', parsed);
        return;
      }

      const { userId, product, qty } = data;

      switch (event) {
        case 'ADD_TO_CART':
          this.ManageCart(userId, product, qty, false);
          break;
        case 'REMOVE_FROM_CART':
          this.ManageCart(userId, product, qty, true);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('[ShoppingService] Failed to process subscribed message:', err, 'payload:', payload);
      // swallow error so the consumer doesn't crash the service
    }
  }

  async GetOrderPayload(userId, order, event) {

    if (order) {
      const payload = {
        event: event,
        data: {
          userId: userId,
          order: { userId, order }

        }
      }

      return payload;
    } else {
      return FormateData({ error: "Order not found" });
    }
  }









}

module.exports = ShoppingService;
