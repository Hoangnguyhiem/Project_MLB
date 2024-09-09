import axios from "axios";
import crypto from "crypto";

export const momo = async (req, res) => {
  try {
    // Momo API parameters
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const partnerCode = 'MOMO';
    const orderInfo = 'pay with MoMo';
    const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const requestType = "payWithMethod";
    const amount = '50000';
    const orderId = `${partnerCode}${new Date().getTime()}`;
    const requestId = orderId;
    const extraData = '';
    const paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    const orderGroupId = '';
    const autoCapture = true;
    const lang = 'vi';

    // Signature generation (HMAC SHA256)
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    // Request body to send to MoMo API
    const requestBody = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId,
      signature
    };

    // Axios options for the request
    const options = {
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody
    };

    // Sending the request to MoMo API
    const { data } = await axios(options);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Payment Error: ", error);
    return res.status(500).json({ message: "Payment processing failed", error: error.message });
  }
};
