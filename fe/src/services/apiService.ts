import axios from 'axios';

const apiService = {
  // createProduct: async (productData: any) => {
  //   const response = await axios.post('/api/products', productData);
  //   return response.data;
  // },
  updateProduct: async (token: any, productData: any) => {
    const response = await axios.put(`http://localhost:8080/api/carts/update`, {productData} , {
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào header
      }
    }
    );
    return response.data;
  },
  deleteProduct: async (token: any, variantId: any) => {
    console.log(token);
    console.log(variantId);
    
    const response = await axios.post(`http://localhost:8080/api/carts/remove`, {variantId} ,{
      headers: {
        Authorization: `Bearer ${token}`, // Truyền token vào header
      }
    });
    return response.data;
  },
  // Thêm các thao tác khác nếu cần
};

export default apiService;