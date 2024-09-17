import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import Order from "../models/order"

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
export const zaloPay = async (req, res) => {
  try {

    const { _id } = req.user;
    const userId = _id.toString()
    const { customer, orderItems, totalAmount } = req.body;
    
    const embed_data = {
      redirecturl: "https://vn.mlb-korea.com"
    };

    const items = orderItems.map((item) => ({
      productId: item.productId._id,
      variantId: item.variantId,
      color: item.color,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      slug: item.slug,
      image: item.images[0]
    }))
    // console.log(items);
    

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: customer.userName,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: totalAmount,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: "",//zalopayapp
      callback_url: "localhost:8080/api/callback"
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const datas = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(datas, config.key1).toString();


    // Tạo đơn hàng mới với trạng thái 'cart'
    const newOrder = new Order({
      userId,
      items,
      customerName: customer.userName,
      totalAmount,
    });

    // console.log(newOrder);
    
    
    await newOrder.save();
    const { data } = await axios.post(config.endpoint, null, { params: order })

    return res.status(200).json(data);
  } catch (error) {
    console.error("Payment Error: ", error);
    return res.status(500).json({ message: "Payment processing failed", error: error.message });
  }
}
export const callBack = async (req, res) => {
  app.post('/callback', (req, res) => {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("mac =", mac);


      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      }
      else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
  });

}